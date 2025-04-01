import { Schema, z } from "zod";
import { Tool } from "./ModelContextTypes";

export type inferParameters<PARAMETERS extends Tool<any, any>["parameters"]> =
  PARAMETERS extends Schema<any>
    ? PARAMETERS["_type"]
    : PARAMETERS extends z.ZodTypeAny
      ? z.infer<PARAMETERS>
      : never;

// export function tool<
//   TArgs extends Tool<any, any>["parameters"],
//   TResult = any,
// >(tool: {
//   description?: string | undefined;
//   parameters: TArgs;
//   execute?: (
//     args: inferParameters<TArgs>,
//     context: {
//       toolCallId: string;
//       abortSignal: AbortSignal;
//     },
//   ) => TResult | Promise<TResult>;
// }): Tool<inferParameters<TArgs>, TResult> {
//   return tool;
// }

import type { ToolCallContentPartComponent } from "../types/ContentPartComponentTypes";
// import { makeAssistantToolUI } from "./makeAssistantToolUI";
import { tool, ToolExecutionOptions } from "ai";

export type AssistantToolUIProps<TArgs, TResult> = {
  toolName: string;
  render: ToolCallContentPartComponent<TArgs, TResult>;
};

export type Parameters = z.ZodTypeAny;
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
      server: (args: InferParameters<P>) => PromiseLike<Res>;
      client?: never;
    }
);

export type ServerTool<P extends Parameters = any, Res = any> = {
  toolName: string;
  parameters: P;
  description?: string;
  render?: ToolCallContentPartComponent<P, Res>;
  server: (
    args: InferParameters<P>,
    options?: ToolExecutionOptions,
  ) => PromiseLike<Res>;
  client?: never;
};

export type ClientTool<P extends Parameters = any, Res = any> = {
  toolName: string;
  parameters: P;
  description?: string;
  render?: ToolCallContentPartComponent<P, Res>;
  client: (args: InferParameters<P>) => PromiseLike<Res> | Res;
  server?: never;
};

// export const auiTool = <T extends Parameters, Res>(a: ServerTool<T, Res>) => ({
//   ...a,
//   getUI: () =>
//     makeAssistantToolUI<T, Res>({
//       toolName: a.toolName,
//       render: a.render ?? (() => <div>Default</div>),
//     }),
// });

// type ServerTool = <T extends Parameters, Res>(
//   a: ServerTool<T, Res>,
// ) => ServerTool<T, Res> & {
//   getUI: () => ReturnType<typeof makeAssistantToolUI<T, Res>>;
// };
// | (<T extends Parameters, Res>(
//     a: ClientTool<T, Res>,
//   ) => ClientTool<T, Res> & {
//     getUI: () => ReturnType<typeof makeAssistantToolUI<T, Res>>;
//   });

type AUIServerTool = <T extends Parameters, Res>(
  a: ServerTool<T, Res>,
) => ServerTool<T, Res>;

export const auiServerTool: AUIServerTool = (a) => ({
  ...a,
});

export const aiSDKAdapter = (a: ServerTool<any, any>) => {
  return tool({
    ...(a.description && { description: a.description }),
    parameters: a.parameters,
    execute: a.server,
  });
};

// export const auiToolBox = <
//   T extends Record<string, ReturnType<typeof auiTool<any, any>>>,
// >(
//   a: T,
// ) => ({
//   ...a,
// });

// const t = auiTool({
//   toolName: "test",
//   parameters: z.object({
//     temp: z.string(),
//   }),
//   client: (a) => parseInt(a),
// });

// const a = auiToolBox({
//   test: auiTool({
//     toolName: "teset",
//     parameters: z.string(),
//     client: (a) => parseInt(a),
//     render: () => <div></div>,
//   }),
//   t: t,
// });
