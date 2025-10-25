
import { supabase } from "./supabase.js";

const categoryList = document.getElementById("categoryList");
const productList = document.getElementById("productList");

// 🔹 Load all categories
async function loadCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
  if (error) return console.error("Error loading categories:", error.message);

  if (!data || !data.length) {
    categoryList.innerHTML = "<p>No categories found.</p>";
    return;
  }

  // Generate category buttons
  categoryList.innerHTML = data
    .map(cat => `<button class="cat-btn" data-id="${cat.id}">${cat.name}</button>`)
    .join("");

  // Load first category products by default
  loadProducts(data[0].id);
}

// 🔹 Handle category button click
categoryList.addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (btn) {
    const id = btn.dataset.id;
    if (id) loadProducts(id);
  }
});

// 🔹 Load products for a given category
async function loadProducts(catId) {
  if (!catId) return console.warn("No category ID provided");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", catId)
    .order("id", { ascending: true });

  if (error) return console.error("Error loading products:", error.message);

  if (!data.length) {
    productList.innerHTML = `<p style="text-align:center;color:#777;">No products found in this category.</p>`;
    return;
  }

  // Display products
  productList.innerHTML = data
    .map(
      p => `
      <div class="product-card">
        <div class="img-wrap">
          <img src="${p.image_url}" alt="${p.name}">
        </div>
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.description || ""}</p>
          <span class="price">Rs. ${p.price}</span>
          <button class="view-detail" data-id="${p.id}">View Details</button>
        </div>
      </div>
      `
    )
    .join("");
}

// 🔹 Handle View Details click
document.addEventListener("click", e => {
  const btn = e.target.closest(".view-detail");
  if (btn) {
    const id = btn.dataset.id;
    if (id) {
      window.location.href = `product.html?id=${id}`;
    } else {
      alert("Product ID missing!");
    }
  }
});

// 🔹 Initial load
loadCategories();
