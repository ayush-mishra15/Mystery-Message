'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signInSchema } from "@/schemas/signInSchema"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, User, Lock } from "lucide-react"
import { StarsBackground } from "@/components/ui/stars-background"
import { motion } from "framer-motion"

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })

      if (result?.error) {
        toast.error("Login Failed", {
          description: "Incorrect username or password"
        })
        return
      }

      if (result?.url) {
        toast.success("Login successful!")
        router.replace("/dashboard")
      }
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-3xl bg-gray-900 m-2.5 rounded-xl shadow-2xl z-10 flex flex-col md:flex-row overflow-hidden">

{/* Left side: Info Section */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hidden md:flex md:w-2/5 relative items-center justify-center p-8 text-gray-200"
          style={{
            backgroundImage: "url('/images/mount.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 text-center space-y-3 max-w-xs">
            <h2 className="text-3xl font-bold text-gray-200">Welcome Back!</h2>
            <p className="text-base leading-relaxed text-gray-300">
              Sign in to Mystery Message to start sending and receiving anonymous messages.
            </p>
          </div>
        </motion.div>

        {/* Right side: Form Section */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:w-3/5 p-10 space-y-8"
        >
          <h2 className="text-4xl font-bold text-gray-200 tracking-tight mb-6">
            Dive In & Explore
          </h2>
          <p className="text-gray-400 mb-6">
            Please enter your credentials below to access your Mystery Message account.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Identifier */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-200">Email or Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="email or username"
                          autoComplete="username"
                          {...field}
                          className="pl-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-teal-400 focus:ring-teal-400"
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-200">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="password"
                          autoComplete="current-password"
                          {...field}
                          className="pl-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-teal-400 focus:ring-teal-400"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-gray-200 font-semibold text-lg py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" /> Signing in...
                  </>
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Not a member?{" "}
            <Link href="/sign-up" className="text-teal-400 hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </motion.div>

      </div>
        <StarsBackground />
    </div>
  )
}

export default Page
