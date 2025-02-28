"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function TermsAndConditions() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <div className="py-6 md:py-12 lg:py-16">
            <div className="container px-4 md:px-6">
                <div className="prose prose-gray max-w-none dark:prose-invert">
                    <div className="pb-4 space-y-2 border-b border-gray-200 dark:border-gray-800">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">Terms and Conditions</h1>
                        <p className="text-gray-500 dark:text-gray-400">Last updated: February 28, 2025</p>
                    </div>

                    <nav className="my-6 print:hidden">
                        <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
                        <ul className="flex flex-wrap gap-2">
                            {[
                                "introduction",
                                "account",
                                "use",
                                "materials",
                                "feedback",
                                "removals",
                                "subscriptions",
                                "third-party",
                                "software",
                                "ownership",
                                "disclaimer",
                                "general",
                                "disputes",
                            ].map((section) => (
                                <li key={section}>
                                    <Button variant="outline" size="sm" onClick={() => scrollToSection(section)} className="text-sm">
                                        {section.charAt(0).toUpperCase() + section.slice(1)}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="mx-auto prose max-w-none">
                        <p>Welcome to NeuroSecure! Before you access our services, please read these Terms of Service.</p>

                        <p>
                            These Terms of Service (&quot;Terms&quot;) and our Usage Policy (also referred to as our &quot;Acceptable
                            Use Policy&quot; or &quot;AUP&quot;) set out the agreement between you and NeuroSecure BV
                            (&quot;NeuroSecure&quot;) to use our AI productivity assistants, premium services, and other products and
                            services that we may offer for individuals, along with any associated apps, software, and websites
                            (together, our &quot;Services&quot;). Please take some time to read over them and understand them. By
                            agreeing to these Terms, or in the absence of such agreement, by using the Services, you agree to be bound
                            by them, including any changes made to them in accordance with the Terms. Our affiliates, licensors,
                            distributors, and service providers (collectively &quot;Providers&quot;) are not contracting parties under
                            these Terms.
                        </p>

                        <p>
                            These Terms apply to you if you are a consumer who is resident in the European Economic Area or
                            Switzerland. You are a consumer if you are acting wholly or mainly outside your trade, business, craft or
                            profession in using our Services.
                        </p>

                        <p>
                            In these Terms, when we refer to &quot;we&quot;, &quot;us&quot; or &quot;our&quot;, or similar, we mean
                            NeuroSecure. Other words in bold and inverted commas have the meaning given to them where the word or
                            phrase is first used. Subsequent uses of these words have the same meaning.
                        </p>

                        <p>Please read our Privacy Policy, which describes how we collect and use personal information.</p>

                        <p>
                            Please note: Our Commercial Terms of Service govern your use of any NeuroSecure API key, the NeuroSecure
                            Console, or any other NeuroSecure offerings that reference the Commercial Terms of Service.
                        </p>

                        <h2 id="introduction" className="scroll-mt-20">
                            1. Who we are.
                        </h2>
                        <p>
                            NeuroSecure is an AI safety and productivity company working to build reliable, interpretable, and
                            steerable AI systems. We conduct frontier research, develop and apply a variety of safety techniques, and
                            deploy the resulting systems via a set of partnerships and products to help startups and businesses
                            automate tasks, create compelling content, and scale operations efficiently.
                        </p>

                        <h2 id="account" className="scroll-mt-20">
                            2. Account creation and access.
                        </h2>
                        <p>&quot;Minimum age.&quot; You must be at least 18 years old to use the Services.</p>

                        <p>
                            &quot;Your NeuroSecure Account.&quot; To access our Services, we may ask you to create an account (your
                            &quot;Account&quot;), to provide certain information (such as your email address), and to create a
                            password. You agree to provide correct, current, and complete information and allow us to use it to
                            communicate with you about our Services. You agree to notify us promptly if there are any changes to the
                            information you have provided to us. Our communications to you using such information will satisfy any
                            requirements for legal notices.
                        </p>

                        <p>
                            You may not share your Account login information, NeuroSecure API key, or Account credentials with anyone
                            else or make your Account available to anyone else. You are responsible for all activity occurring under
                            your Account and agree to notify us immediately if you become aware of any unauthorized access to your
                            Account by sending an email to support@neurosecure.ai.
                        </p>

                        <p>You may close your Account at any time by contacting us at support@neurosecure.ai.</p>

                        <p>
                            &quot;Business Domains.&quot; If you use an email address owned by your employer or another organization,
                            your Account may be linked to the organization&apos;s enterprise account with us and the
                            organization&apos;s administrator may be able to monitor and control the Account, including having access
                            to Materials (defined below). We will provide notice to you before linking your Account to an
                            organization&apos;s enterprise account. However, if the organization is responsible for notifying you or
                            has already informed you that it may monitor and control your Account, we may not provide additional
                            notice.
                        </p>

                        <p>
                            &quot;Evaluation and Additional Services.&quot; In some cases, we may permit you to evaluate our Services
                            for a limited time or with limited functionality. Use of our Services for evaluation purposes are for your
                            personal, non-commercial use only.
                        </p>

                        <p>
                            You may need to accept additional terms to use certain Services. These additional terms will supplement
                            our Terms for those Services and may change your rights or obligations for those Services, including your
                            obligations to pay fees.
                        </p>

                        <h2 id="use" className="scroll-mt-20">
                            3. Use of our Services.
                        </h2>
                        <p>
                            You may access and use our Services only in compliance with our Terms, including our Acceptable Use
                            Policy, the policy governing the countries and regions NeuroSecure currently supports (&quot;Supported
                            Regions Policy&quot;), and any guidelines or supplemental terms we may post on the Services (the
                            &quot;Permitted Use&quot;). You are responsible for all activity under the account through which you
                            access the Services.
                        </p>

                        <p>
                            You may not access or use, or help another person to access or use, our Services in the following ways:
                        </p>

                        <ul>
                            <li>
                                In any manner that violates any applicable law or regulation—including, without limitation, any laws
                                about exporting data or software to and from any countries in the European Economic Area, Switzerland,
                                or other countries.
                            </li>
                            <li>
                                To develop any products or services that compete with our Services, including to develop or train any
                                artificial intelligence or machine learning algorithms or models or resell the Services.
                            </li>
                            <li>
                                To decompile, reverse engineer, disassemble, or otherwise reduce our Services to human-readable form,
                                except when these restrictions are prohibited by applicable law.
                            </li>
                            <li>
                                To crawl, scrape, or otherwise harvest data or information from our Services other than as permitted
                                under these Terms.
                            </li>
                            <li>
                                To use our Services or Materials to obtain unauthorized access to any system or information or to
                                deceive any person.
                            </li>
                            <li>
                                To infringe, misappropriate, or violate intellectual property or other legal rights (including the
                                rights of publicity or privacy).
                            </li>
                            <li>
                                Except when you are accessing our Services via a NeuroSecure API Key or where we otherwise explicitly
                                permit it, to access the Services through automated or non-human means, whether through a bot, script,
                                or otherwise.
                            </li>
                            <li>
                                To engage in any other conduct that restricts or inhibits any person from using or enjoying our
                                Services, or that we reasonably consider exposes us—or any of our users, affiliates, or any other third
                                party—to any liability, damages, or detriment of any type, including reputational harms.
                            </li>
                        </ul>

                        <p>
                            You also must not abuse, harm, interfere with, or disrupt our Services, including, for example,
                            introducing viruses or malware, spamming or DDoSing Services, or bypassing any of our systems or
                            protective measures.
                        </p>

                        <h2 id="materials" className="scroll-mt-20">
                            4. Inputs, Outputs, and Materials.
                        </h2>
                        <p>
                            You may be allowed to interact with our Services in a variety of formats (we call these
                            &quot;Inputs&quot;). Our Services may generate responses based on your Inputs (we call these
                            &quot;Outputs&quot;). Inputs and Outputs collectively are &quot;Materials.&quot;
                        </p>

                        <p>
                            &quot;Rights to Materials.&quot; You are responsible for all Inputs you submit to our Services. You must
                            ensure that you have all rights, licenses, and permissions that are necessary for us to process such
                            Inputs in accordance with our Terms and to provide the Services to you, including for example, to
                            integrate with third-party services and to share Materials with others at your direction. You must ensure
                            that your submission of Inputs to us, or your sharing them with others, will not violate our Terms, our
                            Acceptable Use Policy, or any laws or regulations applicable to those Inputs. As between you and
                            NeuroSecure, and to the extent permitted by applicable law, you retain any right, title, and interest that
                            you have in such Inputs. Subject to your compliance with our Terms, we assign to you all our right, title,
                            and interest (if any) in Outputs.
                        </p>

                        <p>
                            &quot;Reliance on Outputs.&quot; Artificial intelligence and large language models are frontier
                            technologies that are still improving in accuracy, reliability and safety. When you use our Services, you
                            acknowledge and agree:
                        </p>

                        <ul>
                            <li>
                                Outputs may not always be accurate and may contain material inaccuracies even if they appear accurate
                                because of their level of detail or specificity.
                            </li>
                            <li>You should not rely on any Outputs without independently confirming their accuracy.</li>
                            <li>The Services and any Outputs may not reflect correct, current, or complete information.</li>
                            <li>Outputs may contain content that is inconsistent with NeuroSecure&apos;s views.</li>
                        </ul>

                        <p>
                            &quot;Our use of Materials.&quot; We may use Materials to provide, maintain, and improve the Services and
                            to develop other products and services. We will not train our models on any Materials that are not
                            publicly available, except in two circumstances:
                        </p>

                        <ul>
                            <li>
                                If you provide Feedback to us (through the Services or otherwise) regarding any Materials, we may use
                                that Feedback in accordance with Section 5 (Feedback).
                            </li>
                            <li>
                                If your Materials are flagged for trust and safety review, we may use or analyze those Materials to
                                improve our ability to detect and enforce Acceptable Use Policy violations, including training models
                                for use by our trust and safety team, consistent with NeuroSecure&apos;s safety mission.
                            </li>
                        </ul>

                        <p>
                            &quot;Limitations.&quot; Different types of Service (including paid-for Services under a Subscription) may
                            have technical restrictions associated with them, for example, the number of Inputs you may submit to the
                            Service or the number of Outputs you may receive within a certain period of time (&quot;Technical
                            Limitation&quot;). For more information about the Technical Limitations for each type of Service offering,
                            see the relevant purchase page on our website.
                        </p>

                        <h2 id="feedback" className="scroll-mt-20">
                            5. Feedback
                        </h2>
                        <p>
                            We appreciate feedback, including ideas and suggestions for improvement or rating an Output in response to
                            an Input (&quot;Feedback&quot;). If you rate an Output in response to an Input—for example, by using the
                            thumbs up/thumbs down icon—we will store the related conversation as part of your Feedback. You have no
                            obligation to give us Feedback, but if you do, you agree that we may use the Feedback however we choose
                            without any obligation or other payment to you.
                        </p>

                        <h2 id="removals" className="scroll-mt-20">
                            6. Removals
                        </h2>
                        <p>
                            To submit a request to remove any content in the Materials, follow our process described on our website.
                        </p>

                        <h2 id="subscriptions" className="scroll-mt-20">
                            7. Subscriptions, fees and payment.
                        </h2>
                        <p>
                            &quot;Fees and billing.&quot; You may be required to pay fees to access or use our Services or certain
                            features of our Services. You are responsible for paying any applicable fees listed on the Services. The
                            fees applicable to our Services (including information on how we calculate our fees) are set out on the
                            Model Pricing Page unless otherwise communicated to you by NeuroSecure in writing.
                        </p>

                        <p>
                            If you purchase access to our Services or features of our Services from us, you must provide complete and
                            accurate billing information (&quot;Payment Method&quot;). You confirm that the card or bank account which
                            is being used as your Payment Method is yours, or that you have the authorization of the account holder to
                            use it. If you use a Payment Method which you are not authorized to use, you will be liable to us for any
                            losses that we suffer as a result of your use of that Payment Method.
                        </p>

                        <p>
                            You agree that we may charge the Payment Method for any applicable fees listed on our Services and any
                            applicable tax. If the fees for these Services or features are specified to be recurring or based on usage
                            (for example, a Subscription (see below)), you agree that we may charge these fees and applicable taxes to
                            the Payment Method on a periodic basis.
                        </p>

                        <p>
                            If you access our Services or purchase access to our Services through a distributor (&quot;App
                            Distributor&quot;) (e.g. an app store), then you will make payment to the App Distributor, and the App
                            Distributor&apos;s terms in relation to payment methods, billing and refunds will apply instead of these
                            Terms.
                        </p>

                        <p>
                            Except as expressly provided in these Terms or where required by law, all payments are non-refundable.
                            Please check your order carefully before confirming it, and see below for additional information about
                            recurring charges for our subscriptions.
                        </p>

                        <p>
                            You agree that we will not be held liable for any errors caused by third-party payment processors used to
                            process fees paid by you to us.
                        </p>

                        <p>
                            &quot;Subscriptions.&quot; To access our premium services and other subscription services we may make
                            available to individuals, you must sign up for a subscription with us (a &quot;Subscription&quot;), first
                            by creating an Account and then following the subscription procedure on our Services. When you sign up for
                            a Subscription, you agree to these Terms.
                        </p>

                        <p>
                            &quot;a. Subscription order.&quot; Your order for a Subscription constitutes an offer by you to enter into
                            a Subscription with us. We will confirm our acceptance of your order by sending you a confirmation email
                            (the &quot;Confirmation Email&quot;). Sometimes we reject orders, for example, if you are located in a
                            country where we do not offer the Service or the Service was mispriced by us. A contract for the
                            Subscription, which is on the basis of these Terms, will become legally binding on you and us when we send
                            you the Confirmation Email. For clarity, each Subscription will incorporate these Terms.
                        </p>

                        <p>
                            &quot;b. Subscription content, features, and services.&quot; The content, features, and other services
                            provided as part of your Subscription, and the duration of your Subscription, will be described in the
                            order process. We may change or refresh the content, features, and other services from time to time, and
                            we do not guarantee that any particular piece of content, feature, or other service will always be
                            available through the Services.
                        </p>

                        <p>
                            &quot;c. Subscription term and automatic renewal.&quot; If your Subscription has a minimum term (the
                            &quot;Initial Term&quot;), we will let you know during the order process. Your Subscription will last for
                            the Initial Term and will automatically renew for an additional term equal in duration to the Initial Term
                            and will continue to renew and incur charges for additional terms equal in duration to the Initial Term
                            (each such additional term, a &quot;Renewal Term&quot;). For example, if you subscribe on January 25th for
                            a Subscription with a one-month Initial Term, the Initial Term is January 25th to February 24th
                            (inclusive) and then Renewal Terms will run from the 25th of one month to the 24th of the next month
                            (inclusive).
                        </p>

                        <p>
                            &quot;d. Subscription fees.&quot; You will pay the fees, either to us or to the App Distributor, for the
                            Initial Term and each subsequent Renewal Term up front at the start of that Initial Term or Renewal Term
                            (as applicable). We have the right to make changes to the fees applicable to your Subscription from time
                            to time, although we will not make any change to the fees applicable to your Subscription during the
                            current Initial Term or Renewal Term (as applicable). If these changes result in an increase in the fees
                            payable by you, we will inform you at least 30 days in advance of the change and you shall be deemed to
                            have agreed to the increase in fees payable by you unless you cancel the Subscription, as described in
                            Sections (e) and (g) below, before the Renewal Term to which the increase in fees will apply.
                        </p>

                        <p>
                            &quot;e. Subscription cancellation.&quot; If you subscribed via our website, you may cancel your
                            Subscription at any time by using a method we may provide to you through our products (for example, in
                            your customer portal) or by notifying us at support@neurosecure.ai. If you subscribed via an app, you will
                            need to cancel via the distributor according to the App Distributor&apos;s terms. To avoid renewal and
                            charges for the next Renewal Term, cancel your subscription at least 24 hours before the last day of the
                            Initial Term or any Renewal Term. In the example above, if you subscribe on January 25th for a
                            Subscription that renews with a one-month Initial Term, you must cancel the Subscription per the
                            instructions by February 23rd (24 hours before February 24th) to avoid renewal and charges for the next
                            Renewal Term. In the event of a cancellation, your fees will not be refunded, but your access to the
                            Services will continue through the end of the Initial Term or any Renewal Term for which you previously
                            paid fees.
                        </p>

                        <p>
                            &quot;f. Additional cancellation rights.&quot; You have a legal right to change your mind and cancel the
                            Subscription within 14 days of entering into the Subscription without giving a reason.
                        </p>

                        <ol>
                            <li>
                                To exercise the right to cancel in the 14-day cancellation period, you must inform us of your decision
                                to cancel the Subscription by making a clear statement to us of such decision before the cancellation
                                period has expired. The easiest way to do this is by cancelling your subscription in the customer
                                portal, or you may contact us at support@neurosecure.ai. You may also use the model cancellation form in
                                Appendix 1 of these Terms, but it is not obligatory. For further details on how to cancel, please see
                                our support website. We will acknowledge your cancellation, e.g., through our online customer portal or
                                console.
                            </li>
                            <li>
                                If you cancel the Subscription under Section 7(f)(1), we will reimburse you all payments received from
                                you for the cancelled Subscription. We will make the reimbursement without undue delay, and not later
                                than 14 days after the day on which we are informed about your decision to cancel the Subscription. We
                                will make the reimbursement using the same means of payment as you used for the initial transaction; you
                                will not incur any fees as a result of the reimbursement.
                            </li>
                            <li>
                                If you would like to use the Services during the 14-day cancellation period, you may do so. If you have
                                used the Services during the 14-day cancellation period, and wish to cancel the Subscription, you can
                                still do so by following the process in Section 7(f)(1) above, but we may retain an amount which is in
                                proportion to what has been provided until you have communicated us your withdrawal from these Terms, in
                                comparison with the full coverage of the Subscription.
                            </li>
                        </ol>

                        <p>
                            &quot;g. Subscriptions purchased through an App Distributor.&quot; Where you have purchased your
                            Subscription through an App Distributor, your right to cancel under Section 7(f) above will be as set out
                            in the App Distributor&apos;s terms and Section 7(f) will not apply. The App Distributor&apos;s terms will
                            set out how to notify the App Distributor that you want to cancel and how any fees will be refunded.
                        </p>

                        <p>
                            &quot;Additional fees.&quot; We may also increase the fees for access to our Services that do not require
                            a Subscription. If we charge additional fees in connection with those Services, we will give you an
                            opportunity to review and accept the additional fees before you are charged. Also, additional fees may
                            apply for additional Services or features of the Services that we may make available. If you do not accept
                            any such additional fees, we may discontinue your access to those Services or features.
                        </p>

                        <h2 id="third-party" className="scroll-mt-20">
                            8. Third-party services and links
                        </h2>
                        <p>
                            Our Services may use or be used in connection with third-party content, services, or integrations. We do
                            not control or accept responsibility for any loss or damage that may arise from your use of any
                            third-party content, services, and integrations, for which we make no representations or warranties. Your
                            use of any third-party content, services, and integrations is at your own risk and subject to any terms,
                            conditions, or policies (including privacy policies) applicable to such third-party content, services, and
                            integrations.
                        </p>

                        <h2 id="software" className="scroll-mt-20">
                            9. Software
                        </h2>
                        <p>
                            We may offer manual or automatic updates to our software including our apps (&quot;NeuroSecure
                            Software&quot;), without advance notice to you. NeuroSecure Software may include open source software. In
                            the event of any conflict between these Terms and any other NeuroSecure or third-party terms applicable to
                            any portion of NeuroSecure Software, such as open-source license terms, such other terms will control as
                            to that portion of the NeuroSecure Software and to the extent of the conflict.
                        </p>

                        <h2 id="ownership" className="scroll-mt-20">
                            10. Ownership of the Services
                        </h2>
                        <p>
                            The Services are owned, operated, and provided by us and, where applicable, our Providers. We and our
                            Providers retain all our respective rights, title, and interest, including intellectual property rights,
                            in and to the Services. Other than the rights of access and use expressly granted in our Terms, our Terms
                            do not grant you any right, title, or interest in or to our Services.
                        </p>

                        <h2 id="disclaimer" className="scroll-mt-20">
                            11. Disclaimer of warranties, limitations of liability, and indemnity
                        </h2>
                        <p>
                            Our team works hard to provide great services, and we&apos;re continuously working on improvements.
                            However, there are certain aspects we can&apos;t guarantee.
                        </p>

                        <p>
                            &quot;No warranties.&quot; You may have legal rights in relation to our Services, including where the
                            Services are not as described, faulty or otherwise not fit for purpose. If you believe that any of our
                            Services that you have ordered do not conform with these Terms, please contact us at
                            support@neurosecure.ai. Other than those legal rights, your use of the Services and Materials is solely at
                            your own risk. The Services and Outputs are provided on an &quot;as is&quot; and &quot;as available&quot;
                            basis and, to the fullest extent permissible under applicable law, are provided without warranties of any
                            kind, whether express, implied, or statutory. We and our Providers expressly disclaim any and all
                            warranties of fitness for a particular purpose, title, merchantability, accuracy, availability,
                            reliability, security, privacy, compatibility, non-infringement, and any warranty implied by course of
                            dealing, course of performance, or trade usage.
                        </p>

                        <p>&quot;No limitation.&quot; Nothing in these Terms excludes or limits our liability for:</p>

                        <ul>
                            <li>death or personal injury caused by our negligence;</li>
                            <li>fraud or fraudulent misrepresentation; and</li>
                            <li>
                                any matter in respect of which it would be unlawful for us to exclude or restrict our liability. This
                                includes your rights that the Services are of satisfactory quality, fit for purpose and as described.
                            </li>
                        </ul>

                        <p>
                            &quot;Foreseeable loss.&quot; Except as set out in No Limitation above, we and our Providers are not
                            responsible for any loss or damage that is not foreseeable. Loss or damage is foreseeable if it was an
                            obvious consequence of our breach or if it was contemplated by you and us at the time that you accessed
                            our Services, or if you have a Subscription, at the time that the agreement between you and us related to
                            your Subscription become binding (i.e., when the confirmation email for that Subscription was issued).
                        </p>

                        <p>
                            &quot;Non-commercial use only.&quot; You agree that you will not use our Services for any commercial or
                            business purposes and we and our Providers have no liability to you for any loss of profit, loss of
                            business, business interruption, or loss of business opportunity.
                        </p>

                        <p>
                            &quot;Your rights.&quot; Nothing in these Terms affects your statutory rights and we are under a legal
                            duty to provide you with Services that are in conformity with the terms applying to our Services. Advice
                            about your statutory rights is available from your local Citizens&apos; Information Board (or local
                            equivalent, if applicable).
                        </p>

                        <p>
                            &quot;Limitation of liability.&quot; Except as otherwise set out in No Limitation above, our total
                            liability to you for any loss or damage arising out of or in connection with these Terms, whether in
                            contract (including under any indemnity), tort (including negligence) or otherwise will be limited to the
                            greater of: (a) the amount you paid to us for access to or use of the Services in the six months prior to
                            the event giving rise to the liability, and (b) €100.
                        </p>

                        <p>
                            &quot;Beneficiaries.&quot; Our Providers may benefit from, and enforce, their rights under this Section
                            11.
                        </p>

                        <h2 id="general" className="scroll-mt-20">
                            12. General terms
                        </h2>
                        <p>
                            &quot;Changes to Services.&quot; Our Services are novel and will change. We may sometimes add or remove
                            features, increase or decrease capacity limits, offer new Services, or stop offering old ones. We may
                            modify, suspend, or discontinue the Services or your access to the Services. Where those actions will
                            materially impact your use of the Services, we will endeavor to notify you in accordance with this
                            section. This includes taking such action as we consider appropriate to address any security, performance
                            or trust and safety issue.
                        </p>

                        <p>
                            Where feasible, we will provide you with at least 30 days&apos; advance notice of any such changes to the
                            Services that would materially limit or reduce the features, availability or functionality of the
                            Services. However, there may be urgent situations (such as preventing abuse, responding to legal
                            requirements, or addressing security and operability issues) where providing advance notice is not
                            feasible.
                        </p>

                        <p>
                            If you do not wish to continue using the Services following material changes to the Services, please
                            cancel your Account (or the Subscription purchased via our website, if applicable) by notifying us at
                            support@neurosecure.ai and we will refund you a portion of the fees paid by you that are for the portion
                            of your Subscription purchased via our website remaining after termination of your Subscription occurs.
                            Any refunds for Subscriptions purchased via an App Distributor are subject to the App Distributor&apos;s
                            terms and not these Terms.
                        </p>

                        <p>
                            &quot;Changes to these Terms.&quot; We may revise and update these Terms. For example, we may update these
                            Terms (1) to reflect changes in our Services, like when we add or remove features or services, or update
                            our pricing, (2) for security or legal reasons, or (3) to promote safety or prevent abuse. We will notify
                            you of changes to the Terms which are reasonably likely to affect your use of the Services or legal
                            rights. These changes will come into effect no less than 30 days from when we notify you, unless the
                            change is due to a change in law or for security reasons (in which case we may need to change the Terms on
                            shorter notice).
                        </p>

                        <p>
                            If you do not wish to continue using our Services following any changes to the Terms you can terminate
                            these Terms (or a Subscription purchased via our website) by notifying us at support@neurosecure.ai,
                            before the changes take effect. If you exercise this termination right, we will refund to you a portion of
                            the fees paid by you that are for the portion of your Subscription purchased via our website remaining
                            after termination of your Subscription occurs. Any refunds for Subscriptions purchased via an App
                            Distributor are subject to the App Distributor&apos;s terms and not these Terms.
                        </p>

                        <p>
                            &quot;Supplemental Terms.&quot; We may also post supplemental terms. We may offer new Services or features
                            that we believe require service-specific terms or guidelines. If you decide to use those new Services or
                            features, you agree to comply with any applicable guidelines, rules, or supplemental terms that may be
                            posted on the Services from time to time (&quot;Supplemental Terms&quot;). If these Terms conflict with
                            Supplemental Terms, the Supplemental Terms will govern for the applicable Service.
                        </p>

                        <p>
                            &quot;Termination.&quot; You may stop accessing the Services at any time. We may suspend or terminate your
                            access to the Services at any time without notice to you if:
                        </p>

                        <ul>
                            <li>we believe that you have materially breached these Terms;</li>
                            <li>we must do so in order to comply with applicable law; or</li>
                            <li>
                                immediate suspension or termination is necessary for security reasons and therefore we cannot provide
                                notice.
                            </li>
                        </ul>

                        <p>
                            We may also terminate your Account if you have been inactive for over a year and you do not have a paid
                            Account. If we decide to terminate your Account due to inactivity, we will give you advance notice before
                            doing this.
                        </p>

                        <p>
                            If we terminate your access to the Services due to a material breach of these Terms and you have a
                            Subscription:
                        </p>

                        <ul>
                            <li>you will not be entitled to any refund; and</li>
                            <li>
                                we may take further legal action against you and you may be responsible for our losses in relation to
                                the violation of these Terms.
                            </li>
                        </ul>

                        <p>
                            If you have a Subscription, we may terminate the Subscription at any time by giving you at least 30
                            days&apos; notice in writing (email is sufficient). If we exercise this right, we will refund you on a pro
                            rata basis the fees paid by you for the remaining portion of your Subscription after termination.
                        </p>

                        <p>
                            Upon termination of these Terms, a Subscription, or your access to the Services, the rights granted to you
                            under our Terms (or any Subscription) to access and use our Services will immediately terminate, and we
                            may at our option delete any Materials or other data associated with your account. Sections 7 (with
                            respect to fees outstanding as of such expiration or termination) and 8 – 11 will survive any expiration
                            or termination of our Terms or a Subscription.
                        </p>

                        <p>
                            &quot;Severability.&quot; Each of the sections of these Terms operates separately. If any court or
                            relevant authority decides that any of them are unlawful or unenforceable, the remaining sections will
                            remain in full force and effect.
                        </p>

                        <p>
                            &quot;No waiver.&quot; If we fail to insist that you perform any of your obligations under these Terms, or
                            if we do not enforce our rights against you, or if we delay in doing so, that will not mean that we have
                            waived our rights against you and will not mean that you do not have to comply with those obligations. If
                            we waive a default by you, we will only do so in writing, and that will not mean that we will
                            automatically waive any later default by you.
                        </p>

                        <p>
                            &quot;No assignment.&quot; These Terms may not be transferred or assigned by you without our prior written
                            consent, but may be assigned by us without restriction.
                        </p>

                        <p>
                            &quot;Use of our brand.&quot; You may not, without our prior written permission, use our name, logos, or
                            other trademarks in connection with products or services other than the Services, or in any other way that
                            implies our affiliation, endorsement, or sponsorship. To seek permission, please email us at
                            marketing@neurosecure.ai.
                        </p>

                        <p>
                            &quot;Export Controls.&quot; You may not export or provide access to the Services into any U.S. embargoed
                            countries or to anyone on (i) the U.S. Treasury Department&apos;s list of Specially Designated Nationals,
                            (ii) any other restricted party lists identified by the Office of Foreign Asset Control, (iii) the U.S.
                            Department of Commerce Denied Persons List or Entity List, or (iv) any other restricted party lists. You
                            agree that you and anyone accessing or using the Services on your behalf, or using your Account
                            credentials, are not such persons or entities and are not located in any such country.
                        </p>

                        <p>
                            &quot;Legal Compliance.&quot; We may comply with governmental, court, and law enforcement requests or
                            requirements relating to provision or use of the Services, or to information provided to or collected
                            under our Terms. We reserve the right, at our sole discretion, to report information from or about you,
                            including but not limited to Inputs or Outputs, to law enforcement.
                        </p>

                        <h2 id="disputes" className="scroll-mt-20">
                            13. In case of disputes
                        </h2>
                        <p>
                            &quot;Governing Law and Jurisdiction.&quot; These Terms are governed by Dutch law. This means that your
                            access to and use of our Services, and any dispute or claim arising out of or in connection therewith
                            (including non-contractual disputes or claims) will be governed by Dutch law, and must be brought in a
                            competent court in the Netherlands. However, if you are a consumer within the European Economic Area or
                            Switzerland, you may also file legal disputes in your local courts, based on your local laws.
                        </p>

                        <p>
                            If you are resident in the European Economic Area and wish to have more information on online dispute
                            resolution, please follow this link to the website of the European Commission:
                            http://ec.europa.eu/consumers/odr/. This link is provided as required by Regulation (EU) No 524/2013 of
                            the European Parliament and of the Council, for information purposes only. We are not obliged to
                            participate in online dispute resolution.
                        </p>

                        <h2 className="scroll-mt-20">Contacting us</h2>
                        <p>
                            Should you have any reasons for a complaint, we will endeavour to resolve the issue and avoid any
                            re-occurrence in the future. You can always contact us by using the following details:
                        </p>

                        <p>
                            Address: Wigbolt Ripperstraat, 1067EH Amsterdam, Netherlands
                            <br />
                            Email: support@neurosecure.ai
                        </p>
                    </div>

                    <Separator className="my-8" />

                    <div className="mx-auto max-w-3xl space-y-4">
                        <h2 className="text-lg font-bold">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <details className="group">
                                <summary className="font-medium list-none flex items-center cursor-pointer">
                                    <div className="flex-1">What are the terms and conditions for?</div>
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
                                    The terms and conditions are for the use of NeuroSecure&apos;s Services, including our AI productivity
                                    assistants and other products.
                                </p>
                            </details>

                            <details className="group">
                                <summary className="font-medium list-none flex items-center cursor-pointer">
                                    <div className="flex-1">How do I cancel my subscription?</div>
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
                                    If you subscribed via our website, you may cancel your Subscription at any time by using the customer
                                    portal or by notifying us at support@neurosecure.ai. If you subscribed via an app, you will need to
                                    cancel via the distributor according to their terms.
                                </p>
                            </details>

                            <details className="group">
                                <summary className="font-medium list-none flex items-center cursor-pointer">
                                    <div className="flex-1">How do I contact NeuroSecure about the terms and conditions?</div>
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
                                    You can contact NeuroSecure about the terms and conditions by emailing support@neurosecure.ai or by
                                    mail at Wigbolt Ripperstraat, 1067EH Amsterdam, Netherlands.
                                </p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

