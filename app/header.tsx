import Link from "next/link"
import { Shield } from "lucide-react"

export function Header() {
    return (
        <header className="border-b py-4">
            <div className="container">
                <Link href="https://www.neurosecure.ai" className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="size-8 text-primary" />
                    <span>NeuroSecure.ai</span>
                </Link>
            </div>
        </header>
    )
}

