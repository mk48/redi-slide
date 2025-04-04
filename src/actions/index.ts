import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { CollectNodes } from "./collect-nodes";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { NodeModel } from "@minoru/react-dnd-treeview";

export const server = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input) => {
      console.log(input);
      return `Hello, ${input.name}!`;
    },
  }),
  getDirectory: defineAction({
    input: z.object({
      baseDirectory: z.string(),
    }),
    handler: async (input): Promise<NodeModel[]> => {
      const __dirname = dirname(fileURLToPath(import.meta.url))
        .replace("/actions", "")
        .replace("\\actions", "");

      const resolvedPath = path.join(__dirname, "pages", input.baseDirectory);

      const nodes = CollectNodes(resolvedPath, 1, "/", 0);

      //console.log(nodes);
      return nodes;
    },
  }),
};
