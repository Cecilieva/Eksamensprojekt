const bubble = document.getElementById("bubble");
const text = "Hej med dig! Er du klar til at bygge dit eget akvarie? Så lad os komme i gang!";
let index = 0;

// Skriv tekst som skrivemaskine
function typeText() {
  if (index < text.length) {
    bubble.textContent += text.charAt(index);
    index++;
    setTimeout(typeText, 60); // hastighed på skrivningen
  } else {
    speakText();
  }
}

// Læs teksten højt (browser tale)
function speakText() {
  if ('speechSynthesis' in window) {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'da-DK';
    utter.pitch = 1;
    utter.rate = 1;
    speechSynthesis.speak(utter);
  }
}

// Start når siden er klar
window.onload = () => {
  typeText();
};
