const _supabase = supabase.createClient(supabaseUrl, supabaseKey);let currentUser = null; 
function isAdmin(u){ return u && (u.isAdmin === true || u.email === ADMIN_EMAIL); }