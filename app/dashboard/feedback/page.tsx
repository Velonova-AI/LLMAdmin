import {FeedbackForm} from "@/app/ui/assistants/feedback-form";


export default async function Home({
                                 searchParams,
                             }: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const success = await searchParams.success === "true"

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Feedback Form</h1>
            {success ? (
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

