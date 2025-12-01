// Filter / Byg-akvarie script
document.addEventListener('DOMContentLoaded', async () => {
  const filtersEl = document.getElementById('filters');
  const paletteEl = document.getElementById('palette');
  const aquariumEl = document.getElementById('aquarium');
  const aquariumSwimEl = document.getElementById('aquarium-swim');
  const STORAGE_KEY = 'bygSelectedFish';
  const btnShowAll = document.getElementById('btn-show-all');
  const btnSave = document.getElementById('btn-save');
  const btnClear = document.getElementById('btn-clear');

  let data;
  try {
    const res = await fetch('../data/fish.json');
    data = await res.json();
  } catch (e) {
    console.error('Kunne ikke indlæse data/fish.json', e);
    data = { carousel: [], vendespilBrikker: [] };
  }

  // Build items list: prefer `carousel` entries (have type), include vendespilBrikker as generic items
  const carousel = Array.isArray(data.carousel) ? data.carousel : [];
  const vendespil = Array.isArray(data.vendespilBrikker) ? data.vendespilBrikker : [];

  // Helper: udtræk navn fra billedsti (fx '../image/kirurgfisk.png' -> 'Kirurgfisk')
  function nameFromImage(path) {
    try {
      const parts = path.split('/');
      const file = parts[parts.length - 1] || path;
      const name = file.replace(/\.[^.]+$/, '');
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch (e) { return 'Fisk'; }
  }

  // Normalize items: ensure {type, image, id, label}
  const items = [];
  carousel.forEach((c, i) => items.push({ id: c.type || ('c' + i), type: c.type || nameFromImage(c.image), image: c.image, label: nameFromImage(c.image) }));
  vendespil.forEach((v, i) => {
    const inferred = nameFromImage(v.image || '');
    const type = v.type || inferred || 'Fisk';
    const id = v.id ? 'v' + v.id + '-' + i : 'v' + i;
    items.push({ id, type, image: v.image, label: inferred });
  });

  // Unique types
  const types = [...new Set(items.map(it => it.type || 'other'))];

  // Render filter chips
  types.forEach(type => {
    const label = document.createElement('label');
    label.className = 'filter-chip';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.value = type;
    chk.checked = true;
    chk.addEventListener('change', renderPalette);
    label.appendChild(chk);
    label.appendChild(document.createTextNode(type));
    filtersEl.appendChild(label);
  });

  btnShowAll.addEventListener('click', () => {
    Array.from(filtersEl.querySelectorAll('input[type=checkbox]')).forEach(c => c.checked = true);
    renderPalette();
  });

  function renderPalette() {
    const active = Array.from(filtersEl.querySelectorAll('input[type=checkbox]'))
      .filter(c => c.checked).map(c => c.value);
    paletteEl.innerHTML = '';
    items.filter(it => active.includes(it.type)).forEach(it => {
      const div = document.createElement('div');
      div.className = 'fish';
      div.draggable = true;
      div.dataset.image = it.image;
      div.title = it.label || it.type;

      const img = document.createElement('img');
      img.src = it.image;
      img.alt = it.label || it.type;
      div.appendChild(img);

      const lbl = document.createElement('div');
      lbl.className = 'fish-label';
      lbl.textContent = it.label || it.type;
      div.appendChild(lbl);

      div.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', it.image);
      });
      paletteEl.appendChild(div);
    });
  }

  // Aquarium drop handling
  aquariumEl.addEventListener('dragover', (e) => { e.preventDefault(); });
  aquariumEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const image = e.dataTransfer.getData('text/plain');
    if (image) addFishToAquarium(image);
  });

  function addFishToAquarium(image) {
    const uid = Date.now().toString(36) + Math.random().toString(36).slice(2,6);

    // lille preview i akvarie-området (klik for at fjerne både små og store)
    const img = document.createElement('img');
    img.src = image;
    img.className = 'aquarium-fish';
    img.dataset.image = image;
    img.dataset.uid = uid;
    img.title = 'Klik for at fjerne';
    img.addEventListener('click', () => {
      img.remove();
      // fjern tilhørende svømmende stor fisk
      const big = aquariumSwimEl && aquariumSwimEl.querySelector(`img[data-uid="${uid}"]`);
      if (big) big.remove();
    });
    aquariumEl.appendChild(img);

    // stor svømmende fisk på baggrunden
    if (aquariumSwimEl) {
      const big = document.createElement('img');
      big.src = image;
      big.className = 'swim-fish';
      big.dataset.uid = uid;
      // random position
      const left = Math.floor(5 + Math.random() * 80); // procent
      const top = Math.floor(8 + Math.random() * 70);
      big.style.left = left + '%';
      big.style.top = top + '%';
      // random animation durations
      const dur1 = 10 + Math.floor(Math.random() * 10); // 10-20s
      const dur2 = 3 + Math.floor(Math.random() * 3); // 3-5s
      big.style.animationDuration = `${dur1}s, ${dur2}s`;
      aquariumSwimEl.appendChild(big);
    }
  }

  btnClear.addEventListener('click', () => {
    aquariumEl.innerHTML = '';
    if (aquariumSwimEl) aquariumSwimEl.innerHTML = '';
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  });

  btnSave.addEventListener('click', () => {
    // Gem valgte fisk i localStorage
    const images = Array.from(aquariumEl.querySelectorAll('.aquarium-fish')).map(i => i.dataset.image);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(images)); } catch (e) { console.warn(e); }

    // Når brugeren trykker Gem: skjul UI'et (med transition) og vis kun de svømmende fisk
    const content = document.querySelector('.content-container');
    if (content) content.classList.add('hidden');
    if (aquariumSwimEl) {
      aquariumSwimEl.style.zIndex = '2';
      aquariumSwimEl.style.pointerEvents = 'none';
    }

    showRestoreButton();
  });

  function showRestoreButton() {
    if (!document.getElementById('restore-ui-btn')) {
      const btn = document.createElement('button');
      btn.id = 'restore-ui-btn';
      btn.className = 'restore-btn';
      btn.textContent = 'Gendan UI';
      btn.addEventListener('click', () => {
        const content = document.querySelector('.content-container');
        if (content) content.classList.remove('hidden');
        if (aquariumSwimEl) aquariumSwimEl.style.zIndex = '1';
        btn.remove();
      });
      document.body.appendChild(btn);
    }
  }

  // initial render
  renderPalette();

  // Hvis der allerede er gemte fisk fra tidligere session, load dem og vis kun svømmende fisk
  (function loadSaved() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        saved.forEach(img => addFishToAquarium(img));
        // skjul UI ved load
        const content = document.querySelector('.content-container');
        if (content) content.classList.add('hidden');
        if (aquariumSwimEl) aquariumSwimEl.style.zIndex = '2';
        showRestoreButton();
      }
    } catch (e) {
      // ignore
    }
  })();
});
