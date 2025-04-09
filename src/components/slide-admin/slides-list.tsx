import { getBackendOptions, MultiBackend, Tree, type NodeModel } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { CustomNode } from "./custom-node";
import { Placeholder } from "./placeholder";
import slides from "./slides.json";
import styles from "./style.module.css";
import { cn } from "@/lib/utils";
import { FilePlus, FilePlus2, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actions } from "astro:actions";

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
      const { data, error } = await actions.getDirectory({ baseDirectory: "arrays" });

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

  const handleDrop = async (newTreeData: NodeModel[]) => {
    console.log(newTreeData);
    setTreeData(newTreeData);

    const { data, error } = await actions.saveSlideOrders({ nodes: newTreeData });
  };

  const createNewSlide = async (parentNode: NodeModel) => {
    let newSlideName = prompt("Slide name");
    if (newSlideName) {
      const { data, error } = await actions.createNewSlide({ baseDirectory: "arrays", slideName: newSlideName });
      if (!error) {
        //add the new slide into tree
        const newId = getLastId(treeData) + 1;
        const newNode: NodeModel = {
          id: newId,
          parent: parentNode.id,
          text: "/arrays/" + newSlideName,
          droppable: false,
        };

        const nodesWithNew = [...treeData, newNode];
        setTreeData(nodesWithNew);
        const { data, error } = await actions.saveSlideOrders({ nodes: nodesWithNew });
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
                <Button variant="outline" size="icon">
                  <FolderPlus />
                </Button>
                <Button variant="outline" size="icon" onClick={() => createNewSlide(node)}>
                  <FilePlus />
                </Button>
              </div>
            )}
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
