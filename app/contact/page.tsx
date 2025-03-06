
import { Suspense } from "react"
import ContactForm from "@/app/contact/contact-form";
import Footer from "@/app/footer";

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
                <p className="text-muted-foreground mb-8">
                    Fill out the form below and we&#39;ll get back to you as soon as possible.
                </p>
                <Suspense fallback={<div>Loading form...</div>}>
                    <ContactForm />
                </Suspense>
            </div>
            <Footer />
        </main>
    )
}

