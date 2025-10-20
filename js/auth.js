import { supabase } from "./supabase.js";

// Elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("msg");

// If user already logged in, redirect to admin
checkSession();

async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    window.location = "admin.html";
  }
}

// Login event
loginBtn.addEventListener("click", async () => {
  msg.textContent = "Logging in...";
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    msg.textContent = "Invalid credentials!";
  } else {
    msg.textContent = "Login successful!";
    setTimeout(() => (window.location = "admin.html"), 1000);
  }
});
