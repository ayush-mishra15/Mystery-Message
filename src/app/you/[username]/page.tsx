'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

import { motion, AnimatePresence } from 'framer-motion';

const specialChar = '||';
const initialSuggestedMessages = [
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
];

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(initialSuggestedMessages);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const response = await axios.post('/api/suggest-messages');
      if (response.status === 200 && response.data.result) {
        const messages = response.data.result.split(specialChar).map((msg: string) => msg.trim());
        setSuggestedMessages(messages);
      } else {
        throw new Error('Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      toast.error('Failed to load suggestions');
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        username,
        content: data.content,
      });

      toast.success(response.data.message);
      form.reset({ content: '' });

      await fetchSuggestedMessages();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-800 to-gray-950 p-10 py-11">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto p-8 bg-gray-300 rounded-lg mt-6 max-w-4xl shadow-lg"
      >        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold mb-4 text-center text-gray-800"
        >
          Send a Secret Message
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-600 max-w-2xl mx-auto mb-6"
        >
          ✉️ Have something to say? Ask a question, share a thought, or just say hi — anonymously!
        </motion.p>

        <div className="bg-gray-100 p-4 rounded-md mb-6 text-sm text-gray-700 shadow-sm border-l-4 border-indigo-500">
          <p><strong>💡 Tip:</strong> Good messages are respectful, open-ended, or fun to answer!</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    Send your Message to <span className="text-indigo-600 font-semibold">@{username}</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none border border-gray-300 bg-white text-gray-900 rounded-md shadow-sm
                        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="bg-indigo-500 text-white px-8 py-3 rounded-md shadow-md">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-8 py-3 rounded-md shadow-md text-white transition"
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="text-sm text-gray-500 text-center italic mt-6">
          🔒 Your identity is 100% private — we never store who sends the message.
        </div>

        <div className="space-y-6 my-10">
          <div className="flex items-center justify-between">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-5 py-2 rounded-md shadow-sm text-white transition"
            >
              {isSuggestLoading ? 'Loading...' : 'Suggest Messages'}
            </Button>
            <p className="text-gray-600 italic ml-10 text-sm">Click on any message below to select it.</p>
          </div>

          <Card className="bg-white border border-gray-200 rounded-md shadow-sm">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-800">Messages</h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <AnimatePresence>
                {suggestedMessages.length === 0 ? (
                  <motion.p
                    key="no-msg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-500 italic text-center py-4"
                  >
                    No suggestions yet. <br />
                    <span className="text-indigo-600 font-semibold">Feeling stuck?</span> Try clicking the button above to get ideas.
                  </motion.p>
                ) : (
                  suggestedMessages.map((message, index) => (
                    <motion.div
                      key={`${message}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-left text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-md px-4 py-2
                          transition transform hover:scale-105 shadow-sm"
                        onClick={() => handleMessageClick(message)}
                      >
                        {message}
                      </Button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8 border-gray-300" />

        <div className="text-center">
          <p className="mb-4 text-gray-700 font-medium text-lg">Get Your Message Board</p>
          <Link href="/">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-md shadow-md text-white transition"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
