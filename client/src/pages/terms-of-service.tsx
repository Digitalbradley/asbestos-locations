import { useEffect } from "react";

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = "Terms of Service | AsbestosExposureSites.com";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="page-title mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Effective Date:</strong> January 10, 2025<br />
            <strong>Last Updated:</strong> January 10, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Agreement to Terms</h2>
            <p>
              These Terms of Service ("Terms") govern your use of the AsbestosExposureSites.com website 
              ("Website," "Service") operated by AsbestosExposureSites.com ("we," "us," or "our"). 
              By accessing or using our Website, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Description of Service</h2>
            <p>
              AsbestosExposureSites.com is an informational directory website that provides:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Information about historical asbestos exposure sites across the United States</li>
              <li>Educational content about asbestos-related health risks and legal rights</li>
              <li>Referral services to connect users with qualified legal professionals</li>
              <li>Contact forms and consultation request services</li>
            </ul>
            <p>
              <strong>Important Notice:</strong> We are not a law firm and do not provide legal advice. 
              We are an informational resource and referral service only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Acceptable Use</h2>
            <p>You agree to use our Website only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc pl-6">
              <li>Use the Website in any way that violates applicable federal, state, local, or international law</li>
              <li>Submit false, misleading, or fraudulent information through our contact forms</li>
              <li>Interfere with or disrupt the Website or servers connected to the Website</li>
              <li>Attempt to gain unauthorized access to any portion of the Website</li>
              <li>Use automated tools (bots, crawlers) to access the Website without permission</li>
              <li>Transmit any viruses, worms, or other malicious code</li>
              <li>Engage in any activity that could harm our reputation or business operations</li>
              <li>Copy, reproduce, or distribute Website content without authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">User-Generated Content</h2>
            <p>
              When you submit information through our contact forms or communicate with us, you grant us 
              a non-exclusive, royalty-free license to use that information for the purposes described 
              in our Privacy Policy, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Connecting you with appropriate legal professionals</li>
              <li>Improving our services and Website functionality</li>
              <li>Responding to your inquiries and providing customer support</li>
            </ul>
            <p>
              You represent and warrant that any information you submit is accurate and that you have 
              the right to submit such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Legal Referrals and Third-Party Services</h2>
            <p>
              Our Website may connect you with third-party legal professionals and law firms. 
              <strong>Important disclaimers:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>We do not endorse or guarantee any specific attorney or law firm</li>
              <li>We are not responsible for the quality, outcome, or conduct of third-party legal services</li>
              <li>Attorney-client relationships are formed directly between you and the legal professional</li>
              <li>We do not provide legal advice or practice law</li>
              <li>Any legal fees or arrangements are between you and the attorney</li>
            </ul>
            <p>
              You should independently verify the credentials and reputation of any legal professional 
              before engaging their services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Intellectual Property Rights</h2>
            <p>
              The Website and its original content, features, and functionality are owned by 
              AsbestosExposureSites.com and are protected by United States and international copyright, 
              trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, create derivative works of, publicly display, 
              or exploit any part of the Website without our express written permission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Disclaimers</h2>
            
            <h3 className="text-xl font-medium mb-3">Information Accuracy</h3>
            <p>
              While we strive to provide accurate and up-to-date information about asbestos exposure sites, 
              we make no warranties about the completeness, reliability, or accuracy of this information. 
              Historical data may be incomplete or subject to change.
            </p>

            <h3 className="text-xl font-medium mb-3">No Legal Advice</h3>
            <p>
              The information on this Website is for general informational purposes only and does not 
              constitute legal advice. No attorney-client relationship is created by using this Website 
              or contacting us through our forms.
            </p>

            <h3 className="text-xl font-medium mb-3">No Medical Advice</h3>
            <p>
              Information about health risks and medical conditions is for educational purposes only and 
              should not be considered medical advice. Consult qualified healthcare professionals for 
              medical concerns.
            </p>

            <h3 className="text-xl font-medium mb-3">Website Availability</h3>
            <p>
              We do not guarantee that the Website will be available 24/7 or free from interruptions, 
              delays, or errors. We reserve the right to modify or discontinue the Website at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, AsbestosExposureSites.com shall not be 
              liable for any indirect, incidental, special, consequential, or punitive damages, including 
              but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Personal injury or property damage</li>
              <li>Errors or omissions in Website content</li>
              <li>Actions or conduct of third-party legal professionals</li>
              <li>Unauthorized access to your personal information</li>
            </ul>
            <p>
              Our total liability for any claims arising from your use of the Website shall not exceed 
              the amount you paid to access the Website (which is typically zero for general users).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless AsbestosExposureSites.com and its officers, 
              directors, employees, and agents from any claims, damages, obligations, losses, liabilities, 
              costs, or debt arising from:
            </p>
            <ul className="list-disc pl-6">
              <li>Your use of the Website</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any false or misleading information you provide</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Privacy Policy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which describes how we 
              collect, use, and disclose information when you use our Website. By using our Website, 
              you consent to the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Advertising and Third-Party Links</h2>
            <p>
              Our Website may contain advertisements served by third parties, including Google AdSense, 
              and links to external websites. We are not responsible for the content, privacy policies, 
              or practices of third-party websites or advertisers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material 
              changes by posting the new Terms on this page and updating the "Last Updated" date. Your 
              continued use of the Website after any modifications constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Termination</h2>
            <p>
              We may terminate or suspend your access to the Website immediately, without prior notice, 
              for any reason, including breach of these Terms. Upon termination, your right to use the 
              Website will cease immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of [Your State], 
              United States, without regard to conflict of law principles. Any legal action or proceeding 
              arising under these Terms will be brought exclusively in the state or federal courts located 
              in [Your County, State].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Severability</h2>
            <p>
              If any provision of these Terms is held to be invalid or unenforceable, such provision shall 
              be struck and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-muted/30 rounded-lg p-6 mt-4">
              <p><strong>Email:</strong> legal@asbestosexposuresites.com</p>
              <p><strong>Mailing Address:</strong><br />
              AsbestosExposureSites.com<br />
              Legal Department<br />
              [Your Business Address]<br />
              [City, State, ZIP Code]
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Acknowledgment</h2>
            <p>
              By using our Website, you acknowledge that you have read these Terms of Service and agree 
              to be bound by them. These Terms constitute the entire agreement between you and 
              AsbestosExposureSites.com regarding your use of the Website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}