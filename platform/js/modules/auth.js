function switchAuthTab(tab, el){
  document.querySelectorAll('.stab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('login-form').style.display  = tab==='login'    ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab==='register' ? 'flex' : 'none';
  document.getElementById('login-form').style.flexDirection='column';
  document.getElementById('register-form').style.flexDirection='column';
}

async function doLogin() {
  const email = document.getElementById('li-email').value.trim().toLowerCase();
  const pass = document.getElementById('li-pass').value;
  const err = document.getElementById('login-err');

  // 1. Clear previous errors
  err.classList.remove('show');

  // 2. Supabase Auth Sign In
  const { data, error } = await _supabase.auth.signInWithPassword({
    email: email,
    password: pass,
  });

  if (error) {
    // Customize error message for better user experience
    err.textContent = "Invalid email or password. Please check your credentials.";
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 4000);
    return;
  }

  // 3. Handle successful login
  if (data.user) {
    currentUser = data.user;
    
    // Persist session in local browser storage so refreshes don't log them out
     
    
    // 4. Important: Wait for user metadata and progress to load before hiding splash
    await applyUser(currentUser);
    
    hideSplash(currentUser);
    showToast("Welcome back!");
  }
}
// old 1
/*async function doRegister() {
  const name = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim().toLowerCase();
  const role = document.getElementById('rg-role').value.trim();
  const faculty = document.getElementById('rg-faculty').value.trim();
  const pass = document.getElementById('rg-pass').value;
  const err = document.getElementById('register-err');

  // 1. Basic Validation
  if (!name || !email || !pass || pass.length < 6) {
    err.textContent = 'Please fill in all fields. Password must be at least 6 characters.';
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 8000);
    return;
  }

  // 2. Supabase Auth Signup
  // We include name, role, and faculty in the user_metadata for easy access
  const { data, error } = await _supabase.auth.signUp({
    email: email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role: role,
        faculty: faculty
      }
    }
  });

  if (error && !data?.user) {
    err.textContent = error.message;
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 8000);
    return;
  }
  console.log(data.user)
  // 3. Create the Database Row
  // This step links the Auth account to your progress table
  if (data.user) {
    const { error: dbError } = await _supabase
      .from('student_progress')
      .insert([
        { 
          user_id: data.user.id,
          user_email: email, 
          full_name: name, 
          faculty: faculty, 
          is_admin: false,
          progress_data: {
            completedUnits: [],
            passedQuizzes: [],
            xp: 0,
            quizScores: {}
          }
        }
      ]);

    if (dbError) {
      console.log("dberror section")
      //console.error("Database Error:", dbError.message);
      // Even if DB fails, the user is created. We inform them:
      err.textContent = "Account created, but database initialization failed. Please contact admin.";
      err.classList.add('show');
      return;
    }

    // 4. Success Workflow
    currentUser = data.user;
    
    // Save to session storage so the page doesn't ask to login again if they refresh
     
    
    // Hide the login screen and start the app
    hideSplash(currentUser);
    showToast("Welcome to the platform, " + name + "!");
  }
}*/

// old 2

/*async function doRegister() {
  const name = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim().toLowerCase();
  const role = document.getElementById('rg-role').value.trim();
  const faculty = document.getElementById('rg-faculty').value.trim();
  const pass = document.getElementById('rg-pass').value;
  const err = document.getElementById('register-err');

  // 1. Validation
  if (!name || !email || !pass || pass.length < 6) {
    err.textContent = 'Please fill in all fields. Password must be at least 6 characters.';
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 8000);
    return;
  }

  // 2. Sign up user
  const { data, error } = await _supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role,
        faculty
      }
    }
  });

  if (error) {
    err.textContent = error.message;
    err.classList.add('show');
    return;
  }

  // 3. Ensure session exists (important)
  const { data: sessionData } = await _supabase.auth.getSession();

  if (!sessionData.session) {
    err.textContent = "Account created. Please log in.";
    err.classList.add('show');
    return;
  }

  // 4. Wait briefly for trigger to insert row (optional but safe)
  await new Promise(resolve => setTimeout(resolve, 500));

  // 5. Fetch user progress (created by trigger)
  const { data: progress, error: progressError } = await _supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', data.user.id)
    .maybeSingle();   // ✅ important

  if (progressError) {
    console.error(progressError);
  }

  console.log("User:", data.user);
  console.log("Progress:", progress);

  // 6. Continue app
  currentUser = data.user;

  hideSplash(currentUser);
  showToast("Welcome to the platform, " + name + "!");
}*/


async function hideSplash(user) {
  showLoadingScreen('Loading your progress...');
  document.getElementById('signin-screen').style.display = 'none';
  currentUser = user;
  await applyUser(user);
  await init();
  hideLoadingScreen();
}

async function doLogout() {

await _supabase.auth.signOut();

currentUser = null;

location.reload();

}

async function doRegister() {
  const name = document.getElementById('rg-name').value.trim();
  const email = document.getElementById('rg-email').value.trim().toLowerCase();
  const role = document.getElementById('rg-role').value.trim();
  const faculty = document.getElementById('rg-faculty').value.trim();
  const pass = document.getElementById('rg-pass').value;
  const err = document.getElementById('register-err');

  if (!name || !email || !pass || pass.length < 6) {
    err.textContent = 'Please fill in all fields. Password must be at least 6 characters.';
    err.classList.add('show');
    return;
  }

  const { data, error } = await _supabase.auth.signUp({
    email,
    password: pass,
    options: {
      data: {
        full_name: name,
        role,
        faculty
      }
    }
  });

  if (error) {
    err.textContent = error.message;
    err.classList.add('show');
    return;
  }

  // ✅ NEW BEHAVIOR
  err.textContent = "Account created! Please check your email to confirm your account before logging in.";
  err.classList.add('show');

  // DO NOT log user in
  // DO NOT fetch data yet
}

async function applyUser(u) {
  currentUser = u;
  
  // 1. Fetch user profile and admin status from Supabase
  const { data: profile, error } = await _supabase
    .from('student_progress')
    .select('is_admin, full_name, faculty')
    .eq('user_id', u.id)
    .single();

  const isAdminFlag = profile?.is_admin || false;

  // 2. Update UI Sidebar
  const nameEl = document.getElementById('sidebar-username');
  if (nameEl) {
    if (isAdminFlag) {
      nameEl.innerHTML = (profile?.full_name || u.email) + ' <span class="admin-badge">ADMIN</span>';
    } else {
      nameEl.textContent = profile?.full_name || u.email;
    }
  }

  const roleEl = document.getElementById('sidebar-role');
  if (roleEl && profile?.faculty) {
    roleEl.textContent = profile.faculty;
  }

  // 3. Show Admin Section if applicable
  const adminSection = document.getElementById('admin-nav-section');
  if (adminSection) adminSection.style.display = isAdminFlag ? 'block' : 'none';

  // 4. Load the actual study progress (units, quiz scores, XP)
  await loadState();
}


function showForgotScreen(){
  document.getElementById('forgot-screen').classList.add('show');
  document.getElementById('forgot-step2').style.display='none';
  document.getElementById('reset-code-box').classList.remove('show');
  document.getElementById('fp-email').value='';
  document.getElementById('fp-code').value='';
  document.getElementById('fp-newpass').value='';
  document.getElementById('fp-confirm').value='';
  document.getElementById('fp-err').classList.remove('show');
}

function hideForgotScreen(){
  document.getElementById('forgot-screen').classList.remove('show');
}

function doForgotPassword(){
  const email = document.getElementById('fp-email').value.trim().toLowerCase();
  const err   = document.getElementById('fp-err');


  // Generate a 6-digit reset code tied to this email
  const code = String(Math.floor(100000 + Math.random()*900000));
  const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY)||'{}');
  codes[email] = {code, expiry: Date.now() + 3600000}; // 1 hour
  localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));

  // Show the code (in a real system this would email the admin; here shown on screen)
  document.getElementById('reset-code-display').textContent = code;
  document.getElementById('reset-code-box').classList.add('show');
  document.getElementById('forgot-step2').style.display='block';
}

function doResetWithCode(){
  const email   = document.getElementById('fp-email').value.trim().toLowerCase();
  const entered = document.getElementById('fp-code').value.trim();
  const newpass = document.getElementById('fp-newpass').value;
  const confirm = document.getElementById('fp-confirm').value;
  const err     = document.getElementById('fp-err2');

  const codes = JSON.parse(localStorage.getItem(RESET_CODES_KEY)||'{}');
  const record = codes[email];

  if(!record || record.code !== entered || Date.now() > record.expiry){
    err.style.display='block'; err.textContent='Invalid or expired reset code.';
    setTimeout(()=>err.style.display='none',3000); return;
  }
  if(newpass.length < 6 || newpass !== confirm){
    err.style.display='block'; err.textContent='Passwords do not match or are too short (min 6 chars).';
    setTimeout(()=>err.style.display='none',3000); return;
  }


  // Clear used code
  delete codes[email];
  localStorage.setItem(RESET_CODES_KEY, JSON.stringify(codes));

  hideForgotScreen();
  showToast('Password reset successfully! Please sign in.');
}