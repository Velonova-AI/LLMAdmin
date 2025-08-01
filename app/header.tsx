import Link from "next/link"
import Image from "next/image"

export function Header() {
    return (
        <header className="border-b py-4">
            <div className="container">
                <Link href="https://www.velonova.ai" className="text-2xl font-bold flex items-center gap-2">
                    <Image 
                        src="/images/V1-logo.jpg" 
                        alt="Velonova Logo" 
                        width={32} 
                        height={32}
                        className="object-contain"
                    />
                    <span>Velonova.ai</span>
                </Link>
            </div>
        </header>
    )
}

