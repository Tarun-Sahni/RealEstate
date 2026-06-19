import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = ({ width = 70, height = 80 }) => {
    return (
        <Link href="/">
            <Image
                src="/logo.png"
                alt='logo'
                width={width}
                height={height}
            />
        </Link>
    )
}

export default Logo