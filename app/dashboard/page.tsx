"use client"

import {useEffect, useState} from "react"
import { useUserStore } from "./store"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
    const { name, setName } = useUserStore()
    const [inputName, setInputName] = useState("")
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        setInputName(name)
    }, [name])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setName(inputName)
    }

    if (!isClient) {
        return null // or a loading spinner
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <Input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter your name"
                    className="mb-2"
                />
                <Button type="submit">Set Name</Button>
            </form>
            <Link href="/" className="text-blue-500 hover:underline">
                Go to chat
            </Link>
        </div>
    )
}

