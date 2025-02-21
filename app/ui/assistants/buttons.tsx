import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {deleteAssistant} from "@/app/ui/assistants/actions";
import {useAssistantQuantityStore} from "@/app/dashboard/assistantQuantityStore";
import {Button} from "@/app/ui/assistants/button";

export function CreateAssistant() {
    const { totalAllowed, currentCount } = useAssistantQuantityStore()
    const isLimitReached = totalAllowed > 0 && currentCount >= totalAllowed;
 if (isLimitReached)
 { return <p>Plan Assistant Limit Reached, Hence cannot create more</p>; }

  return (
      <Link href="/dashboard/assistant/create" passHref>
        <Button>Create Assistant</Button>
      </Link>
  )
}

export function UpdateAssistant({ id }: { id: string }) {
  return (
    <Link
        href={`/dashboard/assistant/${id}/edit`}
        className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}



export function DeleteAssistant({ id }: { id: string }) {


  const deleteAssistantWithId = deleteAssistant.bind(null, id);

  return (
      <form action={deleteAssistantWithId}>
        <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-4" />
        </button>
      </form>
  );


}
