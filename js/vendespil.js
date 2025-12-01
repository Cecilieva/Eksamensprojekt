let brikker = [
  {id: 1, image: "../image/kirurgfisk.png"},
  {id: 1, image: "../image/kirurgfisk.png"},
  {id: 2, image: "../image/guppyfisk.png"},
  {id: 2, image: "../image/guppyfisk.png"},
  {id: 3, image: "../image/klovnefisk.png"},
  {id: 3, image: "../image/klovnefisk.png"},
  {id: 4, image: "../image/rejefisk.png"},
  {id: 4, image: "../image/rejefisk.png"}
];

const vendespilsbrikker = document.querySelector("#vendespilsbrikker");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

brikker = shuffle(brikker);

// Byg brikkerne: gem id og image som data-attributter
vendespilsbrikker.innerHTML = "";
for (let i = 0; i < brikker.length; i++) {
  vendespilsbrikker.innerHTML += `
  <div class="brik" data-id="${brikker[i].id}">
    <div class="kort">
      <img src="../image/vendespilsbrik.png" alt="bagside" class="bagside">
      <img src="${brikker[i].image}" alt="brik ${brikker[i].id}" class="forside">
    </div>
  </div>
`;

}

// Klik: vend brikker og tjek for match (2 ad gangen)
let åben = [];     // holder de åbne brikker (DOM-elementer)
let låst = false;  // lås input mens vi tjekker

const FLIP_MS = 500; // matcher CSS transition

vendespilsbrikker.addEventListener("click", (e) => {
  const brik = e.target.closest(".brik");
  if (!brik || låst) return;
  if (brik.classList.contains("vendt") || brik.classList.contains("fundet")) return;

  brik.classList.add("vendt");
  åben.push(brik);

  if (åben.length === 2) {
    låst = true;
    const [a, b] = åben;
    const match = a.dataset.id === b.dataset.id;

    setTimeout(() => {
      if (match) {
        a.classList.add("fundet");
        b.classList.add("fundet");
      } else {
        a.classList.remove("vendt");
        b.classList.remove("vendt");
      }
      åben = [];
      låst = false;
    }, FLIP_MS); // vent til flip er færdig
  }
});


// Funktion til tilbage-knappen
function tilbageButtonClick() {
    // Går tilbage til spil-med-os.html
    window.location.href = 'spil-med-os.html'; 
}
