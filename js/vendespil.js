// Vendespil - standalone hardcoded version (restored)

const vendespilsbrikker = document.querySelector('#vendespilsbrikker');
if (!vendespilsbrikker) {
  console.warn('#vendespilsbrikker ikke fundet i DOM');
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function buildBrikker(arr) {
  if (!vendespilsbrikker) return;
  vendespilsbrikker.innerHTML = '';
  for (let i = 0; i < arr.length; i++) {
    vendespilsbrikker.innerHTML += `
  <div class="brik" data-id="${arr[i].id}">
    <div class="kort">
      <img src="../image/vendespilsbrik.png" alt="bagside" class="bagside">
      <img src="${arr[i].image}" alt="brik ${arr[i].id}" class="forside">
    </div>
  </div>
`;
  }
}

// Game state
let brikker = [];
let åben = [];
let låst = false;
const FLIP_MS = 600; // tid til flip-animation / delay ved tjek

// Load card definitions from fish.json (prefer `vendespilBrikker`, then `fish`, then `carousel`)
fetch('../data/fish.json')
  .then(res => {
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  })
  .then(data => {
      // Build from JSON source (vendespilBrikker preferred)
      const source = data.vendespilBrikker || data.fish || data.carousel || [];
    const generated = [];
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      const id = item.id || (i + 1);
      const image = item.image;
      generated.push({ id, image });
      generated.push({ id, image });
    }
    brikker = shuffle(generated);
    buildBrikker(brikker);
  })
  .catch(err => {
    console.warn('Kunne ikke indlæse data/fish.json — bruger fallback hardcoded sæt:', err);
    brikker = shuffle([
      { id: 1, image: '../image/kirurgfisk.png' },
      { id: 1, image: '../image/kirurgfisk.png' },
      { id: 2, image: '../image/guppyfisk.png' },
      { id: 2, image: '../image/guppyfisk.png' },
      { id: 3, image: '../image/klovnefisk.png' },
      { id: 3, image: '../image/klovnefisk.png' },
      { id: 4, image: '../image/rejefisk.png' },
      { id: 4, image: '../image/rejefisk.png' }
    ]);
    buildBrikker(brikker);
  });

// Enkel click-handler (en gang)
vendespilsbrikker && vendespilsbrikker.addEventListener('click', (e) => {
  const brik = e.target.closest('.brik');
  if (!brik || låst) return;
  if (brik.classList.contains('vendt') || brik.classList.contains('fundet')) return;

  brik.classList.add('vendt');
  åben.push(brik);

  if (åben.length === 2) {
    låst = true;
    const [a, b] = åben;
    const match = a.dataset.id === b.dataset.id;

    setTimeout(() => {
      if (match) {
        a.classList.add('fundet');
        b.classList.add('fundet');
      } else {
        a.classList.remove('vendt');
        b.classList.remove('vendt');
      }
      åben = [];
      låst = false;
    }, FLIP_MS);
  }
});

// Tilbage-knap funktion (bruges af HTML)
function tilbageButtonClick() {
  window.location.href = 'spil-med-os.html';
}

// Gør funktionen global så HTML onclick kan kalde den
window.tilbageButtonClick = tilbageButtonClick;