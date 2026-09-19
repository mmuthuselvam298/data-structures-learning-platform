import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Sparkles, Send, Network, ArrowRight } from 'lucide-react';

interface GraphNode {
  id: string;
  x: number;
  y: number;
}

interface GraphEdge {
  u: string;
  v: string;
  weight: number;
}

export const GraphVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bfs' | 'dfs' | 'dijkstra'>('bfs');

  // SRM AP Drone Graph Nodes & Edges (from End Sem Exam Q6)
  const nodes: GraphNode[] = [
    { id: 'A', x: 70, y: 150 },
    { id: 'B', x: 200, y: 70 },
    { id: 'C', x: 200, y: 230 },
    { id: 'D', x: 330, y: 70 },
    { id: 'E', x: 330, y: 230 },
    { id: 'F', x: 440, y: 150 }
  ];

  const edges: GraphEdge[] = [
    { u: 'A', v: 'B', weight: 4 },
    { u: 'A', v: 'C', weight: 2 },
    { u: 'B', v: 'C', weight: 1 },
    { u: 'B', v: 'D', weight: 5 },
    { u: 'C', v: 'D', weight: 8 },
    { u: 'C', v: 'E', weight: 10 },
    { u: 'D', v: 'E', weight: 2 },
    { u: 'D', v: 'F', weight: 6 },
    { u: 'E', v: 'F', weight: 3 }
  ];

  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [dataStructureState, setDataStructureState] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>('SRM AP Drone Network ready. Hub is at Node A.');
  const [dijkstraDistances, setDijkstraDistances] = useState<Record<string, number | string>>({});

  // Run BFS with Queue Tracking
  const runBFS = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setDijkstraDistances({});

    const queue: string[] = ['A'];
    const visited: string[] = [];
    const steps: { current: string; q: string[]; visited: string[]; msg: string }[] = [];

    const adjacency: Record<string, string[]> = {
      A: ['B', 'C'],
      B: ['C', 'D'],
      C: ['D', 'E'],
      D: ['E', 'F'],
      E: ['F'],
      F: []
    };

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (!visited.includes(curr)) {
        visited.push(curr);
        const neighbors = adjacency[curr] || [];
        for (const nbr of neighbors) {
          if (!visited.includes(nbr) && !queue.includes(nbr)) {
            queue.push(nbr);
          }
        }
        steps.push({
          current: curr,
          q: [...queue],
          visited: [...visited],
          msg: `Dequeued ${curr} from Queue. Visited. Queue: [${queue.join(', ')}]`
        });
      }
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        const s = steps[i];
        setActiveNode(s.current);
        setVisitedNodes(s.visited);
        setDataStructureState(s.q);
        setStatusMsg(s.msg);
        i++;
      } else {
        clearInterval(interval);
        setStatusMsg('BFS Traversal Complete! Examined layer-by-layer using FIFO Queue.');
      }
    }, 900);
  };

  // Run DFS with Call Stack Tracking
  const runDFS = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setDijkstraDistances({});

    const stack: string[] = ['A'];
    const visited: string[] = [];
    const steps: { current: string; stack: string[]; visited: string[]; msg: string }[] = [];

    const adjacency: Record<string, string[]> = {
      A: ['C', 'B'], // reverse for order
      B: ['D', 'C'],
      C: ['E', 'D'],
      D: ['F', 'E'],
      E: ['F'],
      F: []
    };

    while (stack.length > 0) {
      const curr = stack.pop()!;
      if (!visited.includes(curr)) {
        visited.push(curr);
        const neighbors = adjacency[curr] || [];
        for (const nbr of neighbors) {
          if (!visited.includes(nbr) && !stack.includes(nbr)) {
            stack.push(nbr);
          }
        }
        steps.push({
          current: curr,
          stack: [...stack],
          visited: [...visited],
          msg: `Popped ${curr} from Call Stack. Visited. Stack: [${stack.join(', ')}]`
        });
      }
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        const s = steps[i];
        setActiveNode(s.current);
        setVisitedNodes(s.visited);
        setDataStructureState(s.stack);
        setStatusMsg(s.msg);
        i++;
      } else {
        clearInterval(interval);
        setStatusMsg('DFS Traversal Complete! Deep exploration before backtracking using LIFO Stack.');
      }
    }, 900);
  };

  // Run Dijkstra Drone Delivery
  const runDijkstra = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setDataStructureState([]);

    // End Sem Exam Q6 exact shortest times from Node A:
    // A: 0, B: 4, C: 2, D: 9, E: 11, F: 14 mins
    const sequence = [
      { node: 'A', dist: { A: 0, B: 4, C: 2, D: '∞', E: '∞', F: '∞' }, msg: 'Step 1: Start at Dispatch Hub A (0 mins). Relax corridors A->B (4m) and A->C (2m).' },
      { node: 'C', dist: { A: 0, B: 4, C: 2, D: 10, E: 12, F: '∞' }, msg: 'Step 2: Pick minimum unvisited vertex C (2 mins). Relax C->D (2+8=10m) and C->E (2+10=12m).' },
      { node: 'B', dist: { A: 0, B: 4, C: 2, D: 9, E: 12, F: '∞' }, msg: 'Step 3: Pick B (4 mins). Relax B->D (4+5=9m). Distance to D improved from 10 to 9 mins!' },
      { node: 'D', dist: { A: 0, B: 4, C: 2, D: 9, E: 11, F: 15 }, msg: 'Step 4: Pick D (9 mins). Relax D->E (9+2=11m) and D->F (9+6=15m). Distance to E improved to 11m!' },
      { node: 'E', dist: { A: 0, B: 4, C: 2, D: 9, E: 11, F: 14 }, msg: 'Step 5: Pick E (11 mins). Relax E->F (11+3=14m). Distance to F improved from 15 to 14 mins!' },
      { node: 'F', dist: { A: 0, B: 4, C: 2, D: 9, E: 11, F: 14 }, msg: 'Step 6: Destination clinic F reached with confirmed optimal shortest flight time of 14 minutes!' }
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        const item = sequence[i];
        setActiveNode(item.node);
        setVisitedNodes(prev => [...prev, item.node]);
        setDijkstraDistances(item.dist);
        setStatusMsg(item.msg);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1200);
  };

  const handleReset = () => {
    setVisitedNodes([]);
    setActiveNode(null);
    setDataStructureState([]);
    setDijkstraDistances({});
    setStatusMsg('Graph reset to initial state.');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
              Unit IV • Graph Traversals & Shortest Path
            </span>
            <h3 className="text-xl font-bold text-slate-800">Graph Interactive Playground</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            BFS (Queue-driven) vs. DFS (Stack-driven) and Dijkstra Medical Drone Dispatch.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('bfs'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'bfs' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'}`}
          >
            BFS (Queue)
          </button>
          <button
            onClick={() => { setActiveTab('dfs'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'dfs' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'}`}
          >
            DFS (Stack)
          </button>
          <button
            onClick={() => { setActiveTab('dijkstra'); handleReset(); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'dijkstra' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600'}`}
          >
            Dijkstra Drone Delivery (Exam Q6)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Graph SVG Visual */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 bg-orange-50/20 rounded-2xl border border-orange-100 min-h-[400px] relative">
          <svg className="w-full h-[320px]" viewBox="0 0 500 300">
            {/* Edges */}
            {edges.map((e, idx) => {
              const uNode = nodes.find(n => n.id === e.u)!;
              const vNode = nodes.find(n => n.id === e.v)!;
              const isCorridorActive = visitedNodes.includes(e.u) && visitedNodes.includes(e.v);

              return (
                <g key={idx}>
                  <line
                    x1={uNode.x}
                    y1={uNode.y}
                    x2={vNode.x}
                    y2={vNode.y}
                    stroke={isCorridorActive ? '#F97316' : '#CBD5E1'}
                    strokeWidth={isCorridorActive ? 3 : 2}
                  />
                  {/* Weight label */}
                  <rect
                    x={(uNode.x + vNode.x) / 2 - 10}
                    y={(uNode.y + vNode.y) / 2 - 10}
                    width="20"
                    height="16"
                    fill="#FFF7ED"
                    stroke="#FDBA74"
                    rx="4"
                  />
                  <text
                    x={(uNode.x + vNode.x) / 2}
                    y={(uNode.y + vNode.y) / 2 + 2}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#C2410C"
                    className="font-mono"
                  >
                    {e.weight}m
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((n) => {
              const isActive = activeNode === n.id;
              const isVisited = visitedNodes.includes(n.id);
              const dist = dijkstraDistances[n.id];

              return (
                <g key={n.id}>
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={22}
                    initial={{ scale: 0.8 }}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      fill: isActive ? '#F97316' : isVisited ? '#10B981' : '#FFFFFF',
                      stroke: isActive ? '#C2410C' : isVisited ? '#047857' : '#94A3B8'
                    }}
                    strokeWidth="3"
                    className="shadow-sm transition-colors"
                  />
                  <text
                    x={n.x}
                    y={n.y + 5}
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="extrabold"
                    fill={isActive || isVisited ? '#FFFFFF' : '#1E293B'}
                    className="font-mono select-none"
                  >
                    {n.id}
                  </text>

                  {/* Dijkstra cost badge */}
                  {dist !== undefined && (
                    <text
                      x={n.x}
                      y={n.y - 26}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#C2410C"
                      className="font-mono bg-white"
                    >
                      Cost: {dist}m
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Data Structure Live Tracker (Queue or Stack) */}
          {activeTab !== 'dijkstra' && (
            <div className="w-full bg-white p-3 rounded-xl border border-slate-200 mt-2 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">
                {activeTab === 'bfs' ? 'Active BFS Queue (FIFO):' : 'Active DFS Stack (LIFO):'}
              </span>
              <div className="flex gap-1.5 font-mono">
                {dataStructureState.length > 0 ? (
                  dataStructureState.map((it, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold">
                      {it}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">Empty</span>
                )}
              </div>
            </div>
          )}

          {/* Status Message */}
          <div className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-xs">
            {statusMsg}
          </div>
        </div>

        {/* Controls & Explanation */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              Algorithm Runner
            </h4>

            <div className="space-y-2">
              {activeTab === 'bfs' && (
                <button
                  onClick={runBFS}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  Start BFS from Node A
                </button>
              )}

              {activeTab === 'dfs' && (
                <button
                  onClick={runDFS}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="w-4 h-4" />
                  Start DFS from Node A
                </button>
              )}

              {activeTab === 'dijkstra' && (
                <button
                  onClick={runDijkstra}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Dispatch Drones (Dijkstra)
                </button>
              )}

              <button
                onClick={handleReset}
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Traversal
              </button>
            </div>

            {/* Exam Context Box */}
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 text-orange-900 text-xs">
              <span className="font-bold">End Sem Exam Q6 Context:</span> Hub is at Node A. The drone finds shortest time to all clinics (B, C, D, E, F) using edge relaxation: <br/>
              <code className="text-[11px] font-mono text-orange-800">dist[u] + weight(u,v) &lt; dist[v]</code>
            </div>
          </div>

          {/* C Code Box */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl shadow-inner font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
              <span className="font-semibold text-[11px] text-orange-400">
                {activeTab === 'dijkstra' ? 'Dijkstra Relaxation C Code' : 'BFS Queue Enqueue C Code'}
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">O(V + E)</span>
            </div>
            <div className="pt-3 text-slate-300 space-y-1">
              {activeTab === 'dijkstra' ? (
                <>
                  <p><span className="text-orange-400">if</span> (dist[u] + cost[u][v] &lt; dist[v]) &#123;</p>
                  <p className="pl-4">dist[v] = dist[u] + cost[u][v];</p>
                  <p className="pl-4">parent[v] = u;</p>
                  <p>&#125;</p>
                </>
              ) : (
                <>
                  <p>visited[start] = 1;</p>
                  <p>queue[++rear] = start;</p>
                  <p><span className="text-orange-400">while</span> (front != rear) &#123;</p>
                  <p className="pl-4">int u = queue[++front];</p>
                  <p>&#125;</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
