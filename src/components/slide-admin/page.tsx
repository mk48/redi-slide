import { useState } from "react";
import SlidesList from "./slides-list";
import type { NodeModel } from "@minoru/react-dnd-treeview";

export default function SlideAdminPage() {
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);

  return (
    <div className="flex">
      <SlidesList onSelect={setSelectedNode} />
      <div className="bg-amber-500"> {selectedNode?.text} </div>
    </div>
  );
}
