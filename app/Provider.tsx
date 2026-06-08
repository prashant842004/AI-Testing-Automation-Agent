'use client';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { userDetailContext } from '@/context/UserDetailContext';

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

        <userDetailContext.Provider value={{ userDetail, setuserDetail }}>
            <>  {children} </>
        </userDetailContext.Provider>

    )
}

export default Provider