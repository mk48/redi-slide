import { defineAction } from "astro:actions";
import { number, z } from "astro:schema";
import { CollectNodes } from "./collect-nodes";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import type { NodeModel } from "@minoru/react-dnd-treeview";
import fs from "fs";

const srcDir = () => {
  return dirname(fileURLToPath(import.meta.url))
    .replace("/actions", "")
    .replace("\\actions", "");
};

export const server = {
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
  /*generateSlidesJsonFromDirectory: defineAction({
    input: z.object({
      baseDirectory: z.string(),
    }),
    handler: async (input): Promise<void> => {
      const resolvedPath = path.join(srcDir(), "pages", input.baseDirectory);
      const nodes = CollectNodes(resolvedPath, 1, 0);

      const slidesFilePath = path.join(srcDir(), "components", "slide-admin", "slides.json");

      //console.log("save into: ", slidesFilePath);
      try {
        fs.writeFileSync(slidesFilePath, JSON.stringify(nodes, null, 2), "utf8");
        console.log("Data successfully saved to disk");
      } catch (error) {
        console.log("An error has occurred ", error);
      }
    },
  }),*/
  /*saveSlideOrders: defineAction({
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

      //console.log("save into: ", slidesFilePath);
      try {
        fs.writeFileSync(slidesFilePath, JSON.stringify(input.nodes, null, 2), "utf8");
        console.log("Data successfully saved to disk");
      } catch (error) {
        console.log("An error has occurred ", error);
      }
    },
  }),*/
  getSlideContent: defineAction({
    input: z.object({
      slidePath: z.string(),
    }),
    handler: async (input): Promise<string> => {
      const slidePath = path.join(srcDir(), "pages", input.slidePath, "index.mdx");

      const data = fs.readFileSync(slidePath, "utf8");

      //console.log(nodes);
      return data;
    },
  }),
  saveSlideContent: defineAction({
    input: z.object({
      slidePath: z.string(),
      content: z.string(),
    }),
    handler: async (input): Promise<void> => {
      const slidePath = path.join(srcDir(), "pages", input.slidePath, "index.mdx");
      fs.writeFileSync(slidePath, input.content, "utf8");
    },
  }),
  createNewSlide: defineAction({
    input: z.object({
      fullPath: z.string(),
    }),
    handler: async (input): Promise<void> => {
      const newFolder = path.join(srcDir(), "pages", input.fullPath);
      fs.mkdirSync(newFolder);

      const newMdxContent = `---
title: ''
layout: '@/layouts/slide.astro'
---

      `;
      const indexMdx = path.join(newFolder, "index.mdx");
      fs.writeFile(indexMdx, newMdxContent, function (err) {
        if (err) throw err;
      });
    },
  }),
  createNewFolder: defineAction({
    input: z.object({
      baseDirectory: z.string(),
      folderName: z.string(),
    }),
    handler: async (input): Promise<void> => {
      const newFolder = path.join(srcDir(), "pages", input.baseDirectory, input.folderName);
      fs.mkdirSync(newFolder);
    },
  }),

  rename: defineAction({
    input: z.object({
      currentName: z.string(),
      newName: z.string(),
    }),
    handler: async (input): Promise<void> => {
      console.log(input.currentName + " --> " + input.newName);

      const currentFolderPath = path.join(srcDir(), "pages", input.currentName);
      const newFolderPath = path.join(srcDir(), "pages", input.newName);

      try {
        fs.renameSync(currentFolderPath, newFolderPath);
      } catch (error) {
        console.log("An error has occurred ", error);
      }
    },
  }),
};
