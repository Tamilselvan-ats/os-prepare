// =============================================================================
// PROCESS SCHEDULING SIMULATOR ENGINE
// Supports: FCFS, SJF (Non-preemptive), SRTF (Preemptive SJF),
// Priority (Non-preemptive & Preemptive), Round Robin, Multilevel Queue, MLFQ
// Features: Ready Queue animation, Gantt Chart, Line-by-Line calculations, SRM Presets
// =============================================================================

window.CPUSchedulerSimulator = {
  // SRM Course Presets
  presets: {
    "fcfs-convoy": {
      name: "FCFS Convoy Effect (SRM Slide 10)",
      algo: "FCFS",
      quantum: 4,
      processes: [
        { pid: "P1", at: 0, bt: 24, priority: 1 },
        { pid: "P2", at: 0, bt: 3, priority: 2 },
        { pid: "P3", at: 0, bt: 3, priority: 3 }
      ]
    },
    "fcfs-reordered": {
      name: "FCFS Optimal Order (SRM Slide 12: P2, P3, P1)",
      algo: "FCFS",
      quantum: 4,
      processes: [
        { pid: "P2", at: 0, bt: 3, priority: 1 },
        { pid: "P3", at: 0, bt: 3, priority: 2 },
        { pid: "P1", at: 0, bt: 24, priority: 3 }
      ]
    },
    "sjf-varied": {
      name: "SJF Non-Preemptive Varied (SRM Slide 16)",
      algo: "SJF",
      quantum: 4,
      processes: [
        { pid: "P1", at: 0, bt: 7, priority: 1 },
        { pid: "P2", at: 2, bt: 4, priority: 1 },
        { pid: "P3", at: 4, bt: 1, priority: 1 },
        { pid: "P4", at: 5, bt: 4, priority: 1 }
      ]
    },
    "srtf-preemptive": {
      name: "SRTF Preemptive SJF (SRM Slide 17)",
      algo: "SRTF",
      quantum: 4,
      processes: [
        { pid: "P1", at: 0, bt: 7, priority: 1 },
        { pid: "P2", at: 2, bt: 4, priority: 1 },
        { pid: "P3", at: 4, bt: 1, priority: 1 },
        { pid: "P4", at: 5, bt: 4, priority: 1 }
      ]
    },
    "priority-nonpreempt": {
      name: "Priority Non-Preemptive (SRM Slide 20)",
      algo: "Priority-NP",
      quantum: 4,
      processes: [
        { pid: "A", at: 0, bt: 8, priority: 2 },
        { pid: "B", at: 0, bt: 1, priority: 1 },
        { pid: "C", at: 0, bt: 1, priority: 3 }
      ]
    },
    "priority-preempt-7": {
      name: "Priority Preemptive 7 Processes (SRM Slide 21)",
      algo: "Priority-P",
      quantum: 4,
      processes: [
        { pid: "P1", at: 0, bt: 4, priority: 2 },
        { pid: "P2", at: 1, bt: 2, priority: 4 },
        { pid: "P3", at: 2, bt: 3, priority: 6 },
        { pid: "P4", at: 3, bt: 5, priority: 10 },
        { pid: "P5", at: 4, bt: 1, priority: 8 },
        { pid: "P6", at: 5, bt: 4, priority: 12 },
        { pid: "P7", at: 6, bt: 6, priority: 9 }
      ]
    },
    "rr-q4": {
      name: "Round Robin q=4 (SRM Slide 25)",
      algo: "RR",
      quantum: 4,
      processes: [
        { pid: "P1", at: 0, bt: 24, priority: 1 },
        { pid: "P2", at: 0, bt: 3, priority: 1 },
        { pid: "P3", at: 0, bt: 3, priority: 1 }
      ]
    },
    "rr-q20": {
      name: "Round Robin q=20 (SRM Slide 26)",
      algo: "RR",
      quantum: 20,
      processes: [
        { pid: "P1", at: 0, bt: 53, priority: 1 },
        { pid: "P2", at: 0, bt: 17, priority: 1 },
        { pid: "P3", at: 0, bt: 68, priority: 1 },
        { pid: "P4", at: 0, bt: 24, priority: 1 }
      ]
    },
    "mlfq-demo": {
      name: "Multilevel Feedback Queue (Q0:8, Q1:16, Q2:FCFS)",
      algo: "MLFQ",
      quantum: 8,
      processes: [
        { pid: "Interactive", at: 0, bt: 6, priority: 1 },
        { pid: "Medium_Job", at: 2, bt: 18, priority: 1 },
        { pid: "Long_Batch", at: 4, bt: 32, priority: 1 }
      ]
    }
  },

  // Color mapping for processes
  colors: [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#14b8a6", "#6366f1"
  ],

  getColor(pid, index) {
    return this.colors[index % this.colors.length];
  },

  // Simulator Computation Function
  simulate(algorithm, rawProcesses, quantum = 4, priorityType = "lower-is-higher") {
    // Clone processes
    const procs = rawProcesses.map((p, idx) => ({
      pid: p.pid,
      at: parseInt(p.at, 10) || 0,
      bt: parseInt(p.bt, 10) || 1,
      remBt: parseInt(p.bt, 10) || 1,
      priority: parseInt(p.priority, 10) || 1,
      color: this.getColor(p.pid, idx),
      ct: 0,
      tat: 0,
      wt: 0,
      rt: -1,
      firstRunTime: -1,
      queueLevel: 0
    }));

    let currentTime = 0;
    const gantt = [];
    const executionSteps = [];
    let completed = 0;
    const n = procs.length;

    // Helpers
    const isPriorityHigher = (p1, p2) => {
      // In SRM Slide 21 preemptive 7-proc example, 12 is high and 2 is low
      if (priorityType === "higher-is-higher") {
        return p1.priority > p2.priority;
      }
      return p1.priority < p2.priority; // default standard: 1 is highest
    };

    if (algorithm === "FCFS") {
      // Sort by arrival time
      const sorted = [...procs].sort((a, b) => a.at - b.at);
      sorted.forEach(p => {
        if (currentTime < p.at) {
          gantt.push({ pid: "IDLE", start: currentTime, end: p.at, color: "#64748b" });
          currentTime = p.at;
        }
        if (p.rt === -1) p.rt = currentTime - p.at;
        const start = currentTime;
        currentTime += p.bt;
        p.ct = currentTime;
        p.tat = p.ct - p.at;
        p.wt = p.tat - p.bt;
        gantt.push({ pid: p.pid, start, end: currentTime, color: p.color });
      });
    }

    else if (algorithm === "SJF") {
      // Non-preemptive Shortest Job First
      const completedSet = new Set();
      while (completedSet.size < n) {
        const available = procs.filter(p => p.at <= currentTime && !completedSet.has(p.pid));
        if (available.length === 0) {
          // Jump to next arriving process
          const nextArrival = Math.min(...procs.filter(p => !completedSet.has(p.pid)).map(p => p.at));
          gantt.push({ pid: "IDLE", start: currentTime, end: nextArrival, color: "#64748b" });
          currentTime = nextArrival;
          continue;
        }
        // Choose shortest burst time, break ties by arrival time
        available.sort((a, b) => a.bt === b.bt ? a.at - b.at : a.bt - b.bt);
        const next = available[0];
        if (next.rt === -1) next.rt = currentTime - next.at;
        const start = currentTime;
        currentTime += next.bt;
        next.ct = currentTime;
        next.tat = next.ct - next.at;
        next.wt = next.tat - next.bt;
        completedSet.add(next.pid);
        gantt.push({ pid: next.pid, start, end: currentTime, color: next.color });
      }
    }

    else if (algorithm === "SRTF") {
      // Preemptive SJF
      let lastPid = null;
      let segStart = 0;

      while (completed < n) {
        const available = procs.filter(p => p.at <= currentTime && p.remBt > 0);
        if (available.length === 0) {
          if (lastPid !== null) {
            gantt.push({ pid: lastPid, start: segStart, end: currentTime, color: procs.find(x => x.pid === lastPid).color });
            lastPid = null;
          }
          const nextArr = Math.min(...procs.filter(p => p.remBt > 0).map(p => p.at));
          gantt.push({ pid: "IDLE", start: currentTime, end: nextArr, color: "#64748b" });
          currentTime = nextArr;
          continue;
        }

        available.sort((a, b) => a.remBt === b.remBt ? a.at - b.at : a.remBt - b.bt);
        const curr = available[0];

        if (curr.rt === -1) curr.rt = currentTime - curr.at;

        if (lastPid !== curr.pid) {
          if (lastPid !== null) {
            gantt.push({ pid: lastPid, start: segStart, end: currentTime, color: procs.find(x => x.pid === lastPid).color });
          }
          lastPid = curr.pid;
          segStart = currentTime;
        }

        curr.remBt--;
        currentTime++;

        if (curr.remBt === 0) {
          curr.ct = currentTime;
          curr.tat = curr.ct - curr.at;
          curr.wt = curr.tat - curr.bt;
          completed++;
          gantt.push({ pid: curr.pid, start: segStart, end: currentTime, color: curr.color });
          lastPid = null;
        }
      }
    }

    else if (algorithm === "Priority-NP") {
      // Non-preemptive Priority
      const completedSet = new Set();
      while (completedSet.size < n) {
        const available = procs.filter(p => p.at <= currentTime && !completedSet.has(p.pid));
        if (available.length === 0) {
          const nextArrival = Math.min(...procs.filter(p => !completedSet.has(p.pid)).map(p => p.at));
          gantt.push({ pid: "IDLE", start: currentTime, end: nextArrival, color: "#64748b" });
          currentTime = nextArrival;
          continue;
        }
        available.sort((a, b) => isPriorityHigher(a, b) ? -1 : 1);
        const next = available[0];
        if (next.rt === -1) next.rt = currentTime - next.at;
        const start = currentTime;
        currentTime += next.bt;
        next.ct = currentTime;
        next.tat = next.ct - next.at;
        next.wt = next.tat - next.bt;
        completedSet.add(next.pid);
        gantt.push({ pid: next.pid, start, end: currentTime, color: next.color });
      }
    }

    else if (algorithm === "Priority-P") {
      // Preemptive Priority (SRM Slide 21 uses higher-is-higher integer convention)
      let lastPid = null;
      let segStart = 0;

      while (completed < n) {
        const available = procs.filter(p => p.at <= currentTime && p.remBt > 0);
        if (available.length === 0) {
          if (lastPid !== null) {
            gantt.push({ pid: lastPid, start: segStart, end: currentTime, color: procs.find(x => x.pid === lastPid).color });
            lastPid = null;
          }
          const nextArr = Math.min(...procs.filter(p => p.remBt > 0).map(p => p.at));
          gantt.push({ pid: "IDLE", start: currentTime, end: nextArr, color: "#64748b" });
          currentTime = nextArr;
          continue;
        }

        available.sort((a, b) => isPriorityHigher(a, b) ? -1 : 1);
        const curr = available[0];

        if (curr.rt === -1) curr.rt = currentTime - curr.at;

        if (lastPid !== curr.pid) {
          if (lastPid !== null) {
            gantt.push({ pid: lastPid, start: segStart, end: currentTime, color: procs.find(x => x.pid === lastPid).color });
          }
          lastPid = curr.pid;
          segStart = currentTime;
        }

        curr.remBt--;
        currentTime++;

        if (curr.remBt === 0) {
          curr.ct = currentTime;
          curr.tat = curr.ct - curr.at;
          curr.wt = curr.tat - curr.bt;
          completed++;
          gantt.push({ pid: curr.pid, start: segStart, end: currentTime, color: curr.color });
          lastPid = null;
        }
      }
    }

    else if (algorithm === "RR") {
      // Round Robin
      const readyQueue = [];
      const inQueue = new Set();
      const arrived = [...procs].sort((a, b) => a.at - b.at);

      // Check initial arrivals
      arrived.forEach(p => {
        if (p.at <= currentTime && !inQueue.has(p.pid)) {
          readyQueue.push(p);
          inQueue.add(p.pid);
        }
      });

      while (completed < n) {
        if (readyQueue.length === 0) {
          // CPU Idle until next arrival
          const remaining = arrived.filter(p => p.remBt > 0 && !inQueue.has(p.pid));
          if (remaining.length > 0) {
            const nextArr = remaining[0].at;
            gantt.push({ pid: "IDLE", start: currentTime, end: nextArr, color: "#64748b" });
            currentTime = nextArr;
            arrived.forEach(p => {
              if (p.at <= currentTime && p.remBt > 0 && !inQueue.has(p.pid)) {
                readyQueue.push(p);
                inQueue.add(p.pid);
              }
            });
          }
          continue;
        }

        const curr = readyQueue.shift();
        inQueue.delete(curr.pid);

        if (curr.rt === -1) curr.rt = currentTime - curr.at;

        const slice = Math.min(quantum, curr.remBt);
        const start = currentTime;
        currentTime += slice;
        curr.remBt -= slice;

        gantt.push({ pid: curr.pid, start, end: currentTime, color: curr.color });

        // Add newly arriving processes during this quantum
        arrived.forEach(p => {
          if (p.at <= currentTime && p.remBt > 0 && p.pid !== curr.pid && !inQueue.has(p.pid) && !readyQueue.includes(p)) {
            readyQueue.push(p);
            inQueue.add(p.pid);
          }
        });

        // Re-add current if not finished
        if (curr.remBt > 0) {
          readyQueue.push(curr);
          inQueue.add(curr.pid);
        } else {
          curr.ct = currentTime;
          curr.tat = curr.ct - curr.at;
          curr.wt = curr.tat - curr.bt;
          completed++;
        }
      }
    }

    else if (algorithm === "MLFQ") {
      // Multilevel Feedback Queue: Q0 (RR q=8), Q1 (RR q=16), Q2 (FCFS)
      const q0 = [], q1 = [], q2 = [];
      const arrived = [...procs].sort((a, b) => a.at - b.at);
      const enqueued = new Set();

      const checkArrivals = (time) => {
        arrived.forEach(p => {
          if (p.at <= time && !enqueued.has(p.pid) && p.remBt > 0) {
            p.queueLevel = 0;
            q0.push(p);
            enqueued.add(p.pid);
          }
        });
      };

      checkArrivals(currentTime);

      while (completed < n) {
        if (q0.length === 0 && q1.length === 0 && q2.length === 0) {
          const next = arrived.find(p => p.remBt > 0 && !enqueued.has(p.pid));
          if (next) {
            gantt.push({ pid: "IDLE", start: currentTime, end: next.at, color: "#64748b" });
            currentTime = next.at;
            checkArrivals(currentTime);
          }
          continue;
        }

        let curr, qLevel, slice;
        if (q0.length > 0) {
          curr = q0.shift();
          qLevel = 0;
          slice = Math.min(8, curr.remBt);
        } else if (q1.length > 0) {
          curr = q1.shift();
          qLevel = 1;
          slice = Math.min(16, curr.remBt);
        } else {
          curr = q2.shift();
          qLevel = 2;
          slice = curr.remBt; // FCFS
        }

        if (curr.rt === -1) curr.rt = currentTime - curr.at;
        const start = currentTime;
        currentTime += slice;
        curr.remBt -= slice;

        gantt.push({ pid: `${curr.pid} (Q${qLevel})`, start, end: currentTime, color: curr.color });

        checkArrivals(currentTime);

        if (curr.remBt > 0) {
          if (qLevel === 0) {
            curr.queueLevel = 1;
            q1.push(curr);
          } else if (qLevel === 1) {
            curr.queueLevel = 2;
            q2.push(curr);
          } else {
            q2.push(curr);
          }
        } else {
          curr.ct = currentTime;
          curr.tat = curr.ct - curr.at;
          curr.wt = curr.tat - curr.bt;
          completed++;
        }
      }
    }

    // Averages
    const totalWT = procs.reduce((acc, p) => acc + p.wt, 0);
    const totalTAT = procs.reduce((acc, p) => acc + p.tat, 0);
    const avgWT = (totalWT / n).toFixed(2);
    const avgTAT = (totalTAT / n).toFixed(2);

    return {
      algorithm,
      processes: procs,
      gantt,
      avgWT,
      avgTAT,
      totalWT,
      totalTAT
    };
  }
};
