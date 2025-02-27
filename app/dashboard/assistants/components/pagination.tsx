"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import clsx from "clsx"

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const generatePaginationItems = () => {
        const items = []
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Link
                    key={i}
                    href={createPageURL(i)}
                    className={clsx("relative inline-flex items-center px-4 py-2 text-sm font-semibold", {
                        "bg-primary text-white": currentPage === i,
                        "text-gray-900 hover:bg-gray-50": currentPage !== i,
                    })}
                >
                    {i}
                </Link>,
            )
        }
        return items
    }

    return (
        <div className="inline-flex">
            <Button variant="outline" className="mr-2" disabled={currentPage <= 1} asChild>
                <Link href={createPageURL(currentPage - 1)}>
                    <ChevronLeftIcon className="h-4 w-4" />
                </Link>
            </Button>
            <div className="flex -space-x-px">{generatePaginationItems()}</div>
            <Button variant="outline" className="ml-2" disabled={currentPage >= totalPages} asChild>
                <Link href={createPageURL(currentPage + 1)}>
                    <ChevronRightIcon className="h-4 w-4" />
                </Link>
            </Button>
        </div>
    )
}

