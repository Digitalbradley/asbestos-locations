import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import BreadcrumbNav from "@/components/navigation/breadcrumb-nav";
import ContactForm from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import type { FacilityWithRelations } from "@shared/schema";

interface ContentTemplate {
  id: number;
  templateType: string;
  templateName: string;
  contentBlocks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function FacilityPage() {
  const [, params] = useRoute("/:stateSlug/:citySlug/:facilitySlug-asbestos-exposure");
  const stateSlug = params?.stateSlug || "";
  const citySlug = params?.citySlug || "";
  const facilitySlugWithSuffix = params?.["facilitySlug-asbestos-exposure"] || "";
  const facilitySlug = facilitySlugWithSuffix.replace("-asbestos-exposure", "");

  const { data: facility, isLoading: isLoadingFacility, error: facilityError } = useQuery({
    queryKey: ["/api/facilities", stateSlug, citySlug, facilitySlug],
    queryFn: async () => {
      console.log('Fetching facility:', stateSlug, citySlug, facilitySlug);
      const response = await fetch(`/api/facilities/${stateSlug}/${citySlug}/${facilitySlug}`);
      console.log('Facility API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Facility not found: ${response.status}`);
      const data = await response.json();
      console.log('Facility data:', data?.name, data?.id);
      return data as FacilityWithRelations;
    },
    enabled: !!(stateSlug && citySlug && facilitySlug),
  });

  const { data: nearbyFacilities = [], error: nearbyError } = useQuery({
    queryKey: ["/api/facilities", facility?.id, "nearby"],
    queryFn: async () => {
      if (!facility?.id) return [];
      console.log('Fetching nearby facilities for facility ID:', facility.id);
      const response = await fetch(`/api/facilities/${facility.id}/nearby`);
      console.log('Nearby facilities API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Failed to fetch nearby facilities: ${response.status}`);
      const data = await response.json();
      console.log('Nearby facilities count:', data.length);
      return data as FacilityWithRelations[];
    },
    enabled: !!facility?.id,
  });

  const { data: relatedFacilities = [], error: relatedError } = useQuery({
    queryKey: ["/api/facilities", facility?.id, "related"],
    queryFn: async () => {
      if (!facility?.id) return [];
      console.log('Fetching related facilities for facility ID:', facility.id);
      const response = await fetch(`/api/facilities/${facility.id}/related`);
      console.log('Related facilities API response:', response.status, response.statusText);
      if (!response.ok) throw new Error(`Failed to fetch related facilities: ${response.status}`);
      const data = await response.json();
      console.log('Related facilities count:', data.length);
      return data as FacilityWithRelations[];
    },
    enabled: !!facility?.id,
  });

  const { data: facilityContent, error: contentError } = useQuery({
    queryKey: ["/api/content-templates/facility", facility?.slug, facility?.id],
    queryFn: async () => {
      if (!facility?.slug || !facility?.id) return null;
      
      // Determine template version based on facility ID (same logic as generation)
      const templateVersion = (facility.id % 3) + 1;
      console.log('Fetching facility content template for:', facility.slug, 'version:', templateVersion);
      
      // Try versioned template first
      let response = await fetch(`/api/content-templates/facility/${facility.slug}_content_v${templateVersion}`);
      console.log('Primary template API response:', response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log('Template found:', data?.templateName);
        return data as ContentTemplate;
      }
      
      // Fall back to other versions if primary not found
      for (let v = 1; v <= 3; v++) {
        if (v !== templateVersion) {
          console.log('Trying fallback template version:', v);
          response = await fetch(`/api/content-templates/facility/${facility.slug}_content_v${v}`);
          console.log('Fallback template API response:', response.status, response.statusText);
          if (response.ok) {
            const data = await response.json();
            console.log('Fallback template found:', data?.templateName);
            return data as ContentTemplate;
          }
        }
      }
      
      console.log('No content template found for facility:', facility.slug);
      return null;
    },
    enabled: !!facility?.slug && !!facility?.id,
  });



  // Set document title and meta tags
  useEffect(() => {
    if (facility) {
      document.title = facility.metaTitle || `${facility.name} - Asbestos Exposure Site`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', facility.metaDescription || `Learn about asbestos exposure at ${facility.name} in ${facility.city.name}, ${facility.state.name}. Information about exposure risks and legal resources.`);
      }
      
      // Update meta keywords
      if (facility.seoKeyword) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
          metaKeywords = document.createElement('meta');
          metaKeywords.setAttribute('name', 'keywords');
          document.head.appendChild(metaKeywords);
        }
        metaKeywords.setAttribute('content', facility.seoKeyword);
      }
    }
  }, [facility]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoadingFacility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading facility information...</p>
        </div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Facility Not Found</h1>
          <p className="text-muted-foreground">The requested facility could not be found.</p>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: facility.state.name, href: `/${facility.state.slug}` },
    { label: facility.city.name, href: `/${facility.state.slug}/${facility.city.slug}` },
    { label: facility.name },
  ];

  return (
    <div className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BreadcrumbNav items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-8 shadow-sm">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-primary mb-4">
                  {facility.name} - Asbestos Exposure
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-lg text-muted-foreground">
                    {facility.city.name}, {facility.state.name}
                  </span>
                  {facility.facilityType && (
                    <Badge variant="secondary" className="text-sm">
                      {facility.facilityType}
                    </Badge>
                  )}
                </div>
                
                {/* Desktop Ad - 728x90 Leaderboard */}
                <div className="mb-6 hidden md:block">
                  <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6">
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm font-medium mb-1">Advertisement - Desktop</div>
                      <div className="text-xs">Google AdSense Desktop code (728x90 Leaderboard)</div>
                      <div className="text-xs mt-2">data-ad-slot="DESKTOP_SLOT_ID"</div>
                    </div>
                  </div>
                </div>

                {/* Mobile Ad - 320x50 Banner */}
                <div className="mb-6 block md:hidden">
                  <div className="bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg p-6">
                    <div className="text-center text-muted-foreground">
                      <div className="text-sm font-medium mb-1">Advertisement - Mobile</div>
                      <div className="text-xs">Google AdSense Mobile code (320x50 Banner)</div>
                      <div className="text-xs mt-2">data-ad-slot="MOBILE_SLOT_ID"</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {(facilityError || nearbyError || relatedError || contentError) && (
                <div className="mb-6 space-y-2">
                  {facilityError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">Error loading facility: {facilityError.message}</p>
                    </div>
                  )}
                  {nearbyError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">Error loading nearby facilities: {nearbyError.message}</p>
                    </div>
                  )}
                  {relatedError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">Error loading related facilities: {relatedError.message}</p>
                    </div>
                  )}
                  {contentError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800">Error loading content: {contentError.message}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="prose max-w-none mb-8">
                <h2 className="text-2xl font-semibold mb-4">Facility Overview</h2>
                {facilityContent && facilityContent.contentBlocks && facilityContent.contentBlocks.length > 0 ? (
                  <div className="text-muted-foreground">
                    {facilityContent.contentBlocks.map((block, index) => {
                      const paragraphs = block.split('\n').filter(p => p.trim()).map(p => p.trim());
                      return (
                        <div key={index}>
                          {paragraphs.map((paragraph, pIndex) => (
                            <p key={pIndex} className={pIndex > 0 ? "mt-4" : ""}>{paragraph}</p>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : facility.description ? (
                  <div className="text-muted-foreground space-y-4">
                    {facility.description.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground space-y-4">
                    <p>
                      The {facility.name} was an industrial facility located in {facility.city.name}, {facility.state.name}
                      {facility.operationalYears && ` that operated ${facility.operationalYears}`}. 
                      During its operation, workers at the facility may have been exposed to asbestos through various sources.
                    </p>
                    <p>
                      Workers at industrial facilities like this were routinely exposed to asbestos through multiple sources, 
                      including insulation materials, protective equipment, building materials, and manufacturing processes 
                      that involved asbestos-containing products.
                    </p>
                    <p>
                      Many former employees of industrial facilities from this era have subsequently developed mesothelioma 
                      and other asbestos-related diseases due to occupational exposure.
                    </p>
                  </div>
                )}
              </div>

              {/* Internal Links - Related Facilities */}
              {(nearbyFacilities.length > 0 || relatedFacilities.length > 0) && (
                <div className="border-t pt-8">
                  <h3 className="text-2xl font-semibold mb-6">Related Exposure Sites</h3>
                  
                  {nearbyFacilities.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">
                        Nearby Facilities in {facility.city.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nearbyFacilities.map((nearbyFacility) => (
                          <Link
                            key={nearbyFacility.id}
                            href={`/${nearbyFacility.state.slug}/${nearbyFacility.city.slug}/${nearbyFacility.slug}-asbestos-exposure`}
                            className="block bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors"
                          >
                            <h5 className="font-medium text-primary">{nearbyFacility.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {nearbyFacility.facilityType} 
                              {nearbyFacility.operationalYears && ` • ${nearbyFacility.operationalYears}`}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedFacilities.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold mb-4">
                        Related Facilities
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {relatedFacilities.map((relatedFacility) => (
                          <Link
                            key={relatedFacility.id}
                            href={`/${relatedFacility.state.slug}/${relatedFacility.city.slug}/${relatedFacility.slug}-asbestos-exposure`}
                            className="block bg-muted/50 p-4 rounded-lg hover:bg-muted transition-colors"
                          >
                            <h5 className="font-medium text-primary">{relatedFacility.name}</h5>
                            <p className="text-sm text-muted-foreground">
                              {relatedFacility.city.name}, {relatedFacility.state.name}
                              {relatedFacility.operationalYears && ` • ${relatedFacility.operationalYears}`}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Important Information - Legal Disclaimer */}
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Important Legal Information</h3>
                <p className="text-amber-700 leading-relaxed mb-4">
                  If you worked at {facility.name} in {facility.city.name}, {facility.state.name} and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, 
                  you may be entitled to significant compensation. Former employees of {facility.category?.name || 'industrial facilities'} like this often qualify for legal claims.
                </p>
                <div className="text-center">
                  <Link 
                    href="/legal-help" 
                    className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Get Free Legal Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Facility Details Card */}
            <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-xl font-semibold mb-4">Facility Details</h3>
              <div className="space-y-3">
                {facility.address && (
                  <div>
                    <span className="font-medium text-foreground">Full Address:</span>
                    <p className="text-muted-foreground">{facility.address}</p>
                  </div>
                )}
                {facility.companyName && (
                  <div>
                    <span className="font-medium text-foreground">Company:</span>
                    <p className="text-muted-foreground">{facility.companyName}</p>
                  </div>
                )}
                {facility.operationalYears && (
                  <div>
                    <span className="font-medium text-foreground">Operational Years:</span>
                    <p className="text-muted-foreground">{facility.operationalYears}</p>
                  </div>
                )}
                {facility.facilityType && (
                  <div>
                    <span className="font-medium text-foreground">Facility Type:</span>
                    <p className="text-muted-foreground">{facility.facilityType}</p>
                  </div>
                )}
                {facility.category && (
                  <div>
                    <span className="font-medium text-foreground">Industry:</span>
                    <p className="text-muted-foreground">{facility.category.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm 
              facilityId={facility.id}
              facilityName={facility.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
