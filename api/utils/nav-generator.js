export function generateNavHTML() {
  return `
    <header style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-bottom: 1px solid #e5e7eb;">
      <div style="max-width: 1200px; margin: 0 auto; padding: 0 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <a href="/" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none;">
              <div style="height: 2.5rem; width: 2.5rem; border-radius: 50%; background: #52d2e3; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-weight: bold; font-size: 1.125rem;">AE</span>
              </div>
              <h1 style="font-size: 1.25rem; font-weight: bold; font-family: Merriweather, serif; color: #2b3441; margin: 0;">
                AsbestosExposureSites.com
              </h1>
            </a>
          </div>
          
          <nav style="display: flex; gap: 0.5rem; align-items: center;">
            <a href="/" style="font-weight: 500; color: #2b3441; text-decoration: none; padding: 0.5rem 1rem;">Home</a>
            <a href="/florida" style="font-weight: 500; color: #2b3441; text-decoration: none; padding: 0.5rem 1rem;">Florida Sites</a>
            <div style="position: relative; display: inline-block;" class="facility-dropdown">
              <a href="/#facility-types" style="font-weight: 500; color: #2b3441; text-decoration: none; padding: 0.5rem 1rem; display: inline-flex; align-items: center;">
                Facility Types
                <svg style="width: 1rem; height: 1rem; margin-left: 0.25rem;" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
              <div class="dropdown-content" style="position: absolute; top: 100%; left: 0; margin-top: 0.25rem; width: 16rem; background: white; border-radius: 0.375rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb; opacity: 0; visibility: hidden; transition: all 0.2s; z-index: 50;">
                <div style="padding: 0.5rem 0;">
                  <a href="/category/manufacturing" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Manufacturing</span>
                  </a>
                  <a href="/category/commercial-buildings" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Commercial Buildings</span>
                  </a>
                  <a href="/category/power-plants" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Power Plants</span>
                  </a>
                  <a href="/category/shipyards" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Shipyards</span>
                  </a>
                  <a href="/category/government" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Government</span>
                  </a>
                  <a href="/category/hospitals" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Hospitals</span>
                  </a>
                  <a href="/category/schools" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Schools</span>
                  </a>
                  <a href="/category/transportation" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Transportation</span>
                  </a>
                  <a href="/category/residential" style="display: block; padding: 0.5rem 1rem; color: #374151; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    <span style="font-weight: 500;">Residential</span>
                  </a>
                  <hr style="margin: 0.5rem 0; border: 0; border-top: 1px solid #e5e7eb;">
                  <a href="/#facility-types" style="display: block; padding: 0.5rem 1rem; color: #0891b2; text-decoration: none; font-size: 0.875rem; transition: background 0.2s;">
                    View All Facility Types →
                  </a>
                </div>
              </div>
            </div>
            <a href="/legal-help" style="font-weight: 500; color: #2b3441; text-decoration: none; padding: 0.5rem 1rem;">Legal Help</a>
          </nav>
          
          <!-- Mobile menu button -->
          <button style="display: block; background: none; border: none; cursor: pointer; padding: 0.5rem;">
            <svg style="width: 1.5rem; height: 1.5rem; color: #2b3441;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- CSS for responsive navigation -->
      <style>
        @media (min-width: 768px) {
          header button { display: none !important; }
          header h1 { display: block !important; }
        }
        @media (max-width: 767px) {
          header nav { display: none !important; }
          header h1 { display: none !important; }
        }
        header a:hover { opacity: 0.8; }
        .facility-dropdown:hover .dropdown-content {
          opacity: 1 !important;
          visibility: visible !important;
        }
        .dropdown-content a:hover {
          background-color: #f3f4f6 !important;
        }
      </style>
    </header>
  `;
}
