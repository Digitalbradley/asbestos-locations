import { useEffect } from "react";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | AsbestosExposureSites.com";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="page-title mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 10, 2025<br />
            <strong>Last Updated:</strong> January 10, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Introduction</h2>
            <p>
              AsbestosExposureSites.com ("we," "our," or "us") operates this website to provide information about 
              asbestos exposure sites across the United States. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fill out contact forms or request legal consultations</li>
              <li>Subscribe to our newsletter or updates</li>
              <li>Contact us directly via email or phone</li>
              <li>Submit inquiries or feedback</li>
            </ul>
            <p>This may include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact information (email, phone number, mailing address)</li>
              <li>Information about potential asbestos exposure</li>
              <li>Medical information (if voluntarily provided)</li>
              <li>Employment history related to asbestos exposure</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Automatically Collected Information</h3>
            <p>When you visit our website, we automatically collect certain information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address and general location information</li>
              <li>Browser type and version</li>
              <li>Operating system and device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website or source</li>
              <li>Search terms used to find our site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc pl-6">
              <li><strong>Legal Referrals:</strong> To connect you with qualified attorneys specializing in asbestos-related cases</li>
              <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
              <li><strong>Website Improvement:</strong> To analyze usage patterns and improve our website functionality</li>
              <li><strong>Communications:</strong> To send you relevant information about legal services (with your consent)</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              <li><strong>Security:</strong> To protect against fraud and maintain website security</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium mb-3">Legal Professionals</h3>
            <p>
              When you request legal consultation through our contact forms, we may share your information 
              with qualified attorneys or law firms that specialize in asbestos litigation. These professionals 
              are bound by attorney-client privilege and professional ethics rules.
            </p>

            <h3 className="text-xl font-medium mb-3">Third-Party Service Providers</h3>
            <p>We may share information with trusted third parties who assist us in:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Website hosting and maintenance</li>
              <li>Email communication services</li>
              <li>Analytics and website optimization</li>
              <li>Customer relationship management</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">Legal Requirements</h3>
            <p>We may disclose your information when required by law or to:</p>
            <ul className="list-disc pl-6">
              <li>Comply with legal process or government requests</li>
              <li>Protect our rights and property</li>
              <li>Ensure user safety and security</li>
              <li>Investigate potential violations of our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Cookies and Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience. 
              This includes:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements</li>
            </ul>
            <p>
              You can control cookie settings through your browser preferences. Note that disabling cookies 
              may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Google AdSense</h2>
            <p>
              We use Google AdSense to display advertisements on our website. Google may use cookies and 
              other tracking technologies to serve ads based on your interests and previous visits to our 
              site and other websites. You can opt out of personalized advertising by visiting 
              <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                Google's Ad Settings
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction. 
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Access:</strong> Request information about how we process your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
              <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Children's Privacy</h2>
            <p>
              Our website is not intended for children under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If you are a parent or guardian and believe your 
              child has provided personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">International Users</h2>
            <p>
              Our website is operated from the United States. If you are accessing our site from outside 
              the US, please be aware that your information may be transferred to, stored, and processed 
              in the United States where our servers are located.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or 
              for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/30 rounded-lg p-6 mt-4">
              <p><strong>Email:</strong> privacy@asbestosexposuresites.com</p>
              <p><strong>Mailing Address:</strong><br />
              AsbestosExposureSites.com<br />
              Privacy Officer<br />
              [Your Business Address]<br />
              [City, State, ZIP Code]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}