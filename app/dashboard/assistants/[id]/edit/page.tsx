import { EditForm } from "@/app/dashboard/assistants/components/edit-assistant-form";

interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPage({ params }: EditPageProps) {
    const { id } = await params;
    
    return (
        <main>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Assistant</h1>
                <p className="text-muted-foreground">
                    Update your assistant&apos;s configuration and settings.
                </p>
            </div>
            <EditForm assistantId={id} />
        </main>
    );
}