import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import z from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const weahter = tool({
    description: "Get the weather in a location",
    parameters: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => ({
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }),
  });

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      weather: weahter,
    },
  });

  return result.toDataStreamResponse();
}
