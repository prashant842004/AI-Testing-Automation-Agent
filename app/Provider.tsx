'use client';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { UserDetailContext } from '@/context/UserDetailContext';

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [userDetail, setuserDetail] = useState<any>();

    useEffect(() => {
        CreateNewuser();
    }, [])

    const CreateNewuser = async () => {
        const result = await axios.post('/api/users', {});
        console.log("Result", result)
        setuserDetail(result.data?.user);
    }

    return (

        <UserDetailContext.Provider value={{ userDetail, setuserDetail }}>
            <>  {children} </>
        </UserDetailContext.Provider>

    )
}

export default Provider