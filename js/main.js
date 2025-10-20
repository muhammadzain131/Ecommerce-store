import { supabase } from "./supabase.js";

const categoryList = document.getElementById("categoryList");
const productList = document.getElementById("productList");

// Load all categories
async function loadCategories() {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) return console.log(error);

  categoryList.innerHTML = data
    .map(
      cat =>
        `<button class="cat-btn" data-id="${cat.id}">${cat.name}</button>`
    )
    .join("");

  // Load products of first category by default
  if (data.length) loadProducts(data[0].id);
}
loadCategories();

// Click event to show products
categoryList.addEventListener("click", e => {
  if (e.target.classList.contains("cat-btn")) {
    const id = e.target.dataset.id;
    loadProducts(id);
  }
});

// Load products
async function loadProducts(catId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", catId);

  if (error) return console.log(error);

  productList.innerHTML = data
    .map(
      p => `
      <div class="product-card">
        <img src="${p.image_url}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
        <span>Rs. ${p.price}</span>
      </div>`
    )
    .join("");
}
