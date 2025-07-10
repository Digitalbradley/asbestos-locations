import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, Clock, Shield } from "lucide-react";

export default function ThankYou() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Google Conversion Tracking
    // This will be populated with actual conversion code when Google Tags are set up
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-XXXXXXXXX/XXXXXXXX', // Replace with actual conversion ID
        'transaction_id': Date.now().toString()
      });
    }

    // Google Analytics Event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit', {
        'event_category': 'Lead Generation',
        'event_label': 'Contact Form Submission',
        'value': 1
      });
    }

    // Facebook Pixel (if needed)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You for Contacting Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your information has been submitted successfully. Up to 3 qualified attorneys or law firms may contact you regarding your inquiry within 24-48 hours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* What Happens Next */}
          <Card className="border-2 border-teal-200">
            <CardHeader className="bg-teal-50">
              <CardTitle className="flex items-center text-teal-800">
                <Clock className="w-5 h-5 mr-2" />
                What Happens Next
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-teal-100 rounded-full w-8 h-8 flex items-center justify-center text-teal-600 font-bold text-sm mr-3 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Case Review</h3>
                    <p className="text-gray-600 text-sm">Qualified attorneys will review your asbestos exposure details within 2-4 hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-teal-100 rounded-full w-8 h-8 flex items-center justify-center text-teal-600 font-bold text-sm mr-3 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Attorney Contact</h3>
                    <p className="text-gray-600 text-sm">Up to 3 qualified attorneys may contact you within 24-48 hours to discuss your case</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-teal-100 rounded-full w-8 h-8 flex items-center justify-center text-teal-600 font-bold text-sm mr-3 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Consultation</h3>
                    <p className="text-gray-600 text-sm">Get a comprehensive case evaluation at no cost to you</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-800">
                <Shield className="w-5 h-5 mr-2" />
                Important Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Sensitive</h3>
                  <p className="text-gray-600 text-sm">
                    Statute of limitations may apply to your case. Don't wait - early action protects your rights.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">No Upfront Costs</h3>
                  <p className="text-gray-600 text-sm">
                    Most attorneys work on contingency - you pay nothing unless they win your case.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Confidential</h3>
                  <p className="text-gray-600 text-sm">
                    All consultations are completely confidential and protected by attorney-client privilege.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
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

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Learn More About Mesothelioma</h3>
              <p className="text-gray-600 text-sm mb-4">
                Understanding your diagnosis and treatment options
              </p>
              <Button variant="outline" size="sm">
                Read Articles
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Asbestos Exposure Sites</h3>
              <p className="text-gray-600 text-sm mb-4">
                Find where you may have been exposed to asbestos
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
              <h3 className="font-semibold text-gray-900 mb-2">Legal Resources</h3>
              <p className="text-gray-600 text-sm mb-4">
                Understanding your rights and legal options
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