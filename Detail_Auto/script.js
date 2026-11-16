
let cart = JSON.parse(localStorage.getItem("detailAutoCart")) || [];

function saveCart() {
    localStorage.setItem("detailAutoCart", JSON.stringify(cart));
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartCountText").textContent = count;

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Ваш кошик поки порожній.</p>';
        cartTotal.textContent = "0 грн";
        return;
    }

    let total = 0;

    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price * item.quantity;

        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <small>${item.price} грн × ${item.quantity}</small>
                </div>
                <div class="cart-item-controls">
                    <button onclick="changeQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${index})">×</button>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = total.toLocaleString("uk-UA") + " грн";
}

function addToCart(button) {
    const card = button.closest(".product-card");

    const name = card.querySelector("h3").textContent.trim();
    const priceText = card.querySelector(".product-bottom strong").textContent;
    const price = Number(priceText.replace(/[^\d]/g, ""));

    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    button.textContent = "Додано ✓";
    setTimeout(() => {
        button.textContent = "Купити";
    }, 900);
}

function changeQuantity(index, change) {
    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCart();
}

function openCart() {
    document.getElementById("cartOverlay").classList.add("open");
    updateCart();
}

function closeCart(event) {
    if (event && event.target !== document.getElementById("cartOverlay")) {
        return;
    }

    document.getElementById("cartOverlay").classList.remove("open");
}

function checkout() {
    if (cart.length === 0) {
        alert("Ваш кошик порожній!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    alert(
        "Дякуємо за замовлення!\n" +
        "Сума: " + total.toLocaleString("uk-UA") + " грн\n\n" +
        "Це демонстраційне оформлення замовлення."
    );
}

const searchInput = document.getElementById("searchInput");
const brandFilter = document.getElementById("brandFilter");
const productCards = document.querySelectorAll(".product-card");

let categoryFilter = "";

function filterProducts() {
    const search = searchInput.value.toLowerCase().trim();
    const brand = brandFilter.value;

    let visible = 0;

    productCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardBrand = card.dataset.brand;

        const matchesSearch = text.includes(search);
        const matchesBrand = brand === "all" || cardBrand === brand;
        const matchesCategory = !categoryFilter || text.includes(categoryFilter);

        const show = matchesSearch && matchesBrand && matchesCategory;

        card.style.display = show ? "" : "none";

        if (show) visible++;
    });

    document.getElementById("noResults").style.display =
        visible === 0 ? "block" : "none";
}

function filterCategory(category) {
    categoryFilter = category;
    brandFilter.value = "all";
    searchInput.value = "";
    filterProducts();
}

searchInput.addEventListener("input", filterProducts);
brandFilter.addEventListener("change", filterProducts);

document.querySelectorAll(".product-photo img").forEach(img => {
    img.addEventListener("error", function() {
        this.style.display = "none";
        this.parentElement.classList.add("no-photo");
    });
});

updateCart();
