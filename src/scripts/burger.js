document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".header__burger");
  const menu = document.getElementById("site-menu");

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    burger.classList.toggle("is-active", isOpen);

    if (isOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    if (menu) {
      menu.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          menu.classList.remove("is-open");
          document.body.classList.remove("no-scroll");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = this.getAttribute("href");
    window.location.href = "/coffee-house/index.html" + target;
  });
});
