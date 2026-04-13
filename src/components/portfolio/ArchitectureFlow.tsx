import Image from "next/image";
import { ArrowRight } from "lucide-react";

export interface FlowNode {
  icon: string;
  label: string;
}

export interface FlowEdge {
  label: string;
  sub?: string;
}

interface ArchitectureFlowProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export default function ArchitectureFlow({
  nodes,
  edges,
}: ArchitectureFlowProps) {
  return (
    <div className="overflow-x-auto -mx-2 px-2 pb-2">
      <div className="flex items-center gap-1 min-w-max py-2">
        {nodes.map((node, i) => (
          <div key={i} className="contents">
            {/* Node */}
            <div className="flex flex-col items-center gap-1.5 min-w-[72px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-background shadow-sm">
                <Image
                  src={node.icon}
                  alt={node.label}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <span className="text-[11px] font-medium text-foreground whitespace-nowrap">
                {node.label}
              </span>
            </div>

            {/* Edge (arrow + label) */}
            {i < edges.length && (
              <div className="flex flex-col items-center gap-0.5 mx-1 min-w-[80px]">
                <span className="text-[10px] font-medium text-primary whitespace-nowrap">
                  {edges[i].label}
                </span>
                <div className="flex items-center w-full">
                  <div className="flex-1 h-px bg-border" />
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                </div>
                {edges[i].sub && (
                  <span className="text-[9px] text-muted-foreground whitespace-nowrap">
                    {edges[i].sub}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
