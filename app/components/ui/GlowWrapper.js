import { cn } from '@/lib/util'
import React from 'react'


const glowColorMap = {
    blue: 'from-blue-400 to-cyan-300',
    green: 'from-green-400 to-emerald-300',
    purple: 'from-purple-400 to-indigo-300',
    pink: 'from-pink-400 to-rose-300',
}

export function GlowWrapper({
    children,
    glowColor = 'blue',
    className,
    ...props
}) {
    return (
        <div className="relative group">
            <div
                className={cn(
                    "absolute -inset-0.5 bg-gradient-to-r opacity-75 blur-[5rem]",
                    glowColorMap[glowColor],
                    "group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                )}
            />
            <div
                className={cn(
                    "relative bg-white dark:bg-gray-800 ring-1 ring-gray-900/5 rounded-lg",
                    "leading-none flex items-top justify-center space-x-6",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}


