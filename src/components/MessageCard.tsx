'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  };

  return (
    <Card className="card-bordered rounded-md shadow-sm hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex justify-between items-start gap-4">
        <CardTitle className="text-gray-900 text-base font-medium leading-snug flex-1 break-words">
          {message.content}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="p-1 rounded-md text-red-600 hover:bg-red-100 transition shadow-sm hover:shadow-md"
              aria-label="Delete message"
              size="icon"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold">
                Confirm Delete
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-1 text-gray-700">
                This message will be permanently deleted and cannot be recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="space-x-3">
              <AlertDialogCancel className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="pt-0">
        <time
          dateTime={message.createdAt}
          className="block text-xs text-gray-500 italic text-right select-none"
        >
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </time>
      </CardContent>
    </Card>
  );
}
