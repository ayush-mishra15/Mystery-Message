'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

function VerifyAccount() {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post('/api/verify-code', {
        username: params.username,
        code: data.code,
      })
      toast.success('Verified!', { description: response.data.message })
      router.replace('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error('Verification failed', {
        description: axiosError.response?.data.message,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="verify-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#121212] border border-neutral-800 rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Verify Your Account
            </h1>
            <p className="text-sm text-neutral-400 mt-2">
              We&#39;ve sent a 6-digit code to your email. Enter it below to continue.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
              autoComplete="off"
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-300 text-sm">
                      Verification Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        aria-label="Verification Code"
                        autoComplete="one-time-code"
                        placeholder="Enter 6-digit code"
                        className="bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Verify & Continue
              </Button>
            </form>
          </Form>

          <p className="text-sm text-center text-neutral-500 mt-5">
            Didn&#39;t see the email? Check your spam or promotions folder.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default VerifyAccount
