// =============================================================================
// DEADLOCK VISUALIZER & RESOURCE ALLOCATION GRAPH (RAG) SIMULATOR
// Features: Interactive Canvas, Add Processes & Resources (Multi-instance dots),
// Request/Assignment/Claim Edges, Cycle Detection (DFS), Deadlock Analysis,
// Wait-For Graph generation, and SRM Slide Presets!
// =============================================================================

window.DeadlockRAGSimulator = {
  presets: {
    "deadlock-2proc": {
      name: "Simple 2-Process Deadlock (SRM Slide 47)",
      description: "P1 holds R1 requesting R2; P2 holds R2 requesting R1. Cycle on single instances = DEADLOCK.",
      nodes: [
        { id: "P1", type: "process", x: 150, y: 120 },
        { id: "P2", type: "process", x: 450, y: 120 },
        { id: "R1", type: "resource", instances: 1, x: 300, y: 60 },
        { id: "R2", type: "resource", instances: 1, x: 300, y: 220 }
      ],
      edges: [
        { from: "R1", to: "P1", type: "assignment" },
        { from: "P1", to: "R2", type: "request" },
        { from: "R2", to: "P2", type: "assignment" },
        { from: "P2", to: "R1", type: "request" }
      ]
    },
    "srm-slide-51": {
      name: "Deadlocked RAG (SRM Slide 51)",
      description: "P={P1,P2,P3}, R={R1(1), R2(2), R3(1), R4(3)}. Cycles exist: P1-R1-P2-R3-P3-R2-P1 and P2-R3-P3-R2-P2 -> DEADLOCKED!",
      nodes: [
        { id: "P1", type: "process", x: 120, y: 150 },
        { id: "P2", type: "process", x: 300, y: 150 },
        { id: "P3", type: "process", x: 480, y: 150 },
        { id: "R1", type: "resource", instances: 1, x: 210, y: 60 },
        { id: "R2", type: "resource", instances: 2, x: 210, y: 260 },
        { id: "R3", type: "resource", instances: 1, x: 390, y: 60 },
        { id: "R4", type: "resource", instances: 3, x: 390, y: 260 }
      ],
      edges: [
        { from: "P1", to: "R1", type: "request" },
        { from: "R1", to: "P2", type: "assignment" },
        { from: "P2", to: "R3", type: "request" },
        { from: "R3", to: "P3", type: "assignment" },
        { from: "R2", to: "P1", type: "assignment" },
        { from: "R2", to: "P2", type: "assignment" },
        { from: "P3", to: "R2", type: "request" }
      ]
    },
    "srm-slide-52-no-deadlock": {
      name: "Cycle but NO Deadlock (SRM Slide 52)",
      description: "P1-R1-P3-R2-P1 forms a cycle. However, R1 has 2 instances (P2 can finish) and R2 has 2 instances (P4 can finish). NO DEADLOCK!",
      nodes: [
        { id: "P1", type: "process", x: 120, y: 160 },
        { id: "P2", type: "process", x: 480, y: 60 },
        { id: "P3", type: "process", x: 480, y: 160 },
        { id: "P4", type: "process", x: 480, y: 260 },
        { id: "R1", type: "resource", instances: 2, x: 300, y: 80 },
        { id: "R2", type: "resource", instances: 2, x: 300, y: 240 }
      ],
      edges: [
        { from: "P1", to: "R1", type: "request" },
        { from: "R1", to: "P2", type: "assignment" },
        { from: "R1", to: "P3", type: "assignment" },
        { from: "P3", to: "R2", type: "request" },
        { from: "R2", to: "P1", type: "assignment" },
        { from: "R2", to: "P4", type: "assignment" }
      ]
    },
    "claim-edges-unsafe": {
      name: "RAG with Claim Edges (SRM Slide 63)",
      description: "Dashed claim edges represent future possible requests. Converting claim edge to request edge creates a cycle -> UNSAFE STATE!",
      nodes: [
        { id: "P1", type: "process", x: 150, y: 160 },
        { id: "P2", type: "process", x: 450, y: 160 },
        { id: "R1", type: "resource", instances: 1, x: 300, y: 60 },
        { id: "R2", type: "resource", instances: 1, x: 300, y: 260 }
      ],
      edges: [
        { from: "P1", to: "R1", type: "request" },
        { from: "R1", to: "P2", type: "assignment" },
        { from: "P1", to: "R2", type: "claim" },
        { from: "P2", to: "R2", type: "claim" }
      ]
    }
  },

  // Algorithm: Graph Cycle Detection and Reduction
  analyze(nodes, edges) {
    const processes = nodes.filter(n => n.type === "process");
    const resources = nodes.filter(n => n.type === "resource");

    // Build adjacency list for cycle detection
    const adj = {};
    nodes.forEach(n => adj[n.id] = []);
    edges.forEach(e => {
      adj[e.from].push(e.to);
    });

    // Detect cycles using DFS
    const visited = {};
    const recStack = {};
    const cycleNodes = new Set();
    let hasCycle = false;

    const dfs = (curr, path = []) => {
      visited[curr] = true;
      recStack[curr] = true;
      path.push(curr);

      for (const neighbor of adj[curr] || []) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, [...path])) return true;
        } else if (recStack[neighbor]) {
          // Cycle found!
          hasCycle = true;
          const cycleStart = path.indexOf(neighbor);
          const fullCycle = path.slice(cycleStart);
          fullCycle.forEach(id => cycleNodes.add(id));
          return true;
        }
      }

      recStack[curr] = false;
      return false;
    };

    nodes.forEach(n => {
      if (!visited[n.id]) dfs(n.id);
    });

    // Wait-For Graph Construction (collapse resources)
    const waitForEdges = [];
    processes.forEach(p1 => {
      // Find all resources p1 is requesting
      const requestedRes = edges.filter(e => e.from === p1.id && e.type === "request").map(e => e.to);
      requestedRes.forEach(rId => {
        // Find who currently holds rId
        const holders = edges.filter(e => e.from === rId && e.type === "assignment").map(e => e.to);
        holders.forEach(p2 => {
          if (p1.id !== p2 && !waitForEdges.some(we => we.from === p1.id && we.to === p2)) {
            waitForEdges.push({ from: p1.id, to: p2 });
          }
        });
      });
    });

    // Deadlock Reduction Algorithm (multi-instance check)
    // 1. Calculate available instances for each resource
    const avail = {};
    resources.forEach(r => {
      const assignedCount = edges.filter(e => e.from === r.id && e.type === "assignment").length;
      avail[r.id] = (r.instances || 1) - assignedCount;
    });

    const finished = new Set();
    let progress = true;

    while (progress) {
      progress = false;
      for (const p of processes) {
        if (finished.has(p.id)) continue;
        // Check if all requests of p can be satisfied by avail
        const reqs = edges.filter(e => e.from === p.id && e.type === "request");
        const canFinish = reqs.every(req => (avail[req.to] || 0) > 0);

        if (canFinish) {
          finished.add(p.id);
          // Reclaim resources held by p
          const held = edges.filter(e => e.to === p.id && e.type === "assignment");
          held.forEach(h => {
            avail[h.from] = (avail[h.from] || 0) + 1;
          });
          progress = true;
        }
      }
    }

    const deadlockedProcesses = processes.filter(p => !finished.has(p.id)).map(p => p.id);
    const isDeadlocked = deadlockedProcesses.length > 0;

    let explanation = "";
    if (isDeadlocked) {
      explanation = `🚨 DEADLOCK DETECTED! Processes [${deadlockedProcesses.join(", ")}] cannot complete.
      A circular dependency exists where each process is holding resources while waiting for another to release.
      Because available resource instances are insufficient to satisfy outstanding requests, the system is permanently frozen.`;
    } else if (hasCycle) {
      explanation = `⚠️ A cycle exists in the graph, BUT THERE IS NO DEADLOCK!
      Why? The involved resource types have MULTIPLE instances. External processes not locked in the cycle can complete and release their held resources, providing enough instances to break the circular dependency.`;
    } else {
      explanation = `✅ SYSTEM IS DEADLOCK-FREE!
      No directed cycles exist in the Resource Allocation Graph. Every process can obtain its requested resources and terminate in valid sequence.`;
    }

    return {
      hasCycle,
      cycleNodes: Array.from(cycleNodes),
      isDeadlocked,
      deadlockedProcesses,
      explanation,
      waitForEdges
    };
  }
};
