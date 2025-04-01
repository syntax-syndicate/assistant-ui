// import { weatherTool } from "../../../tools";
import { weatherTool } from "@/tools";
import { openai } from "@ai-sdk/openai";
// import { aiSDKAdapter } from "@assistant-ui/rea=-ct";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // console.log("weather: ", typeof weatherTool.execute());

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      weather: weatherTool,
      // weather: tool({
      //   description: "fetches current weather for location",
      //   parameters: z.object({
      //     location: z.string(),
      //     temperature: z.number(),
      //   }),
      //   execute: async ({ location }) => {
      //     console.log("YEAHHH");
      //     return {
      //       location: location,
      //       temperature: 78,
      //     };
      //   },
      // }),
    },
    onError: (e) => {
      console.log(e);
    },
  });

  return result.toDataStreamResponse();
}
