import { useEffect } from "react";

export default function DisclaimerPage() {
  useEffect(() => {
    document.title = "Disclaimer | AsbestosExposureSites.com";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="page-title mb-8">Disclaimer</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            <strong>Last Updated:</strong> January 10, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">General Information Disclaimer</h2>
            <p>
              The information provided on AsbestosExposureSites.com is for general informational and 
              educational purposes only. While we strive to provide accurate and up-to-date information, 
              we make no representations or warranties of any kind, express or implied, about the 
              completeness, accuracy, reliability, suitability, or availability of the information, 
              products, services, or related graphics contained on this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Not Legal Advice</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
              <p className="font-semibold text-yellow-800">
                IMPORTANT: AsbestosExposureSites.com is not a law firm and does not provide legal advice.
              </p>
            </div>
            <p>
              The content on this website, including information about asbestos exposure sites, health 
              risks, and legal rights, is provided for informational purposes only and should not be 
              construed as legal advice. The information is not intended to create, and receipt of it 
              does not constitute, an attorney-client relationship.
            </p>
            <p>
              <strong>For legal advice specific to your situation, you must consult with a qualified 
              attorney licensed in your jurisdiction.</strong> Laws vary by state and individual 
              circumstances, and only a licensed attorney can provide legal advice tailored to your 
              specific case.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Not Medical Advice</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
              <p className="font-semibold text-red-800">
                This website does not provide medical advice, diagnosis, or treatment recommendations.
              </p>
            </div>
            <p>
              Information about asbestos-related health conditions, symptoms, and medical risks is 
              provided for educational purposes only. This information should not be used as a substitute 
              for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              <strong>Always seek the advice of your physician or other qualified healthcare provider</strong> 
              with any questions you may have regarding a medical condition or potential asbestos exposure. 
              Never disregard professional medical advice or delay seeking it because of information you 
              have read on this website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Historical Information Accuracy</h2>
            <p>
              While we make every effort to provide accurate historical information about asbestos 
              exposure sites, the information may be incomplete, outdated, or subject to interpretation. 
              Historical records may have gaps, and some facilities may have changed ownership, names, 
              or operations since the periods of documented asbestos use.
            </p>
            <p>
              <strong>We cannot guarantee the accuracy or completeness of historical data</strong> and 
              recommend that users independently verify information for legal or research purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Third-Party Attorney Referrals</h2>
            <p>
              AsbestosExposureSites.com may provide referrals to third-party attorneys and law firms 
              that specialize in asbestos litigation. <strong>Important disclaimers about these referrals:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>We do not endorse or guarantee any specific attorney or law firm</li>
              <li>We are not responsible for the quality, competence, or ethical conduct of referred attorneys</li>
              <li>We do not control or influence legal fees, payment arrangements, or case outcomes</li>
              <li>Attorney-client relationships are formed directly between you and the attorney</li>
              <li>We receive no compensation from attorneys for referrals</li>
            </ul>
            <p>
              <strong>You are responsible for independently evaluating any attorney</strong> before 
              entering into a professional relationship. We recommend checking attorney licensing, 
              disciplinary records, and experience before making any commitments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">No Guarantee of Results</h2>
            <p>
              Nothing on this website should be interpreted as a guarantee or promise of any specific 
              legal or financial outcome. Every legal case is unique, and past results do not guarantee 
              future outcomes. The value of any potential legal claim depends on numerous factors specific 
              to each individual case.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Website Availability and Technical Issues</h2>
            <p>
              We strive to maintain this website and keep it running smoothly, but we cannot guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Continuous, uninterrupted access to the website</li>
              <li>That the website will be error-free or free from viruses</li>
              <li>That defects will be corrected immediately</li>
              <li>The security of information transmitted through the website</li>
            </ul>
            <p>
              Your use of this website is at your own risk. We recommend keeping backup copies of any 
              important information you submit through our contact forms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Third-Party Content and Links</h2>
            <p>
              Our website may contain links to external websites, advertisements, or references to 
              third-party content. We do not control these external sources and are not responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The accuracy or reliability of third-party content</li>
              <li>The privacy practices of external websites</li>
              <li>Products or services offered by third parties</li>
              <li>The availability of external links</li>
            </ul>
            <p>
              Links to external websites are provided for convenience only and do not constitute 
              endorsement of the content or services offered.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, AsbestosExposureSites.com, its owners, employees, 
              and affiliates shall not be liable for any direct, indirect, incidental, special, or 
              consequential damages arising from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use of or inability to use this website</li>
              <li>Reliance on information provided on this website</li>
              <li>Errors, omissions, or inaccuracies in website content</li>
              <li>Technical problems or security breaches</li>
              <li>Actions of third-party attorneys or service providers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Time-Sensitive Information</h2>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 mb-6">
              <p className="font-semibold text-orange-800">
                Legal claims may be subject to statutes of limitations that can expire without notice.
              </p>
            </div>
            <p>
              If you believe you may have a legal claim related to asbestos exposure, <strong>time may 
              be limited</strong> to pursue that claim. Statutes of limitations vary by state and type 
              of claim. Do not delay in consulting with a qualified attorney if you believe you may 
              have been exposed to asbestos and have developed related health conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Changes to Disclaimer</h2>
            <p>
              We reserve the right to modify this disclaimer at any time without prior notice. Changes 
              will be posted on this page with an updated "Last Updated" date. Your continued use of 
              the website after any changes constitutes acceptance of the modified disclaimer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Information</h2>
            <p>
              If you have questions about this disclaimer or need clarification about the information 
              provided on our website, please contact us:
            </p>
            <div className="bg-muted/30 rounded-lg p-6 mt-4">
              <p><strong>Email:</strong> info@asbestosexposuresites.com</p>
              <p><strong>Website:</strong> AsbestosExposureSites.com</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Acknowledgment</h2>
            <p>
              <strong>By using this website, you acknowledge that you have read, understood, and agree 
              to this disclaimer.</strong> You understand that the information provided is for general 
              informational purposes only and that you should consult with qualified professionals for 
              advice specific to your situation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}