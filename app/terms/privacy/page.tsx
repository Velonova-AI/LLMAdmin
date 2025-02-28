"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
    // Remove these lines:
    // const [isDarkMode, setIsDarkMode] = useState(false)
    // const toggleDarkMode = () => {
    //   setIsDarkMode(!isDarkMode)
    //   document.documentElement.classList.toggle("dark")
    // }
    // const handlePrint = () => {
    //   window.print()
    // }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="py-6 md:py-12 lg:py-16">
            <div className="container px-4 md:px-6">
                {/* Remove the buttons div: */}
                {/* <div className="flex justify-end gap-2 mb-4 print:hidden">
          <Button variant="outline" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handlePrint} aria-label="Print privacy policy">
            <Printer className="h-4 w-4" />
          </Button>
        </div> */}
                <div className="prose prose-gray max-w-none dark:prose-invert">
                    <div className="pb-4 space-y-2 border-b border-gray-200 dark:border-gray-800">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Privacy Policy</h1>
                        <p className="text-gray-500 dark:text-gray-400">Last updated: February 28, 2025</p>
                    </div>

                    <nav className="my-6 print:hidden">
                        <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
                        <ul className="flex flex-wrap gap-2">
                            {[
                                "introduction",
                                "collection",
                                "use",
                                "disclosure",
                                "rights",
                                "transfers",
                                "retention",
                                "children",
                                "changes",
                                "contact",
                                "legal-bases",
                            ].map((section) => (
                                <li key={section}>
                                    <Button variant="outline" size="sm" onClick={() => scrollToSection(section)} className="text-sm">
                                        {section
                                            .split("-")
                                            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(" ")}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mx-auto prose max-w-none">
                        <p>
                            NeuroSecure BV is an AI safety and productivity company working to build reliable, interpretable, and
                            steerable AI systems for startups and businesses.
                        </p>

                        <p>
                            This Privacy Policy explains how we collect, use, disclose, and process your personal data when you use
                            our website and other places where NeuroSecure acts as a data controller—for example, when you interact
                            with our AI productivity assistants or other products as a consumer for personal use
                            (&quot;Services&quot;) or when NeuroSecure operates and provides our commercial customers and their end
                            users with access to our commercial products (&quot;Commercial Services&quot;).
                        </p>

                        <p>
                            This Privacy Policy does not apply where NeuroSecure acts as a data processor and processes personal data
                            on behalf of commercial customers using NeuroSecure&apos;s Commercial Services – for example, your
                            employer has provisioned you an AI assistant account, or you&apos;re using an app that is powered on the
                            back-end with our AI. In those cases, the commercial customer is the controller, and you can review their
                            policies for more information about how they handle your personal data.
                        </p>

                        <h2 id="collection" className="scroll-mt-20">
                            1. Collection of Personal Data
                        </h2>
                        <p>We collect the following categories of personal data:</p>

                        <h3>Personal data you provide to us directly</h3>
                        <ul>
                            <li>
                                <strong>Identity and Contact Data:</strong> NeuroSecure collects identifiers, including your name, email
                                address, and phone number when you sign up for a NeuroSecure account, or to receive information on our
                                Services. We may also collect or generate indirect identifiers.
                            </li>
                            <li>
                                <strong>Payment Information:</strong> We collect your payment information if you choose to purchase
                                access to NeuroSecure&apos;s products and services.
                            </li>
                            <li>
                                <strong>Inputs and Outputs:</strong> Our AI services allow you to interact with the Services in a
                                variety of formats (&quot;Prompts&quot; or &quot;Inputs&quot;), which generate responses
                                (&quot;Outputs&quot;) based on your Inputs. This includes where you choose to integrate third-party
                                applications with our services.
                            </li>
                            <li>
                                <strong>Feedback:</strong> We collect feedback, including ideas and suggestions for improvement or
                                rating an Output in response to an Input.
                            </li>
                            <li>
                                <strong>Communication Information:</strong> If you communicate with us, we collect your name, contact
                                information, and the contents of any messages you send.
                            </li>
                        </ul>

                        <h3>Personal data we receive automatically from your use of the Services</h3>
                        <p>
                            When you use the Services, we also receive certain technical data automatically (described below,
                            collectively &quot;Technical Information&quot;). This includes:
                        </p>

                        <ul>
                            <li>
                                <strong>Device and Connection Information:</strong> Information about your device type, operating
                                system, browser, mobile network, IP address, and other technical details.
                            </li>
                            <li>
                                <strong>Usage Information:</strong> Information about how you use our Services, including dates and
                                times of access, browsing history, and features used.
                            </li>
                            <li>
                                <strong>Log and Troubleshooting Information:</strong> Information about Service performance and any
                                errors encountered.
                            </li>
                            <li>
                                <strong>Cookies &amp; Similar Technologies:</strong> We use cookies and similar technologies to manage
                                our Services and collect information about your usage. For more details, please visit our Cookie Policy.
                            </li>
                        </ul>

                        <h2 id="use" className="scroll-mt-20">
                            2. Uses of Personal Data
                        </h2>
                        <p>We use your personal data for the following purposes:</p>

                        <ul>
                            <li>To provide and maintain our Services</li>
                            <li>To communicate with you about our Services and events</li>
                            <li>To create and administer your account</li>
                            <li>To process payments</li>
                            <li>To prevent fraud and abuse</li>
                            <li>To investigate and resolve disputes</li>
                            <li>To improve our Services</li>
                            <li>To comply with legal obligations</li>
                        </ul>

                        <h2 id="disclosure" className="scroll-mt-20">
                            3. How We Disclose Personal Data
                        </h2>
                        <p>NeuroSecure will disclose personal data to the following categories of third parties:</p>

                        <ul>
                            <li>Affiliates &amp; corporate partners</li>
                            <li>Service providers &amp; business partners</li>
                            <li>As part of significant corporate events (e.g., mergers or acquisitions)</li>
                            <li>When required by law or to protect rights</li>
                            <li>With your consent</li>
                        </ul>

                        <h2 id="rights" className="scroll-mt-20">
                            4. Your Rights and Choices
                        </h2>
                        <p>Depending on your location, you may have certain rights regarding your personal data:</p>

                        <ul>
                            <li>Right to access your personal data</li>
                            <li>Right to correct inaccurate data</li>
                            <li>Right to delete your personal data</li>
                            <li>Right to restrict processing</li>
                            <li>Right to data portability</li>
                            <li>Right to object to processing</li>
                            <li>Right to withdraw consent</li>
                        </ul>

                        <p>
                            To exercise these rights, please contact us at privacy@neurosecure.ai. We may need to verify your identity
                            before processing your request.
                        </p>

                        <h2 id="transfers" className="scroll-mt-20">
                            5. Data Transfers
                        </h2>
                        <p>
                            Your personal data may be transferred to servers in the Netherlands, other EU countries, or to countries
                            outside the European Economic Area (&quot;EEA&quot;). When we transfer data outside the EEA, we ensure
                            appropriate safeguards are in place through:
                        </p>

                        <ul>
                            <li>EU Commission adequacy decisions</li>
                            <li>Standard contractual clauses</li>
                            <li>Other appropriate legal mechanisms</li>
                        </ul>

                        <h2 id="retention" className="scroll-mt-20">
                            6. Data Retention and Security
                        </h2>
                        <p>
                            We retain your personal data for as long as necessary to provide our Services and comply with legal
                            obligations. We implement appropriate technical and organizational security measures to protect your data.
                        </p>

                        <h2 id="children" className="scroll-mt-20">
                            7. Children&apos;s Privacy
                        </h2>
                        <p>
                            Our Services are not directed towards, and we do not knowingly collect information from, children under
                            the age of 18. If we become aware that a child under 18 has provided us with personal data, we will take
                            steps to delete such information.
                        </p>

                        <h2 id="changes" className="scroll-mt-20">
                            8. Changes to This Privacy Policy
                        </h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material changes and update
                            the &quot;Last Updated&quot; date at the top of this Policy.
                        </p>

                        <h2 id="contact" className="scroll-mt-20">
                            9. Contact Information
                        </h2>
                        <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>

                        <p>
                            NeuroSecure BV
                            <br />
                            Wigbolt Ripperstraat
                            <br />
                            1067EH Amsterdam
                            <br />
                            Netherlands
                            <br />
                            Email: privacy@neurosecure.ai
                        </p>

                        <p>For data protection inquiries, you can contact our Data Protection Officer at dpo@neurosecure.ai.</p>

                        <h2 id="legal-bases" className="scroll-mt-20">
                            10. Legal Bases for Processing
                        </h2>
                        <p>We process your personal data on the following legal bases:</p>

                        <ul>
                            <li>
                                <strong>Contract:</strong> Processing necessary for the performance of our contract with you
                            </li>
                            <li>
                                <strong>Legal Obligation:</strong> Processing necessary to comply with our legal obligations
                            </li>
                            <li>
                                <strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, such as
                                improving our Services and preventing fraud
                            </li>
                            <li>
                                <strong>Consent:</strong> Processing based on your specific consent
                            </li>
                        </ul>

                        <Separator className="my-8" />

                        <div className="mx-auto max-w-3xl space-y-4">
                            <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <details className="group">
                                    <summary className="font-medium list-none flex items-center cursor-pointer">
                                        <div className="flex-1">How can I access my personal data?</div>
                                        <div className="ml-2 transition-transform duration-200 group-open:rotate-180">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </div>
                                    </summary>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        You can request access to your personal data by emailing privacy@neurosecure.ai. We will respond to
                                        your request within the timeframe required by applicable law.
                                    </p>
                                </details>

                                <details className="group">
                                    <summary className="font-medium list-none flex items-center cursor-pointer">
                                        <div className="flex-1">How can I delete my account and data?</div>
                                        <div className="ml-2 transition-transform duration-200 group-open:rotate-180">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </div>
                                    </summary>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        You can delete your account and request deletion of your personal data by contacting us at
                                        privacy@neurosecure.ai. Please note that we may retain certain information as required by law or for
                                        legitimate business purposes.
                                    </p>
                                </details>

                                <details className="group">
                                    <summary className="font-medium list-none flex items-center cursor-pointer">
                                        <div className="flex-1">How do you protect my data?</div>
                                        <div className="ml-2 transition-transform duration-200 group-open:rotate-180">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </div>
                                    </summary>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        We implement appropriate technical and organizational security measures to protect your personal
                                        data. This includes encryption, access controls, and regular security assessments.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Remove the print styles at the bottom: */}
            {/* <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }

          body {
            font-size: 12pt;
          }

          h1 {
            font-size: 18pt;
          }

          h2 {
            font-size: 14pt;
          }
        }
      `}</style> */}
        </div>
    )
}

