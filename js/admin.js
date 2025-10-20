import { supabase } from "./supabase.js";

// Check admin session
checkAuth();

async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location = "login.html";
  }
}

// Logout function
const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Logout";
logoutBtn.classList.add("logout-btn");
document.body.prepend(logoutBtn);

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location = "login.html";
});

import { supabase } from "./supabase.js";

const catName = document.getElementById("catName");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categorySelect = document.getElementById("categorySelect");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodImage = document.getElementById("prodImage");
const prodDesc = document.getElementById("prodDesc");
const addProductBtn = document.getElementById("addProductBtn");

// Add Category
addCategoryBtn.addEventListener("click", async () => {
  if (!catName.value.trim()) return alert("Enter category name!");

  const { error } = await supabase
    .from("categories")
    .insert([{ name: catName.value.trim() }]);

  if (error) console.log(error);
  else {
    alert("Category added!");
    catName.value = "";
    loadCategories();
  }
});

// Load Categories in dropdown
async function loadCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return console.log(error);

  categorySelect.innerHTML = data
    .map(cat => `<option value="${cat.id}">${cat.name}</option>`)
    .join("");
}
loadCategories();

// Add Product
addProductBtn.addEventListener("click", async () => {
  const category_id = categorySelect.value;
  const name = prodName.value.trim();
  const price = prodPrice.value;
  const image_url = prodImage.value.trim();
  const description = prodDesc.value.trim();

  if (!name || !price || !image_url) return alert("Please fill all fields!");

  const { error } = await supabase
    .from("products")
    .insert([{ category_id, name, price, image_url, description }]);

  if (error) console.log(error);
  else {
    alert("Product added!");
    prodName.value = prodPrice.value = prodImage.value = prodDesc.value = "";
  }
});
