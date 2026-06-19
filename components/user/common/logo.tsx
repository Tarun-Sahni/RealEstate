import Image from 'next/image'
import React from 'react'

const Logo = ({width=70,height=80}) => {
    return (
        <Image
            src="/logo.png"
            alt='logo'
            width={width}
            height={height}
        />
    )
}

export default Logo