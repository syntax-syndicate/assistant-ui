"use client";

import { useEffect } from "react";
import { useToolUIsStore } from "../context/react/AssistantContext";
import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
import z from "zod";
import { makeAssistantToolUI } from "./makeAssistantToolUI";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

type Parameters = z.ZodTypeAny;
type InferParameters<P extends Parameters> = z.infer<P>;
type ToolTest<P extends Parameters = any, Res = any> =
  | {
      name: string;
      parameters: P;
      description?: string;
      // client: (args: InferParameters<P>) => PromiseLike<Res> | Res;
      render?: ToolCallContentPartComponent<InferParameters<P>, Res>;
    }
  | {
      name: string;
      parameters: P;
      description?: string;
      // server: (args: InferParameters<P>) => PromiseLike<Res> | Res;
      // render?: (args: Res) => any;
      render?: ToolCallContentPartComponent<InferParameters<P>, Res>;
    };

const auiTool = <T extends Parameters, Res>(
  a:
    | (ToolTest<T, Res> & {
        client: (args: InferParameters<T>) => Res;
      })
    | (ToolTest<T, Res> & {
        server: (args: InferParameters<T>) => Res;
      }),
) => ({
  ...a,
  ...(a.render && {
    getUI: makeAssistantToolUI<InferParameters<T>, Res>({
      toolName: a.name,
      render: a.render,
    }),
  }),
});

const auiToolBox = <
  T extends Record<string, ReturnType<typeof auiTool<any, any>>>,
>(
  a: T,
) => ({
  ...a,
});

const t = auiTool({
  name: "test",
  parameters: z.string(),
  // server: (a) => parseInt(a),
  client: (a) => parseInt(a),
});

const a = auiToolBox({
  test: auiTool({
    name: "teset",
    parameters: z.number(),
    server: (a) => a,
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
