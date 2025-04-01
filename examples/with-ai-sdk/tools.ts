import { aiSDKAdapter, auiServerTool } from "@assistant-ui/react";
import { z } from "zod";

export const webSearchTool = auiServerTool({
  toolName: "weather",
  description: "fetches current weather for location",
  parameters: z.object({
    location: z.string(),
    temperature: z.number(),
  }),
  server: async () => {
    console.log("YEAHHH");
    return {
      location: "sf",
      temperature: 78,
    };
  },
});

export const weatherTool = aiSDKAdapter(webSearchTool);
