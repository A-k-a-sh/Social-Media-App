import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/Context/AuthContext';
import { useSignOutAccoutMutation } from '@/lib/react-query/queriesAndMutations';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

import { INITIAL_USER } from '@/Context/AuthContext';



import '../../globals.css'
import { sidebarLinks } from '@/Constants';
import { INavLink } from '@/type';
const LeftSidebar = () => {


    const navigate = useNavigate();
    const { user, setIsAuthenticated, setUser } = useAuthContext();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? 'bg-gray-800 rounded-lg ' : '';



    const { mutateAsync: signOutAccout, isSuccess: isSigningOutSuccess } = useSignOutAccoutMutation();

    useEffect(() => {
        if (isSigningOutSuccess) {
            navigate('/sign-in');
        }
    }, [isSigningOutSuccess])

    const handleSignOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        signOutAccout();
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        navigate("/sign-in");
    };



    return (
        <div className='leftsidebar h-screen'>
            <div className='flex flex-col gap-11   '>

                {/* logo */}
                <div className='px-6'>
                    <Link to="/" >
                        <img src="/assets/images/logo.svg"
                            alt=""
                            width={176}
                            height={36}
                        />
                    </Link>
                </div>


                {/* for showing profile pic and name */}
                <Link to={`/profile/${user?.id}`} className='flex mx-6  gap-3 cursor-pointer duration-200 border border-light-4 p-2 px-6 rounded-lg items-center'>
                    <img
                        src={user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                        alt=""
                        className='w-12 h-12 rounded-full'
                    />
                    <div className='flex flex-col'>
                        <p className='body-bold'>
                            {user.name}
                        </p>
                        <p className='small-regular text-light-3'>
                            @{user.username}
                        </p>
                    </div>
                </Link>

                {/* sidebar links with icons */}
                <ul className=' flex flex-col gap-6 '>
                    {sidebarLinks.map((link: INavLink) => {
                        return (
                            <li className='leftsidebar-link group  relative border-primary-500  px-6 ' key={link.label}>

                                <div className='hover:bg-primary-500 transition rounded-lg base-medium'>
                                    <NavLink
                                        to={link.route}
                                        className={({ isActive }) => {
                                            // Dynamically return className based on isActive
                                            return `flex gap-4 items-center p-4 ${navLinkClass({ isActive })}`;
                                        }}
                                    >
                                        {({ isActive }) => {
                                            // Update active state in useEffect to avoid side effects in className

                                            return (
                                                <>
                                                    {
                                                        isActive && (
                                                            <div className='border-radius absolute left-0 top-0 w-2 h-full bg-primary-500 duration-700'>

                                                            </div>
                                                        )
                                                    }
                                                    <img
                                                        src={link.imgURL}
                                                        alt={link.label}
                                                        className={`group-hover:invert-white ${isActive ? 'invert-white' : ''}`}
                                                    />
                                                    {link.label}
                                                </>
                                            );
                                        }}
                                    </NavLink>
                                </div >

                            </li>
                        )
                    })}
                </ul>

            </div>

            {/* // logout */}
            <Button
                variant={'ghost'}
                className='flex group justify-start gap-4  mx-6 py-6 hover:cursor-pointer hover:bg-primary-500'
                onClick={(e) => handleSignOut(e)}

            >
                <img src="assets/icons/logout.svg" className='group-hover:invert-white' alt="" />
                <p className='small-medium'>
                    Logout
                </p>

            </Button>

        </div>
    )
}

export default LeftSidebar