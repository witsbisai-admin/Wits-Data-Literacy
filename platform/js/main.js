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