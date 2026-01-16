'use client'

import * as React from 'react';
import { required, useDataProvider } from 'ra-core';
import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { Edit } from "@/components/admin/edit";
import { SimpleForm } from "@/components/admin/simple-form";
import { TextInput } from "@/components/admin/text-input";
import { Create } from "@/components/admin/create";
import { ReferenceInput } from "@/components/admin/reference-input";
import { AutocompleteInput } from "@/components/admin/autocomplete-input";
import { SelectInput } from "@/components/admin/select-input";
import { DateTimeInput } from "@/components/admin/date-time-input";
import { ReferenceField } from "@/components/admin/reference-field";
import { generateUUID } from "@/lib/utils";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { useState } from "react";
import { useAssistantStore } from "@/lib/stores/assistant-store";
// import { ChatPage } from "./ChatPage";

export const ChatList = () => {
    const dataProvider = useDataProvider();
    const { setSelectedAssistant } = useAssistantStore();

    return (
        <List>
            <DataTable
                rowClick={async (id, _resource, record) => {
                    // Check if the chat has an assistant_id
                    const assistantId = (record as { assistant_id?: string })?.assistant_id;
                    
                    if (assistantId) {
                        try {
                            // Fetch the assistant details to get the model_name
                            const { data: assistant } = await dataProvider.getOne('assistants', { id: assistantId });
                            const modelName = (assistant as { model_name?: string })?.model_name;
                            // Set the assistant in the store
                            setSelectedAssistant(assistantId, modelName ?? null);
                        } catch (error) {
                            // If fetching fails, still navigate (assistant just won't be set)
                            console.error('Failed to fetch assistant:', error);
                        }
                    }
                    
                    // Navigate to the chat page with the chat ID
                    window.location.href = `/#/chat/${id}`;
                    return false as const; // Prevent default React Admin navigation
                }}
            >
                <DataTable.Col source="title" />
            </DataTable>
        </List>
    );
};




// export const ChatEdit = () => {
//   return (
//     <Edit disableBreadcrumb actions={<></>}>
//       <ChatPage />
//     </Edit>
//   );
// };







export const ChatCreate = () => {
  const [id] = useState(() => generateUUID());
  
  return (
    <Create disableBreadcrumb title={false}>
      <DataStreamProvider>
        <Chat
          autoResume={false}
          id={id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={[]}
          initialVisibilityType="private"
          isReadonly={false}
          key={id}
        />
        <DataStreamHandler />
      </DataStreamProvider>
    </Create>
  );
};

// export const ChatCreate = () => (
//   <Create>
//     <SimpleForm>
//       <TextInput source="title" validate={[required()]} />
//       <DateTimeInput source="createdAt" defaultValue={new Date()} validate={[required()]} />
//       <ReferenceInput source="userId" reference="profiles">
//         <AutocompleteInput validate={[required()]} />
//       </ReferenceInput>
//       <ReferenceInput source="assistant_id" reference="assistants">
//         <AutocompleteInput />
//       </ReferenceInput>
//       <SelectInput
//         source="visibility"
//         choices={[
//           { id: 'public', name: 'Public' },
//           { id: 'private', name: 'Private' },
//         ]}
//         validate={[required()]}
//         defaultValue="private"
//       />
//     </SimpleForm>
//   </Create>
// );





   