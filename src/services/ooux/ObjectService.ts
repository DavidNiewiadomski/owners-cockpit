/**
 * Object Service - Core OOUX Service Layer
 * 
 * This service provides unified management for all objects in the system,
 * ensuring consistent CRUD operations, relationship management, and action handling
 * across all object types.
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  ObjectId,
  ProjectObject,
  CommunicationObject,
  DocumentObject,
  ActionItemObject,
  UserObject,
  ObjectSearchParams,
  ObjectSearchResult} from '@/types/objects';
import {
  ObjectAction,
  BaseObject
} from '@/types/objects';

export type AnyObject = ProjectObject | CommunicationObject | DocumentObject | ActionItemObject | UserObject;

export interface ObjectServiceConfig {
  enableCache: boolean;
  cacheTimeout: number;
  enableOptimisticUpdates: boolean;
  enableRealTimeSync: boolean;
}

/**
 * Core Object Service Implementation
 */
export class ObjectService {
  private cache = new Map<string, { data: AnyObject; timestamp: number }>();
  private config: ObjectServiceConfig;
  private subscriptions = new Map<string, any>();

  constructor(config: Partial<ObjectServiceConfig> = {}) {
    this.config = {
      enableCache: true,
      cacheTimeout: 5 * 60 * 1000, // 5 minutes
      enableOptimisticUpdates: true,
      enableRealTimeSync: true,
      ...config
    };
  }

  // ========================================
  // CORE CRUD OPERATIONS
  // ========================================

  /**
   * Get object by ID with unified interface
   */
  async getObject<T extends AnyObject>(
    objectType: string,
    id: ObjectId,
    options: { useCache?: boolean; includeRelated?: boolean } = {}
  ): Promise<T | null> {
    const cacheKey = `${objectType}:${id}`;
    
    // Check cache first
    if (options.useCache && this.config.enableCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
        return cached.data as T;
      }
    }

    try {
      const { data, error } = await supabase
        .from(this.getTableName(objectType))
        .select(this.getSelectClause(objectType, options.includeRelated))
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      const object = await this.transformFromDatabase(objectType, data);
      
      // Cache the result
      if (this.config.enableCache) {
        this.cache.set(cacheKey, { data: object, timestamp: Date.now() });
      }

      return object as T;
    } catch (error) {
      console.error(`Error fetching ${objectType}:`, error);
      throw error;
    }
  }

  /**
   * List objects with filtering and pagination
   */
  async listObjects<T extends AnyObject>(
    objectType: string,
    params: ObjectSearchParams = {}
  ): Promise<{ objects: T[]; total: number }> {
    try {
      let query = supabase
        .from(this.getTableName(objectType))
        .select(this.getSelectClause(objectType), { count: 'exact' });

      // Apply filters
      query = this.applyFilters(query, params);

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const objects = await Promise.all(
        (data || []).map(item => this.transformFromDatabase(objectType, item))
      );

      return {
        objects: objects as T[],
        total: count || 0
      };
    } catch (error) {
      console.error(`Error listing ${objectType}:`, error);
      throw error;
    }
  }

  /**
   * Create new object
   */
  async createObject<T extends AnyObject>(
    objectType: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const transformedData = await this.transformToDatabase(objectType, data);
      
      const { data: created, error } = await supabase
        .from(this.getTableName(objectType))
        .insert(transformedData)
        .select()
        .single();

      if (error) throw error;

      const object = await this.transformFromDatabase(objectType, created);
      
      // Invalidate related caches
      this.invalidateRelatedCaches(objectType, object.id);
      
      // Emit creation event
      this.emitObjectEvent('created', objectType, object);

      return object as T;
    } catch (error) {
      console.error(`Error creating ${objectType}:`, error);
      throw error;
    }
  }

  /**
   * Update existing object
   */
  async updateObject<T extends AnyObject>(
    objectType: string,
    id: ObjectId,
    updates: Partial<T>
  ): Promise<T> {
    try {
      // Optimistic update
      if (this.config.enableOptimisticUpdates) {
        this.updateCache(objectType, id, updates);
      }

      const transformedUpdates = await this.transformToDatabase(objectType, updates);
      
      const { data: updated, error } = await supabase
        .from(this.getTableName(objectType))
        .update({
          ...transformedUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Rollback optimistic update on error
        if (this.config.enableOptimisticUpdates) {
          this.invalidateCache(objectType, id);
        }
        throw error;
      }

      const object = await this.transformFromDatabase(objectType, updated);
      
      // Update cache with real data
      this.updateCache(objectType, id, object);
      
      // Emit update event
      this.emitObjectEvent('updated', objectType, object);

      return object as T;
    } catch (error) {
      console.error(`Error updating ${objectType}:`, error);
      throw error;
    }
  }

  /**
   * Delete object
   */
  async deleteObject(objectType: string, id: ObjectId): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.getTableName(objectType))
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from cache
      this.invalidateCache(objectType, id);
      this.invalidateRelatedCaches(objectType, id);
      
      // Emit deletion event
      this.emitObjectEvent('deleted', objectType, { id } as any);
    } catch (error) {
      console.error(`Error deleting ${objectType}:`, error);
      throw error;
    }
  }

  // ========================================
  // RELATIONSHIP MANAGEMENT
  // ========================================

  /**
   * Get related objects for a given object
   */
  async getRelatedObjects(
    sourceType: string,
    sourceId: ObjectId,
    relationshipType: string
  ): Promise<AnyObject[]> {
    try {
      const relationships = await this.getObjectRelationships(sourceType, sourceId);
      const related = relationships[relationshipType] || [];
      
      if (related.length === 0) return [];

      // Group by object type to batch fetch
      const groupedByType = related.reduce((acc, ref) => {
        if (!acc[ref.type]) acc[ref.type] = [];
        acc[ref.type].push(ref.id);
        return acc;
      }, {} as Record<string, ObjectId[]>);

      const results: AnyObject[] = [];
      
      for (const [objectType, ids] of Object.entries(groupedByType)) {
        const { objects } = await this.listObjects(objectType, {
          // Note: This would need a proper "in" filter implementation
          query: `id:in:(${ids.join(',')})`
        });
        results.push(...objects);
      }

      return results;
    } catch (error) {
      console.error('Error fetching related objects:', error);
      throw error;
    }
  }

  /**
   * Create relationship between objects
   */
  async createRelationship(
    sourceType: string,
    sourceId: ObjectId,
    targetType: string,
    targetId: ObjectId,
    relationshipType: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('object_relationships')
        .insert({
          source_type: sourceType,
          source_id: sourceId,
          target_type: targetType,
          target_id: targetId,
          relationship_type: relationshipType,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Invalidate caches for both objects
      this.invalidateCache(sourceType, sourceId);
      this.invalidateCache(targetType, targetId);
    } catch (error) {
      console.error('Error creating relationship:', error);
      throw error;
    }
  }

  /**
   * Remove relationship between objects
   */
  async removeRelationship(
    sourceType: string,
    sourceId: ObjectId,
    targetType: string,
    targetId: ObjectId,
    relationshipType: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('object_relationships')
        .delete()
        .eq('source_type', sourceType)
        .eq('source_id', sourceId)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .eq('relationship_type', relationshipType);

      if (error) throw error;

      // Invalidate caches for both objects
      this.invalidateCache(sourceType, sourceId);
      this.invalidateCache(targetType, targetId);
    } catch (error) {
      console.error('Error removing relationship:', error);
      throw error;
    }
  }

  // ========================================
  // SEARCH AND FILTERING
  // ========================================

  /**
   * Universal search across all object types
   */
  async searchObjects(params: ObjectSearchParams): Promise<ObjectSearchResult> {
    try {
      // Use Supabase full-text search or custom search endpoint
      const { data, error } = await supabase.functions.invoke('search-objects', {
        body: params
      });

      if (error) throw error;

      return {
        objects: data.objects || [],
        total_count: data.total_count || 0,
        facets: data.facets || {}
      };
    } catch (error) {
      console.error('Error searching objects:', error);
      throw error;
    }
  }

  // ========================================
  // ACTION EXECUTION
  // ========================================

  /**
   * Execute object action
   */
  async executeAction(
    objectType: string,
    objectId: ObjectId,
    actionId: string,
    params?: Record<string, any>
  ): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('execute-object-action', {
        body: {
          object_type: objectType,
          object_id: objectId,
          action_id: actionId,
          params: params || {}
        }
      });

      if (error) throw error;

      // Invalidate cache after action execution
      this.invalidateCache(objectType, objectId);
      
      return data;
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  // ========================================
  // REAL-TIME SUBSCRIPTIONS
  // ========================================

  /**
   * Subscribe to object changes
   */
  subscribeToObject(
    objectType: string,
    objectId: ObjectId,
    callback: (event: string, object: AnyObject) => void
  ): () => void {
    if (!this.config.enableRealTimeSync) {
      return () => {};
    }

    const subscriptionKey = `${objectType}:${objectId}`;
    
    const subscription = supabase
      .channel(`object-${subscriptionKey}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.getTableName(objectType),
          filter: `id=eq.${objectId}`
        },
        async (payload) => {
          const event = payload.eventType;
          const object = await this.transformFromDatabase(objectType, payload.new);
          
          // Update cache
          if (event === 'DELETE') {
            this.invalidateCache(objectType, objectId);
          } else {
            this.updateCache(objectType, objectId, object);
          }
          
          callback(event, object);
        }
      )
      .subscribe();

    this.subscriptions.set(subscriptionKey, subscription);

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    };
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private getTableName(objectType: string): string {
    const tableMap: Record<string, string> = {
      project: 'projects',
      communication: 'communications',
      document: 'documents',
      action_item: 'action_items',
      user: 'users'
    };
    
    return tableMap[objectType] || objectType;
  }

  private getSelectClause(objectType: string, includeRelated = false): string {
    const baseFields = '*';
    
    if (!includeRelated) return baseFields;
    
    // Add related fields based on object type
    const relatedFields: Record<string, string> = {
      project: `${baseFields}, communications(*), documents(*), action_items(*)`,
      communication: `${baseFields}, related_documents(*), related_action_items(*)`,
      document: `${baseFields}, uploaded_by(*), approved_by(*)`,
      action_item: `${baseFields}, assigned_to(*), assigned_by(*), related_communications(*), related_documents(*)`
    };
    
    return relatedFields[objectType] || baseFields;
  }

  private applyFilters(query: any, params: ObjectSearchParams): any {
    if (params.query) {
      // This would need proper full-text search implementation
      query = query.textSearch('title', params.query);
    }
    
    if (params.project_id) {
      query = query.eq('project_id', params.project_id);
    }
    
    if (params.status && params.status.length > 0) {
      query = query.in('status', params.status);
    }
    
    if (params.assigned_to) {
      query = query.eq('assigned_to', params.assigned_to);
    }
    
    if (params.created_after) {
      query = query.gte('created_at', params.created_after);
    }
    
    if (params.created_before) {
      query = query.lte('created_at', params.created_before);
    }
    
    return query;
  }

  private async transformFromDatabase(objectType: string, data: any): Promise<AnyObject> {
    // Transform database row to object with actions
    const baseObject = {
      ...data,
      actions: await this.generateObjectActions(objectType, data)
    };
    
    return baseObject;
  }

  private async transformToDatabase(objectType: string, object: any): Promise<any> {
    // Remove actions and other computed fields before saving
    const { actions, ...dbData } = object;
    
    // Add timestamps
    if (!dbData.created_at) {
      dbData.created_at = new Date().toISOString();
    }
    dbData.updated_at = new Date().toISOString();
    
    return dbData;
  }

  private async generateObjectActions(objectType: string, object: any): Promise<any> {
    // This would generate the appropriate actions based on object type and user permissions
    // For now, return empty actions - this will be implemented in the UI layer
    return {};
  }

  private async getObjectRelationships(objectType: string, objectId: ObjectId): Promise<Record<string, any[]>> {
    try {
      const { data, error } = await supabase
        .from('object_relationships')
        .select('*')
        .or(`source_id.eq.${objectId},target_id.eq.${objectId}`);

      if (error) throw error;

      const relationships: Record<string, any[]> = {};
      
      for (const rel of data || []) {
        const isSource = rel.source_id === objectId;
        const relatedType = isSource ? rel.target_type : rel.source_type;
        const relatedId = isSource ? rel.target_id : rel.source_id;
        
        if (!relationships[rel.relationship_type]) {
          relationships[rel.relationship_type] = [];
        }
        
        relationships[rel.relationship_type].push({
          type: relatedType,
          id: relatedId
        });
      }
      
      return relationships;
    } catch (error) {
      console.error('Error fetching relationships:', error);
      return {};
    }
  }

  private updateCache(objectType: string, id: ObjectId, updates: Partial<AnyObject>): void {
    const cacheKey = `${objectType}:${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      cached.data = { ...cached.data, ...updates };
      cached.timestamp = Date.now();
    }
  }

  private invalidateCache(objectType: string, id: ObjectId): void {
    const cacheKey = `${objectType}:${id}`;
    this.cache.delete(cacheKey);
  }

  private invalidateRelatedCaches(objectType: string, id: ObjectId): void {
    // This would invalidate caches for related objects
    // Implementation depends on specific relationship patterns
  }

  private emitObjectEvent(event: string, objectType: string, object: AnyObject): void {
    // Emit events for UI updates, analytics, etc.
    const customEvent = new CustomEvent(`object:${event}`, {
      detail: { objectType, object }
    });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(customEvent);
    }
  }
}

// Export singleton instance
export const objectService = new ObjectService();
