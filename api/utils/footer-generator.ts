/**
 * Footer HTML Generator for SSR Pages
 * Provides consistent footer content across all server-side rendered pages
 */

export function generateFooterHTML(): string {
  return `
    <footer style="background-color: #2b3441; color: #ffffff; padding: 3rem 0 1rem; margin-top: auto;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          
          <div>
            <h4 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem;">AsbestosExposureSites.com</h4>
            <p style="color: #9ca3af; font-size: 0.875rem; line-height: 1.5;">
              Comprehensive directory of asbestos exposure sites helping mesothelioma victims identify where they were exposed.
            </p>
          </div>

          <div>
            <h5 style="font-weight: 600; margin-bottom: 1rem; color: #ffffff;">All States</h5>
            <ul style="list-style: none; padding: 0; margin: 0; color: #9ca3af; font-size: 0.875rem;">
              <li style="margin-bottom: 0.5rem;"><a href="/florida" style="color: #9ca3af; text-decoration: none;">Florida</a></li>
              <li style="margin-bottom: 0.5rem;">Alabama (Coming Soon)</li>
              <li style="margin-bottom: 0.5rem;">California (Coming Soon)</li>
              <li style="margin-bottom: 0.5rem;">Texas (Coming Soon)</li>
              <li style="margin-bottom: 0.5rem;">New York (Coming Soon)</li>
            </ul>
          </div>
          
          <div>
            <h5 style="font-weight: 600; margin-bottom: 1rem; color: #ffffff;">Florida Cities</h5>
            <ul style="list-style: none; padding: 0; margin: 0; color: #9ca3af; font-size: 0.875rem;">
              <li style="margin-bottom: 0.5rem;"><a href="/florida" style="color: #9ca3af; text-decoration: none;">Florida Overview</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/florida/miami" style="color: #9ca3af; text-decoration: none;">Miami</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/florida/tampa" style="color: #9ca3af; text-decoration: none;">Tampa</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/florida/jacksonville" style="color: #9ca3af; text-decoration: none;">Jacksonville</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/florida/orlando" style="color: #9ca3af; text-decoration: none;">Orlando</a></li>
            </ul>
          </div>
          
          <div>
            <h5 style="font-weight: 600; margin-bottom: 1rem; color: #ffffff;">Facility Types</h5>
            <ul style="list-style: none; padding: 0; margin: 0; color: #9ca3af; font-size: 0.875rem;">
              <li style="margin-bottom: 0.5rem;"><a href="/category/manufacturing" style="color: #9ca3af; text-decoration: none;">Manufacturing</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/category/commercial-buildings" style="color: #9ca3af; text-decoration: none;">Commercial Buildings</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/category/power-plants" style="color: #9ca3af; text-decoration: none;">Power Plants</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/category/shipyards" style="color: #9ca3af; text-decoration: none;">Shipyards</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/#facility-types" style="color: #9ca3af; text-decoration: none;">View All Types →</a></li>
            </ul>
          </div>
          
          <div>
            <h5 style="font-weight: 600; margin-bottom: 1rem; color: #ffffff;">Resources</h5>
            <ul style="list-style: none; padding: 0; margin: 0; color: #9ca3af; font-size: 0.875rem;">
              <li style="margin-bottom: 0.5rem;"><a href="/legal-help" style="color: #9ca3af; text-decoration: none;">Legal Help</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/about" style="color: #9ca3af; text-decoration: none;">About Us</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/contact" style="color: #9ca3af; text-decoration: none;">Contact Us</a></li>
              <li style="margin-bottom: 0.5rem;"><a href="/#facility-types" style="color: #9ca3af; text-decoration: none;">Facility Categories</a></li>
            </ul>
          </div>
          
        </div>
        
        <div style="border-top: 1px solid rgba(156, 163, 175, 0.2); margin-top: 2rem; padding-top: 2rem; text-align: center; font-size: 0.875rem; color: #9ca3af;">
          <p>&copy; 2025 AsbestosExposureSites.com. All rights reserved. | 
            <a href="/privacy-policy" style="color: #9ca3af; text-decoration: none; margin-left: 0.25rem;">Privacy Policy</a> | 
            <a href="/terms-of-service" style="color: #9ca3af; text-decoration: none; margin-left: 0.25rem;">Terms of Service</a> |
            <a href="/disclaimer" style="color: #9ca3af; text-decoration: none; margin-left: 0.25rem;">Disclaimer</a>
          </p>
          <p style="margin-top: 0.5rem;">This website is for informational purposes only and does not constitute legal advice.</p>
        </div>
      </div>
    </footer>
  `;
}
