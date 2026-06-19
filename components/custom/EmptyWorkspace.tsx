import Image from 'next/image';
import { Button } from '../ui/button';
import { Link } from 'lucide-react';

export const EmptyWorkspace = () => {
    return (
        <div className='flex flex-col mt-10 items-center justify-center'>
            <Image src={'/folder.png'} alt='Empty' width={100} height={100} />
            <h2 className='font-medium text-2xl mx-5 mb-4'>No Repository Connected</h2>
            <p className='text-center mx-10'> Connect Your Github Account and add a Repository to generate and run test cases</p>

            <Button className='mt-5 '> <Link className='h-5 w-4 mr-2' /> Connect Repo </Button>
        </div>
    )
}   