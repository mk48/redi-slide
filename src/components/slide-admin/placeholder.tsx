import React from "react";
import type { NodeModel } from "@minoru/react-dnd-treeview";
import styles from "./style.module.css";

type Props = {
  node: NodeModel;
  depth: number;
};

export const Placeholder: React.FC<Props> = (props) => {
  const left = props.depth * 24;
  return <div className={styles.placeHolderRoot} style={{ left }}></div>;
};
