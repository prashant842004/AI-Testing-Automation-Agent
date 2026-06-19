import React from 'react'
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image'

export default function WorkspaceHeader() {
    return (
        <div className='flex w-full justify-between p-5'>
            {/* { LOGO} */}

            <Image src={'/logo.svg'} alt='logo' width={200} height={200}>

            </Image>

            {/* { Menu Option } */}
            <ul className='flex gap-8 text-xl'>
                <li className='hover:text-blue-600 cursor-pointer'>Workspace</li>
                <li className='hover:text-blue-600 cursor-pointer'>Pricing</li>
                <li className='hover:text-blue-600 cursor-pointer'>Support</li>
            </ul>

            {/* { User Butoon} */}
            <UserButton />

        </div>
    )
}
