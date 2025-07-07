-- Fix the log_crm_activity trigger to handle tables without created_by field

CREATE OR REPLACE FUNCTION log_crm_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_company_id UUID;
BEGIN
    -- Determine user_id based on available fields
    IF TG_OP = 'INSERT' THEN
        -- Try to get user_id from various possible fields
        IF TG_TABLE_NAME = 'crm_tasks' AND NEW.created_by IS NOT NULL THEN
            v_user_id := NEW.created_by;
        ELSIF TG_TABLE_NAME = 'interaction' AND NEW.user_id IS NOT NULL THEN
            v_user_id := NEW.user_id;
        ELSIF TG_TABLE_NAME = 'opportunity' AND NEW.owner_id IS NOT NULL THEN
            v_user_id := NEW.owner_id;
        ELSE
            v_user_id := auth.uid();
        END IF;

        -- Get company_id if available
        IF TG_TABLE_NAME IN ('company') THEN
            v_company_id := NEW.id;
        ELSE
            -- Try to get company_id from the record
            BEGIN
                v_company_id := NEW.company_id;
            EXCEPTION WHEN undefined_column THEN
                v_company_id := NULL;
            END;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type, 
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'created',
            v_user_id,
            v_company_id,
            to_jsonb(NEW)
        );
    
    -- Log updates
    ELSIF TG_OP = 'UPDATE' THEN
        -- Get company_id if available
        IF TG_TABLE_NAME IN ('company') THEN
            v_company_id := NEW.id;
        ELSE
            BEGIN
                v_company_id := NEW.company_id;
            EXCEPTION WHEN undefined_column THEN
                v_company_id := NULL;
            END;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, NEW.id, 'updated',
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
        IF TG_TABLE_NAME IN ('company') THEN
            v_company_id := OLD.id;
        ELSE
            BEGIN
                v_company_id := OLD.company_id;
            EXCEPTION WHEN undefined_column THEN
                v_company_id := NULL;
            END;
        END IF;

        INSERT INTO crm_activities (
            entity_type, entity_id, activity_type,
            user_id, company_id, changes
        ) VALUES (
            TG_TABLE_NAME, OLD.id, 'deleted',
            auth.uid(),
            v_company_id,
            to_jsonb(OLD)
        );
        RETURN OLD;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
