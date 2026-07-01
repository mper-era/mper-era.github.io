const slides = [
  { src: "../images/image1.jpg", title: "Messier 16 (Pillars of Creation)" },
  { src: "../images/image2.jpg", title: "Barnard 33 (Horsehead Nebula)" },
  { src: "../images/image3.png", title: "Messier 42 (Orion Nebula)" },
  { src: "../images/image4.jpg", title: "NGC 2014 and NGC 2020 (Cosmic Reef)" },
  { src: "../images/image5.jpg", title: "GAL-CLUS-022058s (Rings of Relativity)" },
  { src: "../images/image6.png", title: "NGC 3603 and NGC 3576" }
];

const track = document.getElementById("track");

function buildSlide(s) {
  const el = document.createElement("div");
  el.className = "slide";
  el.innerHTML = `
    <img class="slide-img" src="${s.src}" alt="${s.title}">
    <div style="padding: 10px;">
      <p style="text-align: center">${s.title}</p>
    </div>`;
  return el;
}

// Preload each image in the background (non-blocking)
// As each one finishes, append its slide to the track
function preload(s) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(s);
    img.onerror = () => resolve(s); // still show it even if it fails
    img.src = s.src;
  });
}

async function loadAndAppendAll() {
  // Kick off all preloads at once, append in whatever order they finish
  const promises = slides.map(s => preload(s).then(loadedSlide => {
    track.appendChild(buildSlide(loadedSlide));
  }));

  await Promise.all(promises);

  // Once the first full set is in and loaded, duplicate it for the seamless loop
  slides.forEach(s => track.appendChild(buildSlide(s)));

  // Now start the scroll animation
  track.classList.add("running");
}

loadAndAppendAll();