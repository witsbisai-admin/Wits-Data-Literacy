let state = {
  completedUnits: [],
  passedQuizzes: [],
  xp: 0,
  quizScores: {},
  currentUnit: null,
  currentQuizUnit: null,
  certGrade: 'Merit',
  certOpts: { wm: true, seal: true, nqfbar: true }
};
 
// ══════════════════════════════════════
// INITIALISATION
// ══════════════════════════════════════
async function init() {
  // 1. Double-check session data
  const { data: { session } } = await _supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await applyUser(currentUser); // This calls loadState() internally via auth.js
  }
 
  // 2. Build the UI
  loadProfile();         // from ui.js
  buildUnitsGrid();      // from dashboard.js
  buildNavBadges();      // from ui.js
  buildReferences();     // from ui.js
  updateProgress();      // from ui.js
  autoCertNo();          // from certificate.js
  // 3. Set today's date for the certificate
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('cf-date');
  if (dateInput) {
    dateInput.value = today;
  }
  // 4. Pre-fill and render certificate
  fillFromProfile();     // from certificate.js
  renderCert();          // from certificate.js
}
 
// ══════════════════════════════════════════════════
// BOOT SEQUENCE
// ══════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Show loading screen immediately
  showLoadingScreen('Connecting...');
 
  // 2. Ask Supabase: is anyone already logged in?
  const { data: { session } } = await _supabase.auth.getSession();
 
  if (session?.user) {
    // Returning user — load their data then show the app
    showLoadingScreen('Loading your progress...');
    currentUser = session.user;
    await applyUser(currentUser);   // Fetches profile + isAdmin (from auth.js)
    await init();                   // Builds UI with real data
    hideLoadingScreen();
    document.getElementById('signin-screen').style.display = 'none';
  } else {
    // No session — hide loading, sign-in screen is naturally visible
    hideLoadingScreen();
  }
 
  // 3. Listen for future auth changes (login / logout)
  _supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      currentUser = session.user;
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
    }
  });
});

// Array of suggested options implemented in the sign up form
// Faculties and divisions
const faculties_divisions = [
                                "Commerce, Law and Management",
                                "Engineering and the Built Environment",
                                "Health Sciences",
                                "Health Sciences",
                                "Humanities",
                                "Science",
                                "Council and Executive Leadership",
                                "University Secretariat",
                                "Division of Student Affairs",
                                "International Students Office",
                                "Disability Rights Unit (DRU)",
                                "Gender Equity Office (GEO)",
                                "Student Crisis and Support Contacts",
                                "Wits Student Employment Portal",
                                "University Libraries",
                                "Postgraduate Research and Development Office",
                                "Examinations and Graduation Office",
                                "Financial Aid and Scholarships Administration",
                                "Fees Office",
                                "Academic Information and Systems Unit (AISU)",
                                "Human Resources (HR)",
                                "Wits Protection Services",
                                "Wits ICT Helpdesk / Information Technology Support",
                                "Transformation and Employment Equity Office",
                                "Wits Communications, Marketing & Media",
                                "Wits Development and Fundraising Office",
                                "Business Intelligence Services (BIS)"
                            ];


// Designation/Role
const designation_roles = [
                                "Chancellor",
                                "Chairman of Council",
                                "President of Convocation",
                                "Vice‑Chancellor and Principal",
                                "Senior Deputy Vice‑Chancellor (Academic)",
                                "Deputy Vice‑Chancellor (Systems and Operations)",
                                "Deputy Vice‑Chancellor (Research & Innovation)",
                                "Deputy Vice‑Chancellor (People Development & Culture)",
                                "Pro Vice‑Chancellor (special strategic portfolios)",
                                "University Registrar",
                                "Chief Financial Officer (CFO)",
                                "Dean",
                                "Assistant Dean",
                                "University Council Member",
                                "Senate",
                                "University Forum",
                                "Student Representative Council (SRC)",
                                "Professor / Associate Professor / Senior Lecturer",
                                "Head of School",
                                "Director of Centres or Institutes",
                                "Administrative Manager",
                                "Professional Support Staff",
                                "Administratior",
                                "Intern",
                                "Student"
                            ];

// Get the datalist element
const dataList_faculties_divisions = document.getElementById("faculty-list");
const dataList_designation_roles = document.getElementById("role-list");

// Populate datalist
faculties_divisions.forEach(faculty => {
    const option = document.createElement("option");
    option.value = faculty;
    dataList_faculties_divisions.appendChild(option);
});

// Populate datalist
designation_roles.forEach(role => {
    const option = document.createElement("option");
    option.value = role;
    dataList_designation_roles.appendChild(option);
});