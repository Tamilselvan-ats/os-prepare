// =============================================================================
// FLASHCARD SYSTEM DATABASE
// Front: Question/Term | Back: Concise Answer & Insight
// Difficulty Levels: Easy | Medium | Difficult | Filterable by Unit 2 & 3
// =============================================================================

window.FLASHCARDS_DATA = [
  // Unit 2 - Easy
  {
    id: "fc-1",
    unit: 2,
    difficulty: "Easy",
    topic: "Process Concept",
    front: "What is the definition of a Process in Operating Systems?",
    back: "A process is a program in execution progressing in sequential fashion. It includes Text, Data, Heap, and Stack sections."
  },
  {
    id: "fc-2",
    unit: 2,
    difficulty: "Easy",
    topic: "Process Memory",
    front: "In which direction do the Stack and Heap grow in a process address space?",
    back: "The Heap grows UPWARD from lower memory towards higher addresses. The Stack grows DOWNWARD from high memory (max) towards lower addresses."
  },
  {
    id: "fc-3",
    unit: 2,
    difficulty: "Easy",
    topic: "Process States",
    front: "What are the 5 states of a process?",
    back: "1. New (being created)\n2. Ready (waiting in RAM for CPU)\n3. Running (executing on CPU)\n4. Waiting (waiting for I/O or event)\n5. Terminated (finished execution)."
  },
  {
    id: "fc-4",
    unit: 2,
    difficulty: "Easy",
    topic: "PCB",
    front: "What does PCB stand for, and what is its alternative name?",
    back: "Process Control Block, also called a Task Control Block (TCB). It stores the complete hardware and software context of a process."
  },
  {
    id: "fc-5",
    unit: 2,
    difficulty: "Easy",
    topic: "Process Creation",
    front: "What system call is used to duplicate a process in UNIX?",
    back: "The `fork()` system call. It returns 0 in the child process, the child's PID in the parent process, and -1 on error."
  },
  {
    id: "fc-6",
    unit: 2,
    difficulty: "Easy",
    topic: "Process Termination",
    front: "What is a Zombie Process?",
    back: "A process that has terminated via `exit()`, but whose parent has not yet invoked `wait(&status)` to read its exit code and release its process table entry."
  },
  {
    id: "fc-7",
    unit: 2,
    difficulty: "Easy",
    topic: "Pipes",
    front: "What are the properties of UNIX Ordinary (Anonymous) Pipes?",
    back: "Unidirectional, communication requires a parent-child relationship, and the pipe disappears when the processes terminate. Uses fd[0] for read and fd[1] for write."
  },
  {
    id: "fc-8",
    unit: 2,
    difficulty: "Easy",
    topic: "Critical Section",
    front: "What is Mutual Exclusion?",
    back: "If process Pi is executing in its critical section, no other processes can be executing in their critical sections simultaneously."
  },

  // Unit 2 - Medium
  {
    id: "fc-9",
    unit: 2,
    difficulty: "Medium",
    topic: "Linux Internals",
    front: "What C structure represents a process in the Linux kernel?",
    back: "`struct task_struct`, containing pid, state, time_slice, *parent, children list, *files, and *mm. The global pointer `current` points to the running task."
  },
  {
    id: "fc-10",
    unit: 2,
    difficulty: "Medium",
    topic: "Producer-Consumer",
    front: "Why can the circular array bounded-buffer solution hold only BUFFER_SIZE - 1 elements?",
    back: "Because if all BUFFER_SIZE slots were filled, `in` would equal `out` (`in == out`), which is the exact same condition used to indicate that the buffer is completely EMPTY!"
  },
  {
    id: "fc-11",
    unit: 2,
    difficulty: "Medium",
    topic: "Message Passing",
    front: "What is a 'Rendezvous' in message passing IPC?",
    back: "A rendezvous occurs when both the `send()` and `receive()` primitives are blocking (synchronous). The sender and receiver meet at the same point in time to exchange the message."
  },
  {
    id: "fc-12",
    unit: 2,
    difficulty: "Medium",
    topic: "Peterson's Algorithm",
    front: "What are the two shared variables in Peterson's Solution and what do they signify?",
    back: "1. `int turn;` indicates whose turn it is to enter the critical section.\n2. `boolean flag[2];` indicates whether process Pi is ready to enter its critical section."
  },
  {
    id: "fc-13",
    unit: 2,
    difficulty: "Medium",
    topic: "Semaphores",
    front: "How does a non-busy-waiting semaphore avoid CPU spinning?",
    back: "When wait() sees S <= 0, it adds the process to the semaphore's waiting queue and invokes `block()` to put it to sleep. `signal()` invokes `wakeup(P)` to move it to the ready queue."
  },
  {
    id: "fc-14",
    unit: 2,
    difficulty: "Medium",
    topic: "Monitors",
    front: "What is the key difference between Semaphore signal() and Condition Variable signal()?",
    back: "A semaphore signal() has permanent state (increments counter even if no one waits). A condition variable signal() is stateless: if no thread is waiting, the signal is lost with NO effect."
  },

  // Unit 2 - Difficult
  {
    id: "fc-15",
    unit: 2,
    difficulty: "Difficult",
    topic: "Hardware Synchronization",
    front: "Define the atomic compare_and_swap(int *value, int expected, int new_value) instruction.",
    back: "Executed atomically: returns the original `*value`. It sets `*value = new_value` ONLY IF `*value == expected`. Otherwise, no swap occurs."
  },
  {
    id: "fc-16",
    unit: 2,
    difficulty: "Difficult",
    topic: "Dining Philosophers",
    front: "What is the asymmetric solution to the Dining-Philosophers problem?",
    back: "Odd-numbered philosophers pick up the LEFT chopstick first, then the RIGHT. Even-numbered philosophers pick up the RIGHT chopstick first, then the LEFT. This prevents circular wait."
  },
  {
    id: "fc-17",
    unit: 2,
    difficulty: "Difficult",
    topic: "Thread Models",
    front: "Why does modern Linux (NPTL) use the One-to-One thread model instead of Many-to-Many?",
    back: "M:M requires two competing schedulers (user runtime + kernel), causing priority inversion and high complexity. 1:1 provides full kernel-level concurrency across multicore CPUs with direct hardware affinity."
  },

  // Unit 3 - Easy
  {
    id: "fc-18",
    unit: 3,
    difficulty: "Easy",
    topic: "CPU Scheduling",
    front: "Which CPU scheduling circumstances are non-preemptive?",
    back: "Circumstance 1: Process switches from Running to Waiting state (e.g. I/O request).\nCircumstance 4: Process switches from Running to Terminated state."
  },
  {
    id: "fc-19",
    unit: 3,
    difficulty: "Easy",
    topic: "Scheduling Criteria",
    front: "What is the difference between Turnaround Time and Waiting Time?",
    back: "Turnaround Time is total elapsed time from submission to completion (`CT - AT`). Waiting Time is only the time spent sitting in the Ready Queue (`TAT - BT`)."
  },
  {
    id: "fc-20",
    unit: 3,
    difficulty: "Easy",
    topic: "Priority Scheduling",
    front: "What is the standard convention for priority integer values?",
    back: "Smallest integer value corresponds to the HIGHEST priority (e.g. Priority 1 > Priority 5). Note: verify if the specific exam problem reverses this."
  },
  {
    id: "fc-21",
    unit: 3,
    difficulty: "Easy",
    topic: "Deadlocks",
    front: "What is Hold and Wait?",
    back: "A process holding at least one resource is concurrently waiting to acquire additional resources that are currently being held by other processes."
  },
  {
    id: "fc-22",
    unit: 3,
    difficulty: "Easy",
    topic: "Deadlock Avoidance",
    front: "Can an Unsafe state exist without a Deadlock?",
    back: "YES! All deadlocks are unsafe, but all unsafes are NOT deadlocks. An unsafe state merely creates the vulnerability for deadlock if processes claim maximum resources."
  },

  // Unit 3 - Medium
  {
    id: "fc-23",
    unit: 3,
    difficulty: "Medium",
    topic: "FCFS & SJF",
    front: "Why is Shortest-Job-First (SJF) mathematically proven to be optimal?",
    back: "Moving shorter jobs ahead of longer jobs always decreases the waiting time of the short job by more than it increases the waiting time of the long job, minimizing average waiting time."
  },
  {
    id: "fc-24",
    unit: 3,
    difficulty: "Medium",
    topic: "Round Robin",
    front: "What is the recommended rule of thumb for selecting the Round Robin time quantum q?",
    back: "Approximately 80% of CPU bursts should be shorter than the time quantum q. This ensures most processes execute without preemption while maintaining high interactive responsiveness."
  },
  {
    id: "fc-25",
    unit: 3,
    difficulty: "Medium",
    topic: "Real-Time Scheduling",
    front: "What is Rate Monotonic Scheduling (RMS) priority assignment policy?",
    back: "Static priority policy with preemption: tasks are assigned priorities inversely proportional to their period length. Shorter period = Higher priority; Longer period = Lower priority."
  },
  {
    id: "fc-26",
    unit: 3,
    difficulty: "Medium",
    topic: "Real-Time Scheduling",
    front: "Why is Earliest Deadline First (EDF) considered superior to RMS?",
    back: "EDF dynamically assigns priorities based on earliest deadline, achieving up to 100% theoretical CPU utilization without requiring processes to be periodic or have constant burst times."
  },
  {
    id: "fc-27",
    unit: 3,
    difficulty: "Medium",
    topic: "RAG",
    front: "What is a Claim Edge in a Resource Allocation Graph?",
    back: "A directed dashed edge (Pi ---> Rj) indicating that process Pi may request resource Rj in the future. Converted to request edge when requested; used for deadlock avoidance."
  },

  // Unit 3 - Difficult
  {
    id: "fc-28",
    unit: 3,
    difficulty: "Difficult",
    topic: "Banker's Algorithm",
    front: "In the Banker's Resource-Request algorithm, what three steps are performed before running the Safety check?",
    back: "1. Check if Request_i <= Need_i (else error).\n2. Check if Request_i <= Available (else wait).\n3. Speculatively allocate: Available -= Request, Allocation += Request, Need -= Request. Then run Safety!"
  },
  {
    id: "fc-29",
    unit: 3,
    difficulty: "Difficult",
    topic: "Deadlock Detection",
    front: "What is a Wait-For Graph and what is the computational complexity of cycle detection?",
    back: "A collapsed graph for single-instance resources where nodes are processes and edge Pi -> Pj exists if Pi waits for Pj. Cycle detection requires O(n^2) operations."
  },
  {
    id: "fc-30",
    unit: 3,
    difficulty: "Difficult",
    topic: "Deadlock Recovery",
    front: "What three issues must be resolved when using Resource Preemption for deadlock recovery?",
    back: "1. Selecting a Victim (minimize cost).\n2. Rollback (return process to some safe state checkpoint).\n3. Starvation (ensure a process is not repeatedly picked as victim by factoring rollback count into cost)."
  }
];
