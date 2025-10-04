// === Filtreleme İşlemleri ===
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            // Aktif butonu güncelle
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Filtreleme
            galleryItems.forEach(item => {
                if (filter === "all" || item.classList.contains(filter)) {
                    item.style.display = "block";
                    item.style.opacity = "1";
                } else {
                    item.style.display = "none";
                    item.style.opacity = "0";
                }
            });
        });
    });

    // === Satın Al Butonu İşlevi ===
    const buyButtons = document.querySelectorAll(".buy-btn");

    buyButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const productName = btn.getAttribute("data-product");
            const productPrice = btn.getAttribute("data-price");

            // Mail hazırlama
            const subject = encodeURIComponent(`Ürün Satın Alma Talebi: ${productName}`);
            const body = encodeURIComponent(
                `Merhaba,\n\n${productName} adlı ürünü satın almak istiyorum.\n\nÜrün Fiyatı: ${productPrice}\n\nTeşekkürler.`
            );

            // E-posta istemcisini aç
            window.location.href = `mailto:ornekmail@site.com?subject=${subject}&body=${body}`;
        });
    });
});