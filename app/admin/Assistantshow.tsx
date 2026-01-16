
import { DateField } from "@/components/admin/date-field";
import { NumberField } from "@/components/admin/number-field";
import { RecordField } from "@/components/admin/record-field";
import { ReferenceField } from "@/components/admin/reference-field";
import { Show } from "@/components/admin/show";

export const AssistantShow = () => (
    <Show>
        <div className="flex flex-col gap-4">
            <RecordField source="id" />
            <RecordField source="name" />
            <RecordField source="provider" />
            <RecordField source="model_name" />
            <RecordField source="system_prompt" />
            <RecordField source="suggestions" />
            <RecordField source="temperature" />
            <RecordField source="max_tokens">
                <DateField source="max_tokens" />
            </RecordField>
            <RecordField source="memory_limit">
                <NumberField source="memory_limit" />
            </RecordField>
            {/* <RecordField source="rag_enabled" render={record => record[rag_enabled] ? 'Yes' : 'No'} /> */}
            <RecordField source="files" />
            {/* <RecordField source="active" render={record => record[active] ? 'Yes' : 'No'} /> */}
            <RecordField source="created_at">
                <DateField source="created_at" />
            </RecordField>
          
            <RecordField source="api_key" />
            <RecordField source="greeting_title" />
            <RecordField source="greeting_subtitle" />
        </div>
    </Show>
);