import { getBackendOptions, MultiBackend, Tree, type NodeModel } from "@minoru/react-dnd-treeview";
import { Folder, FolderOpen } from "lucide-react";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import slides from "./slides.json";
import { actions } from "astro:actions";
import { CustomNode } from "./custom-node";
import { Placeholder } from "./placeholder";
import styles from "./style.module.css";

export default function SlidesList() {
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

    //const { data, error } = await actions.saveSlideOrders({ nodes: newTreeData });
  };

  return (
    <>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          sort={false}
          insertDroppableFirst={false}
          onDrop={handleDrop}
          classes={{
            //root: styles.treeRoot,
            //draggingSource: styles.draggingSource,
            placeholder: styles.placeholderContainer,
          }}
          render={(node, { depth, isOpen, onToggle }) => (
            <CustomNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle} />
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
    </>
  );
}
