import React from "react";
// import styles from "./CustomNode.module.css";
import { ChevronRight } from "lucide-react";
import type { NodeModel } from "@minoru/react-dnd-treeview";
import { Folder, FolderOpen } from "lucide-react";
import styles from "./style.module.css";

type Props = {
  node: NodeModel<any>;
  depth: number;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
  const { droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  return (
    <div className={`tree-node ${styles.root}`}>
      <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}>
        {props.node.droppable && (
          <div onClick={handleToggle}>
            <ChevronRight />
          </div>
        )}
      </div>
      <div>{props.node.text}</div>
    </div>
  );
};
