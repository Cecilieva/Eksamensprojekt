/* JS extracted from html/byg2.html */
document.addEventListener('DOMContentLoaded', async () => {
  // First, if #fish has a data-src, inline that external SVG so parts can be targeted
  const fishEl = document.getElementById('fish');
  if (fishEl && fishEl.dataset && fishEl.dataset.src) {
    try {
      const resp = await fetch(fishEl.dataset.src);
      if (resp.ok) {
        const svgText = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgRoot = doc.documentElement;
        // Import child nodes from the fetched SVG into the existing <g id="fish">
        while (svgRoot.firstChild) {
          const imported = document.importNode(svgRoot.firstChild, true);
          fishEl.appendChild(imported);
          svgRoot.removeChild(svgRoot.firstChild);
        }
        // After inlining, try to center the imported fish within its parent SVG
        try {
          const svgEl = fishEl.ownerSVGElement || fishEl.closest('svg');
          if (svgEl) {
            // compute svg viewport size
            let svgW = 0, svgH = 0;
            if (svgEl.viewBox && svgEl.viewBox.baseVal && svgEl.viewBox.baseVal.width) {
              svgW = svgEl.viewBox.baseVal.width;
              svgH = svgEl.viewBox.baseVal.height;
            } else {
              svgW = svgEl.clientWidth || svgEl.getBBox().width || 800;
              svgH = svgEl.clientHeight || svgEl.getBBox().height || 600;
            }
            // get bounding box of the fish group
            const bbox = fishEl.getBBox();
            const dx = (svgW / 2) - (bbox.x + bbox.width / 2);
            const dy = (svgH / 2) - (bbox.y + bbox.height / 2);
            // apply translate to center; preserve any existing transform by prepending
            const prev = fishEl.getAttribute('transform') || '';
            fishEl.setAttribute('transform', `translate(${dx} ${dy}) ${prev}`.trim());
          }
        } catch (centErr) {
          console.warn('Could not center fish SVG:', centErr);
        }
      } else {
        console.warn('Failed to fetch fish SVG:', fishEl.dataset.src, resp.status);
      }
    } catch (err) {
      console.warn('Error inlining fish SVG:', err);
    }
  }

  let selectedColor = null;
  const pop = document.getElementById('popSound');

  // Gem startfarver (til nulstilling)
  const originalColors = {};
  document.querySelectorAll('#fish g').forEach(part => {
    originalColors[part.id] = part.getAttribute('fill');
  });

  // Farvepaletter (nu <image> elementer med data-color)
  document.querySelectorAll('[id^="color"]').forEach(palette => {
    palette.style.cursor = 'pointer';
    palette.addEventListener('click', () => {
      // read color from data-color (fallback to fill)
      selectedColor = palette.dataset.color || palette.getAttribute('fill');
      // visual: dim others and highlight selected via opacity
      document.querySelectorAll('[id^="color"]').forEach(c => c.setAttribute('opacity', '0.6'));
      palette.setAttribute('opacity', '1');
      if (pop && pop.play) pop.play();
    });
  });

  // Klikbare fiske-dele
  document.querySelectorAll('#fish g').forEach(part => {
    part.addEventListener('click', e => {
      if (selectedColor) {
        part.setAttribute('fill', selectedColor);
        createSparkle(e.pageX, e.pageY);
        if (pop && pop.play) pop.play();
      }
    });
  });

  // Glimt / gnist-effekt
  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = `${x - 10}px`;
    sparkle.style.top = `${y - 10}px`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }

  // Boble-animationer
  function createBubble() {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 20 + 10;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * window.innerWidth}px`;
    bubble.style.animationDuration = `${6 + Math.random() * 4}s`;
    const scene = document.querySelector('.scene');
    if (scene) {
      scene.appendChild(bubble);
      setTimeout(() => bubble.remove(), 10000);
    }
  }
  setInterval(createBubble, 800);

  // Nulstil farver
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('#fish g').forEach(part => {
        const orig = originalColors[part.id];
        if (orig) part.setAttribute('fill', orig);
      });
      if (pop && pop.play) pop.play();
    });
  }
});
