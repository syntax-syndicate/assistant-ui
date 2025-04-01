"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import z from "zod";
import { makeAssistantToolUI } from "./makeAssistantToolUI";
import { tool } from "./tool";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

type Parameters = z.ZodTypeAny;
type InferParameters<P extends Parameters> = z.infer<P>;
type ToolTest<P extends Parameters = any, Res = any> = {
  toolName: string;
  parameters: P;
  description?: string;
  render?: ToolCallContentPartComponent<P, Res>;
} & (
  | {
      client: (args: InferParameters<P>) => PromiseLike<Res> | Res;
      server?: never;
    }
  | {
      server: (args: InferParameters<P>) => PromiseLike<Res> | Res;
      client?: never;
    }
);

type ServerTool<P extends Parameters = any, Res = any> = {
  toolName: string;
  parameters: P;
  description?: string;
  render?: ToolCallContentPartComponent<P, Res>;
  server: (args: InferParameters<P>) => PromiseLike<Res> | Res;
  client?: never;
};

const auiTool = <T extends Parameters, Res>(a: ToolTest<T, Res>) => ({
  ...a,
  getUI: makeAssistantToolUI<T, Res>({
    toolName: a.toolName,
    render: a.render ?? (() => <div>Default</div>),
  }),
});

export const aiSDKAdapter = <T extends ServerTool>(a: T) =>
  tool({
    description: a.description,
    parameters: a.parameters,
    execute: a.server,
  });

const auiToolBox = <
  T extends Record<string, ReturnType<typeof auiTool<any, any>>>,
>(
  a: T,
) => ({
  ...a,
});

const t = auiTool({
  toolName: "test",
  parameters: z.string(),
  client: (a) => parseInt(a),
});

const a = auiToolBox({
  test: auiTool({
    toolName: "teset",
    parameters: z.string(),
    client: (a) => parseInt(a),
    render: () => <div></div>,
  }),
  t: t,
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
