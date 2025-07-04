'use client'

import { Button } from "@/components/ui/button"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw, Link2 } from "lucide-react"
import { MessageCard } from "@/components/MessageCard"
import { StarsBackground } from "@/components/ui/stars-background"
import { motion } from "framer-motion"

function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) {
        toast("Refreshed Messages", { description: "Showing latest messages" })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      fetchMessages()
      fetchAcceptMessage()
    }
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: checked,
      })
      setValue("acceptMessages", checked)
      toast(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to update message settings")
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  if (!session?.user) return <div />

  const { username } = session.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/you/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("URL Copied", { description: "Profile URL has been copied to clipboard." })
  }

  return (
    <div className="relative bg-gradient-to-br from-black via-gray-900 to-black min-h-screen py-28 px-5 md:px-8">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-6xl mx-auto bg-gray-950/70 border border-gray-700 rounded-xl shadow-xl p-6 md:p-10 space-y-8"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">📬 User Dashboard</h1>
          <Button
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }}
            disabled={isLoading}
            className="flex gap-2 items-center bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md shadow-md transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {/* Profile Link */}
        <div className="space-y-2">
          <label className="text-gray-300 font-medium flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Your Profile Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 rounded border border-gray-700 bg-gray-800 text-gray-200 text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-md shadow"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-3">
          <label className="text-gray-300 font-medium text-sm md:text-base">
            Accept Messages: {" "}
            <span className={`font-semibold ${acceptMessages ? "text-emerald-400" : "text-red-400"}`}>
              {acceptMessages ? "On" : "Off"}
            </span>
          </label>
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
            className={`scale-90 sm:scale-100 ${acceptMessages ? "data-[state=checked]:bg-emerald-500" : "data-[state=unchecked]:bg-gray-500"}`}
          />
        </div>

        <Separator className="my-4" />

        {/* Messages Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Your Messages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {messages.length > 0 ? (
              messages.map((message) => (
                <MessageCard
                  key={message._id as string}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <p className="text-gray-500">No messages yet. Share your link to start receiving them!</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard;
