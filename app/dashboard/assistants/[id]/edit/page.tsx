import { EditForm } from "@/app/dashboard/assistants/components/edit-assistant-form";

interface EditPageProps {
    params: {
        id: string;
    };
}

export default function EditPage({ params }: EditPageProps) {
    return (
        <main>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Edit Assistant</h1>
                <p className="text-muted-foreground">
                    Update your assistant's configuration and settings.
                </p>
            </div>
            <EditForm assistantId={params.id} />
        </main>
    );
}