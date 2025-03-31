"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import { tool } from "./tool";

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

// type AUIToolBoxRet =

// type AUITBFunc = <TArgs extends AssistantUIToolBox>() => {
//   [a keyof Tar]:
// }

// export function auiTB<T extends AssistantUIToolBox>() {

// }

const assistantUIToolBox = (tools: AssistantUIToolBox) => {
  const toolsWithComponent = Object.entries(tools).reduce(
    (acc, [key, tool]) => {
      return {
        ...acc,
        [key]: {
          ...tool,
          component: () => null,
        },
      };
    },
    {},
  );

  return toolsWithComponent;
};

const test = assistantUIToolBox({
  weather: {
    description: "test",
    parameters: {},
    server: () => null,
  },
});

// test.weather?.description

// const test: AssistantUIToolBox = {
//   weather: {
//     description: "string",
//     parameters: "hi!",
//     client: () => null,
//   },
// };

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
