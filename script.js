document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");

            // Skip external or blank links
            if (link.target === "_blank" || href.startsWith("http")) {
                return;
            }

            e.preventDefault();

            // Ensure the target selector is valid
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            } else {
                console.warn(`No target found for selector: ${href}`);
            }
        });
    });
});


// Lazy loading for gallery images
document.addEventListener("DOMContentLoaded", () => {
    const images = document.querySelectorAll(".gallery img");
    images.forEach((img) => {
        img.loading = "lazy";
    });
});

// Lightbox effect (basic example)
document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", (e) => {
        const modal = document.createElement("div");
        modal.className = "lightbox";
        modal.innerHTML = `<img src="${e.target.src}" alt="${e.target.alt}">`;
        modal.onclick = () => modal.remove();
        document.body.appendChild(modal);
    });
});
