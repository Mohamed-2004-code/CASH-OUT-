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
     CONNEXION SUPABASE
  ================================= */

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();


    if (!email || !password) {

      showToast("Veuillez remplir tous les champs.");

      return;

    }


    try {

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });


      if (error) {

        console.error(error);

        showToast("Email ou mot de passe incorrect.");

        return;

      }


      const user = data.user;


      /* ==============================
         RÉCUPÉRER LE PROFIL
      ================================= */

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();


      if (profileError) {

        console.error(profileError);

        showToast(
          "Connexion réussie, mais profil introuvable."
        );

        return;

      }


      closeLogin();


      /* ==============================
         ADMINISTRATEUR
      ================================= */

      if (profile.role === "admin") {

        showToast(
          "Bienvenue Administrateur 👑"
        );

        setTimeout(() => {

          window.location.href = "admin.html";

        }, 1200);

        return;

      }


      /* ==============================
         CLIENT
      ================================= */

      showToast(
        `Bienvenue ${profile.full_name || "sur Cashout"} !`
      );

      setTimeout(() => {

        window.location.href = "client.html";

      }, 1200);


    } catch (error) {

      console.error(error);

      showToast(
        "Une erreur est survenue."
      );

    }

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

      navMenu.classList