import Breadcrumbs from "@/app/ui/assistants/breadcrumbs";
import Form from "@/app/ui/assistants/edit-form";
import {editAssistantById} from "@/app/ui/assistants/actions";





export default async function Page(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;

    const [assistant] = await Promise.all([
        editAssistantById(id)

    ]);



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
            <Form assistant={assistant}  />
        </main>
    );
}