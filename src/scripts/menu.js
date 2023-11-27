document.addEventListener("DOMContentLoaded", function () {
  var listElement = document.getElementById("menu-list");
  var tabButtons = document.querySelectorAll(".menu__tabs__btn");
  var menuData = { coffee: [], tea: [], dessert: [] };

  function formatMoney(number) {
    return "$" + Number(number).toFixed(2);
  }

  function loadMenuJson() {
    return fetch("../scripts/menu.json", { cache: "no-cache" })
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        menuData = json;
      })
      .catch(function (err) {
        console.warn("Не удалось загрузить menu.json. Будет пусто.", err);
      });
  }

  function createCardElement(item) {
    var li = document.createElement("li");
    li.className = "menu__card";

    var picture = document.createElement("picture");
    picture.className = "card__media";

    var img = document.createElement("img");
    img.src = item.img;
    img.alt = item.alt ? item.alt : item.title;
    img.loading = "lazy";
    img.decoding = "async";

    picture.appendChild(img);

    var body = document.createElement("div");
    body.className = "menu__card__body";

    var title = document.createElement("h3");
    title.className = "menu__card__title";
    title.textContent = item.title;

    var desc = document.createElement("p");
    desc.className = "menu__card__desc";
    desc.textContent = item.desc;

    var price = document.createElement("div");
    price.className = "menu__card__price";
    price.textContent = formatMoney(item.price);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(price);

    li.appendChild(picture);
    li.appendChild(body);

    return li;
  }

  function renderCategory(categoryName) {
    var items = menuData[categoryName] || [];

    listElement.innerHTML = "";

    for (var i = 0; i < items.length; i++) {
      var cardEl = createCardElement(items[i]);
      listElement.appendChild(cardEl);
    }
  }

  function setActiveTab(buttonEl) {
    var categoryName = buttonEl.getAttribute("data-tab");

    for (var i = 0; i < tabButtons.length; i++) {
      var isCurrent = tabButtons[i] === buttonEl;
      tabButtons[i].classList.toggle("is-active-menu", isCurrent);
      tabButtons[i].setAttribute("aria-selected", isCurrent ? "true" : "false");
    }

    renderCategory(categoryName);
  }

  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      setActiveTab(this);
    });
  }

  loadMenuJson().then(function () {
    var firstActive = document.querySelector(".tabs__btn.is-active-menu");

    if (!firstActive) firstActive = tabButtons[0];
    setActiveTab(firstActive);
  });
});
