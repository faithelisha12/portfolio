/* =========================================
   1. INITIALISATION
========================================= */

document.documentElement.classList.add("js-enabled");


document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       2. MENU DE NAVIGATION
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navigationLinks = document.querySelectorAll(".nav-link");


    /**
     * Ouvre ou ferme le menu mobile.
     */
    function toggleMenu(forceClose = false) {

        if (!menuToggle || !navLinks) {
            return;
        }

        const shouldOpen =
            !forceClose && !navLinks.classList.contains("open");

        navLinks.classList.toggle("open", shouldOpen);

        menuToggle.classList.toggle("open", shouldOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(shouldOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            shouldOpen ? "Fermer le menu" : "Ouvrir le menu"
        );

    }


    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            toggleMenu();
        });


        /*
         * Ferme le menu lorsqu'un lien est sélectionné.
         * Le défilement est assuré par le navigateur
         * grâce à scroll-behavior: smooth dans le CSS.
         */

        navigationLinks.forEach((link) => {

            link.addEventListener("click", () => {
                toggleMenu(true);
            });

        });


        /*
         * Ferme le menu lorsque l'utilisateur appuie
         * sur la touche Échap.
         */

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {
                toggleMenu(true);
            }

        });


        /*
         * Ferme le menu si l'utilisateur passe
         * de l'affichage mobile à l'affichage ordinateur.
         */

        window.addEventListener("resize", () => {

            if (window.innerWidth > 760) {
                toggleMenu(true);
            }

        });

    }


    /* =========================================
       3. ANNÉE AUTOMATIQUE
    ========================================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =========================================
       4. APPARITION ANIMÉE DES ÉLÉMENTS
    ========================================= */

    const revealElements = document.querySelectorAll(".reveal");


    /*
     * Vérifie si le navigateur prend en charge
     * IntersectionObserver.
     */

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        /*
         * Solution de secours pour les navigateurs
         * qui ne prennent pas en charge
         * IntersectionObserver.
         */

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* =========================================
       5. LIEN ACTIF DANS LA NAVIGATION
    ========================================= */

    const sections = document.querySelectorAll(
        "main section[id]"
    );


    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {

                /*
                 * Parmi les sections visibles, on sélectionne
                 * celle qui est la plus présente à l'écran.
                 */

                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => {
                        return b.intersectionRatio - a.intersectionRatio;
                    });


                if (visibleEntries.length === 0) {
                    return;
                }


                const activeSectionId = visibleEntries[0].target.id;


                navigationLinks.forEach((link) => {

                    const isActive =
                        link.getAttribute("href") ===
                        `#${activeSectionId}`;

                    link.classList.toggle("active", isActive);

                });

            },
            {
                threshold: [0.15, 0.35, 0.55],
                rootMargin: "-15% 0px -50% 0px"
            }
        );


        sections.forEach((section) => {

            sectionObserver.observe(section);

        });

    }


    /* =========================================
       6. FERMETURE DU MENU AU CLIC EXTÉRIEUR
    ========================================= */

    document.addEventListener("click", (event) => {

        if (!menuToggle || !navLinks) {
            return;
        }

        const clickInsideMenu =
            navLinks.contains(event.target);

        const clickOnButton =
            menuToggle.contains(event.target);


        if (
            !clickInsideMenu &&
            !clickOnButton &&
            navLinks.classList.contains("open")
        ) {

            toggleMenu(true);

        }

    });

});