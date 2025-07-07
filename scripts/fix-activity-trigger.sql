-- Create a safer version of log_crm_activity that handles missing columns

CREATE OR REPLACE FUNCTION log_crm_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_company_id UUID;
    v_record JSONB;
BEGIN
    -- Convert record to JSONB for safe access
    IF TG_OP IN ('INSERT', 'UPDATE') THEN
        v_record := to_jsonb(NEW);
    ELSE
        v_record := to_jsonb(OLD);
    END IF;

    -- Determine user_id based on available fields
    IF TG_OP = 'INSERT' THEN
        -- Try to get user_id from various possible fields
        IF v_record ? 'created_by' THEN
            v_user_id := (v_record->>'created_by')::UUID;
        ELSIF v_record ? 'user_id' THEN
            v_user_id := (v_record->>'user_id')::UUID;
        ELSIF v_record ? 'owner_id' THEN
            v_user_id := (v_record->>'owner_id')::UUID;
        ELSE
            v_user_id := auth.uid();
        END IF;

        -- Get company_id if available
        IF TG_TABLE_NAME = 'company' THEN
            v_company_id := (v_record->>'id')::UUID;
        ELSIF v_record ? 'company_id' THEN
            v_company_id := (v_record->>'company_id')::UUID;
        ELSE
            v_company_id := NULL;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type, 
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, (v_record->>'id')::UUID, 'created',
            v_user_id,
            v_company_id,
            v_record
        );
    
    -- Log updates
    ELSIF TG_OP = 'UPDATE' THEN
        -- Get company_id if available
        IF TG_TABLE_NAME = 'company' THEN
            v_company_id := (v_record->>'id')::UUID;
        ELSIF v_record ? 'company_id' THEN
            v_company_id := (v_record->>'company_id')::UUID;
        ELSE
            v_company_id := NULL;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, (v_record->>'id')::UUID, 'updated',
            auth.uid(),
            v_company_id,
            jsonb_build_object(
                'old', to_jsonb(OLD),
                'new', to_jsonb(NEW)
            )
        );
    
    -- Log deletes
    ELSIF TG_OP = 'DELETE' THEN
        -- Get company_id if available
        IF TG_TABLE_NAME = 'company' THEN
            v_company_id := (v_record->>'id')::UUID;
        ELSIF v_record ? 'company_id' THEN
            v_company_id := (v_record->>'company_id')::UUID;
        ELSE
            v_company_id := NULL;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, (v_record->>'id')::UUID, 'deleted',
            auth.uid(),
            v_company_id,
            v_record
        );
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
