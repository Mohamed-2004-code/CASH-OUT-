/* ==============================
   CASHOUT
   JavaScript principal
================================= */

document.addEventListener("DOMContentLoaded", () => {


  /* ==============================
     SUPABASE
  ================================= */

  const supabaseClient =
    window.cashoutSupabase;


  if (!supabaseClient) {

    console.error(
      "Supabase n'a pas été initialisé."
    );

    alert(
      "Erreur : Supabase n'est pas chargé."
    );

    return;

  }


  /* ==============================
     ELEMENTS
  ================================= */

  const loginBtn =
    document.getElementById("loginBtn");

  const startBtn =
    document.getElementById("startBtn");

  const loginModal =
    document.getElementById("loginModal");

  const closeModal =
    document.getElementById("closeModal");

  const loginForm =
    document.getElementById("loginForm");

  const submitLogin =
    document.getElementById("submitLogin");

  const menuBtn =
    document.getElementById("menuBtn");

  const navMenu =
    document.getElementById("navMenu");

  const toast =
    document.getElementById("toast");

  const toastMessage =
    document.getElementById("toastMessage");


  /* ==============================
     OUVRIR CONNEXION
  ================================= */

  function openLogin() {

    loginModal.classList.remove("hidden");

    document.body.style.overflow =
      "hidden";

    setTimeout(() => {

      const emailInput =
        document.getElementById("email");

      if (emailInput) {
        emailInput.focus();
      }

    }, 100);

  }


  /* ==============================
     FERMER CONNEXION
  ================================= */

  function closeLogin() {

    loginModal.classList.add("hidden");

    document.body.style.overflow =
      "";

  }


  /* ==============================
     BOUTONS
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
     CLIC EXTÉRIEUR
  ================================= */

  if (loginModal) {

    loginModal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === loginModal
        ) {

          closeLogin();

        }

      }
    );

  }


  /* ==============================
     ESC
  ================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

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


        const email =
          document
            .getElementById("email")
            .value
            .trim();


        const password =
          document
            .getElementById("password")
            .value;


        if (!email || !password) {

          showToast(
            "Veuillez remplir tous les champs."
          );

          return;

        }


        /* Désactiver le bouton */

        submitLogin.disabled =
          true;

        submitLogin.textContent =
          "Connexion...";


        try {

          console.log(
            "Tentative de connexion :",
            email
          );


          const result =
            await supabaseClient.auth
              .signInWithPassword({

                email: email,

                password: password

              });


          const data =
            result.data;

          const error =
            result.error;


          /* ==============================
             ERREUR SUPABASE
          ================================= */

          if (error) {

            console.error(
              "Erreur Supabase :",
              error
            );


            if (
              error.message
                .toLowerCase()
                .includes(
                  "invalid login credentials"
                )
            ) {

              showToast(
                "Email ou mot de passe incorrect."
              );

            } else {

              showToast(
                "Erreur : " +
                error.message
              );

            }


            return;

          }


          /* ==============================
             UTILISATEUR
          ================================= */

          const user =
            data.user;


          if (!user) {

            showToast(
              "Utilisateur introuvable."
            );

            return;

          }


          console.log(
            "Connexion réussie :",
            user
          );


          /* ==============================
             PROFIL
          ================================= */

          const profileResult =
            await supabaseClient
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();


          const profile =
            profileResult.data;

          const profileError =
            profileResult.error;


          /* ==============================
             ERREUR PROFIL
          ================================= */

          if (profileError) {

            console.error(
              "Erreur profil :",
              profileError
            );


            showToast(
              "Connexion réussie, mais impossible de récupérer le profil."
            );


            setTimeout(() => {

              window.location.href =
                "client.html";

            }, 1500);


            return;

          }


          /* ==============================
             PROFIL ABSENT
          ================================= */

          if (!profile) {

            console.warn(
              "Aucun profil trouvé."
            );


            showToast(
              "Connexion réussie !"
            );


            setTimeout(() => {

              window.location.href =
                "client.html";

            }, 1200);


            return;

          }


          /* ==============================
             FERMER
          ================================= */

          closeLogin();


          /* ==============================
             ADMIN
          ================================= */

          if (
            profile.role === "admin"
          ) {

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

          showToast(
            `Bienvenue ${
              profile.full_name ||
              "sur Cashout"
            } !`
          );


          setTimeout(() => {

            window.location.href =
              "client.html";

          }, 1200);

        }


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


        finally {

          submitLogin.disabled =
            false;

          submitLogin.textContent =
            "Se connecter →";

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

  }


  /* ==============================
     NOTIFICATION
  ================================= */

  let toastTimer;


  function showToast(message) {

    if (
      !toast ||
      !toastMessage
    ) {

      return;

    }


    toastMessage.textContent =
      message;


    toast.classList.remove(
      "hidden"
    );


    clearTimeout(
      toastTimer
    );


    toastTimer =
      setTimeout(() => {

        toast.classList.add(
          "hidden"
        );

      }, 4000);

  }


  /* ==============================
     ANIMATION
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