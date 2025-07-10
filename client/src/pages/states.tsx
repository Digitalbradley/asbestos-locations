import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { State } from "@shared/schema";

export default function StatesPage() {
  const { data: states = [], isLoading } = useQuery({
    queryKey: ["/api/states"],
    queryFn: async () => {
      const response = await fetch("/api/states");
      if (!response.ok) throw new Error("Failed to fetch states");
      return response.json() as State[];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading states...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Browse Asbestos Exposure Sites by State</h1>
          <p className="text-xl text-muted-foreground">
            Select a state to explore documented asbestos exposure locations and facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {states
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((state) => (
              <Link 
                key={state.id} 
                href={`/${state.slug}`}
                className="block p-6 bg-card rounded-xl border hover:border-primary hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                    {state.name}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium">
                    {state.facilityCount?.toLocaleString() || 0} facilities
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}