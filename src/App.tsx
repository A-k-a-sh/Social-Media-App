
import {  Route ,Routes } from 'react-router-dom'

// import './index.css'


import './globals.css'
import { Toaster } from "@/components/ui/toaster"



import SignUpForm from './_auth/forms/SignUpForm'
import SignInForms from './_auth/forms/SignInForms'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Home , AllUsers , CreatePosts , EditPost , Explore , LikedPost , PostDetails , Saved , Profile  } from './_root/pages/index'





// const router = createBrowserRouter(
//     createRoutesFromElements(
//         <Route path='/'>
//             {/* public routes */}
//             <Route element={<AuthLayout />}>

//                 <Route path='/sign-up' element={<SignUpForm />} />
//                 <Route path='/sign-in' element={<SignInForms />} />

//             </Route>


//             {/* private routes */}

//             <Route element={<RootLayout />}>
//                 <Route index element={<Home />} /> {/* here index means parent route here which is '/' */}
//             </Route>



//         </Route>

//     )
// )

function App() {

    return (

        // 
        <main className='w-screen h-screen'>
            <Routes>
                <Route path='/'>
                    {/* public routes */}
                    <Route element={<AuthLayout />}>

                        <Route path='sign-up' element={<SignUpForm />} />
                        <Route path='sign-in' element={<SignInForms />} />

                    </Route>


                    {/* private routes */}

                    <Route element={<RootLayout />}>
                        <Route index element={<Home />} /> {/* here index means parent route here which is '/' */}
                        <Route path='explore' element={<Explore />} />
                        <Route path='All-users' element={<AllUsers />} />
                        <Route path='Create-Post' element={<CreatePosts />} />
                        <Route path='EditPost/:postId' element={<EditPost />} />
                        <Route path='Saved' element={<Saved />} />
                        <Route path='LikedPost' element={<LikedPost />} />
                        <Route path='PostDetails/:postId' element={<PostDetails />} />
                        <Route path='profile/:userId' element={<Profile />} />
                        
                    </Route>



                </Route>
            </Routes>
            <Toaster />
        </main>
    )
}

export default App
