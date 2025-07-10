import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FacilityWithRelations } from "@shared/schema";

interface FacilityCardProps {
  facility: FacilityWithRelations;
  showFullDescription?: boolean;
}

export default function FacilityCard({ 
  facility, 
  showFullDescription = false
}: FacilityCardProps) {

  const facilityUrl = `/${facility.state.slug}/${facility.city.slug}/${facility.slug}-asbestos-exposure`;
  
  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="facility-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="facility-name mb-2">
                <Link href={facilityUrl} className="facility-link">
                  {facility.name}
                </Link>
              </h3>
              <p className="text-muted-foreground mb-2">
                {facility.city.name}, {facility.state.name}
              </p>
              {facility.facilityType && (
                <Badge variant="secondary" className="mb-2">
                  {facility.facilityType}
                </Badge>
              )}
            </div>
          </div>
          
          {facility.description && (
            <p className="body-text mb-4">
              {showFullDescription 
                ? facility.description 
                : truncateDescription(facility.description)
              }
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {facility.companyName && (
              <div>
                <span className="font-medium text-foreground">Company:</span>
                <span className="text-muted-foreground ml-1">{facility.companyName}</span>
              </div>
            )}
            {facility.operationalYears && (
              <div>
                <span className="font-medium text-foreground">Operational Years:</span>
                <span className="text-muted-foreground ml-1">{facility.operationalYears}</span>
              </div>
            )}
            {facility.category && (
              <div>
                <span className="font-medium text-foreground">Industry:</span>
                <span className="text-muted-foreground ml-1">{facility.category.name}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
          <Button 
            asChild
            className="w-full lg:w-auto primary-button"
          >
            <Link href={facilityUrl} onClick={() => window.scrollTo(0, 0)}>
              Visit Location
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
