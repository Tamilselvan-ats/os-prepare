// =============================================================================
// BANKER'S ALGORITHM SIMULATOR ENGINE
// Safety Algorithm, Resource-Request Algorithm, Dynamic Matrix Manipulation,
// Step-by-Step Evolution Trace, and SRM Slide 68-70 Snapshot Preset
// =============================================================================

window.BankersAlgorithmSimulator = {
  // SRM Slide 68-70 Default Snapshot
  defaultSnapshot: {
    processes: ["P0", "P1", "P2", "P3", "P4"],
    resources: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    allocation: [
      [0, 1, 0], // P0
      [2, 0, 0], // P1
      [3, 0, 2], // P2
      [2, 1, 1], // P3
      [0, 0, 2]  // P4
    ],
    max: [
      [7, 5, 3], // P0
      [3, 2, 2], // P1
      [9, 0, 2], // P2
      [2, 2, 2], // P3
      [4, 3, 3]  // P4
    ],
    available: [3, 3, 2]
  },

  // Calculate Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
  calculateNeed(max, allocation) {
    const n = max.length;
    const m = max[0].length;
    const need = [];
    for (let i = 0; i < n; i++) {
      need[i] = [];
      for (let j = 0; j < m; j++) {
        need[i][j] = max[i][j] - allocation[i][j];
      }
    }
    return need;
  },

  // Run Safety Algorithm with Detailed Step Logging
  runSafetyAlgorithm(allocation, max, available) {
    const need = this.calculateNeed(max, allocation);
    const n = allocation.length;
    const m = available.length;

    const work = [...available];
    const finish = new Array(n).fill(false);
    const safeSequence = [];
    const steps = [];

    steps.push({
      step: 0,
      description: `Initialization: Set Work = Available = [${work.join(", ")}], Finish = [${finish.map(f => f ? "T" : "F").join(", ")}].`,
      work: [...work],
      finish: [...finish],
      selectedProcess: null
    });

    let found = true;
    while (found) {
      found = false;
      for (let i = 0; i < n; i++) {
        if (!finish[i]) {
          // Check if Need_i <= Work
          let canSatisfy = true;
          for (let j = 0; j < m; j++) {
            if (need[i][j] > work[j]) {
              canSatisfy = false;
              break;
            }
          }

          if (canSatisfy) {
            // Process i can complete!
            for (let j = 0; j < m; j++) {
              work[j] += allocation[i][j];
            }
            finish[i] = true;
            safeSequence.push(i);
            found = true;

            steps.push({
              step: steps.length,
              description: `Process P${i} selected! Need [${need[i].join(",")}] <= Work. P${i} finishes and releases Allocation [${allocation[i].join(",")}]. New Work = [${work.join(", ")}].`,
              work: [...work],
              finish: [...finish],
              selectedProcess: i
            });
            break; // restart scan
          }
        }
      }
    }

    const isSafe = finish.every(f => f === true);
    return {
      isSafe,
      need,
      safeSequence: isSafe ? safeSequence.map(idx => `P${idx}`) : [],
      steps,
      finalWork: work
    };
  },

  // Test Resource-Request Algorithm: Process Pi requests 'requestVector'
  testRequest(pIndex, requestVector, allocation, max, available) {
    const m = available.length;
    const need = this.calculateNeed(max, allocation);

    // 1. Check Request_i <= Need_i
    for (let j = 0; j < m; j++) {
      if (requestVector[j] > need[pIndex][j]) {
        return {
          granted: false,
          error: `Error: Process P${pIndex} has exceeded its maximum claim! (Requested ${requestVector[j]} of R${j} > Need ${need[pIndex][j]})`,
          safetyResult: null
        };
      }
    }

    // 2. Check Request_i <= Available
    for (let j = 0; j < m; j++) {
      if (requestVector[j] > available[j]) {
        return {
          granted: false,
          error: `Process P${pIndex} must wait! Resources are not currently available. (Requested ${requestVector[j]} of R${j} > Available ${available[j]})`,
          safetyResult: null
        };
      }
    }

    // 3. Speculative Allocation
    const newAvail = [...available];
    const newAlloc = allocation.map(row => [...row]);
    const newMax = max.map(row => [...row]);

    for (let j = 0; j < m; j++) {
      newAvail[j] -= requestVector[j];
      newAlloc[pIndex][j] += requestVector[j];
    }

    // Run Safety on speculative state
    const safetyResult = this.runSafetyAlgorithm(newAlloc, newMax, newAvail);

    if (safetyResult.isSafe) {
      return {
        granted: true,
        message: `SUCCESS! Request by P${pIndex} for [${requestVector.join(", ")}] can be GRANTED immediately. System remains in a SAFE STATE with sequence: <${safetyResult.safeSequence.join(", ")}>.`,
        newAvailable: newAvail,
        newAllocation: newAlloc,
        safetyResult
      };
    } else {
      return {
        granted: false,
        error: `REJECTED! Granting request by P${pIndex} for [${requestVector.join(", ")}] leads to an UNSAFE STATE! Allocation rolled back; process P${pIndex} must wait.`,
        safetyResult
      };
    }
  }
};
