"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Page = () => {
  const params = useParams();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const { toast } = useToast();

  const handleMessage = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setContent("");
    }
  };

  const handleSuggestMessage = async () => {
    setIsLoadingMessages(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      const suggestedQuestions = response.data.suggestions?.length
        ? response.data.suggestions
        : [
            "What's a hobby you've recently started?",
            "If you could have dinner with any historical figure, who would it be?",
            "What's a simple thing that makes you happy?",
          ];
      setSuggestions(suggestedQuestions);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Error in suggest message",
        variant: "destructive",
      });
     
      setSuggestions([
        "What's a hobby you've recently started?",
        "If you could have dinner with any historical figure, who would it be?",
        "What's a simple thing that makes you happy?",
      ]);
    } finally {
      setIsLoadingMessages(false);
    }
  };
  

  return (
    <div className="flex flex-col justify-center items-center w-full mx-auto my-auto">
      <div className="font-bold text-2xl md:text-4xl mt-12">
        <h1>Public Profile Link</h1>
      </div>
      <div className="flex flex-col gap-2 mt-10 w-[90%] md:w-[70%]">
        <h3>Send Anonymous Message to @{username}</h3>
        <Input
          placeholder="Write your anonymous message here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          onClick={handleMessage}
          className="w-[100px] mt-5 ml-auto"
          disabled={isLoading || content.length === 0}
        >
          {isLoading ? "Sending..." : "Send it"}
        </Button>
      </div>
      <div className="flex flex-col items-center w-full">
        <Button
          className="mt-12 mb-6 font-bold"
          onClick={handleSuggestMessage}
          disabled={isLoadingMessages}
        >
          Suggest Messages
        </Button>
        <p>Click on any message below to select it.</p>
        <div className="flex flex-col border p-8 mt-3 w-[90%] md:w-[70%] mb-4">
          <h1>Messages</h1>
          <div className="flex flex-col gap-5 mt-4">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                className="text-center overflow-hidden"
                variant="outline"
                onClick={() => setContent(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
