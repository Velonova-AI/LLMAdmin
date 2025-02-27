import {FeedbackForm} from "@/app/dashboard/feedback/feedback-form";


type PageProps = {
    searchParams: Promise<{
        success?: string;
    }>;
};

export default async function Home({ searchParams }: PageProps) {
    const { success } = await searchParams;
    const isSuccess = success === "true";

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feedback Form</h1>
            {isSuccess ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> Your feedback has been submitted successfully.</span>
                </div>
            ) : (
                <FeedbackForm />
            )}
        </main>
    )
}