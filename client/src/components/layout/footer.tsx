import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4 text-white">AsbestosExposureSites.com</h4>
            <p className="text-muted text-sm">
              Comprehensive directory of asbestos exposure sites helping mesothelioma victims identify where they were exposed.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">All States</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/florida" className="hover:text-background transition-colors">Florida</Link></li>
              <li>Alabama (Coming Soon)</li>
              <li>California (Coming Soon)</li>
              <li>Texas (Coming Soon)</li>
              <li>New York (Coming Soon)</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Florida Cities</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/florida" className="hover:text-background transition-colors">Florida Overview</Link></li>
              <li><Link href="/florida/miami" className="hover:text-background transition-colors">Miami</Link></li>
              <li><Link href="/florida/tampa" className="hover:text-background transition-colors">Tampa</Link></li>
              <li><Link href="/florida/jacksonville" className="hover:text-background transition-colors">Jacksonville</Link></li>
              <li><Link href="/florida/orlando" className="hover:text-background transition-colors">Orlando</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Facility Types</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/category/manufacturing" className="hover:text-background transition-colors">Manufacturing</Link></li>
              <li><Link href="/category/commercial-buildings" className="hover:text-background transition-colors">Commercial Buildings</Link></li>
              <li><Link href="/category/power-plants" className="hover:text-background transition-colors">Power Plants</Link></li>
              <li><Link href="/category/shipyards" className="hover:text-background transition-colors">Shipyards</Link></li>
              <li><Link href="/category/government" className="hover:text-background transition-colors">Government</Link></li>
              <li><Link href="/category/hospitals" className="hover:text-background transition-colors">Hospitals</Link></li>
              <li><Link href="/category/schools" className="hover:text-background transition-colors">Schools</Link></li>
              <li><Link href="/category/transportation" className="hover:text-background transition-colors">Transportation</Link></li>
              <li><Link href="/category/residential" className="hover:text-background transition-colors">Residential</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/legal-help" className="hover:text-background transition-colors">Legal Help</Link></li>
              <li><Link href="/about" className="hover:text-background transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-background transition-colors">Contact Us</Link></li>
              <li><Link href="/#facility-types" className="hover:text-background transition-colors">Facility Categories</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted/20 mt-8 pt-8 text-center text-sm text-muted">
          <p>&copy; 2025 AsbestosExposureSites.com. All rights reserved. | 
            <Link href="/privacy-policy" className="hover:text-background transition-colors ml-1">Privacy Policy</Link> | 
            <Link href="/terms-of-service" className="hover:text-background transition-colors ml-1">Terms of Service</Link> |
            <Link href="/disclaimer" className="hover:text-background transition-colors ml-1">Disclaimer</Link>
          </p>
          <p className="mt-2">This website is for informational purposes only and does not constitute legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
