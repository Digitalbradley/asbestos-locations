import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us | AsbestosExposureSites.com";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="page-title mb-8">About AsbestosExposureSites.com</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Our Mission</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              AsbestosExposureSites.com is dedicated to helping mesothelioma victims and their families 
              identify where they may have been exposed to asbestos throughout their working lives. 
              We maintain the most comprehensive database of asbestos exposure sites across the United States, 
              providing critical information that can help victims understand their exposure history and 
              connect with qualified legal professionals.
            </p>
            
            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-lg mb-8">
              <p className="text-primary font-semibold mb-2">Why This Matters</p>
              <p className="text-muted-foreground">
                Many people diagnosed with mesothelioma struggle to remember all the places they worked 
                or visited where they might have been exposed to asbestos decades ago. Our detailed 
                database helps fill in those gaps, providing the documentation needed for legal claims 
                and peace of mind for families seeking answers.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Comprehensive Database</h3>
                <p className="text-muted-foreground">
                  We maintain detailed records of thousands of facilities across the United States 
                  where asbestos exposure occurred, including shipyards, manufacturing plants, 
                  power plants, commercial buildings, and government facilities.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Legal Referrals</h3>
                <p className="text-muted-foreground">
                  We connect victims and their families with experienced attorneys who specialize 
                  in asbestos litigation and understand the complexities of mesothelioma cases.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Educational Resources</h3>
                <p className="text-muted-foreground">
                  Our website provides valuable information about asbestos exposure risks, 
                  health effects, and legal rights to help victims and families make informed decisions.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">Free Service</h3>
                <p className="text-muted-foreground">
                  All of our services are provided free of charge to victims and families. 
                  We believe that access to this critical information should not be a barrier 
                  to seeking justice.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Our Commitment</h2>
            <div className="bg-muted/30 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-primary">Accuracy & Reliability</h3>
                <p className="text-muted-foreground mb-4">
                  We work diligently to ensure our database contains accurate, verified information 
                  from reliable historical sources, government records, and court documents.
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-primary">Privacy Protection</h3>
                <p className="text-muted-foreground mb-4">
                  We take the privacy and confidentiality of our users seriously. All personal 
                  information is handled in accordance with our Privacy Policy and applicable laws.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary">Continuous Improvement</h3>
                <p className="text-muted-foreground">
                  We regularly update our database with new information and improve our services 
                  based on user feedback and evolving legal requirements.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Important Disclaimers</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Not a Law Firm</h3>
                <p className="text-yellow-700">
                  AsbestosExposureSites.com is not a law firm and does not provide legal advice. 
                  We are an informational resource and attorney referral service.
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-yellow-800 mb-2">No Attorney-Client Relationship</h3>
                <p className="text-yellow-700">
                  Using our website or contacting us does not create an attorney-client relationship. 
                  Such relationships are formed directly between you and the attorneys we may refer you to.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Informational Purposes Only</h3>
                <p className="text-yellow-700">
                  All information on our website is for informational purposes only and should not 
                  be considered legal or medical advice. Always consult with qualified professionals 
                  for advice specific to your situation.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Get Started Today</h2>
            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <p className="text-lg text-muted-foreground mb-6">
                If you or a loved one has been diagnosed with mesothelioma or other asbestos-related 
                diseases, time may be limited to pursue legal action. Don't wait to get the help you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/legal-help">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Free Legal Consultation
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">General Inquiries</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Email:</strong> info@asbestosexposuresites.com
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>Phone:</strong> 1-800-ASBESTOS
                </p>
                <p className="text-muted-foreground">
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">Legal Referrals</h3>
                <p className="text-muted-foreground mb-2">
                  <strong>Email:</strong> legal@asbestosexposuresites.com
                </p>
                <p className="text-muted-foreground mb-2">
                  <strong>Emergency:</strong> Available 24/7 for urgent cases
                </p>
                <p className="text-muted-foreground">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}