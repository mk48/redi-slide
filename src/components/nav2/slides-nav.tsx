import { getBackendOptions, MultiBackend, Tree, type NodeModel } from "@minoru/react-dnd-treeview";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import slides from "@/components/slide-admin/slides.json";
import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  activeUrl: string;
};

const nextNode = (activeUrl: string, nodes: NodeModel[]): NodeModel | null => {
  const currentIndex = nodes.findIndex((n) => n.text === activeUrl);

  //if the current index is last then don't move
  if (currentIndex < nodes.length - 1) {
    const node = nodes[currentIndex + 1];

    //if this is parent, then go for child
    if (node.droppable) {
      const nextChild = nextNode(node.text, nodes);
      return nextChild;
    } else {
      return node;
    }
  }

  return null;
};

const prevNode = (activeUrl: string, nodes: NodeModel[]): NodeModel | null => {
  const currentIndex = nodes.findIndex((n) => n.text === activeUrl);

  //if the current index is last then don't move
  if (currentIndex > 0) {
    const node = nodes[currentIndex - 1];

    //if this is parent, then go for prev node
    if (node.droppable) {
      const child = prevNode(node.text, nodes);
      return child;
    } else {
      return node;
    }
  }

  return null;
};

const SlidesNav: React.FC<Props> = (props) => {
  const [treeData, setTreeData] = useState<NodeModel[]>(slides);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        const node = nextNode(props.activeUrl, treeData);
        if (node) {
          window.location.href = node.text;
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        const node = prevNode(props.activeUrl, treeData);
        if (node) {
          window.location.href = node.text;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDrop = async (newTreeData: NodeModel[]) => {
    //setTreeData(newTreeData);
  };

  const handleSelect = async (node: NodeModel) => {
    window.location.href = node.text;
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
        classes={
          {
            //root: styles.treeRoot,
            //draggingSource: styles.draggingSource,
            //placeholder: styles.placeholderContainer,
          }
        }
        render={(node, { depth, isOpen, onToggle }) => (
          <div
            onClick={() => handleSelect(node)}
            style={{ paddingLeft: depth * 24 }}
            className={cn(
              "cursor-pointer hover:bg-amber-200 h-8 flex items-center",
              node.text === props.activeUrl && "border-2 border-solid border-amber-600"
            )}
          >
            {node.text.substring(node.text.lastIndexOf("/") + 1)}
          </div>
        )}
        canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        dropTargetOffset={10}
        //placeholderRender={(node, { depth }) => <Placeholder node={node} depth={depth} />}
      />
    </DndProvider>
  );
};

export default SlidesNav;
