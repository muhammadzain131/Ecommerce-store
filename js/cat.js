import { supabase } from "./supabase.js";

const categoryBar = document.getElementById("categoryBar");
const productGrid = document.getElementById("productGrid");

let activeCategoryId = null;

// ✅ Load Categories
async function loadCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("id");
  if (error) return console.error(error);

  categoryBar.innerHTML = data
    .map(
      cat => `
      <button class="cat-btn" data-id="${cat.id}">${cat.name}</button>
    `
    )
    .join("");

  // Default: show first category products
  if (data.length) {
    setActiveCategory(data[0].id);
    loadProducts(data[0].id);
  }
}

// ✅ Load Products for a category
async function loadProducts(catId) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", catId);

  if (error) return console.error(error);

  if (!data.length) {
    productGrid.innerHTML = `<p style="text-align:center;color:#777;">No products in this category.</p>`;
    return;
  }

  productGrid.innerHTML = data
    .map(
      p => `
      <div class="product-card" data-id="${p.id}">
        <img src="${p.image_url}" alt="${p.name}">
        <div class="info">
          <h3>${p.name}</h3>
          <p>${p.description || ""}</p>
          <span class="price">Rs. ${p.price}</span>
        </div>
      </div>
    `
    )
    .join("");
}

// ✅ Handle Category Button Click
categoryBar.addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id || id === activeCategoryId) return;

  setActiveCategory(id);
  loadProducts(id);
});

// ✅ Active Button Styling
function setActiveCategory(id) {
  activeCategoryId = id;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === id);
  });
}

// ✅ Product Detail Click
productGrid.addEventListener("click", e => {
  const card = e.target.closest(".product-card");
  if (card) {
    const id = card.dataset.id;
    window.location.href = `product.html?id=${id}`;
  }
});

// ✅ Initial Load
loadCategories();
