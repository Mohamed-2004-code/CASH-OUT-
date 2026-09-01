/* ==============================
   CASHOUT
   JavaScript principal
================================= */

document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const startBtn = document.getElementById("startBtn");

  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");

  const loginForm = document.getElementById("loginForm");

  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");

  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");


  /* ==============================
     OUVRIR LA CONNEXION
  ================================= */

  function openLogin() {
    loginModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    setTimeout(() => {
      document.getElementById("email").focus();
    }, 100);
  }


  /* ==============================
     FERMER LA CONNEXION
  ================================= */

  function closeLogin() {
    loginModal.classList.add("hidden");

    document.body.style.overflow = "";
  }


  /* ==============================
     BOUTONS CONNEXION
  ================================= */

  loginBtn.addEventListener("click", openLogin);

  startBtn.addEventListener("click", openLogin);

  closeModal.addEventListener("click", closeLogin);


  /* ==============================
     FERMER EN CLIQUANT À L'EXTÉRIEUR
  ================================= */

  loginModal.addEventListener("click", (event) => {

    if (event.target === loginModal) {
      closeLogin();
    }

  });


  /* ==============================
     TOUCHE ESC
  ================================= */

  document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
      closeLogin();
    }

  });


  /* ==============================
     CONNEXION DE DÉMONSTRATION
  ================================= */

  loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      showToast("Veuillez remplir tous les champs.");
      return;
    }

    closeLogin();

    showToast(
      "Connexion enregistrée. Le système de comptes sera ajouté dans la prochaine étape."
    );

  });


  /* ==============================
     MENU MOBILE
  ================================= */

  menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("open");

  });


  /* Fermer le menu après un clic */

  navMenu.querySelectorAll("a").forEach((link) => {

    link.addEventListener("click", () => {

      navMenu.classList.remove("open");

    });

  });


  /* ==============================
     NOTIFICATION
  ================================= */

  let toastTimer;

  function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.remove("hidden");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

      toast.classList.add("hidden");

    }, 4000);

  }


  /* ==============================
     ANIMATION AU SCROLL
  ================================= */

  const animatedElements =
    document.querySelectorAll(
      ".feature-card, .about-card"
    );


  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.style.opacity = "1";

          entry.target.style.transform =
            "translateY(0)";

          observer.unobserve(entry.target);

        }

      });

    },
    {
      threshold: 0.12
    }
  );


  animatedElements.forEach((element) => {

    element.style.opacity = "0";

    element.style.transform =
      "translateY(25px)";

    element.style.transition =
      "opacity 0.7s ease, transform 0.7s ease";

    observer.observe(element);

  });

});
