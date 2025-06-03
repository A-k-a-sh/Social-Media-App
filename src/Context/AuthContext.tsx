import { useContext, createContext, useEffect, useState } from 'react'
import { IUser } from '../type'
import { getCurrentUser } from '@/lib/appwrite/api';
import { useNavigate } from 'react-router-dom';




export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageUrl: '',
    bio: ''
}


//to know we have a logged in user of all time
const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkAuthUser: async () => false as boolean
}


type IContextType = {
    user: IUser;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: React.Dispatch<React.SetStateAction<IUser>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuthUser: () => Promise<boolean>;
};


const AuthContext = createContext<IContextType>(INITIAL_STATE)


//second 'childrend' in props is type as we using typescript

// 'children' given in main.tsx
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();


    const checkAuthUser = async () => {
        try {
            const currentUser = await getCurrentUser();


            if (currentUser) {
                setUser({
                    id: currentUser.$id,
                    name: currentUser.name,
                    username: currentUser.username,
                    email: currentUser.email,
                    imageUrl: currentUser.imageUrl,
                    bio: currentUser.bio
                })

                setIsAuthenticated(true);
                //navigate('/');

                return true;
            }

            return false;

        } catch (error) {
            console.log(error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }


    //appwrite sets cookie in localStorage
    let cookieFallback = localStorage.getItem("cookieFallback");



    useEffect(() => {
        const func = async () => {
            //localStorage.getItem('cookieFallback') === null
            cookieFallback = localStorage.getItem("cookieFallback");

            if (
                cookieFallback === "[]" ||
                cookieFallback === null ||
                cookieFallback === undefined
            ) {
                navigate("/sign-in");
                return;
            }

            const isLoggedIn = await checkAuthUser();

            if (!isLoggedIn) {
                navigate('/sign-in');
            } else {
                if (location.pathname === '/sign-in' || location.pathname === '/') {
                    navigate('/');
                }
            }
        }

        func();
    }, [])

    const value = {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        setIsLoading,
        checkAuthUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

//custom hook
export const useAuthContext = () => useContext(AuthContext)