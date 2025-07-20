import { useEffect, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { categoryInfo } from "./category";

// Import the comprehensive category content
const enhancedCategoryInfo = {
  "manufacturing": {
    name: "Manufacturing",
    slug: "manufacturing",
    pageTitle: "Manufacturing Asbestos Exposure Sites - 234 Facilities Nationwide | AsbestosExposureSites.com",
    metaDescription: "Comprehensive directory of 234 manufacturing facilities with documented asbestos exposure. Interactive state filtering to find exposure sites, learn about health risks, and get legal help.",
    h1Title: "Manufacturing Asbestos Exposure Sites | High-Risk Industrial Facilities",
    sections: {
      overview: {
        heading: "Manufacturing Workers at High Risk for Asbestos-Related Diseases",
        content: "Manufacturing workers face some of the highest documented levels of occupational asbestos exposure in American industrial history. From the 1940s through the 1980s, industrial manufacturing plants extensively used asbestos-containing materials, creating hazardous working conditions that have resulted in thousands of mesothelioma cases among manufacturing workers and their families. The Occupational Safety and Health Administration estimates that 1.3 million employees in manufacturing and construction still face significant asbestos exposure risks. Manufacturing facilities represent a critical category of asbestos exposure sites where workers routinely handled raw asbestos fibers and worked in environments with poor ventilation and high concentrations of airborne asbestos dust. These industrial settings, which include steel manufacturing, automotive parts production, textile facilities, and chemical processing plants, have been linked to elevated rates of mesothelioma, lung cancer, and asbestosis among former employees."
      },
      history: {
        heading: "History of Asbestos Use in Manufacturing (1940s-1980s)",
        content: "The American manufacturing boom following World War II coincided with the peak period of industrial asbestos use. Manufacturing corporations relied heavily on asbestos for its fire-resistant and insulating properties, particularly in high-temperature industrial processes involving furnaces, boilers, and industrial ovens. The mineral's heat resistance, durability, and low cost made it an ideal material for industrial applications across multiple manufacturing sectors. During this period, major manufacturing corporations knowingly exposed workers to dangerous levels of asbestos fibers despite mounting evidence of health risks. Internal company documents revealed during litigation demonstrate that many manufacturers actively concealed the dangers of asbestos exposure from their workforce while continuing to use asbestos-containing materials well into the 1980s. A comprehensive review published in Epidemiology and Medical Statistics found that manufacturing workers experienced asbestos exposure levels often exceeding 5 fibers per cubic centimeter, significantly above current OSHA permissible exposure limits. The widespread industrial use of asbestos during the mid-20th century has created a lasting legacy of occupational disease. Manufacturing workers from this era continue to be diagnosed with asbestos-related diseases decades after their initial exposure, reflecting the long latency period typical of asbestos-induced illnesses."
      },
      exposureSources: {
        heading: "Common Asbestos Exposure Sources in Manufacturing",
        subheading: "High-Risk Manufacturing Products and Materials",
        items: [
          "Boiler and furnace insulation containing up to 80% asbestos content",
          "Pipe insulation and lagging materials used throughout facilities",
          "High-temperature industrial oven insulation",
          "Steam line and process pipe coverings",
          "Gaskets, packing materials, and valve seals",
          "Brake linings and clutch facings in industrial vehicles",
          "Electrical insulation and wiring components",
          "Machine components requiring heat resistance",
          "Ceiling tiles and spray-on fireproofing applications",
          "Roofing materials and floor tiles",
          "Asbestos cement products used in facility construction",
          "Protective coatings and weatherproofing materials",
          "Protective clothing, gloves, and aprons",
          "Heat-resistant suits for high-temperature work",
          "Respiratory protection equipment containing asbestos fibers"
        ],
        additionalContent: "Manufacturing facilities utilized asbestos in numerous applications, creating multiple pathways for worker exposure. The Occupational Safety and Health Administration has documented extensive use of asbestos-containing materials throughout industrial manufacturing environments. Industry-specific manufacturing exposure patterns varied by sector: Steel Manufacturing facilities recorded exposure levels exceeding contemporary OSHA permissible exposure limits, Automotive Manufacturing involved direct handling of asbestos-containing friction materials, Textile Manufacturing facilities handled raw asbestos fibers during processing, and Chemical Processing plants utilized asbestos in high-temperature process equipment."
      },
      healthAndLegal: {
        heading: "Health Risks and Legal Rights for Manufacturing Workers",
        healthRisks: {
          subheading: "Disease Patterns in Manufacturing Workers",
          content: "Manufacturing workers experienced some of the highest documented rates of asbestos-related diseases among all occupational groups. The combination of high exposure levels, poor ventilation, and extended exposure periods created particularly hazardous conditions in industrial manufacturing environments. Mesothelioma incidence studies have consistently shown elevated rates of pleural and peritoneal mesothelioma among manufacturing workers. The National Cancer Institute confirms that most mesothelioma cases result from occupational asbestos exposure, with manufacturing workers representing a significant proportion of diagnosed patients. Manufacturing workers exposed to asbestos face substantially increased lung cancer risk, with research demonstrating that the combination of asbestos exposure and smoking creates synergistic effects. The pneumoconiosis asbestosis occurs frequently in manufacturing workers who experienced prolonged exposure to high concentrations of asbestos fibers. Asbestos-related diseases typically develop 10 to 50 years after initial exposure, meaning manufacturing workers exposed during the peak usage period continue to be diagnosed today. Manufacturing workers unknowingly exposed family members to asbestos through take-home contamination, with studies documenting increased mesothelioma risk among family members of heavily exposed industrial workers."
        },
        legalContext: {
          subheading: "Legal Rights and Compensation",
          content: "Manufacturing workers diagnosed with asbestos-related diseases have multiple avenues for seeking compensation, including asbestos trust funds, personal injury lawsuits, and workers' compensation claims. More than 100 companies have established asbestos bankruptcy trust funds since the early 1980s, with over 60 trusts remaining active as of 2025. These funds contain over $30 billion set aside specifically for asbestos exposure victims. Manufacturing workers with mesothelioma typically receive between $300,000 and $400,000 from trust fund claims, with some claimants receiving up to $750,000 depending on their exposure history. Major manufacturing-related trust funds include USG Corporation Trust (initially funded with $4 billion), Pittsburgh Corning Corporation Trust ($3.5 billion in initial assets), and Johns Manville Trust (established in 1987). Manufacturing workers can file personal injury lawsuits against non-bankrupt companies, with average mesothelioma settlements ranging from $1 million to $2 million and jury verdicts averaging between $5 million and $11.4 million. The statute of limitations for asbestos-related claims typically begins at diagnosis rather than exposure, recognizing the long latency period of asbestos diseases."
        }
      },
      stateFilter: {
        heading: "Find Manufacturing Asbestos Exposure Sites by State",
        description: "Interactive State Filter:",
        content: "Use the dropdown menu below to explore documented asbestos exposure sites in manufacturing facilities across the United States. Our comprehensive database includes detailed information about specific facilities, exposure periods, and facility types to help identify relevant exposure locations.",
        instruction: "Select a state to view manufacturing facilities with documented asbestos exposure histories, including facility names, locations, operational periods, and types of manufacturing conducted at each site."
      },
      industriesAffected: {
        heading: "Manufacturing Industries with Documented Asbestos Exposure",
        industries: [
          {
            name: "Steel and Metal Manufacturing",
            description: "Steel production facilities extensively used asbestos in refractory materials, protective equipment, and insulation systems. The high-temperature nature of steel manufacturing made asbestos an attractive material for heat protection and fire prevention. Workers in steel mills faced exposure during maintenance of furnaces, handling of protective equipment, and work around insulated systems."
          },
          {
            name: "Automotive Parts Manufacturing",
            description: "The automotive manufacturing industry's extensive use of asbestos in brake pads, clutch facings, and gaskets created significant occupational exposure risks. Workers involved in manufacturing, testing, and quality control of these components faced direct contact with asbestos-containing materials on a daily basis."
          },
          {
            name: "Textile and Fabric Manufacturing",
            description: "Textile manufacturing facilities produced asbestos-containing fabrics, protective clothing, and industrial textiles. Workers in these facilities handled raw asbestos fibers during processing, weaving, and finishing operations, creating high levels of airborne asbestos dust."
          },
          {
            name: "Chemical and Petrochemical Manufacturing",
            description: "Chemical processing plants used asbestos in equipment requiring chemical and heat resistance. Workers maintained and operated systems containing asbestos gaskets, seals, and insulation materials, particularly in high-temperature chemical processes."
          },
          {
            name: "Construction Materials Manufacturing",
            description: "Facilities manufacturing building materials, including asbestos cement products, roofing materials, and insulation products, exposed workers to high concentrations of asbestos fibers during production and quality control processes."
          },
          {
            name: "Electronics and Electrical Manufacturing",
            description: "Electronics manufacturing facilities used asbestos in electrical insulation, circuit boards, and heat-resistant components. Workers assembled and tested products containing asbestos materials in often poorly ventilated environments."
          }
        ]
      },
      callToAction: {
        heading: "Were You Exposed to Asbestos in Manufacturing?",
        workers: {
          subheading: "For Workers and Former Employees",
          content: "If you worked at manufacturing facilities and have been diagnosed with mesothelioma, lung cancer, or other asbestos-related diseases, you may be entitled to significant compensation. Manufacturing workers have successfully recovered millions of dollars through trust fund claims and legal settlements. Your exposure at manufacturing facilities may qualify you for compensation from multiple sources, including asbestos trust funds established by bankrupt manufacturers and lawsuits against companies that supplied asbestos products to your workplace."
        },
        families: {
          subheading: "For Family Members",
          content: "If your loved one worked in manufacturing and developed an asbestos-related disease, you may be eligible to file wrongful death claims and seek compensation for medical expenses, lost income, and other damages. Family members who experienced secondary exposure may also have valid claims."
        },
        legal: {
          subheading: "For Legal Professionals",
          content: "Our comprehensive database of manufacturing exposure sites provides detailed facility information, operational periods, and documented exposure sources to support case development and expert testimony in asbestos litigation. Manufacturing workers and their families deserve justice for the harm caused by decades of corporate negligence in concealing asbestos dangers. Contact qualified legal counsel to evaluate your potential claims and protect your rights to compensation."
        }
      },
      citations: {
        heading: "References",
        references: [
          {
            id: 1,
            text: "Occupational Safety and Health Administration. \"Asbestos - Overview.\" U.S. Department of Labor.",
            url: "https://www.osha.gov/asbestos"
          },
          {
            id: 2,
            text: "Federal Register. \"Asbestos Exposure Limit.\" Vol. 70, No. 145, July 29, 2005.",
            url: "https://www.federalregister.gov/documents/2005/07/29/05-14510/asbestos-exposure-limit"
          },
          {
            id: 3,
            text: "Hodgson JT, Darton A. \"The quantitative risks of mesothelioma and lung cancer in relation to asbestos exposure.\" Health and Safety Executive, 2000.",
            url: ""
          },
          {
            id: 4,
            text: "Occupational Safety and Health Administration. \"29 CFR 1910.1001 - Asbestos.\" U.S. Department of Labor.",
            url: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1001"
          },
          {
            id: 5,
            text: "\"Occupational exposure to asbestos in the steel industry (1972–2006).\" Journal of Exposure Science & Environmental Epidemiology, Vol. 34, 2024.",
            url: "https://www.nature.com/articles/s41370-023-00576-4"
          },
          {
            id: 6,
            text: "National Cancer Institute. \"Asbestos Exposure and Cancer Risk Fact Sheet.\" National Institutes of Health.",
            url: "https://www.cancer.gov/about-cancer/causes-prevention/risk/substances/asbestos/asbestos-fact-sheet"
          },
          {
            id: 7,
            text: "Agency for Toxic Substances and Disease Registry. \"Asbestos Toxicity: Who Is at Risk of Exposure to Asbestos?\" Centers for Disease Control and Prevention.",
            url: "https://archive.cdc.gov/www_atsdr_cdc_gov/csem/asbestos/who_is_at_risk.html"
          },
          {
            id: 8,
            text: "Ibid.",
            url: ""
          },
          {
            id: 9,
            text: "Occupational Safety and Health Administration. \"Asbestos - Evaluating and Controlling Exposure.\" U.S. Department of Labor.",
            url: "https://www.osha.gov/asbestos/evaluating-controlling-exposure"
          },
          {
            id: 10,
            text: "Multiple trust fund annual reports and legal filings, 2024-2025.",
            url: ""
          },
          {
            id: 11,
            text: "Various trust fund payment percentage data and settlement reports, 2024.",
            url: ""
          },
          {
            id: 12,
            text: "Mealey's Litigation Reports: Asbestos, various issues 2024-2025.",
            url: ""
          },
          {
            id: 13,
            text: "USG Corporation Asbestos Trust annual reports.",
            url: ""
          },
          {
            id: 14,
            text: "Pittsburgh Corning Corporation Trust documentation.",
            url: ""
          },
          {
            id: 15,
            text: "Manville Personal Injury Settlement Trust annual reports.",
            url: ""
          },
          {
            id: 16,
            text: "Mealey's Litigation Reports: Asbestos, Settlement and Verdict Database, 2024-2025.",
            url: ""
          }
        ]
      }
    },
    // Keep old structure for backwards compatibility
    description: "Industrial manufacturing plants across the United States extensively used asbestos-containing materials from the 1940s through the 1980s. These facilities represent some of the highest concentrations of occupational asbestos exposure in American industrial history. Manufacturing workers routinely handled raw asbestos fibers and worked in environments saturated with asbestos dust from insulation, machinery components, and protective equipment. The combination of high-temperature industrial processes and the widespread use of asbestos for heat resistance created particularly hazardous conditions that have resulted in thousands of mesothelioma and asbestos-related disease cases among manufacturing workers and their families.",
    historicalContext: "The American manufacturing boom following World War II coincided with the peak period of industrial asbestos use. Manufacturing corporations relied heavily on asbestos for its fire-resistant and insulating properties, particularly in high-temperature industrial processes involving furnaces, boilers, and industrial ovens. The mineral's heat resistance, durability, and low cost made it an ideal material for industrial applications across multiple manufacturing sectors.",
    exposureSources: [
      "Boiler and furnace insulation containing up to 80% asbestos content",
      "Pipe insulation and lagging materials used throughout facilities",
      "High-temperature industrial oven insulation",
      "Steam line and process pipe coverings",
      "Gaskets, packing materials, and valve seals",
      "Brake linings and clutch facings in industrial vehicles",
      "Electrical insulation and wiring components",
      "Machine components requiring heat resistance",
      "Ceiling tiles and spray-on fireproofing applications",
      "Roofing materials and floor tiles",
      "Asbestos cement products used in facility construction",
      "Protective coatings and weatherproofing materials",
      "Protective clothing, gloves, and aprons",
      "Heat-resistant suits for high-temperature work",
      "Respiratory protection equipment containing asbestos fibers"
    ],
    healthRisks: "Manufacturing workers faced extreme asbestos exposure levels, often working in poorly ventilated areas where asbestos fibers accumulated to dangerous concentrations. Studies have shown that manufacturing workers have some of the highest rates of mesothelioma, lung cancer, and asbestosis among all occupational groups. The latency period for asbestos-related diseases means that workers exposed decades ago are still being diagnosed today. Family members of manufacturing workers also faced secondary exposure from asbestos fibers brought home on work clothes, leading to mesothelioma cases among spouses and children who never worked directly with asbestos.",
    legalContext: "Manufacturing companies have faced extensive litigation for knowingly exposing workers to asbestos without adequate warnings or protection. Major manufacturers have paid billions in settlements and jury awards to victims and their families. Many companies filed for bankruptcy protection and established asbestos trust funds to compensate current and future victims. Workers and their families may be entitled to compensation through multiple sources including workers' compensation, personal injury lawsuits, and asbestos trust fund claims. The statute of limitations for filing claims typically begins at diagnosis, not exposure, recognizing the long latency period of asbestos-related diseases.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Asbestos cement products",
      "Friction materials (brakes, clutches)",
      "Gaskets and sealing materials",
      "Insulation products",
      "Protective equipment"
    ]
  },
  "power-plants": {
    ...categoryInfo["power-plants"],
    description: "Electric power generation facilities constructed between 1940 and 1980 used massive quantities of asbestos-containing materials throughout their operations. Both coal-fired and nuclear power plants relied heavily on asbestos insulation to protect equipment and workers from extreme temperatures reaching over 1,000 degrees Fahrenheit. Power plant workers, including boilermakers, pipefitters, electricians, and maintenance personnel, faced daily exposure to asbestos fibers during routine operations, repairs, and renovations. The confined spaces, high-temperature environments, and constant vibration in power plants created ideal conditions for asbestos fibers to become airborne, resulting in widespread contamination that affected thousands of workers across the United States.",
    historicalContext: "The rapid expansion of America's electrical infrastructure in the post-World War II era coincided with the peak use of asbestos in industrial applications. Power plants built during this period used asbestos extensively in turbines, boilers, generators, and throughout the facility's pipe systems. The extreme temperatures involved in power generation made asbestos seem like an ideal solution for protecting equipment and preventing fires. Major utility companies continued using asbestos-containing materials despite growing awareness of health risks, prioritizing operational efficiency over worker safety. Many power plants operated for decades with original asbestos insulation intact, exposing multiple generations of workers to hazardous fibers.",
    healthRisks: "Power plant workers experienced some of the highest occupational asbestos exposure levels due to the extensive use of asbestos throughout these facilities. The combination of confined spaces, high temperatures, and routine maintenance activities created perfect conditions for asbestos fiber release. Studies show power plant workers have significantly elevated rates of mesothelioma, lung cancer, and asbestosis compared to the general population. The risk extends beyond direct employees to contractors, inspection personnel, and even administrative staff who worked in contaminated areas. Family members also faced secondary exposure from asbestos dust brought home on work clothes.",
    legalContext: "Power generation companies face ongoing litigation from workers and their families affected by asbestos exposure. Many utility companies have been held liable for failing to protect workers and for continuing to use asbestos despite known health risks. Successful lawsuits have resulted in substantial verdicts and settlements for victims. Workers may pursue compensation through multiple channels including workers' compensation, personal injury lawsuits, and claims against asbestos bankruptcy trusts established by equipment manufacturers. The unique exposure patterns in power plants often allow victims to pursue claims against multiple defendants."
  },
  // Add all other categories with enhanced content...
  "shipyards": {
    name: "Shipyards",
    slug: "shipyards",
    description: "Naval and commercial shipbuilding facilities represent one of the most significant sources of asbestos exposure in American industrial history. From World War II through the 1970s, shipyard workers used asbestos extensively in ship construction, repair, and maintenance. The confined spaces aboard ships, combined with the cutting, sawing, and removal of asbestos-containing materials, created extremely hazardous working conditions. Shipyard workers, including welders, pipefitters, boilermakers, and electricians, faced massive asbestos exposure that has resulted in thousands of mesothelioma cases. The U.S. Navy's extensive use of asbestos in military vessels particularly affected workers at naval shipyards across the country.",
    historicalContext: "The urgent demand for military vessels during World War II led to massive shipbuilding programs that relied heavily on asbestos for fireproofing and insulation. The U.S. Navy mandated asbestos use in virtually every ship component where fire resistance was required, creating widespread exposure for both military personnel and civilian shipyard workers. Commercial shipbuilding similarly embraced asbestos for its protective properties. Even after the dangers became known, shipyards continued using asbestos materials into the 1970s, and repair work on older vessels continues to pose exposure risks today. The legacy of asbestos use in shipbuilding affects workers at major shipyards from coast to coast.",
    exposureSources: [
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
    ],
    healthRisks: "Shipyard workers face extraordinarily high rates of asbestos-related diseases due to the intensity and duration of their exposure. The confined spaces aboard ships concentrated asbestos fibers to dangerous levels, while poor ventilation allowed fibers to accumulate. Studies consistently show shipyard workers have among the highest incidence rates of mesothelioma, often 10-15 times higher than the general population. The risk affected all trades within shipyards, from those directly handling asbestos to workers in adjacent areas contaminated by airborne fibers. Secondary exposure also affected family members through asbestos dust on work clothes.",
    legalContext: "Shipyard workers have successfully pursued compensation through various legal channels, including lawsuits against ship owners, asbestos manufacturers, and the U.S. government for naval shipyard exposures. The Longshore and Harbor Workers' Compensation Act provides benefits for maritime workers, while veterans may receive VA benefits for service-connected asbestos exposure. Many asbestos product manufacturers that supplied shipyards have established bankruptcy trusts to compensate victims. The extensive documentation of asbestos use in shipbuilding often provides strong evidence for legal claims.",
    peakUseYears: "1940s-1970s",
    commonProducts: [
      "Ship insulation materials",
      "Gaskets and packing",
      "Protective equipment",
      "Adhesives and coatings",
      "Fireproofing materials"
    ]
  },
  "commercial-buildings": {
    name: "Commercial Buildings",
    slug: "commercial-buildings",
    description: "Commercial buildings constructed between 1930 and 1980 extensively used asbestos-containing materials in their construction and maintenance. Office buildings, retail stores, hotels, and other commercial structures incorporated asbestos in dozens of building products for fireproofing, insulation, and durability. Workers involved in the construction, renovation, maintenance, and demolition of these buildings faced significant asbestos exposure. Building occupants, including office workers and customers, also faced exposure risks from deteriorating asbestos materials. The widespread use of asbestos in commercial construction has created an ongoing legacy of exposure risk that continues to affect workers performing renovations and demolitions today.",
    historicalContext: "The commercial construction boom of the mid-20th century coincided with the peak use of asbestos in building materials. Asbestos was seen as a miracle material that could provide fire protection, sound dampening, and insulation at low cost. Major cities saw the construction of thousands of commercial buildings using asbestos-containing materials in virtually every component from foundation to roof. Building codes often required asbestos use for fire protection, particularly in high-rise structures. Even after health risks became known, the construction industry continued using asbestos products into the 1980s, creating a massive inventory of contaminated buildings.",
    exposureSources: [
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
    ],
    healthRisks: "Workers in commercial buildings face varied but significant asbestos exposure risks. Construction workers, maintenance personnel, and renovation contractors experience the highest exposures when disturbing asbestos-containing materials. Office workers and building occupants face lower but chronic exposure from deteriorating materials releasing fibers into the air. Studies show elevated rates of asbestos-related diseases among construction trades, maintenance workers, and even office workers in older buildings. The intermittent nature of exposure in commercial buildings can make it difficult to identify specific exposure sources, complicating medical diagnosis and legal claims.",
    legalContext: "Commercial building owners, contractors, and asbestos product manufacturers face liability for exposures occurring during construction, maintenance, and renovation activities. Property owners have a legal duty to identify and properly manage asbestos-containing materials. Workers exposed in commercial buildings may pursue workers' compensation claims, third-party lawsuits against product manufacturers, and premises liability claims against negligent property owners. The presence of multiple contractors and subcontractors on commercial projects often allows victims to pursue claims against multiple potentially liable parties.",
    peakUseYears: "1930s-1980s",
    commonProducts: [
      "Fireproofing spray",
      "Ceiling tiles",
      "Floor tiles and adhesives",
      "Insulation materials",
      "Joint compounds"
    ]
  },
  "government": {
    name: "Government",
    slug: "government",
    description: "Government facilities at federal, state, and local levels extensively used asbestos-containing materials in their buildings and operations from the 1930s through the 1980s. Military bases, federal buildings, state capitols, courthouses, and municipal buildings all contained significant amounts of asbestos in their construction and maintenance materials. Government workers, including civilian employees, military personnel, and contractors, faced widespread asbestos exposure during their employment. The federal government's role as both a major user of asbestos and a regulator of its use creates unique legal considerations for exposed workers seeking compensation for asbestos-related diseases.",
    historicalContext: "Government construction projects from the New Deal era through the Cold War extensively used asbestos for fireproofing and insulation. Federal specifications often mandated asbestos use in government buildings, particularly for military and defense facilities. The General Services Administration and military branches purchased massive quantities of asbestos-containing products for construction and maintenance. Government facilities often served as testing grounds for new asbestos applications, exposing workers to experimental products. Despite early knowledge of health risks within government agencies, asbestos use continued due to its perceived benefits for fire safety and durability.",
    exposureSources: [
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
    ],
    healthRisks: "Government workers experienced diverse asbestos exposures depending on their specific duties and work locations. Maintenance workers, custodians, and trades personnel faced the highest exposures during repair and renovation work. Office workers in older government buildings faced chronic low-level exposure from deteriorating materials. Military personnel faced additional exposures from asbestos in ships, aircraft, and vehicles. Studies show government workers have elevated rates of mesothelioma and other asbestos-related diseases, with particular risk among those who worked in older facilities or performed maintenance duties.",
    legalContext: "Government workers face unique challenges in seeking compensation for asbestos exposure. Federal employees may file claims under the Federal Employees' Compensation Act (FECA), while military veterans can seek benefits through the VA system. State and local government workers typically pursue workers' compensation claims under their respective state systems. Sovereign immunity may limit lawsuits against government entities, but workers can often pursue claims against asbestos product manufacturers and contractors. The extensive documentation typical of government employment can provide valuable evidence for exposure claims.",
    peakUseYears: "1930s-1980s",
    commonProducts: [
      "Fireproofing materials",
      "Building insulation",
      "Floor and ceiling tiles",
      "Roofing materials",
      "Mechanical insulation"
    ]
  },
  "hospitals": {
    name: "Hospitals",
    slug: "hospitals",
    description: "Healthcare facilities built or renovated between 1940 and 1980 extensively used asbestos-containing materials throughout their buildings and infrastructure. Hospitals required significant fireproofing and insulation for patient safety, leading to widespread asbestos use in construction materials, mechanical systems, and even medical equipment. Healthcare workers, maintenance staff, construction workers, and even patients faced potential asbestos exposure in these facilities. The unique requirements of hospital operations, including sterile environments and 24/7 operations, created particular challenges for asbestos management and removal, often resulting in ongoing exposure risks well into the modern era.",
    historicalContext: "The post-World War II expansion of America's healthcare infrastructure coincided with peak asbestos use in institutional construction. Hospitals embraced asbestos-containing materials for their fire-resistant properties, crucial for protecting vulnerable patients. Major medical centers used asbestos in virtually every building system, from structural fireproofing to laboratory equipment. The Joint Commission and other regulatory bodies often required fire-resistant construction that was most economically achieved using asbestos products. Many hospitals continued using asbestos materials into the 1980s, and older facilities still contain significant amounts of asbestos requiring careful management.",
    exposureSources: [
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
    ],
    healthRisks: "Hospital workers face varied asbestos exposure risks depending on their roles and work areas. Maintenance workers, engineers, and construction trades face the highest exposures during repair and renovation work. Healthcare providers and support staff face lower but chronic exposures from deteriorating materials in older facilities. The continuous operation of hospitals often meant that asbestos work occurred while facilities remained occupied, potentially exposing patients and visitors. Studies show elevated rates of asbestos-related diseases among hospital maintenance workers and those involved in facility construction and renovation.",
    legalContext: "Hospital workers exposed to asbestos may pursue compensation through workers' compensation systems, lawsuits against asbestos product manufacturers, and potentially premises liability claims. Healthcare facilities have ongoing duties to identify and properly manage asbestos-containing materials to protect workers, patients, and visitors. The complex ownership structures of many hospitals, including public, private, and religious affiliations, can affect legal remedies available to exposed workers. Documentation of asbestos exposure in hospitals is often well-preserved due to regulatory requirements, potentially strengthening legal claims.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Fireproofing spray",
      "Insulation materials",
      "Floor and ceiling tiles",
      "Laboratory equipment",
      "HVAC components"
    ]
  },
  "schools": {
    name: "Schools",
    slug: "schools",
    description: "Educational institutions across America extensively used asbestos-containing materials in construction and maintenance from the 1940s through the 1980s. Elementary schools, high schools, colleges, and universities incorporated asbestos in countless building products, exposing teachers, staff, maintenance workers, and even students to potentially harmful fibers. The Asbestos Hazard Emergency Response Act (AHERA) of 1986 specifically addressed asbestos in schools, requiring inspections and management plans. However, many school workers had already faced decades of exposure, and improper asbestos management continues to create risks in some educational facilities today.",
    historicalContext: "The massive expansion of American educational infrastructure following World War II relied heavily on asbestos-containing materials for economical, fire-resistant construction. School districts facing rapid enrollment growth chose asbestos products for their durability and safety features. Federal and state governments promoted school construction using standardized designs that specified asbestos materials. The discovery of asbestos hazards in schools during the 1970s and 1980s led to national concern and regulatory action. Despite AHERA requirements, many schools struggled with the cost and complexity of asbestos management, leading to ongoing exposure risks for workers.",
    exposureSources: [
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
    ],
    healthRisks: "School workers face diverse asbestos exposure risks depending on their roles. Custodians, maintenance workers, and skilled trades face the highest exposures during routine maintenance and emergency repairs. Teachers and administrative staff face lower but potentially chronic exposure from deteriorating materials in older buildings. The presence of friable asbestos materials in many schools created particular risks when disturbed by water damage, renovations, or daily wear. Studies document elevated rates of asbestos-related diseases among school maintenance workers and custodians, with growing concern about long-term effects on teachers and staff.",
    legalContext: "School workers exposed to asbestos typically pursue compensation through state workers' compensation systems, with additional potential claims against asbestos product manufacturers. Public school employees may face sovereign immunity limitations on lawsuits against school districts, while private school workers may have additional legal options. AHERA created specific requirements for asbestos management in schools, and violations can support negligence claims. The long career spans typical of educational workers can provide extensive documentation of asbestos exposure across multiple facilities and decades.",
    peakUseYears: "1940s-1980s",
    commonProducts: [
      "Ceiling and floor tiles",
      "Insulation materials",
      "Fireproofing spray",
      "Cement panels",
      "HVAC components"
    ]
  },
  "transportation": {
    name: "Transportation",
    slug: "transportation",
    description: "Transportation facilities and vehicles extensively used asbestos-containing materials for heat resistance and friction applications from the 1930s through the 1980s. Railroad shops, bus depots, airports, and vehicle manufacturing plants all exposed workers to asbestos through brake linings, clutches, gaskets, and insulation materials. Transportation workers, including mechanics, railroad workers, and manufacturing employees, faced significant asbestos exposure during vehicle maintenance, repair, and production. The mobile nature of transportation work meant that exposure occurred across multiple locations, creating unique challenges for documenting and addressing asbestos-related diseases.",
    historicalContext: "The American transportation industry's growth throughout the 20th century relied heavily on asbestos for critical safety components. Brake linings and clutch facings contained high percentages of asbestos for heat resistance. Railroad companies used asbestos extensively in locomotives and rail cars for insulation and fire protection. The aviation industry incorporated asbestos in aircraft brakes, engines, and heat shields. Despite growing awareness of health risks, the transportation industry continued using asbestos components into the 1980s and beyond, arguing that no suitable substitutes existed for critical safety applications.",
    exposureSources: [
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
    ],
    healthRisks: "Transportation workers faced unique asbestos exposure patterns, with mechanics experiencing high concentrations of asbestos fibers when servicing brakes and clutches. The grinding and machining of brake components released clouds of asbestos dust in poorly ventilated shops. Railroad workers faced exposure from both locomotive insulation and brake systems. Studies show significantly elevated rates of mesothelioma and lung cancer among vehicle mechanics, railroad workers, and transportation facility maintenance staff. The mobile nature of transportation work often meant exposure across multiple locations and employers.",
    legalContext: "Transportation workers have successfully pursued compensation through various legal avenues, including lawsuits against brake manufacturers, vehicle companies, and asbestos producers. Railroad workers may file claims under the Federal Employers Liability Act (FELA), which provides broader remedies than typical workers' compensation. Mechanics and other transportation workers often have claims against multiple brake and parts manufacturers. The widespread use of asbestos in transportation created extensive documentation that can support exposure claims, though the mobile nature of the work can complicate establishing specific exposure locations.",
    peakUseYears: "1930s-1980s",
    commonProducts: [
      "Brake linings and dust",
      "Clutch components",
      "Locomotive insulation",
      "Aircraft brake assemblies",
      "Engine gaskets"
    ]
  },
  "residential": {
    name: "Residential",
    slug: "residential",
    description: "Residential buildings constructed between 1930 and 1980 commonly contained asbestos materials in numerous applications, from insulation to decorative finishes. Apartment complexes, public housing projects, and residential developments exposed construction workers, maintenance staff, and renovation contractors to asbestos fibers. Unlike single-family homes, large residential buildings required extensive fireproofing and mechanical systems that often contained asbestos. Workers involved in building, maintaining, and renovating these properties faced significant exposure risks that continue today during renovation and demolition projects.",
    historicalContext: "The post-war housing boom led to massive residential construction projects that frequently used asbestos-containing materials for their fire-resistant and insulating properties. Large apartment buildings and housing projects built during urban renewal programs extensively used asbestos in fireproofing, floor tiles, and insulation. Public housing authorities and private developers chose asbestos products for their durability and low cost. The shift away from asbestos in residential construction came slowly, with some materials used well into the 1980s. Today's renovation and maintenance work in older residential buildings continues to pose exposure risks.",
    exposureSources: [
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
    ],
    healthRisks: "Workers in residential buildings face varied asbestos exposure depending on their specific duties. Maintenance workers, superintendents, and skilled trades face the highest exposures during repair and renovation work. The ongoing occupancy of residential buildings often meant that asbestos work occurred in occupied spaces, potentially spreading contamination. Studies show elevated rates of asbestos-related diseases among residential maintenance workers, particularly those who worked in older urban housing complexes. The informal nature of some residential maintenance work can make documenting exposure challenging.",
    legalContext: "Workers exposed to asbestos in residential buildings may pursue workers' compensation claims and lawsuits against asbestos product manufacturers. Property management companies and building owners have duties to identify and properly manage asbestos hazards. The complex ownership structures of many residential properties, including cooperatives, condominiums, and public housing, can affect available legal remedies. Maintenance workers and contractors often have claims against multiple product manufacturers based on the variety of asbestos materials used in residential construction.",
    peakUseYears: "1930s-1980s",
    commonProducts: [
      "Fireproofing materials",
      "Floor and ceiling tiles",
      "Insulation materials",
      "Roofing materials",
      "Joint compounds"
    ]
  }
};

export default function GlobalCategoryPage() {
  const [, params] = useRoute("/category/:categorySlug");
  const [location] = useLocation();
  const categorySlug = params?.categorySlug || "";
  const [selectedState, setSelectedState] = useState<string>("");
  const [displayedFacilities, setDisplayedFacilities] = useState(100);
  
  const category = enhancedCategoryInfo[categorySlug as keyof typeof enhancedCategoryInfo];

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Fetch all states for the filter dropdown
  const { data: states = [] } = useQuery({
    queryKey: ["/api/states"],
  });

  // Fetch facilities only when a state is selected
  const { data: facilities = [], isLoading: isLoadingFacilities } = useQuery({
    queryKey: ["/api/facilities", { categorySlug: categorySlug, stateId: selectedState, limit: 1000 }],
    queryFn: async () => {
      if (!selectedState || selectedState === "all") {
        // Don't fetch if no state selected
        return [];
      }
      const response = await fetch(`/api/facilities?categorySlug=${categorySlug}&stateId=${selectedState}&limit=1000`);
      if (!response.ok) throw new Error('Failed to fetch facilities');
      return response.json();
    },
    enabled: !!categorySlug && !!category && !!selectedState && selectedState !== "all",
  });

  // Facilities to display (for pagination)
  const visibleFacilities = facilities.slice(0, displayedFacilities);

  // Set page metadata
  useEffect(() => {
    if (category) {
      document.title = `${category.name} Asbestos Exposure Sites - Comprehensive Directory`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          `Comprehensive directory of ${category.name.toLowerCase()} facilities with documented asbestos exposure. Find exposure sites, learn about health risks, and get legal help.`
        );
      }
    }
  }, [category, facilities.length]);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Category not found. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: category.name }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
          <BreadcrumbNav items={breadcrumbItems} />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
              {category.sections?.h1Title || `${category.name} Asbestos Exposure Sites | Mesothelioma Risk Locations`}
            </h1>
          </div>

          {/* Overview Section */}
          {category.sections?.overview && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.overview.heading}
              </h2>
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {category.sections.overview.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* History Section */}
          {category.sections?.history && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.history.heading}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="leading-relaxed text-muted-foreground">
                    {category.sections.history.content}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Exposure Sources Section */}
          {category.sections?.exposureSources && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.exposureSources.heading}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{category.sections.exposureSources.subheading}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {category.sections.exposureSources.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  {category.sections.exposureSources.additionalContent && (
                    <p className="leading-relaxed text-muted-foreground mt-4">
                      {category.sections.exposureSources.additionalContent}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Health and Legal Information */}
          {category.sections?.healthAndLegal && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.healthAndLegal.heading}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-t-4 border-t-destructive">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                      {category.sections.healthAndLegal.healthRisks.subheading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {category.sections.healthAndLegal.healthRisks.content}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-t-4 border-t-primary">
                  <CardHeader>
                    <CardTitle className="text-xl">{category.sections.healthAndLegal.legalContext.subheading}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">
                      {category.sections.healthAndLegal.legalContext.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Industries Affected Section (NEW) */}
          {category.sections?.industriesAffected && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.industriesAffected.heading}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.sections.industriesAffected.industries.map((industry, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">{industry.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {industry.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* State Filter Section */}
          <div className="mb-8">
            {category.sections?.stateFilter ? (
              <Card className="bg-blue-50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-2xl">{category.sections.stateFilter.heading}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">
                    <strong>{category.sections.stateFilter.description}</strong> {category.sections.stateFilter.content}
                  </p>
                  <p className="mb-4">{category.sections.stateFilter.instruction}</p>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Choose a state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                  Find {category.name} Asbestos Exposure Sites by State
                </h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Select a state to view facilities:</label>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-full md:w-64">
                      <SelectValue placeholder="Choose a state..." />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          {/* Facilities Grid */}
          {!selectedState || selectedState === "" ? (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground text-lg">
                  Please select a state above to view {category.name.toLowerCase()} facilities with documented asbestos exposure.
                </p>
              </CardContent>
            </Card>
          ) : isLoadingFacilities ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No {category.name.toLowerCase()} facilities found in this state.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {visibleFacilities.map((facility: any) => (
                  <Link
                    key={facility.id}
                    href={`/${facility.state?.slug}/${facility.city?.slug}/${facility.slug}-asbestos-exposure`}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{facility.name}</CardTitle>
                        <CardDescription>
                          {facility.city?.name}, {facility.state?.name}
                        </CardDescription>
                      </CardHeader>
                      {facility.company && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Company: {facility.company}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {displayedFacilities < facilities.length && (
                <div className="text-center mb-8">
                  <Button
                    onClick={() => setDisplayedFacilities(prev => prev + 100)}
                    size="lg"
                  >
                    Load More Facilities ({facilities.length - displayedFacilities} remaining)
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Call to Action Section (NEW ENHANCED) */}
          {category.sections?.callToAction && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.callToAction.heading}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                      {category.sections.callToAction.workers.subheading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {category.sections.callToAction.workers.content}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-amber-700 dark:text-amber-300">
                      {category.sections.callToAction.families.subheading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {category.sections.callToAction.families.content}
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700 dark:text-green-300">
                      {category.sections.callToAction.legal.subheading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">
                      {category.sections.callToAction.legal.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="text-center mt-6">
                <Link href="/legal-help">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Free Legal Consultation
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Citations Section (NEW) */}
          {category.sections?.citations && category.sections.citations.references && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{fontFamily: 'Merriweather, serif'}}>
                {category.sections.citations.heading}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ol className="list-decimal list-inside space-y-2">
                    {category.sections.citations.references.map((ref) => (
                      <li key={ref.id} className="text-sm text-muted-foreground">
                        {ref.text}
                        {ref.url && (
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline"
                          >
                            [Source]
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Contact CTA - Fallback for categories without new sections */}
          {!category.sections?.callToAction && (
            <Card className="mt-12 bg-muted/50">
              <CardHeader>
                <CardTitle className="text-2xl">Were You Exposed to Asbestos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you worked at any of these {category.name.toLowerCase()} facilities and have been diagnosed with 
                  mesothelioma, lung cancer, or other asbestos-related diseases, you may be entitled to significant compensation.
                </p>
                <Link href="/legal-help">
                  <Button size="lg" className="w-full md:w-auto">
                    Get Free Legal Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
    </div>
  );
}
