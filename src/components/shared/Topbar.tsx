import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/Context/AuthContext';
import { useSignOutAccoutMutation } from '@/lib/react-query/queriesAndMutations';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import '../../globals.css'

const Topbar = () => {
    const navigate = useNavigate();
    const {user} = useAuthContext();

    const {mutateAsync : signOutAccout , isSuccess : isSigningOutSuccess} = useSignOutAccoutMutation();

    useEffect(() => {
        if(isSigningOutSuccess){
            navigate('/sign-in');
        }
    }, [isSigningOutSuccess])

    return (

        <section className='topbar'> {/*  topbar is definded in global.css || only for mobile  */}

            <div className='flex flex-between gap-3 items-center'>

                <Link to="/" >
                    <img src="/assets/images/logo.svg" 
                    alt=""
                    width={130}
                    height={325}
                     />
                </Link>

                <div className='flex gap-4'>

                    <Button
                      variant={'ghost'}
                      className='shad-button_ghost'
                      onClick={async() => signOutAccout()}

                    >
                        <img src="assets/icons/logout.svg" alt="" />
                        
                    </Button>

                    <Link to={`/profile/${user?.id}`}>
                        <img 
                          src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                           alt=""
                           className='w-8 h-8 rounded-full'
                         />
                          
                    </Link>

                </div>

            </div>

        </section>
    )
}

export default Topbar