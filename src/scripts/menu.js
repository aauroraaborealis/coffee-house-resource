document.addEventListener("DOMContentLoaded", function () {
  let listElement = document.getElementById("menu-list");
  let tabButtons = document.querySelectorAll(".menu__tabs__btn");
  let menuData = { defaults: {}, coffee: [], tea: [], dessert: [] };

  let modal = document.getElementById("item-modal");
  let dlg = modal ? modal.querySelector(".modal__dialog") : null;
  let mImg = document.getElementById("modal-img");
  let mTitle = document.getElementById("modal-title");
  let mDesc = document.getElementById("modal-desc");
  let mSizes = document.getElementById("modal-sizes");
  let mAdds = document.getElementById("modal-adds");
  let mTotal = document.getElementById("modal-total");

  function money(n) {
    return "$" + Number(n).toFixed(2);
  }
  function formatMoney(number) {
    return "$" + Number(number).toFixed(2);
  }
  function lockScroll(lock) {
    document.documentElement.style.overflow = lock ? "hidden" : "";
  }

  function loadMenuJson() {
    return fetch("../scripts/menu.json", { cache: "no-cache" })
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        menuData = json;
      })
      .catch(function (err) {
        console.warn("Не удалось загрузить menu.json. Будет пусто.", err);
      });
  }

  function getDefaultsFor(category) {
    let baseDrink = {
      unit: "ml",
      sizes: [
        { code: "S", label: "200 ml", factor: 1.0 },
        { code: "M", label: "300 ml", factor: 1.15 },
        { code: "L", label: "400 ml", factor: 1.3 },
      ],
      adds: [
        { id: 1, name: "Sugar", plus: 1.0 },
        { id: 2, name: "Cinnamon", plus: 2.0 },
        { id: 3, name: "Syrup", plus: 3.0 },
      ],
    };
    let baseDessert = {
      unit: "g",
      sizes: [
        { code: "S", label: "50 g", factor: 1.0 },
        { code: "M", label: "100 g", factor: 1.4 },
        { code: "L", label: "200 g", factor: 2.4 },
      ],
      adds: [
        { id: 1, name: "Berries", plus: 1.0 },
        { id: 2, name: "Nuts", plus: 2.0 },
        { id: 3, name: "Jam", plus: 3.0 },
      ],
    };

    let d = (menuData.defaults && menuData.defaults[category]) || null;
    if (d) return d;
    if (category === "dessert") return baseDessert;
    return baseDrink;
  }

  function pickSizesAndAdds(item, category) {
    let d = getDefaultsFor(category);
    return {
      sizes: item.sizes && item.sizes.length ? item.sizes : d.sizes,
      adds: item.adds && item.adds.length ? item.adds : d.adds,
    };
  }

  function openModal(category, item) {
    if (!modal) return;

    mImg.src = item.img;
    mImg.alt = item.title;
    mTitle.textContent = item.title;
    mDesc.textContent = item.desc;

    let picked = pickSizesAndAdds(item, category);
    let sizes = picked.sizes;
    let adds = picked.adds;

    mSizes.innerHTML = "";
    sizes.forEach(function (s, idx) {
      let b = document.createElement("button");
      b.type = "button";
      b.className = "chip" + (idx === 0 ? " is-active" : "");

      let span = document.createElement("span");
      span.className = "chip__size";
      span.textContent = s.code;

      b.appendChild(span);
      b.append(" " + s.label);
      b.dataset.factor = s.factor;

      mSizes.appendChild(b);
    });

    mAdds.innerHTML = "";
    adds.forEach(function (a) {
      let b = document.createElement("button");
      b.type = "button";
      b.className = "chip";

      let span = document.createElement("span");
      span.className = "chip__size";
      span.textContent = a.id;

      b.appendChild(span);
      b.append(" " + a.name);
      b.dataset.plus = a.plus || 0;

      mAdds.appendChild(b);
    });

    function recalc() {
      let base = Number(item.price);
      let activeSize = mSizes.querySelector(".is-active");
      let factor = activeSize ? Number(activeSize.dataset.factor) : 1;
      let addSum = 0;
      Array.prototype.forEach.call(
        mAdds.querySelectorAll(".is-active"),
        function (el) {
          addSum += Number(el.dataset.plus || 0);
        }
      );
      mTotal.textContent = money(base * factor + addSum);
    }

    function onSizeClick(e) {
      let b = e.target.closest("button");
      if (!b) return;
      Array.prototype.forEach.call(mSizes.children, function (x) {
        x.classList.remove("is-active");
      });
      b.classList.add("is-active");
      recalc();
    }
    function onAddClick(e) {
      let b = e.target.closest("button");
      if (!b) return;
      b.classList.toggle("is-active");
      recalc();
    }

    mSizes.addEventListener("click", onSizeClick);
    mAdds.addEventListener("click", onAddClick);

    recalc();

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    dlg && dlg.focus();

    function onBackdrop(e) {
      if (e.target.dataset.close) closeModal();
    }
    function onEsc(e) {
      if (e.key === "Escape") closeModal();
    }

    modal.addEventListener("click", onBackdrop);
    document.addEventListener("keydown", onEsc);

    function closeModal() {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      lockScroll(false);
      modal.removeEventListener("click", onBackdrop);
      document.removeEventListener("keydown", onEsc);
      mSizes.removeEventListener("click", onSizeClick);
      mAdds.removeEventListener("click", onAddClick);
    }
  }

  function createCardElement(item, categoryName) {
    let li = document.createElement("li");
    li.className = "menu__card";
    li.setAttribute("data-cat", categoryName);
    li.setAttribute("data-id", item.id);
    li.tabIndex = 0;

    let picture = document.createElement("picture");
    picture.className = "card__media";

    let img = document.createElement("img");
    img.src = item.img;
    img.alt = item.alt ? item.alt : item.title;
    img.loading = "lazy";
    img.decoding = "async";

    picture.appendChild(img);

    let body = document.createElement("div");
    body.className = "menu__card__body";

    let title = document.createElement("h3");
    title.className = "menu__card__title";
    title.textContent = item.title;

    let desc = document.createElement("p");
    desc.className = "menu__card__desc";
    desc.textContent = item.desc;

    let price = document.createElement("div");
    price.className = "menu__card__price";
    price.textContent = formatMoney(item.price);

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(price);

    li.appendChild(picture);
    li.appendChild(body);

    function open() {
      openModal(categoryName, item);
    }
    li.addEventListener("click", open);
    li.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    return li;
  }

  function renderCategory(categoryName) {
    let items = menuData[categoryName] || [];
    listElement.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
      let cardEl = createCardElement(items[i], categoryName);
      listElement.appendChild(cardEl);
    }
  }

  function setActiveTab(buttonEl) {
    let categoryName = buttonEl.getAttribute("data-tab");

    for (let i = 0; i < tabButtons.length; i++) {
      let isCurrent = tabButtons[i] === buttonEl;
      tabButtons[i].classList.toggle("is-active-menu", isCurrent);
      tabButtons[i].setAttribute("aria-selected", isCurrent ? "true" : "false");
    }

    renderCategory(categoryName);
  }

  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
      setActiveTab(this);
    });
  }

  loadMenuJson().then(function () {
    let firstActive = document.querySelector(".menu__tabs__btn.is-active-menu");
    if (!firstActive) firstActive = tabButtons[0];
    setActiveTab(firstActive);
  });
});
