# OS Master: Complete Operating Systems Interactive Learning Platform
### SRM Institute of Science & Technology · Course Code: 21CSC202J
**Unit 2: Process Management & Unit 3: CPU Scheduling and Deadlocks**

---

## 🌟 Overview & Pedagogical Architecture

**OS Master** is a production-grade, interactive web learning application designed to transform every theoretical definition, formula, algorithm, C/Java code implementation, process diagram, and numerical problem from the course slides into an engaging, gamified, and deeply educational experience.

Built with the rigor of a **Senior Operating Systems Professor**, the intuitive aesthetics of a **Top Educational UX Designer**, the systems depth of a **FAANG Software Engineer**, and the precision of an **Exam Preparation Expert**.

---

## 🚀 How to Run the Application

### Option A: One-Click Instant Browser (Zero Install)
Simply double-click the `index.html` file in the project folder to open it directly in Google Chrome, Microsoft Edge, Brave, or Firefox.

### Option B: Local HTTP Server (Active)
A built-in zero-dependency Node.js HTTP server is included:
```bash
node server.js
```
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧠 Core Features & System Sections

### 1. 🏠 Home & Gamified Learning Roadmap
- **Study Streak Counter (🔥)**: Tracks daily consecutive study streaks in `localStorage`.
- **Unit Completion Meters**: Visual percentage indicators for Unit 2 and Unit 3.
- **Overall Course Mastery Radar**: Real-time progress tracking across all 60+ core topics.
- **Interactive Roadmap Nodes**: Visual graph routing directly into each concept with status badges.

### 2. 📚 Unit Explorer (The 7-Layer Depth Engine)
Every single concept is taught across **7 distinct pedagogical layers**:
1. **👶 Beginner Explanation**: Explained using everyday concepts as if teaching a 10-year-old student.
2. **🎓 College-Level Explanation**: Academic rigor, formal definitions, and course slide citations.
3. **💼 FAANG Interview Explanation**: Deep systems engineering expectations, cache line effects, and kernel trade-offs.
4. **🧠 Memory Trick (Mnemonic)**: Catchy acronyms and cognitive associations.
5. **🌍 Real-Life Analogy**: Grounded in School, Restaurant, Traffic, Cricket, Railway, or Hospital scenarios.
6. **⚠️ Common Traps & Mistakes**: Highlighting common exam errors and interview gotchas.
7. **🎯 Exam Points & Rubrics**: Frequently asked university questions (2, 5, 10, 16 marks).

---

### 3. ⏱️ Interactive CPU Scheduling Simulator
Simulates all core CPU scheduling algorithms with real-time Gantt charts, tabular metrics, and step-by-step arithmetic:
- **Supported Algorithms**:
  - First-Come, First-Served (FCFS)
  - Shortest-Job-First (SJF Non-Preemptive)
  - Shortest-Remaining-Time-First (SRTF Preemptive SJF)
  - Priority Scheduling (Non-Preemptive)
  - Priority Scheduling (Preemptive with 7-process table)
  - Round Robin (RR with configurable Time Quantum $q$)
  - Multilevel Feedback Queue (MLFQ: Q0 $q=8$, Q1 $q=16$, Q2 FCFS)
- **Preloaded SRM Presets**:
  - `FCFS Convoy Effect` ($P_1=24, P_2=3, P_3=3 \to AWT = 17\text{ ms}$)
  - `FCFS Reordered` ($P_2=3, P_3=3, P_1=24 \to AWT = 3\text{ ms}$)
  - `SJF Varied Arrival` ($P_1..P_4 \to AWT = 4\text{ ms}$)
  - `SRTF Optimal` (Preemptive $P_1..P_4 \to AWT = 3\text{ ms}$)
  - `Priority Preemptive 7 Processes` (SRM Slide 21 table with Aging)
  - `Round Robin q=4 & q=20` (SRM Slide 25 & 26 numericals)
- **Automated Outputs**:
  - Visual color-coded Gantt timeline
  - Arrival Time (AT), Burst Time (BT), Completion Time (CT), Turnaround Time ($TAT = CT - AT$), Waiting Time ($WT = TAT - BT$), and Response Time (RT)
  - Line-by-line derivation of Average Waiting Time and Average Turnaround Time.

---

### 4. 🕸️ Deadlock & Resource Allocation Graph (RAG) Visualizer
- **Interactive Topology**:
  - Add Processes ($P_i$) and Resources ($R_j$) with multiple instance dots.
  - Connect Request Edges ($P_i \to R_j$), Assignment Edges ($R_j \to P_i$), and Claim Edges ($P_i \dashrightarrow R_j$).
- **Graph Reduction & Cycle Detection**:
  - Depth-First Search (DFS) cycle highlighter.
  - Multi-instance graph reduction algorithm distinguishing between deadlocks and harmless cycles.
- **Preloaded SRM Presets**:
  - `Simple 2-Process Deadlock` (Slide 47)
  - `Deadlocked RAG with 2 Cycles` (Slide 51)
  - `Cycle but NO Deadlock` (Slide 52 multi-instance proof)
  - `Unsafe State with Claim Edges` (Slide 63)
- **Wait-For Graph Generator**: Collapses resources to show direct process-to-process blocking dependencies.

---

### 5. 🏦 Banker's Algorithm Simulator (Avoidance)
- **Dynamic Matrix Inputs**:
  - Allocation Matrix ($n \times m$)
  - Max Matrix ($n \times m$)
  - Available Vector ($1 \times m$)
- **Automated Need Matrix Calculation**:
  $$\text{Need}[i][j] = \text{Max}[i][j] - \text{Allocation}[i][j]$$
- **Safety Algorithm Execution**:
  - Step-by-step evolution trace of the `Work` vector and `Finish` flags.
  - Discovers Safe Sequences: e.g., $\langle P_1, P_3, P_4, P_0, P_2 \rangle$.
- **Resource-Request Testing**:
  - Enter test requests (e.g. $P_1$ requests $[1, 0, 2]$ or $P_4$ requests $[3, 3, 0]$).
  - Automatically verifies:
    1. $\text{Request}_i \le \text{Need}_i$
    2. $\text{Request}_i \le \text{Available}$
    3. Speculative allocation $\to$ Safety evaluation $\to$ Grant or Rollback!

---

### 6. 🔀 Synchronization Lab
Live interactive state-machine visualizers:
1. **Mutex / Spinlock**: Compare busy waiting (spinning) vs sleep locks with real-time spin counters.
2. **Counting & Binary Semaphores**: Watch `wait(S)` decrement and block processes into waiting queues when negative, and `signal(S)` wake them up.
3. **Peterson's Algorithm**: Step-by-step verification of `flag[i]` and `turn` ensuring mutual exclusion.
4. **Bounded Buffer (Producer-Consumer)**: Visual slots with `empty`, `full`, and `mutex` semaphores.
5. **Readers-Writers Problem**: Multiple concurrent readers holding `rw_mutex`, locking out writers until `read_count == 0`.
6. **Dining Philosophers**: Round table with 5 philosophers and 5 chopsticks. Test standard deadlock vs Asymmetric odd/even solution!

---

### 7. 🏰 Memory Palace Mode
Anchors abstract operating systems primitives into vivid stories:
- **PCB**: Student ID Card & Academic Binder at the Registrar's Office.
- **Semaphore**: Railway Track Signal & Flagman with digital counter wheel.
- **Mutex**: Single Bathroom Brass Key at a Busy Coffee Shop.
- **Deadlock**: Four Friends in convertibles at a 4-way Road Intersection.
- **Threads**: Multiple Chefs in the Same Bistro Kitchen sharing the fridge.
- **Context Switch**: The Ancient High Vault Librarian swapping parchment scrolls.
- **Banker's Algorithm**: The Cautious Village Money-Lender running safety drills.

---

### 8. 💻 Production Code Sandbox (C & Java)
Syntax-highlighted, production-grade implementations with line-by-line breakdowns:
- UNIX `fork()`, `execlp()`, and `wait(NULL)` in C
- Windows API `CreateProcess()` and `WaitForSingleObject()`
- POSIX Shared Memory (`shm_open`, `ftruncate`, `mmap`, `shm_unlink`)
- Java Sockets `DateServer` (`ServerSocket` & `Socket`)
- POSIX Pthreads (`pthread_create`, `pthread_join`, 10-thread parallel join)
- Implicit Threading with OpenMP (`#pragma omp parallel for`)
- Peterson's Solution in C

---

### 9. 💼 300 FAANG Interview Questions
Categorized into **100 Easy**, **100 Medium**, and **100 Hard**:
- Concise answers
- Deep technical rationales
- Probing interviewer follow-up questions
- Filterable by difficulty and topic

---

### 10. 🎯 Exam Master Mode (SRM University Pattern)
Categorized into:
- **2 Marks**: Concise definitions (Convoy effect, Dispatch latency, Zombie/Orphan, Race conditions, Safe state).
- **5 Marks**: Architectural comparisons (Program vs Process, Preemptive vs Non-Preemptive, Amdahl's Law derivation).
- **10 Marks**: Algorithmic proofs (Peterson's 3-requirement proof, Deadlock Detection algorithm, MLFQ).
- **13 & 16 Marks**: Full university problems (Banker's Algorithm derivation with numerical, CPU scheduling comparison table with 4 Gantt charts).
- Official SRM marking rubrics included for every question.

---

### 11. ⚡ Flashcards & Adaptive Quiz Engine
- **3D Flip Flashcards**: Front question / back answer, categorized by difficulty with spaced-repetition ratings.
- **Adaptive Quiz**:
  - Multiple Choice Questions (MCQ)
  - Fill in the Blanks
  - Assertion & Reason
  - Match the Following
  - Numerical Calculation problems with live tolerance checking.

---

### 12. 🤖 Gemini AI Studio Integration
Integrated directly with Google's **Gemini 2.0 Flash / 1.5 Flash API**:
1. **Ask OS Professor**: Ask any conceptual doubt and receive academic explanations with C/Java code snippets.
2. **AI Subjective Exam Grader**: Paste your written answer to any 2, 5, 10, or 16-mark question; Gemini evaluates it against the official SRM marking rubric, assigns a score, flags missing keywords, and gives examiner tips!
3. **FAANG Mock Technical Interviewer**: Simulates a live systems engineering interview with probing follow-ups.

**To add your API Key**:
1. Get a free API key from [Google AI Studio](https://aistudio.google.com/).
2. Click **"Add AI Studio Key"** in the top navigation bar.
3. Paste your key and click **Save & Connect**.
*(The key is stored strictly on your local browser in `localStorage`)*.

---

## 📊 Comprehensive Content Verification Checklist

| Topic / Requirement from SRM Uploaded Materials | Covered in Platform | Platform Location |
|---|:---:|---|
| **Course Learning Rationale CLR-3 & CLO-3** | ✅ | Home & Schedulers Module |
| **Process Concept (Text, Data, Heap, Stack, PC, Registers)** | ✅ | Unit Explorer #1 & Memory Canvas |
| **Program vs Process (Passive vs Active)** | ✅ | Unit Explorer #2 |
| **Process in Memory Layout (0 to Max Address growth)** | ✅ | Unit Explorer #3 & Interactive Diagram |
| **5-State Process Machine (New, Ready, Running, Waiting, Terminated)** | ✅ | Unit Explorer #4 & Animated SVG State Machine |
| **Process Control Block (PCB / Task Control Block fields)** | ✅ | Unit Explorer #5 & Memory Palace |
| **Context Switch (P0 save, P1 load, idle overhead, hardware registers)** | ✅ | Unit Explorer #6 & Visual Diagram |
| **Linux `struct task_struct` (pid, state, time_slice, mm, files, current)** | ✅ | Unit Explorer #7 & Code Sandbox |
| **Scheduling Queues (Job queue, Ready queue, Device queues, diagram)** | ✅ | Unit Explorer #8 & Queueing Flow |
| **Schedulers (Short-term, Medium-term swapping, Long-term degree)** | ✅ | Unit Explorer #9 & Schedulers Hierarchy |
| **Mobile Multitasking (iOS foreground limits vs Android services)** | ✅ | Unit Explorer #10 |
| **Process Creation (`fork`, `exec`, `wait`, Windows `CreateProcess`)** | ✅ | Unit Explorer #11 & C Code Sandbox |
| **Linux Process Tree (`init` PID 1, `login`, `bash`, `ps`, `emacs`)** | ✅ | Unit Explorer #11 & Tree Diagram |
| **Process Termination (`exit`, `abort`, Cascading, Zombies, Orphans)** | ✅ | Unit Explorer #12 & Flashcards |
| **Google Chrome Multiprocess Architecture (Browser, Renderer Sandbox, Plugin)**| ✅ | Unit Explorer #13 |
| **IPC Models (Shared Memory vs Message Passing)** | ✅ | Unit Explorer #14 & Side-by-Side Diagram |
| **Producer-Consumer Bounded Buffer Circular Array (`in`, `out`, `SIZE-1`)** | ✅ | Unit Explorer #15 & Sync Simulator #4 |
| **Message Passing (Direct, Indirect mailboxes, Rendezvous, Buffering)** | ✅ | Unit Explorer #16-17 |
| **POSIX Shared Memory C Code (`shm_open`, `ftruncate`, `mmap`, `shm_unlink`)**| ✅ | Unit Explorer #18 & Code Sandbox |
| **Mach Microkernel IPC & Windows Local Procedure Calls (LPC <= 256B)** | ✅ | Unit Explorer #19 |
| **Sockets & Java DateServer (`ServerSocket`, `Socket`, TCP, UDP, Multicast)** | ✅ | Unit Explorer #20 & Java Code Sandbox |
| **Remote Procedure Calls (Stubs, Marshalling, MIDL, XDR Endianness)** | ✅ | Unit Explorer #21 |
| **Ordinary Pipes (`fd[0]`, `fd[1]`) vs Named Pipes (FIFOs)** | ✅ | Unit Explorer #22 |
| **Threads Architecture (Shared Code/Data/Files vs Private Stack/PC/Regs)** | ✅ | Unit Explorer #23 & Memory Palace |
| **Multicore Programming Challenges & Amdahl's Law Formula** | ✅ | Unit Explorer #24 & Numerical Quiz |
| **Thread Models (Many-to-One, One-to-One, Many-to-Many, Two-Level)** | ✅ | Unit Explorer #25 & Match Question |
| **Thread Libraries (POSIX Pthreads, Windows C, Java Runnable)** | ✅ | Unit Explorer #26 & Code Sandbox |
| **Implicit Threading (Thread Pools, OpenMP `#pragma`, Apple GCD)** | ✅ | Unit Explorer #27 & Code Sandbox |
| **Threading Issues (fork/exec, Signals, Cancellation, TLS, Upcalls)** | ✅ | Unit Explorer #28 |
| **Windows Threads (`ETHREAD`, `KTHREAD`, `TEB`) & Linux `clone()` flags** | ✅ | Unit Explorer #29 |
| **Race Conditions (Assembly interleaving `counter++` / `counter--` $\to$ 4 or 6)**| ✅ | Unit Explorer #30 & Visual Trace |
| **Critical Section Problem (Entry, CS, Exit, Remainder; ME, Progress, Bounded)**| ✅ | Unit Explorer #31 |
| **Peterson's Solution (Two processes, `turn`, `flag[2]`, complete proof)** | ✅ | Unit Explorer #32 & Peterson Simulator |
| **Hardware Synchronization (`test_and_set`, `compare_and_swap`, Bounded Lock)**| ✅ | Unit Explorer #33 & Code Sandbox |
| **Mutex Locks & Spinlocks (`acquire`, `release`, `available`)** | ✅ | Unit Explorer #34 & Mutex Simulator |
| **Semaphores (`wait`, `signal`, non-busy waiting queue, `block`, `wakeup`)**| ✅ | Unit Explorer #35 & Semaphore Simulator |
| **Classic Problems (Readers-Writers 1st/2nd var, Dining Philosophers)** | ✅ | Unit Explorer #36 & Sync Visualizers |
| **Monitors (`x.wait`, `x.signal`, Hoare vs Mesa, ResourceAllocator)** | ✅ | Unit Explorer #37 |
| **CPU Scheduling Criteria (Utilization 40-90%, Throughput, TAT, WT, RT)** | ✅ | Unit Explorer #38 & CPU Simulator |
| **FCFS Scheduling Numerical 1 (Convoy Effect, AWT = 17ms)** | ✅ | Unit Explorer #39 & CPU Simulator Preset 1 |
| **FCFS Scheduling Numerical 2 (P2, P3, P1 reordered, AWT = 3ms)** | ✅ | Unit Explorer #39 & CPU Simulator Preset 2 |
| **SJF Non-Preemptive Numerical (Varied arrival, AWT = 4ms, ATAT = 8ms)** | ✅ | Unit Explorer #40 & CPU Simulator Preset 3 |
| **SRTF Preemptive SJF Numerical (Same arrival, AWT = 3ms, ATAT = 7ms)** | ✅ | Unit Explorer #41 & CPU Simulator Preset 4 |
| **Priority Scheduling (Non-Preemptive A, B, C numerical, AWT = 3.3ms)** | ✅ | Unit Explorer #42 & CPU Simulator Preset 5 |
| **Priority Preemptive 7 Processes Numerical (SRM Slide 21 table)** | ✅ | Unit Explorer #42 & CPU Simulator Preset 6 |
| **Starvation & Aging Technique** | ✅ | Unit Explorer #42 |
| **Round Robin Numerical 1 ($q=4$, AWT = 5.6ms)** | ✅ | Unit Explorer #43 & CPU Simulator Preset 7 |
| **Round Robin Numerical 2 ($q=20$, AWT = 73ms, ATAT = 113.5ms)** | ✅ | Unit Explorer #43 & CPU Simulator Preset 8 |
| **Time Quantum vs Context Switches Diagram (Process=10; $q=12, 6, 1$)** | ✅ | Unit Explorer #43 |
| **Multilevel Queue (Foreground RR 80% + Background FCFS 20%; 5 queues)**| ✅ | Unit Explorer #44 |
| **Multilevel Feedback Queue (Q0 $q=8$, Q1 $q=16$, Q2 FCFS)** | ✅ | Unit Explorer #45 & CPU Simulator Preset 9 |
| **Real-Time CPU Scheduling (Soft vs Hard, Interrupt & Dispatch Latencies)**| ✅ | Unit Explorer #46 & Conflict Phase Diagram |
| **Rate Monotonic Scheduling Example 1 (P1 50/20, P2 100/35, U=75%)** | ✅ | Unit Explorer #47 & Realtime Comparison |
| **RMS Missed Deadline Example 2 (P1 50/25, P2 80/35, U=94%, misses 80)** | ✅ | Unit Explorer #47 & Realtime Timeline |
| **Earliest Deadline First (EDF) Dynamic Scheduling (Solves RMS failure)**| ✅ | Unit Explorer #48 & Realtime Timeline |
| **Deadlock Definition (P1 holds R1 wants R2; P2 holds R2 wants R1)** | ✅ | Unit Explorer #49 & Deadlock Visualizer |
| **Four Deadlock Conditions (Mutual Exclusion, Hold & Wait, No Preempt, CW)**| ✅ | Unit Explorer #50 & Exam Master |
| **Resource Allocation Graph (Request edges, Assignment edges, dots)** | ✅ | Unit Explorer #51 & RAG Canvas |
| **RAG Cycle vs Deadlock (Slide 51 Deadlock vs Slide 52 Cycle with No Deadlock)**| ✅ | Unit Explorer #51 & RAG Presets 2 & 3 |
| **Three Deadlock Handling Methods (Ignore/Ostrich, Prevent/Avoid, Detect/Recover)**| ✅ | Unit Explorer #52 |
| **Deadlock Prevention (Negating each condition, Ordering $F: R \to N$)** | ✅ | Unit Explorer #53 & Exam Master 5M |
| **Deadlock Avoidance & Safe State (Venn diagram: Safe $\subset$ Unsafe)** | ✅ | Unit Explorer #54 |
| **Single Resource Type Table Example (Free 3; A req 1 unsafe, B & C safe)**| ✅ | Unit Explorer #54 |
| **RAG with Claim Edges (Dashed lines, conversion cycle $\to$ unsafe)** | ✅ | Unit Explorer #55 & RAG Preset 4 |
| **Banker's Algorithm Data Structures (`Available`, `Max`, `Allocation`, `Need`)**| ✅ | Unit Explorer #56 & Banker Simulator |
| **Banker's Safety Algorithm Steps & Safe Sequence** | ✅ | Unit Explorer #56 & Banker Simulator |
| **Banker's Resource-Request Algorithm (Speculative allocation & Safety)**| ✅ | Unit Explorer #56 & Banker Simulator |
| **Banker's Snapshot Numerical ($P_0..P_4$, A=10, B=5, C=7, $P_1$ req (1,0,2))**| ✅ | Unit Explorer #56 & Banker Preset |
| **Deadlock Detection (Wait-For Graph $O(n^2)$ single instance)** | ✅ | Unit Explorer #57 & RAG Reducer |
| **Deadlock Detection Multiple Instances Algorithm & Numerical** | ✅ | Unit Explorer #57 & Exam Master 10M |
| **Deadlock Recovery (Process termination: 6 criteria; Resource Preemption)**| ✅ | Unit Explorer #58 & Flashcards |

---

## 🏆 Summary

With **OS Master**, all materials from the uploaded SRM University Unit 2 and Unit 3 presentations have been transformed into an interactive learning engine. Zero concepts have been skipped, and the platform stands ready for exam revision, coding practice, simulator exploration, and FAANG interview preparation.
