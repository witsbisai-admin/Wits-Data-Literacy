let state = {
  completedUnits: [],
  passedQuizzes: [],
  viewedSections: {}, // NEW: Tracks viewed sections per unit {1: [0, 1, 2], 2: [0]}
  xp: 0,
  quizScores: {},
  quizAttempts: {},   // NEW: Tracks number of attempts per unit
  quizProgress: {},   // NEW: Saves in-progress quiz answers to the DB
  currentUnit: null,
  currentQuizUnit: null,
  certGrade: 'Merit',
  certOpts: { wm: true, seal: true, nqfbar: true },
  survey: {
    quality: null,
    recommend: null,
    comments: "",
    submitted: false,
    last_updated: null}
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
// BOOT SEQUENCE & AUTH LISTENER
// ══════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', async () => {
  // 1. Show loading screen immediately
  showLoadingScreen('Connecting...');
 

  // ✅ NEW: Check if user just confirmed their email
  const urlParams = new URLSearchParams(window.location.search);
  const justConfirmed = urlParams.get('confirmed') === 'true';


  if (justConfirmed) {
    // Sign them out in case Supabase auto-logged them in
    await _supabase.auth.signOut();
    // Clean the URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Show login screen with a nice message
    hideLoadingScreen();
    document.getElementById('signin-screen').style.display = 'flex';
    // Switch to login tab
    switchAuthTab('login', document.querySelector('.stab'));
    // Show a success toast/message
    showToast("✅ Email confirmed! Please log in.");
    return;
  }

  // 2. IMMEDIATE HASH CHECK
  // We check the URL before doing ANYTHING else to see if this is a reset link
  const isRecovery = window.location.hash.includes('type=recovery') || 
                     window.location.hash.includes('type=invite');
 
  // 3. Initial Session Check
  const { data: { session } } = await _supabase.auth.getSession();
 
  if (session?.user) {
    currentUser = session.user;
    
    if (isRecovery) {
      // INTERCEPT: If it's a recovery/invite, show the reset form and STOP
      showForgotScreen();
      document.getElementById('forgot-step1').style.display = 'none';
      document.getElementById('reset-code-box').style.display = 'none';
      document.getElementById('forgot-step2').style.display = 'block';
      
      // Change title if it's an invite
      if (window.location.hash.includes('type=invite')) {
          document.querySelector('#forgot-screen h2').textContent = "Set Your Password";
      }

      hideLoadingScreen();
      document.getElementById('signin-screen').style.display = 'none';
      // We return here so the app doesn't continue to load the dashboard
      return; 
    } else {
      // Normal login flow
      showLoadingScreen('Loading your progress...');
      await applyUser(currentUser);
      await init();
      hideLoadingScreen();
      document.getElementById('signin-screen').style.display = 'none';
    }
  } else {
    // No user found, just show the sign-in screen
    hideLoadingScreen();
  }
 
  // 4. Listen for future auth changes
  /*_supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      showForgotScreen();
      document.getElementById('forgot-step1').style.display = 'none';
      document.getElementById('reset-code-box').style.display = 'none';
      document.getElementById('forgot-step2').style.display = 'block';
      document.getElementById('signin-screen').style.display = 'none';
      hideLoadingScreen();
    }
    
    if (event === 'SIGNED_IN' && session?.user) {
      currentUser = session.user;
      // Only load dashboard if the reset password form isn't open
      const isResetting = document.getElementById('forgot-step2').style.display === 'block';
      if (!isResetting && document.getElementById('signin-screen').style.display !== 'none') {
        await applyUser(currentUser);
        await init();
        hideSplash(currentUser);
      }
    }
  });*/

  _supabase.auth.onAuthStateChange(async (event, session) => {

  if (event === 'PASSWORD_RECOVERY') {
    showForgotScreen();
    document.getElementById('forgot-step1').style.display = 'none';
    document.getElementById('reset-code-box').style.display = 'none';
    document.getElementById('forgot-step2').style.display = 'block';
    document.getElementById('signin-screen').style.display = 'none';
    hideLoadingScreen();
  }

  if (event === 'SIGNED_IN' && session?.user) {
    currentUser = session.user;

    const isResetting =
      document.getElementById('forgot-step2').style.display === 'block';

    // ✅ ALWAYS confirm user session
    //console.log('SIGNED_IN event:', session);

    // ✅ Detect email confirmation redirect
    const isEmailConfirm = window.location.href.includes('type=signup');

    if (isEmailConfirm) {
      showSuccessModal("✅ Email confirmed! You can now log in.");

      // Optional: force logout so they log in manually
      await _supabase.auth.signOut();
      return;
    }

    // ✅ Normal login flow
    if (!isResetting) {
      await applyUser(currentUser);
      await init();
      hideSplash(currentUser);
    }
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

// PASSWORD ICON TOGGLE

const input_login = document.getElementById("li-pass");
const input_register = document.getElementById("rg-pass");

const input_fp_new_pw = document.getElementById("fp-newpass");
const input_fp_confirm_pw = document.getElementById("fp-confirm");

const icon_login = document.getElementById("toggle-pass_login");
const icon_reg = document.getElementById("toggle-pass_reg");

const icon_new_pw = document.getElementById("toggle-pass_new");
const icon_confirm_pw = document.getElementById("toggle-pass_confirm");

function toggleIconVisibility(page) {
  switch(page){
    case "Sign_in":{
          if (input_login.value.length > 0 || document.activeElement === input_login) {
            icon_login.style.display = "block";
          } else {
            icon_login.style.display = "none";
          }
    }break;
    case "Sign_up":{
          if (input_register.value.length > 0 || document.activeElement === input_register) {
            icon_reg.style.display = "block";
          } else {
            icon_reg.style.display = "none";
          }
    }break;
    case "forgot_pw_new":{
          if (input_fp_new_pw.value.length > 0 || document.activeElement === input_fp_new_pw) {
            icon_new_pw.style.display = "block";
          } else {
            icon_new_pw.style.display = "none";
          }
    }break;
    case "forgot_pw_confirm":{
          if (input_fp_confirm_pw.value.length > 0 || document.activeElement === input_fp_confirm_pw) {
            icon_confirm_pw.style.display = "block";
          } else {
            icon_confirm_pw.style.display = "none";
          }
    }break;
  }

}

function togglePassword(page) {
  switch(page){
      case "Sign_in":{
          const isHidden = input_login.type === "password";

          input_login.type = isHidden ? "text" : "password";
          
          // toggle icon classes
          icon_login.classList.toggle("fa-eye");
          icon_login.classList.toggle("fa-eye-slash");
      }break;
      case "Sign_up":{
          const isHidden = input_register.type === "password";

          input_register.type = isHidden ? "text" : "password";
          
          // toggle icon classes
          icon_reg.classList.toggle("fa-eye");
          icon_reg.classList.toggle("fa-eye-slash");
      }break;
      case "forgot_pw_new":{
          const isHidden = input_fp_new_pw.type === "password";

          input_fp_new_pw.type = isHidden ? "text" : "password";
          
          // toggle icon classes
          icon_new_pw.classList.toggle("fa-eye");
          icon_new_pw.classList.toggle("fa-eye-slash");
      }break;
      case "forgot_pw_confirm":{
          const isHidden = input_fp_confirm_pw.type === "password";

          input_fp_confirm_pw.type = isHidden ? "text" : "password";
          
          // toggle icon classes
          icon_confirm_pw.classList.toggle("fa-eye");
          icon_confirm_pw.classList.toggle("fa-eye-slash");
      }break;
  }
    
    
}

function showSuccessModal(message = "Your action was successful!") {
  const modal = document.getElementById("successModal");
  const text = document.getElementById("successMessage");

  text.textContent = message;

  // Reset animation
  const svg = modal.querySelector(".checkmark");
  const newSvg = svg.cloneNode(true);
  svg.parentNode.replaceChild(newSvg, svg);

  modal.style.display = "flex";

  // 🔒 Disable background scroll
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    closeSuccessModal();
  }, 3000);
}

function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";

  // 🔓 Restore scroll
  document.body.style.overflow = "auto";
}

function toggleHamburger(toggleOption){
    switch(toggleOption){
        case "open":{
            document.getElementById("bc-hamburger-id").style.display = "none";
            document.getElementById("bc-close-id").style.display = "block";
            document.getElementById("sidebar-id").style.display = "block";
        }break;
        case "close":{
            document.getElementById("bc-hamburger-id").style.display = "block";
            document.getElementById("bc-close-id").style.display = "none";
            document.getElementById("sidebar-id").style.display = "none";
        }break;
    }
}
