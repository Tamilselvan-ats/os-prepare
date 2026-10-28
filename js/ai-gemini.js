// =============================================================================
// GEMINI AI INTEGRATION ENGINE (Google AI Studio API)
// Provides: AI Professor Chat, AI Exam Grader, FAANG Mock Interviewer,
// and Custom Numerical Problem Generator
// =============================================================================

window.GeminiAIEngine = {
  getApiKey() {
    return localStorage.getItem("os_prep_gemini_api_key") || "";
  },

  setApiKey(key) {
    localStorage.setItem("os_prep_gemini_api_key", key.trim());
    this.updateStatusBadge();
  },

  hasApiKey() {
    const key = this.getApiKey();
    return key && key.length > 15;
  },

  updateStatusBadge() {
    const badge = document.getElementById("ai-status-indicator");
    if (!badge) return;
    if (this.hasApiKey()) {
      badge.innerHTML = `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Gemini 2.0 Connected
        </span>
      `;
    } else {
      badge.innerHTML = `
        <button onclick="app.openAiKeyModal()" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          Add AI Studio Key
        </button>
      `;
    }
  },

  // Direct Call to Gemini API (supports gemini-2.0-flash / gemini-1.5-flash)
  async callGemini(systemInstruction, userPrompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return {
        success: false,
        error: "NO_API_KEY",
        fallback: "Please enter your Gemini API key from Google AI Studio to activate live AI features. Click 'Settings' or 'Add AI Studio Key' in the top header."
      };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 2048
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from Gemini.";
      return { success: true, text: answer };
    } catch (err) {
      console.error("Gemini API Error:", err);
      return {
        success: false,
        error: err.message,
        fallback: `Gemini API Request failed: ${err.message}. Please verify your API key in Google AI Studio.`
      };
    }
  },

  // 1. Ask OS Professor Mode
  async askProfessor(question, topicContext = "") {
    const systemPrompt = `You are an elite Senior Operating Systems Professor at SRM Institute of Science and Technology and former Principal Systems Architect at Google.
You are teaching the 21CSC202J Operating Systems syllabus focusing on Unit 2 (Process Management) and Unit 3 (Scheduling and Deadlocks).
Course reference: Silberschatz, Galvin, Gagne - Operating System Concepts 9th Edition.
Your tone is deeply knowledgeable, clear, academically rigorous yet engaging.
When answering:
1. Give direct, conceptually precise definitions.
2. Squeeze in university exam points (e.g., 2-mark definitions or 16-mark proof structure).
3. Provide code snippets (C, POSIX, Java) or ASCII Gantt charts where applicable.
4. Conclude with a FAANG engineering interview tip.`;

    const userPrompt = topicContext
      ? `Topic Context: ${topicContext}\n\nStudent Question: ${question}`
      : `Student Question: ${question}`;

    return await this.callGemini(systemPrompt, userPrompt);
  },

  // 2. AI Exam Grader Mode
  async gradeAnswer(questionObj, studentAnswer) {
    const systemPrompt = `You are the Chief University Examiner for Operating Systems (SRM 21CSC202J Examination Board).
Evaluate the student's answer against the official marking rubric and standard syllabus expectations.
Provide your evaluation in this strict Markdown structure:
1. **Marks Awarded**: [Score] / [Max Marks] (e.g. 14 / 16)
2. **Evaluation Summary**: 2-3 sentences evaluating conceptual correctness.
3. **Key Concepts Covered**: Bullet points with green checks (✅) for what the student got right.
4. **Missing or Incomplete Elements**: Technical keywords, proofs, edge cases, or diagrams the student omitted with red crosses (❌).
5. **Examiner Improvement Tips**: Exactly what to write to score full marks in semester exams.`;

    const userPrompt = `Question (${questionObj.marks || "University"} Marks):
${questionObj.question}

Official Rubric:
${questionObj.rubric || "Standard university marking criteria."}

Student Submitted Answer:
"""
${studentAnswer}
"""`;

    return await this.callGemini(systemPrompt, userPrompt);
  },

  // 3. FAANG Mock Interviewer Mode
  async conductInterviewTurn(conversationHistory, userResponse) {
    const systemPrompt = `You are an L7 Principal Systems Infrastructure Engineer at Google conducting a technical Operating Systems interview for Senior Software Engineer candidates.
The focus is on Process Management, Multithreading Concurrency, CPU Schedulers, and Deadlocks.
Evaluate the candidate's response technically. Highlight subtle concurrency traps, out-of-order execution, memory barriers, kernel overheads, and trade-offs.
Then ask exactly ONE probing, deep follow-up question to test their senior systems engineering depth. Keep responses concise and professional.`;

    let userPrompt = "Interview History:\n";
    conversationHistory.forEach(turn => {
      userPrompt += `${turn.role}: ${turn.text}\n`;
    });
    userPrompt += `Candidate: ${userResponse}\n\nInterviewer response and next question:`;

    return await this.callGemini(systemPrompt, userPrompt);
  }
};
