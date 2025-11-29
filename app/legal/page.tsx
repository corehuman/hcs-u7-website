import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal & Intellectual Property | HCS-U7',
  description: 'HCS-U7 licensing, patents, trademarks, and intellectual property information',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Legal & Intellectual Property
          </h1>
          <p className="text-xl text-gray-600">
            HCS-U7 licensing, patents, and trademark information
          </p>
        </div>

        {/* License Section */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">📜</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Software License</h2>
              <p className="text-gray-600">How you can use HCS-U7</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6 py-2">
              <h3 className="text-xl font-semibold mb-3 text-green-700">
                ✅ Free for Non-Commercial Use
              </h3>
              <p className="text-gray-700 mb-3">
                HCS-U7 is available under <strong>CC BY-NC-SA 4.0</strong> license for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Academic research and education</li>
                <li>Personal projects and experimentation</li>
                <li>Open source projects (non-commercial)</li>
                <li>Non-profit organizations</li>
              </ul>
              <Link
                href="https://github.com/corehuman/hcs-u7-website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium underline"
              >
                View on GitHub →
              </Link>
            </div>

            <div className="border-l-4 border-orange-500 pl-6 py-2">
              <h3 className="text-xl font-semibold mb-3 text-orange-700">
                🔒 Commercial License Required
              </h3>
              <p className="text-gray-700 mb-3">
                Commercial use requires a paid license. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Using in business or company operations</li>
                <li>Selling products/services powered by HCS-U7</li>
                <li>Websites with advertising revenue</li>
                <li>SaaS or cloud services</li>
              </ul>
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <p className="font-semibold mb-2">Pricing:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Startup (&lt;$1M revenue): €5,000/year</li>
                  <li>• Professional ($1M-10M): €15,000/year</li>
                  <li>• Enterprise (&gt;$10M): €50,000+/year</li>
                </ul>
              </div>
              <a
                href="mailto:contact@ia-solution.fr?subject=HCS-U7 Commercial License Inquiry"
                className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Request Commercial License →
              </a>
            </div>
          </div>
        </section>

        {/* Patent Section */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">🔬</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Patent Pending</h2>
              <p className="text-gray-600">Protected innovations</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <p className="text-amber-900 font-semibold mb-2">
              ⚠️ Patent Applications Filed
            </p>
            <p className="text-amber-800">
              HCS-U7's core methodology is subject to patent protection. Use of this
              software does not grant any patent license.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-3">Protected Innovations:</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  <strong>Multi-layer cognitive biometric authentication</strong> combining
                  neuroscience-validated tests with hardware fingerprinting
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  <strong>Temporal code rotation system</strong> with cryptographic
                  anti-replay protection (TOTP-inspired)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  <strong>Economic anti-farm deterrent</strong> making bot exploitation
                  financially non-viable
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span className="text-gray-700">
                  <strong>Vocal biometrics integration</strong> detecting natural human
                  hesitation patterns impossible for AI
                </span>
              </li>
            </ul>

            <div className="mt-6 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
              <p className="mb-2"><strong>Filing Date:</strong> November 2025</p>
              <p className="mb-2"><strong>Jurisdiction:</strong> France (with international PCT extension planned)</p>
              <p><strong>Status:</strong> Provisional application filed</p>
            </div>
          </div>
        </section>

        {/* Trademark Section */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">™️</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Trademarks</h2>
              <p className="text-gray-600">Protected brand names</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              The following are trademarks of <strong>IA SOLUTION</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>HCS-U7™</strong> - Main product name</li>
              <li><strong>Human Cognitive Signature™</strong> - Technology name</li>
              <li><strong>COREHUMAN™</strong> - Company/project name</li>
            </ul>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 mt-6">
              <strong>Status:</strong> Trademark applications pending (INPI France)
            </p>
          </div>
        </section>

        {/* Copyright Section */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">©</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Copyright</h2>
              <p className="text-gray-600">Source code ownership</p>
            </div>
          </div>

          <div className="text-gray-700 space-y-4">
            <p className="text-lg">
              <strong>© 2025 Benjamin BARRERE / IA SOLUTION</strong>
            </p>
            <p>All rights reserved.</p>
            <p>
              The HCS-U7 source code, documentation, and related materials are protected
              by copyright law. Unauthorized reproduction, distribution, or use is prohibited
              except as permitted under the applicable license.
            </p>
          </div>
        </section>

        {/* Enforcement Section */}
        <section className="mb-16 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="text-4xl">⚖️</div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Enforcement</h2>
              <p className="text-gray-600">Protecting our intellectual property</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-700">
            <p>
              We actively monitor commercial usage of HCS-U7 through automated detection
              systems and community reporting.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-semibold text-red-900 mb-2">License Violations:</p>
              <p className="text-red-800">
                Unauthorized commercial use will result in immediate legal action, including
                cease and desist notices, claims for damages, and potential public disclosure.
              </p>
            </div>
            <p className="text-sm">
              If you're unsure whether your use requires a license,{' '}
              <a href="mailto:contact@ia-solution.fr" className="text-blue-600 hover:underline">
                contact us
              </a>{' '}
              for clarification.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Questions?</h2>
          <p className="text-lg mb-6 text-blue-100">
            For licensing, partnerships, legal inquiries, or IP-related questions:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <a
                href="mailto:contact@ia-solution.fr"
                className="text-white hover:text-blue-200 underline text-lg"
              >
                contact@ia-solution.fr
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌐</span>
              <a
                href="https://hcs-u7.com"
                className="text-white hover:text-blue-200 underline text-lg"
              >
                https://hcs-u7.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💼</span>
              <a
                href="https://www.linkedin.com/in/benjamin-barrere"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 underline text-lg"
              >
                LinkedIn: Benjamin BARRERE
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: November 29, 2025</p>
          <p className="mt-2">
            IA SOLUTION • SIRET: [À compléter] • Registered in France
          </p>
        </div>
      </div>
    </div>
  );
}
