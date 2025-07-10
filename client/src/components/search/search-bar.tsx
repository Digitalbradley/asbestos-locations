import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { FacilityWithRelations } from "@shared/schema";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "large";
}

export default function SearchBar({ 
  placeholder = "Search facilities, cities, or companies...", 
  className = "",
  size = "default"
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["/api/search", query],
    queryFn: async () => {
      if (query.trim().length < 2) return [];
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json() as FacilityWithRelations[];
    },
    enabled: query.trim().length >= 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      // Navigate to search results page or handle search
      console.log("Searching for:", query);
      setShowResults(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const inputSize = size === "large" ? "px-4 py-4 text-lg" : "px-4 py-3";
  const containerClass = size === "large" ? "relative" : "relative w-full max-w-md";

  return (
    <div ref={searchRef} className={`${containerClass} ${className}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onKeyDown={handleKeyDown}
          className={`${inputSize} pr-12 focus-ring`}
        />
        <Button
          onClick={handleSearch}
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary hover:bg-secondary/90"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {showResults && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="p-2">
              {searchResults.map((facility) => (
                <Link
                  key={facility.id}
                  href={`/${facility.state.slug}/${facility.city.slug}/${facility.slug}-asbestos-exposure`}
                  className="block"
                  onClick={() => setShowResults(false)}
                >
                  <div className="p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="font-medium text-primary">{facility.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {facility.city.name}, {facility.state.name}
                      {facility.facilityType && ` • ${facility.facilityType}`}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No facilities found for "{query}"
            </div>
          )}
          
          {/* Popular searches when no query */}
          {query.trim().length === 0 && (
            <div className="p-4">
              <div className="text-sm font-medium text-foreground mb-2">Popular searches:</div>
              <div className="text-sm text-muted-foreground">
                Shipyards, Power Plants, Manufacturing, Schools
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
