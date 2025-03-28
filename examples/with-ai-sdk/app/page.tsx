"use client";

import { makeAssistantToolUI, useThreadRuntime } from "@assistant-ui/react";
import { Thread } from "@assistant-ui/react-ui";
import { MyRuntimeProvider } from "./MyRuntimeProvider";
import { memo } from "react";
// import { useToolArgsFieldStatus } from "@assistant-ui/react";

type WebSearchArgs = {
  location: string;
};

type WebSearchResult = {
  location: string;
  temperature: number;
};

const WebSearchToolUI = makeAssistantToolUI<WebSearchArgs, WebSearchResult>({
  toolName: "weather",

  render: ({ args, status, result, addResult }) => {
    // console.log("status: ", status, result, addResult);

    // const thread = useThreadRuntime();
    // const s = useToolArgsFieldStatus("query");

    addResult(result); // This add result lines has to be called in order for the tool to get it's invocation result into the messgaes.

    // console.log("threaaad: ", thread.getState().messages);

    return (
      <div className="rounded-lg border p-4">
        status: {status.type}
        {status.type === "complete" ? (
          <div className="space-y-2">
            <p>
              <strong>Location:</strong> {result.location}
            </p>
            <p>
              <strong>Temperature:</strong> {result.temperature}°C
            </p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    );
  },
});

export default function Home() {
  return (
    <main className="h-full">
      <MyRuntimeProvider>
        <Thread />
        <WebSearchToolUI />
      </MyRuntimeProvider>
    </main>
  );
}
