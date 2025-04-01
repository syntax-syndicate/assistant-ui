import { weatherTool, webSearchTool } from "@/tools";
import { openai } from "@ai-sdk/openai";
import { aiSDKAdapter } from "@assistant-ui/react";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log("weather: ", typeof weatherTool.execute);

  weatherTool.execute("test");

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      weather: weatherTool!,
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return result.toDataStreamResponse();
}
