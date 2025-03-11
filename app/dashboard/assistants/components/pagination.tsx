"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

export default function Pagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get("page")) || 1

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    // Generate page numbers to display
    const generatePagination = (currentPage: number, totalPages: number) => {
        // If total pages is 7 or less, show all pages
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }

        // If current page is among the first 3 pages
        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages]
        }

        // If current page is among the last 3 pages
        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        }

        // If current page is somewhere in the middle
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
    }

    const allPages = generatePagination(currentPage, totalPages)

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <PaginationArrow direction="left" href={createPageURL(currentPage - 1)} isDisabled={currentPage <= 1} />

            <div className="flex gap-2">
                {allPages.map((page, index) => {
                    let position: "first" | "last" | "middle" | "single" = "middle"

                    if (index === 0) position = "first"
                    if (index === allPages.length - 1) position = "last"
                    if (allPages.length === 1) position = "single"

                    return (
                        <PaginationNumber
                            key={page.toString() + index}
                            href={page === "..." ? "#" : createPageURL(page)}
                            page={page}
                            position={position}
                            isActive={currentPage === page}
                            isDisabled={page === "..."}
                        />
                    )
                })}
            </div>

            <PaginationArrow direction="right" href={createPageURL(currentPage + 1)} isDisabled={currentPage >= totalPages} />
        </div>
    )
}

function PaginationNumber({
                              page,
                              href,
                              isActive,
                              position,
                              isDisabled,
                          }: {
    page: number | string
    href: string
    position?: "first" | "last" | "middle" | "single"
    isActive: boolean
    isDisabled?: boolean
}) {
    const className = clsx("flex size-10 items-center justify-center rounded-md text-sm", {
        "z-10 bg-primary text-primary-foreground": isActive,
        "hover:bg-muted": !isActive && !isDisabled,
        "text-muted-foreground": isDisabled,
    })

    return isDisabled ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>
            {page}
        </Link>
    )
}

function PaginationArrow({
                             href,
                             direction,
                             isDisabled,
                         }: {
    href: string
    direction: "left" | "right"
    isDisabled?: boolean
}) {
    const className = clsx("flex size-10 items-center justify-center rounded-md", {
        "pointer-events-none text-muted-foreground": isDisabled,
        "hover:bg-muted": !isDisabled,
    })

    const icon = direction === "left" ? <ArrowLeftIcon className="w-4" /> : <ArrowRightIcon className="w-4" />

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
            {icon}
        </Link>
    )
}

