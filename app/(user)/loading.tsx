import { Home } from 'lucide-react'
import React from 'react'

const Loader = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
            <div className="relative">
                <Home className="h-16 w-16 text-yellow-500 animate-pulse" />
                <span className="absolute inset-0 rounded-full bg-yellow-500/20 animate-ping" />
            </div>
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <p className="font-medium capitalize tracking-wider">Finding your dream home</p>
                <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-bounce" />
                    <span
                        className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-bounce"
                        style={{ animationDelay: "0.15s" }}
                    />
                    <span
                        className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Loader