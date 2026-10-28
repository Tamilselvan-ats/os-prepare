// =============================================================================
// INTERACTIVE VISUAL LEARNING DIAGRAMS & ANIMATION CONTROLLER
// Renders rich interactive SVG/Canvas state machines and architectural diagrams
// with Play, Step, and Reset animation controls
// =============================================================================

window.VisualDiagrams = {
  // 1. Process 5-State Transition Diagram
  renderProcessStateMachine(containerId, activeState = "ready", transitionEvent = null) {
    const states = [
      { id: "new", label: "NEW", x: 80, y: 80, desc: "Process is being created" },
      { id: "ready", label: "READY", x: 260, y: 160, desc: "Waiting for CPU in RAM" },
      { id: "running", label: "RUNNING", x: 500, y: 160, desc: "Instructions executing" },
      { id: "waiting", label: "WAITING", x: 380, y: 280, desc: "Waiting for I/O or event" },
      { id: "terminated", label: "TERMINATED", x: 680, y: 80, desc: "Finished execution" }
    ];

    let svg = `
      <svg viewBox="0 0 760 360" class="w-full h-auto select-none">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
        </defs>

        <!-- Connection Paths -->
        <!-- New -> Ready -->
        <path d="M 130 95 Q 190 120 220 145" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
        <text x="155" y="105" fill="#94a3b8" font-size="11" font-weight="600">admitted</text>

        <!-- Ready -> Running -->
        <path d="M 315 150 Q 380 130 445 150" fill="none" stroke="${transitionEvent === 'dispatch' ? '#38bdf8' : '#64748b'}" stroke-width="${transitionEvent === 'dispatch' ? '3' : '2'}" marker-end="url(#arrow${transitionEvent === 'dispatch' ? '-active' : ''})" />
        <text x="345" y="130" fill="${transitionEvent === 'dispatch' ? '#38bdf8' : '#94a3b8'}" font-size="11" font-weight="600">scheduler dispatch</text>

        <!-- Running -> Ready (Interrupt) -->
        <path d="M 445 175 Q 380 200 315 175" fill="none" stroke="${transitionEvent === 'interrupt' ? '#f59e0b' : '#64748b'}" stroke-width="2" marker-end="url(#arrow)" />
        <text x="355" y="200" fill="#94a3b8" font-size="11" font-weight="600">interrupt</text>

        <!-- Running -> Waiting (I/O wait) -->
        <path d="M 490 195 Q 470 250 435 270" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
        <text x="475" y="240" fill="#94a3b8" font-size="11" font-weight="600">I/O or event wait</text>

        <!-- Waiting -> Ready (I/O completion) -->
        <path d="M 335 275 Q 290 250 270 200" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
        <text x="220" y="250" fill="#94a3b8" font-size="11" font-weight="600">I/O completion</text>

        <!-- Running -> Terminated -->
        <path d="M 545 140 Q 600 110 635 90" fill="none" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" />
        <text x="590" y="105" fill="#94a3b8" font-size="11" font-weight="600">exit</text>

        <!-- State Circles -->
    `;

    states.forEach(s => {
      const isAct = s.id === activeState;
      svg += `
        <g class="cursor-pointer transition-transform duration-300 hover:scale-105" onclick="VisualDiagrams.switchState('${s.id}')">
          <circle cx="${s.x}" cy="${s.y}" r="45" fill="${isAct ? '#1e293b' : '#0f172a'}" stroke="${isAct ? '#38bdf8' : '#334155'}" stroke-width="${isAct ? '3' : '2'}" />
          ${isAct ? `<circle cx="${s.x}" cy="${s.y}" r="50" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4 4" class="animate-spin" />` : ''}
          <text x="${s.x}" y="${s.y + 4}" fill="${isAct ? '#38bdf8' : '#f8fafc'}" font-size="12" font-weight="bold" text-anchor="middle">${s.label}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = svg;
  },

  switchState(stateId) {
    this.renderProcessStateMachine("process-state-canvas", stateId);
    const infoEl = document.getElementById("process-state-info");
    const descriptions = {
      new: "NEW: The process is being created and initialized by the operating system kernel.",
      ready: "READY: The process is residing in main memory (RAM), fully ready and waiting for short-term CPU scheduler dispatch.",
      running: "RUNNING: Instructions are currently being fetched and executed on a physical CPU core.",
      waiting: "WAITING: Process is blocked waiting for an external event (such as disk I/O completion or signal arrival).",
      terminated: "TERMINATED: Process has executed its final statement via exit() and is awaiting resource deallocation by parent wait()."
    };
    if (infoEl) infoEl.innerText = descriptions[stateId] || "";
  },

  // 2. Process Memory Layout Interactive Canvas
  renderProcessMemory(containerId, allocatedHeap = 3, allocatedStack = 2) {
    const svg = `
      <svg viewBox="0 0 340 460" class="w-full max-w-sm mx-auto h-auto select-none">
        <!-- Container Box -->
        <rect x="50" y="20" width="240" height="420" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2" />

        <!-- Address labels -->
        <text x="35" y="435" fill="#64748b" font-size="11" font-mono text-anchor="end">0x0000 (0)</text>
        <text x="35" y="35" fill="#64748b" font-size="11" font-mono text-anchor="end">0xFFFF (Max)</text>

        <!-- TEXT SECTION -->
        <rect x="55" y="380" width="230" height="55" rx="6" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
        <text x="170" y="405" fill="#60a5fa" font-size="13" font-weight="bold" text-anchor="middle">TEXT (Code)</text>
        <text x="170" y="422" fill="#94a3b8" font-size="10" text-anchor="middle">Compiled machine instructions</text>

        <!-- DATA SECTION -->
        <rect x="55" y="315" width="230" height="60" rx="6" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
        <text x="170" y="340" fill="#34d399" font-size="13" font-weight="bold" text-anchor="middle">DATA</text>
        <text x="170" y="357" fill="#94a3b8" font-size="10" text-anchor="middle">Global & Static variables</text>

        <!-- HEAP -->
        <rect x="55" y="${310 - allocatedHeap * 22}" width="230" height="${allocatedHeap * 22}" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5" />
        <text x="170" y="${325 - allocatedHeap * 11}" fill="#fbbf24" font-size="13" font-weight="bold" text-anchor="middle">HEAP (Dynamic)</text>
        <!-- Heap growth arrow -->
        <line x1="170" y1="${300 - allocatedHeap * 22}" x2="170" y2="${275 - allocatedHeap * 22}" stroke="#fbbf24" stroke-width="2" marker-end="url(#arrow)" />
        <text x="195" y="${290 - allocatedHeap * 22}" fill="#fbbf24" font-size="10" font-weight="bold">grows ↑</text>

        <!-- UNALLOCATED GAP -->
        <rect x="55" y="${40 + allocatedStack * 25}" width="230" height="${240 - allocatedHeap * 22 - allocatedStack * 25}" fill="#020617" stroke="#1e293b" stroke-dasharray="4 4" />
        <text x="170" y="${160}" fill="#475569" font-size="11" font-style="italic" text-anchor="middle">Unallocated Address Space</text>

        <!-- STACK -->
        <rect x="55" y="30" width="230" height="${allocatedStack * 25}" rx="6" fill="#1e293b" stroke="#ec4899" stroke-width="1.5" />
        <text x="170" y="${45 + (allocatedStack * 25) / 2}" fill="#f472b6" font-size="13" font-weight="bold" text-anchor="middle">STACK</text>
        <!-- Stack growth arrow -->
        <line x1="170" y1="${35 + allocatedStack * 25}" x2="170" y2="${60 + allocatedStack * 25}" stroke="#f472b6" stroke-width="2" />
        <text x="195" y="${50 + allocatedStack * 25}" fill="#f472b6" font-size="10" font-weight="bold">grows ↓</text>
      </svg>
    `;
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = svg;
  },

  // 3. Real-Time Scheduling Comparison (RMS vs EDF)
  renderRealtimeComparison(containerId) {
    // Exact SRM Slide 41-45 dataset: P1(p=50, t=25) and P2(p=80, t=35)
    const svg = `
      <svg viewBox="0 0 820 320" class="w-full h-auto select-none font-sans">
        <text x="20" y="25" fill="#f8fafc" font-size="14" font-weight="bold">Rate Monotonic Scheduling (RMS) vs Earliest Deadline First (EDF)</text>
        <text x="20" y="45" fill="#94a3b8" font-size="11">Dataset: P1 (Period 50, Burst 25) | P2 (Period 80, Burst 35) | Total Utilization = 94%</text>

        <!-- RMS TIMELINE -->
        <g transform="translate(20, 65)">
          <text x="0" y="25" fill="#ef4444" font-size="13" font-weight="bold">RMS (Static Priority: P1 > P2)</text>
          <!-- Deadlines markers -->
          <line x1="120" y1="0" x2="120" y2="55" stroke="#475569" stroke-dasharray="2 2" />
          <text x="120" y="-5" fill="#94a3b8" font-size="10" text-anchor="middle">P1 d=50</text>

          <line x1="192" y1="0" x2="192" y2="55" stroke="#ef4444" stroke-width="2" stroke-dasharray="3 3" />
          <text x="192" y="-5" fill="#ef4444" font-size="10" font-weight="bold" text-anchor="middle">P2 d=80 (MISSED!)</text>

          <!-- Blocks -->
          <!-- P1 [0-25] -->
          <rect x="0" y="10" width="60" height="35" rx="4" fill="#3b82f6" />
          <text x="30" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P1</text>

          <!-- P2 [25-50] -->
          <rect x="60" y="10" width="60" height="35" rx="4" fill="#64748b" />
          <text x="90" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P2 (25ms)</text>

          <!-- P1 [50-75] (Preempts P2) -->
          <rect x="120" y="10" width="60" height="35" rx="4" fill="#3b82f6" />
          <text x="150" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P1</text>

          <!-- P2 [75-85] (Finishes at 85 > deadline 80!) -->
          <rect x="180" y="10" width="24" height="35" rx="4" fill="#ef4444" />
          <text x="192" y="32" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">P2</text>

          <line x1="0" y1="45" x2="760" y2="45" stroke="#334155" stroke-width="2" />
          <text x="0" y="60" fill="#64748b" font-size="9">0</text>
          <text x="60" y="60" fill="#64748b" font-size="9">25</text>
          <text x="120" y="60" fill="#64748b" font-size="9">50</text>
          <text x="180" y="60" fill="#64748b" font-size="9">75</text>
          <text x="204" y="60" fill="#ef4444" font-size="9" font-weight="bold">85</text>
        </g>

        <!-- EDF TIMELINE -->
        <g transform="translate(20, 195)">
          <text x="0" y="25" fill="#10b981" font-size="13" font-weight="bold">EDF (Dynamic Priority: Earliest Deadline First)</text>
          <!-- Deadlines markers -->
          <line x1="120" y1="0" x2="120" y2="55" stroke="#475569" stroke-dasharray="2 2" />
          <text x="120" y="-5" fill="#94a3b8" font-size="10" text-anchor="middle">P1 d=50</text>

          <line x1="192" y1="0" x2="192" y2="55" stroke="#10b981" stroke-width="1.5" stroke-dasharray="2 2" />
          <text x="192" y="-5" fill="#10b981" font-size="10" font-weight="bold" text-anchor="middle">P2 d=80 (Met!)</text>

          <!-- Blocks -->
          <!-- P1 [0-25] -->
          <rect x="0" y="10" width="60" height="35" rx="4" fill="#3b82f6" />
          <text x="30" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P1</text>

          <!-- P2 [25-60] (Runs through time 50 because deadline 80 < P1's next deadline 100!) -->
          <rect x="60" y="10" width="84" height="35" rx="4" fill="#10b981" />
          <text x="102" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P2 (0-35 done)</text>

          <!-- P1 [60-85] -->
          <rect x="144" y="10" width="60" height="35" rx="4" fill="#3b82f6" />
          <text x="174" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P1</text>

          <!-- P2 [85-100] -->
          <rect x="204" y="10" width="36" height="35" rx="4" fill="#10b981" />
          <text x="222" y="32" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">P2</text>

          <!-- P1 [100-125] -->
          <rect x="240" y="10" width="60" height="35" rx="4" fill="#3b82f6" />
          <text x="270" y="32" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">P1</text>

          <!-- P2 [125-145] -->
          <rect x="300" y="10" width="48" height="35" rx="4" fill="#10b981" />
          <text x="324" y="32" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle">P2</text>

          <!-- Idle [145-150] -->
          <rect x="348" y="10" width="12" height="35" fill="#334155" />

          <line x1="0" y1="45" x2="760" y2="45" stroke="#334155" stroke-width="2" />
          <text x="0" y="60" fill="#64748b" font-size="9">0</text>
          <text x="60" y="60" fill="#64748b" font-size="9">25</text>
          <text x="144" y="60" fill="#64748b" font-size="9">60</text>
          <text x="204" y="60" fill="#64748b" font-size="9">85</text>
          <text x="240" y="60" fill="#64748b" font-size="9">100</text>
          <text x="348" y="60" fill="#64748b" font-size="9">145</text>
          <text x="360" y="60" fill="#10b981" font-size="9" font-weight="bold">150</text>
        </g>
      </svg>
    `;
    const el = document.getElementById(containerId);
    if (el) el.innerHTML = svg;
  }
};
