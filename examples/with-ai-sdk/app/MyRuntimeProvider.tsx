"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  useVercelUseChatRuntime,
} from "@assistant-ui/react-ai-sdk";
import { useChat } from "ai/react";
import { useMemo } from "react";
// import { useChat } from "ai/react";

export function MyRuntimeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const chat = useChat({ api: "/api/chat" });

  // const runtime = useChatRuntime({ api: "/api/chat" });

  // const r = useVercelUseChatRuntime(chat);

  // const runtime = useMemo(() => r, []);

  const c = useChat({ api: "/api/chat" });
  const chat = useMemo(
    () => c,
    [c.messages, c.isLoading, c.addToolResult, c.unstable_joinStrategy],
  );
  console.log("chat: ", chat.messages);
  const runtime = useVercelUseChatRuntime(chat);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
