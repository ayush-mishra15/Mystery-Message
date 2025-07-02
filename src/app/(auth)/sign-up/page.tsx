'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/schemas/signUpSchema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, User, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import * as z from "zod"
import { StarsBackground } from "@/components/ui/stars-background"
import { motion } from "framer-motion"

const Page = () => {
  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const debounced = useDebounceCallback(setUsername, 300)

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
          const res = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(res.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          setUsernameMessage(axiosError.response?.data.message || "Error checking username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const res = await axios.post<ApiResponse>('/api/sign-up', data)
      toast(res.data.message)
      router.replace(`/verify/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast("Signup failed", { description: axiosError.response?.data.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl bg-gray-900 rounded-xl m-3 shadow-2xl flex flex-col md:flex-row-reverse overflow-hidden z-10">

        {/* Right side: Form Section */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="md:w-3/5 p-10 space-y-8"
        >
          <h2 className="text-4xl font-bold text-gray-300 tracking-tight">
              Mystery Message
          </h2>
          <p className="text-gray-300 text-lg">
            Create your account to start sending anonymous messages!
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Username */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-200">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Your name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                          }}
                          className="pl-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-teal-400 focus:ring-teal-400"
                          autoComplete="username"
                          spellCheck={false}
                        />
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    {isCheckingUsername && (
                      <Loader2 className="animate-spin h-4 w-4 mt-1 text-gray-500" />
                    )}
                    <p className={`mt-1 text-sm ${usernameMessage === "Username is unique" ? 'text-teal-400' : 'text-red-500'}`}>
                      {usernameMessage}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-200">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="pl-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-teal-400 focus:ring-teal-400"
                          autoComplete="email"
                        />
                        <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                          placeholder="********"
                          {...field}
                          className="pl-10 bg-gray-800 text-gray-200 border-gray-700 focus:border-teal-400 focus:ring-teal-400"
                          autoComplete="new-password"
                        />
                        <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-gray-200 font-semibold text-lg py-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin inline-block" /> Registering...
                  </>
                ) : (
                  "REGISTER NOW"
                )}
              </Button>
            </form>
          </Form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-teal-400 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </motion.div>

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
            <h2 className="text-3xl font-bold text-gray-200">Hello, Guest!</h2>
            <p className="text-base leading-relaxed text-gray-300">
              Welcome to Mystery Message. Share thoughts, compliments, or secrets — anonymously and safely.
            </p>
          </div>
        </motion.div>
      </div>

      <StarsBackground />
    </div>
  )
}

export default Page
