// =============================================================================
// ADAPTIVE QUIZ ENGINE DATABASE
// Formats: Multiple Choice (MCQ), Fill in Blanks, Assertion-Reason, Match Following, Numericals
// Adaptive difficulty progression (Beginner -> Intermediate -> Advanced)
// Sourced strictly from Unit 2 & Unit 3 materials
// =============================================================================

window.QUIZ_DATA = [
  // --- MULTIPLE CHOICE QUESTIONS (MCQ) ---
  {
    id: "q-mcq-1",
    type: "mcq",
    unit: 2,
    difficulty: "Easy",
    topic: "Process In Memory",
    question: "Which section of a process in memory contains dynamically allocated memory at run time?",
    options: ["Text section", "Data section", "Heap", "Stack"],
    correctIndex: 2,
    explanation: "The Heap contains memory dynamically allocated during run time (e.g., via malloc in C or new in Java), growing upwards toward higher addresses."
  },
  {
    id: "q-mcq-2",
    type: "mcq",
    unit: 2,
    difficulty: "Easy",
    topic: "Process States",
    question: "When a running process is interrupted by a hardware timer expiration, to which state does it transition?",
    options: ["Waiting state", "Terminated state", "Ready state", "New state"],
    correctIndex: 2,
    explanation: "A timer interrupt preempts the process from the Running state and moves it directly back to the Ready queue to await its next scheduler dispatch."
  },
  {
    id: "q-mcq-3",
    type: "mcq",
    unit: 2,
    difficulty: "Medium",
    topic: "Linux task_struct",
    question: "In the Linux operating system, what global kernel pointer directly points to the currently executing task_struct?",
    options: ["active_task", "current", "head_task", "running_process"],
    correctIndex: 1,
    explanation: "The Linux kernel maintains a global pointer named `current` which points to the struct task_struct of the process currently executing on the CPU core."
  },
  {
    id: "q-mcq-4",
    type: "mcq",
    unit: 2,
    difficulty: "Medium",
    topic: "Producer-Consumer",
    question: "In the shared-memory bounded-buffer solution using circular array of size BUFFER_SIZE, how many elements can be stored simultaneously?",
    options: ["BUFFER_SIZE", "BUFFER_SIZE - 1", "BUFFER_SIZE + 1", "Infinite"],
    correctIndex: 1,
    explanation: "The circular buffer algorithm can only hold BUFFER_SIZE - 1 elements simultaneously because if all slots were filled, in == out would indicate empty rather than full."
  },
  {
    id: "q-mcq-5",
    type: "mcq",
    unit: 2,
    difficulty: "Hard",
    topic: "Synchronization Hardware",
    question: "What does the atomic hardware instruction compare_and_swap(int *value, int expected, int new_value) return?",
    options: [
      "The new_value written to memory",
      "The original value of *value prior to the swap",
      "Boolean true if swapped, false otherwise",
      "Integer 0 always"
    ],
    correctIndex: 1,
    explanation: "compare_and_swap always returns the original contents of *value, allowing caller to check if `temp == expected` to confirm success."
  },
  {
    id: "q-mcq-6",
    type: "mcq",
    unit: 3,
    difficulty: "Easy",
    topic: "CPU Scheduling",
    question: "Under which of the following circumstances is CPU scheduling strictly non-preemptive?",
    options: [
      "When a process switches from running to ready state",
      "When a process switches from waiting to ready state",
      "When a process switches from running to waiting state",
      "When a high-priority process arrives in ready queue"
    ],
    correctIndex: 2,
    explanation: "Switching from Running to Waiting state (e.g. requesting I/O) is voluntary, so scheduling is non-preemptive (Circumstance 1)."
  },
  {
    id: "q-mcq-7",
    type: "mcq",
    unit: 3,
    difficulty: "Medium",
    topic: "Real-Time Scheduling",
    question: "Under Rate Monotonic Scheduling (RMS), what is the priority assignment policy for periodic tasks?",
    options: [
      "Longer periods are assigned higher priority",
      "Shorter periods are assigned higher priority",
      "Earliest absolute deadline gets higher priority",
      "Smallest execution burst gets higher priority"
    ],
    correctIndex: 1,
    explanation: "RMS assigns static priorities inversely proportional to period: shorter periods = higher priority; longer periods = lower priority."
  },
  {
    id: "q-mcq-8",
    type: "mcq",
    unit: 3,
    difficulty: "Hard",
    topic: "Deadlocks",
    question: "Which deadlock handling method is utilized by most modern general-purpose operating systems like Linux and Windows?",
    options: [
      "Deadlock Prevention via total ordering",
      "Banker's Algorithm Avoidance",
      "Ignore deadlocks (Ostrich Algorithm)",
      "Continuous cycle detection and rollback"
    ],
    correctIndex: 2,
    explanation: "Most commercial operating systems ignore deadlocks (Ostrich approach) because the runtime overhead of prevention/avoidance outweighs the rare occurrence of deadlocks."
  },

  // --- FILL IN THE BLANKS ---
  {
    id: "q-fitb-1",
    type: "fitb",
    unit: 2,
    difficulty: "Easy",
    topic: "Process Termination",
    question: "A terminated process whose parent has not yet invoked the wait() system call is known as a ________ process.",
    acceptedAnswers: ["zombie", "zombie process"],
    explanation: "A zombie process has finished execution but remains in the OS process table so its parent can read its exit status code."
  },
  {
    id: "q-fitb-2",
    type: "fitb",
    unit: 2,
    difficulty: "Medium",
    topic: "Message Passing",
    question: "When both the send() and receive() operations in message passing are blocking, the communication state is called a ________.",
    acceptedAnswers: ["rendezvous"],
    explanation: "A rendezvous occurs when both sender and receiver block until the message is handed off synchronously."
  },
  {
    id: "q-fitb-3",
    type: "fitb",
    unit: 3,
    difficulty: "Easy",
    topic: "Dispatcher",
    question: "The time required for the dispatcher to stop one process and start another running is called dispatch ________.",
    acceptedAnswers: ["latency"],
    explanation: "Dispatch latency is the pure OS context switch and mode transition overhead during which no user execution takes place."
  },
  {
    id: "q-fitb-4",
    type: "fitb",
    unit: 3,
    difficulty: "Medium",
    topic: "Priority Scheduling",
    question: "The technique used to prevent starvation in priority scheduling by gradually increasing the priority of waiting processes over time is called ________.",
    acceptedAnswers: ["aging"],
    explanation: "Aging ensures that low-priority processes eventually acquire the highest priority in the ready queue and execute."
  },

  // --- ASSERTION AND REASON ---
  {
    id: "q-ar-1",
    type: "assertion-reason",
    unit: 2,
    difficulty: "Medium",
    topic: "Critical Section",
    assertion: "Disabling hardware interrupts is not an acceptable solution for solving the critical section problem on multicore multiprocessor systems.",
    reason: "Disabling interrupts on all processor cores is time-consuming, degrades clock synchronization, and severely reduces scalability.",
    options: [
      "Both Assertion and Reason are true, and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true, but Reason is NOT the correct explanation.",
      "Assertion is true, but Reason is false.",
      "Assertion is false, but Reason is true."
    ],
    correctIndex: 0,
    explanation: "While disabling interrupts works on uniprocessors, broadcasting interrupt disable messages across all cores on multiprocessors causes severe performance bottlenecks."
  },
  {
    id: "q-ar-2",
    type: "assertion-reason",
    unit: 3,
    difficulty: "Hard",
    topic: "RAG & Deadlocks",
    assertion: "The presence of a directed cycle in a Resource Allocation Graph does not always imply that a deadlock has occurred.",
    reason: "If resource types involved in the cycle possess multiple instances, processes outside the cycle can complete and release instances to break the circular dependency.",
    options: [
      "Both Assertion and Reason are true, and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true, but Reason is NOT the correct explanation.",
      "Assertion is true, but Reason is false.",
      "Assertion is false, but Reason is true."
    ],
    correctIndex: 0,
    explanation: "In multi-instance RAGs, a cycle is a necessary but not sufficient condition for deadlock (as demonstrated in SRM Slide 52 Example 2)."
  },

  // --- MATCH THE FOLLOWING ---
  {
    id: "q-match-1",
    type: "match",
    unit: 2,
    difficulty: "Medium",
    topic: "Threading Implementations",
    question: "Match the operating system / technology with its corresponding multithreading architecture:",
    pairs: [
      { left: "Solaris Green Threads", right: "Many-to-One Model" },
      { left: "Modern Linux (NPTL)", right: "One-to-One Model" },
      { left: "Windows with ThreadFiber", right: "Many-to-Many Model" },
      { left: "IRIX / HP-UX / Tru64", right: "Two-Level Model" }
    ],
    explanation: "Solaris Green Threads mapped all user threads to 1 kernel thread. Modern Linux uses 1:1. ThreadFiber provides M:M, while older UNIXes implemented Two-level hybrid models."
  },
  {
    id: "q-match-2",
    type: "match",
    unit: 3,
    difficulty: "Medium",
    topic: "Deadlock Prevention",
    question: "Match each of the four necessary deadlock conditions with its corresponding prevention protocol:",
    pairs: [
      { left: "Mutual Exclusion", right: "Make resources sharable (read-only files)" },
      { left: "Hold and Wait", right: "Allocate all resources prior to execution start" },
      { left: "No Preemption", right: "Preempt all held resources if request fails" },
      { left: "Circular Wait", right: "Total resource ordering function F: R -> N" }
    ],
    explanation: "Deadlock prevention eliminates deadlock by strictly invalidating at least one of the four Coffman conditions via these protocols."
  },

  // --- NUMERICAL PROBLEMS ---
  {
    id: "q-num-1",
    type: "numerical",
    unit: 3,
    difficulty: "Medium",
    topic: "FCFS Numerical",
    question: "Three processes arrive at time 0 in order P1, P2, P3 with burst times P1 = 24 ms, P2 = 3 ms, and P3 = 3 ms. What is the Average Waiting Time (in milliseconds) under FCFS scheduling?",
    correctAnswer: 17,
    tolerance: 0.1,
    formula: "P1 WT = 0; P2 WT = 24; P3 WT = 24 + 3 = 27. Avg WT = (0 + 24 + 27) / 3 = 51 / 3 = 17 ms.",
    explanation: "This is the classic SRM Slide 10 numerical demonstrating the severe Convoy Effect."
  },
  {
    id: "q-num-2",
    type: "numerical",
    unit: 3,
    difficulty: "Medium",
    topic: "Amdahl's Law",
    question: "An application has a parallel portion of 75% and a serial portion of 25%. Moving from 1 core to 2 cores, what is the speedup factor according to Amdahl's Law?",
    correctAnswer: 1.6,
    tolerance: 0.05,
    formula: "Speedup <= 1 / [S + (1 - S) / N] = 1 / [0.25 + 0.75 / 2] = 1 / [0.25 + 0.375] = 1 / 0.625 = 1.6.",
    explanation: "SRM Slide 73 Amdahl's Law benchmark."
  },
  {
    id: "q-num-3",
    type: "numerical",
    unit: 3,
    difficulty: "Hard",
    topic: "SRTF Numerical",
    question: "Processes arrive as: P1(AT=0, BT=7), P2(AT=2, BT=4), P3(AT=4, BT=1), P4(AT=5, BT=4). What is the Average Waiting Time under Shortest-Remaining-Time-First (SRTF) scheduling?",
    correctAnswer: 3,
    tolerance: 0.1,
    formula: "Waiting times: P1 = (0-0)+(11-2) = 9; P2 = (2-2)+(5-4) = 1; P3 = 4-4 = 0; P4 = 7-5 = 2. Avg WT = (9 + 1 + 0 + 2) / 4 = 12 / 4 = 3 ms.",
    explanation: "SRM Slide 17 Example 3 demonstrates SRTF optimal waiting time."
  }
];
