"use client"

import type React from "react"
import { useState, useCallback } from "react"
import Link from "next/link"
import { debounce } from "lodash"
import type { Assistant } from "@/lib/db/schema"

interface AssistantLinkProps {
  assistant: Assistant
  onRowClick: (assistant: Assistant) => void
}

export default function AssistantLink({ assistant, onRowClick }: AssistantLinkProps) {
  const [isClicked, setIsClicked] = useState(false)

  const debouncedHandleClick = useCallback(
    debounce(() => {
      onRowClick(assistant)
      setIsClicked(false)
    }, 300),
    [], // Updated dependency array to be empty
  )

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isClicked) {
      setIsClicked(true)
      debouncedHandleClick()
    }
  }

  return (
    <Link
      href="/"
      className={`block w-full h-full text-blue-600 underline cursor-pointer transition-colors ${
        isClicked ? "text-blue-800" : "hover:text-blue-800"
      }`}
      onClick={handleClick}
    >
      Link
    </Link>
  )
}

