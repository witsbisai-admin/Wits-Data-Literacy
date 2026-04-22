function switchAuthTab(tab, el){
  document.querySelectorAll('.stab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('login-form').style.display  = tab==='login'    ? 'flex' : 'none';
  document.getElementById('register-form').style.display = tab==='register' ? 'flex' : 'none';
  document.getElementById('signin-title-id').innerHTML = tab==='register' ? 'Get Started With Us' : 'Welcome Back';
  document.getElementById('signin-sub-id').innerHTML = tab==='register' ? 'Create an account with us to access the Data Champions Learning Platform' : 'Sign in to access the Data Champions Learning Platform';
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

  //console.log("data",data)

  if (error) {
    // Customize error message for better user experience
    err.textContent = "Invalid email or password. Please check your credentials.";
    err.classList.add('show');
    console.log("error",error)
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

async function doRegister() {
  const success = document.getElementById('successModal');

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
    //err.textContent = "Account created. Please log in.";
    //err.classList.add('show');
    success.style.display = "block";

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


  // 6. Continue app
  currentUser = data.user;

  hideSplash(currentUser);
  showToast("Welcome to the platform, " + name + "!");
}


async function hideSplash(user) {
  showLoadingScreen('Loading your progress...');
  document.getElementById('signin-screen').style.display = 'none';
  currentUser = user;
  await applyUser(user);
  await init();
  hideLoadingScreen();
}

async function doLogout() {
  showLoadingScreen("Signing out...");
  
  try {
    // Give Supabase a maximum of 2 seconds to sign out on the server, 
    // otherwise force the local sign out so you don't get stuck.
    await Promise.race([
      _supabase.auth.signOut(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);
  } catch (err) {
    console.error("Signout error:", err);
  } finally {
    // Wipe all local states to guarantee a clean slate
    currentUser = null;
    localStorage.clear();
    sessionStorage.clear();
    
    // Perform a hard redirect to the base URL to clear out any stuck routing
    window.location.href = window.location.pathname; 
  }
}

/**Latest version */
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
    return;
  }

  // 2. Supabase Auth Signup
  // We send the metadata, but we do NOT insert into the student_progress table here.
  const { data, error } = await _supabase.auth.signUp({
    email: email,
    password: pass,
    options: {
      // Replace with your actual production URL
      //emailRedirectTo: 'https://wits-data-literacy.vercel.app/?confirmed=true',
      emailRedirectTo: 'https://wits-data-literacy.vercel.app',
      data: {
        full_name: name,
        role: role,
        faculty: faculty
      }
    }
  });

  if (error) {
    err.textContent = error.message;
    err.classList.add('show');
    return;
  }

  // 3. Success UI
  // Instead of logging in, show the success modal asking them to check their email
  if (data.user) {
    showSuccessModal("Account created! Please check your email and click the verification link before signing in.");
    
    // Switch back to login tab automatically after a delay so they are ready to sign in
    setTimeout(() => {
        switchAuthTab('login', document.querySelector('.stab'));
        // Clear registration fields
        document.getElementById('rg-name').value = '';
        document.getElementById('rg-email').value = '';
        document.getElementById('rg-pass').value = '';
    }, 4000);
  }
}
*/

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
  await loadProfile();
}


function showForgotScreen(){
  document.getElementById('forgot-screen').classList.add('show');
  document.getElementById('forgot-step2').style.display='none';
  document.getElementById('reset-code-box').classList.remove('show');
  document.getElementById('fp-email').value='';
  //document.getElementById('fp-code').value='';
  document.getElementById('fp-newpass').value='';
  document.getElementById('fp-confirm').value='';
  document.getElementById('fp-err').classList.remove('show');
}

function hideForgotScreen(){
  document.getElementById('forgot-screen').classList.remove('show');
}

async function doForgotPassword() {
  const email = document.getElementById('fp-email').value.trim().toLowerCase();
  const err = document.getElementById('fp-err');
  const successBox = document.getElementById('reset-code-box');
  const successMsg = document.getElementById('reset-success-msg');

  // We explicitly tell Supabase to redirect to your Vercel URL
  const { error } = await _supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://wits-data-literacy.vercel.app/',
  });

  if (error) {
    err.textContent = error.message;
    err.classList.add('show');
  } else {
    // Hide the input form
    document.getElementById('forgot-step1').style.display = 'none';
    // Show the success box and fill it with text so it's not empty
    successBox.style.display = 'block';
    successBox.classList.add('show');
    successMsg.innerHTML = "<strong>📧 Check your email</strong><br>We've sent a reset link to your inbox. Please click it to continue.";
  }
}

async function doResetWithCode() {
  const newpass = document.getElementById('fp-newpass').value;
  const confirm = document.getElementById('fp-confirm').value;
  const err = document.getElementById('fp-err2');

  if (newpass.length < 6 || newpass !== confirm) {
    err.style.display = 'block';
    err.textContent = 'Passwords do not match or are too short (min 6 chars).';
    return;
  }

  // Supabase uses the current session (from the email link) to identify the user
  const { data, error } = await _supabase.auth.updateUser({ password: newpass });

  if (error) {
    err.style.display = 'block';
    err.textContent = error.message;
  } else {
    showToast('Password updated successfully!');
    // CLEAR THE HASH so the 'type=recovery' goes away
    window.location.hash = ''; 
    hideForgotScreen();
    // Now load the app normally
    await applyUser(data.user);
    await init();
    hideSplash(data.user);
  }
}