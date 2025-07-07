import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TreeNode {
  code: string;
  description: string;
  children?: TreeNode[];
}

interface TreeSelectProps {
  data: TreeNode[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function TreeSelect({ data, value, onChange, placeholder, className }: TreeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpanded = (code: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(code)) {
      newExpanded.delete(code);
    } else {
      newExpanded.add(code);
    }
    setExpandedNodes(newExpanded);
  };

  const toggleSelection = (code: string) => {
    const newValue = value.includes(code)
      ? value.filter(v => v !== code)
      : [...value, code];
    onChange(newValue);
  };

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return data;
    
    const filterNodes = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.reduce((acc: TreeNode[], node) => {
        const matchesSearch = node.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             node.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        
        if (matchesSearch || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : node.children
          });
        }
        
        return acc;
      }, []);
    };
    
    return filterNodes(data);
  }, [data, searchTerm]);

  const renderNode = (node: TreeNode, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.code);
    const isSelected = value.includes(node.code);

    return (
      <div key={node.code} className="w-full">
        <div 
          className={cn(
            "flex items-center p-2 hover:bg-gray-700 rounded-md cursor-pointer",
            isSelected && "bg-blue-600/20"
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 w-4 h-4 mr-2"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(node.code);
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </Button>
          )}
          
          <div 
            className="flex items-center flex-1 space-x-2"
            onClick={() => toggleSelection(node.code)}
          >
            <div className={cn(
              "w-4 h-4 border rounded flex items-center justify-center",
              isSelected ? "bg-blue-600 border-blue-600" : "border-gray-400"
            )}>
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{node.code}</div>
              <div className="text-xs text-gray-400">{node.description}</div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        className="w-full justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">
          {value.length > 0 ? `${value.length} items selected` : placeholder}
        </span>
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b border-gray-600">
            <Input
              placeholder="Search CSI codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="overflow-y-auto max-h-60 p-2">
            {filteredData.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No CSI codes found
              </div>
            ) : (
              filteredData.map(node => renderNode(node))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-600 flex justify-between">
            <span className="text-sm text-gray-400">
              {value.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
