"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import z from "zod";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

type Params = z.ZodTypeAny;
type InferParams = z.infer<Params>;

function Test<P extends Params, Params>(args: P): Params {
  console.log(args);
  return args;
}

export const useAssistantToolUI = (
  tool: AssistantToolUIProps<any, any> | null,
) => {
  const toolUIsStore = useToolUIsStore();
  useEffect(() => {
    if (!tool) return;
    return toolUIsStore.getState().setToolUI(tool.toolName, tool.render);
  }, [toolUIsStore, tool?.toolName, tool?.render, !tool]);
};
