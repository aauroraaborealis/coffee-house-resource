function initSlider() {
  const coffeeSlider = document.getElementById("coffee-slider");
  if (!coffeeSlider) return;

  const slideData = [
    {
      img: "./src/assets/images/coffee-slider/frappuccino.png",
      title: "S’mores Frappuccino",
      desc: "This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.",
      price: "$5.50",
    },
    {
      img: "./src/assets/images/coffee-slider/macchiato.png",
      title: "Caramel Macchiato",
      desc: "Fragrant and unique classic espresso with rich caramel-peanut syrup, with the addition of delicate cream under whipped thick foam.",
      price: "$5.00",
    },
    {
      img: "./src/assets/images/coffee-slider/iced.png",
      title: "Iced Coffee",
      desc: "A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.",
      price: "$4.50",
    },
  ];

  const prevButton = coffeeSlider.querySelector(".slider__button:first-of-type");
  const nextButton = coffeeSlider.querySelector(".slider__button:last-of-type");
  const imageEl = coffeeSlider.querySelector(".slider__pic");
  const titleText = coffeeSlider.querySelector(".slider__title");
  const descText =
    coffeeSlider.querySelector(".slider__desc, .text__small-dark") ||
    coffeeSlider.querySelector(".text__small-dark");
  const priceText = coffeeSlider.querySelector(".slider__price");
  const dotButtons = Array.from(coffeeSlider.querySelectorAll(".slider__control"));

  let currentIndex = 0;

  function drawSlide(slideIndex) {
    const currentSlide = slideData[slideIndex];

    coffeeSlider.classList.add("is-fading");
    imageEl.src = currentSlide.img;
    imageEl.alt = currentSlide.title;
    titleText.textContent = currentSlide.title;
    descText.textContent = currentSlide.desc;
    priceText.textContent = currentSlide.price;

    dotButtons.forEach((dotBtn, dotIdx) => {
      dotBtn.classList.toggle("is-active", dotIdx === slideIndex);
      dotBtn.setAttribute("aria-current", dotIdx === slideIndex ? "true" : "false");
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => coffeeSlider.classList.remove("is-fading"));
    });
  }

  function changeSlide(toIndex) {
    currentIndex = (toIndex + slideData.length) % slideData.length;
    drawSlide(currentIndex);
  }

  prevButton.addEventListener("click", () => changeSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => changeSlide(currentIndex + 1));
  dotButtons.forEach((btn, idx) => btn.addEventListener("click", () => changeSlide(idx)));

  coffeeSlider.addEventListener("keydown", (evt) => {
    if (evt.key === "ArrowLeft") changeSlide(currentIndex - 1);
    if (evt.key === "ArrowRight") changeSlide(currentIndex + 1);
  });

  coffeeSlider.tabIndex = 0;

  drawSlide(currentIndex);
}

initSlider();
