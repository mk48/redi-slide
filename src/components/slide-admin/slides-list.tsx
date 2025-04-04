import { actions } from "astro:actions";
import { useEffect, useState } from "react";
import { Tree, getBackendOptions, MultiBackend, type NodeModel, type DropOptions } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { Folder, FolderOpen } from "lucide-react";

export default function SlidesList() {
  const [treeData, setTreeData] = useState<NodeModel[]>([
    {
      id: "1",
      parent: "0",
      droppable: true,
      text: "Folder 1",
    },
  ]);

  useEffect(() => {
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
  }, []);

  const handleDrop = (newTreeData: NodeModel[]) => {
    console.log(newTreeData);
    setTreeData(newTreeData);
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
          render={(node, { depth, isOpen, onToggle }) => (
            <div style={{ marginLeft: depth * 10 }}>
              {node.droppable && <span onClick={onToggle}>{isOpen ? <FolderOpen /> : <Folder />}</span>}
              {node.text}
            </div>
          )}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
            if (dragSource?.parent === dropTargetId) {
              return true;
            }
          }}
          dropTargetOffset={10}
        />
      </DndProvider>
    </>
  );
}
