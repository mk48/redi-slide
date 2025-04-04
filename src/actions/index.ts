import { defineAction } from "astro:actions";
import { number, z } from "astro:schema";
import { CollectNodes } from "./collect-nodes";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { NodeModel } from "@minoru/react-dnd-treeview";
import { writeFileSync } from "fs";

const srcDir = () => {
  return dirname(fileURLToPath(import.meta.url))
    .replace("/actions", "")
    .replace("\\actions", "");
};

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
      const resolvedPath = path.join(srcDir(), "pages", input.baseDirectory);

      const nodes = CollectNodes(resolvedPath, 1, 0);

      //console.log(nodes);
      return nodes;
    },
  }),
  saveSlideOrders: defineAction({
    input: z.object({
      nodes: z.array(
        z.object({
          id: z.string().or(z.number()),
          parent: z.string().or(z.number()),
          text: z.string(),
          droppable: z.optional(z.boolean()),
          data: z.any(),
        })
      ),
    }),
    handler: async (input): Promise<void> => {
      const slidesFilePath = path.join(srcDir(), "components", "slide-admin", "slides.json");

      console.log("save into: ", slidesFilePath);
      try {
        writeFileSync(slidesFilePath, JSON.stringify(input.nodes, null, 2), "utf8");
        console.log("Data successfully saved to disk");
      } catch (error) {
        console.log("An error has occurred ", error);
      }
    },
  }),
};
