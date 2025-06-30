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
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false)
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
    <div className="bg-gradient-to-br from-gray-950 via-gray-800 to-gray-950 min-h-screen py-28 px-5 md:px-8">
      <div className="max-w-6xl mx-auto bg-gray-300 rounded-xl shadow-md p-6 md:p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📬 User Dashboard</h1>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }}
            disabled={isLoading}
            className="flex gap-2 items-center"
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
          <label className="text-gray-700 font-medium flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Your Profile Link
          </label>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full p-2 rounded border bg-gray-50 text-gray-700 text-sm"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        {/* Accept Messages Switch */}
        <div className="flex items-center space-x-3">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-gray-700 font-medium">
            Accept Messages:{" "}
            <span className="font-semibold">{acceptMessages ? "On" : "Off"}</span>
          </span>
        </div>

        <Separator className="my-4" />

        {/* Messages Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Messages</h2>
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
      </div>
    </div>
  )
}

export default Dashboard
