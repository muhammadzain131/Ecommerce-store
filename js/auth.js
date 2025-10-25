import { supabase } from "./supabase.js";

// --- Sign Up ---
document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return alert(error.message);
  alert("Signup successful! Please check your email.");
});

// --- Login ---
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  localStorage.setItem("session", JSON.stringify(data.session));
  window.location.href = "admin.html";
});

// --- Check Session ---
export async function getUserSession() {
  const { data } = await supabase.auth.getSession();
  return data;
}

// --- Logout ---
export async function signOutUser() {
  await supabase.auth.signOut();
  localStorage.removeItem("session");
  window.location.href = "index.html";
}
