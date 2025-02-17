import Breadcrumbs from "@/app/ui/assistants/breadcrumbs";
import Form from "@/app/ui/assistants/edit-form";
import {editAssistantById} from "@/app/ui/assistants/actions";
import {ModelName, ModelProvider, ModelType} from "@/lib/db/schema";
import { notFound } from "next/navigation";





export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;

    const [assistant] = await Promise.all([
        editAssistantById(id)

    ]);


    if (!assistant) {
        notFound()
    }

    interface AssistantForm {
        id: string
        name: string
        description?: string
        apiKey: string
        provider: ModelProvider
        modelName: ModelName
        type: ModelType
        systemPrompt?: string
        suggestions: string[]
        temperature: number
        maxTokens: number
    }

    // Ensure the assistant data matches the AssistantForm interface
    const formattedAssistant = {
        id: assistant.id,
        name: assistant.name,
        description: assistant.description || undefined,
        apiKey: assistant.apiKey || undefined,
        provider: assistant.provider as ModelProvider,
        modelName: assistant.modelName as ModelName,
        type: assistant.type as ModelType,
        systemPrompt : assistant.systemPrompt  || undefined,
        suggestions: Array.isArray(assistant.suggestions) ? assistant.suggestions : [],
        temperature: assistant.temperature ?? undefined,
        maxTokens: assistant.maxTokens ?? undefined,
    }




    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Assistants', href: '/dashboard' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/assistant/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form assistant={formattedAssistant}  />
        </main>
    );
}