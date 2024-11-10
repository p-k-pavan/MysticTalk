"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import { X } from 'lucide-react';
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast";
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void
}

const MessageCard = ({
  message,
  onMessageDelete
}: MessageCardProps) => {
  const { toast } = useToast()

  const handleDeleteMessage = async () => {
    if (!message._id) {
      toast({
        title: "Message ID not found",
        description: "Unable to delete this message."
      })
      return
    }

    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast({
        title: response.data.message
      })
      onMessageDelete(message?._id)
    } catch (error) {
      toast({
        title: "Deletion failed",
        description: "An error occurred while deleting the message."
      })
    }
  }

  return (
    <Card className="mt-10 mx-10">
  <CardHeader className="flex flex-col sm:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
    <CardTitle>{message?.content}</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-[60px] md:ml-auto">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your message and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </CardHeader>
  <CardContent>
    <CardDescription>{message?.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'Unknown date'}</CardDescription>
  </CardContent>
</Card>

  )
}

export default MessageCard
