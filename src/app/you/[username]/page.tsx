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
import { StarsBackground } from '@/components/ui/stars-background';

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
    defaultValues: { content: '' },
  });

  const messageContent = form.watch('content');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(initialSuggestedMessages);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message, { shouldDirty: true });
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
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-800 to-black p-10 sm:p-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <StarsBackground />
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 mt-6 mb-6 sm:p-10 space-y-9"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-center text-gray-900"
        >
          Share What’s on Your Mind
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-600 text-base sm:text-lg"
        >
          ✉️ Ask a question, share a thought, or just say hi — completely anonymously!
        </motion.p>

        <div className="bg-sky-100 border-l-4 border-sky-400 p-4 rounded-md shadow-sm text-sm text-gray-800">
          💡 <strong>Tip:</strong> Make your message respectful, thoughtful, or fun!
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 text-base font-medium">
                    Message to <span className="text-sky-600">@{username}</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none border border-gray-300 bg-white text-gray-900 rounded-lg shadow-sm p-3 
                      focus:outline-none focus:ring-2 focus:ring-sky-500 transition min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 mt-1" />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="bg-sky-500 hover:bg-sky-600 px-6 py-3 text-white rounded-md shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-sm text-center text-gray-500 italic">
          🔒 Your identity is 100% private — we never store who sends the message.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-md shadow-sm disabled:opacity-50"
            >
              {isSuggestLoading ? 'Loading...' : 'Suggest Messages'}
            </Button>
            <p className="text-gray-600 text-sm italic text-center sm:text-right">
              Click a suggestion to auto-fill the message box.
            </p>
          </div>

          <Card className="bg-gray-100 border border-gray-200 rounded-lg shadow-sm">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-800">Suggestions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {suggestedMessages.length === 0 ? (
                  <motion.p
                    key="no-msg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-500 italic py-4"
                  >
                    No suggestions yet. Click above to generate some ideas!
                  </motion.p>
                ) : (
                  suggestedMessages.map((message, index) => (
                    <motion.div
                      key={`${message}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <button
                        type="button"
                        onClick={() => handleMessageClick(message)}
                        className="w-full text-left md:text-center bg-white text-gray-800 hover:bg-sky-100 hover:text-sky-700 
                        rounded-lg px-4 py-3 text-sm font-medium shadow transition-all 
                        whitespace-pre-wrap break-words"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {message}
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <Separator className="border-t border-gray-300 my-8" />

        <div className="text-center space-y-4">
          <p className="text-gray-800 font-medium text-lg">Get Your Own Message Board</p>
          <Link href="/">
            <Button className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-md shadow-md text-white transition">
              Create Your Account
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
