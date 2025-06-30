
import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  suggestions: string[];
  currentPlaceholder: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  suggestions,
  currentPlaceholder
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1" ref={searchRef}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder={currentPlaceholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(e.target.value.length > 1);
        }}
        onFocus={() => setShowSuggestions(searchTerm.length > 1)}
        className="pl-10 pr-10 input-ai h-10 rounded-lg focus:border-primary transition-colors"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSearchTerm('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      
      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-1 border-border bg-card">
          <CardContent className="p-2">
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full justify-start text-left text-card-foreground hover:bg-muted"
                >
                  <Search className="h-3 w-3 mr-2" />
                  {suggestion}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchInput;
