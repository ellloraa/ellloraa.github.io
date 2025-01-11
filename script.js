document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll("nav ul li a");

    navLinks.forEach((link) => {
        link.onclick = (e) => {
            // Exclude links that point to external resources
            if (link.target === "_blank" || link.href.startsWith("http")) {
                return; // Allow default behavior for external links
            }

            // Smooth scrolling for internal links
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute("href"));
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            }
        };
    });
});
