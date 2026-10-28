// =============================================================================
// EXAM MASTER MODE DATABASE - UNIVERSITY PATTERN (2, 5, 10, 13, 16 MARKS)
// Sourced strictly from SRM University 21CSC202J Syllabus & Slide Question Banks
// Complete model answers, key points, and marking rubrics included
// =============================================================================

window.EXAM_DATA = {
  marks2: [
    {
      id: "ex-2-1",
      unit: 2,
      topic: "Process Concept",
      question: "Define Process. How does it differ from a program?",
      modelAnswer: "A process is a program in execution progressing in sequential fashion. A program is a passive entity stored on disk as an executable file, whereas a process is an active entity loaded into memory with a Program Counter, CPU registers, stack, and heap.",
      rubric: "1 mark for definition of process; 1 mark for contrast with program (passive vs active)."
    },
    {
      id: "ex-2-2",
      unit: 2,
      topic: "Context Switching",
      question: "What is context switch latency? Why is it considered pure overhead?",
      modelAnswer: "Context switch latency is the time taken by the operating system to save the execution state of the currently running process into its PCB and load the saved state of the newly scheduled process from its PCB. It is pure overhead because the CPU performs no productive user computation while switching.",
      rubric: "1 mark for latency definition; 1 mark for explaining overhead."
    },
    {
      id: "ex-2-3",
      unit: 2,
      topic: "Process Termination",
      question: "Distinguish between a Zombie process and an Orphan process.",
      modelAnswer: "A Zombie process is one that has terminated via exit(), but whose parent has not yet invoked wait(&status) to read its exit code. An Orphan process is one whose parent has terminated without waiting; orphans are adopted by the init/systemd process (PID 1).",
      rubric: "1 mark for Zombie definition; 1 mark for Orphan definition."
    },
    {
      id: "ex-2-4",
      unit: 2,
      topic: "Synchronization",
      question: "Define Race Condition with a brief example.",
      modelAnswer: "A race condition is a situation where several processes access and manipulate the same shared data concurrently, and the outcome of execution depends on the specific order in which access takes place. Example: Two processes concurrently executing counter++ and counter-- on counter=5 ending up with counter=4 or counter=6.",
      rubric: "1 mark for definition; 1 mark for concurrent counter interleaving example."
    },
    {
      id: "ex-2-5",
      unit: 2,
      topic: "Critical Section",
      question: "State the three requirements to solve the Critical Section problem.",
      modelAnswer: "1. Mutual Exclusion (no two processes in CS simultaneously), 2. Progress (selection of next entrant cannot be postponed indefinitely), and 3. Bounded Waiting (bound on times other processes enter CS before a requesting process enters).",
      rubric: "2 marks: 0.67 marks each for Mutual Exclusion, Progress, and Bounded Waiting."
    },
    {
      id: "ex-2-6",
      unit: 2,
      topic: "Semaphores",
      question: "What is the physical significance of a negative semaphore value in non-busy-waiting semaphores?",
      modelAnswer: "In semaphores implemented with a waiting queue (non-busy waiting), if the semaphore value is negative, its absolute magnitude (|value|) equals the exact number of processes currently suspended in the semaphore's waiting queue.",
      rubric: "2 marks for explaining magnitude equals number of blocked/waiting processes."
    },
    {
      id: "ex-3-1",
      unit: 3,
      topic: "CPU Scheduling",
      question: "Define the Convoy Effect in CPU scheduling.",
      modelAnswer: "The convoy effect is a phenomenon in FCFS scheduling where all short I/O-bound processes are forced to wait in the ready queue behind one very long CPU-bound process, resulting in lower CPU and device utilization.",
      rubric: "2 marks for complete convoy definition (short jobs waiting behind long job)."
    },
    {
      id: "ex-3-2",
      unit: 3,
      topic: "Dispatcher",
      question: "What is dispatch latency? List the three tasks performed by the dispatcher.",
      modelAnswer: "Dispatch latency is the time it takes for the dispatcher to stop one process and start another running. Tasks: 1. Switching context, 2. Switching to user mode, 3. Jumping to the proper location in the user program to restart it.",
      rubric: "1 mark for latency definition; 1 mark for listing the 3 dispatcher tasks."
    },
    {
      id: "ex-3-3",
      unit: 3,
      topic: "Priority Scheduling",
      question: "What is Starvation in priority scheduling and how is it resolved?",
      modelAnswer: "Starvation is a situation where the continuous arrival of higher-priority processes keeps a lower-priority process waiting indefinitely in the ready queue. It is resolved using the Aging technique, which gradually increases the priority of waiting processes over time.",
      rubric: "1 mark for starvation definition; 1 mark for aging technique."
    },
    {
      id: "ex-3-4",
      unit: 3,
      topic: "Deadlocks",
      question: "Define Safe State in deadlock avoidance.",
      modelAnswer: "A system state is safe if the system can allocate resources to each process (up to its declared maximum) in some order and avoid a deadlock. A state is safe only if there exists at least one Safe Sequence <P1, P2, ..., Pn>.",
      rubric: "1 mark for allocation without deadlock; 1 mark for existence of safe sequence."
    },
    {
      id: "ex-3-5",
      unit: 3,
      topic: "RAG",
      question: "State the cycle vs. deadlock condition in Resource Allocation Graphs.",
      modelAnswer: "If the RAG has no cycle, there is no deadlock. If the graph contains a cycle: 1. If every resource type has exactly one instance, a cycle implies DEADLOCK. 2. If resource types have multiple instances, a cycle does NOT necessarily imply deadlock.",
      rubric: "1 mark for single instance rule; 1 mark for multiple instance distinction."
    }
  ],

  marks5: [
    {
      id: "ex-5-1",
      unit: 2,
      topic: "Process in Memory",
      question: "Draw and explain the memory layout of a process with all segments.",
      modelAnswer: `A process in memory is organized into four main segments:
1. Text Section: Contains the compiled executable machine code instructions located at the lowest memory addresses.
2. Data Section: Divided into initialized data (global and static variables) and uninitialized data (BSS).
3. Heap: Memory dynamically allocated at runtime via malloc() / calloc() / new. Grows upward towards higher memory addresses.
4. Stack: Contains temporary execution data including function call frames, parameters, return addresses, and local variables. Grows downward from high memory (max) towards lower memory addresses.
The unallocated space between heap and stack allows dynamic expansion without collision until memory limits are reached.`,
      rubric: "2 marks for neat labeled diagram (Text, Data, Heap, Stack, arrows); 3 marks for describing each segment."
    },
    {
      id: "ex-5-2",
      unit: 2,
      topic: "Process States",
      question: "Explain the 5-state process lifecycle model and its transitions.",
      modelAnswer: `The five states of a process are:
1. New: The process is being created and initialized by the operating system.
2. Ready: The process is residing in main memory, ready and waiting to be assigned to a CPU core.
3. Running: Instructions are actively being executed on the CPU.
4. Waiting (Blocked): The process is waiting for some external event to occur (e.g., I/O completion or signal reception).
5. Terminated: The process has finished executing its final instruction and is awaiting resource cleanup.
Key Transitions:
- Admitted: New -> Ready
- Scheduler Dispatch: Ready -> Running
- Interrupt / Time Slice Expiry: Running -> Ready
- I/O or Event Wait: Running -> Waiting
- I/O or Event Completion: Waiting -> Ready
- Exit: Running -> Terminated.`,
      rubric: "2 marks for 5-state diagram with labeled transition arrows; 3 marks for definitions."
    },
    {
      id: "ex-5-3",
      unit: 2,
      topic: "PCB",
      question: "List and describe the components of a Process Control Block (PCB).",
      modelAnswer: `A PCB stores the complete context of a process:
1. Process State: Current state (new, ready, running, waiting, etc.).
2. Program Counter (PC): Address of the next machine instruction to be executed.
3. CPU Registers: Contents of accumulators, index registers, stack pointers, and flags.
4. CPU Scheduling Information: Process priority, scheduling queue pointers, and scheduling parameters.
5. Memory-Management Information: Base/limit registers, page tables, or segment tables.
6. Accounting Information: CPU execution time used, elapsed clock time, and account numbers.
7. I/O Status Information: List of I/O devices allocated, open file descriptors table.`,
      rubric: "1 mark for defining PCB; 4 marks for detailing any 6 components."
    },
    {
      id: "ex-5-4",
      unit: 2,
      topic: "Threads",
      question: "Explain the four primary benefits of multithreaded programming.",
      modelAnswer: `1. Responsiveness: In an interactive user-interface application, multithreading allows a program to continue running even if a section of it is blocked or performing a lengthy operation (e.g. background file download while UI remains responsive).
2. Resource Sharing: Threads belonging to the same process share code, global data, heap, and open files by default, which is far simpler than establishing IPC shared memory or message queues.
3. Economy: Spawning and managing threads is lightweight. Allocating memory and address spaces for full process creation is heavyweight. Context switching between threads incurs vastly less overhead than between processes.
4. Scalability: Multithreading allows an application to scale across multiple CPU cores, achieving true hardware parallelism where separate threads execute on separate cores simultaneously.`,
      rubric: "1.25 marks for each benefit with clear explanation."
    },
    {
      id: "ex-5-5",
      unit: 2,
      topic: "Amdahl's Law",
      question: "State Amdahl's Law. Calculate the speedup when an application is 75% parallel and 25% serial on 2 cores.",
      modelAnswer: `Amdahl's Law defines the potential speedup gained by adding processing cores to an application with both serial and parallel components:
Formula: Speedup <= 1 / [ S + (1 - S) / N ]
Where:
- S = Serial portion of the application
- (1 - S) = Parallel portion
- N = Number of processing cores.

Given: S = 25% = 0.25; (1 - S) = 75% = 0.75; N = 2 cores.
Calculation:
Speedup <= 1 / [ 0.25 + 0.75 / 2 ]
Speedup <= 1 / [ 0.25 + 0.375 ]
Speedup <= 1 / 0.625 = 1.6 times.

Conclusion: Moving from 1 core to 2 cores yields a 1.6x speedup. Furthermore, as N approaches infinity, maximum speedup is capped at 1 / S = 1 / 0.25 = 4x.`,
      rubric: "2 marks for formula and definition; 3 marks for step-by-step numerical calculation."
    },
    {
      id: "ex-3-6",
      unit: 3,
      topic: "Deadlock Prevention",
      question: "Explain how Deadlock Prevention invalidates the Circular Wait condition using resource ordering.",
      modelAnswer: `Deadlock prevention invalidates circular wait by imposing a total ordering on all resource types.
1. Define a one-to-one function F: R -> N mapping all resource types to natural numbers:
   Example: F(tape drive) = 1, F(disk drive) = 5, F(printer) = 12.
2. Protocol Rule: Each process can request resources only in strictly increasing order of enumeration. That is, a process holding resource Ri can request resource Rj if and only if F(Rj) > F(Ri).
3. If a process requires an instance of a lower-ranked resource, it must release all currently held resources with higher or equal ranks first.
Proof of Deadlock Elimination:
Suppose a circular wait exists: P0 -> P1 -> P2 -> ... -> Pn -> P0.
Let Ri be the resource held by Pi. By our protocol:
F(R0) < F(R1) < F(R2) < ... < F(Rn) < F(R0).
This implies F(R0) < F(R0), which is a mathematical impossibility. Hence, circular wait cannot occur.`,
      rubric: "2 marks for protocol definition and function F; 3 marks for proof of circular wait elimination."
    }
  ],

  marks10: [
    {
      id: "ex-10-1",
      unit: 2,
      topic: "Peterson's Solution",
      question: "Write Peterson's Algorithm for two processes and prove that it satisfies Mutual Exclusion, Progress, and Bounded Waiting.",
      modelAnswer: `Peterson's Algorithm is a software solution for two processes (P0 and P1).
Shared Variables:
- int turn; // indicates whose turn it is to enter CS
- boolean flag[2]; // flag[i] = true means Pi is ready to enter CS

Algorithm for Process Pi (where j = 1 - i):
do {
    flag[i] = true;
    turn = j;
    while (flag[j] && turn == j)
        ; /* busy wait */

    /* CRITICAL SECTION */

    flag[i] = false;

    /* REMAINDER SECTION */
} while (true);

Proof of Correctness:
1. Mutual Exclusion:
For Pi to enter CS, either flag[j] must be false or turn must equal i. If both attempt to enter simultaneously, both set flag[0]=flag[1]=true. However, turn can hold only one value (either 0 or 1). If turn==0, P0 enters; if turn==1, P1 enters. Both processes cannot be in CS simultaneously.

2. Progress:
A process Pj can prevent Pi from entering CS only if flag[j]==true and turn==j. If Pj is in its remainder section, flag[j]=false, so Pi enters immediately. If Pj also wants to enter, it will set turn=i, allowing Pi to enter. Thus, entry is not indefinitely postponed.

3. Bounded Waiting:
Once Pj exits its critical section, it sets flag[j]=false. If it immediately attempts to re-enter, it must execute flag[j]=true and set turn=i. Since turn is now i, Pi will enter CS after at most one entry by Pj. Thus, bounded waiting is preserved.`,
      rubric: "3 marks for shared variables and algorithm code; 7 marks for detailed mathematical proofs of ME, Progress, and Bounded Waiting."
    },
    {
      id: "ex-10-2",
      unit: 3,
      topic: "Deadlock Detection",
      question: "State and explain the Deadlock Detection algorithm for multiple-instance resources. Illustrate with a snapshot problem.",
      modelAnswer: `Deadlock Detection Algorithm for Multiple-Instance Resources:
Data Structures: Available[m], Allocation[n][m], Request[n][m], Work[m], Finish[n].

Algorithm Steps:
1. Initialize Work = Available.
   For i = 0 to n-1:
     if Allocation[i] != 0, Finish[i] = false;
     else Finish[i] = true;
2. Find index i such that:
   (a) Finish[i] == false, and
   (b) Request[i] <= Work.
   If no such i exists, go to Step 4.
3. Work = Work + Allocation[i];
   Finish[i] = true;
   Go to Step 2.
4. If Finish[i] == false for any i (0 <= i < n), the system is in DEADLOCK, and process Pi is deadlocked!

Snapshot Example (SRM Slide 76-77):
5 processes P0..P4; Resources A(7), B(2), C(6). Available = (0, 0, 0).
Allocation: P0(0,1,0), P1(2,0,0), P2(3,0,3), P3(2,1,1), P4(0,0,2).
Request: P0(0,0,0), P1(2,0,2), P2(0,0,0), P3(1,0,0), P4(0,0,2).

Trace:
1. P0 has Request(0,0,0) <= Work(0,0,0) -> Finish[0]=true, Work = (0,0,0)+(0,1,0) = (0,1,0).
2. P2 has Request(0,0,0) <= (0,1,0) -> Finish[2]=true, Work = (0,1,0)+(3,0,3) = (3,1,3).
3. P3 has Request(1,0,0) <= (3,1,3) -> Finish[3]=true, Work = (3,1,3)+(2,1,1) = (5,2,4).
4. P1 has Request(2,0,2) <= (5,2,4) -> Finish[1]=true, Work = (5,2,4)+(2,0,0) = (7,2,4).
5. P4 has Request(0,0,2) <= (7,2,4) -> Finish[4]=true.
All Finish[i] == true -> NO DEADLOCK!

Deadlock Scenario:
If P2 requests an additional instance of C (Request P2 becomes 0,0,1):
P0 can finish, setting Work = (0,1,0).
No other process can be satisfied by (0,1,0)!
Hence Finish[1], Finish[2], Finish[3], Finish[4] remain false -> DEADLOCK EXISTS consisting of P1, P2, P3, P4!`,
      rubric: "4 marks for algorithm steps; 6 marks for snapshot problem trace and deadlock variation."
    }
  ],

  marks16: [
    {
      id: "ex-16-1",
      unit: 3,
      topic: "Banker's Algorithm",
      question: `Consider the following snapshot of a system with 5 processes (P0, P1, P2, P3, P4) and 3 resource types A (10 instances), B (5 instances), and C (7 instances):

Allocation:
P0: 0 1 0
P1: 2 0 0
P2: 3 0 2
P3: 2 1 1
P4: 0 0 2

Max:
P0: 7 5 3
P1: 3 2 2
P2: 9 0 2
P3: 2 2 2
P4: 4 3 3

Available: 3 3 2

1. Calculate the Need matrix.
2. Verify if the system is in a safe state by applying the Safety Algorithm and find the Safe Sequence.
3. If Process P1 requests (1, 0, 2), can this request be granted immediately?
4. Can a request for (3, 3, 0) by P4 be granted?`,
      modelAnswer: `STEP 1: Compute Need Matrix (Need = Max - Allocation)
- Need[P0] = (7-0, 5-1, 3-0) = (7, 4, 3)
- Need[P1] = (3-2, 2-0, 2-0) = (1, 2, 2)
- Need[P2] = (9-3, 0-0, 2-2) = (6, 0, 0)
- Need[P3] = (2-2, 2-1, 2-1) = (0, 1, 1)
- Need[P4] = (4-0, 3-0, 3-2) = (4, 3, 1)

STEP 2: Safety Algorithm Execution
Initial Work = Available = (3, 3, 2). Finish = [F, F, F, F, F].
- Check P0: Need(7,4,3) <= Work(3,3,2) -> False.
- Check P1: Need(1,2,2) <= Work(3,3,2) -> TRUE.
  Work = Work + Allocation[P1] = (3,3,2) + (2,0,0) = (5, 3, 2). Finish[P1] = True.
- Check P3: Need(0,1,1) <= Work(5,3,2) -> TRUE.
  Work = Work + Allocation[P3] = (5,3,2) + (2,1,1) = (7, 4, 3). Finish[P3] = True.
- Check P4: Need(4,3,1) <= Work(7,4,3) -> TRUE.
  Work = Work + Allocation[P4] = (7,4,3) + (0,0,2) = (7, 4, 5). Finish[P4] = True.
- Check P0: Need(7,4,3) <= Work(7,4,5) -> TRUE.
  Work = Work + Allocation[P0] = (7,4,5) + (0,1,0) = (7, 5, 5). Finish[P0] = True.
- Check P2: Need(6,0,0) <= Work(7,5,5) -> TRUE.
  Work = Work + Allocation[P2] = (7,5,5) + (3,0,2) = (10, 5, 7) = Total Resources. Finish[P2] = True.

All Finish[i] are True.
SAFE SEQUENCE: < P1, P3, P4, P0, P2 >
The system is in a SAFE STATE!

STEP 3: Check Request from P1 for (1, 0, 2)
1. Request_1 (1,0,2) <= Need_1 (1,2,2) -> True.
2. Request_1 (1,0,2) <= Available (3,3,2) -> True.
Speculative Allocation:
Available' = (3,3,2) - (1,0,2) = (2, 3, 0)
Allocation'[P1] = (2,0,0) + (1,0,2) = (3, 0, 2)
Need'[P1] = (1,2,2) - (1,0,2) = (0, 2, 0)

Run Safety Algorithm with Available' = (2, 3, 0):
- Check P1: Need(0,2,0) <= (2,3,0) -> True.
  Work = (2,3,0) + (3,0,2) = (5,3,2). Finish[P1]=True.
- Check P3: Need(0,1,1) <= (5,3,2) -> True.
  Work = (5,3,2) + (2,1,1) = (7,4,3). Finish[P3]=True.
- Check P4: Need(4,3,1) <= (7,4,3) -> True.
  Work = (7,4,3) + (0,0,2) = (7,4,5). Finish[P4]=True.
- Check P0: Need(7,4,3) <= (7,4,5) -> True.
  Work = (7,4,5) + (0,1,0) = (7,5,5). Finish[P0]=True.
- Check P2: Need(6,0,0) <= (7,5,5) -> True.
  Work = (7,5,5) + (3,0,2) = (10,5,7). Finish[P2]=True.
Safe Sequence < P1, P3, P4, P0, P2 > exists.
Conclusion: Request for (1, 0, 2) by P1 can be GRANTED IMMEDIATELY!

STEP 4: Check Request from P4 for (3, 3, 0)
Request_4 = (3, 3, 0).
Available = (3, 3, 2) [or (2, 3, 0) if after P1].
Even in original state: Request_4 (3,3,0) <= Need_4 (4,3,1) is True.
However, if evaluated after P1's grant, Available is (2,3,0), and Request_4 for Resource A is 3 > 2!
Hence P4 MUST WAIT because resources are not currently available.`,
      rubric: "4 marks for Need matrix calculation; 5 marks for Safety algorithm trace and sequence; 5 marks for P1 request verification; 2 marks for P4 request decision."
    },
    {
      id: "ex-16-2",
      unit: 3,
      topic: "CPU Scheduling Algorithms Comparison",
      question: `Consider the following four processes arriving in the ready queue:
Process P1: Arrival Time = 0, Burst Time = 7
Process P2: Arrival Time = 2, Burst Time = 4
Process P3: Arrival Time = 4, Burst Time = 1
Process P4: Arrival Time = 5, Burst Time = 4

1. Draw Gantt charts and compute Average Waiting Time and Average Turnaround Time for:
   (a) First-Come, First-Served (FCFS)
   (b) Shortest-Job-First (SJF) [Non-Preemptive]
   (c) Shortest-Remaining-Time-First (SRTF) [Preemptive SJF]
   (d) Round Robin (Time Quantum = 2)
2. Compare the four algorithms in terms of average waiting time, convoy effect, and context switch overhead.`,
      modelAnswer: `PART 1: GANTT CHARTS AND CALCULATIONS

(a) FCFS (Arrival order P1, P2, P3, P4):
Gantt Chart: P1 [0 - 7], P2 [7 - 11], P3 [11 - 12], P4 [12 - 16].
- Completion Times (CT): P1=7, P2=11, P3=12, P4=16.
- Turnaround Times (TAT = CT - AT): P1=7-0=7, P2=11-2=9, P3=12-4=8, P4=16-5=11.
- Waiting Times (WT = TAT - BT): P1=7-7=0, P2=9-4=5, P3=8-1=7, P4=11-4=7.
- Average Turnaround Time = (7 + 9 + 8 + 11) / 4 = 35 / 4 = 8.75 ms.
- Average Waiting Time = (0 + 5 + 7 + 7) / 4 = 19 / 4 = 4.75 ms.

(b) Non-Preemptive SJF:
At time 0, only P1 is available -> P1 runs 0 to 7.
At time 7, P2(4), P3(1), P4(4) are ready. Shortest is P3(1) -> P3 runs 7 to 8.
Next shortest is P2(4) [tie broken by earlier arrival] -> P2 runs 8 to 12.
Finally P4(4) runs 12 to 16.
Gantt Chart: P1 [0 - 7], P3 [7 - 8], P2 [8 - 12], P4 [12 - 16].
- CT: P1=7, P3=8, P2=12, P4=16.
- TAT: P1=7-0=7, P2=12-2=10, P3=8-4=4, P4=16-5=11.
- WT: P1=7-7=0, P2=10-4=6, P3=4-1=3, P4=11-4=7.
- Average Turnaround Time = (7 + 10 + 4 + 11) / 4 = 32 / 4 = 8.00 ms.
- Average Waiting Time = (0 + 6 + 3 + 7) / 4 = 16 / 4 = 4.00 ms.

(c) SRTF (Preemptive SJF):
- Time 0-2: P1 runs (remaining 5).
- Time 2: P2 arrives (BT 4 < 5) -> P1 preempted, P2 runs.
- Time 4: P3 arrives (BT 1 < remaining 2 of P2) -> P2 preempted, P3 runs.
- Time 5: P3 completes. P4 arrives (BT 4). Ready: P2(rem 2), P4(4), P1(rem 5).
- Time 5-7: P2 runs and finishes.
- Time 7-11: P4 runs (BT 4 < rem 5 of P1) and finishes.
- Time 11-16: P1 runs remaining 5 units and finishes.
Gantt Chart: P1 [0 - 2], P2 [2 - 4], P3 [4 - 5], P2 [5 - 7], P4 [7 - 11], P1 [11 - 16].
- CT: P1=16, P2=7, P3=5, P4=11.
- TAT: P1=16-0=16, P2=7-2=5, P3=5-4=1, P4=11-5=6.
- WT: P1=16-7=9, P2=5-4=1, P3=1-1=0, P4=6-4=2.
- Average Turnaround Time = (16 + 5 + 1 + 6) / 4 = 28 / 4 = 7.00 ms.
- Average Waiting Time = (9 + 1 + 0 + 2) / 4 = 12 / 4 = 3.00 ms.

(d) Round Robin (q = 2):
Trace:
- Time 0-2: P1 executes (rem 5). [Ready queue at 2: P2, P1]
- Time 2-4: P2 executes (rem 2). [Ready queue at 4: P1, P3, P2]
- Time 4-5: P3 executes (rem 0, finishes at 5!). P4 arrives at 5. [Queue at 5: P2, P4, P1]
- Time 5-7: P2 executes remaining 2 units and finishes at 7! [Queue at 7: P4, P1]
- Time 7-9: P4 executes (rem 2). [Queue at 9: P1, P4]
- Time 9-11: P1 executes (rem 3). [Queue at 11: P4, P1]
- Time 11-13: P4 executes remaining 2 units and finishes at 13! [Queue at 13: P1]
- Time 13-16: P1 executes remaining 3 units and finishes at 16!
Gantt Chart: P1 [0-2], P2 [2-4], P3 [4-5], P2 [5-7], P4 [7-9], P1 [9-11], P4 [11-13], P1 [13-16].
- CT: P3=5, P2=7, P4=13, P1=16.
- TAT: P1=16-0=16, P2=7-2=5, P3=5-4=1, P4=13-5=8.
- WT: P1=16-7=9, P2=5-4=1, P3=1-1=0, P4=8-4=4.
- Average Turnaround Time = (16 + 5 + 1 + 8) / 4 = 30 / 4 = 7.50 ms.
- Average Waiting Time = (9 + 1 + 0 + 4) / 4 = 14 / 4 = 3.50 ms.

PART 2: COMPARISON TABLE
| Algorithm | Avg WT | Avg TAT | Preemptive? | Convoy Effect | Context Switches |
|---|---|---|---|---|---|
| FCFS | 4.75 ms | 8.75 ms | No | Severe | 3 (Lowest) |
| Non-Preempt SJF | 4.00 ms | 8.00 ms | No | None | 3 |
| SRTF (Preempt SJF)| 3.00 ms | 7.00 ms | Yes | None | 5 |
| Round Robin (q=2) | 3.50 ms | 7.50 ms | Yes | None | 7 (Highest) |

Conclusion: SRTF provides the optimal minimum average waiting time (3.00 ms), while Round Robin provides superior interactive responsiveness at the cost of higher context-switch overhead.`,
      rubric: "3 marks each for FCFS, SJF, SRTF, and RR Gantt charts and calculations (12 marks); 4 marks for comparative analysis table and conclusions."
    }
  ]
};
