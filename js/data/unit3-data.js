// =============================================================================
// UNIT 3: SCHEDULING AND DEADLOCKS - EXHAUSTIVE LEARNING DATA
// Sourced strictly from SRM University 21CSC202J Course Material & Galvin 9th Ed.
// ZERO CONTENT OMISSION GUARANTEED - ALL NUMERICALS & DIAGRAMS INCLUDED
// =============================================================================

window.UNIT3_DATA = [
  {
    id: "cpu-scheduling-basics",
    title: "Process Scheduling Basics & CPU-I/O Burst Cycle",
    unit: 3,
    badge: "CLR-3 & CLO-3 Foundation",
    beginner: "A computer program is like playing a video game: you mash buttons furiously for 5 seconds (CPU Burst), then wait for the next level to load from disk (I/O Burst). Maximum fun happens when you keep the computer busy non-stop!",
    college: "Course Learning Outcome CLO-3: Exemplify different types of scheduling algorithms and deadlock mechanisms. Basic Concept: Maximum CPU utilization is obtained with multiprogramming. Process execution consists of an alternating cycle of a CPU time burst and an I/O time burst. Processes alternate between these two states (CPU burst -> I/O burst -> CPU burst -> I/O burst). Eventually, the final CPU burst ends with execution termination. Schedulers: Preemptive Scheduling: The CPU is allocated to a process, but if a higher-priority or newly runnable process arrives, the current process releases the CPU and resumes service once the higher-priority process completes. Non-Preemptive Scheduling: Once the CPU is allocated to a process, it keeps the CPU until it releases it either by terminating or switching to a waiting state. CPU Scheduling Circumstances: 1. (Non-preemptive) Process switches from running to waiting state (e.g. I/O request), 2. (Preemptive) Process switches from running to ready state (e.g. timer interrupt), 3. (Preemptive) Process switches from waiting to ready state (e.g. I/O completion), 4. (Non-preemptive) Process switches from running to terminated state. Circumstances 1 and 4 are strictly non-preemptive; circumstances 2 and 3 are preemptive.",
    interview: "FAANG interviewers test whether you can identify the exact boundary between hardware interrupts and software scheduling. Circumstance 2 (running to ready) is triggered by the hardware timer interrupt invoking the kernel's scheduler. Circumstance 3 (waiting to ready) occurs when an I/O controller sends an interrupt indicating transfer completion, causing the kernel to move the process to the ready queue and check if it preempts the currently running task.",
    mnemonic: "Burst Cycle = CPU -> I/O -> CPU -> Terminate. Scheduling Points: 1 & 4 = Non-Preemptive (Voluntary); 2 & 3 = Preemptive (Forced).",
    analogy: "Restaurant Kitchen: A chef chops onions (CPU burst), puts soup on the stove to simmer for 20 minutes (I/O burst), plates the entree (CPU burst), and rings the order bell (Terminated).",
    mistakes: "Thinking preemption can occur during circumstances 1 and 4. In circumstances 1 (waiting for I/O) and 4 (terminating), the process gives up the CPU voluntarily—preemption is neither required nor possible!",
    examPoints: [
      "Describe the CPU-I/O burst cycle with a neat diagram (5 Marks / SRM Slide 4).",
      "Differentiate between Preemptive and Non-Preemptive scheduling (5 Marks / SRM Slide 5).",
      "List the four circumstances under which CPU scheduling decisions take place. Which are preemptive and which are non-preemptive? (5 Marks / Repeated SRM Question / Slide 6)."
    ],
    diagram: "cpu-io-burst-cycle"
  },
  {
    id: "dispatcher",
    title: "The Dispatcher & Dispatch Latency",
    unit: 3,
    badge: "Core Mechanism",
    beginner: "The CPU Scheduler is the chess grandmaster deciding which piece to move next. The Dispatcher is the physical hand that actually picks up the piece, sets it on the square, and hits the chess clock!",
    college: "The Dispatcher is the software module that gives control of the CPU to the process selected by the short-term CPU scheduler. This operation involves three distinct actions: 1. Switching context (saving old registers, loading new registers), 2. Switching to user mode from kernel mode, 3. Jumping to the proper location in the user program (specified by its Program Counter) to restart that program. Dispatch Latency Definition: The time it takes for the dispatcher to stop one process and start another process running. Dispatch latency is pure operating system overhead during which zero user computation occurs.",
    interview: "How does dispatch latency affect real-time operating systems (RTOS)? In hard real-time systems, dispatch latency must be bounded and strictly deterministic. If dispatch latency has high jitter (variance), periodic real-time tasks will miss hard deadlines even if average CPU utilization is low.",
    mnemonic: "D-C-U-J: Dispatcher = Context switch, User mode switch, Jump to PC.",
    analogy: "Formula 1 Pit Stop: The race strategist deciding to change tires is the Scheduler. The pit crew that jacks up the car, swaps the 4 wheels, and releases the car back onto the track is the Dispatcher. The 2.1 seconds spent stationary is the Dispatch Latency.",
    mistakes: "Confusing the CPU Scheduler with the Dispatcher. The Scheduler SELECTS which process to run; the Dispatcher actually GIVES the CPU to that selected process!",
    examPoints: [
      "What is a Dispatcher? What are the three functions performed by the dispatcher? (5 Marks / SRM Slide 7).",
      "Define Dispatch Latency with a block diagram (2 Marks / Repeated Question / Slide 7)."
    ],
    diagram: "dispatcher-flow"
  },
  {
    id: "scheduling-criteria",
    title: "CPU Scheduling Criteria & Performance Metrics",
    unit: 3,
    badge: "Evaluation Metrics",
    beginner: "How do you grade a taxi driver? By how busy their cab is (CPU Utilization), how many passengers they deliver per hour (Throughput), how quickly they arrive when you call (Response Time), how long you wait on the sidewalk (Waiting Time), and total trip time (Turnaround Time)!",
    college: "Different CPU scheduling algorithms exhibit distinct properties. Criteria used for comparison: 1. CPU Utilization: Keep the CPU as busy as possible. Utilization ranges theoretically from 0% to 100%. In practice: Lightly loaded system = 40%; Heavily loaded system = 90%. 2. Throughput: The number of processes completed per unit of time ($Throughput = \\text{Completed Processes} / \\text{Time Unit}$). 3. Turnaround Time (TAT): The amount of time to execute a particular process from the time of submission through the time of completion ($TAT = \\text{Completion Time} - \\text{Arrival Time}$). 4. Waiting Time (WT): The total amount of time a process has spent waiting in the ready queue ($WT = TAT - \\text{Burst Time}$). 5. Response Time (RT): The amount of time it takes from when a request was submitted until the first response occurs (critical in interactive time-sharing systems). Optimization goals: Maximize CPU Utilization and Throughput; Minimize Turnaround Time, Waiting Time, and Response Time.",
    interview: "Why is minimizing the variance of response time often more important in user-facing systems than minimizing average response time? Predictability! Users tolerate an application that consistently responds in 100ms far better than one that responds in 20ms usually but unpredictably freezes for 2 seconds.",
    mnemonic: "C-T-T-W-R -> 'Can The Teacher Win Respect?' -> CPU Utilization (Max), Throughput (Max), Turnaround (Min), Waiting (Min), Response (Min).",
    analogy: "Hospital Patient Care: CPU Utilization = Surgeon actively operating (vs idle). Throughput = Surgeries completed per day. Turnaround Time = Admitted to discharged. Waiting Time = Time sitting in the waiting lobby. Response Time = Time until triage nurse first checks pulse.",
    mistakes: "Confusing Waiting Time with Turnaround Time. Waiting time does NOT include time spent executing on the CPU or performing I/O; it is ONLY time spent sitting in the Ready Queue!",
    examPoints: [
      "Define the five CPU scheduling criteria: CPU Utilization, Throughput, Turnaround Time, Waiting Time, and Response Time (10 Marks / SRM Slide 8).",
      "What is the typical CPU utilization for lightly loaded vs heavily loaded systems? (2 Marks / Slide 8).",
      "Write the formulas for Turnaround Time and Waiting Time (2 Marks)."
    ]
  },
  {
    id: "fcfs",
    title: "First-Come, First-Served (FCFS) & Convoy Effect",
    unit: 3,
    badge: "Algorithms & SRM Numericals",
    beginner: "Like standing in line at a grocery checkout counter: the person in front of you with a giant shopping cart full of 100 items takes 20 minutes, while you holding 1 candy bar have to stand and wait the whole time! That's the 'Convoy Effect'!",
    college: "In First-Come, First-Served (FCFS) scheduling, the first process that requests the CPU is allocated the CPU first using a FIFO queue. Non-preemptive. SRM Slide 10 Numerical Example 1: Three processes arrive in order P1, P2, P3 at time 0. Burst times: P1 = 24, P2 = 3, P3 = 3. Gantt Chart: P1 [0 - 24], P2 [24 - 27], P3 [27 - 30]. Waiting Times: P1 = 0, P2 = 24, P3 = 27. Average Waiting Time = (0 + 24 + 27) / 3 = 51 / 3 = 17 ms. Turnaround Times: P1 = 24, P2 = 27, P3 = 30. Average Turnaround Time = (24 + 27 + 30) / 3 = 81 / 3 = 27 ms. Convoy Effect (2 Marks): A phenomenon where all short processes wait behind one long CPU-bound process to finish execution, causing low CPU and device utilization. SRM Slide 12-13 Example 2 (Arrival order P2, P3, P1): Gantt Chart: P2 [0 - 3], P3 [3 - 6], P1 [6 - 30]. Waiting Times: P2 = 0, P3 = 3, P1 = 6. Average Waiting Time = (0 + 3 + 6) / 3 = 9 / 3 = 3 ms (drastic drop from 17 ms!). Average Turnaround Time = (3 + 6 + 30) / 3 = 39 / 3 = 13 ms (drop from 27 ms!). Advantages: Simple, easy to implement with FIFO. Disadvantages: Convoy effect, highly sensitive to arrival order, no preemption.",
    interview: "Explain how the Convoy Effect causes underutilization of I/O devices: While the long CPU-bound process holds the CPU, all I/O-bound processes sit idle in the ready queue. When the long process finally issues an I/O request, all short processes rush through the CPU quickly and queue up at the I/O devices, leaving the CPU idle!",
    mnemonic: "FCFS: First in line, First to dine. Beware the Convoy: Small cars stuck behind a giant Tractor!",
    analogy: "Single Petrol Pump: A massive 18-wheel truck takes 45 minutes to fill its fuel tank while 5 motorcycles with 2-minute refills wait in a long line behind it.",
    mistakes: "Assuming FCFS is preemptive. FCFS is strictly NON-PREEMPTIVE. Once a process gets the CPU, it never yields until completion or I/O.",
    examPoints: [
      "Define Convoy Effect with an example (2 Marks / SRM Slide 11 / Repeated University Question).",
      "Given processes P1 (BT 24), P2 (BT 3), P3 (BT 3), draw Gantt charts and compute Average WT and TAT for arrival orders P1, P2, P3 vs P2, P3, P1 (10 Marks / SRM Slide 10-13).",
      "List the advantages and disadvantages of FCFS scheduling (5 Marks / SRM Slide 14)."
    ],
    numerical: {
      type: "fcfs",
      problem: "Three processes arrive in order P1, P2, P3 at time 0. Burst Times: P1=24, P2=3, P3=3.",
      gantt: [{ pid: "P1", start: 0, end: 24 }, { pid: "P2", start: 24, end: 27 }, { pid: "P3", start: 27, end: 30 }],
      wt: { P1: 0, P2: 24, P3: 27, avg: 17 },
      tat: { P1: 24, P2: 27, P3: 30, avg: 27 }
    }
  },
  {
    id: "sjf-nonpreemptive",
    title: "Shortest-Job-First (SJF) Scheduling (Non-Preemptive)",
    unit: 3,
    badge: "Optimal Waiting Time",
    beginner: "At the supermarket express line, the cashier always serves the customer holding the fewest items first. That way, the line clears as fast as possible!",
    college: "Shortest-Job-First (SJF) associates with each process the length of its next CPU burst. When the CPU is available, it is assigned to the process with the smallest next CPU burst. If two processes have equal bursts, FCFS breaks the tie. SJF is mathematically proven to be optimal because it gives the minimum average waiting time for a given set of processes. SRM Slide 15 Example 1 (Simultaneous Arrival at time 0): P1=24, P2=3, P3=3. Schedule order: P2, P3, P1. Gantt Chart: P2 [0-3], P3 [3-6], P1 [6-30]. Avg WT = (0 + 3 + 6) / 3 = 3 ms. Avg TAT = (3 + 6 + 30) / 3 = 13 ms. SRM Slide 16 Example 2 (Varied Arrival Times, Non-Preemptive): Processes: P1 (AT=0, BT=7), P2 (AT=2, BT=4), P3 (AT=4, BT=1), P4 (AT=5, BT=4). Execution Trace: At time 0, only P1 is available -> P1 runs non-preemptively from 0 to 7. At time 7, P2, P3, P4 have arrived. Shortest among them is P3 (BT=1) -> P3 runs from 7 to 8. Next shortest is P2 (BT=4, arrived earlier than P4) -> P2 runs from 8 to 12. Finally P4 runs from 12 to 16. Gantt Chart: P1 [0-7], P3 [7-8], P2 [8-12], P4 [12-16]. Waiting Times: P1 = 0 - 0 = 0; P2 = 8 - 2 = 6; P3 = 7 - 4 = 3; P4 = 12 - 5 = 7. Average Waiting Time = (0 + 6 + 3 + 7) / 4 = 16 / 4 = 4 ms. Turnaround Times: P1 = 7 - 0 = 7; P2 = 12 - 2 = 10; P3 = 8 - 4 = 4; P4 = 16 - 5 = 11. Average Turnaround Time = (7 + 10 + 4 + 11) / 4 = 32 / 4 = 8 ms. Pros & Cons: Optimal average waiting time vs Long jobs suffer starvation; difficulty in predicting next CPU burst length.",
    interview: "Why can't SJF be implemented directly in general-purpose interactive operating systems? Because the operating system cannot know the exact length of the next CPU burst in advance! Instead, systems approximate SJF by predicting burst lengths using Exponential Smoothing: $\\tau_{n+1} = \\alpha t_n + (1 - \\alpha) \\tau_n$, where $t_n$ is the recent burst and $\\tau_n$ is the historical estimate.",
    mnemonic: "SJF: Smallest Jobs First. Optimal WT, but Long jobs Starve!",
    analogy: "Doctor's Clinic: Patients with quick prescriptions (2 mins) are seen before complex checkups (45 mins), keeping the waiting room chairs mostly empty.",
    mistakes: "Preempting P1 at time 2 when P2 arrives during non-preemptive SJF. In Non-Preemptive SJF, once P1 starts at time 0, it holds the CPU until its burst finishes at time 7!",
    examPoints: [
      "Prove that SJF scheduling gives the optimal average waiting time (5 Marks / SRM Slide 17).",
      "Solve the Non-preemptive SJF numerical with varied arrival times for P1(0,7), P2(2,4), P3(4,1), P4(5,4). Draw Gantt chart and compute Avg WT and TAT (10 Marks / SRM Slide 16).",
      "What is the major difficulty in implementing SJF in practice? (2 Marks)."
    ],
    numerical: {
      type: "sjf-nonpreemptive",
      problem: "P1 (AT 0, BT 7), P2 (AT 2, BT 4), P3 (AT 4, BT 1), P4 (AT 5, BT 4). Non-preemptive SJF.",
      gantt: [{ pid: "P1", start: 0, end: 7 }, { pid: "P3", start: 7, end: 8 }, { pid: "P2", start: 8, end: 12 }, { pid: "P4", start: 12, end: 16 }],
      wt: { P1: 0, P2: 6, P3: 3, P4: 7, avg: 4 },
      tat: { P1: 7, P2: 10, P3: 4, P4: 11, avg: 8 }
    }
  },
  {
    id: "srtf",
    title: "Shortest-Remaining-Time-First (SRTF / Preemptive SJF)",
    unit: 3,
    badge: "Preemptive Optimal",
    beginner: "You are doing a 10-minute puzzle. After 2 minutes, your teacher hands you a 1-minute worksheet. You immediately pause the puzzle, finish the 1-minute worksheet, and then return to your puzzle!",
    college: "Preemptive SJF scheduling is known as Shortest-Remaining-Time-First (SRTF). If a new process arrives with a CPU burst length shorter than the remaining execution time of the currently executing process, the CPU scheduler preempts the current process. SRM Slide 17 Example 3 (Same dataset as non-preemptive SJF): Processes: P1 (AT=0, BT=7), P2 (AT=2, BT=4), P3 (AT=4, BT=1), P4 (AT=5, BT=4). Step-by-Step Execution Trace: At time 0: P1 starts running (remaining: 7). At time 2: P2 arrives (BT=4). Remaining time of P1 is 7 - 2 = 5. Since P2 (4) < P1 (5), P1 is preempted! P2 begins running. At time 4: P3 arrives (BT=1). Remaining time of P2 is 4 - 2 = 2. Since P3 (1) < P2 (2), P2 is preempted! P3 begins running. At time 5: P3 completes! P4 arrives (BT=4). Ready processes: P2 (remaining 2), P4 (BT 4), P1 (remaining 5). P2 has shortest remaining time (2) -> P2 runs from 5 to 7 and finishes! At time 7: Remaining are P4 (4) and P1 (5). P4 runs from 7 to 11 and finishes! At time 11: P1 resumes its remaining 5 units, running from 11 to 16. Gantt Chart: P1 [0-2], P2 [2-4], P3 [4-5], P2 [5-7], P4 [7-11], P1 [11-16]. Waiting Times: P1 = (0 - 0) + (11 - 2) = 9; P2 = (2 - 2) + (5 - 4) = 1; P3 = 4 - 4 = 0; P4 = 7 - 5 = 2. Average Waiting Time = (9 + 1 + 0 + 2) / 4 = 12 / 4 = 3 ms (beating non-preemptive SJF's 4 ms!). Turnaround Times: P1 = 16 - 0 = 16; P2 = 7 - 2 = 5; P3 = 5 - 4 = 1; P4 = 11 - 5 = 6. Average Turnaround Time = (16 + 5 + 1 + 6) / 4 = 28 / 4 = 7 ms (beating non-preemptive SJF's 8 ms!).",
    interview: "SRTF is the theoretical golden standard for minimal average waiting time under varied arrival times. What is its cost? High context-switching overhead! Every preemption triggers context save/restore and CPU cache thrashing. In high-frequency arrival environments, SRTF can cause livelock.",
    mnemonic: "SRTF = Stop and Replace if Remaining is Tiny! P1 paused at 2, P2 paused at 4.",
    analogy: "Hospital Triage: An emergency surgeon treating a broken arm (P1) immediately pauses when a patient with a life-threatening 1-minute airway obstruction (P3) arrives, then returns to the broken arm.",
    mistakes: "Calculating P1's waiting time as just 11 - 0 = 11. Remember P1 ran from 0 to 2, so you must subtract the 2 units it already executed: WT = (0 - 0) + (11 - 2) = 9!",
    examPoints: [
      "Explain Shortest-Remaining-Time-First (SRTF) scheduling with a complete numerical problem and Gantt chart (10 Marks / SRM Slide 17 / Repeated Question).",
      "Compare Non-preemptive SJF and Preemptive SJF (SRTF) using the same arrival dataset (5 Marks).",
      "Why is Average Waiting Time lower in SRTF compared to Non-preemptive SJF? (2 Marks)."
    ],
    numerical: {
      type: "srtf",
      problem: "P1 (AT 0, BT 7), P2 (AT 2, BT 4), P3 (AT 4, BT 1), P4 (AT 5, BT 4). SRTF.",
      gantt: [
        { pid: "P1", start: 0, end: 2 },
        { pid: "P2", start: 2, end: 4 },
        { pid: "P3", start: 4, end: 5 },
        { pid: "P2", start: 5, end: 7 },
        { pid: "P4", start: 7, end: 11 },
        { pid: "P1", start: 11, end: 16 }
      ],
      wt: { P1: 9, P2: 1, P3: 0, P4: 2, avg: 3 },
      tat: { P1: 16, P2: 5, P3: 1, P4: 6, avg: 7 }
    }
  },
  {
    id: "priority-scheduling",
    title: "Priority Scheduling (Preemptive & Non-Preemptive, Aging)",
    unit: 3,
    badge: "Priority & Starvation",
    beginner: "An ambulance with emergency sirens gets top priority on the road—all regular cars pull over so it passes first. But if ambulances keep coming non-stop, regular cars would be stuck forever unless a police officer gives waiting cars a bonus turn (Aging)!",
    college: "A priority number (integer) is associated with each process. The CPU is allocated to the process with the highest priority. Standard textbook and SRM convention: Smallest integer = Highest priority (e.g. 1 is highest priority). Note: some systems reverse this, so always check problem definition. SJF is simply priority scheduling where priority is the inverse of predicted next CPU burst time. Types: Preemptive vs Non-Preemptive. SRM Slide 20 Non-Preemptive Example: Process A (BT 8, Priority 2), B (BT 1, Priority 1), C (BT 1, Priority 3). Highest priority is B (1), then A (2), then C (3). Gantt Chart: B [0-1], A [1-9], C [9-10]. Avg WT = (0 + 1 + 9) / 3 = 3.3 ms. SRM Slide 21-22 Preemptive 7-Process Problem (Here larger integer = higher priority as defined in slide table): Processes: P1 (P 2-low, AT 0, BT 4), P2 (P 4, AT 1, BT 2), P3 (P 6, AT 2, BT 3), P4 (P 10, AT 3, BT 5), P5 (P 8, AT 4, BT 1), P6 (P 12-high, AT 5, BT 4), P7 (P 9, AT 6, BT 6). Execution Trace & Gantt Chart: P1 [0-1], P2 [1-2], P3 [2-3], P4 [3-5], P6 [5-9], P4 [9-12], P7 [12-18], P5 [18-19], P3 [19-21], P2 [21-22], P1 [22-25]. Table results: Completion Times: P1=25, P2=22, P3=21, P4=12, P5=19, P6=9, P7=18. Turnaround Times (CT - AT): P1=25, P2=21, P3=19, P4=9, P5=15, P6=4, P7=12. Waiting Times (TAT - BT): P1=21, P2=19, P3=16, P4=4, P5=14, P6=0, P7=6. Major Problem = Starvation (Indefinite Blocking): Continuous arrival of higher-priority processes keeps lowest-priority processes waiting forever. Solution = Aging: A technique where the priority of waiting processes is gradually increased after fixed intervals of time (e.g., increase priority by 1 every 15 minutes).",
    interview: "FAANG classic: What is Priority Inversion? When a low-priority thread holds a mutex lock that a high-priority thread needs, and an intermediate medium-priority thread preempts the low-priority thread, effectively delaying the high-priority thread indefinitely! Solved by the Priority Inheritance Protocol (where the lock-holding low-priority thread temporarily inherits the highest waiting priority).",
    mnemonic: "Smallest int = Highest priority. Starvation Problem -> Aging Solution (Grow older, grow higher!).",
    analogy: "Theme Park FastPass: VIP ticket holders (high priority) cut in front of standard ticket holders. If VIPs arrive continuously, regular people starve in line until the park manager enforces Aging (advancing standard visitors after 30 minutes).",
    mistakes: "Always check whether the exam question specifies 'smallest integer = highest priority' or 'largest integer = highest priority'. In SRM Slide 20, 1 is highest; in SRM Slide 21, 12 is highest!",
    examPoints: [
      "Define Starvation in priority scheduling. How does the Aging technique resolve it? (5 Marks / SRM Slide 22 / Repeated University Question).",
      "Solve the 7-process preemptive priority scheduling problem with Gantt chart, CT, TAT, and WT (16 Marks / SRM Slide 21-22).",
      "Explain how SJF can be viewed as a special case of priority scheduling (2 Marks / Slide 19)."
    ],
    numerical: {
      type: "priority-preemptive",
      problem: "7 processes table from SRM Slide 21: P1(P2, AT0, BT4), P2(P4, AT1, BT2), P3(P6, AT2, BT3), P4(P10, AT3, BT5), P5(P8, AT4, BT1), P6(P12, AT5, BT4), P7(P9, AT6, BT6).",
      gantt: [
        { pid: "P1", start: 0, end: 1 },
        { pid: "P2", start: 1, end: 2 },
        { pid: "P3", start: 2, end: 3 },
        { pid: "P4", start: 3, end: 5 },
        { pid: "P6", start: 5, end: 9 },
        { pid: "P4", start: 9, end: 12 },
        { pid: "P7", start: 12, end: 18 },
        { pid: "P5", start: 18, end: 19 },
        { pid: "P3", start: 19, end: 21 },
        { pid: "P2", start: 21, end: 22 },
        { pid: "P1", start: 22, end: 25 }
      ],
      table: [
        { pid: "P1", priority: "2 (low)", at: 0, bt: 4, ct: 25, tat: 25, wt: 21 },
        { pid: "P2", priority: "4", at: 1, bt: 2, ct: 22, tat: 21, wt: 19 },
        { pid: "P3", priority: "6", at: 2, bt: 3, ct: 21, tat: 19, wt: 16 },
        { pid: "P4", priority: "10", at: 3, bt: 5, ct: 12, tat: 9, wt: 4 },
        { pid: "P5", priority: "8", at: 4, bt: 1, ct: 19, tat: 15, wt: 14 },
        { pid: "P6", priority: "12 (high)", at: 5, bt: 4, ct: 9, tat: 4, wt: 0 },
        { pid: "P7", priority: "9", at: 6, bt: 6, ct: 18, tat: 12, wt: 6 }
      ]
    }
  },
  {
    id: "round-robin",
    title: "Round Robin (RR) Scheduling & Time Quantum Analysis",
    unit: 3,
    badge: "Time-Sharing Classic",
    beginner: "A game of musical chairs where every child gets to play on the swing for exactly 20 seconds. When the timer beeps, they hop off, go to the end of the line, and the next child gets 20 seconds!",
    college: "In the Round Robin (RR) algorithm, designed specifically for time-sharing systems, each process gets a small unit of CPU time called a 'Time Quantum' (or time slice), typically 10 to 100 milliseconds. After this time has elapsed, the process is preempted and added to the tail of the ready queue. Performance Characteristics: If time quantum q is extremely large -> RR degenerates into FCFS policy. If time quantum q is extremely small -> q must be significantly greater than the context switch time; otherwise, context switch overhead dominates CPU time. SRM Slide 25 Example 1 (Time Quantum = 4): P1=24, P2=3, P3=3 arriving at time 0. Gantt Chart: P1 [0-4], P2 [4-7], P3 [7-10], P1 [10-14], P1 [14-18], P1 [18-22], P1 [22-26], P1 [26-30]. Waiting Times: P1 = (10 - 4) = 6; P2 = 4; P3 = 7. Average Waiting Time = (6 + 4 + 7) / 3 = 17 / 3 = 5.6 ms. Average TAT is larger than SJF, but provides much better responsiveness. SRM Slide 26 Example 2 (Time Quantum = 20): P1=53, P2=17, P3=68, P4=24. Gantt Chart: P1 [0-20], P2 [20-37], P3 [37-57], P4 [57-77], P1 [77-97], P3 [97-117], P4 [117-121], P1 [121-134], P3 [134-154], P3 [154-162]. Waiting Times: P1 = (0 - 0) + (77 - 20) + (121 - 97) = 81; P2 = 20 - 0 = 20; P3 = (37 - 0) + (97 - 57) + (134 - 117) = 94; P4 = (57 - 0) + (117 - 77) = 97. Average Waiting Time = (81 + 20 + 94 + 97) / 4 = 292 / 4 = 73 ms. Average Turnaround Time = (134 + 37 + 162 + 121) / 4 = 454 / 4 = 113.5 ms. SRM Slide 27 Context Switches vs Quantum (Process time = 10): Quantum = 12 -> 0 context switches; Quantum = 6 -> 1 context switch; Quantum = 1 -> 9 context switches!",
    interview: "Rule of thumb for selecting time quantum: About 80% of CPU bursts should be shorter than the time quantum q! If 80% finish within one quantum, most processes execute without preemption while maintaining high responsiveness for interactive tasks.",
    mnemonic: "RR = Fair Rotation. Large q = FCFS; Tiny q = Overhead Disaster (Context switch storm). 80% Rule!",
    analogy: "Chess Clock in Speed Chess: Each player gets 10 seconds per turn. If you haven't won after 10 seconds, your turn is paused and your opponent moves.",
    mistakes: "Ignoring context switch count when calculating real execution time. In real OS benchmarks, setting quantum too small (e.g. 1ms with 0.5ms context switch) wastes 33% of total CPU cycles on pure overhead!",
    examPoints: [
      "Explain Round Robin scheduling. How does the choice of time quantum affect its performance? (10 Marks / SRM Slide 24, 27).",
      "Solve RR problem with q=4 for P1(24), P2(3), P3(3). Compute Avg WT (5 Marks / SRM Slide 25).",
      "Solve RR problem with q=20 for P1(53), P2(17), P3(68), P4(24). Compute Avg WT and TAT (10 Marks / SRM Slide 26).",
      "Draw the diagram illustrating how time quantum relates to context switch frequency (5 Marks / SRM Slide 27)."
    ],
    numerical: {
      type: "round-robin",
      problem: "SRM Slide 26: P1(53), P2(17), P3(68), P4(24) with Time Quantum = 20.",
      gantt: [
        { pid: "P1", start: 0, end: 20 },
        { pid: "P2", start: 20, end: 37 },
        { pid: "P3", start: 37, end: 57 },
        { pid: "P4", start: 57, end: 77 },
        { pid: "P1", start: 77, end: 97 },
        { pid: "P3", start: 97, end: 117 },
        { pid: "P4", start: 117, end: 121 },
        { pid: "P1", start: 121, end: 134 },
        { pid: "P3", start: 134, end: 154 },
        { pid: "P3", start: 154, end: 162 }
      ],
      wt: { P1: 81, P2: 20, P3: 94, P4: 97, avg: 73 },
      tat: { P1: 134, P2: 37, P3: 162, P4: 121, avg: 113.5 }
    }
  },
  {
    id: "multilevel-queue",
    title: "Multilevel Queue Scheduling",
    unit: 3,
    badge: "Partitioned Queues",
    beginner: "At an airport check-in, there are separate lines: 1st Class Passengers, Business Class, Economy, and Baggage Drop. Each line has its own dedicated rules and priority!",
    college: "Multilevel Queue Scheduling is used when processes can be readily classified into distinct groups. For example, a common division is made between foreground (interactive) processes and background (batch) processes. These two types have different response-time requirements and scheduling needs. The ready queue is partitioned into separate queues, each with its own scheduling algorithm: e.g., Foreground queue scheduled via Round Robin (80% of CPU time), and Background queue scheduled via FCFS (20% of CPU time). In addition, there must be scheduling among the queues, typically fixed-priority preemptive scheduling. SRM Slide 29 Five-Level Hierarchy: 1. System Processes (highest priority), 2. Interactive Processes, 3. Interactive Editing Processes, 4. Batch Processes, 5. Student Processes (lowest priority). No process in a lower-priority queue can execute while any higher-priority queue has runnable processes. Disadvantage: Rigid partition; processes cannot move between queues, leading to starvation of lower-priority queues.",
    interview: "What happens if a background batch job turns into an interactive process? In strict Multilevel Queue, it cannot adapt because queue assignment is permanently fixed at process creation. This fundamental limitation led directly to the development of Multilevel Feedback Queues.",
    mnemonic: "5 Queues: S-I-E-B-S -> System, Interactive, Editing, Batch, Student (High to Low).",
    analogy: "Bank Queues: Queue 1 = VIP Wealth Management (Always served first). Queue 2 = Personal Banking. Queue 3 = Bulk Corporate Cash Deposits (Batch).",
    mistakes: "Thinking processes can jump between queues in Multilevel Queue Scheduling. In basic Multilevel Queue, a process is permanently assigned to one queue upon entry!",
    examPoints: [
      "Describe Multilevel Queue Scheduling. Draw the five-queue priority hierarchy (10 Marks / SRM Slide 28-29).",
      "How is CPU time divided between foreground and background queues? (2 Marks / Slide 28).",
      "What is the primary drawback of fixed-priority multilevel queue scheduling? (2 Marks)."
    ],
    diagram: "multilevel-queue-hierarchy"
  },
  {
    id: "multilevel-feedback-queue",
    title: "Multilevel Feedback Queue Scheduling",
    unit: 3,
    badge: "Adaptive Scheduling",
    beginner: "A game where you start at Level 1 with 8 seconds. If you beat the level fast, you leave happy! If you need more time, you drop down to Level 2 with 16 seconds. If you still take forever, you drop to the slow walk line (FCFS)!",
    college: "In Multilevel Feedback Queue (MLFQ) scheduling, unlike simple multilevel queue scheduling, a process can move between the various queues. The idea is to separate processes according to the characteristics of their CPU bursts. If a process uses too much CPU time, it is demoted to a lower-priority queue. If a process waits too long in a lower-priority queue, it can be aged and promoted to a higher-priority queue. SRM Slide 30 Architecture: 1. Queue Q0: Round Robin with time quantum = 8 milliseconds. A newly arrived job enters Q0. When it gains the CPU, it receives 8 ms. If it finishes within 8 ms, it terminates. If it does not finish, it is preempted and moved to the tail of Queue Q1. 2. Queue Q1: Round Robin with time quantum = 16 milliseconds. A Q1 job receives 16 ms of CPU time. If it still does not complete, it is preempted and demoted to Queue Q2. 3. Queue Q2: First-Come, First-Served (FCFS). Runs only when Q0 and Q1 are empty. This gives high priority to short interactive I/O-bound jobs while letting long CPU-bound jobs sink to background FCFS.",
    interview: "MLFQ is considered the most general and complex CPU scheduling algorithm. What 5 parameters define an MLFQ? 1. Number of queues, 2. Scheduling algorithm for each queue, 3. Method used to determine when to upgrade a process to a higher queue (aging), 4. Method used to determine when to demote a process to a lower queue, 5. Method used to determine which queue a process will enter upon arrival.",
    mnemonic: "Q0 (RR q=8) -> Demote -> Q1 (RR q=16) -> Demote -> Q2 (FCFS). Aging promotes upward!",
    analogy: "Customer Support Desk: Tier 1 handles quick 2-minute questions (Q0). If complicated, escalated to Tier 2 specialist for 15 minutes (Q1). If requires deep engineering rework, sent to engineering ticket backlog (Q2 FCFS).",
    mistakes: "Assuming MLFQ prevents CPU starvation without an aging mechanism. If new short jobs constantly arrive in Q0, jobs in Q2 will starve unless an aging timer periodically pushes Q2 jobs back into Q0!",
    examPoints: [
      "Explain the working of Multilevel Feedback Queue (MLFQ) scheduling with a neat queue transition diagram (10 Marks / SRM Slide 30 / Repeated Question).",
      "Trace the path of a new process with burst time 30 ms entering Q0 (q=8), Q1 (q=16), and Q2 (FCFS) (5 Marks).",
      "List the parameters required to define a multilevel feedback queue scheduler (5 Marks)."
    ],
    diagram: "mlfq-flow"
  },
  {
    id: "realtime-scheduling",
    title: "Real-Time CPU Scheduling: Latencies & Models",
    unit: 3,
    badge: "Mission-Critical OS",
    beginner: "A movie video player is Soft Real-Time: if a frame drops by 10 milliseconds, the picture stutters slightly but you survive. An airplane flight autopilot or airbag deployment is Hard Real-Time: if it deploys 10 milliseconds too late, catastrophe happens!",
    college: "Real-time operating systems require meeting timing constraints: 1. Soft Real-Time Systems: Provide no strict guarantee as to when a critical real-time process will be scheduled; they guarantee only that the process will be given preference over non-critical processes. 2. Hard Real-Time Systems: Have strict deadlines. A task MUST be serviced by its deadline; service delivered after the deadline has expired is equivalent to NO service at all. Performance-Affecting Latencies: (a) Interrupt Latency: The time elapsed from the arrival of an interrupt to the start of the Interrupt Service Routine (ISR) servicing it (includes determining interrupt type and context switch). (b) Dispatch Latency: The time for the scheduler to stop the currently running process and switch to another. Conflict Phase of Dispatch Latency: Involves two components: 1. Preemption of any process running in kernel mode, 2. Release by low-priority processes of resources needed by high-priority processes. Process Characteristics Model: Periodic processes require the CPU at specified recurring intervals (periods). $p$ = duration of period, $d$ = deadline by when process must be completed, $t$ = processing time (CPU burst). Relationship: $0 \\le t \\le d \\le p$. CPU Utilization of process $P_i = t_i / p_i$.",
    interview: "How do modern Linux kernels (with PREEMPT_RT patch) achieve low dispatch latency for hard real-time tasks? By making kernel interrupt handlers threaded, making spinlocks preemptible sleep locks, and implementing priority inheritance across all kernel synchronization primitives.",
    mnemonic: "Real-Time Latency = Interrupt Latency + Dispatch Latency (Conflict Phase + Dispatch). Constraint: $0 \\le t \\le d \\le p$.",
    analogy: "Automobile Airbag: Sensor detects crash (Interrupt). Controller stops radio software, preempts ABS computer (Conflict Phase), fires chemical explosive in 5ms (Hard Real-Time Deadline). Delivering airbag at 500ms is useless.",
    mistakes: "Thinking dispatch latency is just saving registers. In real-time systems, the Conflict Phase (waiting for low-priority tasks to release held kernel resources) dominates dispatch latency!",
    examPoints: [
      "Differentiate between Soft Real-Time and Hard Real-Time systems (5 Marks / SRM Slide 31).",
      "Explain Interrupt Latency and Dispatch Latency with timing event diagrams (10 Marks / SRM Slide 32-33).",
      "What are the two components of the conflict phase in dispatch latency? (2 Marks / SRM Slide 33).",
      "Define periodic real-time task parameters: p, d, t, and state their mathematical relationship (2 Marks / SRM Slide 35)."
    ],
    diagram: "realtime-latencies"
  },
  {
    id: "rate-monotonic-scheduling",
    title: "Rate Monotonic Scheduling (RMS) & Numerical Analysis",
    unit: 3,
    badge: "Static Priority Real-Time",
    beginner: "The faster a task repeats, the higher its VIP rank! If Task A arrives every 50 seconds and Task B arrives every 100 seconds, Task A gets higher priority because its period is shorter!",
    college: "Rate Monotonic Scheduling (RMS) schedules periodic tasks using a static priority policy with preemption. Upon entering the system, each periodic task is assigned a priority inversely proportional to its period length: Shorter periods = Higher priority; Longer periods = Lower priority. Rationale: Tasks that require the CPU more frequently are given higher priority. RMS assumes that the processing time $t_i$ of a periodic process is constant for each CPU burst. SRM Slide 38-40 Numerical Example 1 (Successful Scheduling): Process P1: period $p_1 = 50$, burst $t_1 = 20$. Process P2: period $p_2 = 100$, burst $t_2 = 35$. Deadlines: end of current period. CPU Utilizations: $U(P_1) = 20 / 50 = 0.40$ (40%); $U(P_2) = 35 / 100 = 0.35$ (35%). Total Utilization = 0.75 (75% <= 100%). Why Not Traditional Priority? If P2 were assigned higher priority than P1: P2 runs from 0 to 35. P1 starts at 35 and finishes at 35 + 20 = 55. But P1's deadline was 50! P1 misses its deadline! With RMS (P1 has shorter period 50 < 100, so P1 gets higher priority): P1 runs from 0 to 20 (meets deadline at 50). P2 starts at 20 and runs until 50 (30 ms executed, 5 ms remaining). At time 50, P1 begins its 2nd period and preempts P2! P1 runs from 50 to 70 (meets 2nd deadline at 100). At 70, P2 resumes and finishes its remaining 5 ms at time 75 (well before its deadline at 100!). Both tasks meet all deadlines! SRM Slide 41-42 Example 2 (Missed Deadline with RMS): Process P1: $p_1 = 50, t_1 = 25$. Process P2: $p_2 = 80, t_2 = 35$. Total Utilization = $25/50 + 35/80 = 0.50 + 0.4375 = 0.9375$ (94%). Under RMS, P1 has higher priority (50 < 80). Trace: P1 runs 0 to 25. P2 runs 25 to 50 (25 ms executed, 10 ms remaining). At 50, P1 preempts P2 and runs 50 to 75. At 75, P2 resumes its remaining 10 ms, finishing at time 85. But P2's deadline was at time 80! P2 misses its deadline despite total utilization being only 94%!",
    interview: "State the Liu and Layland upper bound for RMS: A set of $m$ periodic processes is guaranteed schedulable under RMS if total CPU utilization satisfies: $U = \\sum_{i=1}^m \\frac{t_i}{p_i} \\le m(2^{1/m} - 1)$. For $m=2$, bound is $2(\\sqrt{2} - 1) \\approx 82.8\\%$. In Example 2, utilization was 94% > 82.8%, which explains why RMS failed!",
    mnemonic: "RMS: Short Period = High Priority. Static Priority. Fails when $U > m(2^{1/m} - 1)$.",
    analogy: "Clock Chimes: The clock chime that rings every 15 minutes (short period) must interrupt the clock chime that rings once an hour (long period); otherwise the 15-minute chime is always late.",
    mistakes: "Assuming RMS can achieve 100% CPU utilization. Because RMS uses static priorities, CPU utilization is bounded below 100% (approaching $\\ln 2 \\approx 69.3\\%$ as $m \\to \\infty$).",
    examPoints: [
      "Explain the Rate Monotonic Scheduling (RMS) algorithm and priority assignment policy (5 Marks / SRM Slide 37).",
      "Solve the RMS scheduling problem for P1 (p=50, t=20) and P2 (p=100, t=35). Show why assigning higher priority to P2 causes deadline failure (10 Marks / SRM Slide 38-40).",
      "Demonstrate with a Gantt chart how RMS causes a missed deadline for P1 (p=50, t=25) and P2 (p=80, t=35) (10 Marks / SRM Slide 41-42)."
    ],
    numerical: {
      type: "rms-success",
      problem: "P1 (p=50, t=20) and P2 (p=100, t=35). Total U = 75%.",
      gantt: [
        { pid: "P1", start: 0, end: 20 },
        { pid: "P2", start: 20, end: 50 },
        { pid: "P1", start: 50, end: 70 },
        { pid: "P2", start: 70, end: 75 }
      ],
      note: "Both P1 and P2 meet their deadlines under RMS."
    }
  },
  {
    id: "earliest-deadline-first",
    title: "Earliest Deadline First (EDF) Scheduling",
    unit: 3,
    badge: "Dynamic Priority Optimal",
    beginner: "Whichever homework assignment is due soonest on the calendar gets done first! As due dates change dynamically, your priorities automatically shuffle so you never miss an assignment!",
    college: "Earliest Deadline First (EDF) dynamically assigns priorities according to deadline: The earlier the deadline, the higher the priority; the later the deadline, the lower the priority. Under EDF, when a process becomes runnable, it announces its deadline to the system. Priorities are dynamically adjusted to reflect newly runnable processes. Unlike RMS, EDF does NOT require processes to be periodic, nor must processes require constant CPU burst durations. Theoretical Appeal: EDF is theoretically optimal—theoretically, it can schedule processes so that each meets its deadlines with CPU utilization reaching 100%! SRM Slide 43-45 Numerical Example (Solving the RMS Failure Case): Processes: P1 ($p_1=50, t_1=25$) and P2 ($p_2=80, t_2=35$). Under RMS, P2 missed its deadline at 80. Under EDF: At time 0: P1's deadline is 50, P2's deadline is 80. Earlier deadline is P1 (50) -> P1 runs 0 to 25 and completes 1st burst. At time 25: P2 begins running. At time 50: P1's second period begins with deadline 100. P2's current deadline is 80! Since 80 < 100, P2 has HIGHER priority than P1 under EDF! P2 continues running uninterrupted until time 60, meeting its first deadline at 80! At time 60: P1 starts its second burst and runs from 60 to 85, meeting its deadline at 100. At time 85: P2 begins its second period (deadline 160). At time 100: P1 begins third period with deadline 150. Since 150 < 160, P1 preempts P2 at 100 and runs 100 to 125, meeting its deadline at 150. At time 125: P2 resumes its remaining burst and completes at time 145, meeting its deadline at 160! System is idle from 145 to 150, when P1 arrives again. Both P1 and P2 meet all deadlines successfully!",
    interview: "Why can't real-world systems achieve 100% utilization with EDF in practice? Due to context switching overhead, timer interrupt handling latency, and domino-effect thrashing under overload (if one process misses a deadline under EDF, it can cause all subsequent tasks to cascade and miss deadlines).",
    mnemonic: "EDF: Earliest Deadline First. Dynamic Priority. 100% Optimal Utilization!",
    analogy: "Student Exam Week: Monday exam studied first; as soon as Monday finishes, Tuesday exam gets highest priority, regardless of which subject course is longer.",
    mistakes: "Assuming priorities in EDF remain constant like in RMS. In EDF, priorities are strictly DYNAMIC: P1 had higher priority from 0-25, but P2 had higher priority from 50-60 because its deadline was earlier!",
    examPoints: [
      "Explain Earliest Deadline First (EDF) scheduling and contrast it with Rate Monotonic Scheduling (10 Marks / SRM Slide 43-45).",
      "Trace the EDF execution of P1 (p=50, t=25) and P2 (p=80, t=35) with a Gantt chart showing how both meet deadlines (10 Marks / SRM Slide 44-45).",
      "Why is EDF considered theoretically optimal? Why is 100% utilization impossible in practice? (5 Marks)."
    ],
    numerical: {
      type: "edf",
      problem: "P1 (p=50, t=25) and P2 (p=80, t=35). EDF Gantt chart.",
      gantt: [
        { pid: "P1", start: 0, end: 25 },
        { pid: "P2", start: 25, end: 60 },
        { pid: "P1", start: 60, end: 85 },
        { pid: "P2", start: 85, end: 100 },
        { pid: "P1", start: 100, end: 125 },
        { pid: "P2", start: 125, end: 145 },
        { pid: "IDLE", start: 145, end: 150 }
      ],
      note: "At time 50, P2 continues running because its deadline (80) is earlier than P1's next deadline (100)."
    }
  },
  {
    id: "deadlocks-intro",
    title: "Deadlocks Definition & System Model",
    unit: 3,
    badge: "Deadlock Fundamentals",
    beginner: "A four-way traffic gridlock where car A blocks car B, car B blocks car C, car C blocks car D, and car D blocks car A. Nobody can move forward, nobody can reverse, and everyone is permanently stuck!",
    college: "Deadlock Definition: In a multiprogramming environment, several processes may compete for a finite number of resources. A process requests resources; if the resources are not available at that time, the process enters a waiting state. A deadlock state occurs when two or more processes are waiting indefinitely for an event that can be caused only by one of the waiting processes. SRM Slide 47 Example: Assume two processes P1 and P2, and two resources R1 and R2. Process P1 is holding resource R1 and requesting resource R2. Process P2 is holding resource R2 and requesting resource R1. Neither process can proceed; this state is DEADLOCK. System Model: A system consists of a finite number of resources to be distributed among competing processes. Resource types $R_1, R_2, \\dots, R_m$ (e.g. CPU cycles, memory space, I/O devices). Each resource type $R_i$ has $W_i$ instances. Resource Utilization Cycle: A process utilizes a resource in only the following sequence: 1. Request: The process requests the resource. If available, grant resource; else wait. 2. Use: The process operates on the resource. 3. Release: The process releases the resource.",
    interview: "Deadlock vs Starvation vs Livelock: Deadlock = Processes are blocked waiting for events that will never occur (zero CPU consumed). Starvation = Process is ready to run but repeatedly bypassed by scheduler (waiting indefinitely). Livelock = Processes actively change their state in response to each other without making any forward progress (consuming 100% CPU).",
    mnemonic: "Deadlock: P1 holds R1 wants R2; P2 holds R2 wants R1. Cycle: Request -> Use -> Release.",
    analogy: "Traffic Gridlock: Four cars enter an intersection simultaneously from North, South, East, and West, each blocking the bumper of the car ahead.",
    mistakes: "Confusing deadlock with a slow-running program. A deadlocked process will NEVER finish, no matter how many hours or CPU cores you give it, until the circular dependency is severed.",
    examPoints: [
      "Define Deadlock with an illustrative example (2 Marks / SRM Slide 46-47).",
      "Describe the resource utilization model: Request, Use, and Release (5 Marks / SRM Slide 48).",
      "Draw the traffic intersection analogy of a deadlock (2 Marks / SRM Slide 47)."
    ],
    diagram: "deadlock-basic-model"
  },
  {
    id: "deadlock-characterization",
    title: "The Four Necessary Deadlock Conditions",
    unit: 3,
    badge: "Coffman Conditions (SRM Must-Know)",
    beginner: "For a complete deadlock to occur, four things must happen all at the same time: 1. Only one person can hold the toy (Mutual Exclusion), 2. You refuse to let go of your toy while begging for another (Hold and Wait), 3. Nobody is allowed to yank the toy from your hand (No Preemption), and 4. You form a closed waiting circle with your friends (Circular Wait)!",
    college: "A deadlock condition can arise if and only if all four conditions hold simultaneously in a system (SRM Slide 49 / Coffman Conditions): 1. Mutual Exclusion: At least one resource must be held in a non-sharable mode. Only one process at a time can use the resource. If another process requests that resource, the requesting process must be delayed until the resource is released. 2. Hold and Wait: A process must be holding at least one resource and concurrently waiting to acquire additional resources that are currently being held by other processes. 3. No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it after that process has completed its task. 4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain: There exists a set $\\{P_0, P_1, \\dots, P_n\\}$ of waiting processes such that $P_0$ is waiting for a resource held by $P_1$, $P_1$ is waiting for a resource held by $P_2$, $\\dots$, $P_{n-1}$ is waiting for a resource held by $P_n$, and $P_n$ is waiting for a resource held by $P_0$.",
    interview: "Why are these conditions called 'necessary' rather than 'sufficient'? Because having all four conditions present guarantees deadlock only in single-instance resource systems. In multiple-instance resource systems, all 4 conditions can be present (including a cycle) without deadlock occurring if outside processes can release instances to break the cycle!",
    mnemonic: "M-H-N-C -> 'Must Have New Computers' -> Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
    analogy: "Single Restroom: Mutual Exclusion = 1 person inside. Hold and Wait = You stand in line holding the only roll of toilet paper. No Preemption = Security cannot drag you out. Circular Wait = Person inside needs the paper you hold, while you need the room they occupy.",
    mistakes: "Thinking deadlock occurs if only 2 or 3 conditions hold. Deadlock CANNOT occur if even a single one of these four conditions is broken!",
    examPoints: [
      "State and explain the four necessary conditions for deadlock to occur (10 Marks / Repeated SRM University Question / Slide 49).",
      "Explain the Circular Wait condition with a mathematical expression (5 Marks / Slide 49).",
      "Can deadlock arise if only three conditions are satisfied? Justify (2 Marks)."
    ]
  },
  {
    id: "resource-allocation-graph",
    title: "Resource Allocation Graph (RAG) & Cycles",
    unit: 3,
    badge: "Graph Theory & SRM Examples",
    beginner: "A map of who has what: Circles are people (Processes), Boxes are items (Resources). An arrow from person to box means 'I want that!' An arrow from box to person means 'I own that!' If the arrows form a closed circle loop, everyone might be trapped in a deadlock!",
    college: "Deadlocks can be described precisely in terms of a directed graph called a Resource Allocation Graph (RAG). A RAG consists of a set of vertices V partitioned into two types: Processes $P = \\{P_1, P_2, \\dots, P_n\\}$ (represented as circles) and Resource types $R = \\{R_1, R_2, \\dots, R_m\\}$ (represented as rectangles). The number of dots inside a resource rectangle indicates the number of instances of that resource type. Directed Edges: 1. Request Edge: Directed edge from process to resource ($P_i \\to R_j$), signifying that $P_i$ has requested an instance of $R_j$ and is currently waiting. 2. Assignment Edge: Directed edge from resource instance dot to process ($R_j \\to P_i$), signifying that an instance of $R_j$ has been allocated to $P_i$. RAG Cycle Theorems: 1. If the resource-allocation graph contains NO cycles, then the system is definitely NOT in a deadlock state. 2. If the graph contains a cycle: (a) If each resource type has exactly ONE instance, then a cycle implies a DEADLOCK (necessary and sufficient condition!). (b) If resource types have MULTIPLE instances, a cycle does NOT necessarily imply a deadlock. SRM Slide 52 Example 1 (Deadlock RAG): Processes $P = \\{P_1, P_2, P_3\\}$, Resources $R = \\{R_1, R_2, R_3, R_4\\}$. Edges: $P_1 \\to R_1, P_2 \\to R_3, R_1 \\to P_2, R_2 \\to P_2, R_2 \\to P_1, R_3 \\to P_3$. Two cycles exist: $P_1 \\to R_1 \\to P_2 \\to R_3 \\to P_3 \\to R_2 \\to P_1$ and $P_2 \\to R_3 \\to P_3 \\to R_2 \\to P_2$. Since $R_1, R_3$ have only 1 instance and both are locked in cycle, DEADLOCK EXISTS! SRM Slide 52 Example 2 (Cycle but NO Deadlock): Processes $P_1, P_2, P_3, P_4$. Resources $R_1$ (2 instances), $R_2$ (2 instances). Edges: $P_1 \\to R_1, R_1 \\to P_2, R_1 \\to P_3, P_3 \\to R_2, R_2 \\to P_1, R_2 \\to P_4$. Cycle exists: $P_1 \\to R_1 \\to P_3 \\to R_2 \\to P_1$. However, this is NOT a deadlock! Process $P_4$ holds $R_2$ but is not waiting for anything; $P_4$ completes and releases $R_2$. Similarly $P_2$ finishes and releases $R_1$, breaking the cycle!",
    interview: "Given an arbitrary multi-instance RAG, how do you determine if a deadlock exists algorithmically? By performing Graph Reduction! Find a process $P_i$ whose requests can be fully satisfied by currently available unallocated resource dots. Erase $P_i$ and return its held assignment edges to the available pool. Repeat. If all processes can be erased, the graph is fully reducible and NO deadlock exists. If un-reducible nodes remain, those nodes are deadlocked!",
    mnemonic: "Request = Circle to Box ($P \\to R$). Assignment = Box to Circle ($R \\to P$). Single instance cycle = Deadlock; Multi instance cycle = Maybe Deadlock.",
    analogy: "Office Equipment: Person A holds Printer, wants Scanner. Person B holds Scanner, wants Printer (Single instance loop = Deadlock). But if the office has 2 Scanners and Person C holds the 2nd scanner and is almost finished, Person C releases it, saving Person A!",
    mistakes: "Stating that a cycle always implies deadlock. In multi-instance resource systems, a cycle does NOT guarantee deadlock (as proven in SRM Slide 52 Example 2)!",
    examPoints: [
      "Define Resource Allocation Graph. Explain request and assignment edges with diagrams (5 Marks / SRM Slide 50-51).",
      "Draw a Resource Allocation Graph that contains a cycle and IS deadlocked (5 Marks / SRM Slide 52).",
      "Draw a Resource Allocation Graph that contains a cycle but is NOT deadlocked, and explain why (5 Marks / SRM Slide 52 / Repeated Question).",
      "State the cycle vs deadlock rules for single-instance vs multiple-instance resources (2 Marks)."
    ],
    diagram: "rag-deadlock-vs-cycle"
  },
  {
    id: "deadlock-handling",
    title: "Methods for Handling Deadlocks",
    unit: 3,
    badge: "Three OS Strategies",
    beginner: "How to deal with monsters under the bed: 1. Pretend they don't exist (Ostrich Algorithm), 2. Build a high wall so they never enter (Prevention & Avoidance), 3. Let them in, sound an alarm, and chase them away with a broom (Detection & Recovery)!",
    college: "Operating systems handle deadlocks using one of three primary strategies (SRM Slide 53): 1. Ignore Deadlocks: Pretend that deadlocks never occur in the system at all. Most operating systems (including Linux, Windows, and macOS) employ this strategy (often called the 'Ostrich Algorithm') because deadlock prevention, avoidance, and detection incur high runtime overhead compared to the infrequent occurrence of deadlocks; the OS leaves deadlock resolution to user application restarts. 2. Ensure Deadlock Never Occurs: (a) Deadlock Prevention: Provide a set of methods to ensure that at least one of the four necessary conditions (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) CANNOT hold. (b) Deadlock Avoidance: Allow all deadlock conditions to hold, but require additional a priori information concerning which resources a process will request; the OS dynamically tracks resource allocation states to ensure the system never enters an unsafe state. 3. Allow Deadlock to Occur, Detect and Recover: Allow the system to enter a deadlocked state, periodically invoke a Deadlock Detection algorithm, and execute a Recovery scheme to regain resources.",
    interview: "Why do modern commercial OS kernels choose the Ostrich algorithm over Banker's algorithm? In general-purpose systems, processes do not declare their maximum future resource claims in advance. Enforcing dynamic safe-state checks on every memory or file allocation would severely degrade system throughput by 30-50% for an event that occurs once every few months.",
    mnemonic: "3 Methods: 1. Ignore (Ostrich / Most OS), 2. Prevent/Avoid (Never happen), 3. Detect & Recover (Fix after fact).",
    analogy: "Health Care: 1. Ignore = Ignore small sniffles. 2. Prevention = Wash hands constantly so germs never enter. 3. Detection & Recovery = Go to doctor when sick, get diagnosis, take antibiotics.",
    mistakes: "Thinking Windows or Linux run Banker's algorithm automatically. Most real-world OSs completely ignore deadlocks due to performance costs!",
    examPoints: [
      "Describe the three methods for handling deadlocks in operating systems (5 Marks / SRM Slide 53).",
      "What is the Ostrich algorithm? Why do most modern operating systems use it? (2 Marks).",
      "Differentiate between Deadlock Prevention and Deadlock Avoidance (5 Marks)."
    ]
  },
  {
    id: "deadlock-prevention",
    title: "Deadlock Prevention: Negating the 4 Conditions",
    unit: 3,
    badge: "Prevention Protocols",
    beginner: "If a fire needs heat, fuel, and oxygen to burn, splashing water removes heat so fire CANNOT exist. Deadlock Prevention removes one required condition so deadlocks are mathematically impossible!",
    college: "Deadlock Prevention guarantees that deadlocks cannot occur by constraining how requests are made, ensuring that at least one of the four necessary conditions is negated (SRM Slide 54-55): 1. Mutual Exclusion: Must hold for non-sharable resources (e.g. printers). Sharable resources do not require mutually exclusive access and thus cannot be involved in a deadlock (e.g., read-only files can be accessed concurrently by any number of users). Negation verdict: Prevention not possible for non-sharable physical hardware devices. 2. Hold and Wait: Must guarantee that whenever a process requests a resource, it does not hold any other resources. Protocol 1: Require each process to request and be allocated all its resources before execution begins. Protocol 2: Allow a process to request resources only when it holds none (must release all current resources before requesting new ones). Drawbacks: Low resource utilization (resources held idle for long periods) and Starvation (processes needing popular resources wait forever). 3. No Preemption: If a process holding some resources requests another resource that cannot be immediately allocated, then ALL resources currently held by that process are preempted (implicitly released). The process will be restarted only when it can regain its old resources along with the new ones. 4. Circular Wait: Define a one-to-one total ordering function $F: R \\to N$ mapping all resource types to natural numbers. Protocol: Each process can request resources only in strictly increasing order of enumeration: $F(R_j) > F(R_i)$. Example: $F(\\text{tape drive}) = 1, F(\\text{disk drive}) = 5, F(\\text{printer}) = 12$. A process holding a tape drive can request a disk drive (5 > 1), but can NEVER request a tape drive while holding a disk drive unless it releases the disk drive first! This mathematically eliminates all circular wait cycles.",
    interview: "Mathematical proof that Resource Ordering eliminates Circular Wait: Assume a circular wait exists: $P_0 \\to P_1 \\to \\dots \\to P_n \\to P_0$. Let $R_i$ be the resource held by $P_i$. By protocol, each process requests resources with strictly increasing indices: $F(R_0) < F(R_1) < \\dots < F(R_n) < F(R_0)$. This implies $F(R_0) < F(R_0)$, which is a strict mathematical contradiction! Hence, circular wait is impossible.",
    mnemonic: "Negate 4: ME (Sharable files), H&W (Collect all at start), NP (Forced preemption), CW (Total ordering $F(R_j) > F(R_i)$).",
    analogy: "Bank Safe Deposit Boxes: Box 1 must be unlocked before Box 5, which must be unlocked before Box 12. You are never allowed to go backwards from 12 to 1, preventing any circular hostage situations between lockboxes.",
    mistakes: "Thinking Hold and Wait prevention is efficient. Forcing a program to allocate all tape drives, printers, and disks at startup keeps them locked idle for hours, drastically reducing system throughput.",
    examPoints: [
      "Explain how deadlock can be prevented by invalidating each of the four necessary conditions (10 Marks / SRM Slide 54-55 / Repeated SRM Question).",
      "Explain the Circular Wait prevention method using resource ordering function F: R -> N with an example (5 Marks / SRM Slide 55).",
      "What are the disadvantages of the Hold and Wait prevention protocols? (2 Marks)."
    ]
  },
  {
    id: "deadlock-avoidance-safe-state",
    title: "Deadlock Avoidance & Safe State Theory",
    unit: 3,
    badge: "Safe vs Unsafe vs Deadlock",
    beginner: "A careful bank manager: if 3 people ask for loans, the bank manager only approves a loan if there is enough emergency cash left in the vault to guarantee at least one person can finish their project and pay back their entire loan!",
    college: "Deadlock Avoidance requires additional a priori information about how resources are to be requested (e.g. maximum resource requirements declared in advance). Safe State Definition: A state is safe if the system can allocate resources to each process (up to its declared maximum) in some order and still avoid a deadlock. More formally, a system is in a safe state only if there exists a 'Safe Sequence' $\\langle P_1, P_2, \\dots, P_n \\rangle$. A sequence is safe if, for each $P_i$, the maximum resources that $P_i$ can still request can be satisfied by currently available resources plus resources already held by all preceding processes $P_j$ ($j < i$). Venn Diagram Relationship (SRM Slide 57): SAFE is a subset of UNSAFE. DEADLOCK is a subset of UNSAFE. Crucial Principle: 'All deadlocks are unsafe, but all unsafes are NOT deadlocks! In an unsafe state, only with luck do processes avoid deadlock; the OS can guarantee deadlock avoidance only by remaining strictly within safe states.' SRM Slide 59-60 Single Resource Table Example: Total resources = 12. Three processes A, B, C. Initial State: Process A (Has 3, Max 9), B (Has 2, Max 4), C (Has 2, Max 7). Total allocated = 3 + 2 + 2 = 7. Free resources = 12 - 7 = 5 (or 3 in slide variant). State is SAFE because sequence $\\langle B, C, A \\rangle$ can complete. If A requests 1: Free drops to 2 -> UNSAFE! (Not granted!). If B requests 1: Free drops to 2 -> SAFE! (Granted!). If C requests 1: Free drops to 2 -> SAFE! (Granted!). Avoidance Algorithms: For single instance of each resource type -> Resource Allocation Graph with Claim Edges. For multiple instances -> Banker's Algorithm.",
    interview: "Draw the Venn diagram showing Safe, Unsafe, and Deadlock states. Explain why entering an unsafe state does not immediately deadlock the system: An unsafe state means the system has lost the guarantee that it can satisfy maximum claims. If processes terminate early without claiming their declared maximums, the system may escape without deadlocking.",
    mnemonic: "Safe State = Safe Sequence exists. Deadlock $\\subset$ Unsafe. All deadlocks are unsafe, but NOT all unsafes are deadlocks!",
    analogy: "Mountain Climbing Rope: A safe route guarantees anchors hold all climbers. An unsafe route has unstable snow: you might cross safely if nobody slips, but one misstep triggers an avalanche (deadlock).",
    mistakes: "Equating an Unsafe state with a Deadlock state. An unsafe state is NOT necessarily a deadlock; it is merely a vulnerable state that has the potential to lead to deadlock!",
    examPoints: [
      "Define Safe State and Safe Sequence (2 Marks / SRM Slide 58).",
      "Draw the Venn diagram illustrating the relationship between Safe, Unsafe, and Deadlock states (5 Marks / SRM Slide 57).",
      "Explain the single resource type deadlock avoidance example with Free resources and grant decisions (5 Marks / SRM Slide 59-60)."
    ],
    diagram: "safe-unsafe-deadlock-venn"
  },
  {
    id: "rag-claim-edges",
    title: "Resource Allocation Graph with Claim Edges",
    unit: 3,
    badge: "Avoidance for Single Instances",
    beginner: "A dashed line on a map means 'I might travel this road in the future'. When you actually walk on it, the dashed line turns solid. If drawing that dashed line could create a trap loop, the guard stops you from walking!",
    college: "When a system has only a single instance of each resource type, deadlock avoidance can be achieved using an extended Resource Allocation Graph incorporating a new type of edge: the Claim Edge (SRM Slide 61-62). Claim Edge ($P_i \\dashrightarrow R_j$): A directed dashed edge indicating that process $P_i$ may request resource $R_j$ at some point in the future. Lifecycle of Edges: 1. A claim edge $P_i \\dashrightarrow R_j$ must appear in the graph before process $P_i$ starts executing. 2. When process $P_i$ actually requests $R_j$, the claim edge is converted into a solid Request Edge ($P_i \\to R_j$). 3. When resource $R_j$ is allocated to $P_i$, the request edge is converted into an Assignment Edge ($R_j \\to P_i$). 4. When $R_j$ is released by $P_i$, the assignment edge reconverts back into a dashed Claim Edge ($P_i \\dashrightarrow R_j$). Avoidance Algorithm: When process $P_i$ requests resource $R_j$, the request can be granted ONLY if converting the request edge $P_i \\to R_j$ into an assignment edge $R_j \\to P_i$ does NOT result in the formation of a cycle in the resource allocation graph (evaluating both solid and dashed claim edges!). A cycle detection algorithm requires $O(n^2)$ operations.",
    interview: "Why must claim edges be converted back to dashed claim edges upon resource release rather than deleted entirely? Because the process may request that same resource again in a future iteration before it terminates; retaining the claim edge maintains conservative cycle detection bounds.",
    mnemonic: "Claim (Dashed) -> Request (Solid to Box) -> Assignment (Solid from Box) -> Reverts to Claim.",
    analogy: "Library Book Hold: Placing an online reservation hold (Claim edge). Standing at checkout counter (Request edge). Taking the book home (Assignment edge). Returning it to the shelf (Reconverts to Claim).",
    mistakes: "Checking only solid edges for cycles during avoidance. You MUST evaluate cycles including dashed claim edges to prevent entering an unsafe state!",
    examPoints: [
      "Explain the Resource Allocation Graph with Claim Edges for deadlock avoidance (5 Marks / SRM Slide 61-62).",
      "Illustrate how an unsafe state is detected using claim edges with a diagram (5 Marks / SRM Slide 63).",
      "Trace the edge transition cycle: Claim -> Request -> Assignment -> Claim (2 Marks / SRM Slide 62)."
    ],
    diagram: "rag-claim-edges-cycle"
  },
  {
    id: "bankers-algorithm",
    title: "Banker's Algorithm (Safety & Resource-Request)",
    unit: 3,
    badge: "16-Mark University Cornerstone",
    beginner: "A bank never lends out all its cash at once. When a customer asks for a loan, the banker checks: 'If I give you this cash now, can you finish your business, return all your borrowed money, and let me help the next customer?' If yes, loan granted!",
    college: "The Banker's Algorithm, developed by Dijkstra, is a deadlock avoidance algorithm applicable to systems with multiple instances of each resource type. It is less efficient than RAG but handles arbitrary resource matrices. Data Structures: Let $n$ = number of processes, $m$ = number of resource types. 1. `Available[m]`: Vector of length $m$. If Available$[j] = k$, there are $k$ instances of resource type $R_j$ currently available. 2. `Max[n][m]`: Matrix. If Max$[i][j] = k$, process $P_i$ may request at most $k$ instances of $R_j$. 3. `Allocation[n][m]`: Matrix. If Allocation$[i][j] = k$, $P_i$ is currently allocated $k$ instances of $R_j$. 4. `Need[n][m]`: Matrix. If Need$[i][j] = k$, $P_i$ may need $k$ more instances of $R_j$ to complete its task. Formula: $\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$. 1. Safety Algorithm: Step 1: Initialize Work = Available (vector of length $m$) and Finish$[i]$ = false for all $i = 0, \\dots, n-1$. Step 2: Find an index $i$ such that both: (a) Finish$[i]$ == false, and (b) $\\text{Need}_i \\le \\text{Work}$. If no such $i$ exists, go to Step 4. Step 3: $\\text{Work} = \\text{Work} + \\text{Allocation}_i$, Finish$[i]$ = true, go to Step 2. Step 4: If Finish$[i]$ == true for all $i$, the system is in a SAFE STATE! 2. Resource-Request Algorithm for Process $P_i$: Let Request$_i$ be the request vector for $P_i$. Step 1: If $\\text{Request}_i \\le \\text{Need}_i$, go to Step 2; otherwise raise error (process exceeded maximum claim). Step 2: If $\\text{Request}_i \\le \\text{Available}$, go to Step 3; otherwise $P_i$ must wait (resources not available). Step 3: Speculatively assume resources allocated: $\\text{Available} = \\text{Available} - \\text{Request}_i$; $\\text{Allocation}_i = \\text{Allocation}_i + \\text{Request}_i$; $\\text{Need}_i = \\text{Need}_i - \\text{Request}_i$. Run the Safety Algorithm. If safe -> Grant resources! If unsafe -> Rollback allocation and force $P_i$ to wait.",
    interview: "Walk through the SRM Slide 68-70 Numerical Snapshot: 5 processes P0..P4, 3 resource types A (10 instances), B (5 instances), C (7 instances). Available = (3, 3, 2). Allocation: P0(0,1,0), P1(2,0,0), P2(3,0,2), P3(2,1,1), P4(0,0,2). Max: P0(7,5,3), P1(3,2,2), P2(9,0,2), P3(2,2,2), P4(4,3,3). 1. Compute Need Matrix ($Max - Allocation$): P0 = (7,4,3); P1 = (1,2,2); P2 = (6,0,0); P3 = (0,1,1); P4 = (4,3,1). 2. Find Safe Sequence: Work=(3,3,2). Check P0: Need(7,4,3) <= (3,3,2) False. Check P1: Need(1,2,2) <= (3,3,2) True! P1 finishes -> Work = (3,3,2) + (2,0,0) = (5,3,2). Next P3: Need(0,1,1) <= (5,3,2) True! P3 finishes -> Work = (5,3,2) + (2,1,1) = (7,4,3). Next P4: Need(4,3,1) <= (7,4,3) True! P4 finishes -> Work = (7,4,3) + (0,0,2) = (7,4,5). Next P0: Need(7,4,3) <= (7,4,5) True! P0 finishes -> Work = (7,4,5) + (0,1,0) = (7,5,5). Next P2: Need(6,0,0) <= (7,5,5) True! P2 finishes -> Work = (7,5,5) + (3,0,2) = (10,5,7) = Total. Safe Sequence: <P1, P3, P4, P0, P2>! System is SAFE! 3. Test Request: P1 requests (1, 0, 2). Check: (1,0,2) <= Need(1,2,2) True. (1,0,2) <= Available(3,3,2) True. Speculative: Available=(2,3,0), Alloc P1=(3,0,2), Need P1=(0,2,0). Safety check confirms <P1, P3, P4, P0, P2> still safe -> GRANTED!",
    mnemonic: "Need = Max - Allocation. Work = Work + Allocation. Request <= Need AND Request <= Available -> Speculate & Test Safety.",
    analogy: "Construction Banker: A developer with \\$3M cash checks requests from 5 builders. He only funds Builder 1 because Builder 1 only needs \\$1M to finish and repay \\$2M, growing the bank cash to fund Builder 3 next.",
    mistakes: "Adding Max to Work instead of Allocation! When a process finishes, it releases what it currently HOLDS (`Allocation`), NOT what it claimed (`Max`)!",
    examPoints: [
      "State and explain the Banker's Algorithm with data structures, Safety Algorithm, and Resource-Request Algorithm (16 Marks / SRM Slide 64-67 / Most Important University Question).",
      "Solve the 5-process, 3-resource Banker's algorithm numerical: compute Need matrix, find safe sequence, and verify if P1 request (1,0,2) can be granted (16 Marks / SRM Slide 68-70).",
      "Can a request for (3,3,0) by P4 be granted? Justify (5 Marks / Slide 70). (No, because requested A=3 exceeds Available A=2!)."
    ],
    numerical: {
      type: "bankers",
      resources: ["A", "B", "C"],
      total: [10, 5, 7],
      available: [3, 3, 2],
      allocation: [
        { pid: "P0", vals: [0, 1, 0] },
        { pid: "P1", vals: [2, 0, 0] },
        { pid: "P2", vals: [3, 0, 2] },
        { pid: "P3", vals: [2, 1, 1] },
        { pid: "P4", vals: [0, 0, 2] }
      ],
      max: [
        { pid: "P0", vals: [7, 5, 3] },
        { pid: "P1", vals: [3, 2, 2] },
        { pid: "P2", vals: [9, 0, 2] },
        { pid: "P3", vals: [2, 2, 2] },
        { pid: "P4", vals: [4, 3, 3] }
      ],
      need: [
        { pid: "P0", vals: [7, 4, 3] },
        { pid: "P1", vals: [1, 2, 2] },
        { pid: "P2", vals: [6, 0, 0] },
        { pid: "P3", vals: [0, 1, 1] },
        { pid: "P4", vals: [4, 3, 1] }
      ],
      safeSequence: ["P1", "P3", "P4", "P0", "P2"]
    }
  },
  {
    id: "deadlock-detection",
    title: "Deadlock Detection & Wait-For Graphs",
    unit: 3,
    badge: "Detection Algorithms & Numericals",
    beginner: "A detective walking into the office to see who is actually trapped: if single chairs, draw lines between people and find loops (Wait-For Graph). If multiple staplers, check who can finish right now and who is frozen forever!",
    college: "If a system does not employ deadlock prevention or avoidance, deadlocks may occur. The system must provide a Detection Algorithm and a Recovery Scheme. 1. Single Instance of Each Resource Type: Maintain a Wait-For Graph (SRM Slide 72-73). Nodes are processes. A directed edge $P_i \\to P_j$ exists if process $P_i$ is waiting for process $P_j$ to release a resource. The wait-for graph is obtained from the Resource Allocation Graph by collapsing resource nodes and drawing direct edges between processes. Detection Rule: A deadlock exists if and only if the wait-for graph contains a cycle! Cycle detection requires $O(n^2)$ operations where $n$ is the number of processes. 2. Several Instances of a Resource Type: Data structures: `Available[m]`, `Allocation[n][m]`, and `Request[n][m]` matrix (indicating current outstanding requests of each process). Detection Algorithm (SRM Slide 75): Step 1: Work = Available. For $i=0..n-1$, if $\\text{Allocation}_i \\ne 0$, Finish$[i]$ = false; otherwise Finish$[i]$ = true. Step 2: Find index $i$ such that Finish$[i]$ == false and $\\text{Request}_i \\le \\text{Work}$. If no such $i$ exists, go to Step 4. Step 3: $\\text{Work} = \\text{Work} + \\text{Allocation}_i$, Finish$[i]$ = true, go to Step 2. Step 4: If Finish$[i]$ == false for some $i$, then the system is in DEADLOCK, and process $P_i$ is DEADLOCKED! SRM Slide 76-77 Numerical Snapshot: 5 processes P0..P4, Resources A(7), B(2), C(6). Available=(0,0,0). Allocation: P0(0,1,0), P1(2,0,0), P2(3,0,3), P3(2,1,1), P4(0,0,2). Request: P0(0,0,0), P1(2,0,2), P2(0,0,0), P3(1,0,0), P4(0,0,2). Execution: P0 has Request(0,0,0) <= Work(0,0,0) -> Finish[0]=true, Work=(0,1,0). Next P2 has Request(0,0,0) <= (0,1,0) -> Finish[2]=true, Work=(3,1,3). Next P3 has Request(1,0,0) <= (3,1,3) -> Finish[3]=true, Work=(5,2,4). Next P1 has Request(2,0,2) <= (5,2,4) -> Finish[1]=true, Work=(7,2,4). Next P4 has Request(0,0,2) <= (7,2,4) -> Finish[4]=true. Result: Finish[i] = true for all $i$ -> NO DEADLOCK! Slide 77 Variation: What if P2 requests an additional instance of C (Request P2 becomes 0, 0, 1)? Only P0 can finish, releasing (0,1,0). Available Work becomes (0,1,0). No other process can have its request satisfied! Result: Finish[1], Finish[2], Finish[3], Finish[4] remain false -> DEADLOCK EXISTS consisting of processes P1, P2, P3, and P4!",
    interview: "Difference between Banker's Algorithm and Deadlock Detection Algorithm: Banker's algorithm uses the `Need` matrix (maximum future claims) to prevent entering an unsafe state. The Detection algorithm uses the `Request` matrix (current actual outstanding requests) to detect if a deadlock has ALREADY occurred right now.",
    mnemonic: "Wait-For Graph = Collapse Resources, Cycle = Deadlock ($O(n^2)$). Detection Algorithm: Work=Available, Reclaim from Request <= Work.",
    analogy: "Airport Baggage Carousel: If 4 passengers each have their hands on the next person's suitcase waiting for them to let go, an observer looks at their hands and immediately identifies the locked cycle.",
    mistakes: "Initializing Finish[i] to false for processes that have zero allocation in the detection algorithm. If a process holds 0 resources (`Allocation_i == 0`), it cannot be involved in a deadlock, so Finish[i] is initialized to TRUE!",
    examPoints: [
      "Describe the Wait-For Graph deadlock detection algorithm for single-instance resources (5 Marks / SRM Slide 72-73).",
      "State and explain the Deadlock Detection algorithm for multiple-instance resources (10 Marks / SRM Slide 74-75).",
      "Solve the Deadlock Detection numerical for processes P0..P4. Show what happens when P2 requests (0,0,1) (10 Marks / SRM Slide 76-77)."
    ],
    diagram: "wait-for-graph-reduction"
  },
  {
    id: "deadlock-recovery",
    title: "Recovery from Deadlock: Termination & Preemption",
    unit: 3,
    badge: "Recovery Protocols",
    beginner: "Once a deadlock is detected, how do you fix it? Either fire all the workers involved (Abort All), fire one worker at a time until the clog clears (Abort One by One), or snatch a tool from someone's hands and give it to someone else (Resource Preemption)!",
    college: "When a detection algorithm determines that a deadlock exists, the system must recover using one of two primary approaches (SRM Slide 78-79): 1. Process Termination: (a) Abort all deadlocked processes: Simplest, but extremely expensive as all partial computation results are discarded. (b) Abort one process at a time until the deadlock cycle is eliminated: Incurs overhead because the deadlock detection algorithm must be re-run after each abort. Abort Selection Criteria: In which order should we choose to abort? Factors: 1. Priority of the process, 2. How long the process has computed and how much longer to completion, 3. Resources the process has already consumed, 4. Additional resources the process needs to complete, 5. How many processes will need to be terminated, 6. Whether the process is interactive or batch. 2. Resource Preemption: Successively preempt some resources from processes and allocate them to other processes until the deadlock cycle is broken. Three Major Issues: (a) Selecting a Victim: Determine which resource and which process to preempt to minimize cost. (b) Rollback: If a resource is preempted, the process cannot continue normally; the system must rollback the process to some safe state and restart it from that checkpoint (Rollback as far as necessary to break deadlock). (c) Starvation: The same process may always be picked as a victim. Solution: Include the number of rollbacks in the process cost factor, ensuring that a process can be picked as a victim only a finite number of times.",
    interview: "How do production enterprise databases like MySQL/PostgreSQL handle deadlock recovery? They use Resource Preemption with automated victim rollback! When an engine detects an InnoDB transaction deadlock cycle, it measures the undo log weight (cost) of each transaction and automatically aborts and rolls back the transaction that has modified the smallest number of rows, releasing all its row locks to let the larger transaction succeed.",
    mnemonic: "Recovery = 1. Process Termination (Abort All vs Abort One by One based on 6 criteria), 2. Resource Preemption (Victim Selection, Rollback to Safe State, Starvation Prevention).",
    analogy: "Highway Traffic Jam: Police either tow away all cars involved in the crash (Abort All) or tow the single smallest stalled vehicle to open one lane (Victim Selection & Rollback).",
    mistakes: "Rolling back a process to the very beginning when checkpointing is available. An OS should roll back the process only as far as necessary to break the deadlock cycle!",
    examPoints: [
      "Explain the two methods of recovery from deadlock: Process Termination and Resource Preemption (10 Marks / SRM Slide 78-79 / Repeated SRM Question).",
      "List the six factors considered when choosing a process to terminate for deadlock recovery (5 Marks / SRM Slide 78).",
      "Explain the three issues in resource preemption: Selecting a Victim, Rollback, and Starvation (5 Marks / SRM Slide 79)."
    ]
  }
];
