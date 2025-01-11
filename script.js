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


document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const src = item.querySelector("img").src;
            const alt = item.querySelector("img").alt;

            const lightbox = document.createElement("div");
            lightbox.className = "lightbox";
            lightbox.innerHTML = `
                <img src="${src}" alt="${alt}">
                <p>${alt}</p>
            `;

            lightbox.addEventListener("click", () => {
                lightbox.remove();
            });

            document.body.appendChild(lightbox);
        });
    });
});
