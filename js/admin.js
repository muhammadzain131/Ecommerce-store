import { supabase } from "./supabase.js";

// --- protect page ---
checkSession();
async function checkSession() {
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    window.location.href = "./login.html";
  }
}

// --- logout ---
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "./login.html";
});


// --- DOM elements ---
const catName = document.getElementById("catName");
const addCatBtn = document.getElementById("addCatBtn");
const catSelect = document.getElementById("catSelect");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodImg = document.getElementById("prodImg");
const prodDesc = document.getElementById("prodDesc");
const addProdBtn = document.getElementById("addProdBtn");
const catList = document.getElementById("catList");
const prodList = document.getElementById("prodList");

// --- Load all categories ---
async function loadCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("id");
  
  if (error) console.error(error);
  catSelect.innerHTML = `<option value="">Select Category</option>`;
  catList.innerHTML = "";

  data.forEach(cat => {
    // dropdown
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    catSelect.appendChild(opt);

    // list
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${cat.name}</span>
      <button data-id="${cat.id}" class="del-cat">🗑 Delete</button>
    `;
    catList.appendChild(li);
  });
}

// --- Add category ---
addCatBtn.addEventListener("click", async () => {
  const name = catName.value.trim();
  if (!name) return alert("Enter category name");

  const { error } = await supabase.from("categories").insert([{ name }]);
  if (error) return alert(error.message);
  catName.value = "";
  loadCategories();
});

// --- Delete category ---
catList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("del-cat")) {
    const id = e.target.dataset.id;
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return alert(error.message);
    loadCategories();
    loadProducts();
  }
});

// --- Add product ---
addProdBtn.addEventListener("click", async () => {
  const category_id = catSelect.value;
  const name = prodName.value.trim();
  const price = +prodPrice.value;
  const image_url = prodImg.value.trim();
  const description = prodDesc.value.trim();

  if (!category_id || !name || !price || !image_url)
    return alert("Please fill all fields");

  const { error } = await supabase.from("products").insert([
    { category_id, name, price, image_url, description }
  ]);
  if (error) return alert(error.message);
  alert("Product added successfully!");
  prodName.value = prodPrice.value = prodImg.value = prodDesc.value = "";
  loadProducts();
});

// --- Load Products ---
async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  prodList.innerHTML = "";

  data.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card-ad");
    card.innerHTML = `
      <img src="${p.image_url}" alt="${p.name}">
      <div class="info">
        <h3>${p.name}</h3>
        <p>${p.description || "No description"}</p>
        <p><strong>Price:</strong> ${p.price} PKR</p>
        <p><strong>Category:</strong> ${p.categories?.name || "N/A"}</p>
      </div>
      <button data-id="${p.id}" class="del-prod">🗑 Delete</button>
    `;
    prodList.appendChild(card);
  });
}

// --- Delete Product ---
prodList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("del-prod")) {
    const id = e.target.dataset.id;
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return alert(error.message);
    loadProducts();
  }
});

// --- Initial Load ---
loadCategories();
loadProducts();

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, products(name)")
      .order("id", { ascending: false });

    if (error) return alert(error.message);
    const tbody = document.getElementById("ordersBody");
    tbody.innerHTML = "";
    data.forEach(o => {
      tbody.innerHTML += `
        <tr>
          <td>${o.id}</td>
          <td>${o.products.name}</td>
          <td>${o.user_name}</td>
          <td>${o.email}</td>
          <td>${o.phone}</td>
          <td>${o.address}</td>
          <td>${new Date(o.created_at).toLocaleString()}</td>
        </tr>`;
    });
  }
  loadOrders();