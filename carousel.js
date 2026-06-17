const slides = [
  {
    src: "../images/image1.jpg",
    title: "Messier 16 (Pillars of Creation)",
  },
  {
    src: "../images/image2.jpg",
    title: "Barnard 33 (Horsehead Nebula)",
  },
  {
    src: "../images/image3.jpg",
    title: "Messier 42 (Orion Nebula)",
  },
  {
    src: "../images/image4.jpg",
    title: "NGC 2014 and NGC 2020 (Cosmic Reef)",
  },
  {
    src: "../images/image5.jpg",
    title: "GAL-CLUS-022058s (Rings of Relativity)",
  },
  {
    src: "../images/image6.jpg",
    title: "NGC 3603 and NGC 3576",
  }
];

const track = document.getElementById("track");

function buildSlide(s, eager) {
  const el = document.createElement("div");
  el.className = "slide";
  el.innerHTML = `
    <img class="slide-img" src="${s.src}" alt="${s.title}" loading="${eager ? 'eager' : 'lazy'}">
    <div style="padding: 10px;">
    <p style="text-align: center">${s.title}</p>
    </div>`;
  return el;
}

// Original set + duplicate for seamless loop
slides.forEach((s, i) => track.appendChild(buildSlide(s, i < 2)));
slides.forEach(s => track.appendChild(buildSlide(s, false)));
