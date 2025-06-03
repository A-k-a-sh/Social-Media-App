import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Button } from "@/components/ui/button"

import { Link, useNavigate } from "react-router-dom"
import { motion } from "motion/react"


import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpValidation } from "@/lib" // import the validation schema (moved to lib folder for reusability)

import '../../globals.css'
import Loader from "@/components/shared/Loader";

import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccoutMutation, useSignInAccoutMutation } from "@/lib/react-query/queriesAndMutations"


import { useAuthContext } from "@/Context/AuthContext"



const SignUpForm = () => {
  const { toast } = useToast()

  const { checkAuthUser, isLoading: isUserLoading } = useAuthContext();


  //const isCreatingUser = false;

  const navigate = useNavigate();

  //here mutateAsync is the function 'mutationFn' inside useCreateUserAccoutMutation
  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccoutMutation();

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccoutMutation();


  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })


  async function onSubmit(values: z.infer<typeof SignUpValidation>) {

    //after validating the form , createUserAccount(react query) get the val and create user in appwrite 

    let newUser = await createUserAccount(values);

    if (!newUser) {
      toast({
        title: 'Something went wrong in newUser signupform line 69, please try again',
      })
    }

    //after registration we immediately sign in the user


    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({
        title: 'Sign in failed in line 83, please try again',
      })
    }
    //console.log(newUser); //see result in res file (newUser)


    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    }

    else {
      return toast({
        title: 'Sign up failed in line 98, please try again',
      })


    }

  }




  return (

    <motion.div initial={{ x: -100 }} animate={{ x: 0 }} className="p-8 w-full h-full flex items-center justify-center">

      <Form {...form}>


        <div className="sm:w-420 flex  items-center flex-col">
          <img
            src="https://www.slazzer.com/downloads/c729818b-b494-11ef-a864-b347d7ab6478/image_prev_ui.png"
            alt=""
            className="w-32 h-16  object-cover object-center"
          />
          <h2 className="font-bold text-4xl pt-3"> Create a new account </h2>
          <p className="text-light-3 small-medium mt-2"> To use the app enter your details</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">

            <FormField //first field
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter your name" className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField //second field
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter your username" className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField //third field
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField //fourth field
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" className="shad-input" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />



            <Button
              type="submit"
              className="shad-button_primary"
            >
              {isCreatingUser ? (
                <div className="flex flex-row gap-3 items-center">
                  <Loader />
                  Loading...
                </div>
              ) : "Sign Up"}
            </Button>

            <p className="text-light-3 small-medium text-center">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-primary-500 hover:underline">
                Sign In
              </Link>
            </p>
          </form>

        </div>


      </Form>
    </motion.div>
  )
}



export default SignUpForm