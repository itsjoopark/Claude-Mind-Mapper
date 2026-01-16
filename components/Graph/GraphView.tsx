"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "@/context/ChatContext";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  type: "topic" | "chat";
  parentId?: string;
  chatId?: string;
}

interface Edge {
  from: string;
  to: string;
}

// Topic categories mapping chats to topics
const topicMappings: Record<string, { topic: string; chats: string[] }> = {
  "Design Engineering": {
    topic: "Design Engineering",
    chats: [
      "Claude mind map creation",
      "Accessibility features",
      "Devouring Details Summary",
    ],
  },
  "Three.js Projects": {
    topic: "Three.js Projects",
    chats: [
      "Yarn shader for three.js brush tool",
      "Animating text with point clouds",
    ],
  },
  "Creative Coding": {
    topic: "Creative Coding",
    chats: [
      "Cellular automata",
      "Conway's Game of Life",
      "Face tracking 3D collage sketch",
    ],
  },
  "LaTeX Formatting": {
    topic: "LaTeX Formatting",
    chats: [
      "Standardize bullet point font system",
      "LaTeX header alignment",
    ],
  },
  "Side Projects": {
    topic: "Side Projects",
    chats: [
      "Fibonacci sequence",
      "Productivity tools",
      "Personal memory archival tool",
    ],
  },
  "Product Market Fit": {
    topic: "Product Market Fit",
    chats: [
      "Pre-PMF versus Post-PMF product",
    ],
  },
};

export default function GraphView() {
  const { chats, selectChat, setViewMode, dyslexiaMode } = useChat();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 900 });
  const lastSizeRef = useRef({ width: 1200, height: 900 });
  
  // Canvas transform state (panning only)
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });
  
  // Node dragging state
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const nodePositionsRef = useRef(nodePositions);
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMoveRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const didDragRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  
  // Hover state
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    nodePositionsRef.current = nodePositions;
  }, [nodePositions]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Update dimensions on resize and recenter when sidebar toggles
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      setDimensions({ width, height });

      const last = lastSizeRef.current;
      if (last.width && last.width !== width) {
        setTransform({ x: 0, y: 0 });
      }
      lastSizeRef.current = { width, height };
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Build graph with positions matching the reference layout
  const buildGraph = useCallback((): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    // Fixed topic positions matching the screenshot layout
    const topicPositions: Record<string, { x: number; y: number }> = {
      "Design Engineering": { x: centerX - 280, y: centerY - 180 },
      "Three.js Projects": { x: centerX + 180, y: centerY - 260 },
      "Creative Coding": { x: centerX - 20, y: centerY },
      "LaTeX Formatting": { x: centerX + 320, y: centerY - 80 },
      "Side Projects": { x: centerX - 220, y: centerY + 200 },
      "Product Market Fit": { x: centerX + 180, y: centerY + 160 },
    };

    // Fixed child offsets matching the screenshot layout
    const childOffsets: Record<string, { x: number; y: number }[]> = {
      "Design Engineering": [
        { x: -120, y: -160 },  // Devouring Details Summary - top left
        { x: -200, y: 80 },   // Claude mind map creation - bottom left
        { x: 30, y: 70 },     // Accessibility features - below
      ],
      "Three.js Projects": [
        { x: -80, y: -130 },  // Yarn shader - top
        { x: 160, y: -50 },   // Animating text - right
      ],
      "Creative Coding": [
        { x: 110, y: -130 },  // Cellular automata - top right
        { x: 220, y: -20 },   // Conway's Game of Life - right
        { x: 40, y: 140 },    // Face tracking - below (spaced)
      ],
      "LaTeX Formatting": [
        { x: 100, y: -150 },  // Standardize bullet - top right
        { x: -50, y: 130 },   // LaTeX header - below
      ],
      "Side Projects": [
        { x: 120, y: -130 },  // Fibonacci - top (spaced)
        { x: -150, y: -40 },  // Productivity tools - left
        { x: 20, y: 140 },    // Personal memory - below
      ],
      "Product Market Fit": [
        { x: 140, y: 120 },   // Pre-PMF - bottom right
      ],
    };

    // Create nodes and edges
    Object.entries(topicMappings).forEach(([topicName, { chats: chatTitles }]) => {
      const topicPos = topicPositions[topicName];
      if (!topicPos) return;

      const topicId = `topic-${topicName}`;

      // Use stored position if available, otherwise use calculated position
      const storedTopicPos = nodePositions[topicId];
      const finalTopicPos = storedTopicPos || topicPos;

      // Add topic node
      nodes.push({
        id: topicId,
        label: topicName,
        x: finalTopicPos.x,
        y: finalTopicPos.y,
        type: "topic",
      });

      // Add chat nodes with fixed offsets
      const offsets = childOffsets[topicName] || [];
      chatTitles.forEach((chatTitle, index) => {
        const chatNodeId = `chat-${topicName}-${index}`;
        const offset = offsets[index] || { x: (index - 1) * 150, y: 100 };

        const defaultChildPos = {
          x: finalTopicPos.x + offset.x,
          y: finalTopicPos.y + offset.y,
        };
        
        // Use stored position if available
        const storedChildPos = nodePositions[chatNodeId];
        const finalChildPos = storedChildPos || defaultChildPos;

        nodes.push({
          id: chatNodeId,
          label: chatTitle,
          x: finalChildPos.x,
          y: finalChildPos.y,
          type: "chat",
          parentId: topicId,
          chatId: chats.find(c => c.title.includes(chatTitle.slice(0, 15)))?.id,
        });

        edges.push({ from: topicId, to: chatNodeId });
      });
    });

    return { nodes, edges };
  }, [dimensions, nodePositions, chats]);

  const { nodes, edges } = buildGraph();

  const activeNodeId = draggedNodeId || hoveredNode;

  const relatedNodeIds = useCallback(
    (nodeId: string | null) => {
      if (!nodeId) return new Set<string>();
      const nodeMap = new Map(nodes.map((node) => [node.id, node]));
      const activeNode = nodeMap.get(nodeId);
      if (!activeNode) return new Set<string>();

      const related = new Set<string>([nodeId]);

      if (activeNode.type === "topic") {
        nodes.forEach((node) => {
          if (node.parentId === activeNode.id) {
            related.add(node.id);
          }
        });
      } else if (activeNode.parentId) {
        related.add(activeNode.parentId);
        nodes.forEach((node) => {
          if (node.parentId === activeNode.parentId) {
            related.add(node.id);
          }
        });
      }

      return related;
    },
    [nodes]
  );

  const activeSet = relatedNodeIds(activeNodeId);
  const hoveredChatNode = hoveredNode ? nodes.find((node) => node.id === hoveredNode) : null;
  const hoveredChatParentId =
    hoveredChatNode && hoveredChatNode.type === "chat" ? hoveredChatNode.parentId : null;

  const manualChatMap: Record<string, string> = {
    "claude mind map creation": "Claude's mind mapping capabilit...",
    "accessibility features": "Claude's accessibility feature gaps",
    "devouring details summary": "Devouring Details Summary",
    "pre-pmf versus post-pmf product": "Pre-PMF and post-PMF product ...",
  };

  // Handle node click (navigate to matching chat)
  const handleNodeClick = (node: Node, _e: React.MouseEvent) => {
    if (draggedNodeId) return;
    if (didDragRef.current) return;
    if (node.type !== "chat") return;

    const normalizedLabel = node.label.toLowerCase();
    const mappedTitle = manualChatMap[normalizedLabel];
    const matchedChat =
      (mappedTitle
        ? chats.find((chat) => chat.title === mappedTitle)
        : undefined) ||
      chats.find((chat) => chat.title.toLowerCase().includes(normalizedLabel)) ||
      (node.chatId ? chats.find((chat) => chat.id === node.chatId) : undefined);

    if (matchedChat) {
      selectChat(matchedChat.id);
      setViewMode("chat");
    }
  };

  // Start dragging a node
  const handleNodeMouseDown = (node: Node, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    velocityRef.current = { x: 0, y: 0 };
    lastMoveRef.current = null;
    didDragRef.current = false;
    
    const svgRect = containerRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    
    // Calculate mouse position in SVG coordinates
    const mouseX = e.clientX - svgRect.left - transform.x;
    const mouseY = e.clientY - svgRect.top - transform.y;
    
    setDraggedNodeId(node.id);
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y,
    });
    dragStartRef.current = { x: mouseX, y: mouseY };
  };

  // Handle mouse move - for both canvas and node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      // Node dragging
      const svgRect = containerRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      
      const mouseX = e.clientX - svgRect.left - transform.x;
      const mouseY = e.clientY - svgRect.top - transform.y;
      
      const newX = mouseX - dragOffset.x;
      const newY = mouseY - dragOffset.y;

      if (dragStartRef.current) {
        const dx = mouseX - dragStartRef.current.x;
        const dy = mouseY - dragStartRef.current.y;
        if (Math.hypot(dx, dy) > 4) {
          didDragRef.current = true;
        }
      }

      const now = performance.now();
      if (lastMoveRef.current) {
        const dt = Math.max(now - lastMoveRef.current.time, 16);
        const dx = newX - lastMoveRef.current.x;
        const dy = newY - lastMoveRef.current.y;
        velocityRef.current = { x: dx / dt, y: dy / dt };
      }
      lastMoveRef.current = { x: newX, y: newY, time: now };
      
      setNodePositions(prev => ({
        ...prev,
        [draggedNodeId]: { x: newX, y: newY },
      }));
    } else if (isCanvasDragging) {
      // Canvas panning
      setTransform(prev => ({
        ...prev,
        x: e.clientX - canvasDragStart.x,
        y: e.clientY - canvasDragStart.y,
      }));
    }
  };

  const startInertia = (nodeId: string) => {
    const decay = 0.92;
    const minVelocity = 0.02;

    const step = () => {
      const { x: vx, y: vy } = velocityRef.current;
      if (Math.abs(vx) < minVelocity && Math.abs(vy) < minVelocity) {
        inertiaFrameRef.current = null;
        return;
      }

      setNodePositions((prev) => {
        const current = prev[nodeId] || nodePositionsRef.current[nodeId];
        if (!current) return prev;

        return {
          ...prev,
          [nodeId]: {
            x: current.x + vx * 16,
            y: current.y + vy * 16,
          },
        };
      });

      velocityRef.current = { x: vx * decay, y: vy * decay };
      inertiaFrameRef.current = requestAnimationFrame(step);
    };

    inertiaFrameRef.current = requestAnimationFrame(step);
  };

  // End dragging
  const handleMouseUp = () => {
    const releasedNodeId = draggedNodeId;
    setDraggedNodeId(null);
    setIsCanvasDragging(false);

    if (releasedNodeId) {
      startInertia(releasedNodeId);
    }
    lastMoveRef.current = null;
    dragStartRef.current = null;
  };

  // Start canvas dragging
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only start canvas drag if clicking on SVG background
    if (target.tagName === "svg" || target.classList.contains("graph-bg")) {
      setIsCanvasDragging(true);
      setCanvasDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  // Determine cursor style
  const getCursorStyle = () => {
    if (draggedNodeId) return "grabbing";
    if (isCanvasDragging) return "grabbing";
    return "default";
  };

  // Calculate shortened line endpoints (leave space around labels)
  const getLineEndpoints = (fromNode: Node, toNode: Node) => {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      return { x1: fromNode.x, y1: fromNode.y, x2: toNode.x, y2: toNode.y };
    }

    const nx = dx / distance;
    const ny = dy / distance;

    const fromGap = fromNode.type === "topic" ? 42 : 50;
    const toGap = toNode.type === "topic" ? 42 : 50;

    return {
      x1: fromNode.x + nx * fromGap,
      y1: fromNode.y + ny * fromGap,
      x2: toNode.x - nx * toGap,
      y2: toNode.y - ny * toGap,
    };
  };

  return (
    <div
      ref={containerRef}
      className="graph-bg w-full h-full bg-background overflow-hidden"
      style={{ cursor: getCursorStyle() }}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="select-none"
      >
        <g
          transform={`translate(${transform.x}, ${transform.y})`}
          style={{
            opacity: hasMounted ? 1 : 0,
            transition: "opacity 700ms ease-out",
          }}
        >
          {/* Edges - thin gray lines with gaps from nodes */}
          {edges.map((edge, i) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isHoveredEdge =
              hoveredChatParentId &&
              hoveredNode &&
              ((edge.from === hoveredChatParentId && edge.to === hoveredNode) ||
                (edge.to === hoveredChatParentId && edge.from === hoveredNode));
            const isSameTreeEdge =
              hoveredChatParentId && (edge.from === hoveredChatParentId || edge.to === hoveredChatParentId);

            const { x1, y1, x2, y2 } = getLineEndpoints(fromNode, toNode);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={
                  isHoveredEdge
                    ? "#E07B54"
                    : isSameTreeEdge
                      ? "#1A1A1A"
                      : activeNodeId
                        ? "#E6E4E0"
                        : "#D4D4D4"
                }
                strokeWidth={isHoveredEdge || isSameTreeEdge ? 1.5 : 1}
                style={{ transition: "stroke 0.15s ease, stroke-width 0.15s ease" }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isDragging = draggedNodeId === node.id;
            const isHovered = hoveredNode === node.id;
            const isActive = activeNodeId === node.id;
            const isRelated = activeSet.has(node.id);
            
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={(e) => handleNodeMouseDown(node, e)}
                onClick={(e) => handleNodeClick(node, e)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ 
                  cursor: isDragging ? "grabbing" : "grab",
                  opacity: isDragging ? 0.9 : 1,
                }}
              >
                {/* Invisible larger hit area for easier grabbing */}
                <rect
                  x={-80}
                  y={-15}
                  width={160}
                  height={30}
                  fill="transparent"
                />
                
                {node.type === "topic" ? (
                  // Topic header - Signifier font, bold, dark
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    style={{
                      fontFamily: dyslexiaMode
                        ? "var(--font-dyslexic), var(--font-signifier), Georgia, serif"
                        : "var(--font-signifier), Georgia, serif",
                      fontSize: "18px",
                      fontWeight: 600,
                      fill: isActive
                        ? "#E07B54"
                        : activeNodeId && !isRelated
                          ? "#BEBBB6"
                          : "#1A1A1A",
                      transition: "fill 0.15s ease",
                      userSelect: "none",
                    }}
                  >
                    {node.label}
                  </text>
                ) : (
                  // Chat child - Inter font, 14px, lighter gray
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    style={{
                      fontFamily: dyslexiaMode
                        ? "var(--font-dyslexic), var(--font-inter), system-ui, sans-serif"
                        : "var(--font-inter), system-ui, sans-serif",
                      fontSize: "14px",
                      fontWeight: 400,
                      fill: isActive
                        ? "#E07B54"
                        : activeNodeId && !isRelated
                          ? "#BEBBB6"
                          : isHovered
                            ? "#1A1A1A"
                            : "#5A5A5A",
                      transition: "fill 0.15s ease",
                      userSelect: "none",
                    }}
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-secondary bg-white/80 px-4 py-2 rounded-full shadow-sm">
        Drag to reposition
      </div>
    </div>
  );
}
