"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useVercelUseChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useChat } from "ai/react";

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chat = useChat({
    api: "/api/chat",
    onToolCall: ({ toolCall }) => {
      console.log("test :", toolCall);
    },
    onFinish: (msg) => {
      console.log("msg: ", msg);
    },
    maxSteps: 5,
  });

  console.log("chat: ", chat.messages);
  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
