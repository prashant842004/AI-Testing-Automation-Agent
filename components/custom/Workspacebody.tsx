"use client"
import React, { useContext } from 'react'
import Image from 'next/image';
import { Button } from '../ui/button'
import { UserDetailContext } from '@/context/UserDetailContext';
import { EmptyWorkspace } from './EmptyWorkspace';
import { Card, CardContent } from '../ui/card';


export default function Workspacebody() {

    const { userDetail } = useContext(UserDetailContext);
    return (
        <div>
            <div className='flex  justify-between items-center'>
                <h2 className='text-4xl font-medium'>Workspace</h2>
                <h2 className='text-blue-800 bg-blue-200 p-3 rounded-lg'>Remaining Credits : {userDetail?.credits} </h2>
            </div>

            <div className='mt-5 flex justify-between items-center p-5 border rounded-lg'>
                <div className='flex items-center gap-5'>
                    <Image src={'/github.png'} alt='github' width={40} height={40} />
                    <h2 className='text-lg'>Connect to Github & Add Repository</h2>
                </div>

                <Card className='bg-white border rounded-lg'>
                    <Button>Install</Button>
                </Card>

            </div>

            <Card className='mt-5 ' >
                <CardContent>
                    <EmptyWorkspace />
                </CardContent>
            </Card>



        </div>
    )
}
