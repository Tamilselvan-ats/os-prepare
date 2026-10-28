// =============================================================================
// MAIN APPLICATION CONTROLLER
// Complete SPA routing, state persistence, streak tracker, search engine,
// and renderers for all 10 core sections
// =============================================================================

window.app = {
  currentTab: "home",
  activeUnit: 2,
  activeTopicId: "process-concept",
  topicTab: "beginner", // beginner, college, interview, mnemonic, analogy, mistakes, exam
  codingTopicId: "c-fork-exec",
  examFilterMarks: "all",
  interviewDifficulty: "all",
  flashcardIndex: 0,
  flashcardFlipped: false,
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,

  // Local Storage Data
  userData: {
    streak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    completedTopics: {},
    quizHighScore: 0,
    flashcardMastery: {}
  },

  init() {
    this.loadUserData();
    this.updateStreak();
    this.bindEvents();
    this.switchTab(this.currentTab);
    GeminiAIEngine.updateStatusBadge();
  },

  loadUserData() {
    try {
      const saved = localStorage.getItem("os_prep_user_data");
      if (saved) {
        this.userData = Object.assign(this.userData, JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load user data from storage", e);
    }
  },

  saveUserData() {
    try {
      localStorage.setItem("os_prep_user_data", JSON.stringify(this.userData));
    } catch (e) {
      console.warn("Could not save user data to storage", e);
    }
  },

  updateStreak() {
    const today = new Date().toISOString().split("T")[0];
    if (this.userData.lastActiveDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (this.userData.lastActiveDate === yesterday) {
        this.userData.streak++;
      } else {
        this.userData.streak = 1;
      }
      this.userData.lastActiveDate = today;
      this.saveUserData();
    }
    const streakEl = document.getElementById("header-streak-count");
    if (streakEl) streakEl.innerText = this.userData.streak;
  },

  toggleTopicComplete(topicId) {
    if (this.userData.completedTopics[topicId]) {
      delete this.userData.completedTopics[topicId];
    } else {
      this.userData.completedTopics[topicId] = true;
    }
    this.saveUserData();
    this.renderHeaderProgress();
    if (this.currentTab === "home") this.renderHome();
    if (this.currentTab === "unit-explorer") this.renderUnitExplorer();
  },

  getUnitProgress(unitNum) {
    const data = unitNum === 2 ? UNIT2_DATA : UNIT3_DATA;
    let completedCount = 0;
    data.forEach(t => {
      if (this.userData.completedTopics[t.id]) completedCount++;
    });
    const percent = Math.round((completedCount / data.length) * 100);
    return { completed: completedCount, total: data.length, percent };
  },

  renderHeaderProgress() {
    const u2 = this.getUnitProgress(2);
    const u3 = this.getUnitProgress(3);
    const totalComp = u2.completed + u3.completed;
    const totalAll = u2.total + u3.total;
    const overallPercent = Math.round((totalComp / totalAll) * 100);

    const progEl = document.getElementById("header-overall-progress");
    if (progEl) {
      progEl.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div class="bg-gradient-to-r from-sky-400 to-emerald-400 h-full transition-all duration-500" style="width: ${overallPercent}%"></div>
          </div>
          <span class="text-xs font-bold text-slate-300">${overallPercent}% Mastery</span>
        </div>
      `;
    }
  },

  switchTab(tabId) {
    this.currentTab = tabId;

    // Update active nav link style
    document.querySelectorAll(".nav-link").forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add("bg-sky-500/15", "text-sky-400", "border-sky-500/30");
        btn.classList.remove("text-slate-400", "border-transparent");
      } else {
        btn.classList.remove("bg-sky-500/15", "text-sky-400", "border-sky-500/30");
        btn.classList.add("text-slate-400", "border-transparent");
      }
    });

    const contentArea = document.getElementById("main-content-area");
    if (!contentArea) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    switch (tabId) {
      case "home":
        this.renderHome();
        break;
      case "unit-explorer":
        this.renderUnitExplorer();
        break;
      case "sim-cpu":
        this.renderCPUSimulator();
        break;
      case "sim-rag":
        this.renderDeadlockSimulator();
        break;
      case "sim-banker":
        this.renderBankerSimulator();
        break;
      case "sim-sync":
        this.renderSyncSimulator();
        break;
      case "palace":
        this.renderMemoryPalace();
        break;
      case "coding":
        this.renderCodingSection();
        break;
      case "interview":
        this.renderInterviewPrep();
        break;
      case "exam":
        this.renderExamMaster();
        break;
      case "flashcards":
        this.renderFlashcards();
        break;
      case "quiz":
        this.renderQuizEngine();
        break;
      case "ai-tutor":
        this.renderAiTutor();
        break;
      default:
        this.renderHome();
    }
  },

  // ===========================================================================
  // 1. HOME SECTION
  // ===========================================================================
  renderHome() {
    const u2 = this.getUnitProgress(2);
    const u3 = this.getUnitProgress(3);
    const overallComp = u2.completed + u3.completed;
    const overallTotal = u2.total + u3.total;
    const overallPct = Math.round((overallComp / overallTotal) * 100);

    const html = `
      <div class="space-y-8 animate-fadeIn">
        <!-- Hero Banner -->
        <div class="relative overflow-hidden rounded-2xl glass-panel p-8 border border-sky-500/20 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-sky-950/30">
          <div class="absolute -right-10 -bottom-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="relative z-10 max-w-3xl space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
              SRM University 21CSC202J Complete Learning Platform
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Master <span class="bg-gradient-to-r from-sky-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">Operating Systems</span> with Zero Content Omission.
            </h1>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every definition, diagram, C/Java implementation, CPU scheduling numerical, and deadlock algorithm from the official course materials—transformed into an interactive visual playground.
            </p>
            <div class="flex flex-wrap items-center gap-4 pt-2">
              <button onclick="app.switchTab('unit-explorer')" class="px-5 py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5">
                Explore Curriculum →
              </button>
              <button onclick="app.switchTab('sim-cpu')" class="px-5 py-2.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all">
                Launch CPU Simulator
              </button>
              <button onclick="app.switchTab('ai-tutor')" class="px-5 py-2.5 rounded-xl font-bold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-2">
                <span>🤖</span> Ask Gemini AI
              </button>
            </div>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Streak Card -->
          <div class="glass-panel p-5 rounded-2xl border border-amber-500/20 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl">
              🔥
            </div>
            <div>
              <div class="text-xs font-semibold text-slate-400">Study Streak</div>
              <div class="text-2xl font-black text-amber-400">${this.userData.streak} Days</div>
              <div class="text-xs text-slate-400">Keep it going daily!</div>
            </div>
          </div>

          <!-- Unit 2 Card -->
          <div class="glass-panel p-5 rounded-2xl border border-sky-500/20 flex items-center gap-4 cursor-pointer hover:border-sky-500/40 transition-colors" onclick="app.selectUnit(2)">
            <div class="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-2xl">
              ⚙️
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Unit 2: Processes</span>
                <span class="text-sky-400">${u2.percent}%</span>
              </div>
              <div class="text-xl font-bold text-slate-100">${u2.completed} / ${u2.total} Topics</div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-sky-400 h-full" style="width: ${u2.percent}%"></div>
              </div>
            </div>
          </div>

          <!-- Unit 3 Card -->
          <div class="glass-panel p-5 rounded-2xl border border-purple-500/20 flex items-center gap-4 cursor-pointer hover:border-purple-500/40 transition-colors" onclick="app.selectUnit(3)">
            <div class="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-2xl">
              ⏱️
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Unit 3: Sched & Deadlocks</span>
                <span class="text-purple-400">${u3.percent}%</span>
              </div>
              <div class="text-xl font-bold text-slate-100">${u3.completed} / ${u3.total} Topics</div>
              <div class="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div class="bg-purple-400 h-full" style="width: ${u3.percent}%"></div>
              </div>
            </div>
          </div>

          <!-- Overall Mastery Card -->
          <div class="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div class="flex-1">
              <div class="text-xs font-semibold text-slate-400">Course Mastery</div>
              <div class="text-2xl font-black text-emerald-400">${overallPct}%</div>
              <div class="text-xs text-slate-400">${overallComp} of ${overallTotal} concepts completed</div>
            </div>
          </div>
        </div>

        <!-- Visual Learning Roadmap -->
        <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-white flex items-center gap-2">
                <span>🗺️</span> Interactive Learning Roadmap
              </h2>
              <p class="text-xs sm:text-sm text-slate-400">Structured sequential curriculum designed for 100% exam score & FAANG interview mastery.</p>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="app.selectUnit(2)" class="px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeUnit === 2 ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'}">Unit 2</button>
              <button onclick="app.selectUnit(3)" class="px-3 py-1.5 rounded-lg text-xs font-semibold ${this.activeUnit === 3 ? 'bg-purple-500 text-white font-bold' : 'bg-slate-800 text-slate-300'}">Unit 3</button>
            </div>
          </div>

          <!-- Roadmap Nodes Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${(this.activeUnit === 2 ? UNIT2_DATA : UNIT3_DATA).map((topic, idx) => {
              const isComp = this.userData.completedTopics[topic.id];
              return `
                <div onclick="app.openTopic('${topic.id}', ${topic.unit})" class="glass-panel p-4 rounded-xl border ${isComp ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-sky-500/40'} transition-all cursor-pointer group flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono font-bold ${topic.unit === 2 ? 'text-sky-400' : 'text-purple-400'}">#${idx + 1}</span>
                      <span class="text-xs px-2 py-0.5 rounded-md ${isComp ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'} font-medium">
                        ${isComp ? '✅ Completed' : topic.badge}
                      </span>
                    </div>
                    <h3 class="font-bold text-sm text-slate-100 group-hover:text-sky-300 transition-colors">${topic.title}</h3>
                    <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">${topic.beginner}</p>
                  </div>
                  <div class="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span class="flex items-center gap-1">📖 7 Depth Layers</span>
                    <span class="text-sky-400 group-hover:translate-x-1 transition-transform">Learn →</span>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  selectUnit(uNum) {
    this.activeUnit = uNum;
    if (this.currentTab === "home") {
      this.renderHome();
    } else {
      this.renderUnitExplorer();
    }
  },

  openTopic(topicId, uNum) {
    this.activeUnit = uNum;
    this.activeTopicId = topicId;
    this.topicTab = "beginner";
    this.switchTab("unit-explorer");
  },

  // ===========================================================================
  // 2. UNIT EXPLORER & 7-LAYER TOPIC VIEWER
  // ===========================================================================
  renderUnitExplorer() {
    const list = this.activeUnit === 2 ? UNIT2_DATA : UNIT3_DATA;
    let topic = list.find(t => t.id === this.activeTopicId) || list[0];
    this.activeTopicId = topic.id;
    const isComp = !!this.userData.completedTopics[topic.id];

    const html = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
        <!-- Sidebar Topic List -->
        <div class="lg:col-span-4 glass-panel rounded-2xl border border-slate-800 p-4 space-y-4 max-h-[85vh] overflow-y-auto">
          <div class="flex items-center justify-between pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <button onclick="app.selectUnit(2)" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${this.activeUnit === 2 ? 'bg-sky-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                Unit 2: Processes
              </button>
              <button onclick="app.selectUnit(3)" class="px-3 py-1 rounded-lg text-xs font-bold transition-all ${this.activeUnit === 3 ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                Unit 3: Deadlocks
              </button>
            </div>
            <span class="text-xs text-slate-400 font-mono">${list.length} Topics</span>
          </div>

          <div class="space-y-1.5">
            ${list.map((t, idx) => {
              const active = t.id === topic.id;
              const comp = this.userData.completedTopics[t.id];
              return `
                <div onclick="app.openTopic('${t.id}', ${t.unit})" class="p-3 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-all ${active ? (t.unit === 2 ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 font-bold' : 'bg-purple-500/15 text-purple-300 border border-purple-500/40 font-bold') : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'}">
                  <div class="flex items-center gap-2.5 truncate">
                    <span class="text-slate-500 font-mono">${idx + 1}.</span>
                    <span class="truncate">${t.title}</span>
                  </div>
                  <span>${comp ? '✅' : '○'}</span>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Main Topic Workspace -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Topic Header Bar -->
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-md text-xs font-bold ${topic.unit === 2 ? 'badge-unit2' : 'badge-unit3'}">Unit ${topic.unit}</span>
                <span class="text-xs text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800">${topic.badge}</span>
              </div>
              <button onclick="app.toggleTopicComplete('${topic.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isComp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}">
                <span>${isComp ? '✅ Topic Mastered' : '○ Mark as Completed'}</span>
              </button>
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white">${topic.title}</h1>

            <!-- 7-Depth Layers Navigation Bar -->
            <div class="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
              ${[
                { id: "beginner", icon: "👶", label: "Beginner (10-Yr)" },
                { id: "college", icon: "🎓", label: "College Academic" },
                { id: "interview", icon: "💼", label: "FAANG Interview" },
                { id: "mnemonic", icon: "🧠", label: "Memory Trick" },
                { id: "analogy", icon: "🌍", label: "Real-Life Analogy" },
                { id: "mistakes", icon: "⚠️", label: "Common Traps" },
                { id: "exam", icon: "🎯", label: "Exam Points" }
              ].map(tab => `
                <button onclick="app.setTopicTab('${tab.id}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${this.topicTab === tab.id ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'}">
                  <span>${tab.icon}</span>
                  <span>${tab.label}</span>
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Active Layer Content Card -->
          <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            ${this.renderTopicLayerContent(topic)}
          </div>

          <!-- Code Snippet or Numerical Embed if available -->
          ${topic.code ? `
            <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
              <div class="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-sky-400 flex items-center gap-2">
                  <span>💻</span> ${topic.code.title} (${topic.code.lang.toUpperCase()})
                </span>
                <button onclick="navigator.clipboard.writeText(\`${topic.code.snippet.replace(/`/g, "\\`")}\`); alert('Code copied to clipboard!');" class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800">
                  Copy Code
                </button>
              </div>
              <pre class="p-5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 bg-slate-950/80 leading-relaxed"><code>${this.escapeHtml(topic.code.snippet)}</code></pre>
              <div class="p-4 bg-slate-900/40 border-t border-slate-800 text-xs text-slate-400">
                <strong class="text-slate-300">Explanation:</strong> ${topic.code.explanation}
              </div>
            </div>
          ` : ''}

          <!-- Diagram Embed if available -->
          ${topic.id === "process-states" ? `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>🔄</span> Interactive 5-State Machine</h3>
                <span class="text-xs text-slate-400">Click states to inspect transitions</span>
              </div>
              <div id="process-state-canvas"></div>
              <div id="process-state-info" class="text-xs text-sky-300 p-3 rounded-lg bg-sky-950/30 border border-sky-800/40">
                Select any state node above to inspect its kernel behavior.
              </div>
            </div>
          ` : ''}

          ${topic.id === "process-in-memory" ? `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📦</span> Process Memory Layout (Stack vs Heap)</h3>
              <div id="memory-layout-canvas"></div>
            </div>
          ` : ''}

          ${topic.id === "rate-monotonic-scheduling" || topic.id === "earliest-deadline-first" ? `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2"><span>📊</span> RMS vs EDF Execution Timeline Comparison</h3>
              <div id="realtime-comparison-canvas"></div>
            </div>
          ` : ''}

          <!-- Bottom Action Row: Ask AI Professor about this topic -->
          <div class="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl">
                🤖
              </div>
              <div>
                <div class="text-xs font-bold text-white">Have a specific doubt about "${topic.title}"?</div>
                <div class="text-xs text-slate-400">Ask the Gemini AI Operating Systems Professor for instant clarification.</div>
              </div>
            </div>
            <button onclick="app.askAiAboutTopic('${topic.title}')" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 whitespace-nowrap shadow-md">
              Ask AI Professor →
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;

    // Trigger visual canvas renderers if applicable
    if (topic.id === "process-states") {
      setTimeout(() => VisualDiagrams.renderProcessStateMachine("process-state-canvas", "ready"), 50);
    }
    if (topic.id === "process-in-memory") {
      setTimeout(() => VisualDiagrams.renderProcessMemory("memory-layout-canvas", 3, 2), 50);
    }
    if (topic.id === "rate-monotonic-scheduling" || topic.id === "earliest-deadline-first") {
      setTimeout(() => VisualDiagrams.renderRealtimeComparison("realtime-comparison-canvas"), 50);
    }
  },

  setTopicTab(tab) {
    this.topicTab = tab;
    this.renderUnitExplorer();
  },

  renderTopicLayerContent(topic) {
    switch (this.topicTab) {
      case "beginner":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>👶</span> Beginner Explanation (10-Year-Old Level)
            </div>
            <p class="text-base sm:text-lg text-slate-100 leading-relaxed font-medium">${topic.beginner}</p>
          </div>
        `;
      case "college":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎓</span> College-Level Academic Explanation (SRM / Galvin)
            </div>
            <p class="text-sm sm:text-base text-slate-200 leading-relaxed">${topic.college}</p>
          </div>
        `;
      case "interview":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💼</span> FAANG Software Engineer & Interview Expectation
            </div>
            <p class="text-sm sm:text-base text-slate-200 leading-relaxed">${topic.interview}</p>
          </div>
        `;
      case "mnemonic":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🧠</span> Memory Trick & Mnemonic Hook
            </div>
            <div class="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 text-sm sm:text-base font-semibold leading-relaxed">
              ${topic.mnemonic}
            </div>
          </div>
        `;
      case "analogy":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌍</span> Real-Life Analogy
            </div>
            <p class="text-sm sm:text-base text-slate-200 leading-relaxed">${topic.analogy}</p>
          </div>
        `;
      case "mistakes":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚠️</span> Common Traps & Exam Mistakes Students Make
            </div>
            <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 text-sm sm:text-base leading-relaxed">
              ${topic.mistakes}
            </div>
          </div>
        `;
      case "exam":
        return `
          <div class="space-y-3">
            <div class="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span> Frequently Asked Exam Questions & University Marks
            </div>
            <ul class="space-y-2 text-sm text-slate-200">
              ${topic.examPoints.map(pt => `
                <li class="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <span class="text-sky-400 font-bold">📌</span>
                  <span>${pt}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        `;
      default:
        return `<p>${topic.beginner}</p>`;
    }
  },

  // ===========================================================================
  // 3. CPU SCHEDULING SIMULATOR VIEW
  // ===========================================================================
  renderCPUSimulator() {
    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>⏱️</span> Interactive CPU Scheduling Simulator
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Simulate FCFS, SJF, SRTF, Priority (Preemptive & Non-Preemptive), Round Robin, and MLFQ with live Gantt Charts.
            </p>
          </div>

          <!-- Presets Selector -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-semibold whitespace-nowrap">Load Preset:</span>
            <select id="cpu-preset-select" onchange="app.loadCPUPreset(this.value)" class="px-3 py-1.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-slate-200 font-medium">
              <option value="">-- Choose SRM Slide Preset --</option>
              ${Object.keys(CPUSchedulerSimulator.presets).map(k => `
                <option value="${k}">${CPUSchedulerSimulator.presets[k].name}</option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Controls & Process Table -->
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 mb-1">Algorithm</label>
              <select id="sim-algo-select" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-white">
                <option value="FCFS">First-Come, First-Served (FCFS)</option>
                <option value="SJF">Shortest-Job-First (SJF Non-Preemptive)</option>
                <option value="SRTF">Shortest-Remaining-Time-First (SRTF Preemptive)</option>
                <option value="Priority-NP">Priority (Non-Preemptive)</option>
                <option value="Priority-P">Priority (Preemptive)</option>
                <option value="RR">Round Robin (RR)</option>
                <option value="MLFQ">Multilevel Feedback Queue (MLFQ)</option>
              </select>
            </div>

            <div id="quantum-input-wrap">
              <label class="block text-xs font-bold text-slate-400 mb-1">Time Quantum (ms)</label>
              <input type="number" id="sim-quantum-input" value="4" min="1" max="100" class="w-24 px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono" />
            </div>

            <div class="flex-1 flex justify-end gap-2 pt-5">
              <button onclick="app.addCPUProcessRow()" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700">
                + Add Process
              </button>
              <button onclick="app.executeCPUSimulation()" class="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25">
                Run Simulation ▶
              </button>
            </div>
          </div>

          <!-- Dynamic Process Input Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300 font-mono">
              <thead class="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px]">
                <tr>
                  <th class="p-3">Process ID</th>
                  <th class="p-3">Arrival Time (AT)</th>
                  <th class="p-3">Burst Time (BT)</th>
                  <th class="p-3">Priority</th>
                  <th class="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody id="cpu-process-table-body" class="divide-y divide-slate-800">
                <!-- Rows injected dynamically -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- Simulation Output Container -->
        <div id="cpu-sim-results" class="space-y-6">
          <!-- Injected after simulation run -->
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;

    // Load default preset initially
    this.loadCPUPreset("fcfs-convoy");
  },

  loadCPUPreset(presetKey) {
    const preset = CPUSchedulerSimulator.presets[presetKey];
    if (!preset) return;

    const algoSelect = document.getElementById("sim-algo-select");
    const qInput = document.getElementById("sim-quantum-input");
    if (algoSelect) algoSelect.value = preset.algo;
    if (qInput) qInput.value = preset.quantum;

    const tbody = document.getElementById("cpu-process-table-body");
    if (!tbody) return;

    tbody.innerHTML = preset.processes.map((p, idx) => `
      <tr class="hover:bg-slate-800/40">
        <td class="p-3"><input type="text" class="proc-pid bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="${p.pid}" /></td>
        <td class="p-3"><input type="number" class="proc-at bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="${p.at}" min="0" /></td>
        <td class="p-3"><input type="number" class="proc-bt bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="${p.bt}" min="1" /></td>
        <td class="p-3"><input type="number" class="proc-prio bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="${p.priority}" /></td>
        <td class="p-3 text-right">
          <button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300">✕</button>
        </td>
      </tr>
    `).join("");

    this.executeCPUSimulation();
  },

  addCPUProcessRow() {
    const tbody = document.getElementById("cpu-process-table-body");
    if (!tbody) return;
    const count = tbody.querySelectorAll("tr").length + 1;
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-800/40";
    row.innerHTML = `
      <td class="p-3"><input type="text" class="proc-pid bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="P${count}" /></td>
      <td class="p-3"><input type="number" class="proc-at bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="0" min="0" /></td>
      <td class="p-3"><input type="number" class="proc-bt bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="4" min="1" /></td>
      <td class="p-3"><input type="number" class="proc-prio bg-slate-900 border border-slate-800 rounded px-2 py-1 w-20 text-white" value="1" /></td>
      <td class="p-3 text-right">
        <button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300">✕</button>
      </td>
    `;
    tbody.appendChild(row);
  },

  executeCPUSimulation() {
    const algo = document.getElementById("sim-algo-select")?.value || "FCFS";
    const quantum = parseInt(document.getElementById("sim-quantum-input")?.value, 10) || 4;

    const rows = document.querySelectorAll("#cpu-process-table-body tr");
    const procs = [];
    rows.forEach(r => {
      const pid = r.querySelector(".proc-pid").value;
      const at = parseInt(r.querySelector(".proc-at").value, 10) || 0;
      const bt = parseInt(r.querySelector(".proc-bt").value, 10) || 1;
      const prio = parseInt(r.querySelector(".proc-prio").value, 10) || 1;
      procs.push({ pid, at, bt, priority: prio });
    });

    if (procs.length === 0) return;

    // Check if priority preemptive 7-proc preset is used (higher is higher)
    const priorityType = algo === "Priority-P" && procs.length === 7 ? "higher-is-higher" : "lower-is-higher";

    const result = CPUSchedulerSimulator.simulate(algo, procs, quantum, priorityType);
    this.renderCPUSimResults(result);
  },

  renderCPUSimResults(res) {
    const resultsContainer = document.getElementById("cpu-sim-results");
    if (!resultsContainer) return;

    const totalDuration = res.gantt.length > 0 ? res.gantt[res.gantt.length - 1].end : 0;

    resultsContainer.innerHTML = `
      <!-- Gantt Chart Card -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-bold text-white flex items-center gap-2">
            <span>📊</span> Visual Gantt Chart (${res.algorithm})
          </h3>
          <span class="text-xs text-slate-400 font-mono">Total Execution Time: ${totalDuration} ms</span>
        </div>

        <!-- Visual Gantt Timeline -->
        <div class="relative w-full overflow-x-auto pb-4 pt-2">
          <div class="flex min-w-[600px] h-14 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-1">
            ${res.gantt.map(seg => {
              const widthPct = totalDuration > 0 ? ((seg.end - seg.start) / totalDuration) * 100 : 0;
              return `
                <div class="gantt-bar h-full rounded flex flex-col items-center justify-center text-xs font-bold font-mono text-white select-none px-1" style="width: ${widthPct}%; background-color: ${seg.color}; min-width: 28px;" title="${seg.pid} [${seg.start} - ${seg.end}]">
                  <span>${seg.pid}</span>
                  <span class="text-[9px] opacity-80">${seg.end - seg.start}ms</span>
                </div>
              `;
            }).join("")}
          </div>

          <!-- Time Markers -->
          <div class="flex min-w-[600px] justify-between text-[10px] font-mono text-slate-400 px-1 mt-1">
            <span>0</span>
            ${res.gantt.map(s => `<span>${s.end}</span>`).join("")}
          </div>
        </div>
      </div>

      <!-- Metrics Calculation Table -->
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>📋</span> Detailed Process Execution Metrics & Line-by-Line Calculations
        </h3>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs font-mono text-slate-300">
            <thead class="bg-slate-900 text-slate-400 uppercase text-[11px]">
              <tr>
                <th class="p-3">Process</th>
                <th class="p-3">Arrival (AT)</th>
                <th class="p-3">Burst (BT)</th>
                <th class="p-3">Completion (CT)</th>
                <th class="p-3">Turnaround (TAT = CT - AT)</th>
                <th class="p-3">Waiting (WT = TAT - BT)</th>
                <th class="p-3">Response (RT)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${res.processes.map(p => `
                <tr class="hover:bg-slate-800/40">
                  <td class="p-3 font-bold" style="color: ${p.color};">${p.pid}</td>
                  <td class="p-3">${p.at}</td>
                  <td class="p-3">${p.bt}</td>
                  <td class="p-3 font-bold text-slate-100">${p.ct}</td>
                  <td class="p-3 text-sky-400">${p.ct} - ${p.at} = <strong>${p.tat}</strong></td>
                  <td class="p-3 text-emerald-400">${p.tat} - ${p.bt} = <strong>${p.wt}</strong></td>
                  <td class="p-3 text-amber-400">${p.rt}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Averages Summary Banner -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div class="text-xs font-semibold text-emerald-400">Average Waiting Time (AWT)</div>
            <div class="text-xl font-black text-white mt-0.5">${res.avgWT} ms</div>
            <div class="text-xs text-slate-400 font-mono mt-1">Formula: (${res.processes.map(p => p.wt).join(" + ")}) / ${res.processes.length} = ${res.totalWT} / ${res.processes.length} = ${res.avgWT} ms</div>
          </div>

          <div class="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <div class="text-xs font-semibold text-sky-400">Average Turnaround Time (ATAT)</div>
            <div class="text-xl font-black text-white mt-0.5">${res.avgTAT} ms</div>
            <div class="text-xs text-slate-400 font-mono mt-1">Formula: (${res.processes.map(p => p.tat).join(" + ")}) / ${res.processes.length} = ${res.totalTAT} / ${res.processes.length} = ${res.avgTAT} ms</div>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 4. DEADLOCK & RAG SIMULATOR VIEW
  // ===========================================================================
  renderDeadlockSimulator() {
    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🕸️</span> Resource Allocation Graph (RAG) & Deadlock Visualizer
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Interactive graph builder: Detect cycles, multi-instance deadlocks, generate Wait-For Graphs, and evaluate Coffman conditions.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-semibold whitespace-nowrap">Load Preset:</span>
            <select id="rag-preset-select" onchange="app.loadRAGPreset(this.value)" class="px-3 py-1.5 rounded-xl text-xs bg-slate-800 border border-slate-700 text-slate-200 font-medium">
              ${Object.keys(DeadlockRAGSimulator.presets).map(k => `
                <option value="${k}">${DeadlockRAGSimulator.presets[k].name}</option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Interactive Canvas & Controls -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <span class="text-xs font-bold text-slate-300">RAG Topology Canvas</span>
              <div class="flex items-center gap-2">
                <button onclick="app.analyzeRAGState()" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950">
                  Analyze Deadlock 🔍
                </button>
              </div>
            </div>

            <!-- SVG Graph Container -->
            <div id="rag-canvas-container" class="w-full bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden min-h-[360px] flex items-center justify-center">
              <!-- Rendered via SVG -->
            </div>
          </div>

          <!-- Analysis Panel -->
          <div class="lg:col-span-4 space-y-6">
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>📋</span> Deadlock Analysis Report
              </h3>
              <div id="rag-analysis-output" class="text-xs text-slate-300 space-y-3 leading-relaxed">
                Click 'Analyze Deadlock' or select a preset to view detailed cycle detection.
              </div>
            </div>

            <!-- Coffman 4 Conditions Quick Card -->
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">The 4 Necessary Deadlock Conditions</h4>
              <ul class="text-xs space-y-2 text-slate-400">
                <li class="flex items-center gap-2"><span class="text-sky-400">1.</span> Mutual Exclusion</li>
                <li class="flex items-center gap-2"><span class="text-sky-400">2.</span> Hold and Wait</li>
                <li class="flex items-center gap-2"><span class="text-sky-400">3.</span> No Preemption</li>
                <li class="flex items-center gap-2"><span class="text-sky-400">4.</span> Circular Wait</li>
              </ul>
              <div class="text-[11px] text-amber-300 pt-2 border-t border-slate-800">
                💡 Deadlock can occur if and only if ALL four conditions hold simultaneously!
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;

    this.loadRAGPreset("deadlock-2proc");
  },

  loadRAGPreset(presetKey) {
    const preset = DeadlockRAGSimulator.presets[presetKey];
    if (!preset) return;
    this.currentRAGPreset = preset;
    this.renderRAGGraph(preset.nodes, preset.edges);
    this.analyzeRAGState();
  },

  renderRAGGraph(nodes, edges, cycleHighlight = []) {
    const container = document.getElementById("rag-canvas-container");
    if (!container) return;

    let svg = `
      <svg viewBox="0 0 620 360" class="w-full h-auto select-none font-sans">
        <defs>
          <marker id="rag-arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
          </marker>
          <marker id="rag-arrow-cycle" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
        </defs>
    `;

    // Render Edges
    edges.forEach(e => {
      const fromNode = nodes.find(n => n.id === e.from);
      const toNode = nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;

      const isCycleEdge = cycleHighlight.includes(e.from) && cycleHighlight.includes(e.to);
      const isClaim = e.type === "claim";

      svg += `
        <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}"
          stroke="${isCycleEdge ? '#ef4444' : isClaim ? '#a855f7' : '#38bdf8'}"
          stroke-width="${isCycleEdge ? '3' : '2'}"
          stroke-dasharray="${isClaim ? '4 4' : 'none'}"
          marker-end="url(#rag-arrow${isCycleEdge ? '-cycle' : ''})" />
      `;
    });

    // Render Nodes
    nodes.forEach(n => {
      const inCycle = cycleHighlight.includes(n.id);
      if (n.type === "process") {
        // Circle
        svg += `
          <g transform="translate(${n.x}, ${n.y})">
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke="${inCycle ? '#ef4444' : '#38bdf8'}" stroke-width="${inCycle ? '3' : '2'}" />
            <text x="0" y="5" fill="${inCycle ? '#ef4444' : '#f8fafc'}" font-size="12" font-weight="bold" text-anchor="middle font-mono">${n.id}</text>
          </g>
        `;
      } else {
        // Resource Rectangle with dots for instances
        const dots = [];
        const inst = n.instances || 1;
        for (let d = 0; d < inst; d++) {
          dots.push(d);
        }

        svg += `
          <g transform="translate(${n.x}, ${n.y})">
            <rect x="-28" y="-28" width="56" height="56" rx="8" fill="#1e293b" stroke="${inCycle ? '#ef4444' : '#64748b'}" stroke-width="${inCycle ? '3' : '2'}" />
            <text x="0" y="-34" fill="#94a3b8" font-size="11" font-weight="bold" text-anchor="middle font-mono">${n.id} (${inst})</text>
            <!-- Dots -->
            <g transform="translate(0, 0)">
              ${dots.map((_, i) => {
                const offsetX = inst === 1 ? 0 : (i === 0 ? -8 : (i === 1 ? 8 : 0));
                const offsetY = inst === 3 && i === 2 ? 8 : 0;
                return `<circle cx="${offsetX}" cy="${offsetY}" r="4" fill="#38bdf8" />`;
              }).join("")}
            </g>
          </g>
        `;
      }
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  },

  analyzeRAGState() {
    if (!this.currentRAGPreset) return;
    const res = DeadlockRAGSimulator.analyze(this.currentRAGPreset.nodes, this.currentRAGPreset.edges);
    this.renderRAGGraph(this.currentRAGPreset.nodes, this.currentRAGPreset.edges, res.cycleNodes);

    const outEl = document.getElementById("rag-analysis-output");
    if (!outEl) return;

    outEl.innerHTML = `
      <div class="p-3.5 rounded-xl border ${res.isDeadlocked ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' : (res.hasCycle ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200')}">
        <div class="font-bold flex items-center gap-1.5 mb-1">
          <span>${res.isDeadlocked ? '🚨 DEADLOCK' : (res.hasCycle ? '⚠️ CYCLE (SAFE)' : '✅ SAFE')}</span>
        </div>
        <p class="whitespace-pre-line">${res.explanation}</p>
      </div>

      <div class="space-y-1.5 pt-2">
        <div class="text-slate-400 font-semibold">Graph Properties:</div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Cycle Present:</span>
          <strong class="${res.hasCycle ? 'text-amber-400' : 'text-slate-400'}">${res.hasCycle ? 'YES' : 'NO'}</strong>
        </div>
        <div class="flex justify-between py-1 border-b border-slate-800">
          <span>Cycle Nodes:</span>
          <span class="font-mono">${res.cycleNodes.length > 0 ? res.cycleNodes.join(", ") : 'None'}</span>
        </div>
        <div class="flex justify-between py-1">
          <span>Deadlocked Processes:</span>
          <span class="font-mono text-rose-400 font-bold">${res.deadlockedProcesses.length > 0 ? res.deadlockedProcesses.join(", ") : 'None'}</span>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 5. BANKER'S ALGORITHM SIMULATOR VIEW
  // ===========================================================================
  renderBankerSimulator() {
    const defaultData = BankersAlgorithmSimulator.defaultSnapshot;
    const need = BankersAlgorithmSimulator.calculateNeed(defaultData.max, defaultData.allocation);

    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🏦</span> Banker's Algorithm Simulator
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Deadlock Avoidance for multiple-instance resources (SRM Slide 68-70 snapshot with Safety & Resource-Request checks).
            </p>
          </div>
          <button onclick="app.runBankerSafety()" class="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25">
            Run Safety Algorithm ▶
          </button>
        </div>

        <!-- Matrix Displays -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Allocation Matrix -->
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 class="text-xs font-bold text-sky-400 uppercase tracking-wider">Allocation Matrix</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-mono text-slate-300">
                <thead class="text-slate-500 border-b border-slate-800">
                  <tr><th>Proc</th><th>A</th><th>B</th><th>C</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${defaultData.processes.map((p, i) => `
                    <tr>
                      <td class="py-1.5 font-bold text-slate-100">${p}</td>
                      <td>${defaultData.allocation[i][0]}</td>
                      <td>${defaultData.allocation[i][1]}</td>
                      <td>${defaultData.allocation[i][2]}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Max Matrix -->
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 class="text-xs font-bold text-amber-400 uppercase tracking-wider">Max Matrix</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-mono text-slate-300">
                <thead class="text-slate-500 border-b border-slate-800">
                  <tr><th>Proc</th><th>A</th><th>B</th><th>C</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${defaultData.processes.map((p, i) => `
                    <tr>
                      <td class="py-1.5 font-bold text-slate-100">${p}</td>
                      <td>${defaultData.max[i][0]}</td>
                      <td>${defaultData.max[i][1]}</td>
                      <td>${defaultData.max[i][2]}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Need Matrix (Calculated) -->
          <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Need Matrix</h3>
              <span class="text-[10px] text-slate-400 font-mono">Max - Alloc</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs font-mono text-slate-300">
                <thead class="text-slate-500 border-b border-slate-800">
                  <tr><th>Proc</th><th>A</th><th>B</th><th>C</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-800/60">
                  ${defaultData.processes.map((p, i) => `
                    <tr>
                      <td class="py-1.5 font-bold text-slate-100">${p}</td>
                      <td class="text-emerald-400">${need[i][0]}</td>
                      <td class="text-emerald-400">${need[i][1]}</td>
                      <td class="text-emerald-400">${need[i][2]}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Available Vector & Resource Request Testing -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-white">Current Available Vector</h3>
            <div class="flex items-center gap-4 text-center">
              <div class="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400 font-bold">Resource A</div>
                <div class="text-xl font-black text-sky-400 mt-1">${defaultData.available[0]}</div>
              </div>
              <div class="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400 font-bold">Resource B</div>
                <div class="text-xl font-black text-sky-400 mt-1">${defaultData.available[1]}</div>
              </div>
              <div class="flex-1 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400 font-bold">Resource C</div>
                <div class="text-xl font-black text-sky-400 mt-1">${defaultData.available[2]}</div>
              </div>
            </div>
            <div class="text-xs text-slate-400 font-mono">Total System Instances: A=10, B=5, C=7</div>
          </div>

          <!-- Resource Request Test Box -->
          <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>🎯</span> Test Process Resource Request
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Process</label>
                <select id="req-process-select" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono">
                  ${defaultData.processes.map((p, i) => `<option value="${i}" ${i === 1 ? 'selected' : ''}>${p}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Request A</label>
                <input type="number" id="req-a" value="1" min="0" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Request B</label>
                <input type="number" id="req-b" value="0" min="0" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-400 mb-1">Request C</label>
                <input type="number" id="req-c" value="2" min="0" class="w-full px-3 py-2 rounded-xl text-xs bg-slate-900 border border-slate-700 text-white font-mono" />
              </div>
            </div>
            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-slate-400">SRM Slide 70 Test: P1 requests (1, 0, 2)</span>
              <button onclick="app.testBankerRequest()" class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md">
                Test Request Validity →
              </button>
            </div>
          </div>
        </div>

        <!-- Banker Output Log & Safe Sequence -->
        <div id="banker-results-output" class="space-y-4">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;

    this.runBankerSafety();
  },

  runBankerSafety() {
    const d = BankersAlgorithmSimulator.defaultSnapshot;
    const res = BankersAlgorithmSimulator.runSafetyAlgorithm(d.allocation, d.max, d.available);

    const out = document.getElementById("banker-results-output");
    if (!out) return;

    out.innerHTML = `
      <div class="glass-panel p-6 rounded-2xl border ${res.isSafe ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-rose-500/30 bg-rose-950/10'} space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div class="text-xs font-bold ${res.isSafe ? 'text-emerald-400' : 'text-rose-400'} uppercase tracking-wider">
              ${res.isSafe ? '✅ SYSTEM IS IN A SAFE STATE' : '🚨 UNSAFE STATE DETECTED'}
            </div>
            <div class="text-xl font-black text-white mt-0.5">
              ${res.isSafe ? `Safe Sequence: < ${res.safeSequence.join(", ")} >` : 'No Safe Sequence Exists!'}
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 font-mono">
            Final Work Vector: [${res.finalWork.join(", ")}]
          </span>
        </div>

        <!-- Step-by-Step Evolution Trace -->
        <div class="space-y-2 pt-2">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Execution Step-by-Step Trace</div>
          <div class="space-y-2 font-mono text-xs">
            ${res.steps.map(s => `
              <div class="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="text-slate-200">${s.description}</span>
                <span class="text-emerald-400 whitespace-nowrap">Work: [${s.work.join(", ")}]</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  },

  testBankerRequest() {
    const d = BankersAlgorithmSimulator.defaultSnapshot;
    const pIdx = parseInt(document.getElementById("req-process-select").value, 10);
    const reqA = parseInt(document.getElementById("req-a").value, 10) || 0;
    const reqB = parseInt(document.getElementById("req-b").value, 10) || 0;
    const reqC = parseInt(document.getElementById("req-c").value, 10) || 0;
    const reqVector = [reqA, reqB, reqC];

    const res = BankersAlgorithmSimulator.testRequest(pIdx, reqVector, d.allocation, d.max, d.available);

    const out = document.getElementById("banker-results-output");
    if (!out) return;

    out.innerHTML = `
      <div class="glass-panel p-6 rounded-2xl border ${res.granted ? 'border-emerald-500/30 bg-emerald-950/15' : 'border-rose-500/30 bg-rose-950/15'} space-y-4 animate-fadeIn">
        <div class="text-lg font-black ${res.granted ? 'text-emerald-400' : 'text-rose-400'}">
          ${res.granted ? 'Request Granted!' : 'Request Denied!'}
        </div>
        <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${res.granted ? res.message : res.error}</p>
        ${res.safetyResult && res.safetyResult.safeSequence.length > 0 ? `
          <div class="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-sky-300">
            Post-Allocation Safe Sequence: &lt; ${res.safetyResult.safeSequence.join(", ")} &gt;
          </div>
        ` : ''}
      </div>
    `;
  },

  // ===========================================================================
  // 6. SYNCHRONIZATION LAB VIEW
  // ===========================================================================
  renderSyncSimulator() {
    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>🔀</span> Synchronization Lab
          </h1>
          <p class="text-xs sm:text-sm text-slate-400">
            Interactive visual simulations for Mutex Locks, Semaphores, Peterson's Solution, Bounded Buffer, Readers-Writers, and Dining Philosophers.
          </p>
        </div>

        <!-- Sync Problem Selector Tabs -->
        <div class="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
          ${[
            { id: "mutex", label: "Mutex / Spinlock" },
            { id: "semaphore", label: "Counting Semaphore" },
            { id: "peterson", label: "Peterson's 2-Process" },
            { id: "bounded-buffer", label: "Bounded Buffer (Producer/Consumer)" },
            { id: "readers-writers", label: "Readers-Writers" },
            { id: "dining", label: "Dining Philosophers" }
          ].map((tab, idx) => `
            <button onclick="app.setSyncProblem('${tab.id}')" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${this.activeSyncProblem === tab.id || (!this.activeSyncProblem && idx === 0) ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}">
              ${tab.label}
            </button>
          `).join("")}
        </div>

        <!-- Sync Sandbox Canvas -->
        <div id="sync-sandbox-container">
          <!-- Injected dynamically -->
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;

    this.setSyncProblem(this.activeSyncProblem || "mutex");
  },

  setSyncProblem(problemId) {
    this.activeSyncProblem = problemId;
    const container = document.getElementById("sync-sandbox-container");
    if (!container) return;

    if (problemId === "mutex") {
      this.renderMutexSim(container);
    } else if (problemId === "semaphore") {
      this.renderSemaphoreSim(container);
    } else if (problemId === "peterson") {
      this.renderPetersonSim(container);
    } else if (problemId === "bounded-buffer") {
      this.renderBoundedBufferSim(container);
    } else if (problemId === "readers-writers") {
      this.renderReadersWritersSim(container);
    } else if (problemId === "dining") {
      this.renderDiningSim(container);
    }
  },

  renderMutexSim(container) {
    const s = SyncSimulators.mutexState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${s.available ? '🔓' : '🔒'}</span>
              <div>
                <h3 class="text-sm font-bold text-white">Mutex Lock State: <span class="${s.available ? 'text-emerald-400' : 'text-rose-400'}">${s.available ? 'AVAILABLE (True)' : 'LOCKED (False)'}</span></h3>
                <div class="text-xs text-slate-400">Current Owner: <span class="font-mono text-sky-400 font-bold">${s.owner || 'None'}</span></div>
              </div>
            </div>
            <button onclick="SyncSimulators.resetMutex(); app.setSyncProblem('mutex');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white">Reset</button>
          </div>

          <!-- Thread Controls -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Thread 0 -->
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-sky-400">Thread 0</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded ${s.threads.T0.state === 'CRITICAL_SECTION' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : (s.threads.T0.state === 'SPINNING' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400')}">
                  ${s.threads.T0.state}
                </span>
              </div>
              <div class="text-xs text-slate-400 font-mono">Spin Count: ${s.threads.T0.spins}</div>
              <div class="flex gap-2">
                <button onclick="SyncSimulators.mutexAction('T0', 'request'); app.setSyncProblem('mutex');" class="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400">acquire()</button>
                <button onclick="SyncSimulators.mutexAction('T0', 'release'); app.setSyncProblem('mutex');" class="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700">release()</button>
              </div>
            </div>

            <!-- Thread 1 -->
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-bold text-sm text-purple-400">Thread 1</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded ${s.threads.T1.state === 'CRITICAL_SECTION' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : (s.threads.T1.state === 'SPINNING' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400')}">
                  ${s.threads.T1.state}
                </span>
              </div>
              <div class="text-xs text-slate-400 font-mono">Spin Count: ${s.threads.T1.spins}</div>
              <div class="flex gap-2">
                <button onclick="SyncSimulators.mutexAction('T1', 'request'); app.setSyncProblem('mutex');" class="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500 text-white hover:bg-purple-400">acquire()</button>
                <button onclick="SyncSimulators.mutexAction('T1', 'release'); app.setSyncProblem('mutex');" class="flex-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700">release()</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Log Panel -->
        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Execution Audit Log</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderSemaphoreSim(container) {
    const s = SyncSimulators.semaphoreState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-white">Semaphore Counter: <span class="${s.value > 0 ? 'text-emerald-400' : (s.value === 0 ? 'text-amber-400' : 'text-rose-400')} font-mono text-xl">${s.value}</span></h3>
              <p class="text-xs text-slate-400 font-mono mt-0.5">Negative magnitude = number of blocked processes</p>
            </div>
            <button onclick="SyncSimulators.resetSemaphore(2); app.setSyncProblem('semaphore');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300">Reset S=2</button>
          </div>

          <!-- Active & Waiting Queues Visualizer -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Active Execution -->
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-emerald-400">Active In Critical Section (${s.activeProcesses.length})</span>
              <div class="min-h-16 flex flex-wrap gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                ${s.activeProcesses.length > 0 ? s.activeProcesses.map(p => `
                  <span class="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1">
                    <span>⚡</span> ${p}
                  </span>
                `).join("") : '<span class="text-xs text-slate-600 italic">No processes active</span>'}
              </div>
            </div>

            <!-- Blocked Queue -->
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-rose-400">Blocked in Waiting Queue (${s.waitingQueue.length})</span>
              <div class="min-h-16 flex flex-wrap gap-2 p-2 rounded bg-slate-950 border border-slate-800">
                ${s.waitingQueue.length > 0 ? s.waitingQueue.map(p => `
                  <span class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold flex items-center gap-1">
                    <span>🛑</span> ${p}
                  </span>
                `).join("") : '<span class="text-xs text-slate-600 italic">Queue is empty</span>'}
              </div>
            </div>
          </div>

          <!-- Dispatch Controls -->
          <div class="flex flex-wrap gap-2 pt-2">
            ${["P1", "P2", "P3", "P4"].map(pid => `
              <div class="flex gap-1 border border-slate-800 rounded-xl p-1 bg-slate-900">
                <span class="px-2 py-1 text-xs font-mono font-bold text-slate-300">${pid}</span>
                <button onclick="SyncSimulators.semaphoreWait('${pid}'); app.setSyncProblem('semaphore');" class="px-2.5 py-1 rounded-lg text-xs bg-sky-500 text-slate-950 font-bold hover:bg-sky-400">wait()</button>
                <button onclick="SyncSimulators.semaphoreSignal('${pid}'); app.setSyncProblem('semaphore');" class="px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 font-bold hover:bg-slate-700">signal()</button>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Semaphore Audit Log</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderPetersonSim(container) {
    const s = SyncSimulators.petersonState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>🤝</span> Peterson's 2-Process Synchronization
            </h3>
            <button onclick="SyncSimulators.resetPeterson(); app.setSyncProblem('peterson');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300">Reset</button>
          </div>

          <!-- Shared Variables Board -->
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-around text-center">
            <div>
              <div class="text-xs text-slate-400 font-bold">flag[0] (P0 ready?)</div>
              <div class="text-lg font-mono font-black ${s.flag[0] ? 'text-emerald-400' : 'text-slate-500'}">${s.flag[0] ? 'TRUE' : 'FALSE'}</div>
            </div>
            <div class="h-8 w-px bg-slate-800"></div>
            <div>
              <div class="text-xs text-slate-400 font-bold">turn</div>
              <div class="text-lg font-mono font-black text-amber-400">P${s.turn}</div>
            </div>
            <div class="h-8 w-px bg-slate-800"></div>
            <div>
              <div class="text-xs text-slate-400 font-bold">flag[1] (P1 ready?)</div>
              <div class="text-lg font-mono font-black ${s.flag[1] ? 'text-emerald-400' : 'text-slate-500'}">${s.flag[1] ? 'TRUE' : 'FALSE'}</div>
            </div>
          </div>

          <!-- Step Buttons for Process 0 and 1 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-bold text-sm text-sky-400">Process P0</span>
                <span class="text-xs font-mono text-slate-400">Step ${s.p0Step}/3</span>
              </div>
              <button onclick="SyncSimulators.stepPeterson(0); app.setSyncProblem('peterson');" class="w-full py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400">
                Execute P0 Step ▶
              </button>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-bold text-sm text-purple-400">Process P1</span>
                <span class="text-xs font-mono text-slate-400">Step ${s.p1Step}/3</span>
              </div>
              <button onclick="SyncSimulators.stepPeterson(1); app.setSyncProblem('peterson');" class="w-full py-2 rounded-xl text-xs font-bold bg-purple-500 text-white hover:bg-purple-400">
                Execute P1 Step ▶
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithm Step Log</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderBoundedBufferSim(container) {
    const s = SyncSimulators.boundedBufferState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>📦</span> Bounded Buffer Simulation (Size = ${s.capacity})
            </h3>
            <button onclick="SyncSimulators.resetBoundedBuffer(5); app.setSyncProblem('bounded-buffer');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300">Reset</button>
          </div>

          <!-- Semaphores Status -->
          <div class="flex items-center justify-around p-3 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono text-xs">
            <div><span class="text-slate-400">empty:</span> <strong class="text-sky-400">${s.emptySem}</strong></div>
            <div><span class="text-slate-400">full:</span> <strong class="text-emerald-400">${s.fullSem}</strong></div>
            <div><span class="text-slate-400">mutex:</span> <strong class="text-amber-400">${s.mutexSem}</strong></div>
            <div><span class="text-slate-400">in:</span> ${s.in} | <span class="text-slate-400">out:</span> ${s.out}</div>
          </div>

          <!-- Buffer Slots Visual -->
          <div class="flex gap-2 justify-center py-4">
            ${s.buffer.map((item, idx) => `
              <div class="w-16 h-20 rounded-xl border flex flex-col items-center justify-center font-mono ${item !== null ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-600'}">
                <span class="text-[10px] text-slate-500">Slot ${idx}</span>
                <span class="text-sm font-bold mt-1">${item !== null ? `#${item}` : 'EMPTY'}</span>
                ${idx === s.in ? '<span class="text-[9px] text-sky-400 font-bold">in ↑</span>' : ''}
                ${idx === s.out ? '<span class="text-[9px] text-amber-400 font-bold">out ↓</span>' : ''}
              </div>
            `).join("")}
          </div>

          <div class="flex gap-3">
            <button onclick="SyncSimulators.produceItem(); app.setSyncProblem('bounded-buffer');" class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950">
              Produce Item 📦
            </button>
            <button onclick="SyncSimulators.consumeItem(); app.setSyncProblem('bounded-buffer');" class="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950">
              Consume Item 🍽️
            </button>
          </div>
        </div>

        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Buffer Trace</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderReadersWritersSim(container) {
    const s = SyncSimulators.rwState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <span>📖</span> Readers-Writers Synchronization
            </h3>
            <button onclick="SyncSimulators.resetReadersWriters(); app.setSyncProblem('readers-writers');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 text-slate-300">Reset</button>
          </div>

          <!-- Active State -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-sky-400">Active Readers (${s.readCount})</span>
              <div class="min-h-16 flex flex-wrap gap-1.5 p-2 rounded bg-slate-950 border border-slate-800">
                ${s.activeReaders.length > 0 ? s.activeReaders.map(r => `
                  <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-xs">Reader ${r}</span>
                `).join("") : '<span class="text-xs text-slate-600 italic">No active readers</span>'}
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span class="text-xs font-bold text-rose-400">Active Writer</span>
              <div class="min-h-16 flex items-center justify-center p-2 rounded bg-slate-950 border border-slate-800">
                ${s.activeWriter ? `
                  <span class="px-3 py-1 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">✍️ Writer ${s.activeWriter} (Exclusive Access)</span>
                ` : '<span class="text-xs text-slate-600 italic">No active writer</span>'}
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex flex-wrap gap-2">
            <button onclick="SyncSimulators.startReader(Math.floor(Math.random()*90)+10); app.setSyncProblem('readers-writers');" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 text-slate-950">
              + Reader Enter
            </button>
            <button onclick="if(SyncSimulators.rwState.activeReaders.length>0) SyncSimulators.stopReader(SyncSimulators.rwState.activeReaders[0]); app.setSyncProblem('readers-writers');" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300">
              - Reader Exit
            </button>
            <button onclick="SyncSimulators.startWriter(1); app.setSyncProblem('readers-writers');" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white">
              Writer Enter
            </button>
            <button onclick="SyncSimulators.stopWriter(1); app.setSyncProblem('readers-writers');" class="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300">
              Writer Exit
            </button>
          </div>
        </div>

        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Sync Log</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  renderDiningSim(container) {
    const s = SyncSimulators.diningState;
    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-white flex items-center gap-2">
                <span>🍜</span> Dining Philosophers Round Table
              </h3>
              <p class="text-xs text-slate-400">Click a philosopher to toggle Thinking/Eating, or test deadlock.</p>
            </div>
            <div class="flex gap-2">
              <button onclick="SyncSimulators.resetDining('asymmetric'); app.setSyncProblem('dining');" class="px-3 py-1.5 rounded-lg text-xs bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Asymmetric Mode</button>
              <button onclick="SyncSimulators.triggerDiningDeadlock(); app.setSyncProblem('dining');" class="px-3 py-1.5 rounded-lg text-xs bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">Trigger Deadlock 💀</button>
            </div>
          </div>

          <!-- Round Table Visualizer -->
          <div class="flex justify-center py-6">
            <div class="relative w-72 h-72 rounded-full border-2 border-slate-700 bg-slate-950 flex items-center justify-center">
              <div class="w-24 h-24 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300">
                Rice Bowl
              </div>

              <!-- 5 Philosophers positioned around table -->
              ${[0, 1, 2, 3, 4].map(i => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const x = 144 + 115 * Math.cos(angle) - 22;
                const y = 144 + 115 * Math.sin(angle) - 22;
                const state = s.philosophers[i];
                return `
                  <button onclick="SyncSimulators.togglePhilosopher(${i}); app.setSyncProblem('dining');" class="absolute w-11 h-11 rounded-full flex flex-col items-center justify-center font-bold text-[10px] transition-all transform hover:scale-110 shadow-lg ${state === 'EATING' ? 'bg-emerald-500 text-slate-950' : (state === 'HUNGRY' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700')}" style="left: ${x}px; top: ${y}px;">
                    <span>P${i}</span>
                    <span class="text-[8px] opacity-80">${state === 'EATING' ? '🍜' : (state === 'HUNGRY' ? '🍽️' : '💭')}</span>
                  </button>
                `;
              }).join("")}
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Philosophers Log</h4>
          <div class="space-y-1.5 max-h-64 overflow-y-auto text-xs font-mono text-slate-300">
            ${s.logs.slice(-8).map(l => `<div class="p-2 rounded bg-slate-900/60 border border-slate-800">${l}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 7. MEMORY PALACE VIEW
  // ===========================================================================
  renderMemoryPalace() {
    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>🏰</span> Memory Palace Mode
          </h1>
          <p class="text-xs sm:text-sm text-slate-400">
            Anchor complex Operating System concepts into unforgettable mental stories and metaphors.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${MEMORY_PALACE_DATA.map(story => `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-purple-400 uppercase tracking-wider">${story.concept}</span>
                  <span class="text-xs text-slate-400 font-mono">Unit ${story.unit}</span>
                </div>
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <span>🏛️</span> ${story.palaceLocation}
                </h3>
                <div class="text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                  Metaphor: ${story.character}
                </div>
                <div class="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  ${story.story}
                </div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-sky-300 font-medium">
                <strong>💡 Core Takeaway:</strong> ${story.takeaway}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  // ===========================================================================
  // 8. CODING SECTION VIEW
  // ===========================================================================
  renderCodingSection() {
    const codeExamples = [
      {
        id: "c-fork-exec",
        title: "UNIX Process Creation: fork(), exec(), wait()",
        lang: "c",
        desc: "Complete implementation of child process creation in C with error handling and parent wait reaping."
      },
      {
        id: "posix-shm",
        title: "POSIX Shared Memory: Producer & Consumer",
        lang: "c",
        desc: "Creating shared memory objects via shm_open(), ftruncate(), mmap(), and shm_unlink()."
      },
      {
        id: "java-sockets",
        title: "Client-Server Socket Communication in Java",
        lang: "java",
        desc: "DateServer socket implementation using ServerSocket, Socket, and PrintWriter."
      },
      {
        id: "pthreads-c",
        title: "POSIX Pthreads: Worker Thread & 10-Thread Join",
        lang: "c",
        desc: "Thread creation via pthread_create(), pthread_join(), and pthread_exit()."
      },
      {
        id: "openmp-loops",
        title: "Implicit Threading with OpenMP",
        lang: "c",
        desc: "Compiler directives #pragma omp parallel and #pragma omp parallel for loop vectorization."
      },
      {
        id: "petersons-c",
        title: "Peterson's 2-Process Synchronization Algorithm",
        lang: "c",
        desc: "Atomic shared turn and flag array mutual exclusion algorithm in C."
      }
    ];

    const activeItem = codeExamples.find(c => c.id === this.codingTopicId) || codeExamples[0];
    this.codingTopicId = activeItem.id;

    // Find snippet from unit data
    let snippet = "";
    let explanation = "";
    if (activeItem.id === "c-fork-exec") {
      snippet = UNIT2_DATA.find(t => t.id === "process-creation")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "process-creation")?.code?.explanation || "";
    } else if (activeItem.id === "posix-shm") {
      snippet = UNIT2_DATA.find(t => t.id === "posix-shared-memory")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "posix-shared-memory")?.code?.explanation || "";
    } else if (activeItem.id === "java-sockets") {
      snippet = UNIT2_DATA.find(t => t.id === "sockets")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "sockets")?.code?.explanation || "";
    } else if (activeItem.id === "pthreads-c") {
      snippet = UNIT2_DATA.find(t => t.id === "thread-libraries")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "thread-libraries")?.code?.explanation || "";
    } else if (activeItem.id === "openmp-loops") {
      snippet = UNIT2_DATA.find(t => t.id === "implicit-threading")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "implicit-threading")?.code?.explanation || "";
    } else if (activeItem.id === "petersons-c") {
      snippet = UNIT2_DATA.find(t => t.id === "petersons-solution")?.code?.snippet || "";
      explanation = UNIT2_DATA.find(t => t.id === "petersons-solution")?.code?.explanation || "";
    }

    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <span>💻</span> Production Code Sandbox (C & Java)
          </h1>
          <p class="text-xs sm:text-sm text-slate-400">
            Executable system calls, threading APIs, and synchronization algorithms with line-by-line breakdowns.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Left Nav -->
          <div class="lg:col-span-4 glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">Implementations</span>
            ${codeExamples.map(ex => `
              <div onclick="app.setCodingTopic('${ex.id}')" class="p-3 rounded-xl cursor-pointer text-xs transition-all ${ex.id === activeItem.id ? 'bg-sky-500/15 text-sky-300 border border-sky-500/40 font-bold' : 'hover:bg-slate-800 text-slate-300 border border-transparent'}">
                <div class="font-bold">${ex.title}</div>
                <div class="text-[11px] text-slate-400 mt-1 line-clamp-1">${ex.desc}</div>
              </div>
            `).join("")}
          </div>

          <!-- Right Code Editor -->
          <div class="lg:col-span-8 glass-panel rounded-2xl border border-slate-800 overflow-hidden space-y-0">
            <div class="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white">${activeItem.title}</h3>
                <span class="text-xs text-slate-400">${activeItem.desc}</span>
              </div>
              <button onclick="navigator.clipboard.writeText(\`${snippet.replace(/`/g, "\\`")}\`); alert('Code copied!');" class="px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300">
                Copy Code
              </button>
            </div>
            <pre class="p-6 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 bg-slate-950 leading-relaxed"><code>${this.escapeHtml(snippet)}</code></pre>
            <div class="p-5 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong class="text-sky-400">Line-by-Line Breakdown:</strong> ${explanation}
            </div>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  setCodingTopic(id) {
    this.codingTopicId = id;
    this.renderCodingSection();
  },

  // ===========================================================================
  // 9. INTERVIEW PREPARATION VIEW (100 Easy, 100 Med, 100 Hard)
  // ===========================================================================
  renderInterviewPrep() {
    let questions = [];
    if (this.interviewDifficulty === "easy" || this.interviewDifficulty === "all") {
      questions = questions.concat(INTERVIEW_DATA.easy);
    }
    if (this.interviewDifficulty === "medium" || this.interviewDifficulty === "all") {
      questions = questions.concat(INTERVIEW_DATA.medium);
    }
    if (this.interviewDifficulty === "hard" || this.interviewDifficulty === "all") {
      questions = questions.concat(INTERVIEW_DATA.hard);
    }

    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>💼</span> FAANG & Systems Interview Preparation
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              300 Curated Questions (100 Easy, 100 Medium, 100 Hard) with Answers, Explanations, and Follow-ups.
            </p>
          </div>

          <div class="flex items-center gap-2">
            ${["all", "easy", "medium", "hard"].map(diff => `
              <button onclick="app.setInterviewDifficulty('${diff}')" class="px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${this.interviewDifficulty === diff ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                ${diff}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Question List -->
        <div class="space-y-4">
          ${questions.slice(0, 30).map((q, idx) => `
            <div class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-500">Q#${idx + 1} (${q.topic})</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : (q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400')}">
                  ${q.difficulty}
                </span>
              </div>
              <h3 class="text-base font-bold text-white">${q.question}</h3>
              <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <strong class="text-emerald-400">Answer:</strong> ${q.answer}
              </div>
              <div class="text-xs text-slate-400 leading-relaxed">
                <strong class="text-slate-300">Technical Rationale:</strong> ${q.explanation}
              </div>
              <div class="pt-2 border-t border-slate-800/80 text-xs text-purple-300 font-semibold flex items-center gap-1.5">
                <span>🎯 Interviewer Follow-up:</span> <em>${q.followUp}</em>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  setInterviewDifficulty(diff) {
    this.interviewDifficulty = diff;
    this.renderInterviewPrep();
  },

  // ===========================================================================
  // 10. EXAM MASTER MODE VIEW (2, 5, 10, 16 MARKS)
  // ===========================================================================
  renderExamMaster() {
    let questions = [];
    if (this.examFilterMarks === "all" || this.examFilterMarks === "2") questions.push(...EXAM_DATA.marks2.map(q => ({ ...q, marks: 2 })));
    if (this.examFilterMarks === "all" || this.examFilterMarks === "5") questions.push(...EXAM_DATA.marks5.map(q => ({ ...q, marks: 5 })));
    if (this.examFilterMarks === "all" || this.examFilterMarks === "10") questions.push(...EXAM_DATA.marks10.map(q => ({ ...q, marks: 10 })));
    if (this.examFilterMarks === "all" || this.examFilterMarks === "16") questions.push(...EXAM_DATA.marks16.map(q => ({ ...q, marks: 16 })));

    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🎯</span> Exam Master Mode (SRM University Pattern)
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Categorized 2, 5, 10, 13, and 16 Marks Questions with Complete Model Answers & Marking Rubrics.
            </p>
          </div>

          <!-- Marks Filter -->
          <div class="flex items-center gap-1.5">
            ${["all", "2", "5", "10", "16"].map(m => `
              <button onclick="app.setExamFilter('${m}')" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${this.examFilterMarks === m ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'}">
                ${m === 'all' ? 'All Marks' : `${m} Marks`}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Questions Accordion / List -->
        <div class="space-y-6">
          ${questions.map((q, idx) => `
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-500">Q#${idx + 1} (${q.topic} - Unit ${q.unit})</span>
                <span class="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  ${q.marks} Marks
                </span>
              </div>
              <h3 class="text-lg font-bold text-white leading-snug">${q.question}</h3>

              <!-- Model Answer Box -->
              <div class="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2">
                <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Official University Model Answer</div>
                <div class="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">${q.modelAnswer}</div>
              </div>

              <!-- Rubric & AI Grading Button -->
              <div class="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="text-xs text-slate-400">
                  <strong class="text-slate-300">Marking Rubric:</strong> ${q.rubric}
                </div>
                <button onclick="app.openAiGradingModal('${q.id}', ${q.marks})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 whitespace-nowrap">
                  <span>🤖</span> Test My Answer with AI Grader
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  setExamFilter(m) {
    this.examFilterMarks = m;
    this.renderExamMaster();
  },

  // ===========================================================================
  // 11. FLASHCARDS VIEW
  // ===========================================================================
  renderFlashcards() {
    const cards = FLASHCARDS_DATA;
    if (this.flashcardIndex >= cards.length) this.flashcardIndex = 0;
    const card = cards[this.flashcardIndex];

    const html = `
      <div class="max-w-xl mx-auto space-y-6 animate-fadeIn">
        <div class="text-center space-y-2">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <span>⚡</span> Spaced Repetition Flashcards
          </h1>
          <p class="text-xs sm:text-sm text-slate-400">Card ${this.flashcardIndex + 1} of ${cards.length} | Master key terms effortlessly.</p>
        </div>

        <!-- 3D Flip Card Container -->
        <div class="perspective-1000 w-full min-h-[260px] cursor-pointer" onclick="app.flipFlashcard()">
          <div class="relative w-full h-full min-h-[260px] rounded-2xl glass-panel border border-slate-700 p-8 flex flex-col justify-between transition-transform duration-500 transform-style-preserve-3d ${this.flashcardFlipped ? 'rotate-y-180 bg-slate-900 border-sky-500/40' : 'bg-slate-900/90'}">
            <!-- Front -->
            <div class="${this.flashcardFlipped ? 'hidden' : 'space-y-4'}">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-bold text-sky-400">${card.topic} (Unit ${card.unit})</span>
                <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold uppercase">${card.difficulty}</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-white pt-4 leading-relaxed">${card.front}</h3>
              <div class="text-xs text-slate-500 pt-8">Click card to reveal answer 🔄</div>
            </div>

            <!-- Back -->
            <div class="${this.flashcardFlipped ? 'space-y-4 rotate-y-180' : 'hidden'}">
              <div class="flex items-center justify-between text-xs text-slate-400">
                <span class="font-bold text-emerald-400">Core Answer</span>
                <span class="text-xs text-slate-400 font-mono">Unit ${card.unit}</span>
              </div>
              <p class="text-sm sm:text-base text-slate-100 whitespace-pre-line leading-relaxed">${card.back}</p>
              <div class="text-xs text-slate-500 pt-4">Click to flip back 🔄</div>
            </div>
          </div>
        </div>

        <!-- Navigation & Mastery Buttons -->
        <div class="flex items-center justify-between gap-3 pt-2">
          <button onclick="app.prevFlashcard()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300">
            ← Previous
          </button>
          <div class="flex gap-2">
            <button onclick="app.rateFlashcard('Hard')" class="px-3 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Hard</button>
            <button onclick="app.rateFlashcard('Good')" class="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Good</button>
            <button onclick="app.rateFlashcard('Easy')" class="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Easy</button>
          </div>
          <button onclick="app.nextFlashcard()" class="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950">
            Next →
          </button>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  flipFlashcard() {
    this.flashcardFlipped = !this.flashcardFlipped;
    this.renderFlashcards();
  },

  nextFlashcard() {
    this.flashcardIndex = (this.flashcardIndex + 1) % FLASHCARDS_DATA.length;
    this.flashcardFlipped = false;
    this.renderFlashcards();
  },

  prevFlashcard() {
    this.flashcardIndex = (this.flashcardIndex - 1 + FLASHCARDS_DATA.length) % FLASHCARDS_DATA.length;
    this.flashcardFlipped = false;
    this.renderFlashcards();
  },

  rateFlashcard(rating) {
    const card = FLASHCARDS_DATA[this.flashcardIndex];
    this.userData.flashcardMastery[card.id] = rating;
    this.saveUserData();
    this.nextFlashcard();
  },

  // ===========================================================================
  // 12. ADAPTIVE QUIZ ENGINE VIEW
  // ===========================================================================
  renderQuizEngine() {
    const qList = QUIZ_DATA;
    if (this.quizIndex >= qList.length) {
      // Quiz complete screen
      const html = `
        <div class="max-w-lg mx-auto glass-panel p-8 rounded-2xl border border-slate-800 text-center space-y-6 animate-fadeIn">
          <div class="text-5xl">🏆</div>
          <h2 class="text-2xl font-black text-white">Quiz Completed!</h2>
          <p class="text-slate-300 text-sm">You scored <strong>${this.quizScore}</strong> out of ${qList.length} questions correctly.</p>
          <button onclick="app.resetQuiz()" class="px-6 py-2.5 rounded-xl font-bold bg-sky-500 text-slate-950 hover:bg-sky-400">
            Retake Quiz 🔄
          </button>
        </div>
      `;
      const el = document.getElementById("main-content-area");
      if (el) el.innerHTML = html;
      return;
    }

    const q = qList[this.quizIndex];

    const html = `
      <div class="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        <div class="flex items-center justify-between text-xs text-slate-400">
          <span>Question ${this.quizIndex + 1} of ${qList.length}</span>
          <span class="font-bold text-sky-400">Score: ${this.quizScore}</span>
        </div>

        <div class="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-purple-400">${q.topic} (Unit ${q.unit})</span>
            <span class="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-bold text-slate-400">${q.difficulty}</span>
          </div>

          <h3 class="text-lg sm:text-xl font-bold text-white leading-relaxed">${q.question}</h3>

          <!-- MCQ / AR Options -->
          ${q.options ? `
            <div class="space-y-2.5">
              ${q.options.map((opt, i) => `
                <button onclick="app.answerQuizMCQ(${i})" class="quiz-opt-btn w-full p-3.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all flex items-center gap-3 bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-slate-200" data-index="${i}">
                  <span class="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">${String.fromCharCode(65 + i)}</span>
                  <span>${opt}</span>
                </button>
              `).join("")}
            </div>
          ` : ''}

          <!-- FITB / Numerical input -->
          ${q.type === 'fitb' || q.type === 'numerical' ? `
            <div class="space-y-3">
              <input type="text" id="quiz-text-input" placeholder="Type your answer here..." class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm" />
              <button onclick="app.answerQuizInput()" class="w-full py-2.5 rounded-xl font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 text-xs">
                Submit Answer
              </button>
            </div>
          ` : ''}

          <!-- Explanation Box -->
          <div id="quiz-feedback-box" class="hidden p-4 rounded-xl text-xs space-y-2"></div>

          <!-- Next Button -->
          <div id="quiz-next-wrap" class="hidden flex justify-end pt-2">
            <button onclick="app.nextQuizQuestion()" class="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950">
              Next Question →
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
    this.quizAnswered = false;
  },

  answerQuizMCQ(chosenIndex) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;
    const q = QUIZ_DATA[this.quizIndex];
    const isCorrect = chosenIndex === q.correctIndex;

    if (isCorrect) this.quizScore++;

    const buttons = document.querySelectorAll(".quiz-opt-btn");
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add("bg-emerald-950/40", "border-emerald-500", "text-emerald-300");
      } else if (idx === chosenIndex) {
        btn.classList.add("bg-rose-950/40", "border-rose-500", "text-rose-300");
      }
    });

    this.showQuizFeedback(isCorrect, q.explanation);
  },

  answerQuizInput() {
    if (this.quizAnswered) return;
    this.quizAnswered = true;
    const q = QUIZ_DATA[this.quizIndex];
    const userVal = document.getElementById("quiz-text-input").value.trim().toLowerCase();

    let isCorrect = false;
    if (q.type === "fitb") {
      isCorrect = q.acceptedAnswers.some(ans => userVal === ans.toLowerCase());
    } else if (q.type === "numerical") {
      const num = parseFloat(userVal);
      isCorrect = Math.abs(num - q.correctAnswer) <= (q.tolerance || 0.1);
    }

    if (isCorrect) this.quizScore++;
    this.showQuizFeedback(isCorrect, q.explanation);
  },

  showQuizFeedback(isCorrect, explanation) {
    const box = document.getElementById("quiz-feedback-box");
    const nextWrap = document.getElementById("quiz-next-wrap");
    if (!box || !nextWrap) return;

    box.className = `p-4 rounded-xl text-xs space-y-1.5 ${isCorrect ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-200' : 'bg-rose-950/20 border border-rose-500/30 text-rose-200'}`;
    box.innerHTML = `
      <div class="font-bold">${isCorrect ? '✅ Correct Answer!' : '❌ Incorrect'}</div>
      <div>${explanation}</div>
    `;
    box.classList.remove("hidden");
    nextWrap.classList.remove("hidden");
  },

  nextQuizQuestion() {
    this.quizIndex++;
    this.renderQuizEngine();
  },

  resetQuiz() {
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    this.renderQuizEngine();
  },

  // ===========================================================================
  // 13. GEMINI AI TUTOR VIEW & MODALS
  // ===========================================================================
  renderAiTutor() {
    const hasKey = GeminiAIEngine.hasApiKey();
    const html = `
      <div class="space-y-8 animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <span>🤖</span> Gemini AI Operating Systems Mentor
            </h1>
            <p class="text-xs sm:text-sm text-slate-400">
              Powered by Google AI Studio API. Ask doubts, grade university answers, and run mock FAANG interviews.
            </p>
          </div>
          <button onclick="app.openAiKeyModal()" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600">
            🔑 ${hasKey ? 'Manage Gemini Key' : 'Connect AI Studio Key'}
          </button>
        </div>

        ${!hasKey ? `
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">💡</span>
              <div class="text-xs text-amber-200">
                <strong>Google AI Studio API Key Recommended:</strong> Connect your Gemini API key to unlock real-time academic explanations, subjective answer grading against SRM rubrics, and mock interview rounds.
              </div>
            </div>
            <button onclick="app.openAiKeyModal()" class="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 whitespace-nowrap">
              Enter Key
            </button>
          </div>
        ` : ''}

        <!-- Chat Box -->
        <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[520px]">
          <!-- Chat Messages Area -->
          <div id="ai-chat-messages" class="flex-1 p-6 overflow-y-auto space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
                OS
              </div>
              <div class="max-w-2xl p-4 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                Hello! I am your Senior Operating Systems Professor and Systems Architect. Ask me anything about Process Management (Unit 2), CPU Scheduling algorithms, or Deadlocks (Unit 3). You can also ask me to generate a numerical problem or explain any diagram!
              </div>
            </div>
          </div>

          <!-- Chat Input Bar -->
          <div class="p-4 bg-slate-900/90 border-t border-slate-800 flex gap-2">
            <input type="text" id="ai-chat-input" placeholder="Ask a question (e.g. 'Prove why Peterson's solution satisfies bounded waiting')..." class="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-sky-500" onkeydown="if(event.key==='Enter') app.sendAiMessage();" />
            <button onclick="app.sendAiMessage()" id="ai-send-btn" class="px-5 py-2.5 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs">
              Send
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.getElementById("main-content-area");
    if (el) el.innerHTML = html;
  },

  async sendAiMessage() {
    const input = document.getElementById("ai-chat-input");
    const msg = input.value.trim();
    if (!msg) return;

    const chatArea = document.getElementById("ai-chat-messages");
    // Add user message
    chatArea.innerHTML += `
      <div class="flex items-start gap-3 justify-end">
        <div class="max-w-xl p-3.5 rounded-2xl rounded-tr-none bg-sky-500 text-slate-950 font-medium text-xs sm:text-sm">
          ${this.escapeHtml(msg)}
        </div>
      </div>
    `;
    input.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    // Loading indicator
    const loadingId = `load-${Date.now()}`;
    chatArea.innerHTML += `
      <div id="${loadingId}" class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">OS</div>
        <div class="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-slate-400 animate-pulse">
          Thinking...
        </div>
      </div>
    `;
    chatArea.scrollTop = chatArea.scrollHeight;

    const res = await GeminiAIEngine.askProfessor(msg);
    const loadEl = document.getElementById(loadingId);
    if (loadEl) loadEl.remove();

    const responseText = res.success ? res.text : (res.fallback || res.error);
    chatArea.innerHTML += `
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">OS</div>
        <div class="max-w-2xl p-4 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          ${this.escapeHtml(responseText)}
        </div>
      </div>
    `;
    chatArea.scrollTop = chatArea.scrollHeight;
  },

  askAiAboutTopic(topicTitle) {
    this.switchTab("ai-tutor");
    setTimeout(() => {
      const input = document.getElementById("ai-chat-input");
      if (input) {
        input.value = `Explain the core concepts, common exam traps, and interview edge cases for: "${topicTitle}".`;
        this.sendAiMessage();
      }
    }, 200);
  },

  // Modals
  openAiKeyModal() {
    const currentKey = GeminiAIEngine.getApiKey();
    const modal = document.getElementById("ai-key-modal");
    if (!modal) return;
    document.getElementById("modal-api-key-input").value = currentKey;
    modal.classList.remove("hidden");
  },

  closeAiKeyModal() {
    const modal = document.getElementById("ai-key-modal");
    if (modal) modal.classList.add("hidden");
  },

  saveAiKeyFromModal() {
    const key = document.getElementById("modal-api-key-input").value.trim();
    GeminiAIEngine.setApiKey(key);
    this.closeAiKeyModal();
    alert("Gemini API key saved! Live AI features are now active.");
    if (this.currentTab === "ai-tutor") this.renderAiTutor();
  },

  openAiGradingModal(questionId, marks) {
    const allQ = [...EXAM_DATA.marks2, ...EXAM_DATA.marks5, ...EXAM_DATA.marks10, ...EXAM_DATA.marks16];
    const qObj = allQ.find(x => x.id === questionId);
    if (!qObj) return;

    this.gradingQuestionObj = qObj;
    const modal = document.getElementById("ai-grading-modal");
    if (!modal) return;

    document.getElementById("grading-modal-question").innerText = `(${marks} Marks) ${qObj.question}`;
    document.getElementById("grading-modal-rubric").innerText = qObj.rubric;
    document.getElementById("grading-modal-student-answer").value = "";
    document.getElementById("grading-modal-output").classList.add("hidden");
    modal.classList.remove("hidden");
  },

  closeAiGradingModal() {
    const modal = document.getElementById("ai-grading-modal");
    if (modal) modal.classList.add("hidden");
  },

  async submitAnswerForGrading() {
    const ans = document.getElementById("grading-modal-student-answer").value.trim();
    if (!ans) {
      alert("Please enter your answer before grading.");
      return;
    }

    const outBox = document.getElementById("grading-modal-output");
    outBox.classList.remove("hidden");
    outBox.innerHTML = "<div class='text-xs text-sky-400 animate-pulse'>Evaluating answer against university marking rubric with Gemini AI...</div>";

    const res = await GeminiAIEngine.gradeAnswer(this.gradingQuestionObj, ans);
    outBox.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
        ${this.escapeHtml(res.success ? res.text : (res.fallback || res.error))}
      </div>
    `;
  },

  // Global Search Engine
  handleGlobalSearch(query) {
    const q = query.trim().toLowerCase();
    const dropdown = document.getElementById("global-search-results");
    if (!dropdown) return;

    if (q.length < 2) {
      dropdown.classList.add("hidden");
      return;
    }

    // Search across Unit 2 and Unit 3 topics, exam questions, and memory palace
    const results = [];
    const allTopics = [...UNIT2_DATA, ...UNIT3_DATA];

    allTopics.forEach(t => {
      if (t.title.toLowerCase().includes(q) || t.college.toLowerCase().includes(q) || t.beginner.toLowerCase().includes(q)) {
        results.push({ type: `Unit ${t.unit} Topic`, title: t.title, action: () => app.openTopic(t.id, t.unit) });
      }
    });

    MEMORY_PALACE_DATA.forEach(p => {
      if (p.concept.toLowerCase().includes(q) || p.story.toLowerCase().includes(q)) {
        results.push({ type: "Memory Palace", title: p.concept, action: () => app.switchTab("palace") });
      }
    });

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="p-3 text-xs text-slate-400">No matching OS concepts found for "${this.escapeHtml(query)}"</div>`;
    } else {
      dropdown.innerHTML = results.slice(0, 6).map((r, i) => `
        <div onclick="window.app._searchResults[${i}].action(); document.getElementById('global-search-results').classList.add('hidden');" class="p-2.5 rounded-lg hover:bg-slate-800 cursor-pointer text-xs flex items-center justify-between border-b border-slate-800/60 last:border-0">
          <span class="font-bold text-white">${r.title}</span>
          <span class="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">${r.type}</span>
        </div>
      `).join("");
      window.app._searchResults = results;
    }
    dropdown.classList.remove("hidden");
  },

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  bindEvents() {
    // Close search dropdown when clicking outside
    document.addEventListener("click", (e) => {
      const searchWrap = document.getElementById("search-wrapper");
      const dropdown = document.getElementById("global-search-results");
      if (searchWrap && dropdown && !searchWrap.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  }
};
