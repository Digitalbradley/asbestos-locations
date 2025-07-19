import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b" style={{borderColor: 'hsl(var(--border))'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background: 'hsl(var(--medical-teal))'}}>
                <span className="text-white font-bold text-lg">AE</span>
              </div>
              <h1 className="text-xl font-bold hidden sm:block" style={{fontFamily: 'Merriweather, serif', color: 'hsl(var(--professional-gray))'}}>
                AsbestosExposureSites.com
              </h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="font-medium transition-colors hover:opacity-80" style={{color: 'hsl(var(--professional-gray))'}}>
              Home
            </Link>
            <Link href="/florida" className="font-medium transition-colors hover:opacity-80" style={{color: 'hsl(var(--professional-gray))'}}>
              Florida Sites
            </Link>
            <div className="relative group">
              <Link href="/#facility-types" className="font-medium transition-colors hover:opacity-80 flex items-center" style={{color: 'hsl(var(--professional-gray))'}}>
                Facility Types
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/category/manufacturing" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Manufacturing</span>
                  </Link>
                  <Link href="/category/commercial-buildings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Commercial Buildings</span>
                  </Link>
                  <Link href="/category/power-plants" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Power Plants</span>
                  </Link>
                  <Link href="/category/shipyards" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Shipyards</span>
                  </Link>
                  <Link href="/category/government" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Government</span>
                  </Link>
                  <Link href="/category/hospitals" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Hospitals</span>
                  </Link>
                  <Link href="/category/schools" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Schools</span>
                  </Link>
                  <Link href="/category/transportation" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Transportation</span>
                  </Link>
                  <Link href="/category/residential" className="block px-4 py-2 text-sm hover:bg-gray-100">
                    <span className="font-medium">Residential</span>
                  </Link>
                  <hr className="my-2" />
                  <Link href="/#facility-types" className="block px-4 py-2 text-sm text-primary hover:bg-gray-100">
                    View All Facility Types →
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/legal-help" className="font-medium transition-colors hover:opacity-80" style={{color: 'hsl(var(--professional-gray))'}}>
              Legal Help
            </Link>
          </nav>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-muted/50">
            <Link
              href="/"
              className="block px-3 py-2 text-muted-foreground hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/florida"
              className="block px-3 py-2 text-muted-foreground hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Florida Sites
            </Link>
            
            {/* Facility Types - Mobile */}
            <div className="px-3 py-2">
              <div className="text-muted-foreground font-medium mb-2">Facility Types</div>
              <div className="ml-3 space-y-1">
                <Link
                  href="/category/manufacturing"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Manufacturing
                </Link>
                <Link
                  href="/category/commercial-buildings"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Commercial Buildings
                </Link>
                <Link
                  href="/category/power-plants"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Power Plants
                </Link>
                <Link
                  href="/category/shipyards"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Shipyards
                </Link>
                <Link
                  href="/category/government"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Government
                </Link>
                <Link
                  href="/category/hospitals"
                  className="block py-1 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hospitals
                </Link>
                <Link
                  href="/#facility-types"
                  className="block py-1 text-sm text-primary hover:text-primary/80"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View All Facility Types →
                </Link>
              </div>
            </div>
            
            <Link
              href="/legal-help"
              className="block px-3 py-2 text-muted-foreground hover:text-primary font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Legal Help
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
