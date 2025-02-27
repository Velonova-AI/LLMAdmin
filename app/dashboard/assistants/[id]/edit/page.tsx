
import { notFound } from "next/navigation"
import {fetchAssistantById, } from "../../lib/actions"
import { EditForm } from "../../components/edit-form"


// interface PageProps {
//     params: { id: string }
// }

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {

    const params = await props.params;
    const id = params.id;



    const assistant = await fetchAssistantById(id);


    if (!assistant) {
        notFound()
    }

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">Edit User</h1>
            </div>
            <div className="mt-4">
                <EditForm initialData={assistant} />
            </div>
        </div>
    )
}

