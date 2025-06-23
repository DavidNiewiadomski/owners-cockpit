
-- Projects table (root entity)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planning',
    source TEXT,
    external_id TEXT,
    start_date DATE,
    end_date DATE,
    owner_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'not_started',
    priority INTEGER DEFAULT 1,
    assigned_to VARCHAR(255),
    due_date DATE,
    source TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budget items table
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    description TEXT,
    budgeted_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2) DEFAULT 0,
    source TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFI (Request for Information) table
CREATE TABLE rfi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status rfi_status DEFAULT 'open',
    submitted_by VARCHAR(255),
    assigned_to VARCHAR(255),
    due_date DATE,
    source TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_path TEXT,
    file_size INTEGER,
    mime_type VARCHAR(100),
    doc_type document_type DEFAULT 'other',
    processed BOOLEAN DEFAULT FALSE,
    source TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table (separate from documents for better organization)
CREATE TABLE images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    title VARCHAR(255),
    file_path TEXT NOT NULL,
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    ocr_text TEXT,
    processed BOOLEAN DEFAULT FALSE,
    source TEXT,
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector index for RAG embeddings
CREATE TABLE vector_index (
    chunk_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    doc_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    image_id UUID REFERENCES images(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT vector_index_source_check CHECK (doc_id IS NOT NULL OR image_id IS NOT NULL)
);

-- Indexes for performance
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_budget_project ON budget_items(project_id);
CREATE INDEX idx_rfi_project ON rfi(project_id);
CREATE INDEX idx_rfi_status ON rfi(status);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_images_project ON images(project_id);
CREATE INDEX idx_images_document ON images(document_id);
CREATE INDEX idx_vector_project ON vector_index(project_id);
CREATE INDEX idx_vector_doc ON vector_index(doc_id);
CREATE INDEX idx_vector_image ON vector_index(image_id);

-- HNSW index for vector similarity search
CREATE INDEX idx_vector_embedding ON vector_index USING hnsw (embedding vector_cosine_ops);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfi_updated_at BEFORE UPDATE ON rfi FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vector_index_updated_at BEFORE UPDATE ON vector_index FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) setup
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfi ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_index ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (project-based access)
CREATE POLICY "Users can view their own projects" ON projects FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can view project tasks" ON tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project tasks" ON tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = tasks.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project budget" ON budget_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project budget" ON budget_items FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = budget_items.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project RFIs" ON rfi FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = rfi.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project RFIs" ON rfi FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = rfi.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project documents" ON documents FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project documents" ON documents FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = documents.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project images" ON images FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = images.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project images" ON images FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = images.project_id AND projects.owner_id = auth.uid())
);

CREATE POLICY "Users can view project vectors" ON vector_index FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = vector_index.project_id AND projects.owner_id = auth.uid())
);
CREATE POLICY "Users can modify project vectors" ON vector_index FOR ALL USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = vector_index.project_id AND projects.owner_id = auth.uid())
);
