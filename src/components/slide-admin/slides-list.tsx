import { getBackendOptions, MultiBackend, Tree, type DropOptions, type NodeModel } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import { DndProvider, type DragSourceMonitor } from "react-dnd";
import { CustomNode } from "./custom-node";
import { Placeholder } from "./placeholder";
import slides from "./slides.json";
import styles from "./style.module.css";
import { cn } from "@/lib/utils";
import { FilePlus, FilePlus2, FolderPlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actions } from "astro:actions";
import { getLastPartFromPath } from "@/lib/slid-utils";

type Props = {
  onSelect: (node: NodeModel) => void;
};

const getLastId = (treeData: NodeModel[]): number => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return Number(reversedArray[0].id);
  }

  return 0;
};

const SlidesList: React.FC<Props> = (props) => {
  const [treeData, setTreeData] = useState<NodeModel[]>(slides);

  /*useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      const { data, error } = await actions.generateSlidesJsonFromDirectory({ baseDirectory: "arrays" });

      if (isSubscribed && data) {
        console.log(data);
        setTreeData(data);
      }
    };

    fetchData().catch(console.error);

    return () => {
      isSubscribed = false;
    };
  }, []);*/

  const createSlidesJsonFromDirectory = async (baseDirectory: string) => {
    const { data, error } = await actions.generateSlidesJsonFromDirectory({ baseDirectory: baseDirectory });
  };

  const renameWithCorrectSrNo = async (newTreeData: NodeModel[], parentId: string | number) => {
    const children = newTreeData.filter((t) => t.parent === parentId);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const name = getLastPartFromPath(child.text);

      //get srNo from name
      const nameSplit = name.split("-");
      const srNo = i + 1 < 10 ? "0" + (i + 1).toString() : (i + 1).toString();

      let newName = srNo + "-" + name;
      if (nameSplit.length >= 2 && nameSplit[0] && !Number.isNaN(Number(nameSplit[0]))) {
        const childSrNo = Number(nameSplit[0]);

        if (childSrNo === i + 1) {
          newName = ""; //rename not needed, since the srNo is correct
        } else {
          //put current srNo
          newName = srNo + "-" + name.substring(name.indexOf("-") + 1);
        }
      }

      if (newName !== "") {
        const newNameFullText = child.text.substring(0, child.text.lastIndexOf("/") + 1) + newName;
        //==>const { data, error } = await actions.rename({ baseDirectory: "arrays",  currentName: child.text, newName: newNameFullText });
        console.log("Rename ", child.text, " to ", newNameFullText);
      }
    }
  };

  const handleDrop = async (newTreeData: NodeModel[], options: DropOptions<unknown>) => {
    //console.log(options);
    setTreeData(newTreeData);
    if (options.dragSource && options.dropTarget && options.relativeIndex !== undefined) {
      if (options.dragSource.parent !== options.dropTarget.id) {
        //move happened between folder
        const name = getLastPartFromPath(options.dragSource.text);

        let basePath = "/arrays";
        if (options.dropTarget.text !== "/") {
          basePath = options.dropTarget.text;
        }
        const toPath = basePath + "/" + name;

        //move the folder
        //==>const { data, error } = await actions.rename({ baseDirectory: "arrays",  currentName: options.dragSource.text, newName: toPath });
        console.log("Rename ", options.dragSource.text, " to ", toPath);

        //rearrange `from` folder children
        await renameWithCorrectSrNo(newTreeData, options.dragSource.parent);
      }

      //rearrange `to` folder children
      await renameWithCorrectSrNo(newTreeData, options.dropTarget.id);

      //const { data, error } = await actions.saveSlideOrders({ nodes: newTreeData });
      //==> await createSlidesJsonFromDirectory("arrays");
    }
  };

  const createNewSlide = async (parentNode: NodeModel) => {
    let newSlideName = prompt("Slide name");
    if (newSlideName) {
      const fullPath = parentNode.text + "/" + newSlideName;
      const { data, error } = await actions.createNewSlide({ fullPath: fullPath });
      if (!error) {
        //add the new slide into tree
        const newId = getLastId(treeData) + 1;
        const newNode: NodeModel = {
          id: newId,
          parent: parentNode.id,
          text: fullPath,
          droppable: false,
        };

        const nodesWithNew = [...treeData, newNode];
        setTreeData(nodesWithNew);
        const { data, error } = await actions.saveSlideOrders({ nodes: nodesWithNew });
      }
    }
  };

  const createNewFolder = async (parentNode: NodeModel) => {
    let newFolderName = prompt("New folder name");
    if (newFolderName) {
      const { data, error } = await actions.createNewFolder({ baseDirectory: "arrays", folderName: newFolderName });
      if (!error) {
        //add the new folder into tree
        const newId = getLastId(treeData) + 1;
        const newNode: NodeModel = {
          id: newId,
          parent: parentNode.id,
          text: "/arrays/" + newFolderName,
          droppable: true,
        };

        const nodesWithNew = [...treeData, newNode];
        setTreeData(nodesWithNew);
        const { data, error } = await actions.saveSlideOrders({ nodes: nodesWithNew });
      }
    }
  };

  const rename = async (node: NodeModel) => {
    const currentName = node.text.substring(node.text.lastIndexOf("/") + 1);
    let newName = prompt("Rename", currentName);

    if (newName) {
      const newNameFullText = node.text.substring(0, node.text.lastIndexOf("/") + 1) + newName;
      const treeWithRenamedNode = treeData.map((t) => {
        if (t.text === node.text) {
          return { ...node, text: newNameFullText };
        }

        return t;
      });

      const { data, error } = await actions.rename({
        baseDirectory: "arrays",
        currentName: currentName,
        newName: newName,
      });
      if (!error) {
        setTreeData(treeWithRenamedNode);
        const { data, error } = await actions.saveSlideOrders({ nodes: treeWithRenamedNode });
      }
    }
  };

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={treeData}
        rootId={0}
        sort={false}
        insertDroppableFirst={false}
        onDrop={handleDrop}
        initialOpen={true}
        classes={{
          //root: styles.treeRoot,
          //draggingSource: styles.draggingSource,
          placeholder: styles.placeholderContainer,
        }}
        render={(node, { depth, isOpen, onToggle }) => (
          <div
            className="flex justify-between items-center"
            onClick={() => props.onSelect(node)}
            style={{ paddingLeft: depth * 24 }}
          >
            <CustomNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} />
            {node.droppable && (
              <div className="flex gap-4">
                <Button variant="outline" size="icon" onClick={() => createNewFolder(node)}>
                  <FolderPlus />
                </Button>
                <Button variant="outline" size="icon" onClick={() => createNewSlide(node)}>
                  <FilePlus />
                </Button>
              </div>
            )}
            <Button variant="outline" size="icon" onClick={() => rename(node)}>
              <Pencil />
            </Button>
          </div>
        )}
        canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        dropTargetOffset={10}
        placeholderRender={(node, { depth }) => <Placeholder node={node} depth={depth} />}
      />
    </DndProvider>
  );
};

export default SlidesList;
