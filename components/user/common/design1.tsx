import { Astroid, Sparkle } from 'lucide-react'
import React from 'react'

const DesignOne = () => {
  return (
    <div className='flex flex-row gap-1 items-center'>
        <Sparkle size={18} className='text-black/80'/>
        <Sparkle size={14} className='text-black/60'/>
        <Sparkle size={10} className='text-black/40'/>
    </div>
  )
}

export default DesignOne