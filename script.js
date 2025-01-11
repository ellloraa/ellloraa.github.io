document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach((link) => {
        link.onclick = (e) => {
            if (link.target === "_blank" || link.href.startsWith("http")) {
                return; // Allow default behavior for external links
            }

            e.preventDefault();

            const targetSelector = e.target.getAttribute("href");
            const target = document.querySelector(targetSelector);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            } else {
                console.warn(`No target found for selector: ${targetSelector}`);
            }
        };
    });
});
