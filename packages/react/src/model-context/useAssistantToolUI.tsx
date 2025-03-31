"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

// export interface AssistantUITool {
//   description: string;
//   parameters: unknown;
//   client: ({ args }: { args: AssistantUITool["parameters"] }) => void;
// }
// export interface AssistantUITool {
//   description: string;
//   parameters: unknown;
//   server: () => void;
// }

export type AssistantUITool =
  | {
      description: string;
      parameters: unknown;
      client: ({ args }: { args: AssistantUITool["parameters"] }) => void;
    }
  | {
      description: string;
      parameters: unknown;
      server: () => void;
    };

export type AssistantUIToolBox = Record<string, AssistantUITool>;

const test: AssistantUIToolBox = {
  weather: {
    description: "string",
    parameters: "hi!",
    client: () => null,
  },
};

// export const auiToolbox

export const useAssistantToolUI = (
  tool: AssistantToolUIProps<any, any> | null,
) => {
  const toolUIsStore = useToolUIsStore();
  useEffect(() => {
    if (!tool) return;
    return toolUIsStore.getState().setToolUI(tool.toolName, tool.render);
  }, [toolUIsStore, tool?.toolName, tool?.render, !tool]);
};
