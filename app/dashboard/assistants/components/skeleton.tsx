import { Skeleton } from "@/components/ui/skeleton"




export function AssistantsTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div className="w-full">
                                        <div className="mb-2">
                                            <Skeleton className="h-4 w-48" />
                                        </div>
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <Skeleton className="h-4 w-32 mb-2" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                        <tr>
                            <th scope="col" className="px-4 py-5 font-medium">
                                Name
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Description
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Provider
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Model
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Type
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Created
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className="w-full border-b py-3 text-sm last-of-type:border-none">
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-48" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-24" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-32" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-16" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <Skeleton className="h-6 w-24" />
                                </td>
                                <td className="whitespace-nowrap px-3 py-3">
                                    <div className="flex justify-end gap-3">
                                        <Skeleton className="h-8 w-8" />
                                        <Skeleton className="h-8 w-8" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

