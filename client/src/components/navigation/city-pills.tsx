import { Link } from "wouter";
import type { City } from "@shared/schema";

interface CityPillsProps {
  cities: City[];
  stateSlug: string;
  activeCity?: string;
  className?: string;
  maxVisible?: number;
}

export default function CityPills({ 
  cities, 
  stateSlug, 
  activeCity, 
  className = "",
  maxVisible = 6
}: CityPillsProps) {
  const visibleCities = cities.slice(0, maxVisible);
  const remainingCount = cities.length - maxVisible;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {visibleCities.map((city) => {
        const isActive = activeCity === city.slug;
        const pillClass = isActive ? "city-pill city-pill-active" : "city-pill city-pill-inactive";
        
        return (
          <Link key={city.id} href={`/${stateSlug}/${city.slug}`} className={pillClass}>
            {city.name} ({city.facilityCount || 0})
          </Link>
        );
      })}
      
      {remainingCount > 0 && (
        <Link 
          href={`/${stateSlug}`} 
          className="city-pill city-pill-inactive"
        >
          + {remainingCount} More
        </Link>
      )}
    </div>
  );
}
