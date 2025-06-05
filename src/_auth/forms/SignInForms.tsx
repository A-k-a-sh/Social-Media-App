import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Button } from "@/components/ui/button"

import { Link } from "react-router-dom"
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
import { SignInValidation } from "@/lib" // import the validation schema (moved to lib folder for reusability)

import '../../globals.css'

import Loader from "@/components/shared/Loader";
import { useSignInAccoutMutation } from "@/lib/react-query/queriesAndMutations"
import { useAuthContext } from "@/Context/AuthContext"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"


const SignInForms = () => {


  const navigate = useNavigate();

  const { checkAuthUser, isLoading: isUserLoading } = useAuthContext();


  //const isLoading = false;

  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccoutMutation();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    //console.log(values)
    const session = await signInAccount(values);


    //const session =true;// await signInAccount(values);

    if (!session) {
      toast({ title: "Login failed.Please try again." });
      
      return;
    }

    const isLoggedIn = await checkAuthUser();
    console.log(isLoggedIn);

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    }

    else {
      return toast({
        
        title: 'Login failed.Please try again.',
        duration: 5000,
      })


    }
  }



  return (
    <div className="p-8 w-full h-full flex items-center justify-center">

      <Form {...form}>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="sm:w-420 flex  items-center flex-col myDiv">

          <h2 className="font-bold text-4xl pt-3"> Log in to your account </h2>


          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">



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
              {isSigningIn ? (
                <div className="flex flex-row gap-3 items-center">
                  <Loader />
                  Loading...
                </div>
              ) : "Sign in"}
            </Button>

            <p className="text-light-3 small-medium text-center">
              Don&apos;t have an account?{" "}
              <Link to="/sign-up" className="text-primary-500 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>

        </motion.div>


      </Form>
    </div>
  )
}

export default SignInForms