let currentSurveyStep = 0;
let surveyPath = "content"; 
let surveySaveTimer = null; // To handle typing debounce

const SURVEY_BRANCHES = {
    start: {
        q: "Did you attend the Data Literacy Workshop on 18 May 2026?",
        key: "attended_workshop",
        type: "choice",
        options: ["Yes, I attended", "No, I am only using the online platform"]
    },
    workshop: [
        { q: "How would you describe your level of data literacy BEFORE the workshop?", key: "pre_level", type: "choice", options: ["Beginner", "Intermediate", "Advanced"] },
        { q: "The workshop objectives were clear.", key: "ws_objectives", type: "likert" },
        { q: "The content was relevant to my role or day-to-day work.", key: "ws_relevance", type: "likert" },
        { q: "I have a better understanding of data-concepts after the workshop.", key: "ws_impact", type: "likert" },
        { q: "The facilitator explained concepts clearly.", key: "ws_facilitator", type: "likert" },
        { q: "Will you be keen to be a data literacy champion in your department?", key: "keen_champion", type: "choice", options: ["Yes", "No", "Maybe"] },
        { q: "Will you be attending the next workshop?", key: "next_ws", type: "choice", options: ["Yes", "No", "Maybe"] }
    ],
    content: [
        { q: "How would you rate the overall quality of the online units?", key: "site_quality", type: "rating" },
        { q: "The online platform is easy to navigate.", key: "site_ux", type: "likert" },
        { q: "Which learning unit did you find most helpful?", key: "best_unit", type: "choice", options: ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5", "Unit 6"] },
        { q: "What is your primary goal for using this platform?", key: "goal", type: "text" },
        { q: "Would you recommend this online course to a colleague?", key: "recommend_site", type: "choice", options: ["Very Likely", "Likely", "Unlikely"] }
    ]
};

function renderSurvey() {
  const container = document.getElementById('survey-container');
  if (state.survey?.submitted) {
      renderSurveySuccess();
      return;
  }
  
  if (currentSurveyStep === 0) {
      renderQuestion(SURVEY_BRANCHES.start);
      updateSurveyUI();
      return;
  }

  // Determine which question set to pull from
  const questions = (surveyPath === "workshop") ? SURVEY_BRANCHES.workshop : SURVEY_BRANCHES.content;
  const qIndex = currentSurveyStep - 1;
  
  if (qIndex < questions.length) {
      renderQuestion(questions[qIndex]);
      updateSurveyUI();
  }
}

function renderQuestion(q) {
    const container = document.getElementById('survey-container');
    const val = state.survey?.[q.key] || "";
    let html = `<div class="animate-in"><h3>${q.q}</h3>`;

    if (q.type === "choice") {
        html += q.options.map(opt => `
            <div class="survey-option-card ${val === opt ? 'selected' : ''}" onclick="handleSurveySelection('${q.key}', '${opt}')">
                <input type="radio" ${val === opt ? 'checked' : ''}><span>${opt}</span>
            </div>`).join('');
    } else if (q.type === "likert") {
        const opts = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
        html += `<div class="rating-scale-container"><div class="rating-label-row"><span>Strongly Disagree</span><span>Strongly Agree</span></div>`;
        html += `<div style="display:flex; gap:8px; justify-content:center">` + opts.map((o, i) => `
            <button onclick="handleSurveySelection('${q.key}', '${o}')" class="grade-btn ${val === o ? 'active' : ''}" style="width:45px">${i+1}</button>
        `).join('') + `</div></div>`;
    } else if (q.type === "rating") {
        html += `<div style="display:flex; gap:10px; justify-content:center; margin-top:15px">`;
        for (let i = 1; i <= 5; i++) {
            html += `<button onclick="handleSurveySelection('${q.key}', ${i})" class="grade-btn ${val == i ? 'active' : ''}">${i}</button>`;
        }
        html += `</div>`;
    } else if (q.type === "text") {
        // Use standard input event for state, but DO NOT call renderSurvey here to stop glitching
        html += `<textarea class="task-input" oninput="handleTyping('${q.key}', this.value)" placeholder="Type here...">${val}</textarea>`;
    }
    container.innerHTML = html + `</div>`;
}

// Separate functions to handle inputs without full re-renders
function handleSurveySelection(key, val) {
    // Save state, but pass "false" so it DOES NOT re-render the whole survey HTML
    saveSurveyField(key, val, false); 
    
    // 1. Visually update Choice cards (Radio options)
    document.querySelectorAll('.survey-option-card').forEach(card => {
        const span = card.querySelector('span');
        if (span && span.textContent.trim() === val.toString()) {
            card.classList.add('selected');
            if (card.querySelector('input')) card.querySelector('input').checked = true;
        } else {
            card.classList.remove('selected');
            if (card.querySelector('input')) card.querySelector('input').checked = false;
        }
    });

    // 2. Visually update Likert / Number Rating buttons
    document.querySelectorAll('.grade-btn').forEach(btn => {
        // Remove active class from all buttons first
        btn.classList.remove('active');
        
        // Find the specific button that was clicked by checking its onclick attribute
        const onclickStr = btn.getAttribute('onclick') || "";
        if (typeof val === 'string' && onclickStr.includes(`'${val}'`)) {
            btn.classList.add('active');
        } else if (typeof val === 'number' && onclickStr.includes(`, ${val})`)) {
            btn.classList.add('active');
        }
    });
}

function handleTyping(key, val) {
    saveSurveyField(key, val, false); // false = don't re-render while typing
}

async function saveSurveyField(key, val, shouldReRender) {
    if(!state.survey) state.survey = {};
    state.survey[key] = val;
    
    // Debounce database push to prevent excessive API calls
    clearTimeout(surveySaveTimer);
    surveySaveTimer = setTimeout(async () => {
        await saveState();
    }, 1000);

    if (shouldReRender) renderSurvey();
}

function renderSurveySuccess() {
  const container = document.getElementById('survey-container');
  if (!container) return;

  container.innerHTML = `
      <div class="animate-in" style="text-align:center; padding:40px 0">
          <div style="font-size:50px; margin-bottom:20px">🎉</div>
          <h3>Thank You!</h3>
          <p>Your feedback has been submitted successfully and will help us improve the program.</p>
          <div style="display:flex; gap:12px; justify-content:center; margin-top:20px">
              <button class="cta-btn cta-ghost" onclick="retakeSurvey()">Retake Survey</button>
              <button class="cta-btn cta-primary" onclick="showView('dashboard')">Back to Dashboard</button>
          </div>
      </div>`;
  
  // Hide progress and navigation on the success screen
  const progContainer = document.querySelector('.survey-progress-container');
  if (progContainer) progContainer.style.display = 'none';
  
  const navContainer = document.querySelector('.survey-navigation');
  if (navContainer) navContainer.style.display = 'none';
}

async function submitSurvey() {
    if(!state.survey) state.survey = {};
    state.survey.submitted = true;
    await saveState();
    renderSurvey(); // This will now trigger renderSurveySuccess()
}

function surveyNext() {
  const attended = state.survey?.attended_workshop;
  
  if (currentSurveyStep === 0) {
      if (!attended) return showToast("Please select an answer");
      surveyPath = attended.includes("Yes") ? "workshop" : "content";
  }
  
  const wsQuestions = SURVEY_BRANCHES.workshop;
  const contentQuestions = SURVEY_BRANCHES.content;

  // Logic: If on workshop path and finished workshop questions, switch to content
  if (surveyPath === "workshop" && currentSurveyStep === wsQuestions.length) {
      // Redirect to first content question instead of submitting
      surveyPath = "content_sequel"; // Flag to indicate we are doing the second half
      currentSurveyStep = 1; // Reset step for the next array
      renderSurvey();
      return;
  }

  currentSurveyStep++;
  renderSurvey();
}

function surveyPrev() { if (currentSurveyStep > 0) { currentSurveyStep--; renderSurvey(); } }

function updateSurveyUI() {
  const wsLen = SURVEY_BRANCHES.workshop.length;
  const ctLen = SURVEY_BRANCHES.content.length;
  
  let current, total;

  if (currentSurveyStep === 0) {
      current = 1;
      total = (state.survey?.attended_workshop?.includes("Yes")) ? (wsLen + ctLen + 1) : (ctLen + 1);
  } else if (surveyPath === "workshop") {
      current = currentSurveyStep + 1;
      total = wsLen + ctLen + 1;
  } else {
      // If "No" path, total is just content. If "Yes" sequel path, current adds wsLen.
      const isSequel = (surveyPath === "content_sequel");
      current = isSequel ? (currentSurveyStep + wsLen + 1) : (currentSurveyStep + 1);
      total = isSequel ? (wsLen + ctLen + 1) : (ctLen + 1);
  }

  const pct = (current / total) * 100;
  const bar = document.getElementById('survey-prog-bar');
  if(bar) bar.style.width = pct + "%";
  
  const text = document.getElementById('survey-step-text');
  if(text) text.textContent = `Step ${current} of ${total}`;
  
  document.getElementById('survey-prev-btn').style.display = currentSurveyStep > 0 ? "block" : "none";
  
  // Check if it's the absolute last question
  const questions = (surveyPath === "workshop") ? SURVEY_BRANCHES.workshop : SURVEY_BRANCHES.content;
  const isLast = (currentSurveyStep === questions.length && (surveyPath === "content" || surveyPath === "content_sequel"));
  
  document.getElementById('survey-next-btn').style.display = isLast ? "none" : "block";
  document.getElementById('survey-submit-btn').style.display = isLast ? "block" : "none";
}

async function retakeSurvey() {
  // Reset local navigation state
  currentSurveyStep = 0;
  surveyPath = "content";

  // Clear the submitted flag in the global state
  if (state.survey) {
      state.survey.submitted = false;
      // We do NOT clear the previous answers here so the user can see 
      // their last choices as they go through the steps again, 
      // or you can set state.survey = { submitted: false } to wipe everything.
  }

  // Show UI elements again
  const progContainer = document.querySelector('.survey-progress-container');
  if (progContainer) progContainer.style.display = 'block';
  
  const navContainer = document.querySelector('.survey-navigation');
  if (navContainer) navContainer.style.display = 'flex';

  // Persist the "unsubmitted" status to database and re-render
  await saveState(); //
  renderSurvey();
}