"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react"
import { DeleteUser } from "./button";
import { Assistant } from "@/lib/db/schema";
import { useAssistantStore } from "../store";


interface TableClientProps {
    assistants: Assistant[]
}

export function TableClient({ assistants }: TableClientProps) {

    const {  setAssistant  } = useAssistantStore()
    const handleRowClick = (clickedAssistant: Assistant) => {
        setAssistant(clickedAssistant)

    }

    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-lg bg-gray-50 p-2 md:pt-0">
                        <table className="min-w-full text-gray-900">
                            <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    ID
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Name
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Description
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Provider
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Model Name
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Type
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    System Prompt
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Temperature
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Max Tokens
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Suggestions
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    API Key
                                </th>
                                <th scope="col" className="px-4 py-5 font-medium">
                                    Link
                                </th>
                                {/*<th scope="col" className="px-4 py-5 font-medium">*/}
                                {/*    Created At*/}
                                {/*</th>*/}
                                {/*<th scope="col" className="px-4 py-5 font-medium">*/}
                                {/*    Updated At*/}
                                {/*</th>*/}
                            </tr>
                            </thead>
                            <tbody className="bg-white">
                            {assistants?.map((assistant) => (
                                <tr
                                    key={assistant.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.id}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.name}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.description}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.provider}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.modelName}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.type}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.systemPrompt}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.temperature}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.maxTokens}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{JSON.stringify(assistant.suggestions)}</td>
                                    <td className="whitespace-nowrap px-4 py-4">{assistant.apiKey}</td>
                                    <td className="whitespace-nowrap p-3">


                                        <Link

                                            href='/'
                                            className={`block size-full text-blue-600 underline cursor-pointer transition-colors`}

                                            onClick={() => handleRowClick(assistant)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Link
                                        </Link>

                                    </td>
                                    {/*<td className="whitespace-nowrap px-4 py-4">{assistant.createdAt}</td>*/}
                                    {/*<td className="whitespace-nowrap px-4 py-4">{assistant.updatedAt}</td>*/}
                                    <td className="whitespace-nowrap px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/dashboard/assistants/${assistant.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit</span>
                                                </Link>
                                            </Button>
                                            <DeleteUser id={assistant.id} name={assistant.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

