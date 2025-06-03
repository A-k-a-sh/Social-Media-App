import { Outlet , Navigate } from 'react-router-dom'


const AuthLayout = () => {

  const isAuthenticated = false;

  return (
    <div>
        {isAuthenticated ? <Navigate to="/" /> :(
          <div className='flex  flex-row h-screen  justify-center items-center overflow-hidden'>
            <section className='flex flex-1 h-screen w-full justify-center items-center overflow-auto '>
              <Outlet />  
            </section >

            <img 
              src="/assets/images/login.png" 
              alt="login side image" 
              className='hidden md:block h-screen w-1/2 object-cover bg-no-repeat rounded-md'
              />
          </div>
        )}
    </div>
  )
}

export default AuthLayout