import { useState } from "react";
import SlidesList from "./slides-list";
import type { NodeModel } from "@minoru/react-dnd-treeview";
import LoadSlideText from "./load-slide-text";

export default function SlideAdminPage() {
  const [selectedNode, setSelectedNode] = useState<NodeModel | null>(null);

  return (
    <div className="flex">
      <div className="w-fit">
        <SlidesList onSelect={setSelectedNode} />
      </div>
      <div className="flex-1">
        {selectedNode?.droppable ? undefined : <LoadSlideText url={selectedNode?.text ?? ""} />}
      </div>
    </div>
  );
}
