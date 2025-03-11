import type { Assistant } from "@/lib/db/schema"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteButton from "@/app/dashboard/assistants/components/delete-button";

export default function AssistantsTable({ assistants }: { assistants: Assistant[] }) {
    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>RAG</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="sr-only">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assistants.map((assistant) => (
                            <TableRow key={assistant.id}>
                                <TableCell className="font-medium">{assistant.name}</TableCell>
                                <TableCell>{assistant.provider}</TableCell>
                                <TableCell>{assistant.modelName}</TableCell>
                                <TableCell>
                                    {assistant.ragEnabled ? (
                                        <Badge variant="default">Enabled</Badge>
                                    ) : (
                                        <Badge variant="outline">Disabled</Badge>
                                    )}
                                </TableCell>
                                {/*<TableCell>{formatDate(assistant.createdAt)}</TableCell>*/}
                                <TableCell>
                                    <div className="flex justify-end">
                                        <DeleteButton id={assistant.id} name={assistant.name} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

