import React, { useEffect } from 'react'

import '../../globals.css'
import { bottombarLinks } from '@/Constants'
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext, INITIAL_USER } from '@/Context/AuthContext';
import { useSignOutAccoutMutation } from '@/lib/react-query/queriesAndMutations';

const Bottombar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { user, setIsAuthenticated, setUser } = useAuthContext();


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
    <div className='bottom-bar bg-dark-4'>{/*  topbar is definded in global.css || only for mobile  */}
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link
            to={link.route}
            key={link.label}
            className={`flex justify-center items-center flex-col rounded-[10px] gap-1 p-2 transition duration-500 group ${isActive && "bg-primary-500"
              }`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              className={`group-hover:invert-white ${isActive && "invert-white"
                }`}
              width={16}
              height={16}
            />
            <p className='tiny-medium'>{link.label}</p>
          </Link>

        );
      })}
    </div >
  )
}

export default Bottombar