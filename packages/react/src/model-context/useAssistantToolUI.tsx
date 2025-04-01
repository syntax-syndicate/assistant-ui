"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import z from "zod";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

type Parameters = z.ZodTypeAny;
type InferParameters<P extends Parameters> = z.infer<P>;
type ToolTest<P extends Parameters = any, Res = any> = {
  parameters: P;
  description?: string;
  client: (args: InferParameters<P>) => Promise<Res> | Res;
  render: (args: Res) => React.ReactNode;
};

const auiTool = <T extends Parameters, Res>(
  a: ToolTest<T, Res> & {
    client: (args: InferParameters<T>) => Res;
  },
) => a;

auiTool({
  parameters: z.string(),
  client: (a) => parseInt(a),
  render: (b) => <div>{b}</div>,
});

export const useAssistantToolUI = (
  tool: AssistantToolUIProps<any, any> | null,
) => {
  const toolUIsStore = useToolUIsStore();
  useEffect(() => {
    if (!tool) return;
    return toolUIsStore.getState().setToolUI(tool.toolName, tool.render);
  }, [toolUIsStore, tool?.toolName, tool?.render, !tool]);
};
