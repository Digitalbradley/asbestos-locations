import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import SearchBar from "@/components/search/search-bar";
import StatePills from "@/components/navigation/state-pills";
import type { State, Category } from "@shared/schema";

export default function Home() {

  const { data: states = [] } = useQuery({
    queryKey: ["/api/states"],
    queryFn: async () => {
      const response = await fetch("/api/states");
      if (!response.ok) throw new Error("Failed to fetch states");
      return response.json() as State[];
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json() as Category[];
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[90vh] py-16">
            
            {/* Left Column - Main Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                {/* Trust Badge */}
                <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold border"
                     style={{
                       backgroundColor: 'hsl(var(--medical-teal) / 0.1)', 
                       color: 'hsl(var(--medical-teal))',
                       borderColor: 'hsl(var(--medical-teal) / 0.3)'
                     }}>
                  <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: 'hsl(var(--medical-teal))'}}></div>
                  Trusted by Legal Professionals Nationwide
                </div>
                
                {/* Main Headline */}
                <div>
                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6" 
                      style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                    Find Asbestos 
                    <span className="block mt-2" style={{color: 'hsl(var(--medical-teal))'}}>
                      Exposure Sites
                    </span>
                  </h1>
                  <p className="text-xl lg:text-2xl leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
                    Comprehensive database of 87,000+ documented asbestos exposure locations across all 50 states. 
                    Essential resource for patients, families, and legal professionals.
                  </p>
                </div>
              </div>
              
              {/* Search Widget */}
              <div className="medical-card space-y-4">
                <SearchBar 
                  size="large"
                  placeholder="Search facilities, cities, or companies..."
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2 text-sm" style={{color: 'hsl(var(--professional-gray-light))'}}>
                  <span className="font-medium">Popular searches:</span>
                  <span className="px-2 py-1 rounded-md" style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>Shipyards</span>
                  <span className="px-2 py-1 rounded-md" style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>Power Plants</span>
                  <span className="px-2 py-1 rounded-md" style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>Manufacturing</span>
                  <span className="px-2 py-1 rounded-md" style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>Schools</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/states">
                  <button className="medical-button w-full sm:w-auto px-10 py-4 text-lg font-semibold">
                    Browse by State
                  </button>
                </Link>
                <Link href="#facility-types">
                  <button className="px-10 py-4 text-lg rounded-full font-semibold border-2 transition-all duration-300 w-full sm:w-auto hover:shadow-lg"
                          style={{
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--professional-gray))',
                            background: 'white'
                          }}>
                    View Facility Types
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column - Floating Stats Cards */}
            <div className="hidden lg:block relative">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="medical-card p-8 transform rotate-3 hover:rotate-2 transition-all duration-500 cursor-pointer">
                    <div className="text-center">
                      <h3 className="text-5xl font-bold mb-3" style={{color: 'hsl(var(--medical-teal))', fontFamily: 'Merriweather, serif'}}>
                        87K+
                      </h3>
                      <p className="text-lg font-semibold" style={{color: 'hsl(var(--professional-gray))'}}>
                        Documented Sites
                      </p>
                      <p className="text-sm mt-2" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        Verified facilities
                      </p>
                    </div>
                  </div>
                  
                  <div className="medical-card p-8 transform -rotate-2 hover:-rotate-1 transition-all duration-500 cursor-pointer">
                    <div className="text-center">
                      <h3 className="text-5xl font-bold mb-3" style={{color: 'hsl(var(--medical-teal))', fontFamily: 'Merriweather, serif'}}>
                        50
                      </h3>
                      <p className="text-lg font-semibold" style={{color: 'hsl(var(--professional-gray))'}}>
                        States Covered
                      </p>
                      <p className="text-sm mt-2" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        Complete coverage
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8 mt-16">
                  <div className="medical-card p-8 transform -rotate-3 hover:-rotate-2 transition-all duration-500 cursor-pointer">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-3" style={{color: 'hsl(var(--medical-teal))', fontFamily: 'Merriweather, serif'}}>
                        Legal
                      </h3>
                      <p className="text-lg font-semibold" style={{color: 'hsl(var(--professional-gray))'}}>
                        Professional
                      </p>
                      <p className="text-sm mt-2" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        Trusted resource
                      </p>
                    </div>
                  </div>
                  
                  <div className="medical-card p-8 transform rotate-2 hover:rotate-1 transition-all duration-500 cursor-pointer">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold mb-3" style={{color: 'hsl(var(--medical-teal))', fontFamily: 'Merriweather, serif'}}>
                        Verified
                      </h3>
                      <p className="text-lg font-semibold" style={{color: 'hsl(var(--professional-gray))'}}>
                        Documentation
                      </p>
                      <p className="text-sm mt-2" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        Historical records
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
              Why Choose Our Database
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
              The most comprehensive and trusted resource for asbestos exposure documentation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ),
                title: "Verified & Documented",
                description: "Every exposure site is thoroughly researched with historical records and verified sources."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
                ),
                title: "Complete Coverage",
                description: "Comprehensive database covering all 50 states with detailed facility information."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                ),
                title: "Legal Professional Ready",
                description: "Trusted by attorneys and legal professionals for case research and documentation."
              }
            ].map((feature, index) => (
              <div key={index} className="medical-card text-center group cursor-pointer">
                <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                     style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)'}}>
                  <div style={{color: 'hsl(var(--medical-teal))'}}>
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                  {feature.title}
                </h3>
                <p className="text-lg leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facility Types Grid */}
      <section id="facility-types" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
              Facility Types & Industries
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
              Asbestos was extensively used across multiple industries. Browse our categorized database 
              to find exposure sites relevant to your case.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 2,
                name: "Manufacturing",
                slug: "manufacturing",
                count: 1152,
                description: "Industrial manufacturing plants that used asbestos extensively in production processes, equipment, and building materials.",
                icon: "🏭"
              },
              {
                id: 8,
                name: "Commercial Buildings",
                slug: "commercial-buildings", 
                count: 144,
                description: "Office buildings and commercial structures built with asbestos-containing construction materials.",
                icon: "🏢"
              },
              {
                id: 3,
                name: "Power Plants",
                slug: "power-plants",
                count: 130,
                description: "Electric power generation facilities where asbestos was used extensively in turbines, boilers, and insulation systems.",
                icon: "⚡"
              },
              {
                id: 1,
                name: "Shipyards",
                slug: "shipyards",
                count: 128,
                description: "Naval and commercial shipbuilding facilities where workers were exposed to asbestos in ship construction and repair.",
                icon: "🚢"
              },
              {
                id: 11,
                name: "Government",
                slug: "government",
                count: 68,
                description: "Government facilities and buildings where workers and personnel were exposed to asbestos.",
                icon: "🏛️"
              },
              {
                id: 10,
                name: "Hospitals",
                slug: "hospitals",
                count: 60,
                description: "Medical facilities where asbestos was used in construction materials and equipment.",
                icon: "🏥"
              },
              {
                id: 6,
                name: "Schools",
                slug: "schools",
                count: 44,
                description: "Educational institutions built with asbestos-containing materials in construction and maintenance.",
                icon: "🎓"
              },
              {
                id: 9,
                name: "Transportation",
                slug: "transportation",
                count: 32,
                description: "Transportation facilities including railways, airports, and vehicle manufacturing where asbestos was used.",
                icon: "🚆"
              },
              {
                id: 13,
                name: "Residential",
                slug: "residential",
                count: 20,
                description: "Residential buildings and apartment complexes where asbestos-containing materials were used in construction.",
                icon: "🏘️"
              }
            ].map((category, index) => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <div className="medical-card group h-full cursor-pointer hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl"
                         style={{backgroundColor: `hsl(var(--medical-teal) / ${0.1 + (index % 3) * 0.05})`}}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 group-hover:opacity-80 transition-opacity" 
                          style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                        {category.name}
                      </h3>
                      <p className="text-sm font-medium" style={{color: 'hsl(var(--medical-teal))'}}>
                        {category.count.toLocaleString()} facilities nationwide
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-base leading-relaxed mb-6" style={{color: 'hsl(var(--professional-gray-light))'}}>
                    {category.description}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <span className="text-base font-semibold group-hover:underline transition-all inline-flex items-center"
                          style={{color: 'hsl(var(--medical-teal))'}}>
                      Explore {category.name}
                      <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Browse All 50 States */}
      <section id="browse-states" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
              Browse by State
            </h2>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{color: 'hsl(var(--professional-gray-light))'}}>
              Explore documented asbestos exposure sites by state. Our comprehensive database includes 
              detailed facility information, exposure periods, and historical documentation.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: "Alabama", slug: "alabama", count: 12, available: false },
              { name: "Alaska", slug: "alaska", count: 8, available: false },
              { name: "Arizona", slug: "arizona", count: 34, available: false },
              { name: "Arkansas", slug: "arkansas", count: 15, available: false },
              { name: "California", slug: "california", count: 2845, available: false },
              { name: "Colorado", slug: "colorado", count: 28, available: false },
              { name: "Connecticut", slug: "connecticut", count: 67, available: false },
              { name: "Delaware", slug: "delaware", count: 23, available: false },
              { name: "Florida", slug: "florida", count: 1770, available: true },
              { name: "Georgia", slug: "georgia", count: 89, available: false },
              { name: "Hawaii", slug: "hawaii", count: 45, available: false },
              { name: "Idaho", slug: "idaho", count: 12, available: false },
              { name: "Illinois", slug: "illinois", count: 234, available: false },
              { name: "Indiana", slug: "indiana", count: 156, available: false },
              { name: "Iowa", slug: "iowa", count: 78, available: false },
              { name: "Kansas", slug: "kansas", count: 45, available: false },
              { name: "Kentucky", slug: "kentucky", count: 67, available: false },
              { name: "Louisiana", slug: "louisiana", count: 134, available: false },
              { name: "Maine", slug: "maine", count: 56, available: false },
              { name: "Maryland", slug: "maryland", count: 123, available: false },
              { name: "Massachusetts", slug: "massachusetts", count: 189, available: false },
              { name: "Michigan", slug: "michigan", count: 278, available: false },
              { name: "Minnesota", slug: "minnesota", count: 145, available: false },
              { name: "Mississippi", slug: "mississippi", count: 67, available: false },
              { name: "Missouri", slug: "missouri", count: 98, available: false },
              { name: "Montana", slug: "montana", count: 34, available: false },
              { name: "Nebraska", slug: "nebraska", count: 45, available: false },
              { name: "Nevada", slug: "nevada", count: 56, available: false },
              { name: "New Hampshire", slug: "new-hampshire", count: 34, available: false },
              { name: "New Jersey", slug: "new-jersey", count: 234, available: false },
              { name: "New Mexico", slug: "new-mexico", count: 45, available: false },
              { name: "New York", slug: "new-york", count: 456, available: false },
              { name: "North Carolina", slug: "north-carolina", count: 167, available: false },
              { name: "North Dakota", slug: "north-dakota", count: 23, available: false },
              { name: "Ohio", slug: "ohio", count: 298, available: false },
              { name: "Oklahoma", slug: "oklahoma", count: 78, available: false },
              { name: "Oregon", slug: "oregon", count: 89, available: false },
              { name: "Pennsylvania", slug: "pennsylvania", count: 345, available: false },
              { name: "Rhode Island", slug: "rhode-island", count: 34, available: false },
              { name: "South Carolina", slug: "south-carolina", count: 78, available: false },
              { name: "South Dakota", slug: "south-dakota", count: 23, available: false },
              { name: "Tennessee", slug: "tennessee", count: 123, available: false },
              { name: "Texas", slug: "texas", count: 456, available: false },
              { name: "Utah", slug: "utah", count: 45, available: false },
              { name: "Vermont", slug: "vermont", count: 23, available: false },
              { name: "Virginia", slug: "virginia", count: 189, available: false },
              { name: "Washington", slug: "washington", count: 167, available: false },
              { name: "West Virginia", slug: "west-virginia", count: 89, available: false },
              { name: "Wisconsin", slug: "wisconsin", count: 134, available: false },
              { name: "Wyoming", slug: "wyoming", count: 19, available: false }
            ].map((state) => (
              <div key={state.slug} className="relative">
                {state.available ? (
                  <Link href={`/${state.slug}`}>
                    <div className="medical-card p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors" 
                          style={{color: 'hsl(var(--professional-gray))'}}>
                        {state.name}
                      </h3>
                      <p className="text-sm" style={{color: 'hsl(var(--professional-gray-light))'}}>
                        {state.count.toLocaleString()} sites
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center text-xs px-2 py-1 rounded-full font-medium"
                              style={{backgroundColor: 'hsl(var(--medical-teal) / 0.1)', color: 'hsl(var(--medical-teal))'}}>
                          Available
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="medical-card p-4 opacity-60 cursor-not-allowed">
                    <h3 className="font-semibold text-lg mb-2" style={{color: 'hsl(var(--professional-gray))'}}>
                      {state.name}
                    </h3>
                    <div className="mt-2">
                      <span className="inline-flex items-center text-xs px-2 py-1 rounded-full font-medium"
                            style={{backgroundColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))'}}>
                        Coming Soon
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <div className="medical-card inline-block p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'hsl(var(--medical-teal))'}}></div>
                  <span className="text-sm font-medium">Available Now</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'hsl(var(--border))'}}></div>
                  <span className="text-sm font-medium">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
            Start Your Search Today
          </h2>
          <p className="text-xl leading-relaxed mb-12" style={{color: 'hsl(var(--professional-gray-light))'}}>
            Our database is continuously updated with new documentation and verified exposure sites. 
            Find the information you need to identify potential asbestos exposure locations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/states">
              <button className="medical-button px-12 py-4 text-lg font-semibold">
                Begin Your Search
              </button>
            </Link>
            <button className="px-12 py-4 text-lg rounded-full font-semibold border-2 transition-all duration-300 hover:shadow-lg"
                    style={{
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--professional-gray))',
                      background: 'white'
                    }}>
              Learn About Asbestos Exposure
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
