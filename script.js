/* ==============================
   CASHOUT
   JavaScript principal
================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ==============================
     ÉLÉMENTS HTML
  ================================= */

  const loginBtn = document.getElementById("loginBtn");
  const startBtn = document.getElementById("startBtn");

  const loginModal = document.getElementById("loginModal");
  const closeModal = document.getElementById("closeModal");

  const loginForm = document.getElementById("loginForm");
  const submitLogin = document.getElementById("submitLogin");

  const menuBtn = document.getElementById("menuBtn");
  const navMenu = document.getElementById("navMenu");

  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");


  /* ==============================
     SUPABASE
  ================================= */

  const supabaseClient = window.cashoutSupabase;

  if (!supabaseClient) {
    console.error(
      "Supabase n'est pas correctement configuré."
    );
  }


  /* ==============================
     OUVRIR LA CONNEXION
  ================================= */

  function openLogin() {

    if (!loginModal) return;

    loginModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

    setTimeout(() => {

      const emailInput =
        document.getElementById("email");

      if (emailInput) {
        emailInput.focus();
      }

    }, 100);

  }


  /* ==============================
     FERMER LA CONNEXION
  ================================= */

  function closeLogin() {

    if (!loginModal) return;

    loginModal.classList.add("hidden");

    document.body.style.overflow = "";

  }


  /* ==============================
     BOUTONS CONNEXION
  ================================= */

  if (loginBtn) {
    loginBtn.addEventListener(
      "click",
      openLogin
    );
  }

  if (startBtn) {
    startBtn.addEventListener(
      "click",
      openLogin
    );
  }

  if (closeModal) {
    closeModal.addEventListener(
      "click",
      closeLogin
    );
  }


  /* ==============================
     CLIQUER EN DEHORS DU MODAL
  ================================= */

  if (loginModal) {

    loginModal.addEventListener(
      "click",
      (event) => {

        if (event.target === loginModal) {
          closeLogin();
        }

      }
    );

  }


  /* ==============================
     TOUCHE ESC
  ================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Escape") {
        closeLogin();
      }

    }
  );


  /* ==============================
     CONNEXION SUPABASE
  ================================= */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        /* Vérifier Supabase */

        if (!supabaseClient) {

          showToast(
            "Supabase n'est pas configuré."
          );

          return;

        }


        /* Récupérer les champs */

        const emailInput =
          document.getElementById("email");

        const passwordInput =
          document.getElementById("password");


        if (!emailInput || !passwordInput) {

          showToast(
            "Champs de connexion introuvables."
          );

          return;

        }


        const email =
          emailInput.value.trim();

        const password =
          passwordInput.value;


        /* Vérifier les champs */

        if (!email || !password) {

          showToast(
            "Veuillez remplir tous les champs."
          );

          return;

        }


        /* Désactiver le bouton */

        if (submitLogin) {

          submitLogin.disabled = true;

          submitLogin.textContent =
            "Connexion...";

        }


        try {

          console.log(
            "Tentative de connexion..."
          );


          /* ==============================
             CONNEXION SUPABASE AUTH
          ================================= */

          const {
            data,
            error
          } =
            await supabaseClient.auth
              .signInWithPassword({

                email: email,

                password: password

              });


          /* Erreur de connexion */

          if (error) {

            console.error(
              "Erreur Supabase :",
              error
            );

            showToast(
              "Connexion impossible : " +
              error.message
            );

            return;

          }


          /* Vérifier utilisateur */

          if (!data || !data.user) {

            showToast(
              "Utilisateur introuvable."
            );

            return;

          }


          const user =
            data.user;


          console.log(
            "Utilisateur connecté :",
            user.id
          );


          /* ==============================
             RÉCUPÉRER LE PROFIL
          ================================= */

          const {
            data: profile,
            error: profileError
          } =
            await supabaseClient
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();


          /* ==============================
             ERREUR PROFIL
          ================================= */

          if (profileError) {

            console.error(
              "Erreur profil :",
              profileError
            );

            showToast(
              "Connexion réussie, mais profil introuvable."
            );

            return;

          }


          /* Fermer le modal */

          closeLogin();


          /* ==============================
             ADMINISTRATEUR
          ================================= */

          if (profile.role === "admin") {

            showToast(
              "Bienvenue Administrateur 👑"
            );

            setTimeout(() => {

              window.location.href =
                "admin.html";

            }, 1200);

            return;

          }


          /* ==============================
             CLIENT
          ================================= */

          const fullName =
            profile.full_name ||
            "sur Cashout";


          showToast(
            `Bienvenue ${fullName} !`
          );


          setTimeout(() => {

            window.location.href =
              "client.html";

          }, 1200);

        }


        /* ==============================
           ERREUR GÉNÉRALE
        ================================= */

        catch (error) {

          console.error(
            "ERREUR CASHOUT :",
            error
          );

          showToast(
            "Erreur : " +
            (
              error.message ||
              "problème de connexion"
            )
          );

        }


        /* ==============================
           RÉACTIVER LE BOUTON
        ================================= */

        finally {

          if (submitLogin) {

            submitLogin.disabled = false;

            submitLogin.textContent =
              "Se connecter →";

          }

        }

      }
    );

  }


  /* ==============================
     MENU MOBILE
  ================================= */

  if (menuBtn && navMenu) {

    menuBtn.addEventListener(
      "click",
      () => {

        navMenu.classList.toggle(
          "open"
        );

      }
    );


    /* Fermer le menu après clic */

    navMenu
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          () => {

            navMenu.classList.remove(
              "open"
            );

          }
        );

      });


    /* Fermer le menu après clic
       sur Se connecter */

    if (loginBtn) {

      loginBtn.addEventListener(
        "click",
        () => {

          navMenu.classList.remove(
            "open"
          );

        }
      );

    }

  }


  /* ==============================
     NOTIFICATION TOAST
  ================================= */

  let toastTimer;


  function showToast(message) {

    if (!toast || !toastMessage) {

      console.log(message);

      return;

    }


    toastMessage.textContent =
      message;


    toast.classList.remove(
      "hidden"
    );


    clearTimeout(toastTimer);


    toastTimer =
      setTimeout(() => {

        toast.classList.add(
          "hidden"
        );

      }, 4000);

  }


  /* ==============================
     ANIMATION AU SCROLL
  ================================= */

  const animatedElements =
    document.querySelectorAll(
      ".feature-card, .about-card"
    );


  if (
    "IntersectionObserver"
    in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.style.opacity =
                  "1";

                entry.target.style.transform =
                  "translateY(0)";


                observer.unobserve(
                  entry.target
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    animatedElements.forEach(
      (element) => {

        element.style.opacity =
          "0";

        element.style.transform =
          "translateY(25px)";

        element.style.transition =
          "opacity 0.7s ease, transform 0.7s ease";


        observer.observe(
          element
        );

      }
    );

  }

});