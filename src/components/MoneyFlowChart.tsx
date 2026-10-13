"use client";

import { ResponsiveContainer, Sankey, Tooltip, type SankeyNodeProps, type SankeyLinkProps } from "recharts";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatBani } from "@/lib/money";
import type { MoneyFlow } from "@/lib/flow";

// Draws money as streams of water: thicker stream = more lei.
export default function MoneyFlowChart({ flow }: { flow: MoneyFlow }) {
  const { t } = useLanguage();

  const label = (id: string, kind: string) =>
    kind === "wallet" ? t("flow.wallet") : kind === "leftover" ? t("flow.leftover") : kind === "earlier" ? t("flow.earlier") : t(`categories.${id}`);

  const data = {
    nodes: flow.nodes.map((node) => ({ ...node, name: label(node.id, node.kind) })),
    links: flow.links.map((link) => ({ source: link.source, target: link.target, value: link.valueBani / 100 })),
  };

  return (
    <div className="h-80 w-full" role="img" aria-label={t("flow.title")}>
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          nodeWidth={14}
          nodePadding={18}
          margin={{ top: 10, bottom: 10, left: 4, right: 4 }}
          node={FlowNodeShape}
          link={FlowLinkShape}
        >
          <Tooltip formatter={(value) => `${formatBani(Number(value) * 100)} ${t("common.lei")}`} />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}

type NodeData = { name: string; color: string; kind: string; value: number; depth: number };

function FlowNodeShape(props: SankeyNodeProps) {
  const { x, y, width, height } = props;
  const node = props.payload as unknown as NodeData;
  // Labels sit outside the diagram: left column -> text on the right, right column -> text on the left.
  const isRight = node.kind === "expense" || node.kind === "leftover";
  const textX = isRight ? x - 6 : x + width + 6;
  return (
    <g>
      <rect x={x} y={y} width={width} height={Math.max(height, 2)} rx={4} fill={node.color} />
      <text x={textX} y={y + height / 2} dy={-2} textAnchor={isRight ? "end" : "start"} fontSize={12} fontWeight={700} fill="#0f2233">
        {node.name}
      </text>
      <text x={textX} y={y + height / 2} dy={12} textAnchor={isRight ? "end" : "start"} fontSize={11} fill="#4a5d6b">
        {formatBani(node.value * 100)}
      </text>
    </g>
  );
}

function FlowLinkShape(props: SankeyLinkProps) {
  const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, payload } = props;
  // Outgoing streams take the colour of where the money goes, incoming ones the colour of where it came from.
  const target = payload.target as unknown as NodeData;
  const source = payload.source as unknown as NodeData;
  const color = target.kind === "wallet" ? source.color : target.color;
  return (
    <path
      d={`M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`}
      fill="none"
      stroke={color}
      strokeOpacity={0.35}
      strokeWidth={Math.max(linkWidth, 1)}
    />
  );
}
