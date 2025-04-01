"use client";
import { aiSDKAdapter, auiServerTool } from "@assistant-ui/react";
import { z } from "zod";

export const webSearchTool = auiServerTool({
  toolName: "weather",
  description: "Get weather information for a location",
  parameters: z.object({
    location: z.string(),
    temperature: z.number(),
  }),
  server: async () => {
    console.log("runs?");
    return {
      location: "sf",
      temperature: 100,
    };
  },
  render: ({ status, result, addResult }) => {
    return (
      <div className="rounded-lg border p-4">
        status: {status.type}
        <button
          onClick={() =>
            addResult({
              location: "sf",
              temperature: 100,
            })
          }
        >
          complete
        </button>
        {status.type === "complete" ? (
          <div className="space-y-2">
            <p>
              <strong>Location:</strong> {result?.location}
            </p>
            <p>
              <strong>Temperature:</strong> {result?.temperature}°C
            </p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    );
  },
});

export const weatherTool = aiSDKAdapter(webSearchTool);
