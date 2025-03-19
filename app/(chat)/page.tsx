import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import {getSelectedAssistant} from "@/app/dashboard/assistants/lib/actions2";
import {AssistantStoreInitializer} from "@/app/dashboard/assistants/components/assistant-store-initializer";


export default async function Page() {
  const id = generateUUID();


    const assistant = await getSelectedAssistant()


    const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');


  if (!modelIdFromCookie) {

    return (
      <>

        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
        <AssistantStoreInitializer assistant={assistant} />

        <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
