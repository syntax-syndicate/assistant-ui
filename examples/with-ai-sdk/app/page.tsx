"use client";

import { makeAssistantTool, makeAssistantToolUI } from "@assistant-ui/react";
import { Thread } from "@assistant-ui/react-ui";
import { Tool, ToolInvocation } from "ai";
import { useChat } from "@ai-sdk/react";
import { z } from "zod";
import { webSearchTool } from "@/tools";

type WebSearchArgs = {
  location: string;
};

type WebSearchResult = {
  location: string;
};

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxSteps: 5,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === "getLocation") {
          const cities = [
            "New York",
            "Los Angeles",
            "Chicago",
            "San Francisco",
          ];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });

  return (
    <>
      {messages?.map((message) => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map((part) => {
            switch (part.type) {
              // render text parts as simple text:
              case "text":
                return part.text;

              // for tool invocations, distinguish between the tools and the state:
              case "tool-invocation": {
                const callId = part.toolInvocation.toolCallId;

                switch (part.toolInvocation.toolName) {
                  case "askForConfirmation": {
                    switch (part.toolInvocation.state) {
                      case "call":
                        return (
                          <div key={callId}>
                            {part.toolInvocation.args.message}
                            <div>
                              <button
                                onClick={() =>
                                  addToolResult({
                                    toolCallId: callId,
                                    result: "Yes, confirmed.",
                                  })
                                }
                              >
                                Yes
                              </button>
                              <button
                                onClick={() =>
                                  addToolResult({
                                    toolCallId: callId,
                                    result: "No, denied",
                                  })
                                }
                              >
                                No
                              </button>
                            </div>
                          </div>
                        );
                      case "result":
                        return (
                          <div key={callId}>
                            Location access allowed:{" "}
                            {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }

                  case "getLocation": {
                    switch (part.toolInvocation.state) {
                      case "call":
                        return <div key={callId}>Getting location...</div>;
                      case "result":
                        return (
                          <div key={callId}>
                            Location: {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }

                  case "getWeatherInformation": {
                    switch (part.toolInvocation.state) {
                      // example of pre-rendering streaming tool calls:
                      case "partial-call":
                        return (
                          <pre key={callId}>
                            {JSON.stringify(part.toolInvocation, null, 2)}
                          </pre>
                        );
                      case "call":
                        return (
                          <div key={callId}>
                            Getting weather information for{" "}
                            {part.toolInvocation.args.city}...
                          </div>
                        );
                      case "result":
                        return (
                          <div key={callId}>
                            Weather in {part.toolInvocation.args.city}:{" "}
                            {part.toolInvocation.result}
                          </div>
                        );
                    }
                    break;
                  }
                }
              }
            }
          })}
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
const WebSearchToolUI = webSearchTool.getUI();

/*
  const auitoolbox = assistantUIToolBox({
    weather: {
      description: "Weather tool",
      parameters: z.object({
        location: z.string()
      })
      client: ({ args }) => Math.random()
    }
  })

  auitoolbox.weather.component({ args, result }) => {
    render (
      { typeof result === number }
      <div>{result}</div>
    )
  }
 */

// Record<string, {}> {} descrip, param, server / client,

// assistantUITools.tool.component({
// })

// assistantUITools.tool.component({
//  render: ({}) ( only needs render )
// })

// getVercelTool(assistantUITools.weather) || tool(assistantUITools.weather) ?

// getVercelAISDKServerTools -> server side ai-sdk tools.

// component <AssistantUIToolbox tools={}> to register client side tools like existing makeAssistantTool component thing

// all zod based for now, with standard schema in the future

// const WebSearchToolUI = makeAssistantToolUI<WebSearchArgs, WebSearchResult>({
//   toolName: "weather",
//   render: ({ args, status, result, addResult }) => {
//     return (
//       <div className="rounded-lg border p-4">
//         status: {status.type}
//         <button
//           onClick={() =>
//             addResult({
//               location: "sf",
//               temperature: "101",
//             })
//           }
//         >
//           complete
//         </button>
//         {status.type === "complete" ? (
//           <div className="space-y-2">
//             <p>
//               <strong>Location:</strong> {result?.location}
//             </p>
//             <p>
//               <strong>Temperature:</strong> {result?.temperature}°C
//             </p>
//           </div>
//         ) : (
//           <p>Loading weather data...</p>
//         )}
//       </div>
//     );
//   },
// });

// const WebSearchToolUI = auiTool({
//   toolName: "weather",
//   parameters: z.object({
//     location: z.string(),
//     temperature: z.number(),
//   }),
//   client: () => ({
//     location: "sf",
//     temperature: 100,
//   }),
//   render: ({ status, result, addResult }) => {
//     return (
//       <div className="rounded-lg border p-4">
//         status: {status.type}
//         <button
//           onClick={() =>
//             addResult({
//               location: "sf",
//               temperature: 100,
//             })
//           }
//         >
//           complete
//         </button>
//         {status.type === "complete" ? (
//           <div className="space-y-2">
//             <p>
//               <strong>Location:</strong> {result?.location}
//             </p>
//             <p>
//               <strong>Temperature:</strong> {result?.temperature}°C
//             </p>
//           </div>
//         ) : (
//           <p>Loading weather data...</p>
//         )}
//       </div>
//     );
//   },
// }).getUI();

export default function Home() {
  return (
    <main className="h-full">
      <Chat />
      <WebSearchToolUI />
      <Thread />
    </main>
  );
}
