// =============================================================================
// MEMORY PALACE MODE - IMMERSIVE CONCEPT STORIES & MENTAL HOOKS
// Transform abstract OS concepts into vivid, unforgettable mental models
// =============================================================================

window.MEMORY_PALACE_DATA = [
  {
    id: "palace-pcb",
    concept: "Process Control Block (PCB)",
    unit: 2,
    character: "Student ID Card & Academic File",
    palaceLocation: "The University Registrar Office",
    story: `Walk into the central administration building. Every enrolled student has a thick physical binder known as the **Student ID File (PCB)**.
    
    1. **Process State**: Right on the cover, a large stamp says **"Active in Class" (Running)** or **"In Infirmary" (Waiting)**.
    2. **Program Counter**: A yellow sticky note points to the exact line number on the syllabus the student is reading right now.
    3. **CPU Registers**: In the side pocket sits the student's pencil case, calculator, and ruler—the temporary calculation tools currently holding numbers.
    4. **Scheduling Info**: A silver badge indicates their academic rank (Priority 1 vs Priority 5) and what queue line they must stand in.
    5. **Memory Limits**: The stamp on the bottom sets the perimeter of their dorm room (Base and Limit registers), warning them never to walk into another student's room.
    6. **I/O Status**: A list of library books and science lab equipment currently checked out under their name.
    
    When a professor swaps students at the blackboard (Context Switch), the teacher snaps the binder shut, shelves it, pulls down the next student's binder, and hands them their respective pencil case!`,
    takeaway: "The PCB is the complete digital passport of a process. Without it, the operating system would forget where the process was, what registers it had loaded, and what files it opened."
  },
  {
    id: "palace-semaphore",
    concept: "Counting & Binary Semaphores",
    unit: 2,
    character: "Railway Track Signal & Flagman",
    palaceLocation: "Grand Central Junction",
    story: `Stand next to a bustling train junction with 3 parallel maintenance tracks. By the switch sits a mechanical signal box with a digital counter wheel (**Semaphore S**).
    
    - The wheel currently reads **3** (representing 3 open tracks).
    - An incoming express train blows its whistle and invokes **wait(S) [P-operation]**: The flagman decrements the wheel to **2** and lets the train roar through.
    - Two more freight trains arrive: the wheel decrements to **1**, then to **0**.
    - A fourth coal train arrives: it calls **wait(S)**, decrements the wheel to **-1**! Because the counter is negative, the flagman throws a red lever (**block()**), forcing the train onto a waiting siding queue.
    - If a fifth train arrives, the counter drops to **-2** (meaning 2 trains are stranded in the queue).
    - Finally, the first express train finishes maintenance and blows its exit horn (**signal(S) [V-operation]**): the counter increments to **-1**. Because the counter is still <= 0, the flagman immediately pulls the green switch (**wakeup()**) to let the stranded coal train onto the cleared track!`,
    takeaway: "wait() decrements and blocks if negative; signal() increments and awakens. A negative semaphore value is not broken math—its magnitude tells you exactly how many trains are stranded in the waiting siding!"
  },
  {
    id: "palace-mutex",
    concept: "Mutex Lock vs Spinlock",
    unit: 2,
    character: "The Single Coffee Shop Bathroom Key",
    palaceLocation: "The Busy Downtown Coffee Shop",
    story: `You are at an espresso bar with 50 customers and exactly **ONE** single-occupancy restroom (**The Critical Section**).
    
    - Attached to the barista's counter is a heavy brass key attached to a giant wooden block (**The Mutex Lock**).
    - Customer A grabs the key (**acquire()**), walks to the restroom, unlocks the door, and steps inside to wash hands.
    - Customer B arrives at the counter. The key is missing (**available == false**).
    - **Spinlock Scenario**: Customer B stands 6 inches outside the bathroom door, violently rattling the door handle every 0.1 seconds screaming "Are you done yet?!" (**while(!available); busy wait**). This burns huge energy (100% CPU cycles), but the second Customer A steps out, Customer B rushes in with zero delay!
    - **Sleeping Mutex Scenario**: Customer B takes a buzzer ticket, sits down in a comfortable lounge chair, and takes a nap (**block()**). When Customer A returns the key to the barista (**release()**), the barista buzzes Customer B awake (**wakeup()**).`,
    takeaway: "Spinlocks waste CPU cycles spinning in circles, but avoid context switch delays for lightning-fast tasks. Sleeping mutexes save power and CPU cycles by putting waiting threads to sleep."
  },
  {
    id: "palace-deadlock",
    concept: "Deadlock & Coffman Conditions",
    unit: 3,
    character: "Four Friends at a Four-Way Intersection",
    palaceLocation: "The Crossroads in Old Town",
    story: `Four proud friends—Arthur, Beatrice, Charles, and David—drive four vintage convertibles and arrive simultaneously at an unmarked four-way crossroads from North, East, South, and West.
    
    1. **Mutual Exclusion**: Only one car can physically occupy the center intersection asphalt at a time.
    2. **Hold and Wait**: Arthur is sitting inside the intersection grid holding his spot, refusing to reverse while waiting for Beatrice to move.
    3. **No Preemption**: Nobody has a tow truck strong enough to yank a car backwards against the driver's will; each driver must move voluntarily.
    4. **Circular Wait**: Arthur waits for Beatrice; Beatrice waits for Charles; Charles waits for David; David waits for Arthur!
    
    Horn blaring, engines idling, gasoline burning—nobody can move an inch! They will stay frozen until the end of time unless someone steps outside the system to break the circle.`,
    takeaway: "All four conditions must lock together like puzzle pieces. Break any single condition—allow a tow truck (Preemption), force reverse (Release on hold), or require North-South priority (Circular wait ordering)—and the deadlock dissolves instantly."
  },
  {
    id: "palace-threads",
    concept: "Threads vs Heavyweight Processes",
    unit: 2,
    character: "Chefs in a Shared Restaurant Kitchen",
    palaceLocation: "Le Concurrency Bistro",
    story: `**Creating a Heavyweight Process**: Imagine if every time a customer ordered a burger, the restaurant had to buy a whole new building across the street, install new stoves, hire new cashiers, and run telephone cables to talk (**fork() & new address space**). That is heavy, expensive, and takes minutes!
    
    **Multithreading**: Instead, keep ONE single kitchen building (**Process**). Inside that kitchen, hire 4 nimble chefs (**Threads**):
    - They share the same walk-in refrigerator, pantry ingredients, and recipe manuals (**Shared Data, Heap, and Code**).
    - But each chef has their own cutting board, knife set, and handwritten ticket notepad (**Private Stack, Registers, and Program Counter**).
    - Chef 1 chops salads, Chef 2 grills steaks, and Chef 3 bakes desserts simultaneously.
    - If Chef 2 burns their hand on the stove (segfault in unshared memory), the whole kitchen might panic! But as long as they communicate carefully without bumping elbows (synchronization), the restaurant serves 4x the customers!`,
    takeaway: "Threads share address space, code, and files for maximum speed and zero memory bloat, while maintaining independent execution stacks and program counters."
  },
  {
    id: "palace-context-switch",
    concept: "Context Switching Overhead",
    unit: 2,
    character: "The Overwhelmed Librarian",
    palaceLocation: "The Ancient High Vault Library",
    story: `A scholar is seated at a massive oak study table translating an ancient Greek parchment (**Process P0**).
    
    - An urgent bell rings: a royal messenger demands an immediate translation of a Latin scroll (**Process P1**).
    - The scholar cannot just start reading. They must:
      1. Carefully place a ribbon bookmark on Greek line 247 (**Save Program Counter**).
      2. Record ink pen levels and magnifying glass magnification in the logbook (**Save CPU Registers into PCB0**).
      3. Walk across the hall into the locked royal vault (**Switch to Kernel Mode**).
      4. Pull down the Latin scroll box (**Retrieve PCB1**).
      5. Adjust reading glasses and open Latin scroll to page 12 (**Restore Registers and PC**).
      6. Step back out to the table (**Switch back to User Mode**).
    
    During these 5 minutes, ZERO words of ancient text were translated! That is **Context Switch Overhead**. If the king demands swapping scrolls every 30 seconds, the scholar spends the entire day walking between bookshelves translating zero history!`,
    takeaway: "Context switching creates no productive work—it is pure administrative housekeeping. High context switch rates kill throughput."
  },
  {
    id: "palace-banker",
    concept: "Banker's Algorithm & Safe State",
    unit: 3,
    character: "The Cautious Village Money-Lender",
    palaceLocation: "The Medieval Town Guildhall",
    story: `Old Man Silas is the village banker. He has **10 Gold Ingots (Resource A), 5 Silver Coins (B), and 7 Copper Bricks (C)** in his heavy iron safe.
    
    - Five village merchants come asking for credit.
    - Each merchant signs a parchment pledging the MAXIMUM loan they will ever need to finish their trade voyage (**Max Matrix**).
    - Silas gives them a small down payment (**Allocation Matrix**).
    - The difference between what they pledged and what they hold right now is their remaining hunger (**Need = Max - Allocation**).
    - Now Merchant 1 knocks on the shutter: *"Silas, lend me 1 Gold and 2 Copper right now!"*
    - Does Silas hand over the coins? **Never without a safety drill!**
    - Silas sits at his desk and plays out the future in his ledger (**Safety Algorithm**):
      - *"If I give Merchant 1 these coins, my safe holds Work = Available - Request."*
      - *"Can ANY merchant finish their entire voyage with what is left in my safe?"*
      - Ah! Merchant 1 only needs 2 more silver to finish. Silas mentally pretends to let Merchant 1 finish, sell their silks, and return ALL their borrowed gold (**Work = Work + Allocation**).
      - With that mountain of returned treasure, Merchant 3 can finish, then Merchant 4, then Merchant 0, then Merchant 2!
      - Silas smiles: *"There exists a Safe Sequence <P1, P3, P4, P0, P2>! The request is GRANTED!"*
    - But if granting the loan leaves the safe with too little cash to guarantee even one merchant can finish, Silas slams the shutter: *"REJECTED! You must wait until someone else pays back their loan!"*`,
    takeaway: "The Banker's Algorithm avoids deadlocks by ensuring the system never enters an unsafe state. A state is safe only if at least one complete sequence of processes can finish."
  }
];
