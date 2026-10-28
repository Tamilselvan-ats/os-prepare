// =============================================================================
// SYNCHRONIZATION VISUALIZERS ENGINE
// Interactive step-by-step simulations for:
// 1. Mutex Locks & Spinlocks
// 2. Semaphores (Counting, Binary, Waiting Queues, block & wakeup)
// 3. Peterson's Solution (2-process flag & turn proof)
// 4. Bounded Buffer (Producer-Consumer with empty, full, mutex)
// 5. Readers-Writers (Concurrent readers vs exclusive writer)
// 6. Dining Philosophers (Round table, chopsticks, Deadlock vs Solutions)
// 7. Monitors (Monitor lock, Condition Variables x.wait and x.signal)
// =============================================================================

window.SyncSimulators = {
  // 1. MUTEX / SPINLOCK STATE
  mutexState: {
    available: true,
    owner: null,
    threads: {
      T0: { state: "IDLE", spins: 0 },
      T1: { state: "IDLE", spins: 0 }
    },
    logs: []
  },

  resetMutex() {
    this.mutexState = {
      available: true,
      owner: null,
      threads: {
        T0: { state: "IDLE", spins: 0 },
        T1: { state: "IDLE", spins: 0 }
      },
      logs: ["Mutex initialized: available = true. Critical section is empty."]
    };
    return this.mutexState;
  },

  mutexAction(tid, action) {
    const s = this.mutexState;
    const t = s.threads[tid];

    if (action === "request") {
      if (s.available) {
        s.available = false;
        s.owner = tid;
        t.state = "CRITICAL_SECTION";
        s.logs.push(`✅ ${tid} invoked acquire(): Lock acquired! Entered Critical Section.`);
      } else {
        t.state = "SPINNING";
        t.spins++;
        s.logs.push(`⚠️ ${tid} invoked acquire(): Lock held by ${s.owner}! ${tid} is busy-waiting (Spinning, spin #${t.spins}).`);
      }
    } else if (action === "release") {
      if (s.owner === tid) {
        s.available = true;
        s.owner = null;
        t.state = "IDLE";
        t.spins = 0;
        s.logs.push(`🔓 ${tid} invoked release(): Critical Section exited. Lock is now available.`);
        // If other thread is spinning, grant lock
        const otherTid = tid === "T0" ? "T1" : "T0";
        if (s.threads[otherTid].state === "SPINNING") {
          s.available = false;
          s.owner = otherTid;
          s.threads[otherTid].state = "CRITICAL_SECTION";
          s.logs.push(`⚡ ${otherTid} detected available lock while spinning! ${otherTid} acquired lock and entered CS.`);
        }
      }
    }
    return s;
  },

  // 2. SEMAPHORE STATE
  semaphoreState: {
    value: 2, // counting semaphore
    initialValue: 2,
    waitingQueue: [],
    activeProcesses: [],
    logs: []
  },

  resetSemaphore(initialVal = 2) {
    this.semaphoreState = {
      value: initialVal,
      initialValue: initialVal,
      waitingQueue: [],
      activeProcesses: [],
      logs: [`Semaphore S initialized with value = ${initialVal}.`]
    };
    return this.semaphoreState;
  },

  semaphoreWait(pid) {
    const s = this.semaphoreState;
    s.value--;
    if (s.value < 0) {
      s.waitingQueue.push(pid);
      s.logs.push(`🛑 ${pid} called wait(S): Value decremented to ${s.value} (< 0). ${pid} is BLOCKED and placed on waiting queue! (Queue length: ${s.waitingQueue.length})`);
    } else {
      s.activeProcesses.push(pid);
      s.logs.push(`✅ ${pid} called wait(S): Value decremented to ${s.value} (>= 0). Resource allocated to ${pid}!`);
    }
    return s;
  },

  semaphoreSignal(pid) {
    const s = this.semaphoreState;
    s.value++;
    // Remove pid from active
    s.activeProcesses = s.activeProcesses.filter(p => p !== pid);

    if (s.value <= 0 && s.waitingQueue.length > 0) {
      const awakenedPid = s.waitingQueue.shift();
      s.activeProcesses.push(awakenedPid);
      s.logs.push(`📢 ${pid} called signal(S): Value incremented to ${s.value} (<= 0). OS invoked wakeup(${awakenedPid}) from waiting queue to execute!`);
    } else {
      s.logs.push(`✨ ${pid} called signal(S): Value incremented to ${s.value}. No processes are currently sleeping on S.`);
    }
    return s;
  },

  // 3. PETERSON'S SOLUTION STATE
  petersonState: {
    turn: 0,
    flag: [false, false],
    p0Step: 0, // 0: Remainder, 1: Flag=true, 2: Turn=1, 3: In CS
    p1Step: 0,
    csHolder: null,
    logs: []
  },

  resetPeterson() {
    this.petersonState = {
      turn: 0,
      flag: [false, false],
      p0Step: 0,
      p1Step: 0,
      csHolder: null,
      logs: ["Peterson's algorithm initialized: flag[0]=false, flag[1]=false, turn=0."]
    };
    return this.petersonState;
  },

  stepPeterson(pId) {
    const s = this.petersonState;
    const otherId = 1 - pId;

    if (pId === 0) {
      if (s.p0Step === 0) {
        s.flag[0] = true;
        s.p0Step = 1;
        s.logs.push(`P0: set flag[0] = true ("I am ready to enter")`);
      } else if (s.p0Step === 1) {
        s.turn = 1;
        s.p0Step = 2;
        s.logs.push(`P0: set turn = 1 ("Giving priority to P1")`);
      } else if (s.p0Step === 2) {
        // Evaluate while (flag[1] && turn == 1)
        if (s.flag[1] && s.turn === 1) {
          s.logs.push(`P0: while condition evaluates TRUE (flag[1]=true AND turn=1) -> P0 must BUSY-WAIT!`);
        } else {
          s.p0Step = 3;
          s.csHolder = "P0";
          s.logs.push(`✅ P0: while condition evaluates FALSE -> P0 ENTERED CRITICAL SECTION!`);
        }
      } else if (s.p0Step === 3) {
        s.flag[0] = false;
        s.p0Step = 0;
        if (s.csHolder === "P0") s.csHolder = null;
        s.logs.push(`🔓 P0: set flag[0] = false -> Exited CS, back in Remainder Section.`);
      }
    } else {
      if (s.p1Step === 0) {
        s.flag[1] = true;
        s.p1Step = 1;
        s.logs.push(`P1: set flag[1] = true ("I am ready to enter")`);
      } else if (s.p1Step === 1) {
        s.turn = 0;
        s.p1Step = 2;
        s.logs.push(`P1: set turn = 0 ("Giving priority to P0")`);
      } else if (s.p1Step === 2) {
        if (s.flag[0] && s.turn === 0) {
          s.logs.push(`P1: while condition evaluates TRUE (flag[0]=true AND turn=0) -> P1 must BUSY-WAIT!`);
        } else {
          s.p1Step = 3;
          s.csHolder = "P1";
          s.logs.push(`✅ P1: while condition evaluates FALSE -> P1 ENTERED CRITICAL SECTION!`);
        }
      } else if (s.p1Step === 3) {
        s.flag[1] = false;
        s.p1Step = 0;
        if (s.csHolder === "P1") s.csHolder = null;
        s.logs.push(`🔓 P1: set flag[1] = false -> Exited CS, back in Remainder Section.`);
      }
    }
    return s;
  },

  // 4. BOUNDED BUFFER (PRODUCER-CONSUMER) STATE
  boundedBufferState: {
    capacity: 5,
    buffer: [],
    emptySem: 5,
    fullSem: 0,
    mutexSem: 1,
    in: 0,
    out: 0,
    logs: []
  },

  resetBoundedBuffer(cap = 5) {
    this.boundedBufferState = {
      capacity: cap,
      buffer: new Array(cap).fill(null),
      emptySem: cap,
      fullSem: 0,
      mutexSem: 1,
      in: 0,
      out: 0,
      logs: [`Bounded Buffer initialized with capacity = ${cap}. empty=${cap}, full=0, mutex=1.`]
    };
    return this.boundedBufferState;
  },

  produceItem() {
    const s = this.boundedBufferState;
    if (s.emptySem <= 0) {
      s.logs.push(`🛑 Producer blocked! Semaphore empty == 0 (Buffer is completely full!). Producer must wait.`);
      return s;
    }

    s.emptySem--;
    s.mutexSem--; // acquire mutex
    const itemNum = Math.floor(Math.random() * 900) + 100;
    s.buffer[s.in] = itemNum;
    s.logs.push(`📦 Producer placed Item #${itemNum} at index ${s.in}.`);
    s.in = (s.in + 1) % s.capacity;
    s.mutexSem++; // release mutex
    s.fullSem++; // signal full
    s.logs.push(`✅ Producer finished: empty=${s.emptySem}, full=${s.fullSem}.`);
    return s;
  },

  consumeItem() {
    const s = this.boundedBufferState;
    if (s.fullSem <= 0) {
      s.logs.push(`🛑 Consumer blocked! Semaphore full == 0 (Buffer is empty!). Consumer must wait.`);
      return s;
    }

    s.fullSem--;
    s.mutexSem--;
    const consumed = s.buffer[s.out];
    s.buffer[s.out] = null;
    s.logs.push(`🍽️ Consumer retrieved Item #${consumed} from index ${s.out}.`);
    s.out = (s.out + 1) % s.capacity;
    s.mutexSem++;
    s.emptySem++;
    s.logs.push(`✅ Consumer finished: empty=${s.emptySem}, full=${s.fullSem}.`);
    return s;
  },

  // 5. READERS-WRITERS STATE
  rwState: {
    readCount: 0,
    mutex: 1,
    rwMutex: 1,
    activeReaders: [],
    activeWriter: null,
    waitingWriters: 0,
    logs: []
  },

  resetReadersWriters() {
    this.rwState = {
      readCount: 0,
      mutex: 1,
      rwMutex: 1,
      activeReaders: [],
      activeWriter: null,
      waitingWriters: 0,
      logs: ["Readers-Writers initialized: read_count = 0, mutex = 1, rw_mutex = 1."]
    };
    return this.rwState;
  },

  startReader(id) {
    const s = this.rwState;
    if (s.activeWriter) {
      s.logs.push(`🛑 Reader ${id} blocked! A writer (${s.activeWriter}) is currently in the critical section!`);
      return s;
    }

    s.readCount++;
    if (s.readCount === 1) {
      // First reader locks rwMutex
      s.rwMutex = 0;
      s.logs.push(`🔒 First Reader ${id} acquired rw_mutex! Writers are now locked out.`);
    }
    s.activeReaders.push(id);
    s.logs.push(`📖 Reader ${id} began reading. (Total active readers: ${s.readCount})`);
    return s;
  },

  stopReader(id) {
    const s = this.rwState;
    if (!s.activeReaders.includes(id)) return s;

    s.activeReaders = s.activeReaders.filter(r => r !== id);
    s.readCount--;
    s.logs.push(`📘 Reader ${id} finished reading. (Remaining readers: ${s.readCount})`);

    if (s.readCount === 0) {
      // Last reader releases rwMutex
      s.rwMutex = 1;
      s.logs.push(`🔓 Last Reader finished! Released rw_mutex. Writers can now enter.`);
    }
    return s;
  },

  startWriter(id) {
    const s = this.rwState;
    if (s.activeWriter || s.readCount > 0) {
      s.logs.push(`🛑 Writer ${id} BLOCKED! Cannot write while active readers (${s.readCount}) or writer (${s.activeWriter}) exist.`);
      return s;
    }

    s.rwMutex = 0;
    s.activeWriter = id;
    s.logs.push(`✍️ Writer ${id} acquired rw_mutex! Entered Critical Section with exclusive write access.`);
    return s;
  },

  stopWriter(id) {
    const s = this.rwState;
    if (s.activeWriter === id) {
      s.activeWriter = null;
      s.rwMutex = 1;
      s.logs.push(`🔓 Writer ${id} released rw_mutex and exited Critical Section.`);
    }
    return s;
  },

  // 6. DINING PHILOSOPHERS STATE
  diningState: {
    numPhilosophers: 5,
    philosophers: ["THINKING", "THINKING", "THINKING", "THINKING", "THINKING"],
    chopsticks: [1, 1, 1, 1, 1], // 1: available, 0: held
    heldBy: [null, null, null, null, null],
    isDeadlocked: false,
    mode: "standard", // standard, asymmetric, 4-diner
    logs: []
  },

  resetDining(mode = "standard") {
    this.diningState = {
      numPhilosophers: 5,
      philosophers: ["THINKING", "THINKING", "THINKING", "THINKING", "THINKING"],
      chopsticks: [1, 1, 1, 1, 1],
      heldBy: [null, null, null, null, null],
      isDeadlocked: false,
      mode: mode,
      logs: [`Dining Philosophers reset in ${mode.toUpperCase()} mode. 5 philosophers THINKING.`]
    };
    return this.diningState;
  },

  triggerDiningDeadlock() {
    // Force every philosopher to grab their left chopstick
    const s = this.diningState;
    for (let i = 0; i < 5; i++) {
      s.philosophers[i] = "HUNGRY";
      s.chopsticks[i] = 0;
      s.heldBy[i] = i;
    }
    s.isDeadlocked = true;
    s.logs.push(`🚨 DEADLOCK TRIGGERED! Every philosopher (P0..P4) simultaneously acquired their LEFT chopstick.`);
    s.logs.push(`🛑 Each philosopher is now holding chopstick[i] and waiting for chopstick[(i+1)%5]. All chopsticks are 0 -> CIRCULAR WAIT DEADLOCK!`);
    return s;
  },

  togglePhilosopher(i) {
    const s = this.diningState;
    const left = i;
    const right = (i + 1) % 5;

    if (s.philosophers[i] === "EATING") {
      // Put down chopsticks
      s.philosophers[i] = "THINKING";
      s.chopsticks[left] = 1;
      s.chopsticks[right] = 1;
      s.heldBy[left] = null;
      s.heldBy[right] = null;
      s.logs.push(`💭 Philosopher ${i} finished eating. Released chopsticks ${left} and ${right}. Now THINKING.`);
    } else {
      // Philosopher wants to eat
      s.philosophers[i] = "HUNGRY";

      if (s.mode === "asymmetric") {
        // Odd picks left first, even picks right first
        const first = (i % 2 === 1) ? left : right;
        const second = (i % 2 === 1) ? right : left;

        if (s.chopsticks[first] === 1 && s.chopsticks[second] === 1) {
          s.chopsticks[first] = 0;
          s.chopsticks[second] = 0;
          s.heldBy[first] = i;
          s.heldBy[second] = i;
          s.philosophers[i] = "EATING";
          s.logs.push(`🍜 Philosopher ${i} (Asymmetric Mode) acquired chopstick ${first} then ${second}. Now EATING!`);
        } else {
          s.logs.push(`⚠️ Philosopher ${i} is HUNGRY but chopsticks ${first} or ${second} are busy. Must wait.`);
        }
      } else {
        // Standard check
        if (s.chopsticks[left] === 1 && s.chopsticks[right] === 1) {
          s.chopsticks[left] = 0;
          s.chopsticks[right] = 0;
          s.heldBy[left] = i;
          s.heldBy[right] = i;
          s.philosophers[i] = "EATING";
          s.logs.push(`🍜 Philosopher ${i} acquired chopsticks ${left} and ${right}. Now EATING!`);
        } else {
          s.logs.push(`⚠️ Philosopher ${i} is HUNGRY but neighbors are using chopsticks ${left} or ${right}. Waiting.`);
        }
      }
    }
    return s;
  }
};
