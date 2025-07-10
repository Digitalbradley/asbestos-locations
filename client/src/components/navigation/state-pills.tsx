import { Link } from "wouter";
import type { State } from "@shared/schema";

interface StatePillsProps {
  states: State[];
  className?: string;
}

export default function StatePills({ states, className = "" }: StatePillsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 ${className}`}>
      {states.map((state) => (
        <Link key={state.id} href={`/${state.slug}`} className="group">
          <div className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <div className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">
              {state.name}
            </div>
            <div className="text-lg text-muted-foreground mt-2 font-medium">
              {state.facilityCount?.toLocaleString() || 0} sites
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
