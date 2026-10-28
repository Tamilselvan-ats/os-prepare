// =============================================================================
// UNIT 2: PROCESS MANAGEMENT - EXHAUSTIVE LEARNING DATA
// Sourced strictly from SRM University 21CSC202J Course Material & Galvin 9th Ed.
// ZERO CONTENT OMISSION GUARANTEED
// =============================================================================

window.UNIT2_DATA = [
  {
    id: "process-concept",
    title: "Process Concept & Structure",
    unit: 2,
    badge: "Core OS Primitive",
    beginner: "Imagine a recipe book sitting on your kitchen shelf. That's a program—just ink on paper doing nothing. But when you start cooking the recipe in the kitchen with your hands, oven, and bowls, that active cooking in progress is a 'Process'!",
    college: "A process is formally defined as a program in execution. While a batch system executes 'jobs' and a time-shared system executes 'user programs' or 'tasks', modern operating systems use 'job' and 'process' almost interchangeably. Process execution must strictly progress in sequential fashion. A process in memory is structured into: 1. Text Section (compiled machine code), 2. Current Activity (Program Counter and processor registers), 3. Stack (temporary data including function parameters, return addresses, and local variables), 4. Data Section (global variables), and 5. Heap (memory dynamically allocated during run time).",
    interview: "FAANG interviewers look for the distinction between static storage and dynamic execution context. A process is an active entity with its own isolated virtual address space, memory descriptors, file handles, and hardware context. Be ready to explain how fork() creates a duplicate address space with Copy-on-Write (COW), how the stack grows downwards towards lower addresses while the heap grows upwards towards higher addresses, and how memory fragmentation occurs when stack and heap collide.",
    mnemonic: "T-D-H-S (Top Down, Huge Storage) -> Text, Data, Heap, Stack. Or 'The Doctor Heals Souls' (Text, Data, Heap, Stack).",
    analogy: "Restaurant: The written recipe card in the drawer is the Program. The active chef chopping veggies, running between stove and counter following the recipe step-by-step, is the Process.",
    mistakes: "Confusing program size on disk with process size in memory. Students forget that a process also allocates dynamic memory (heap) and execution frames (stack) at runtime, so its footprint is much larger than the static .exe file.",
    examPoints: [
      "Define Process: A program in execution progressing in sequential fashion (2 Marks).",
      "List the components of a process in memory: Text, Data, Heap, Stack (2 Marks).",
      "Differentiate between Batch Jobs and Time-Shared Tasks (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Memory Segments in C",
      snippet: `#include <stdio.h>
#include <stdlib.h>

int global_var = 100;          // Stored in DATA section
int uninit_var;                // Stored in BSS (Data section)

int main(int argc, char *argv[]) {
    int local_var = 10;        // Stored on STACK
    int *heap_var = (int*)malloc(sizeof(int)); // Memory on HEAP
    *heap_var = 50;

    printf("Text (main function): %p\\n", main);
    printf("Data (global_var):    %p\\n", &global_var);
    printf("Heap (heap_var):      %p\\n", heap_var);
    printf("Stack (local_var):    %p\\n", &local_var);

    free(heap_var);
    return 0;
}`,
      explanation: "Notice the pointer addresses: Text and Data reside at lowest memory addresses, Heap allocates above Data and grows upward, whereas Stack allocates near the maximum user virtual address and grows downward!"
    }
  },
  {
    id: "program-vs-process",
    title: "Program vs. Process",
    unit: 2,
    badge: "Foundational Distinction",
    beginner: "A music sheet on paper is a program. A musician actually playing that music on an instrument is a process. If three musicians play the same music sheet together, you have one program but three separate processes!",
    college: "A program is a passive entity, such as a file containing a list of instructions stored on secondary disk (an executable file like a.out or file.exe). In contrast, a process is an active entity, with a program counter specifying the next instruction to execute and a set of associated hardware and memory resources. A program becomes a process when an executable file is loaded into main memory. Execution of a program is initiated via GUI mouse clicks, command-line entry of its name, or system calls. Crucially, one single program can spawn several processes: for example, multiple users running independent instances of the same text editor (e.g. emacs or vim) or web browser.",
    interview: "In systems design interviews, explain how modern OSs optimize multiple processes running the same executable through shared read-only text segments (re-entrant code) while assigning distinct, private data, heap, and stack pages to each process via virtual memory page tables.",
    mnemonic: "PASS-ACT: Program is PASSive on disk, Process is ACTive in RAM.",
    analogy: "School: The textbook printed syllabus is the Program. A classroom of 40 students actively studying chapter 3 with their own private notebooks and pencils represents 40 concurrent Processes.",
    mistakes: "Thinking that running the same program twice uses twice as much physical RAM for the code. The operating system shares the read-only Text segment across both processes and only duplicates the stack, data, and heap.",
    examPoints: [
      "Compare Program and Process with at least 4 differences (5 Marks).",
      "Can one program be associated with multiple processes? Explain with an example (2 Marks).",
      "How is a program loaded into memory to become a process? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Multiple Processes from Single Program",
      snippet: `#include <stdio.h>
#include <unistd.h>

int main() {
    pid_t pid = fork();
    if (pid == 0) {
        printf("I am Child process (PID: %d), executing same program!\\n", getpid());
    } else {
        printf("I am Parent process (PID: %d), executing same program!\\n", getpid());
    }
    return 0;
}`,
      explanation: "Both parent and child share the identical program text code loaded into memory, yet maintain distinct process identities (PIDs) and independent execution states."
    }
  },
  {
    id: "process-in-memory",
    title: "Process in Memory Layout",
    unit: 2,
    badge: "Architecture Diagram",
    beginner: "Think of your backpack: at the bottom you put heavy books that never move (Text and Data). In the middle you leave empty room. At the top you put snacks you eat quickly (Stack). As you pack more snacks, the top expands downward; as you add notes, the middle expands upward!",
    college: "When an operating system allocates memory for a process, the address space is partitioned into distinct segments: Address 0 at the bottom contains the Text section (compiled instructions). Directly above text is the Data section, containing initialized global and static variables, followed by uninitialized data (BSS). Above data lies the Heap, which expands upwards towards higher memory addresses via malloc()/new or brk()/sbrk(). At the top of user address space (max memory) resides the Stack, which dynamically grows downwards towards lower memory addresses with every function call (pushing stack frames containing return addresses, parameters, and local variables). The unallocated space between Heap and Stack allows both to grow dynamically without collision.",
    interview: "Interviewers frequently probe Stack Overflow vs Out of Memory errors. Explain what happens when the stack pointer meets the heap break pointer: the OS cannot satisfy further page allocation and throws a SIGSEGV (segmentation fault) or stack exhaustion error.",
    mnemonic: "Text -> Data -> Heap -> [Unallocated Gap] <- Stack (0 to MAX). Remember 'To Do Great Studies' (Text, Data, Growth gap, Stack).",
    analogy: "Hospital: Ground floor has permanent surgery equipment (Text). 1st floor has medicine inventory (Data). 2nd floor has temporary admitting beds expanding up (Heap). Top floor has emergency triage teams descending down to handle calls (Stack).",
    mistakes: "Drawing the Stack at address 0 and Text at Max. Remember Text is at address 0 (bottom) and Stack grows downwards from the top (Max address).",
    examPoints: [
      "Draw and label the neat diagram of a Process in Memory (5 Marks / SRM Slide 6).",
      "Explain the direction of growth for Stack and Heap (2 Marks).",
      "What is stored in the Data section vs the Text section? (2 Marks)."
    ],
    diagram: "process-memory-layout"
  },
  {
    id: "process-states",
    title: "Process States & Lifecycle",
    unit: 2,
    badge: "5-State Model",
    beginner: "Think of a student's school day: 1. Enrollment (New) -> 2. Sitting at desk waiting for teacher (Ready) -> 3. Answering questions on blackboard (Running) -> 4. Sent to library to get a book (Waiting) -> 5. Graduation (Terminated)!",
    college: "As a process executes, it transitions through discrete operational states: 1. NEW: The process is being created. 2. READY: The process is waiting to be assigned to a CPU core by the short-term scheduler. 3. RUNNING: Instructions are actively being executed on the CPU. 4. WAITING (or Blocked): The process is waiting for some event to occur (such as an I/O completion or reception of a signal). 5. TERMINATED: The process has finished execution. Transitions occur via explicit events: 'admitted' moves New to Ready; 'scheduler dispatch' moves Ready to Running; 'interrupt' (e.g. time-slice expiration) preempts Running back to Ready; 'I/O or event wait' moves Running to Waiting; 'I/O or event completion' returns Waiting to Ready; and 'exit' transitions Running to Terminated.",
    interview: "A classic FAANG trap: 'Can a process transition directly from Waiting to Running?' The answer is absolutely NO! A process waking up from I/O completion must first enter the READY queue and await short-term scheduler dispatch. Be ready to explain the state transition matrix and where context switches occur.",
    mnemonic: "N-R-R-W-T -> 'No Rude Runners Want Trophies' (New, Ready, Running, Waiting, Terminated).",
    analogy: "Cricket Match: New = Batsman putting on pads in pavilion. Ready = Batsman standing at boundary waiting for next wicket. Running = Batsman actively batting on pitch. Waiting = Rain delay / third umpire review. Terminated = Batsman out and walked back to pavilion.",
    mistakes: "Drawing an arrow directly from Waiting to Running. An I/O-completed process can NEVER jump directly onto the CPU—it must wait in the Ready queue for the CPU scheduler!",
    examPoints: [
      "Draw the 5-state process diagram with all transition labels (5 Marks / SRM Slide 8).",
      "Define the 5 states of a process (5 Marks).",
      "Explain the difference between Ready state and Waiting state (2 Marks)."
    ],
    diagram: "process-state-machine"
  },
  {
    id: "pcb",
    title: "Process Control Block (PCB)",
    unit: 2,
    badge: "Kernel Data Structure",
    beginner: "A PCB is like your Student ID Card or Hospital Patient File. It holds your name, photo, doctor's notes, blood pressure, bed number, and list of medicines so any nurse or doctor can take over your care instantly!",
    college: "Each process in the operating system is represented by a Process Control Block (PCB), also called a Task Control Block (TCB). The PCB serves as the repository for all information required to stop and restart the process: 1. Process State (new, ready, running, waiting, etc.), 2. Program Counter (location of next instruction to execute), 3. CPU Registers (accumulators, index registers, stack pointers, general-purpose registers, condition codes), 4. CPU-Scheduling Information (process priority, pointers to scheduling queues), 5. Memory-Management Information (base/limit registers, page tables or segment tables), 6. Accounting Information (CPU time used, elapsed clock time, time limits, process account number), 7. I/O Status Information (list of I/O devices allocated, open file descriptors table).",
    interview: "Interviewers ask how PCB sizes impact context switch latency. If the PCB is bloated or if CPU register states are large (e.g., AVX-512 vector registers), saving and restoring PCB context costs hundreds of nanoseconds. Also expect questions on where PCBs reside: in locked kernel memory space inaccessible to user programs.",
    mnemonic: "S-P-R-S-M-A-I: State, PC, Registers, Scheduling, Memory, Accounting, I/O.",
    analogy: "Railway Station: The Train Dispatch Manifest (PCB) contains Train Number (PID), Current Track (State), Next Signal (PC), Engine Power (Registers), Express vs Passenger Priority (Scheduling Info), Platform Allocation (Memory Info), and Cargo Manifest (Open Files).",
    mistakes: "Thinking the PCB stores the program code itself. The PCB only stores metadata, pointers, and CPU register state; the actual executable code resides in the Text section.",
    examPoints: [
      "What is a Process Control Block? List any six fields contained in a PCB (5 Marks / SRM Slide 9).",
      "Why is accounting information stored in the PCB? (2 Marks).",
      "Explain the role of the Program Counter within the PCB (2 Marks)."
    ],
    diagram: "pcb-architecture"
  },
  {
    id: "context-switching",
    title: "CPU Switch & Context Switching",
    unit: 2,
    badge: "OS Overhead Analysis",
    beginner: "Imagine reading Book A. Your friend interrupts you to read Book B. You place a bookmark in Book A, write down the line number, close it, open Book B to its bookmark, and start reading. That swapping time where you read zero pages is 'Context Switch Overhead'!",
    college: "Switching the CPU to another process requires performing a state save of the current running process into its PCB and a state restore of the newly selected process from its PCB. This operation is known as a Context Switch. When an interrupt or system call occurs, the kernel saves the context of Process P0 into PCB0, switches to kernel mode, schedules Process P1, reloads PCB1 into hardware registers, and switches back to user mode. During context switching, the CPU does no useful work; hence, context-switch time is pure overhead. Context switch latency depends heavily on memory speed, the number of registers that must be copied, and hardware architecture support (such as processors providing multiple sets of register banks).",
    interview: "A frequent senior systems question: What is the true cost of a context switch beyond register saving? Answer: Cache pollution and TLB (Translation Lookaside Buffer) flushes! When process address spaces switch, CPU cache lines become invalid, causing severe memory latency spikes upon resuming execution.",
    mnemonic: "S-I-R-E: Save P0 -> Idle/OS -> Reload P1 -> Execute P1.",
    analogy: "Hospital Emergency Room: A doctor stops treating Patient A, writes down their vitals on Chart A (State Save), washes hands and picks up Chart B (OS Overhead), and begins examining Patient B (State Restore).",
    mistakes: "Assuming context switching does useful user computation. It is strictly non-productive OS overhead. Excessive context switching (thrashing) reduces system throughput to near zero.",
    examPoints: [
      "Explain the sequence of operations during a CPU switch from process to process with a neat timing diagram (10 Marks / SRM Slide 10).",
      "What is context switch latency? Why is it considered pure overhead? (2 Marks).",
      "How does hardware architecture affect context switch speed? (2 Marks)."
    ],
    diagram: "context-switch-flow"
  },
  {
    id: "linux-task-struct",
    title: "Linux Process Representation: task_struct",
    unit: 2,
    badge: "Kernel Source Code",
    beginner: "Inside the Linux operating system, every running process has a digital identity card written in C code called 'task_struct'. It records everything about the process from its family tree to open files!",
    college: "In the Linux operating system, processes are represented internally by the C structure 'struct task_struct' (defined in <linux/sched.h>). The primary fields highlighted in syllabus include: 'pid_t pid' (process identifier), 'long state' (-1 unrunnable, 0 runnable, >0 stopped), 'unsigned int time_slice' (scheduling quantum information), 'struct task_struct *parent' (pointer to this process's parent), 'struct list_head children' (pointers to this process's children list), 'struct files_struct *files' (list of open file descriptors), and 'struct mm_struct *mm' (address space descriptor pointing to page tables). All active tasks in Linux are organized in a circular doubly linked list. The kernel maintains a global pointer named 'current' which points directly to the task_struct of the process currently executing on the CPU.",
    interview: "FAANG Linux kernel interviewers love asking about `current`. In x86, how is `current` resolved quickly? In modern Linux kernels, `current` is stored in a per-CPU register/thread-info segment register (`%gs` or `%fs`) for instantaneous $O(1)$ dereferencing without searching the process tree.",
    mnemonic: "P-S-T-P-C-F-M -> 'Prime System Tasks Provide Clean File Management' (pid, state, time_slice, parent, children, files, mm).",
    analogy: "Corporate Hierarchy: Every employee has an HR record (`task_struct`) with Employee ID (`pid`), Status (`state`), Shift Allocation (`time_slice`), Direct Manager (`*parent`), Subordinates (`children`), Office Keys (`*files`), and Office Floor Plan (`*mm`).",
    mistakes: "Thinking Linux maintains completely separate internal structures for processes and threads. In Linux, both are represented as `task_struct` (threads are just tasks that share their `mm` address space and `files`).",
    examPoints: [
      "Describe the Linux process representation using the C structure task_struct (5 Marks / SRM Slide 12).",
      "What is the function of the 'current' pointer in Linux? (2 Marks).",
      "Explain the role of struct mm_struct and struct files_struct in Linux (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Linux task_struct Definition (Slide 12)",
      snippet: `// Represented by the C structure task_struct in Linux kernel
struct task_struct {
    pid_t pid;                      /* process identifier */
    long state;                     /* state of the process */
    unsigned int time_slice;        /* scheduling information */
    struct task_struct *parent;     /* this process's parent */
    struct list_head children;      /* this process's children */
    struct files_struct *files;     /* list of open files */
    struct mm_struct *mm;           /* address space of this process */
};

// Pointer to currently running process
extern struct task_struct *current;`,
      explanation: "Each task_struct points to its parent and children, forming the entire process tree, and references open files and memory address spaces."
    }
  },
  {
    id: "process-scheduling-queues",
    title: "Process Scheduling Queues & Migration",
    unit: 2,
    badge: "Queueing Architecture",
    beginner: "Think of an amusement park: people enter the park gates (Job Queue). Those waiting in line for the roller coaster are in the Ready Queue. Those waiting in line to buy ice cream or use the restroom are in Device Queues!",
    college: "To maximize CPU utilization and provide responsive time-sharing, the operating system maintains multiple scheduling queues: 1. Job Queue: consists of all processes in the entire system. 2. Ready Queue: set of all processes residing in main memory, ready and waiting to execute on the CPU. The ready queue is typically stored as a linked list whose header contains pointers to the first and final PCBs. 3. Device Queues: set of processes waiting for an individual I/O device (e.g., disk unit, magnetic tape unit, terminal). Processes continuously migrate among the various queues throughout their lifetime as depicted in the OS Queueing Diagram (Ready Queue -> CPU -> I/O queue / time slice expired / fork a child / wait for interrupt).",
    interview: "Be prepared to explain queue data structures in real-world kernels. Linux CFS (Completely Fair Scheduler) does not use a FIFO linked list for its ready queue; it uses a Red-Black Tree keyed by virtual runtime (vruntime) to achieve $O(\\log N)$ insertion and $O(1)$ minimum-search time.",
    mnemonic: "J-R-D: Job Queue (All) -> Ready Queue (RAM) -> Device Queue (I/O).",
    analogy: "Bank: All citizens who hold bank accounts (Job Queue). Customers standing in line in front of teller counter (Ready Queue). Customers sitting at the side desk waiting for loan documents to be photocopied (Device Queue).",
    mistakes: "Believing that device queues are shared globally across all devices. Each hardware device (disk 0, terminal 0, tape 1) has its own independent device queue.",
    examPoints: [
      "Differentiate between Job Queue, Ready Queue, and Device Queue (5 Marks / SRM Slide 13).",
      "Draw the queueing diagram representing queues, resources, and process flows (5 Marks / SRM Slide 15).",
      "Explain how a process migrates between ready and device queues (2 Marks)."
    ],
    diagram: "queueing-diagram"
  },
  {
    id: "schedulers",
    title: "Schedulers & Multiprogramming",
    unit: 2,
    badge: "Scheduler Hierarchy",
    beginner: "A school principal decides which 100 students get enrolled in school each year (Long-term Job Scheduler). The classroom teacher decides which student speaks next every 30 seconds (Short-term CPU Scheduler). If someone gets sick, the nurse sends them home to rest on bed and return later (Medium-term Swapper)!",
    college: "Operating systems employ up to three levels of schedulers: 1. Short-term Scheduler (or CPU Scheduler): Selects which process in the ready queue executes next and allocates the CPU. It is invoked extremely frequently (every few milliseconds) and must be lightning fast to minimize dispatch overhead. 2. Long-term Scheduler (or Job Scheduler): Selects processes from secondary storage (disk pool) and loads them into memory for execution. It is invoked infrequently (seconds or minutes) and directly controls the 'Degree of Multiprogramming' (the number of processes in memory). 3. Medium-term Scheduler: Added when the degree of multiprogramming needs to decrease. It removes partially executed processes from main memory and stores them on disk (swapping out), and later re-introduces them into memory (swapping in) to continue execution. Process Characterization: Processes are classified as I/O-bound (spends more time doing I/O, many short CPU bursts) or CPU-bound (spends more time doing computations, few very long CPU bursts). The long-term scheduler must strive for a balanced 'process mix'.",
    interview: "Interviewers will ask: 'Why do modern desktop operating systems like Windows and Linux lack a formal long-term scheduler?' Answer: In virtual memory time-sharing systems, every active program is immediately admitted and assigned virtual pages; degree of multiprogramming is managed dynamically via demand paging and medium-term swapping rather than gating entry.",
    mnemonic: "L-M-S: Long (Months/Minutes = Degree), Medium (Swapping to Disk), Short (Milliseconds = CPU dispatch).",
    analogy: "Airport: Long-term scheduler = Air Traffic Control granting clearance for planes to land on the airport tarmac (Memory). Short-term scheduler = Runway controller choosing which plane takes off right now (CPU). Medium-term scheduler = Moving parked planes to the hangar because ramps are congested (Swapping).",
    mistakes: "Stating that short-term schedulers control the degree of multiprogramming. That is strictly the responsibility of the Long-term Scheduler!",
    examPoints: [
      "Compare Short-term, Medium-term, and Long-term schedulers across invocation frequency, speed, and function (10 Marks / SRM Slide 16-17).",
      "What is swapping? Which scheduler performs swapping? (2 Marks).",
      "Distinguish between I/O-bound and CPU-bound processes. Why is a good mix essential? (5 Marks)."
    ],
    diagram: "schedulers-hierarchy"
  },
  {
    id: "mobile-multitasking",
    title: "Multitasking in Mobile Systems (iOS vs Android)",
    unit: 2,
    badge: "Modern Mobile OS",
    beginner: "On your phone, you can only look at one app on screen at a time. iOS and Android handle background apps differently: iOS puts apps to sleep with strict rules, while Android lets special invisible helpers called 'Services' keep working!",
    college: "Mobile operating systems encounter unique hardware constraints due to small physical screen real estate and limited battery capacity: 1. Early iOS Architecture: Provided a single foreground process controlled via the user interface, while background processes were suspended in memory (not on display) with strict limits. Permitted background tasks were confined to: completing a single short task, receiving push notifications, or specific long-running system tasks like audio playback. 2. Android Architecture: Supports concurrent foreground and background execution with fewer limits. Background processes utilize an explicit OS component called a 'Service' to perform long-running background tasks. A Service continues running even if the originating foreground activity is suspended, has no user interface, and consumes minimal memory.",
    interview: "Mobile systems engineers must understand memory reclamation under low-memory pressure: Android's LMK (Low Memory Killer) uses an out-of-memory score (`oom_score_adj`) to terminate background cached processes first, preserving foreground user-interactive apps.",
    mnemonic: "iOS = Single Foreground + Strict Limits; Android = Foreground + Background Services.",
    analogy: "Restaurant Kitchen: iOS allows only one chef in front of customers; assistants in the back can only wash dishes or play background music. Android has one front-facing waiter plus specialized back-office 'Services' managing deliveries non-stop.",
    mistakes: "Thinking early iOS ran true full multitasking for all third-party background applications. It strictly suspended them unless they registered for specific background capabilities (audio, location, VOIP).",
    examPoints: [
      "Explain multitasking architectures in iOS vs Android mobile systems (5 Marks / SRM Slide 18).",
      "What is an Android Service and how does it support background tasks? (2 Marks).",
      "What background operations were permitted in early versions of iOS? (2 Marks)."
    ]
  },
  {
    id: "process-creation",
    title: "Process Creation: fork(), exec(), and Windows API",
    unit: 2,
    badge: "System Calls & Code",
    beginner: "A mother cell dividing into two identical twin cells is like `fork()`. If one twin puts on a completely new uniform to become a firefighter, that transformation is `exec()`!",
    college: "A process may create several new processes via a create-process system call, forming a tree of processes identified by a Process Identifier (PID). The creator is the parent and the new entity is the child. Resource Sharing Options: 1. Parent and children share all resources, 2. Children share a subset of parent's resources, 3. Parent and child share no resources. Execution Options: 1. Parent and children execute concurrently, 2. Parent waits until some or all of its children terminate. Address Space Options: 1. Child duplicate of parent (same program and data), 2. Child has a new program loaded into it. In UNIX: fork() creates a new child process with a duplicate address space (fork returns 0 to child, child PID to parent, <0 on failure). The exec() system call is invoked after fork() to replace the process's memory space with a new program executable. The parent calls wait(&status) to suspend itself until child completes. In Windows: Processes are spawned using CreateProcess() passing STARTUPINFO and PROCESS_INFORMATION structures; synchronization is achieved via WaitForSingleObject(pi.hProcess, INFINITE).",
    interview: "FAANG favorite: What does fork() return and why? It returns twice from a single invocation! It returns 0 in the child process context and returns the child's non-zero PID in the parent context. If fork() fails, it returns -1. Explain Copy-on-Write (COW) optimization where memory pages are marked read-only and shared until either process modifies a page.",
    mnemonic: "F-E-W: Fork (reproduce) -> Exec (re-dress) -> Wait (reap).",
    analogy: "Family Business: Father photocopies the entire store ledger (fork). The son takes his copy, erases it, and turns the store into a bakery (exec). The father waits outside until the son's grand opening finishes (wait).",
    mistakes: "Writing code that expects exec() to return upon success. If exec() succeeds, it never returns because the calling program code is completely overwritten by the new executable!",
    examPoints: [
      "Explain process creation in UNIX using fork(), exec(), and wait() system calls with a complete C code example (10 Marks / SRM Slide 21-24).",
      "Describe process creation using the Windows CreateProcess API (5 Marks / SRM Slide 25).",
      "Trace the Linux process tree starting from init (pid=1) (5 Marks / SRM Slide 22)."
    ],
    code: {
      lang: "c",
      title: "UNIX Process Creation via fork() and exec() (SRM Slide 24)",
      snippet: `#include <sys/types.h>
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid;

    /* fork a child process */
    pid = fork();

    if (pid < 0) { /* error occurred */
        fprintf(stderr, "Fork Failed\\n");
        return 1;
    }
    else if (pid == 0) { /* child process */
        printf("Child executing /bin/ls...\\n");
        execlp("/bin/ls", "ls", NULL);
    }
    else { /* parent process */
        /* parent will wait for the child to complete */
        wait(NULL);
        printf("Child Complete\\n");
    }

    return 0;
}`,
      explanation: "fork() creates an exact clone. The child branch (pid == 0) invokes execlp() to load /bin/ls. The parent branch calls wait(NULL) until the child finishes."
    }
  },
  {
    id: "process-termination",
    title: "Process Termination, Zombies, and Orphans",
    unit: 2,
    badge: "Process Lifecycle",
    beginner: "When a student finishes an exam, they hand their paper to the teacher and wait for grade confirmation (exit and wait). If the teacher leaves the room before taking the paper, the student is an 'Orphan'. If the student turns in the paper but the teacher never reads it, the paper sits on the desk as a 'Zombie'!",
    college: "A process terminates when it finishes executing its final statement and requests the operating system to delete it using the exit() system call. The process may return a status value (integer) to its parent via wait(&status). All allocated process resources (physical memory, open files, I/O buffers) are reclaimed by the OS. A parent may terminate a child using abort() for reasons such as: child has exceeded allocated resources, the task assigned to child is no longer required, or parent is exiting and the OS does not allow a child to continue (cascading termination). Special States: 1. Zombie Process: A process that has terminated, but whose parent has not yet called wait(). Its entry in the process table remains so the parent can read the exit status. 2. Orphan Process: A child process whose parent terminated without calling wait(). In modern UNIX systems, orphaned processes are adopted by the root init process (PID 1), which periodically executes wait() to reap them.",
    interview: "How do you kill a zombie process? Trick question! You cannot kill a zombie with `kill -9` because the process is already dead (terminated)! To clear a zombie, you must signal its parent to execute `wait()` or kill the parent so `init` adopts and reaps the zombie.",
    mnemonic: "Z-O: Zombie = Child Dead, Parent Ignoring; Orphan = Parent Dead, Child Wandering.",
    analogy: "Courtroom: When a case concludes, the file sits on the desk (Zombie) until the judge stamps it closed (wait()). If the judge retires mid-trial, the case is reassigned to the Chief Supreme Judge (`init` process) to resolve.",
    mistakes: "Thinking a zombie process consumes CPU cycles. A zombie consumes zero CPU and zero memory; it only occupies an entry in the OS Process Table.",
    examPoints: [
      "Define Zombie and Orphan processes. How does the OS resolve them? (5 Marks / Repeated University Question / SRM Slide 27).",
      "What is cascading termination? Who initiates it? (2 Marks).",
      "State three reasons why a parent terminates its child using abort() (5 Marks / SRM Slide 26)."
    ]
  },
  {
    id: "chrome-multiprocess",
    title: "Multiprocess Architecture: Google Chrome Browser",
    unit: 2,
    badge: "Real-World Architecture",
    beginner: "Old web browsers were like a single bus: if one passenger sneezed, the entire bus crashed. Google Chrome gives every tab its own independent car! If tab 2 crashes, tab 1 and tab 3 keep driving smoothly!",
    college: "Early web browsers executed as a single-process application. If a single web page containing complex JavaScript encountered an infinite loop or crashed, the entire browser hung or terminated. Google Chrome introduced a multiprocess architecture comprising three distinct process types: 1. Browser Process: Responsible for managing the user interface, disk access, and network I/O. Exactly one browser process runs per browser instance. 2. Renderer Process: Responsible for rendering web pages, processing HTML, CSS, and executing JavaScript. A new renderer process is created for each website opened (or per tab). Renderer processes run inside a restrictive 'sandbox', which isolates them from disk and network I/O to prevent malicious code and security exploits from escaping. 3. Plug-in Process: Created for each distinct type of plug-in (e.g. Flash, PDF reader) to isolate third-party code execution.",
    interview: "Why does Chrome use multiple processes instead of multiple threads for tabs? Address space isolation and security! Threads share memory address space, meaning a memory leak, null-pointer crash, or exploit in one tab could corrupt or read passwords from adjacent tabs. Separate processes guarantee strict hardware-enforced virtual memory isolation.",
    mnemonic: "B-R-P: Browser (UI/Disk/Net), Renderer (HTML/JS Sandbox), Plug-in (Third-party extensions).",
    analogy: "Bank Teller: The bank manager oversees operations (Browser process). Each customer meets an isolated clerk behind bulletproof glass (Renderer sandbox). Outside armored security delivers cash boxes (Plug-in process).",
    mistakes: "Assuming Chrome renderer processes can write directly to the local hard drive. Renderers run strictly inside a sandbox and must ask the Browser Process via IPC to perform disk I/O.",
    examPoints: [
      "Describe the multiprocess architecture of Google Chrome. List the three types of processes and their functions (5 Marks / SRM Slide 28).",
      "Explain the purpose of sandboxing in Chrome's renderer process (2 Marks)."
    ],
    diagram: "chrome-architecture"
  },
  {
    id: "ipc-concept",
    title: "Interprocess Communication (IPC): Models & Needs",
    unit: 2,
    badge: "IPC Core Theory",
    beginner: "If two people want to share information, they can either write on a shared whiteboard in the room (Shared Memory) or send letters through the post office (Message Passing)!",
    college: "Processes executing concurrently in an operating system may be either independent (cannot affect or be affected by other processes) or cooperating (can affect or be affected by other processes, including sharing data). Reasons for process cooperation: 1. Information Sharing (concurrent access to shared files/databases), 2. Computation Speedup (breaking tasks into subtasks running on multiple cores), 3. Modularity (dividing system functions into separate processes/threads), 4. Convenience (user working on multiple tasks simultaneously). Cooperating processes require Interprocess Communication (IPC). The two fundamental communication models are: 1. Shared Memory: A region of shared memory is mapped into the address space of communicating processes. Exchange occurs via standard memory read/write instructions under user process control without kernel intervention. 2. Message Passing: Messages are exchanged between processes via OS kernel system calls (send and receive). Useful for exchanging smaller amounts of data and simpler to implement across networked distributed systems.",
    interview: "Compare IPC performance trade-offs: Shared memory is blazingly fast because kernel intervention is only required during initial memory setup; subsequent reads and writes happen at RAM hardware speed. However, user code must explicitly handle synchronization (locks/semaphores). Message passing avoids concurrency bugs because the kernel serializes messages, but incurs costly user-to-kernel context switch overhead on every send/receive call.",
    mnemonic: "I-C-M-C: Information sharing, Computation speedup, Modularity, Convenience. IPC Models = SM (Shared Memory) vs MP (Message Passing).",
    analogy: "Kitchen: Shared Memory is a common prep table where chefs put chopped vegetables. Message Passing is shouting orders through a ticket window to the line cooks.",
    mistakes: "Thinking the operating system regulates access to shared memory during every read/write. The OS only sets up the shared region; synchronization during access is 100% the responsibility of user processes!",
    examPoints: [
      "Compare Shared Memory and Message Passing IPC models with neat diagrams (10 Marks / SRM Slide 29-30).",
      "List the four primary reasons for providing cooperating processes (5 Marks / SRM Slide 31).",
      "What are the major synchronization issues in shared memory IPC? (2 Marks)."
    ],
    diagram: "ipc-models"
  },
  {
    id: "producer-consumer",
    title: "Producer-Consumer Problem (Shared Memory)",
    unit: 2,
    badge: "Classical Problem",
    beginner: "A baker bakes bread and puts it on a bakery shelf. A customer comes and takes bread from the shelf. If the shelf is completely full, the baker must wait. If the shelf is empty, the customer must wait!",
    college: "The Producer-Consumer problem is a foundational paradigm for cooperating processes: a producer process creates information that is consumed by a consumer process. Two buffer variants exist: 1. Unbounded-Buffer: Places no practical limit on buffer size; consumer waits if empty, but producer can always produce new items. 2. Bounded-Buffer: Assumes a fixed buffer size of BUFFER_SIZE. The shared memory solution uses a circular array `buffer[BUFFER_SIZE]` with two integer pointers: `in` (points to the next free buffer slot) and `out` (points to the first full slot). Buffer Empty condition: `in == out`. Buffer Full condition: `((in + 1) % BUFFER_SIZE) == out`. Crucial limitation: This algorithmic solution can only utilize at most `BUFFER_SIZE - 1` elements simultaneously because if all slots were filled, `in` would equal `out`, becoming indistinguishable from the empty state.",
    interview: "How do you modify the bounded buffer shared memory solution to utilize all BUFFER_SIZE slots? By introducing an integer variable `counter` initialized to 0, incremented on produce and decremented on consume. However, interviewers will immediately ask what happens when counter++ and counter-- run concurrently—leading into Race Conditions!",
    mnemonic: "Empty = `in == out`; Full = `(in + 1) % SIZE == out`; Usable Capacity = `SIZE - 1`.",
    analogy: "Buffet Table: The chef places hot plates at index `in`. Hungry diners pick up plates from index `out`. When index `in` catches up right behind `out`, the table is declared full.",
    mistakes: "Claiming the bounded buffer circular array can hold all BUFFER_SIZE elements. As shown in SRM Slide 33, it can only hold BUFFER_SIZE - 1 elements without an extra counter variable!",
    examPoints: [
      "Write and explain the C algorithm for the Bounded-Buffer Producer and Consumer using shared memory (10 Marks / SRM Slide 33-35).",
      "Why can the shared-memory bounded buffer solution only use BUFFER_SIZE - 1 elements? (2 Marks).",
      "What are the conditions for buffer full and buffer empty in circular array implementation? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Shared Memory Bounded Buffer Algorithm (SRM Slide 33-35)",
      snippet: `#define BUFFER_SIZE 10
typedef struct {
    /* item data */
} item;

item buffer[BUFFER_SIZE];
int in = 0;
int out = 0;

// Producer Process
void producer() {
    item next_produced;
    while (1) {
        /* produce an item in next_produced */
        while (((in + 1) % BUFFER_SIZE) == out)
            ; /* do nothing - buffer is full */
        
        buffer[in] = next_produced;
        in = (in + 1) % BUFFER_SIZE;
    }
}

// Consumer Process
void consumer() {
    item next_consumed;
    while (1) {
        while (in == out)
            ; /* do nothing - buffer is empty */
        
        next_consumed = buffer[out];
        out = (out + 1) % BUFFER_SIZE;
        /* consume the item */
    }
}`,
      explanation: "Circular buffer logic: in advances on production, out advances on consumption. If (in+1)%SIZE == out, producer spins."
    }
  },
  {
    id: "message-passing",
    title: "Message Passing: Direct vs Indirect Communication",
    unit: 2,
    badge: "IPC Primitives",
    beginner: "Direct communication is calling your friend by their personal phone number. Indirect communication is dropping a message into Mailbox #42 where anyone with the key can pick it up!",
    college: "Message passing provides a mechanism for processes to communicate and synchronize without sharing variables. The OS provides two primitive operations: `send(message)` and `receive(message)`. Message sizes may be fixed or variable. To communicate, processes establish a communication link. 1. Direct Communication: Processes must name each other explicitly: `send(P, message)` sends to process P; `receive(Q, message)` receives from process Q. Properties: link is established automatically between exactly one pair of processes; exactly one link exists per pair; link is usually bi-directional. Disadvantage: Hard-coded process identifiers limit modularity (symmetric addressing). 2. Indirect Communication: Messages are sent to and received from mailboxes or ports: `send(A, message)` sends to mailbox A; `receive(A, message)` receives from mailbox A. Properties: Link is established only if processes share a common mailbox; a link may be associated with many processes; each pair may share several links; link may be unidirectional or bidirectional. Mailbox sharing issue: If P1 sends to mailbox A, and both P2 and P3 execute receive(A), who receives the message? Solutions: (a) Allow link to associate with at most 2 processes, (b) Allow only one process at a time to execute receive, (c) Let system arbitrarily choose receiver and notify sender.",
    interview: "Compare port-based message passing to microservices architecture: Explain how UNIX sockets and Mach ports map directly to modern message broker queues (like RabbitMQ/Kafka) where publishers send to an exchange/mailbox and multiple consumer workers compete for messages.",
    mnemonic: "Direct = Name the Person (P, Q); Indirect = Name the Mailbox (Port A).",
    analogy: "Postal Service: Direct = Walkie-Talkie call directly to Bob. Indirect = Dropping a letter into Post Office Box 101, which either Bob or his business partner Alice collects.",
    mistakes: "Assuming direct communication links require manual establishment. Direct communication links are established automatically by the operating system upon issuing send/receive.",
    examPoints: [
      "Differentiate between Direct and Indirect Interprocess Communication (10 Marks / SRM Slide 40-43).",
      "Describe the three solutions to the mailbox sharing problem (5 Marks / SRM Slide 43).",
      "What are the properties of a direct communication link? (2 Marks)."
    ],
    diagram: "direct-vs-indirect-ipc"
  },
  {
    id: "synchronization-buffering",
    title: "Message Passing Synchronization & Buffering",
    unit: 2,
    badge: "Synchronous vs Async",
    beginner: "A synchronous phone call: you talk and wait for the other person to reply right now (blocking). An email: you hit send and immediately go play video games, checking your inbox later (non-blocking)!",
    college: "Message passing communication can be either blocking or non-blocking: 1. Blocking (Synchronous): Blocking send: The sender is blocked until the message is received by the receiving process or mailbox. Blocking receive: The receiver is blocked until a message is available. When both send and receive are blocking, it is called a 'Rendezvous'. 2. Non-blocking (Asynchronous): Non-blocking send: The sender sends the message and resumes execution immediately. Non-blocking receive: The receiver retrieves either a valid message or a null message. Buffering: Messages reside in a temporary queue attached to the communication link, implemented in one of three ways: (a) Zero Capacity: Queue length 0. Link cannot hold messages. Sender must block until receiver receives (rendezvous). (b) Bounded Capacity: Finite queue length of n messages. Sender can proceed if queue has space; sender must block if queue is full. (c) Unbounded Capacity: Infinite queue length. Sender never waits.",
    interview: "Explain what happens when Producer-Consumer is implemented with message passing: It becomes trivial! Producer loops `send(next_produced)` and consumer loops `receive(next_consumed)`. Synchronization is entirely handled by the link's blocking semantics without any explicit mutex locks or boolean flags.",
    mnemonic: "B-S / NB-A: Blocking = Synchronous; Non-Blocking = Asynchronous; Both Block = Rendezvous.",
    analogy: "Fast Food Drive-Thru: Zero Capacity = Window with no queue; chef hands burger directly into customer's hand. Bounded Capacity = Heat lamp holding up to 5 burgers. Unbounded Capacity = Magical infinite shelf where food never piles up.",
    mistakes: "Confusing non-blocking receive with infinite blocking. Non-blocking receive returns immediately with either a message or a NULL/error code.",
    examPoints: [
      "Explain Blocking vs Non-blocking send and receive. What is a rendezvous? (5 Marks / SRM Slide 44).",
      "Describe the three queue capacity buffering options in message passing (5 Marks / SRM Slide 46).",
      "How does message passing make the Producer-Consumer problem trivial? (2 Marks / SRM Slide 45)."
    ]
  },
  {
    id: "posix-shared-memory",
    title: "POSIX Shared Memory API & Implementation",
    unit: 2,
    badge: "Production C Code",
    beginner: "POSIX shared memory lets two separate programs open the exact same whiteboard in RAM using system calls, write words on it, and clean it up when finished!",
    college: "POSIX Shared Memory provides a standardized API for high-performance memory sharing in UNIX/Linux systems. Steps for Producer: 1. Create a shared memory object using `shm_open(name, O_CREAT | O_RDWR, 0666)`. 2. Configure object size in bytes using `ftruncate(shm_fd, 4096)`. 3. Map the shared memory object into process virtual address space using `mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd, 0)`. 4. Write data to the pointer using `sprintf(ptr, message)`. Steps for Consumer: 1. Open the existing shared segment using `shm_open(name, O_RDONLY, 0666)`. 2. Memory map via `mmap(0, SIZE, PROT_READ, MAP_SHARED, shm_fd, 0)`. 3. Read data via `printf(\"%s\", (char *)ptr)`. 4. Remove the shared memory object from system using `shm_unlink(name)`.",
    interview: "Why must `shm_unlink()` be called explicitly? Shared memory segments are kernel-persistent, not process-persistent! If a process terminates without unlinking, the shared memory segment remains allocated in RAM until system reboot.",
    mnemonic: "O-T-M-W-U: Open (`shm_open`) -> Truncate (`ftruncate`) -> Map (`mmap`) -> Write (`sprintf`) -> Unlink (`shm_unlink`).",
    analogy: "Public Notice Board: The town mayor installs a board (shm_open), sets its dimensions (ftruncate), pins notices on it (sprintf/mmap), townsfolk read it, and finally the board is dismantled (shm_unlink).",
    mistakes: "Forgetting to call `ftruncate()`. A newly created POSIX shared memory object has an initial size of 0 bytes; attempting to write to it immediately results in a bus error (SIGBUS).",
    examPoints: [
      "Write complete C programs for POSIX Shared Memory Producer and Consumer (10 Marks / SRM Slide 47-49).",
      "Explain the parameters of shm_open, ftruncate, and mmap system calls (5 Marks).",
      "What is the function of shm_unlink()? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "POSIX Shared Memory Producer & Consumer (SRM Slide 48-49)",
      snippet: `/* POSIX PRODUCER */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <fcntl.h>
#include <sys/shm.h>
#include <sys/stat.h>
#include <sys/mman.h>
#include <unistd.h>

int main() {
    const int SIZE = 4096;
    const char *name = "OS";
    const char *message_0 = "Hello ";
    const char *message_1 = "World!\\n";
    int shm_fd;
    void *ptr;

    shm_fd = shm_open(name, O_CREAT | O_RDWR, 0666);
    ftruncate(shm_fd, SIZE);
    ptr = mmap(0, SIZE, PROT_WRITE, MAP_SHARED, shm_fd, 0);

    sprintf(ptr, "%s", message_0);
    ptr += strlen(message_0);
    sprintf(ptr, "%s", message_1);
    return 0;
}

/* POSIX CONSUMER */
int consumer_main() {
    const int SIZE = 4096;
    const char *name = "OS";
    int shm_fd;
    void *ptr;

    shm_fd = shm_open(name, O_RDONLY, 0666);
    ptr = mmap(0, SIZE, PROT_READ, MAP_SHARED, shm_fd, 0);
    printf("%s", (char *)ptr);
    shm_unlink(name);
    return 0;
}`,
      explanation: "Producer creates memory via shm_open and writes 'Hello World!'. Consumer opens read-only, prints string, and destroys the object via shm_unlink."
    }
  },
  {
    id: "mach-windows-ipc",
    title: "IPC Systems: Mach Microkernel & Windows LPC",
    unit: 2,
    badge: "Commercial OS Internals",
    beginner: "Mach OS makes everything—even talking to the kernel—a postcard sent between letterboxes. Windows uses a fast local telephone line called Local Procedure Call with private extension numbers!",
    college: "1. Mach Microkernel IPC: Mach communication is strictly message-based; even system calls are messages. Each task receives two mailboxes at creation: Kernel Mailbox and Notify Mailbox. Only three system calls are required for message transfer: `msg_send()`, `msg_receive()`, and `msg_rpc()`. Mailboxes are allocated via `port_allocate()`. If a mailbox is full, four options exist: (a) Wait indefinitely, (b) Wait at most n milliseconds, (c) Return immediately, (d) Temporarily cache a message. 2. Windows Advanced Local Procedure Call (LPC): Windows is message-passing centric for processes residing on the same system. It uses communication ports (similar to mailboxes). Communication sequence: (a) Client opens a handle to subsystem's connection port object, (b) Client sends a connection request, (c) Server creates two private communication ports and returns one handle to client, (d) Client and server use corresponding port handles to send messages or listen for replies. For messages <= 256 bytes, a Shared Section Object is used for zero-copy fast transfer.",
    interview: "Why does Windows LPC use a small shared section object (<= 256 bytes) instead of pure message queues? To avoid double-buffering kernel copies! By mapping a tiny shared memory window between caller and callee, local RPC attains speeds comparable to direct function invocations.",
    mnemonic: "Mach = 3 Calls (`send`, `receive`, `rpc`) + 4 Full Options; Windows = Connection Port -> Private Communication Ports + 256B Shared Section.",
    analogy: "Apartment Building: Mach = Building mail slots where all packages are sorted into either Government box or Notice box. Windows LPC = Calling the front desk (Connection Port), who gives you a direct private intercom line (Private Port) to the maintenance room.",
    mistakes: "Thinking Windows LPC works across remote networks. Windows LPC is strictly LOCAL (same machine). Remote calls use network RPC.",
    examPoints: [
      "Explain the Mach microkernel IPC mechanism and four mailbox-full options (5 Marks / SRM Slide 50).",
      "Describe the architecture and sequence of Windows Local Procedure Calls (LPC) with a diagram (5 Marks / SRM Slide 51-52).",
      "What is the maximum message size accommodated by Windows LPC shared section object? (2 Marks)."
    ],
    diagram: "windows-lpc-flow"
  },
  {
    id: "sockets",
    title: "Client-Server Communication: Sockets & Java Implementation",
    unit: 2,
    badge: "Network Programming",
    beginner: "A socket is like an electrical wall outlet where an appliance plugs in. On the internet, your computer's IP address is the building address, and the port number is the specific room or plug where your program talks!",
    college: "A socket is formally defined as an endpoint for network communication. A socket is identified by the concatenation of an IP address and a port number (e.g., 161.25.19.8:1625 refers to port 1625 on host 161.25.19.8). Communication consists of a pair of sockets between two hosts. All ports below 1024 are considered 'well-known' ports reserved for standard network services (e.g. HTTP on port 80, SSH on port 22, FTP on port 21). The special IP address 127.0.0.1 (loopback) refers to the local host machine. Java provides three socket abstractions: 1. Connection-oriented (TCP) using `Socket` and `ServerSocket` classes, 2. Connectionless (UDP) using `DatagramSocket`, 3. `MulticastSocket` class allowing data transmission to multiple recipients simultaneously.",
    interview: "What happens during a TCP 3-way handshake at the socket API level? `ServerSocket.accept()` blocks until the client issues `connect()`. The kernel handles SYN, SYN-ACK, ACK under the hood before returning a new connected `Socket` instance specifically bound to the client's ephemeral port, leaving the original ServerSocket free to listen for new connections.",
    mnemonic: "Socket = IP Address + Port Number. TCP = Connection-oriented; UDP = Connectionless.",
    analogy: "Hotel: The hotel street address is the IP address (161.25.19.8). The room number is the port (1625). You need both to deliver a letter to a specific guest.",
    mistakes: "Confusing loopback IP 127.0.0.1 with an external IP address. 127.0.0.1 never routes packets out to the network interface card; it loops directly within the OS kernel network stack.",
    examPoints: [
      "Define socket. How is a socket identified? Give an example (2 Marks / SRM Slide 54).",
      "What are well-known ports? What is the range of well-known ports? (2 Marks).",
      "Write a complete multithreaded Java DateServer program using ServerSocket and Socket (10 Marks / SRM Slide 56)."
    ],
    code: {
      lang: "java",
      title: "Java Socket DateServer Implementation (SRM Slide 56)",
      snippet: `import java.net.*;
import java.io.*;

public class DateServer {
    public static void main(String[] args) {
        try {
            ServerSocket sock = new ServerSocket(6013);
            /* now listen for connections */
            while (true) {
                Socket client = sock.accept();
                PrintWriter pout = new PrintWriter(client.getOutputStream(), true);

                /* write the Date to the socket */
                pout.println(new java.util.Date().toString());

                /* close the socket and resume listening */
                client.close();
            }
        }
        catch (IOException ioe) {
            System.err.println(ioe);
        }
    }
}`,
      explanation: "ServerSocket listens on port 6013. When accept() returns a connected client socket, it writes the current date string and closes the socket."
    }
  },
  {
    id: "rpc",
    title: "Remote Procedure Calls (RPC)",
    unit: 2,
    badge: "Distributed Systems",
    beginner: "Imagine ordering food on a delivery app: you click 'Order Pizza'. You don't walk to the kitchen or fire the oven yourself; the app packs your request, sends it to the restaurant across town, cooks it, and hands you the hot box as if it happened in your own house!",
    college: "Remote Procedure Call (RPC) abstracts network procedure calls between processes on distributed networked systems, making remote calls appear syntactically identical to local function calls. Components: 1. Client-Side Stub: A proxy on the client that intercepts the call, locates the remote server, and 'marshalls' the parameters (packaging them into a standardized network packet). 2. Server-Side Stub: Receives the network message, unpacks (unmarshalls) the parameters, and invokes the actual procedure on the server. Data Representation: Handled via External Data Representation (XDR) format to resolve architecture discrepancies like Big-Endian (most significant byte first) vs Little-Endian (least significant byte first). Failure Semantics: Remote networks can drop packets; RPC systems provide semantics like 'at-most-once' (ensured by timestamps) or 'exactly-once'. On Windows, stubs are compiled from specifications written in Microsoft Interface Definition Language (MIDL). Service discovery is handled by an OS Matchmaker / Rendezvous daemon.",
    interview: "Why is achieving 'exactly-once' execution notoriously hard in distributed RPC? Network partitions can cause an ACK to be lost after the server has already executed the remote procedure. If the client retries, the server might execute twice unless the procedure is strictly idempotent or guarded by unique request transaction IDs.",
    mnemonic: "S-M-U-S: Stub -> Marshall -> Unmarshall -> Serve (XDR handles Endianness).",
    analogy: "International Embassy: An ambassador speaks English (Client), an interpreter translates and seals the letter into diplomatic format (Client Stub & Marshalling via XDR), the foreign clerk unpacks it (Server Stub), and the Prime Minister acts on it (Server Procedure).",
    mistakes: "Assuming Big-Endian and Little-Endian architectures can exchange raw memory structs directly over sockets without marshalling. Different byte orders will corrupt all multi-byte integers!",
    examPoints: [
      "Explain the working of Remote Procedure Calls (RPC) with a step-by-step diagram showing client, server, and matchmaker (10 Marks / SRM Slide 57-59).",
      "What is marshalling and unmarshalling in RPC? (2 Marks).",
      "What is XDR and why is it required in heterogeneous networks? (2 Marks)."
    ],
    diagram: "rpc-sequence"
  },
  {
    id: "pipes",
    title: "Ordinary Pipes vs Named Pipes",
    unit: 2,
    badge: "UNIX IPC Classic",
    beginner: "An ordinary pipe is a walkie-talkie between a parent and child: only one speaks, the other listens, and when the parent hangs up, the pipe disappears. A named pipe is a permanent metal tube fixed to the town wall: anyone can speak into one side and anyone on the other side can hear!",
    college: "A Pipe acts as a conduit allowing two processes to communicate. 1. Ordinary Pipes (Anonymous Pipes): Allow communication in standard producer-consumer fashion. Unidirectional: one end is the write-end (accessed via file descriptor `fd[1]`), and the other end is the read-end (`fd[0]`). Communication strictly requires a parent-child relationship; ordinary pipes exist only while the creating processes are alive and cannot be accessed from outside. In Windows, these are known as anonymous pipes. 2. Named Pipes: Far more powerful than ordinary pipes. Communication is bidirectional. No parent-child relationship is necessary; several processes can concurrently access and read/write through the named pipe. Named pipes persist in the file system even after communicating processes terminate. Supported in both UNIX (FIFOs created via `mkfifo()`) and Windows systems.",
    interview: "What happens when you read from an empty ordinary pipe or write to a full pipe? In UNIX, reading from an empty pipe blocks until data is written. If all write descriptors are closed, `read()` returns 0 (EOF). If a process writes to a pipe whose read-end is closed, the kernel raises a `SIGPIPE` signal which terminates the process unless caught!",
    mnemonic: "Ordinary = Parent-Child, 1-Way, Temporary (`fd[0]` read, `fd[1]` write); Named = Anyone, 2-Way, File System Persistent.",
    analogy: "Plumbing: Ordinary Pipe = A flexible hose connecting kitchen sink to drain. Named Pipe = A public pipeline with valves where multiple buildings can connect water taps.",
    mistakes: "Mixing up file descriptors: `fd[0]` is for READING and `fd[1]` is for WRITING. Remember: 0 looks like an Open mouth to read/eat; 1 looks like a Pen to write!",
    examPoints: [
      "Compare Ordinary Pipes and Named Pipes across directionality, relationships, and persistence (5 Marks / SRM Slide 60-62).",
      "Which file descriptor is used for reading and which for writing in UNIX ordinary pipes? (2 Marks).",
      "What are anonymous pipes in Windows? (2 Marks)."
    ],
    diagram: "pipes-architecture"
  },
  {
    id: "threads-overview",
    title: "Thread Concept, Architecture & Benefits",
    unit: 2,
    badge: "Lightweight Execution",
    beginner: "A process is like an entire house with a kitchen, living room, and electricity. Threads are the people living inside the house: they share the same kitchen and living room (code and data), but each person has their own brain and hands doing different chores!",
    college: "A thread is a fundamental unit of CPU utilization that forms the basis of multithreaded computer systems. A thread comprises: a Thread ID, a Program Counter, a Register set, and a Stack. It shares with other threads belonging to the same process its: Code section (text), Data section (globals), and OS resources (such as open files and signals). In traditional heavy-weight processes, a process has a single thread of control. In a multithreaded process, multiple program counters exist, enabling multiple locations to execute concurrently. Four Major Benefits: 1. Responsiveness: Allows continued user interface execution even if part of the application is blocked. 2. Resource Sharing: Threads share process memory by default, far simpler than shared memory or message passing. 3. Economy: Thread creation is lightweight; allocating and managing memory and resources for process creation is heavy-weight. Thread switching incurs vastly lower overhead than context switching. 4. Scalability: The process can take full advantage of multiprocessor/multicore architectures.",
    interview: "FAANG question: What is private to a thread versus shared among threads? Private: Thread ID, PC, CPU registers, stack space (local variables). Shared: Text segment, Data segment (globals/statics), Heap (malloced memory), Open file table descriptors, Signal handlers.",
    mnemonic: "R-R-E-S: Responsiveness, Resource Sharing, Economy, Scalability.",
    analogy: "Bank Branch: The bank building, vault, and customer ledger represent the Process. The 5 tellers sitting at separate counters servicing 5 customers simultaneously represent 5 Threads sharing the same bank vault.",
    mistakes: "Thinking threads share their stack. Every single thread MUST have its own independent stack to track its own function call chain and local variables!",
    examPoints: [
      "Define thread. Differentiate between single-threaded and multithreaded processes with a neat diagram (5 Marks / SRM Slide 65, 72).",
      "Explain the four primary benefits of multithreaded programming (5 Marks / SRM Slide 68).",
      "What components are private to a thread and what components are shared? (2 Marks)."
    ],
    diagram: "single-vs-multithreaded"
  },
  {
    id: "multicore-programming",
    title: "Multicore Programming & Amdahl's Law",
    unit: 2,
    badge: "Hardware Concurrency",
    beginner: "Concurrency is juggling 3 balls with 1 hand: only one ball is touched at a time, but all 3 are in the air. Parallelism is having 2 hands juggling balls at the exact same instant! Amdahl's Law says if part of your homework must be done alone by hand, having 100 friends won't make it infinitely fast!",
    college: "Multicore and multiprocessor architectures place pressure on system programmers. Five primary programming challenges: 1. Dividing Activities: Identifying distinct concurrent tasks, 2. Balance: Ensuring tasks perform equal work, 3. Data Splitting: Partitioning data accessed by tasks, 4. Data Dependency: Synchronizing dependent data operations, 5. Testing and Debugging: Addressing race conditions. Concurrency vs Parallelism: Concurrency supports more than one task making progress on a single-core system via time-slicing scheduling. Parallelism implies a system can perform more than one task simultaneously across multiple hardware cores. Types of Parallelism: (a) Data Parallelism: Distributes subsets of the same data across multiple cores, executing the same operation on each core. (b) Task Parallelism: Distributes threads across cores, each thread performing a unique operation. Architectural Support: Modern CPUs feature hardware threads (e.g. Oracle SPARC T4 with 8 cores and 8 hardware threads per core = 64 concurrent hardware threads). Amdahl's Law: Identifies performance speedup gained from adding N processing cores to an application with serial portion S and parallel portion (1 - S): Speedup <= 1 / (S + (1 - S) / N). As N approaches infinity, maximum speedup approaches 1 / S.",
    interview: "Amdahl's Law numerical: If an application is 75% parallel and 25% serial, what is the speedup on 2 cores? What is the maximum theoretical speedup with infinite cores? On 2 cores: Speedup = 1 / (0.25 + 0.75/2) = 1 / (0.25 + 0.375) = 1 / 0.625 = 1.6x. With infinite cores: Speedup = 1 / S = 1 / 0.25 = 4x speedup maximum!",
    mnemonic: "Amdahl's Formula: `1 / (S + (1-S)/N)`. Infinite Limit = `1 / S`.",
    analogy: "House Painting: Mixing paint colors takes 1 hour and must be done by 1 master artist (Serial, 25%). Painting the 3 walls takes 3 hours (Parallel, 75%). Even with 1,000 painters, the 1-hour mixing time cannot be shortened, capping speedup at 4x.",
    mistakes: "Assuming doubling CPU cores always doubles program speed. Amdahl's Law proves that the serial portion disproportionately limits scalability.",
    examPoints: [
      "State Amdahl's Law. Calculate the speedup when an application is 75% parallel and 25% serial moving from 1 to 2 cores (5 Marks / SRM Slide 73).",
      "Differentiate between Concurrency and Parallelism with timing diagrams (5 Marks / SRM Slide 71).",
      "List the five challenges in multicore programming (5 Marks / SRM Slide 69)."
    ],
    diagram: "concurrency-vs-parallelism"
  },
  {
    id: "thread-models",
    title: "Multithreading Models (M:1, 1:1, M:M, Two-Level)",
    unit: 2,
    badge: "Threading Architecture",
    beginner: "User threads are puppets controlled by your software. Kernel threads are the puppeteer's real fingers supported by the OS. How many puppets connect to how many real fingers decides the Thread Model!",
    college: "Threads are categorized as User Threads (supported above kernel and managed without kernel intervention via user-level thread libraries: POSIX Pthreads, Windows threads, Java threads) and Kernel Threads (supported directly by the operating system kernel: Windows, Linux, Solaris, Mac OS X). Four Relationship Models: 1. Many-to-One Model: Maps many user-level threads to a single kernel thread. Thread management is efficient in user space, but if one thread makes a blocking system call, the ENTIRE process blocks. Cannot run in parallel on multicore systems because only one thread can be in the kernel at a time (Examples: Solaris Green Threads, GNU Portable Threads). 2. One-to-One Model: Maps each user thread to a distinct kernel thread. Provides greater concurrency: if one thread blocks, others continue; allows execution across multiple cores. Disadvantage: Creating a user thread requires creating a kernel thread, whose overhead can restrict thread count (Examples: Windows, Linux, Solaris 9 and later). 3. Many-to-Many Model: Multiplexes many user-level threads onto a smaller or equal number of kernel threads. Allows developers to create arbitrary user threads while kernel threads run concurrently on multicore systems (Examples: Solaris prior to version 9, Windows with ThreadFiber package). 4. Two-Level Model: Variation of Many-to-Many that still multiplexes user threads, but also allows a specific high-priority user thread to be permanently bound to an individual kernel thread (Examples: IRIX, HP-UX, Tru64 UNIX, Solaris 8 and earlier).",
    interview: "Why did Linux and Windows settle exclusively on the One-to-One model despite the Many-to-Many model's theoretical elegance? In practice, the scheduling complexity of M:M (two schedulers competing: user runtime library and kernel scheduler) causes severe priority inversions and thread cache thrashing. As hardware multicore scaling improved, kernel thread creation overhead was optimized, making One-to-One faster and vastly simpler.",
    mnemonic: "M-O-M-T: Many-to-One (Green), One-to-One (Modern Linux/Win), Many-to-Many (Fiber), Two-Level (Bound Hybrid).",
    analogy: "Call Center: Many-to-One = 10 employees sharing 1 phone line (if one caller puts them on hold, everyone stops). One-to-One = Every employee has their own private phone line. Many-to-Many = 50 employees sharing 10 outgoing lines dynamically.",
    mistakes: "Claiming Linux uses Many-to-Many threading. Modern Linux uses the NPTL (Native POSIX Thread Library), which is strictly a 1:1 thread model.",
    examPoints: [
      "Compare Many-to-One, One-to-One, Many-to-Many, and Two-level thread models with neat diagrams (10 Marks / SRM Slide 75-79).",
      "Why does a blocking system call in Many-to-One model block the entire process? (2 Marks).",
      "Name two operating systems that implement the One-to-One thread model (2 Marks)."
    ],
    diagram: "multithreading-models"
  },
  {
    id: "thread-libraries",
    title: "Thread Libraries: Pthreads, Windows & Java",
    unit: 2,
    badge: "Polyglot Coding",
    beginner: "A thread library is a toolbox of code functions that lets programmers build and control worker threads easily in C, Windows, or Java without reinventing the wheel!",
    college: "A thread library provides the programmer with an Application Programming Interface (API) for creating and managing threads, implemented either entirely in user space or via a kernel-level library. Three primary libraries: 1. POSIX Pthreads: Defined by IEEE 1003.1c standard. It is a specification, not an implementation; OS designers implement the library according to the standard. Common in UNIX (Solaris, Linux, macOS). Core API: `pthread_t tid` (thread identifier), `pthread_attr_t attr` (attributes), `pthread_attr_init(&attr)`, `pthread_create(&tid, &attr, runner, param)`, `pthread_join(tid, NULL)` (waits for thread termination), `pthread_exit(0)`. Joining multiple threads is handled using an array `pthread_t workers[NUM_THREADS]` and looping `pthread_join(workers[i], NULL)`. 2. Windows Threads: Implemented via the Windows API. Uses `CreateThread(NULL, 0, Summation, &Param, 0, &ThreadId)`, waits via `WaitForSingleObject(ThreadHandle, INFINITE)`, and releases handles via `CloseHandle()`. 3. Java Threads: Managed directly by the Java Virtual Machine (JVM). Created by: (a) Extending the `Thread` class and overriding `run()`, or (b) Implementing the `Runnable` interface, defining `public void run()`, creating `Thread thrd = new Thread(new Summation(val))`, starting with `thrd.start()`, and waiting with `thrd.join()` inside a try-catch block.",
    interview: "Difference between extending `Thread` vs implementing `Runnable` in Java: Java does not support multiple class inheritance. If you extend `Thread`, your class cannot extend any other base class. Implementing `Runnable` separates task definition from execution mechanism and enables usage with `ExecutorService` thread pools.",
    mnemonic: "P-W-J: Pthreads (`pthread_create/join`), Windows (`CreateThread/WaitForSingleObject`), Java (`implements Runnable / start / join`).",
    analogy: "Construction Team: Pthreads is following the international ISO building blueprints. Windows Threads is using Microsoft prefabricated wall panels. Java Threads is renting a portable electric drill that runs identically on any construction site.",
    mistakes: "Calling `thrd.run()` instead of `thrd.start()` in Java! Calling `run()` executes the method synchronously inside the caller's thread; calling `start()` allocates a new OS thread and invokes `run()` concurrently.",
    examPoints: [
      "Write a complete C multithreaded program using Pthreads to compute the summation of non-negative integers (10 Marks / SRM Slide 82-83).",
      "Write a Java multithreaded program implementing the Runnable interface (10 Marks / SRM Slide 88-89).",
      "Show how an array of 10 threads is joined using Pthreads (5 Marks / SRM Slide 84)."
    ],
    code: {
      lang: "c",
      title: "Pthreads Summation Program (SRM Slide 82-83)",
      snippet: `#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

int sum; /* this data is shared by the thread(s) */
void *runner(void *param); /* threads call this function */

int main(int argc, char *argv[]) {
    pthread_t tid; /* thread identifier */
    pthread_attr_t attr; /* set of thread attributes */

    if (argc != 2) {
        fprintf(stderr, "usage: a.out <integer value>\\n");
        return -1;
    }
    if (atoi(argv[1]) < 0) {
        fprintf(stderr, "%d must be >= 0\\n", atoi(argv[1]));
        return -1;
    }

    pthread_attr_init(&attr);
    pthread_create(&tid, &attr, runner, argv[1]);
    pthread_join(tid, NULL);

    printf("sum = %d\\n", sum);
    return 0;
}

void *runner(void *param) {
    int i, upper = atoi((char*)param);
    sum = 0;
    for (i = 1; i <= upper; i++)
        sum += i;
    pthread_exit(0);
}`,
      explanation: "Main thread initializes attributes, creates a worker thread executing runner(), and calls pthread_join() to wait before printing the global sum."
    }
  },
  {
    id: "implicit-threading",
    title: "Implicit Threading: Thread Pools, OpenMP & GCD",
    unit: 2,
    badge: "Compiler & Runtime Concurrency",
    beginner: "Instead of hiring and firing a new worker every time a customer walks into a store, you keep a permanent team of 5 workers standing by in a breakroom. That's a 'Thread Pool'!",
    college: "As software thread counts multiply, explicit thread creation and management by application programmers becomes error-prone. Implicit Threading transfers thread creation and lifecycle management to compilers and run-time libraries. Three Primary Methods: 1. Thread Pools: Creates a bounded number of threads upon startup where they await work. Advantages: (a) Servicing requests with an existing thread is faster than spawning a new thread, (b) Bounding thread pool size prevents system resource exhaustion under sudden request spikes, (c) Separating tasks from execution mechanics enables flexible scheduling (e.g. periodic execution). Supported in Windows API via `PoolFunction`. 2. OpenMP: A set of compiler directives and API for C, C++, and Fortran in shared-memory environments. Identifies parallel regions using `#pragma omp parallel` (spawns as many threads as CPU cores). Parallelizes loops using `#pragma omp parallel for for(i=0; i<N; i++) { c[i] = a[i] + b[i]; }`. 3. Apple Grand Central Dispatch (GCD): Technology for macOS and iOS. Defines blocks using `^{ printf(\"I am a block\"); }` placed in Dispatch Queues. Two types of dispatch queues: (a) Serial Queue (main queue): Blocks removed in strict FIFO order, one block at a time per process. (b) Concurrent Queue: Blocks removed in FIFO order, but several blocks execute simultaneously. Three system-wide concurrent priority queues: low, default, high.",
    interview: "Explain how OpenMP handles loop scheduling: OpenMP allows static, dynamic, and guided chunking of iterations across worker threads. Explain the false sharing trap in OpenMP when two threads modify distinct variables located on the exact same CPU cache line.",
    mnemonic: "P-O-G: Pools (bound & reuse), OpenMP (compiler `#pragma`), GCD (Apple blocks `^{}` & dispatch queues).",
    analogy: "Taxi Stand: Explicit threading is buying a brand new car every time someone hails a ride and scrapping it at destination. A Thread Pool is a taxi rank where 10 drivers wait in line, drive fares, and return to the rank.",
    mistakes: "Thinking `#pragma omp parallel for` automatically prevents race conditions on shared accumulated variables. Programmers must still use `reduction(+:sum)` or atomic clauses to prevent concurrent writes!",
    examPoints: [
      "Explain the advantages of Thread Pools over explicit thread creation (5 Marks / SRM Slide 91).",
      "Explain parallel programming with OpenMP directives `#pragma omp parallel` and `#pragma omp parallel for` with C code (5 Marks / SRM Slide 92).",
      "Describe Apple Grand Central Dispatch (GCD) blocks, serial queues, and concurrent queues (5 Marks / SRM Slide 93-94)."
    ],
    code: {
      lang: "c",
      title: "OpenMP Parallel For Loop (SRM Slide 92)",
      snippet: `#include <omp.h>
#include <stdio.h>

int main(int argc, char *argv[]) {
    int i, N = 100;
    int a[100], b[100], c[100];

    for (i = 0; i < N; i++) { a[i] = i; b[i] = i * 2; }

    /* Sequential code */
    #pragma omp parallel
    {
        printf("I am a parallel region running on core %d\\n", omp_get_thread_num());
    }

    /* Parallel For Loop */
    #pragma omp parallel for
    for (i = 0; i < N; i++) {
        c[i] = a[i] + b[i];
    }

    printf("c[99] = %d\\n", c[99]);
    return 0;
}`,
      explanation: "Compiler directive #pragma omp parallel for automatically distributes loop iterations across available processor cores without manual thread joins."
    }
  },
  {
    id: "threading-issues",
    title: "Threading Issues: fork/exec, Signals, Cancellation, TLS",
    unit: 2,
    badge: "Edge Cases & Gotchas",
    beginner: "What happens if one worker clones themselves while other workers are halfway through talking? What if a fire alarm goes off—does the manager yell at one worker or everyone? These tricky scenarios are 'Threading Issues'!",
    college: "Multithreaded programming introduces subtle operating system complexities: 1. Semantics of fork() and exec(): If a thread invokes fork(), does the child duplicate ONLY the calling thread or ALL threads? UNIX implementations support two variants of fork(). However, if exec() is called immediately after fork(), duplicating only the calling thread is optimal since exec() replaces the entire process address space. 2. Signal Handling: Signals notify a process that an event has occurred (handled by default handler or user-defined handler). Delivery options in multithreaded systems: (a) Deliver to the thread to which signal applies (e.g. divide-by-zero to offending thread), (b) Deliver to every thread in process, (c) Deliver to certain threads, (d) Assign a dedicated thread to receive all signals. 3. Thread Cancellation: Terminating a target thread before completion. Two approaches: (a) Asynchronous: Terminates target immediately (dangerous if holding shared resources). (b) Deferred: Target periodically checks cancellation points (e.g. `pthread_testcancel()`), enabling cleanup handlers. In Linux, cancellation is handled via signals. 4. Thread-Local Storage (TLS): Allows each thread to have its own private copy of static data. Distinct from local variables (local variables exist only within a single function scope, whereas TLS persists across function invocations). 5. Scheduler Activations: Communication between kernel and thread library via Lightweight Processes (LWPs) using 'upcalls' to maintain the optimal number of kernel threads.",
    interview: "Why is asynchronous thread cancellation dangerous in production C/C++? If a thread is cancelled asynchronously while holding a mutex lock or in the middle of `malloc()` heap arena manipulation, the mutex remains permanently locked (deadlock) and the heap is corrupted forever! Deferred cancellation with cancellation points is mandatory for robust code.",
    mnemonic: "F-S-C-T-S: Fork/exec semantics, Signal delivery, Cancellation (Async vs Deferred), TLS, Scheduler activations.",
    analogy: "Factory Office: A fire alarm rings (Signal): does the building intercom broadcast to everyone, or does a security captain handle it? A worker is fired mid-shift (Cancellation): do they get escorted out instantly leaving dangerous machinery running (Asynchronous), or do they safely shut off the machines first (Deferred)?",
    mistakes: "Confusing Thread-Local Storage with local variables. Local variables live on the thread's stack frame and disappear when the function returns. TLS variables act like static/global variables but have a unique instance per thread.",
    examPoints: [
      "Explain the semantics of fork() and exec() in a multithreaded program (5 Marks / SRM Slide 96).",
      "Where should a signal be delivered in a multithreaded process? (5 Marks / SRM Slide 97-98).",
      "Compare Asynchronous vs Deferred Thread Cancellation. What is a cancellation point? (5 Marks / SRM Slide 99-100).",
      "Define Thread-Local Storage (TLS) and contrast it with local variables (2 Marks / SRM Slide 101)."
    ]
  },
  {
    id: "os-thread-implementations",
    title: "OS Thread Implementations: Windows vs Linux",
    unit: 2,
    badge: "Kernel Structures",
    beginner: "Windows treats a thread like a VIP with an Executive Pass (ETHREAD), Kernel Card (KTHREAD), and User Tag (TEB). Linux is minimalist: it says 'everything is just a Task', sharing what it needs with clone()!",
    college: "1. Windows Threads Implementation: Implements One-to-One mapping at kernel level. Each thread context contains: Thread ID, register set representing processor state, separate user and kernel stacks, and private data storage for DLLs. Primary data structures: (a) `ETHREAD` (Executive Thread Block): In kernel space; includes pointer to parent process and pointer to KTHREAD. (b) `KTHREAD` (Kernel Thread Block): In kernel space; includes scheduling/synchronization info, kernel-mode stack, and pointer to TEB. (c) `TEB` (Thread Environment Block): In user space; contains thread identifier, user-mode stack, and thread-local storage. 2. Linux Threads Implementation: Linux does not distinguish between processes and threads; it refers to both as 'tasks'. Thread creation is achieved via the `clone()` system call. `clone()` accepts flags controlling resource sharing: `CLONE_FS` (file-system info shared), `CLONE_VM` (same memory address space shared), `CLONE_SIGHAND` (signal handlers shared), and `CLONE_FILES` (set of open files shared). A `struct task_struct` points to shared or unique data structures accordingly.",
    interview: "How does `clone()` unite `fork()` and `pthread_create()` in Linux? If `clone()` is called with flags `CLONE_VM | CLONE_FS | CLONE_FILES | CLONE_SIGHAND`, it creates a lightweight POSIX thread sharing memory. If called with NO flags, it copies resources, behaving exactly like `fork()`! This unified abstraction is why Linux is remarkably elegant.",
    mnemonic: "Windows = E-K-T (ETHREAD -> KTHREAD -> TEB). Linux = `clone()` with CLONE_VM, FS, FILES, SIGHAND.",
    analogy: "Passport vs Stamp: Windows issues three separate documents for every traveler (Executive block, Kernel block, User block). Linux gives everyone a generic ID card (task) and simply checks boxes for which communal facilities they share.",
    mistakes: "Believing TEB resides in kernel space. TEB (Thread Environment Block) resides strictly in USER SPACE, allowing user programs to access thread IDs and TLS without trap to kernel mode.",
    examPoints: [
      "Describe the data structures used to implement threads in Windows: ETHREAD, KTHREAD, and TEB with a neat diagram (10 Marks / SRM Slide 104-106).",
      "How does Linux implement threads using the clone() system call? Explain four clone flags (5 Marks / SRM Slide 107)."
    ],
    diagram: "windows-vs-linux-threads"
  },
  {
    id: "process-synchronization-intro",
    title: "Process Synchronization & Race Conditions",
    unit: 2,
    badge: "Concurrency Bugs",
    beginner: "You and your sibling both try to withdraw \\$50 from the ATM at the exact same second from the same bank account containing \\$50. If the computer glitches and gives money to both of you, that bug is a 'Race Condition'!",
    college: "Processes executing concurrently may be interrupted at any time, partially completing execution. Concurrent access to shared data may result in data inconsistency. Maintaining data consistency requires mechanisms to ensure orderly execution. Race Condition Definition: A situation where multiple processes access and manipulate the same shared data concurrently, and the outcome of the execution depends on the particular order in which the access takes place. Concrete Numerical Proof: Suppose a shared variable `counter` is initialized to 5. Producer executes `counter++` while Consumer executes `counter--`. `counter++` compiles into machine language as: Register1 = counter; Register1 = Register1 + 1; counter = Register1. `counter--` compiles as: Register2 = counter; Register2 = Register2 - 1; counter = Register2. If interleaved: S0: producer executes Register1 = counter (5); S1: producer executes Register1 = Register1 + 1 (6); S2: consumer executes Register2 = counter (5); S3: consumer executes Register2 = Register2 - 1 (4); S4: producer executes counter = Register1 (counter=6); S5: consumer executes counter = Register2 (counter=4). The final value is 4 (or 6), whereas the correct mathematical value must be 5!",
    interview: "Explain how instruction reordering by modern out-of-order CPUs and compiler optimizations exacerbate race conditions. Explain why `volatile` in C does NOT fix race conditions (it only prevents compiler register caching, but does not provide hardware atomicity).",
    mnemonic: "RACE: Result Altered by Concurrent Execution. (5 becomes 4 or 6!).",
    analogy: "Joint Bank Account: Account balance is \\$50. Husband deposits \\$10 while wife withdraws \\$10 simultaneously. If husband reads \\$50 and writes \\$60 after wife reads \\$50, wife writes \\$40, erasing the husband's deposit entirely.",
    mistakes: "Thinking single-line high-level statements like `counter++` are atomic in C. In assembly, `counter++` is THREE separate instructions (read, increment, write) that can be interrupted midway!",
    examPoints: [
      "Define Race Condition. Demonstrate the race condition on shared variable counter with an execution interleaving table showing counter ending as 4 or 6 (10 Marks / Repeated SRM Question / Slide 114).",
      "Why does concurrent access to shared data lead to inconsistency? (2 Marks)."
    ],
    diagram: "race-condition-trace"
  },
  {
    id: "critical-section-problem",
    title: "The Critical-Section Problem & Requirements",
    unit: 2,
    badge: "Synchronization Core",
    beginner: "A single-stall restroom in a restaurant is the Critical Section. Only one person can be inside at a time (Mutual Exclusion). If it's empty, someone waiting gets to go in (Progress). No one is allowed to cut in line 100 times while you wait (Bounded Waiting)!",
    college: "Consider a system of n processes {P0, P1, ..., Pn-1}. Each process has a segment of code called a Critical Section (CS) where it changes common variables, updates tables, or writes files. When one process is executing in its critical section, no other process may execute in its critical section. The Critical-Section Problem is to design a protocol that processes use to cooperate. General Structure: Entry Section (requests permission to enter CS) -> Critical Section -> Exit Section (releases permission) -> Remainder Section. A valid solution to the Critical-Section problem must satisfy three strict requirements: 1. Mutual Exclusion: If process Pi is executing in its critical section, then no other processes can be executing in their critical sections. 2. Progress: If no process is executing in its critical section and some processes wish to enter, only those processes not executing in their remainder sections can participate in deciding who enters next, and this selection cannot be postponed indefinitely. 3. Bounded Waiting: A bound must exist on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter and before that request is granted. Kernel Approaches: (a) Preemptive Kernel: Allows a process to be preempted while running in kernel mode (more responsive, prone to race conditions if uncoordinated). (b) Non-preemptive Kernel: Runs until process exits kernel mode, blocks, or yields (essentially free of race conditions in kernel mode).",
    interview: "Why is Bounded Waiting essential? Without bounded waiting, a solution might guarantee Mutual Exclusion and Progress, yet let Process 1 and Process 2 swap turns forever while Process 3 waits outside indefinitely, causing Starvation!",
    mnemonic: "M-P-B: Mutual Exclusion, Progress, Bounded Waiting.",
    analogy: "Single Train Track: Mutual Exclusion = Only one train on the single track at a time. Progress = If track is clear, waiting train is dispatched immediately. Bounded Waiting = Express train cannot pass through 50 times while freight train waits at the signal.",
    mistakes: "Forgetting the Bounded Waiting condition. Many naive synchronization locks satisfy Mutual Exclusion and Progress but fail Bounded Waiting, causing process starvation.",
    examPoints: [
      "Define the Critical Section Problem. State and explain the three requirements for a valid solution (10 Marks / Repeated SRM Question / Slide 115, 118).",
      "Draw the general structure of a typical process Pi containing entry, critical, exit, and remainder sections (5 Marks / Slide 116).",
      "Differentiate between Preemptive and Non-preemptive kernels in handling critical sections (5 Marks / Slide 119)."
    ],
    diagram: "critical-section-structure"
  },
  {
    id: "petersons-solution",
    title: "Peterson's Algorithm (2-Process Solution & Proof)",
    unit: 2,
    badge: "Classical Software Algorithm",
    beginner: "Two polite friends approaching a narrow door: each raises their hand saying 'I want to enter' (flag=true), but politely says 'After you, please go first!' (turn=j). Whoever said it last waits, and the other person walks through safely!",
    college: "Peterson's Solution is a classic software-based solution to the critical-section problem for two processes (P0 and P1). It assumes that basic machine-language load and store instructions are atomic (cannot be interrupted). The two processes share two variables: `int turn;` and `boolean flag[2];`. The variable `turn` indicates whose turn it is to enter the critical section. The array `flag[i] = true` indicates that process Pi is ready to enter its critical section. Algorithm for Process Pi (where j = 1 - i): `do { flag[i] = true; turn = j; while (flag[j] && turn == j); /* CRITICAL SECTION */ flag[i] = false; /* REMAINDER SECTION */ } while (true);`. Mathematical Proof of 3 Requirements: 1. Mutual Exclusion: Pi enters CS only if either `flag[j] == false` or `turn == i`. If both attempt to enter simultaneously, both set `flag[0]=flag[1]=true`. However, the variable `turn` can only hold one value (either 0 or 1). If `turn == 0`, P0 enters; if `turn == 1`, P1 enters. Hence both can never be in CS simultaneously. 2. Progress: A process Pj can only prevent Pi from entering if `flag[j] == true` and `turn == j`. If Pj is not in CS, it sets `flag[j] = false`, immediately freeing Pi to enter. 3. Bounded Waiting: Once Pj exits CS, it resets `flag[j] = false`. If it immediately tries to re-enter, it sets `turn = i`, which forces Pj to wait and guarantees Pi enters next.",
    interview: "Why does Peterson's algorithm fail on modern multicore computer processors? Modern CPUs and optimizing compilers perform out-of-order memory execution and instruction reordering! Because store operations to `flag` and `turn` are reordered, memory barriers (fences) are required to make Peterson's algorithm function correctly on modern hardware.",
    mnemonic: "F-T-W: Flag[i]=true -> Turn=j -> While(flag[j] && turn==j) wait.",
    analogy: "Polite Door Crossing: Both friends raise a flag ('I want to go'). Friend A writes 'Friend B' on the whiteboard (turn=B). Friend B writes 'Friend A' on the whiteboard (turn=A). Since Friend B wrote last, the board says 'Friend A', so Friend A enters first.",
    mistakes: "Setting `turn = i` instead of `turn = j` inside process Pi. Setting `turn = i` would make the process selfish, causing deadlocks if both set their own turn!",
    examPoints: [
      "Write Peterson's algorithm for process Pi and prove how it satisfies Mutual Exclusion, Progress, and Bounded Waiting (13 / 16 Marks / University Highlight / Slide 120-122).",
      "What are the shared variables in Peterson's solution? Explain their purpose (5 Marks).",
      "Why is Peterson's solution restricted to two processes? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Peterson's Algorithm for Process Pi (SRM Slide 121)",
      snippet: `// Shared variables
int turn;
int flag[2] = {0, 0};

void process(int i) {
    int j = 1 - i;
    do {
        flag[i] = 1;                   // I am ready to enter
        turn = j;                      // Give other process priority
        while (flag[j] && turn == j)
            ; /* busy wait */

        /* CRITICAL SECTION */

        flag[i] = 0;                   // Release permission

        /* REMAINDER SECTION */
    } while (1);
}`,
      explanation: "Process Pi sets its flag to true, sets turn to other process j, and spins in while loop as long as the other process wants in AND it's the other's turn."
    }
  },
  {
    id: "synchronization-hardware",
    title: "Hardware Synchronization: test_and_set & compare_and_swap",
    unit: 2,
    badge: "Hardware Primitives",
    beginner: "A hardware atomic lock is like a solid metal key that can be tested and grabbed in one indivisible fraction of a second so two hands can never touch it at the same moment!",
    college: "Software solutions are complex and inefficient on multiprocessors. Many systems provide hardware instructions for critical sections based on the concept of locking. On uniprocessors, one could simply disable interrupts (disabling preemption), but this is too inefficient and non-scalable on multiprocessor systems. Modern architectures provide special atomic hardware instructions (executed without interruption): 1. `test_and_set(&target)`: Definition: `boolean test_and_set(boolean *target) { boolean rv = *target; *target = TRUE; return rv; }`. Returns original value and sets target to TRUE atomically. Mutual Exclusion using test_and_set: `do { while (test_and_set(&lock)); /* CS */ lock = false; /* Remainder */ } while(true);`. 2. `compare_and_swap(&value, expected, new_value)`: Definition: `int compare_and_swap(int *value, int expected, int new_value) { int temp = *value; if (*value == expected) *value = new_value; return temp; }`. Swaps value to new_value ONLY if current value equals expected. Mutual Exclusion: `do { while (compare_and_swap(&lock, 0, 1) != 0); /* CS */ lock = 0; /* Remainder */ } while(true);`. Bounded-Waiting Mutual Exclusion Algorithm: Achieved using `test_and_set` combined with two arrays `boolean waiting[n]` and boolean variable `lock`.",
    interview: "Explain CAS (Compare-And-Swap) and lock-free data structures. How does CAS avoid deadlocks compared to mutexes? What is the ABA problem in CAS, and how do version counters/tagged pointers solve it?",
    mnemonic: "TAS = Returns Old, Sets TRUE. CAS = Swaps only if Value == Expected.",
    analogy: "Hotel Card Reader: Swiping a keycard checks if the room is vacant and turns the lock to occupied in one instant atomic magnetic pulse.",
    mistakes: "Thinking `test_and_set` and `compare_and_swap` satisfy bounded waiting by themselves. Simple while loops with TAS/CAS suffer from starvation unless augmented with a `waiting[n]` circular queue array!",
    examPoints: [
      "Define test_and_set() and compare_and_swap() atomic hardware instructions with algorithms for Mutual Exclusion (10 Marks / SRM Slide 125-128).",
      "Write the algorithm for Bounded-Waiting Mutual Exclusion using test_and_set (10 Marks / SRM Slide 129).",
      "Why is disabling interrupts unsuitable for multiprocessor systems? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Bounded-Waiting Mutual Exclusion using test_and_set (SRM Slide 129)",
      snippet: `do {
    waiting[i] = true;
    key = true;
    while (waiting[i] && key)
        key = test_and_set(&lock);
    waiting[i] = false;

    /* CRITICAL SECTION */

    j = (i + 1) % n;
    while ((j != i) && !waiting[j])
        j = (j + 1) % n;

    if (j == i)
        lock = false;
    else
        waiting[j] = false;

    /* REMAINDER SECTION */
} while (true);`,
      explanation: "Scans the circular waiting array starting from (i+1)%n to find the next waiting process. If found, hands lock directly to waiting[j]=false without opening lock to outside competition!"
    }
  },
  {
    id: "mutex-locks",
    title: "Mutex Locks & Spinlocks",
    unit: 2,
    badge: "OS Software Primitive",
    beginner: "A Mutex is a physical bathroom key. When you take the key, you lock the door. Anyone else wanting to use the bathroom must wait outside until you return the key!",
    college: "Hardware instructions like TAS and CAS are complicated and generally inaccessible to application programmers. Operating system designers provide higher-level software tools, the simplest being the Mutex Lock (short for Mutual Exclusion). A process must acquire the lock before entering its critical section, and release the lock when exiting: `do { acquire_lock(); /* CS */ release_lock(); /* Remainder */ } while(true);`. Implementation: Mutex maintains a boolean variable `available` indicating if the lock is available. `acquire()` loops `while (!available); available = false;`. `release()` sets `available = true;`. Calls to acquire() and release() must be atomic. Disadvantage: Mutex locks require 'busy waiting'—a process continuously loops while waiting. Hence, this lock is called a 'Spinlock'. Advantage: Spinlocks avoid context-switch overhead, making them ideal on multiprocessors for locks held for very short durations.",
    interview: "When should you use a spinlock versus a sleeping mutex? Use a spinlock if the critical section is extremely short (< 2 context switch durations) and you are on a multicore processor, because sleeping/waking a thread incurs expensive OS scheduling overhead. Never use a spinlock on a single-core CPU or for I/O operations because spinning starves the thread holding the lock!",
    mnemonic: "MUTEX = MUTual EXclusion. Busy waiting mutex = Spinlock.",
    analogy: "Coffee Shop Bathroom: Only one bathroom key exists on a wooden peg. You grab it (acquire), do your business, and hang it back up (release). If someone is inside, you stand by the door checking the knob every 5 seconds (Spinlock).",
    mistakes: "Using spinlocks on single-core uniprocessor systems. On a single core, spinning wastes 100% of the CPU timeslice while preventing the lock holder from running to release it!",
    examPoints: [
      "Explain the working of Mutex Locks. Provide the code for acquire() and release() (5 Marks / SRM Slide 130-131).",
      "What is a spinlock? What are its advantages and disadvantages? (5 Marks).",
      "Why must calls to acquire() and release() be executed atomically? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Mutex Lock acquire() and release() (SRM Slide 131)",
      snippet: `// Mutex Lock Implementation
boolean available = true;

void acquire() {
    while (!available)
        ; /* busy wait (spinlock) */
    available = false;
}

void release() {
    available = true;
}

// Process Usage
void process() {
    do {
        acquire();
        /* CRITICAL SECTION */
        release();
        /* REMAINDER SECTION */
    } while (true);
}`,
      explanation: "acquire() spins until available is true, then sets it false atomically. release() restores available to true."
    }
  },
  {
    id: "semaphores",
    title: "Semaphores: Counting, Binary & Non-Busy Wait",
    unit: 2,
    badge: "Dijkstra Primitive",
    beginner: "A semaphore is like a bouncer at a club that only allows 5 people inside. Every time someone enters, the bouncer decrements the counter (`wait`). Every time someone leaves, the bouncer increments the counter (`signal`)!",
    college: "Invented by Edsger Dijkstra, a Semaphore S is an integer synchronization variable accessed only via two indivisible, atomic operations: `wait(S)` (originally called `P()` from Dutch proberen, to test) and `signal(S)` (originally called `V()` from Dutch verhogen, to increment). Standard Definition: `wait(S) { while (S <= 0); S--; }` and `signal(S) { S++; }`. Types: 1. Counting Semaphore: Integer value ranges over an unrestricted domain, used to manage finite resource instances. 2. Binary Semaphore: Integer value ranges only between 0 and 1, identical in behavior to a mutex lock. Implementation without Busy Waiting: Busy waiting wastes CPU cycles. Instead, define a semaphore structure with a waiting queue: `typedef struct { int value; struct process *list; } semaphore;`. Operation `wait(semaphore *S)`: Decrements `S->value--`. If `S->value < 0`, the process is added to `S->list` and suspends itself via `block()`. Operation `signal(semaphore *S)`: Increments `S->value++`. If `S->value <= 0`, removes a process P from `S->list` and awakens it via `wakeup(P)`. Negative value meaning: If `S->value` is negative, its magnitude `|S->value|` indicates the exact number of processes currently waiting on that semaphore!",
    interview: "Contrast binary semaphore vs mutex: A mutex has the concept of ownership—only the thread that locked the mutex is allowed to unlock it. A semaphore has no ownership—Thread A can wait() and Thread B can signal(), enabling event signaling and barrier synchronization.",
    mnemonic: "P = Proberen (Wait, Decrement). V = Verhogen (Signal, Increment). Negative Semaphore Value = Number of Waiting Processes.",
    analogy: "Parking Garage: Digital counter displays 3 empty spots. When car enters, display drops to 2 (wait). When full (0), incoming cars queue outside. When a car departs, display increments and outside gate opens for next car (signal).",
    mistakes: "Thinking a non-busy-waiting semaphore value stops at 0. With blocking queues, the semaphore value becomes NEGATIVE (-1, -2, -3...), showing exactly how many processes are blocked in the waiting queue!",
    examPoints: [
      "Define Semaphore. Differentiate between Counting and Binary Semaphores (5 Marks / SRM Slide 132-133).",
      "Explain the implementation of Semaphores without busy waiting using block() and wakeup() (10 Marks / Repeated SRM Question / Slide 135-136).",
      "What is the physical significance of a negative semaphore value? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Semaphore with No Busy Waiting (SRM Slide 135-136)",
      snippet: `typedef struct {
    int value;
    struct process *list;
} semaphore;

void wait(semaphore *S) {
    S->value--;
    if (S->value < 0) {
        /* add this process to S->list */
        block();
    }
}

void signal(semaphore *S) {
    S->value++;
    if (S->value <= 0) {
        /* remove a process P from S->list */
        wakeup(P);
    }
}`,
      explanation: "wait() decrements value and blocks if negative. signal() increments value and wakes up a sleeping process if value <= 0."
    }
  },
  {
    id: "readers-writers",
    title: "Classical Problems: Readers-Writers Problem",
    unit: 2,
    badge: "Synchronization Classic",
    beginner: "A library book on a table: 10 people can read the book at the same time without disturbing each other. But if an author wants to erase and rewrite a page, NO ONE else can read or write until the author finishes!",
    college: "A shared dataset is accessed concurrently by multiple processes: Readers only read the data (never modify); Writers can both read and write. Mutual exclusion rules: Multiple readers may access concurrently, but only one single writer can access shared data exclusively. Variations: 1. First Readers-Writers Problem (Reader Preference): No reader is kept waiting unless a writer has already obtained permission. Writers may starve if readers arrive continuously. 2. Second Readers-Writers Problem (Writer Preference): Once a writer is ready, it performs its write ASAP; incoming readers must wait. Readers may starve. Semaphore Solution for First Variation: Shared Data: `semaphore rw_mutex = 1;` (mutual exclusion for writers and first/last reader), `semaphore mutex = 1;` (protects `read_count`), `int read_count = 0;`. Writer Process: `do { wait(rw_mutex); /* writing */ signal(rw_mutex); } while(true);`. Reader Process: `do { wait(mutex); read_count++; if (read_count == 1) wait(rw_mutex); signal(mutex); /* reading */ wait(mutex); read_count--; if (read_count == 0) signal(rw_mutex); signal(mutex); } while(true);`.",
    interview: "Explain how Reader-Writer Locks (rwlock) are implemented in OS kernels to solve writer starvation. Explain fair ticket locks or queued read-write locks where readers and writers queue up in FIFO sequence.",
    mnemonic: "First Reader Locks Writer (`wait(rw_mutex)`). Last Reader Frees Writer (`signal(rw_mutex)`).",
    analogy: "Railway Information Display: Thousands of passengers look at the arrivals board simultaneously (Readers). When the train station controller updates delayed track numbers, the screen freezes for 2 seconds exclusively for the edit (Writer).",
    mistakes: "Forgetting to protect `read_count` with the `mutex` semaphore. Because multiple readers update `read_count` concurrently, failing to protect it triggers a race condition on `read_count`!",
    examPoints: [
      "Explain the Readers-Writers Problem with complete semaphore algorithms for both reader and writer processes (10 Marks / Repeated SRM Question / Slide 142-144).",
      "Differentiate between the First and Second variations of the Readers-Writers problem (5 Marks / Slide 145).",
      "Why does the first reader execute wait(rw_mutex) and the last reader execute signal(rw_mutex)? (2 Marks)."
    ],
    code: {
      lang: "c",
      title: "Readers-Writers Semaphore Solution (SRM Slide 143-144)",
      snippet: `semaphore rw_mutex = 1;
semaphore mutex = 1;
int read_count = 0;

// Writer Process
void writer() {
    do {
        wait(rw_mutex);
        /* writing is performed */
        signal(rw_mutex);
    } while (true);
}

// Reader Process
void reader() {
    do {
        wait(mutex);
        read_count++;
        if (read_count == 1)
            wait(rw_mutex); /* first reader locks writer */
        signal(mutex);

        /* reading is performed */

        wait(mutex);
        read_count--;
        if (read_count == 0)
            signal(rw_mutex); /* last reader frees writer */
        signal(mutex);
    } while (true);
}`,
      explanation: "First reader locks rw_mutex, blocking writers. Subsequent readers increment read_count. Last reader decrements read_count to 0 and unlocks rw_mutex."
    }
  },
  {
    id: "dining-philosophers",
    title: "Classical Problems: Dining-Philosophers Problem",
    unit: 2,
    badge: "Deadlock Paradigm",
    beginner: "Five philosophers sit at a round table with 5 bowls of rice and only 5 chopsticks. To eat, a philosopher needs TWO chopsticks (left and right). If all 5 pick up their left chopstick at the exact same moment, everyone is holding one chopstick, waiting for the right one, and everyone starves to death!",
    college: "Devised by Dijkstra, five philosophers spend their lives alternating between thinking and eating. They sit around a circular table with a central bowl of rice and five single chopsticks between adjacent chairs: `semaphore chopstick[5];` (all initialized to 1). A philosopher needs both adjacent chopsticks (i and (i+1)%5) to eat. Naive Algorithm: `do { wait(chopstick[i]); wait(chopstick[(i+1)%5]); /* eat */ signal(chopstick[i]); signal(chopstick[(i+1)%5]); /* think */ } while(true);`. Flaw: If all five philosophers become hungry simultaneously and grab their left chopstick, all five semaphores become 0. When they attempt to grab their right chopstick, all block indefinitely—resulting in a catastrophic Deadlock! Three Deadlock Solutions: 1. Allow at most 4 philosophers to sit simultaneously at the table (by pigeonhole principle, at least one philosopher gets 2 chopsticks). 2. Allow a philosopher to pick up chopsticks only if both are currently available (must be checked inside a critical section). 3. Asymmetric Solution: An odd-numbered philosopher picks up the left chopstick first and then the right; an even-numbered philosopher picks up the right chopstick first and then the left. This breaks circular wait!",
    interview: "How do you prove that the asymmetric odd/even solution guarantees no deadlock? Number the philosophers 0, 1, 2, 3, 4. Even philosophers (0, 2, 4) reach for right chopstick first; odd philosophers (1, 3) reach for left chopstick first. This prevents circular dependency cycles from forming across the 5 resources.",
    mnemonic: "Naive = Everyone Grabs Left -> Deadlock. 3 Solutions: 4 at table, Both or None, Asymmetric Odd/Even.",
    analogy: "Software Engineers at Whiteboard: 5 coders need 2 dry-erase markers each to write code. Only 5 markers exist between adjacent desks. If all grab one marker with left hand, no one can write a single line.",
    mistakes: "Claiming the naive semaphore solution only deadlocks sometimes. Under heavy concurrency, the naive solution will inevitably deadlock whenever all 5 become hungry simultaneously.",
    examPoints: [
      "Explain the Dining-Philosophers problem with algorithm and demonstrate how deadlock arises (10 Marks / SRM Slide 146-147).",
      "Describe the three methods to eliminate deadlock in Dining Philosophers (5 Marks / SRM Slide 148).",
      "Write the asymmetric algorithm for even and odd philosophers (5 Marks)."
    ],
    code: {
      lang: "c",
      title: "Dining Philosophers Naive Algorithm (SRM Slide 147)",
      snippet: `semaphore chopstick[5] = {1, 1, 1, 1, 1};

void philosopher(int i) {
    do {
        wait(chopstick[i]);                 // grab left
        wait(chopstick[(i + 1) % 5]);       // grab right

        /* EAT */

        signal(chopstick[i]);               // release left
        signal(chopstick[(i + 1) % 5]);     // release right

        /* THINK */
    } while (1);
}`,
      explanation: "If all philosophers execute wait(chopstick[i]) concurrently, all 5 chopsticks become 0, creating circular wait deadlock."
    }
  },
  {
    id: "monitors",
    title: "Monitors & Condition Variables",
    unit: 2,
    badge: "High-Level Synchronization ADT",
    beginner: "A Monitor is like an exclusive private conference room where the door lock automatically ensures only one person talks at a time. Inside, there are waiting chairs (Condition Variables) where you sit until someone rings a bell (`signal`)!",
    college: "Although semaphores provide powerful synchronization, timing errors are easy to make (e.g. omitting wait or signal, swapping order into signal...wait), resulting in deadlocks and race conditions. A Monitor is a high-level synchronization abstraction that encapsulates private shared variables, condition variables, and procedures within an Abstract Data Type (ADT). Fundamental Guarantee: Only one process may be active within the monitor at any given moment; mutual exclusion is enforced automatically by the compiler/runtime. Condition Variables: To allow processes to wait for arbitrary synchronization conditions, monitors define condition variables: `condition x, y;`. Only two operations are permitted: 1. `x.wait()`: The invoking process is suspended and placed on condition x's waiting queue until another process calls x.signal(). 2. `x.signal()`: Resumes exactly one suspended process (if any) that invoked x.wait(). If no process is waiting on x, `x.signal()` has NO effect (unlike a semaphore signal which increments the counter). Signaling Choices: When process P executes `x.signal()` resuming Q, two processes could be active inside monitor. Choices: (a) Signal and Wait (Hoare): P waits until Q leaves monitor or waits for another condition. (b) Signal and Continue (Mesa / Java): Q waits until P leaves monitor or waits. Resuming processes: `x.wait(c)` allows priority-based resumption using priority number c (lowest integer = highest priority).",
    interview: "Key difference between Semaphore signal and Monitor condition variable signal: A semaphore signal() has permanent state (memory)—if no thread is waiting, it increments the semaphore value. A condition variable signal() is strictly stateless (memoryless)—if no thread is waiting at that exact millisecond, the signal evaporates into thin air!",
    mnemonic: "Monitors = Automatic Mutual Exclusion + Condition Variables (`wait()` blocks, `signal()` wakes, stateless).",
    analogy: "ATM Vestibule: The automatic glass door locks as soon as 1 customer enters (Monitor). Inside, if your cash card is unverified, you step to the side waiting bench (condition.wait) until the phone agent calls your name (condition.signal).",
    mistakes: "Thinking a condition variable has an integer counter like a semaphore. Condition variables have NO counter; `x.signal()` without a waiting process does nothing!",
    examPoints: [
      "Explain the architecture and schematic view of a Monitor with condition variables (10 Marks / SRM Slide 150-153).",
      "Differentiate between Signal-and-Wait and Signal-and-Continue semantics (5 Marks / SRM Slide 154).",
      "Write the complete Monitor solution for the Dining-Philosophers problem (10 Marks / SRM Slide 155-156).",
      "Explain how a monitor is implemented using semaphores (mutex, next, next_count) (10 Marks / SRM Slide 158-160)."
    ],
    code: {
      lang: "c",
      title: "Monitor Solution to Dining Philosophers (SRM Slide 155-156)",
      snippet: `monitor DiningPhilosophers {
    enum { THINKING, HUNGRY, EATING } state[5];
    condition self[5];

    void pickup(int i) {
        state[i] = HUNGRY;
        test(i);
        if (state[i] != EATING)
            self[i].wait();
    }

    void putdown(int i) {
        state[i] = THINKING;
        test((i + 4) % 5); /* test left neighbor */
        test((i + 1) % 5); /* test right neighbor */
    }

    void test(int i) {
        if ((state[(i + 4) % 5] != EATING) &&
            (state[i] == HUNGRY) &&
            (state[(i + 1) % 5] != EATING)) {
            state[i] = EATING;
            self[i].signal();
        }
    }

    initialization_code() {
        for (int i = 0; i < 5; i++)
            state[i] = THINKING;
    }
}`,
      explanation: "Deadlock-free monitor: a philosopher transitions to EATING only if neither left neighbor ((i+4)%5) nor right neighbor ((i+1)%5) is currently eating."
    }
  }
];
