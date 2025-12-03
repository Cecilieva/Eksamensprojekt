"use strict";

const pinkButton = document.querySelector(".pink-paint");
const pinkFisk = document.querySelector(".pink-fisk");
const blueButton = document.querySelector(".blue-paint");
const pinkOgBlaaFisk = document.querySelector(".pink-og-blaa-fisk");
const darkPinkButton = document.querySelector(".dark-pink-paint");
const doneFisk = document.querySelector(".done-fisk");
const arrowButton = document.querySelector(".arrow");
const tilbageButton = document.querySelector(".tilbage-pil");


if (tilbageButton) {
  tilbageButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });
}


//Når man trykker på det på fisken der skal være pink farvet. også har jeg lavet sådan at man kan klikke den fra igen. (det er ikke en toggle, fordi jeg kunne ikke få den til at virke når jeg skulle bruge min function)
pinkButton.addEventListener("click", () => {
  if (pinkFisk.style.display === "block") {
    pinkFisk.style.display = "none";
  } else {
    pinkFisk.style.display = "block";
    checkAllButtonsClicked();
  }
});

//Samme som farven ovenover
blueButton.addEventListener("click", () => {
  if (pinkOgBlaaFisk.style.display === "block") {
    pinkOgBlaaFisk.style.display = "none";
  } else {
    pinkOgBlaaFisk.style.display = "block";
    checkAllButtonsClicked();
  }
});

//Samme som farven ovenover
darkPinkButton.addEventListener("click", () => {
  if (doneFisk.style.display === "block") {
    doneFisk.style.display = "none";
    arrowButton.style.display = "none";
  } else {
    doneFisk.style.display = "block";
    checkAllButtonsClicked();
  }
});

//jeg laver en funktion som tjekker at mine 3 "paint knapper" er tjekket af før min arrow knap bliver vist. For det er først når alle 3 er aftrykket at fisken er færdig farvet.
function checkAllButtonsClicked() {
  const allVisible =
    pinkFisk.style.display === "block" &&
    pinkOgBlaaFisk.style.display === "block" &&
    doneFisk.style.display === "block";

  if (allVisible) {
    arrowButton.style.display = "block";
  } else {
    arrowButton.style.display = "none";
  }
}

// hvis man klikker på arrowknappen, svømmer den færdig farvet fisk væk, og så fjernes arrowknappen også, så man kan starte forfra.
arrowButton.addEventListener("click", () => {
  arrowButton.style.display = "none";
  const visibleFisk = document.querySelectorAll(".fisk");
  visibleFisk.forEach((fisk) => {
    if (fisk.style.display === "block") {
      fisk.classList.add("move-right");
      fisk.addEventListener("animationend", () => {
        fisk.style.display = "none";
        fisk.classList.remove("move-right");
      });
    }
  });
});

//her ville jeg have gjort sådan der kom en ny fisk ind og nye farver så man kan prøve flere forskellige.
