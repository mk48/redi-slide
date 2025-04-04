import type { NodeModel } from "@minoru/react-dnd-treeview";
import { readdir } from "fs/promises";
import path from "node:path";
import fs from "node:fs";

const isDirectory = (fileName: string) => {
  return fs.lstatSync(fileName).isDirectory(); // .isFile();
};

const dirIndex = (dirPath: string) => {
  if (dirPath === "/") {
    return 0;
  }

  //get dir name
  const dirName = dirPath.split(path.sep).pop();
  let dirIndex = 1;
  //check whether the dir name, starts with number `##-name`
  const dirSections = dirName?.split("-");
  if (dirSections && (dirSections?.length ?? 0) > 1) {
    const dirNumber = Number(dirSections[0]);
    if (isNaN(dirNumber)) {
      dirIndex = dirNumber;
    }
  }

  return dirIndex;
};

export function CollectNodes(dirPath: string, dirIndex: number, parentDir: string, parentIndex: number): NodeModel[] {
  const subFolders = fs
    .readdirSync(dirPath)
    .map((fileName) => {
      return path.join(dirPath, fileName);
    })
    .filter(isDirectory);

  const calculatedDirIndex = dirIndex + parentIndex * 100;
  const nodeMdl: NodeModel[] = [
    {
      id: calculatedDirIndex,
      parent: parentIndex,
      droppable: false,
      text: `${calculatedDirIndex} ${dirPath}`,
    },
  ];

  if (subFolders.length > 0) {
    const subModels: NodeModel[] = [];
    let nextIndex = 0;
    for (const s of subFolders) {
      nextIndex++;
      const mdls = CollectNodes(s, nextIndex, dirPath, calculatedDirIndex);
      subModels.push(...mdls);
    }

    return [{ ...nodeMdl[0], droppable: true }, ...subModels];
  }

  return nodeMdl;
}
