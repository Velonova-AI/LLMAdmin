'use client';

import { Suspense } from "react";
import { Chat } from "@/components/chat";
import { DataStreamHandler } from "@/components/data-stream-handler";
import { DataStreamProvider } from "@/components/data-stream-provider";
import { DEFAULT_CHAT_MODEL } from "@/lib/ai/models";
import { useParams } from "react-router";
import { useGetOne, useTranslate } from "ra-core";
import type { ChatMessage } from "@/lib/types";
import { useEffect, useState } from "react";

export const ChatPage = () => {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <ChatPageContent />
    </Suspense>
  );
};

function ChatPageContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const translate = useTranslate();
  
  // Use React Admin's useGetOne for better integration, but we still need the custom API
  // So we'll use a hybrid approach: fetch from the API but use React Admin's loading state
  const [chatData, setChatData] = useState<{ 
    chat: any; 
    messages: ChatMessage[]; 
    canEdit: boolean 
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchChatData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/chat/${id}`);
        if (!response.ok) {
          throw new Error("Chat not found");
        }
        const data = await response.json();
        setChatData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load chat"));
        console.error("Error fetching chat:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [id]);

  if (loading) {
    return <div className="flex h-dvh items-center justify-center">Loading chat...</div>;
  }

  if (error || !chatData || !id) {
    return <div className="flex h-dvh items-center justify-center">{error?.message || "Chat not found"}</div>;
  }

  const chatModelFromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("chat-model="))
    ?.split("=")[1];

  if (!chatModelFromCookie) {
    return (
      <DataStreamProvider>
        <Chat
          autoResume={true}
          id={chatData.chat.id}
          initialChatModel={DEFAULT_CHAT_MODEL}
          initialMessages={chatData.messages}
          initialVisibilityType={chatData.chat.visibility}
          isReadonly={!chatData.canEdit}
        />
        <DataStreamHandler />
      </DataStreamProvider>
    );
  }

  return (
    <DataStreamProvider>
      <Chat
        autoResume={true}
        id={chatData.chat.id}
        initialChatModel={chatModelFromCookie}
        initialMessages={chatData.messages}
        initialVisibilityType={chatData.chat.visibility}
        isReadonly={!chatData.canEdit}
      />
      <DataStreamHandler />
    </DataStreamProvider>
  );
}