/**
 * Universal Object Search Component
 * 
 * Provides unified search functionality across all object types.
 * Features:
 * - Cross-object search with intelligent ranking
 * - Advanced filtering by object type, status, dates, etc.
 * - Search result grouping by object type
 * - Search history and saved searches
 * - Real-time search suggestions
 * - Faceted search with counts
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Search,
  Filter,
  X,
  History,
  Star,
  Building2,
  MessageSquare,
  FileText,
  CheckCircle2,
  Users,
  Calendar,
  Tag,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AnyObject,
  ObjectSearchParams,
  ObjectSearchResult,
  ProjectObject,
  CommunicationObject,
  DocumentObject,
  ActionItemObject,
  UserObject
} from '@/types/objects';
import { objectService } from '@/services/ooux/ObjectService';
import ObjectCard from './ObjectCard';

interface ObjectSearchProps {
  onResultClick?: (object: AnyObject) => void;
  onSearchChange?: (params: ObjectSearchParams) => void;
  initialFilters?: Partial<ObjectSearchParams>;
  showFilters?: boolean;
  showHistory?: boolean;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'saved' | 'suggestion';
  params?: ObjectSearchParams;
}

interface ObjectTypeFacet {
  type: string;
  label: string;
  icon: React.ReactNode;
  count: number;
  enabled: boolean;
}

const ObjectSearch: React.FC<ObjectSearchProps> = ({
  onResultClick,
  onSearchChange,
  initialFilters = {},
  showFilters = true,
  showHistory = true,
  placeholder = "Search projects, communications, documents, and more...",
  className
}) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [searchParams, setSearchParams] = useState<ObjectSearchParams>(initialFilters);
  const [searchResults, setSearchResults] = useState<ObjectSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [savedSearches, setSavedSearches] = useState<SearchSuggestion[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [objectTypeFacets, setObjectTypeFacets] = useState<ObjectTypeFacet[]>([
    { type: 'project', label: 'Projects', icon: <Building2 className="h-4 w-4" />, count: 0, enabled: true },
    { type: 'communication', label: 'Communications', icon: <MessageSquare className="h-4 w-4" />, count: 0, enabled: true },
    { type: 'document', label: 'Documents', icon: <FileText className="h-4 w-4" />, count: 0, enabled: true },
    { type: 'action_item', label: 'Tasks', icon: <CheckCircle2 className="h-4 w-4" />, count: 0, enabled: true },
    { type: 'user', label: 'People', icon: <Users className="h-4 w-4" />, count: 0, enabled: true }
  ]);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Execute search when debounced query or params change
  useEffect(() => {
    if (debouncedSearchQuery || Object.keys(searchParams).length > 1) {
      executeSearch();
    } else {
      setSearchResults(null);
    }
  }, [debouncedSearchQuery, searchParams]);

  // Load search history and suggestions on mount
  useEffect(() => {
    loadSearchHistory();
    loadSavedSearches();
  }, []);

  const executeSearch = async () => {
    setIsLoading(true);
    try {
      const params: ObjectSearchParams = {
        ...searchParams,
        query: debouncedSearchQuery,
        object_types: objectTypeFacets.filter(f => f.enabled).map(f => f.type),
        limit: 50
      };

      const results = await objectService.searchObjects(params);
      setSearchResults(results);
      
      // Update facet counts
      updateFacetCounts(results);

      // Save to recent searches if this is a meaningful search
      if (debouncedSearchQuery.trim().length > 2) {
        saveToRecentSearches(params);
      }

      onSearchChange?.(params);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFacetCounts = (results: ObjectSearchResult) => {
    if (!results.facets) return;

    setObjectTypeFacets(prev => prev.map(facet => ({
      ...facet,
      count: results.facets?.[facet.type] || 0
    })));
  };

  const saveToRecentSearches = (params: ObjectSearchParams) => {
    const newSearch: SearchSuggestion = {
      id: Date.now().toString(),
      text: params.query || '',
      type: 'recent',
      params
    };

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.text !== newSearch.text);
      return [newSearch, ...filtered].slice(0, 10);
    });
  };

  const loadSearchHistory = () => {
    // Load from localStorage or API
    const history = localStorage.getItem('objectSearchHistory');
    if (history) {
      try {
        setRecentSearches(JSON.parse(history));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  };

  const loadSavedSearches = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('savedObjectSearches');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved searches:', error);
      }
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.params) {
      setSearchQuery(suggestion.params.query || '');
      setSearchParams(suggestion.params);
    } else {
      setSearchQuery(suggestion.text);
    }
    setShowSuggestions(false);
  };

  const handleFilterChange = (key: keyof ObjectSearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleObjectTypeToggle = (type: string) => {
    setObjectTypeFacets(prev => prev.map(facet => 
      facet.type === type ? { ...facet, enabled: !facet.enabled } : facet
    ));
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchQuery('');
    setObjectTypeFacets(prev => prev.map(f => ({ ...f, enabled: true })));
  };

  const groupedResults = useMemo(() => {
    if (!searchResults?.objects) return {};
    
    return searchResults.objects.reduce((groups, obj) => {
      const type = obj.id.split('_')[0];
      if (!groups[type]) groups[type] = [];
      groups[type].push(obj);
      return groups;
    }, {} as Record<string, AnyObject[]>);
  }, [searchResults]);

  const hasFilters = Object.keys(searchParams).length > 0 || searchQuery.length > 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-24"
          />
          
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {showFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={cn(
                  'h-7 px-2',
                  showAdvancedFilters && 'bg-muted'
                )}
              >
                <SlidersHorizontal className="h-3 w-3" />
              </Button>
            )}
            
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && showHistory && (recentSearches.length > 0 || savedSearches.length > 0) && (
          <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-hidden">
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {recentSearches.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                      <History className="h-3 w-3" />
                      Recent Searches
                    </div>
                    {recentSearches.slice(0, 5).map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}

                {savedSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                      <Star className="h-3 w-3" />
                      Saved Searches
                    </div>
                    {savedSearches.slice(0, 3).map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>

      {/* Object Type Filters */}
      <div className="flex flex-wrap gap-2">
        {objectTypeFacets.map((facet) => (
          <Button
            key={facet.type}
            variant={facet.enabled ? "default" : "outline"}
            size="sm"
            onClick={() => handleObjectTypeToggle(facet.type)}
            className="h-8"
          >
            {facet.icon}
            {facet.label}
            {facet.count > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {facet.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select 
                value={searchParams.status?.[0] || 'all'} 
                onValueChange={(value) => 
                  handleFilterChange('status', value === 'all' ? undefined : [value])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Created After</label>
              <DatePicker
                selected={searchParams.created_after ? new Date(searchParams.created_after) : undefined}
                onSelect={(date) => handleFilterChange('created_after', date?.toISOString())}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Created Before</label>
              <DatePicker
                selected={searchParams.created_before ? new Date(searchParams.created_before) : undefined}
                onSelect={(date) => handleFilterChange('created_before', date?.toISOString())}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {searchResults && !isLoading && (
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Found {searchResults.total_count} results
              {searchQuery && ` for "${searchQuery}"`}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by Relevance
              </Button>
            </div>
          </div>

          {/* Grouped Results */}
          {Object.entries(groupedResults).map(([type, objects]) => {
            const facet = objectTypeFacets.find(f => f.type === type);
            if (!facet || !facet.enabled) return null;

            return (
              <div key={type} className="space-y-3">
                <div className="flex items-center gap-2">
                  {facet.icon}
                  <h3 className="font-semibold">{facet.label}</h3>
                  <Badge variant="secondary">{objects.length}</Badge>
                </div>
                
                <div className="grid gap-3">
                  {objects.map((object) => (
                    <ObjectCard
                      key={object.id}
                      object={object}
                      variant="list"
                      showActions={false}
                      onClick={() => onResultClick?.(object)}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* No Results */}
          {searchResults.total_count === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchResults && !isLoading && hasFilters && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Start typing to search</h3>
          <p className="text-muted-foreground">
            Search across projects, communications, documents, and more
          </p>
        </div>
      )}
    </div>
  );
};

export default ObjectSearch;
