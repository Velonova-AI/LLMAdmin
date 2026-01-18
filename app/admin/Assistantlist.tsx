"use client";

import { DataTable } from "@/components/admin/data-table";
import { List } from "@/components/admin/list";
import { useAssistantStore } from "@/lib/stores/assistant-store";

import { useRecordContext } from "ra-core";
import { Button } from "@/components/ui/button";

// Component for the chat link column
const ChatLinkColumn = () => {
  const record = useRecordContext();
  const { setSelectedAssistant } = useAssistantStore();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (record?.id) {
      const modelName = (record as { model_name?: string })?.model_name;
      setSelectedAssistant(String(record.id), modelName);
      window.location.href = "/#/Chatb/create";
    }
  };

  return (
    <Button
      variant="link"
      size="sm"
      onClick={handleClick}
      className="h-auto p-0"
    >
      Start Chat
    </Button>
  );
};

export const AssistantList = () => {
  const { setSelectedAssistant } = useAssistantStore();

  return (
    <List>
      <DataTable
        // rowClick={(id, _resource, record) => {
         
        //   const modelName = (record as { model_name?: string })?.model_name;
        //   setSelectedAssistant(String(id), modelName);
        //   // Navigate to hash route using window.location
        //   window.location.href = "/#/Chatb/create";
        //   return false as const; // Prevent default navigation
        // }}
      >
        <DataTable.Col source="name" />
        <DataTable.Col source="model_name" />
        <DataTable.Col 
          source="active" 
          render={(record) => record.active ? "Active" : "Inactive"}
        />
        <DataTable.Col source="created_at" />
        <DataTable.Col label="Actions">
          <ChatLinkColumn />
        </DataTable.Col>
      </DataTable>
    </List>
  );
};