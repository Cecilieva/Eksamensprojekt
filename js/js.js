/* karuselen kører uendelig */
function scrollCarousel(direction) {
    const track = document.querySelector('.carousel-track');
    const itemWidth = 270; // Billede bredde + gap
    const scrollAmount = itemWidth * 2; // Scroll 2 billeder ad gangen
    const halfWidth = track.scrollWidth / 2;

    /* Normal scroll */
    track.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });

       /* karusellen kører uendeligt */
    setTimeout(() => {
        if (direction === 1 && track.scrollLeft >= halfWidth) {
            // Reset til start uden animation
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = track.scrollLeft - halfWidth;
            track.style.scrollBehavior = 'smooth';
        } else if (direction === -1 && track.scrollLeft <= 0) {
            // Reset til midten uden animation
            track.style.scrollBehavior = 'auto';
            track.scrollLeft = halfWidth;
            track.style.scrollBehavior = 'smooth';
        }
    }, 500);
}

// Håndter mouse scroll for uendelig scroll
function handleMouseScroll() {
    const track = document.querySelector('.carousel-track');
    const halfWidth = track.scrollWidth / 2;
    
    if (track.scrollLeft >= halfWidth) {
        // Reset til start uden animation
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = track.scrollLeft - halfWidth;
        track.style.scrollBehavior = 'smooth';
    } else if (track.scrollLeft <= 0) {
        // Reset til midten uden animation
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = halfWidth;
        track.style.scrollBehavior = 'smooth';
    }
}

// Initialiser karusel position og duplicer indhold
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const items = track.innerHTML;
    
    // Duplicer alt indhold for uendelig scroll
    track.innerHTML = items + items;
    
    // Start i midten af det duplicerede indhold
    track.scrollLeft = track.scrollWidth / 4;
    
    // Tilføj mouse scroll event listener
    track.addEventListener('scroll', handleMouseScroll);
});

// Auto-scroll funktion fjernet - kun manuel navigation nu

// Modal funktioner og navigation
function showFishInfo(fishType) {
    console.log('showFishInfo kaldt med:', fishType);
    const modal = document.getElementById('info-modal');
    const infoImage = document.getElementById('info-image');
    const speakerBtn = document.getElementById('speaker-button');
    
    // Sæt det rigtige info-billede baseret på fisketype 
    if (fishType === 'nemofisk') {
        infoImage.src = '../image/klovnefiskinfo.png';
        infoImage.alt = 'Klovnefisk information';
        console.log('Nemofisk billede sat');
    } else if (fishType === 'palet') {
        infoImage.src = '../image/Paletkirugen.png';
        infoImage.alt = 'Paletkirurg information';
        console.log('Palet billede sat');
    } else if (fishType === 'rævfisk') {
        infoImage.src = '../image/Raevefjaes.png';
        infoImage.alt = 'Rævfisk information';
        console.log('Rævfisk billede sat til:', infoImage.src);
    } else if (fishType === 'reje') {
        infoImage.src = '../image/reje1.png';
        infoImage.alt = 'Reje information';
        console.log('Reje billede sat til:', infoImage.src);
    } else if (fishType === 'gubbi') {
        infoImage.src = '../image/gubbiinfo.png';
        infoImage.alt = 'Gubbi information';
        console.log('Gubbi billede sat til:', infoImage.src);
    }

    // Vis højtaler knappen for alle fisk-info billeder
    if (speakerBtn) {
        speakerBtn.style.display = 'block';
    }
    
    if (modal) {
      modal.style.display = 'block';
    }
    document.body.style.overflow = 'hidden'; // Forhindrer scrolling bagved modal
}

// Unified closeModal: lukker både info-modal og image-modal afhængigt af hvilken der er åben
function closeModal() {
    const infoModal = document.getElementById('info-modal');
    const imageModal = document.getElementById('imageModal');
    const speakerBtn = document.getElementById('speaker-button');

    if (infoModal && infoModal.style.display === 'block') {
        infoModal.style.display = 'none';
        if (speakerBtn) speakerBtn.style.display = 'none';
    }

    if (imageModal && imageModal.style.display === 'block') {
        imageModal.style.display = 'none';
    }

    document.body.style.overflow = 'auto'; // Genaktiver scrolling
}

// Funktion til tilbage-knappen
function tilbageButtonClick() {
    // Går tilbage til side2.html
    window.location.href = 'side2.html'; 
}

// Funktion til hjørne-knappen 
function cornerButtonClick() {
    // Tilføj en sjov animation før navigation
    const button = document.querySelector('.corner-button');
    if (button) button.style.transform = 'scale(1.3) rotate(360deg)';
    
    // Naviger til fiskhjem.html efter animation
    setTimeout(() => {
        window.location.href = 'fiskhjem.html';
    }, 600);
} 

// Tilføj interaktive effekter til billederne
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.image-item img');
    
    images.forEach(img => {
        // Tilføj click effekt
        img.addEventListener('click', function() {
            // Debug: vis hvilken fil der blev klikket på
            console.log('Klikket på:', this.src);
            
            // Tjek om det er nemofisk der bliver klikket på
            if (this.src.includes('nemofisk.png')) {
                console.log('Nemofisk detekteret');
                showFishInfo('nemofisk');
                return; // Stop her så vi ikke får den normale animation
            }
            
            // Tjek om det er palet der bliver klikket på
            if (this.src.includes('Palet.png')) {
                console.log('Palet detekteret');
                showFishInfo('palet');
                return; // Stop her så vi ikke får den normale animation
            }
            
            // Tjek om det er rævfisk der bliver klikket på
            if (this.src.includes('Raevfisk.png') || this.src.includes('Rævfisk.png')) {
                console.log('Rævfisk detekteret');
                showFishInfo('rævfisk');
                return; // Stop her så vi ikke får den normale animation
            }
            
            // Tjek om det er reje der bliver klikket på
            if (this.src.includes('reje.png')) {
                console.log('Reje detekteret');
                showFishInfo('reje');
                return; // Stop her så vi ikke får den normale animation
            }
            
            // Tjek om det er gubbi der bliver klikket på
            if (this.src.includes('gubbi.png')) {
                console.log('Gubbi detekteret');
                showFishInfo('gubbi');
                return; // Stop her så vi ikke får den normale animation
            }
            
            // Normal klik animation for andre billeder
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Tilføj keyboard navigation til karusel
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            scrollCarousel(-1);
        } else if (event.key === 'ArrowRight') {
            scrollCarousel(1);
        }
    });
});

// Åbn image-modal med billede
function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    if (!modal || !modalImage) return;

    modalImage.src = imageSrc;
    modal.style.display = 'block';
    
    // Forhindre body scroll når modal er åben
    document.body.style.overflow = 'hidden';
}
