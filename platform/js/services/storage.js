let _saveTimer = null;
async function saveState() {
  if (!currentUser) return;
  const { error } = await _supabase
    .from('student_progress')
    .upsert({      user_id:        currentUser.id,      user_email:     currentUser.email,      progress_data: state,
      last_updated:  new Date().toISOString()
    }, {      onConflict: 'user_id'       });
  if (error) {
    console.error('[saveState] Supabase write failed:', error.message);
    showToast('⚠️ Progress not saved — check your connection');
  }
}async function loadState() {
  if (!currentUser) return;
  const { data, error } = await _supabase
    .from('student_progress')
    .select('progress_data')
    .eq('user_id', currentUser.id)
    .single();

  if (error && error.code !== 'PGRST116') {
      console.error('[loadState] Supabase read failed:', error.message);
      return;
  }

  if (data?.progress_data) {
    Object.assign(state, data.progress_data);
  }
}
 