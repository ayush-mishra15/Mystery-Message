'use client';

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
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      toast.success(response.data.message);
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error('Error', {
        description: axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  };

  return (
  <Card className="rounded-xl bg-gray-950 border border-gray-700 transition duration-300 hover:bg-black hover:ring-1 hover:ring-gray-500/50 hover:shadow-[0_0_10px_1px_rgba(13,148,136,0.3)]">
      <CardHeader className="flex justify-between items-start gap-4">
        <CardTitle className="text-gray-100 text-base font-medium leading-snug flex-1 break-words">
          {message.content}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              aria-label="Delete message"
              className="text-red-500 hover:text-red-400 bg-gray-900 border border-gray-700 p-2 rounded-md hover:bg-gray-700 transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-gray-950 border border-gray-700 text-gray-200">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-white">
                Confirm Delete
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 mt-1">
                This message will be permanently deleted and cannot be recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-gray-300 hover:bg-gray-700 transition">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="pt-0">
        <time
          dateTime={new Date(message.createdAt).toISOString()}
          className="block text-xs text-gray-500 italic text-right select-none"
        >
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </time>
      </CardContent>
    </Card>
  );
}
