import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, FileText, Users, Scale, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | AsbestosExposureSites.com";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact AsbestosExposureSites.com
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a lead generation service that connects individuals with qualified attorneys specializing in asbestos exposure cases. 
            We are not a law firm and do not provide legal advice.
          </p>
        </div>

        {/* Main Contact Card */}
        <Card className="mb-8 border-2 border-teal-200">
          <CardHeader className="bg-teal-50">
            <CardTitle className="flex items-center text-teal-800 text-2xl">
              <Mail className="w-6 h-6 mr-3" />
              General Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                For general inquiries, questions about our services, or to connect with qualified attorneys:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <a 
                  href="mailto:contact@asbestosexposuresites.com" 
                  className="text-2xl font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  contact@asbestosexposuresites.com
                </a>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                We typically respond within 24 hours
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <Scale className="w-5 h-5 mr-2" />
                Legal Referrals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Looking for legal representation for asbestos exposure or mesothelioma cases? 
                We connect you with qualified attorneys who specialize in these cases.
              </p>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-sm text-blue-800 font-medium">
                  Use our facility search to document your exposure, then contact us for attorney referrals.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-800">
                <MessageCircle className="w-5 h-5 mr-2" />
                Media & Advertising
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-4">
                Interested in advertising opportunities or media partnerships with AsbestosExposureSites.com?
              </p>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-800 font-medium">
                  Email us about display advertising, sponsored content, or partnership opportunities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mb-8 bg-gradient-to-r from-teal-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Important Notice</h2>
              <p className="mb-4">
                AsbestosExposureSites.com is a lead generation service that connects individuals with qualified attorneys. 
                We are not a law firm and do not provide legal advice.
              </p>
              <p className="text-sm opacity-90">
                Multiple attorneys may contact you regarding your inquiry. You are under no obligation to hire any attorney who contacts you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-teal-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Facility Database</h3>
              <p className="text-gray-600 text-sm mb-4">
                80,000+ documented asbestos exposure sites nationwide
              </p>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Search Sites
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-3 text-teal-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Attorney Network</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connected to experienced mesothelioma attorneys nationwide
              </p>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <FileText className="w-8 h-8 mx-auto mb-3 text-teal-600" />
              <h3 className="font-semibold text-gray-900 mb-2">Free Resources</h3>
              <p className="text-gray-600 text-sm mb-4">
                Information about asbestos exposure and legal rights
              </p>
              <Button variant="outline" size="sm">
                View Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Navigation */}
        <div className="text-center">
          <Link href="/">
            <Button variant="default" className="bg-teal-600 hover:bg-teal-700">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}