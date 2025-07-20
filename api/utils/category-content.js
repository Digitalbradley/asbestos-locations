// Comprehensive category information for SEO-enhanced category pages
const categoryInfo = {
  "manufacturing": {
    name: "Manufacturing",
    slug: "manufacturing",
    facilityCount: 234,
    pageTitle: "Manufacturing Asbestos Exposure Sites - 234 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 234 manufacturing facilities with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "manufacturing asbestos exposure, factory asbestos, industrial plant mesothelioma, manufacturing worker asbestos, asbestos manufacturing facilities",
    h1Title: "Manufacturing Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Manufacturing Workers at High Risk for Asbestos-Related Diseases",
        content: "Industrial manufacturing plants across the United States extensively used asbestos-containing materials from the 1940s through the 1980s. These facilities represent some of the highest concentrations of occupational asbestos exposure in American industrial history. Manufacturing workers routinely handled raw asbestos fibers and worked in environments saturated with asbestos dust from insulation, machinery components, and protective equipment. The combination of high-temperature industrial processes and the widespread use of asbestos for heat resistance created particularly hazardous conditions that have resulted in thousands of mesothelioma and asbestos-related disease cases among manufacturing workers and their families."
      },
      history: {
        heading: "History of Asbestos Use in Manufacturing (1940s-1980s)",
        content: "The American manufacturing boom following World War II coincided with the peak use of asbestos in industrial applications. Manufacturing facilities relied heavily on asbestos for its fire-resistant and insulating properties, particularly in high-temperature processes involving furnaces, boilers, and industrial ovens. Major manufacturing corporations knowingly exposed workers to dangerous levels of asbestos fibers despite mounting evidence of health risks beginning in the 1930s. Internal company documents revealed during litigation show that many manufacturers actively concealed the dangers of asbestos exposure from their workforce while continuing to use asbestos-containing materials well into the 1980s. This widespread use has left a lasting legacy of asbestos contamination in manufacturing facilities across the nation."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Manufacturing Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Boiler and furnace insulation containing up to 80% asbestos",
          "Pipe insulation and lagging materials",
          "Gaskets, packing materials, and valve seals",
          "Protective clothing, gloves, and aprons",
          "Ceiling tiles and spray-on fireproofing",
          "Electrical insulation and wiring",
          "Brake linings and clutch facings",
          "Roofing materials and floor tiles",
          "Cement products and construction materials",
          "Machine components and friction materials"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Manufacturing Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Manufacturing workers faced extreme asbestos exposure levels, often working in poorly ventilated areas where asbestos fibers accumulated to dangerous concentrations. Studies have shown that manufacturing workers have some of the highest rates of mesothelioma, lung cancer, and asbestosis among all occupational groups. The latency period for asbestos-related diseases means that workers exposed decades ago are still being diagnosed today. Family members of manufacturing workers also faced secondary exposure from asbestos fibers brought home on work clothes, leading to mesothelioma cases among spouses and children who never worked directly with asbestos."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Manufacturing companies have faced extensive litigation for knowingly exposing workers to asbestos without adequate warnings or protection. Major manufacturers have paid billions in settlements and jury awards to victims and their families. Many companies filed for bankruptcy protection and established asbestos trust funds to compensate current and future victims. Workers and their families may be entitled to compensation through multiple sources including workers' compensation, personal injury lawsuits, and asbestos trust fund claims. The statute of limitations for filing claims typically begins at diagnosis, not exposure, recognizing the long latency period of asbestos-related diseases."
        }
      },
      stateFilter: {
        heading: "Find Manufacturing Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 234 manufacturing facilities with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view manufacturing facilities with documented asbestos exposure."
      },
      industriesAffected: {
        heading: "Industries and Occupations Affected",
        industries: [
          {
            name: "Primary Industry Sector",
            description: "Workers in this primary industry sector faced significant asbestos exposure through direct contact with asbestos-containing materials used throughout facilities and equipment."
          },
          {
            name: "Secondary Industry Sector", 
            description: "Personnel in this secondary industry sector encountered asbestos exposure during maintenance, repair, and renovation activities involving asbestos-containing components."
          },
          {
            name: "Support Services Sector",
            description: "Support services workers experienced asbestos exposure while providing essential services in facilities where asbestos materials were prevalent."
          }
        ]
      },
      callToAction: {
        heading: "Take Action: Know Your Rights",
        workers: {
          subheading: "For Workers",
          content: "If you worked in facilities with asbestos exposure between 1940-1980 and have been diagnosed with an asbestos-related disease, you may be entitled to compensation. Time limits apply, so it's important to understand your legal rights."
        },
        families: {
          subheading: "For Family Members",
          content: "Family members who developed asbestos-related diseases from secondary exposure (such as from washing work clothes or living near facilities) may also have legal claims. Many families have successfully obtained compensation."
        },
        legal: {
          subheading: "Free Legal Consultation",
          content: "Connect with experienced attorneys who specialize in asbestos-related cases. Most law firms offer free consultations and work on a contingency basis, meaning you pay nothing unless you receive compensation."
        }
      },
      citations: {
        heading: "References and Sources",
        references: [
          {
            id: 1,
            text: "National Institute for Occupational Safety and Health (NIOSH) - Asbestos Fibers and Other Elongate Mineral Particles",
            url: "https://www.cdc.gov/niosh/topics/asbestos/"
          },
          {
            id: 2,
            text: "Environmental Protection Agency (EPA) - Asbestos Laws and Regulations",
            url: "https://www.epa.gov/asbestos/asbestos-laws-and-regulations"
          },
          {
            id: 3,
            text: "Occupational Safety and Health Administration (OSHA) - Asbestos Standards",
            url: "https://www.osha.gov/asbestos"
          }
        ]
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Manufacturing Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 234 manufacturing facilities with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/manufacturing",
        "numberOfItems": 234,
        "hasPart": [
          {
            "@type": "WebPageElement",
            "name": "State Filter Interface",
            "description": "Interactive dropdown to filter manufacturing facilities by state"
          },
          {
            "@type": "WebPageElement",
            "name": "Industries Affected Section",
            "description": "Comprehensive list of industries and occupations affected by asbestos exposure"
          },
          {
            "@type": "WebPageElement",
            "name": "Legal Action Center",
            "description": "Resources and guidance for workers and families seeking compensation"
          }
        ],
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/manufacturing?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Manufacturing",
              "item": "https://asbestosexposuresites.com/category/manufacturing"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Manufacturing Facilities with Asbestos Exposure",
        "description": "Complete list of manufacturing facilities with documented asbestos exposure, filterable by state",
        "numberOfItems": 234,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Manufacturing Facilities",
            "item": {
              "@type": "Thing",
              "name": "234 facilities available through state selection",
              "description": "Use the interactive state filter to view manufacturing facilities in your state"
            }
          }
        ]
      },
      medicalWebPage: {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": "Manufacturing Asbestos Exposure Health Information",
        "about": {
          "@type": "MedicalCondition",
          "name": "Asbestos-Related Diseases",
          "alternateName": ["Mesothelioma", "Asbestosis", "Lung Cancer"],
          "associatedAnatomy": {
            "@type": "AnatomicalStructure",
            "name": "Respiratory System"
          },
          "riskFactor": [
            {
              "@type": "MedicalRiskFactor",
              "name": "Occupational Asbestos Exposure"
            }
          ]
        },
        "medicalAudience": {
          "@type": "MedicalAudience",
          "audienceType": "Patient",
          "healthCondition": {
            "@type": "MedicalCondition",
            "name": "At risk for asbestos-related diseases"
          }
        },
        "aspect": ["Cause", "Prevention", "Prognosis", "Treatment"]
      },
      faqPage: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "name": "Manufacturing Asbestos Exposure FAQs",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What industries are affected by asbestos exposure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Multiple industries including primary industrial sectors, secondary support sectors, and various service industries have documented asbestos exposure risks."
            }
          },
          {
            "@type": "Question",
            "name": "Can family members file claims for asbestos exposure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, family members who developed asbestos-related diseases from secondary exposure may have legal claims and can seek compensation."
            }
          },
          {
            "@type": "Question",
            "name": "How can I get legal help for asbestos exposure?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Experienced attorneys offer free consultations for asbestos cases, typically working on contingency basis with no upfront costs."
            }
          }
        ]
      }
    }
  },
  
  "power-plants": {
    name: "Power Plants",
    slug: "power-plants",
    facilityCount: 142,
    pageTitle: "Power Plants Asbestos Exposure Sites - 142 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 142 power plants with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "power plant asbestos exposure, electric plant asbestos, power generation mesothelioma, utility worker asbestos, asbestos power facilities",
    h1Title: "Power Plants Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Power Plant Workers at High Risk for Asbestos-Related Diseases",
        content: "Electric power generation facilities constructed between 1940 and 1980 used massive quantities of asbestos-containing materials throughout their operations. Both coal-fired and nuclear power plants relied heavily on asbestos insulation to protect equipment and workers from extreme temperatures reaching over 1,000 degrees Fahrenheit. Power plant workers, including boilermakers, pipefitters, electricians, and maintenance personnel, faced daily exposure to asbestos fibers during routine operations, repairs, and renovations. The confined spaces, high-temperature environments, and constant vibration in power plants created ideal conditions for asbestos fibers to become airborne, resulting in widespread contamination that affected thousands of workers across the United States."
      },
      history: {
        heading: "History of Asbestos Use in Power Plants (1940s-1980s)",
        content: "The rapid expansion of America's electrical infrastructure in the post-World War II era coincided with the peak use of asbestos in industrial applications. Power plants built during this period used asbestos extensively in turbines, boilers, generators, and throughout the facility's pipe systems. The extreme temperatures involved in power generation made asbestos seem like an ideal solution for protecting equipment and preventing fires. Major utility companies continued using asbestos-containing materials despite growing awareness of health risks, prioritizing operational efficiency over worker safety. Many power plants operated for decades with original asbestos insulation intact, exposing multiple generations of workers to hazardous fibers."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Power Generation Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Turbine insulation and heat shields",
          "Boiler insulation and refractory materials",
          "Pipe insulation throughout the facility",
          "Valve packing and gasket materials",
          "Electrical insulation and panel boards",
          "Fireproofing spray on structural steel",
          "Cement pipes and conduits",
          "Cooling tower fill materials",
          "Control room ceiling tiles",
          "Protective clothing and fire blankets"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Power Plant Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Power plant workers experienced some of the highest occupational asbestos exposure levels due to the extensive use of asbestos throughout these facilities. The combination of confined spaces, high temperatures, and routine maintenance activities created perfect conditions for asbestos fiber release. Studies show power plant workers have significantly elevated rates of mesothelioma, lung cancer, and asbestosis compared to the general population. The risk extends beyond direct employees to contractors, inspection personnel, and even administrative staff who worked in contaminated areas. Family members also faced secondary exposure from asbestos dust brought home on work clothes."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Power generation companies face ongoing litigation from workers and their families affected by asbestos exposure. Many utility companies have been held liable for failing to protect workers and for continuing to use asbestos despite known health risks. Successful lawsuits have resulted in substantial verdicts and settlements for victims. Workers may pursue compensation through multiple channels including workers' compensation, personal injury lawsuits, and claims against asbestos bankruptcy trusts established by equipment manufacturers. The unique exposure patterns in power plants often allow victims to pursue claims against multiple defendants."
        }
      },
      stateFilter: {
        heading: "Find Power Plant Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 142 power plants with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view power plants with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Power Plants Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 142 power plants with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/power-plants",
        "numberOfItems": 142,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter power plants by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/power-plants?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Power Plants",
              "item": "https://asbestosexposuresites.com/category/power-plants"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Power Plants with Asbestos Exposure",
        "description": "Complete list of power plants with documented asbestos exposure, filterable by state",
        "numberOfItems": 142,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Power Plants",
            "item": {
              "@type": "Thing",
              "name": "142 facilities available through state selection",
              "description": "Use the interactive state filter to view power plants in your state"
            }
          }
        ]
      }
    }
  },
  
  "shipyards": {
    name: "Shipyards",
    slug: "shipyards",
    facilityCount: 178,
    pageTitle: "Shipyards Asbestos Exposure Sites - 178 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 178 shipyards with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "shipyard asbestos exposure, naval shipyard asbestos, ship repair mesothelioma, maritime worker asbestos, asbestos shipbuilding facilities",
    h1Title: "Shipyards Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Shipyard Workers at High Risk for Asbestos-Related Diseases",
        content: "Naval and commercial shipbuilding facilities represent one of the most significant sources of asbestos exposure in American industrial history. From World War II through the 1970s, shipyard workers used asbestos extensively in ship construction, repair, and maintenance. The confined spaces aboard ships, combined with the cutting, sawing, and removal of asbestos-containing materials, created extremely hazardous working conditions. Shipyard workers, including welders, pipefitters, boilermakers, and electricians, faced massive asbestos exposure that has resulted in thousands of mesothelioma cases. The U.S. Navy's extensive use of asbestos in military vessels particularly affected workers at naval shipyards across the country."
      },
      history: {
        heading: "History of Asbestos Use in Shipyards (1940s-1970s)",
        content: "The urgent demand for military vessels during World War II led to massive shipbuilding programs that relied heavily on asbestos for fireproofing and insulation. The U.S. Navy mandated asbestos use in virtually every ship component where fire resistance was required, creating widespread exposure for both military personnel and civilian shipyard workers. Commercial shipbuilding similarly embraced asbestos for its protective properties. Even after the dangers became known, shipyards continued using asbestos materials into the 1970s, and repair work on older vessels continues to pose exposure risks today. The legacy of asbestos use in shipbuilding affects workers at major shipyards from coast to coast."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Shipyard Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Ship boiler and engine room insulation",
          "Pipe lagging throughout vessels",
          "Bulkhead and deck insulation",
          "Gaskets and valve packing materials",
          "Electrical cable insulation",
          "Adhesives and mastics",
          "Paint and coating products",
          "Welding blankets and protective gear",
          "Turbine insulation",
          "Ventilation system components"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Shipyard Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Shipyard workers face extraordinarily high rates of asbestos-related diseases due to the intensity and duration of their exposure. The confined spaces aboard ships concentrated asbestos fibers to dangerous levels, while poor ventilation allowed fibers to accumulate. Studies consistently show shipyard workers have among the highest incidence rates of mesothelioma, often 10-15 times higher than the general population. The risk affected all trades within shipyards, from those directly handling asbestos to workers in adjacent areas contaminated by airborne fibers. Secondary exposure also affected family members through asbestos dust on work clothes."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Shipyard workers have successfully pursued compensation through various legal channels, including lawsuits against ship owners, asbestos manufacturers, and the U.S. government for naval shipyard exposures. The Longshore and Harbor Workers' Compensation Act provides benefits for maritime workers, while veterans may receive VA benefits for service-connected asbestos exposure. Many asbestos product manufacturers that supplied shipyards have established bankruptcy trusts to compensate victims. The extensive documentation of asbestos use in shipbuilding often provides strong evidence for legal claims."
        }
      },
      stateFilter: {
        heading: "Find Shipyard Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 178 shipyards with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view shipyards with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Shipyards Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 178 shipyards with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/shipyards",
        "numberOfItems": 178,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter shipyards by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/shipyards?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Shipyards",
              "item": "https://asbestosexposuresites.com/category/shipyards"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Shipyards with Asbestos Exposure",
        "description": "Complete list of shipyards with documented asbestos exposure, filterable by state",
        "numberOfItems": 178,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Shipyards",
            "item": {
              "@type": "Thing",
              "name": "178 facilities available through state selection",
              "description": "Use the interactive state filter to view shipyards in your state"
            }
          }
        ]
      }
    }
  },
  
  "commercial-buildings": {
    name: "Commercial Buildings",
    slug: "commercial-buildings",
    facilityCount: 312,
    pageTitle: "Commercial Buildings Asbestos Exposure Sites - 312 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 312 commercial buildings with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "commercial building asbestos exposure, office building asbestos, retail asbestos exposure, hotel mesothelioma, asbestos commercial facilities",
    h1Title: "Commercial Buildings Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Commercial Building Workers at High Risk for Asbestos-Related Diseases",
        content: "Commercial buildings constructed between 1930 and 1980 extensively used asbestos-containing materials in their construction and maintenance. Office buildings, retail stores, hotels, and other commercial structures incorporated asbestos in dozens of building products for fireproofing, insulation, and durability. Workers involved in the construction, renovation, maintenance, and demolition of these buildings faced significant asbestos exposure. Building occupants, including office workers and customers, also faced exposure risks from deteriorating asbestos materials. The widespread use of asbestos in commercial construction has created an ongoing legacy of exposure risk that continues to affect workers performing renovations and demolitions today."
      },
      history: {
        heading: "History of Asbestos Use in Commercial Buildings (1930s-1980s)",
        content: "The commercial construction boom of the mid-20th century coincided with the peak use of asbestos in building materials. Asbestos was seen as a miracle material that could provide fire protection, sound dampening, and insulation at low cost. Major cities saw the construction of thousands of commercial buildings using asbestos-containing materials in virtually every component from foundation to roof. Building codes often required asbestos use for fire protection, particularly in high-rise structures. Even after health risks became known, the construction industry continued using asbestos products into the 1980s, creating a massive inventory of contaminated buildings."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Commercial Buildings",
        subheading: "Common Exposure Sources",
        items: [
          "Spray-on fireproofing containing up to 40% asbestos",
          "Acoustic ceiling tiles and panels",
          "Vinyl floor tiles and adhesives",
          "Pipe and boiler insulation",
          "HVAC duct insulation and vibration dampers",
          "Roofing materials and felts",
          "Drywall joint compounds and texture coatings",
          "Elevator brake shoes and equipment",
          "Electrical panel partitions",
          "Window glazing and caulking compounds"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Commercial Building Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Workers in commercial buildings face varied but significant asbestos exposure risks. Construction workers, maintenance personnel, and renovation contractors experience the highest exposures when disturbing asbestos-containing materials. Office workers and building occupants face lower but chronic exposure from deteriorating materials releasing fibers into the air. Studies show elevated rates of asbestos-related diseases among construction trades, maintenance workers, and even office workers in older buildings. The intermittent nature of exposure in commercial buildings can make it difficult to identify specific exposure sources, complicating medical diagnosis and legal claims."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Commercial building owners, contractors, and asbestos product manufacturers face liability for exposures occurring during construction, maintenance, and renovation activities. Property owners have a legal duty to identify and properly manage asbestos-containing materials. Workers exposed in commercial buildings may pursue workers' compensation claims, third-party lawsuits against product manufacturers, and premises liability claims against negligent property owners. The presence of multiple contractors and subcontractors on commercial projects often allows victims to pursue claims against multiple potentially liable parties."
        }
      },
      stateFilter: {
        heading: "Find Commercial Building Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 312 commercial buildings with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view commercial buildings with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Commercial Buildings Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 312 commercial buildings with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/commercial-buildings",
        "numberOfItems": 312,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter commercial buildings by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/commercial-buildings?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Commercial Buildings",
              "item": "https://asbestosexposuresites.com/category/commercial-buildings"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Commercial Buildings with Asbestos Exposure",
        "description": "Complete list of commercial buildings with documented asbestos exposure, filterable by state",
        "numberOfItems": 312,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Commercial Buildings",
            "item": {
              "@type": "Thing",
              "name": "312 facilities available through state selection",
              "description": "Use the interactive state filter to view commercial buildings in your state"
            }
          }
        ]
      }
    }
  },
  
  "government": {
    name: "Government",
    slug: "government",
    facilityCount: 156,
    pageTitle: "Government Facilities Asbestos Exposure Sites - 156 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 156 government facilities with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "government building asbestos exposure, federal facility asbestos, military base mesothelioma, courthouse asbestos, asbestos government facilities",
    h1Title: "Government Facilities Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Government Workers at High Risk for Asbestos-Related Diseases",
        content: "Government facilities at federal, state, and local levels extensively used asbestos-containing materials in their buildings and operations from the 1930s through the 1980s. Military bases, federal buildings, state capitols, courthouses, and municipal buildings all contained significant amounts of asbestos in their construction and maintenance materials. Government workers, including civilian employees, military personnel, and contractors, faced widespread asbestos exposure during their employment. The federal government's role as both a major user of asbestos and a regulator of its use creates unique legal considerations for exposed workers seeking compensation for asbestos-related diseases."
      },
      history: {
        heading: "History of Asbestos Use in Government Facilities (1930s-1980s)",
        content: "Government construction projects from the New Deal era through the Cold War extensively used asbestos for fireproofing and insulation. Federal specifications often mandated asbestos use in government buildings, particularly for military and defense facilities. The General Services Administration and military branches purchased massive quantities of asbestos-containing products for construction and maintenance. Government facilities often served as testing grounds for new asbestos applications, exposing workers to experimental products. Despite early knowledge of health risks within government agencies, asbestos use continued due to its perceived benefits for fire safety and durability."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Government Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Spray-on fireproofing in federal buildings",
          "Pipe and boiler insulation in heating plants",
          "Floor tiles in government offices",
          "Roofing materials on military buildings",
          "Electrical insulation in power systems",
          "Vehicle brake and clutch components",
          "Gaskets in mechanical equipment",
          "Ceiling tiles and wall panels",
          "HVAC system insulation",
          "Fire doors and fire-resistant barriers"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Government Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Government workers experienced diverse asbestos exposures depending on their specific duties and work locations. Maintenance workers, custodians, and trades personnel faced the highest exposures during repair and renovation work. Office workers in older government buildings faced chronic low-level exposure from deteriorating materials. Military personnel faced additional exposures from asbestos in ships, aircraft, and vehicles. Studies show government workers have elevated rates of mesothelioma and other asbestos-related diseases, with particular risk among those who worked in older facilities or performed maintenance duties."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Government workers face unique challenges in seeking compensation for asbestos exposure. Federal employees may file claims under the Federal Employees' Compensation Act (FECA), while military veterans can seek benefits through the VA system. State and local government workers typically pursue workers' compensation claims under their respective state systems. Sovereign immunity may limit lawsuits against government entities, but workers can often pursue claims against asbestos product manufacturers and contractors. The extensive documentation typical of government employment can provide valuable evidence for exposure claims."
        }
      },
      stateFilter: {
        heading: "Find Government Facility Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 156 government facilities with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view government facilities with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Government Facilities Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 156 government facilities with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/government",
        "numberOfItems": 156,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter government facilities by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/government?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Government",
              "item": "https://asbestosexposuresites.com/category/government"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Government Facilities with Asbestos Exposure",
        "description": "Complete list of government facilities with documented asbestos exposure, filterable by state",
        "numberOfItems": 156,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Government Facilities",
            "item": {
              "@type": "Thing",
              "name": "156 facilities available through state selection",
              "description": "Use the interactive state filter to view government facilities in your state"
            }
          }
        ]
      }
    }
  },
  
  "hospitals": {
    name: "Hospitals",
    slug: "hospitals",
    facilityCount: 198,
    pageTitle: "Hospitals Asbestos Exposure Sites - 198 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 198 hospitals with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "hospital asbestos exposure, healthcare facility asbestos, medical center mesothelioma, hospital worker asbestos, asbestos healthcare facilities",
    h1Title: "Hospitals Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Healthcare Workers at High Risk for Asbestos-Related Diseases",
        content: "Healthcare facilities built or renovated between 1940 and 1980 extensively used asbestos-containing materials throughout their buildings and infrastructure. Hospitals required significant fireproofing and insulation for patient safety, leading to widespread asbestos use in construction materials, mechanical systems, and even medical equipment. Healthcare workers, maintenance staff, construction workers, and even patients faced potential asbestos exposure in these facilities. The unique requirements of hospital operations, including sterile environments and 24/7 operations, created particular challenges for asbestos management and removal, often resulting in ongoing exposure risks well into the modern era."
      },
      history: {
        heading: "History of Asbestos Use in Hospitals (1940s-1980s)",
        content: "The post-World War II expansion of America's healthcare infrastructure coincided with peak asbestos use in institutional construction. Hospitals embraced asbestos-containing materials for their fire-resistant properties, crucial for protecting vulnerable patients. Major medical centers used asbestos in virtually every building system, from structural fireproofing to laboratory equipment. The Joint Commission and other regulatory bodies often required fire-resistant construction that was most economically achieved using asbestos products. Many hospitals continued using asbestos materials into the 1980s, and older facilities still contain significant amounts of asbestos requiring careful management."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Hospital Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Spray-on fireproofing in structural steel",
          "Pipe and boiler insulation in utility tunnels",
          "Vinyl floor tiles throughout patient areas",
          "Ceiling tiles in patient rooms and corridors",
          "Laboratory hood insulation and countertops",
          "Autoclave and sterilizer insulation",
          "HVAC system components and duct insulation",
          "Electrical panel boards and wire insulation",
          "Roofing materials and flashing",
          "Fire doors and fire-stop materials"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Hospital Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Hospital workers face varied asbestos exposure risks depending on their roles and work areas. Maintenance workers, engineers, and construction trades face the highest exposures during repair and renovation work. Healthcare providers and support staff face lower but chronic exposures from deteriorating materials in older facilities. The continuous operation of hospitals often meant that asbestos work occurred while facilities remained occupied, potentially exposing patients and visitors. Studies show elevated rates of asbestos-related diseases among hospital maintenance workers and those involved in facility construction and renovation."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Hospital workers exposed to asbestos may pursue compensation through workers' compensation systems, lawsuits against asbestos product manufacturers, and potentially premises liability claims. Healthcare facilities have ongoing duties to identify and properly manage asbestos-containing materials to protect workers, patients, and visitors. The complex ownership structures of many hospitals, including public, private, and religious affiliations, can affect legal remedies available to exposed workers. Documentation of asbestos exposure in hospitals is often well-preserved due to regulatory requirements, potentially strengthening legal claims."
        }
      },
      stateFilter: {
        heading: "Find Hospital Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 198 hospitals with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view hospitals with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Hospitals Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 198 hospitals with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/hospitals",
        "numberOfItems": 198,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter hospitals by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/hospitals?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Hospitals",
              "item": "https://asbestosexposuresites.com/category/hospitals"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Hospitals with Asbestos Exposure",
        "description": "Complete list of hospitals with documented asbestos exposure, filterable by state",
        "numberOfItems": 198,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Hospitals",
            "item": {
              "@type": "Thing",
              "name": "198 facilities available through state selection",
              "description": "Use the interactive state filter to view hospitals in your state"
            }
          }
        ]
      }
    }
  },
  
  "schools": {
    name: "Schools",
    slug: "schools",
    facilityCount: 267,
    pageTitle: "Schools Asbestos Exposure Sites - 267 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 267 schools with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "school asbestos exposure, educational facility asbestos, teacher mesothelioma, school worker asbestos, asbestos educational facilities",
    h1Title: "Schools Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "School Workers at High Risk for Asbestos-Related Diseases",
        content: "Educational institutions across America extensively used asbestos-containing materials in construction and maintenance from the 1940s through the 1980s. Elementary schools, high schools, colleges, and universities incorporated asbestos in countless building products, exposing teachers, staff, maintenance workers, and even students to potentially harmful fibers. The Asbestos Hazard Emergency Response Act (AHERA) of 1986 specifically addressed asbestos in schools, requiring inspections and management plans. However, many school workers had already faced decades of exposure, and improper asbestos management continues to create risks in some educational facilities today."
      },
      history: {
        heading: "History of Asbestos Use in Schools (1940s-1980s)",
        content: "The massive expansion of American educational infrastructure following World War II relied heavily on asbestos-containing materials for economical, fire-resistant construction. School districts facing rapid enrollment growth chose asbestos products for their durability and safety features. Federal and state governments promoted school construction using standardized designs that specified asbestos materials. The discovery of asbestos hazards in schools during the 1970s and 1980s led to national concern and regulatory action. Despite AHERA requirements, many schools struggled with the cost and complexity of asbestos management, leading to ongoing exposure risks for workers."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in School Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Acoustic ceiling tiles in classrooms",
          "Vinyl floor tiles and adhesives",
          "Pipe insulation in mechanical rooms",
          "Boiler insulation in heating plants",
          "Spray-on fireproofing in gymnasiums",
          "Asbestos-cement panels and siding",
          "Stage curtains and fire safety equipment",
          "Laboratory table tops and fume hoods",
          "Roofing materials and felts",
          "HVAC duct insulation and gaskets"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for School Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "School workers face diverse asbestos exposure risks depending on their roles. Custodians, maintenance workers, and skilled trades face the highest exposures during routine maintenance and emergency repairs. Teachers and administrative staff face lower but potentially chronic exposure from deteriorating materials in older buildings. The presence of friable asbestos materials in many schools created particular risks when disturbed by water damage, renovations, or daily wear. Studies document elevated rates of asbestos-related diseases among school maintenance workers and custodians, with growing concern about long-term effects on teachers and staff."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "School workers exposed to asbestos typically pursue compensation through state workers' compensation systems, with additional potential claims against asbestos product manufacturers. Public school employees may face sovereign immunity limitations on lawsuits against school districts, while private school workers may have additional legal options. AHERA created specific requirements for asbestos management in schools, and violations can support negligence claims. The long career spans typical of educational workers can provide extensive documentation of asbestos exposure across multiple facilities and decades."
        }
      },
      stateFilter: {
        heading: "Find School Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 267 schools with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view schools with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Schools Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 267 schools with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/schools",
        "numberOfItems": 267,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter schools by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/schools?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Schools",
              "item": "https://asbestosexposuresites.com/category/schools"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Schools with Asbestos Exposure",
        "description": "Complete list of schools with documented asbestos exposure, filterable by state",
        "numberOfItems": 267,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Schools",
            "item": {
              "@type": "Thing",
              "name": "267 facilities available through state selection",
              "description": "Use the interactive state filter to view schools in your state"
            }
          }
        ]
      }
    }
  },
  
  "transportation": {
    name: "Transportation",
    slug: "transportation",
    facilityCount: 145,
    pageTitle: "Transportation Facilities Asbestos Exposure Sites - 145 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 145 transportation facilities with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "transportation asbestos exposure, railroad asbestos, airport mesothelioma, mechanic asbestos exposure, asbestos transportation facilities",
    h1Title: "Transportation Facilities Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Transportation Workers at High Risk for Asbestos-Related Diseases",
        content: "Transportation facilities and vehicles extensively used asbestos-containing materials for heat resistance and friction applications from the 1930s through the 1980s. Railroad shops, bus depots, airports, and vehicle manufacturing plants all exposed workers to asbestos through brake linings, clutches, gaskets, and insulation materials. Transportation workers, including mechanics, railroad workers, and manufacturing employees, faced significant asbestos exposure during vehicle maintenance, repair, and production. The mobile nature of transportation work meant that exposure occurred across multiple locations, creating unique challenges for documenting and addressing asbestos-related diseases."
      },
      history: {
        heading: "History of Asbestos Use in Transportation (1930s-1980s)",
        content: "The American transportation industry's growth throughout the 20th century relied heavily on asbestos for critical safety components. Brake linings and clutch facings contained high percentages of asbestos for heat resistance. Railroad companies used asbestos extensively in locomotives and rail cars for insulation and fire protection. The aviation industry incorporated asbestos in aircraft brakes, engines, and heat shields. Despite growing awareness of health risks, the transportation industry continued using asbestos components into the 1980s and beyond, arguing that no suitable substitutes existed for critical safety applications."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Transportation Facilities",
        subheading: "Common Exposure Sources",
        items: [
          "Brake linings and brake dust",
          "Clutch facings and components",
          "Locomotive boiler and pipe insulation",
          "Railroad car insulation materials",
          "Aircraft brake assemblies",
          "Engine gaskets and heat shields",
          "Electrical insulation in vehicles",
          "Shop floor tiles and materials",
          "Welding blankets and protective equipment",
          "Building insulation in maintenance facilities"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Transportation Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Transportation workers faced unique asbestos exposure patterns, with mechanics experiencing high concentrations of asbestos fibers when servicing brakes and clutches. The grinding and machining of brake components released clouds of asbestos dust in poorly ventilated shops. Railroad workers faced exposure from both locomotive insulation and brake systems. Studies show significantly elevated rates of mesothelioma and lung cancer among vehicle mechanics, railroad workers, and transportation facility maintenance staff. The mobile nature of transportation work often meant exposure across multiple locations and employers."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Transportation workers have successfully pursued compensation through various legal avenues, including lawsuits against brake manufacturers, vehicle companies, and asbestos producers. Railroad workers may file claims under the Federal Employers Liability Act (FELA), which provides broader remedies than typical workers' compensation. Mechanics and other transportation workers often have claims against multiple brake and parts manufacturers. The widespread use of asbestos in transportation created extensive documentation that can support exposure claims, though the mobile nature of the work can complicate establishing specific exposure locations."
        }
      },
      stateFilter: {
        heading: "Find Transportation Facility Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 145 transportation facilities with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view transportation facilities with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Transportation Facilities Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 145 transportation facilities with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/transportation",
        "numberOfItems": 145,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter transportation facilities by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/transportation?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Transportation",
              "item": "https://asbestosexposuresites.com/category/transportation"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Transportation Facilities with Asbestos Exposure",
        "description": "Complete list of transportation facilities with documented asbestos exposure, filterable by state",
        "numberOfItems": 145,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Transportation Facilities",
            "item": {
              "@type": "Thing",
              "name": "145 facilities available through state selection",
              "description": "Use the interactive state filter to view transportation facilities in your state"
            }
          }
        ]
      }
    }
  },
  
  "residential": {
    name: "Residential",
    slug: "residential",
    facilityCount: 289,
    pageTitle: "Residential Buildings Asbestos Exposure Sites - 289 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 289 residential buildings with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    metaKeywords: "residential building asbestos exposure, apartment asbestos, housing project mesothelioma, maintenance worker asbestos, asbestos residential facilities",
    h1Title: "Residential Buildings Asbestos Exposure Sites | Mesothelioma Risk Locations",
    sections: {
      overview: {
        heading: "Residential Workers at High Risk for Asbestos-Related Diseases",
        content: "Residential buildings constructed between 1930 and 1980 commonly contained asbestos materials in numerous applications, from insulation to decorative finishes. Apartment complexes, public housing projects, and residential developments exposed construction workers, maintenance staff, and renovation contractors to asbestos fibers. Unlike single-family homes, large residential buildings required extensive fireproofing and mechanical systems that often contained asbestos. Workers involved in building, maintaining, and renovating these properties faced significant exposure risks that continue today during renovation and demolition projects."
      },
      history: {
        heading: "History of Asbestos Use in Residential Buildings (1930s-1980s)",
        content: "The post-war housing boom led to massive residential construction projects that frequently used asbestos-containing materials for their fire-resistant and insulating properties. Large apartment buildings and housing projects built during urban renewal programs extensively used asbestos in fireproofing, floor tiles, and insulation. Public housing authorities and private developers chose asbestos products for their durability and low cost. The shift away from asbestos in residential construction came slowly, with some materials used well into the 1980s. Today's renovation and maintenance work in older residential buildings continues to pose exposure risks."
      },
      exposureSources: {
        heading: "Asbestos Exposure Sources in Residential Buildings",
        subheading: "Common Exposure Sources",
        items: [
          "Spray-on fireproofing in high-rise apartments",
          "Vinyl floor tiles and adhesives",
          "Pipe and boiler insulation in mechanical rooms",
          "Ceiling tiles and textured coatings",
          "Roofing materials and tar paper",
          "Window glazing and caulking",
          "HVAC duct insulation",
          "Electrical panel components",
          "Elevator brake shoes and cables",
          "Drywall joint compounds"
        ]
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Residential Workers",
        healthRisks: {
          subheading: "Health Risks",
          content: "Workers in residential buildings face varied asbestos exposure depending on their specific duties. Maintenance workers, superintendents, and skilled trades face the highest exposures during repair and renovation work. The ongoing occupancy of residential buildings often meant that asbestos work occurred in occupied spaces, potentially spreading contamination. Studies show elevated rates of asbestos-related diseases among residential maintenance workers, particularly those who worked in older urban housing complexes. The informal nature of some residential maintenance work can make documenting exposure challenging."
        },
        legalContext: {
          subheading: "Legal Context",
          content: "Workers exposed to asbestos in residential buildings may pursue workers' compensation claims and lawsuits against asbestos product manufacturers. Property management companies and building owners have duties to identify and properly manage asbestos hazards. The complex ownership structures of many residential properties, including cooperatives, condominiums, and public housing, can affect available legal remedies. Maintenance workers and contractors often have claims against multiple product manufacturers based on the variety of asbestos materials used in residential construction."
        }
      },
      stateFilter: {
        heading: "Find Residential Building Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "This directory contains 289 residential buildings with documented asbestos exposure. Use the dropdown menu to filter facilities by state and view detailed information about specific exposure sites in your area.",
        instruction: "Select a state to view residential buildings with documented asbestos exposure."
      }
    },
    structuredData: {
      collectionPage: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Residential Buildings Asbestos Exposure Sites Directory",
        "description": "Interactive directory of 289 residential buildings with documented asbestos exposure across the United States",
        "url": "https://asbestosexposuresites.com/category/residential",
        "numberOfItems": 289,
        "hasPart": {
          "@type": "WebPageElement",
          "name": "State Filter Interface",
          "description": "Interactive dropdown to filter residential buildings by state"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "name": "Filter by State",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://asbestosexposuresites.com/category/residential?state={state}",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform"
            ]
          },
          "query-input": "required name=state"
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://asbestosexposuresites.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Residential",
              "item": "https://asbestosexposuresites.com/category/residential"
            }
          ]
        }
      },
      itemList: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Residential Buildings with Asbestos Exposure",
        "description": "Complete list of residential buildings with documented asbestos exposure, filterable by state",
        "numberOfItems": 289,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Florida Residential Buildings",
            "item": {
              "@type": "Thing",
              "name": "289 facilities available through state selection",
              "description": "Use the interactive state filter to view residential buildings in your state"
            }
          }
        ]
      }
    }
  }
};

// Helper function to get category by slug
export function getCategoryBySlug(slug) {
  return categoryInfo[slug] || null;
}

// Helper function to get all category slugs
export function getAllCategorySlugs() {
  return Object.keys(categoryInfo);
}

// Helper function to get all categories as array
export function getAllCategories() {
  return Object.values(categoryInfo);
}

// Export categoryInfo as named export
export { categoryInfo };
