/* NAV SCROLL */
window.addEventListener("scroll", function () {
  const header = document.querySelector("header");
  header.classList.toggle("active", window.scrollY > 0);
});


document.addEventListener("DOMContentLoaded", function () {

  /* NAV */
  const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
          nav = document.getElementById(navId);

toggle.addEventListener("click", () => {
  nav.classList.toggle("show-menu");
  toggle.classList.toggle("show-icon");

  // Ocultar flechas del slider cuando el menú está abierto
  const menuAbierto = nav.classList.contains("show-menu");
  document.getElementById("sliderPrev").style.visibility = menuAbierto ? "hidden" : "";
  document.getElementById("sliderNext").style.visibility = menuAbierto ? "hidden" : "";
});
  };

  showMenu("nav-toggle", "nav-menu");


  /* DARK / LIGHT */
  let icon = document.getElementById("light");

  icon.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
      icon.querySelector("i").classList.replace("bi-brightness-high", "bi-moon");
      localStorage.setItem("theme", "light");
    } else {
      icon.querySelector("i").classList.replace("bi-moon", "bi-brightness-high");
      localStorage.setItem("theme", "dark");
    }
  });


  /* 🚀 CANVAS (solo una vez) */
  startAnimation();

});


/* LINEA ACTIVA EN NAV */
let sections = document.querySelectorAll("section");
let navLinks = document.querySelectorAll("header li a");

window.onscroll = () => {
  sections.forEach((sec, index) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;

    if (top >= offset && top < offset + height) {
      navLinks.forEach((link) => link.classList.remove("active"));
      navLinks[index].classList.add("active");
    }
  });
};


/* ===== CANVAS PARTICLES ===== */

// random normal
function normalPool(o){
  var r=0;
  do{
    var a=Math.round(randomNormal({mean:o.mean,dev:o.dev}));
    if(a<o.pool.length&&a>=0)return o.pool[a];
    r++;
  }while(r<100)
}

function randomNormal(o){
  if(o=Object.assign({mean:0,dev:1,pool:[]},o),
  Array.isArray(o.pool)&&o.pool.length>0)return normalPool(o);

  var r,a,n,e,l=o.mean,t=o.dev;
  do{
    r=(a=2*Math.random()-1)*a+(n=2*Math.random()-1)*n
  }while(r>=1);

  return e=a*Math.sqrt(-2*Math.log(r)/r),t*e+l
}

const NUM_PARTICLES = 600;
const PARTICLE_SIZE = 0.5;
const SPEED = 20000;

let particles = [];

function rand(low, high) {
  return Math.random() * (high - low) + low;
}

function createParticle(canvas) {
  const colour = {
    r: 255,
    g: randomNormal({ mean: 125, dev: 20 }),
    b: 50,
    a: rand(0, 1),
  };

  const isMobile = window.innerWidth <= 480;
  const amplitudBase = isMobile ? 6 : 16;
  const offsetBase   = isMobile ? 10 : 10;

  return {
    x: -2,
    y: -2,
    diameter: Math.max(0, randomNormal({ mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2 })),
    duration: randomNormal({ mean: SPEED, dev: SPEED * 0.1 }),
    amplitude: randomNormal({ mean: amplitudBase, dev: 2 }),
    offsetY: randomNormal({ mean: 0, dev: offsetBase }),
    arc: Math.PI * 2,
    startTime: performance.now() - rand(0, SPEED),
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  };
}

function moveParticle(particle, canvas, time) {
  const progress = ((time - particle.startTime) % particle.duration) / particle.duration;

  return {
    ...particle,
    x: progress,
    y: (Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY,
  };
}

function drawParticle(particle, canvas, ctx) {
  const vh = canvas.height / 100;

  ctx.fillStyle = particle.colour;
  ctx.beginPath();
  ctx.ellipse(
    particle.x * canvas.width,
   particle.y * vh + canvas.height * 0.35,
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function draw(time, canvas, ctx) {
  particles = particles.map(p => moveParticle(p, canvas, time));

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => drawParticle(p, canvas, ctx));

  requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
  let canvas = document.getElementById("particle-canvas");

  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;

  let ctx = canvas.getContext("2d");

  window.addEventListener("resize", () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx = canvas.getContext("2d");
  });

  return [canvas, ctx];
}

function startAnimation() {
  const [canvas, ctx] = initializeCanvas();

  particles = [];

  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle(canvas));
  }

  requestAnimationFrame((time) => draw(time, canvas, ctx));
}






        /* ── Slider en funcion mobile de seccion trabajo ── */

(function () {
    const isMobile = () => window.innerWidth <= 480;

    const grid    = document.getElementById('sliderGrid');
    const dotsEl  = document.getElementById('sliderDots');
    const btnPrev = document.getElementById('sliderPrev');
    const btnNext = document.getElementById('sliderNext');

    let currentIndex = 0;

    function getCards() {
        return Array.from(grid.querySelectorAll('.article'));
    }

    /* Crear un dot por cada tarjeta */
    function buildDots() {
        dotsEl.innerHTML = '';
        getCards().forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Tarjeta ${i + 1}`);
            dot.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(dot);
        });
    }

    /* Marcar el dot activo y mostrar/ocultar botones en los extremos */
    function updateUI(index) {
        currentIndex = index;
        const dots = dotsEl.querySelectorAll('.slider-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === index));

        const cards = getCards();
        btnPrev.classList.toggle('hidden', index === 0);
        btnNext.classList.toggle('hidden', index === cards.length - 1);
    }

    /* Desplazarse a una tarjeta por su índice */
    function goTo(index) {
        const cards = getCards();
        if (index < 0 || index >= cards.length) return;
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        updateUI(index);
    }

    /* Detectar qué tarjeta está centrada al hacer scroll manual */
    function onScroll() {
        const cards = getCards();
        const gridRect = grid.getBoundingClientRect();
        let closest = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            const dist = Math.abs(rect.left + rect.width / 2 - (gridRect.left + gridRect.width / 2));
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        updateUI(closest);
    }

    /* Activar o desactivar todo según el tamaño de pantalla */
    function setup() {
        if (isMobile()) {
            dotsEl.style.display  = 'flex';
            btnPrev.style.display = 'flex';
            btnNext.style.display = 'flex';
            buildDots();
            updateUI(0);
            grid.addEventListener('scroll', onScroll, { passive: true });
        } else {
            dotsEl.style.display  = 'none';
            btnPrev.style.display = 'none';
            btnNext.style.display = 'none';
            grid.removeEventListener('scroll', onScroll);
        }
    }

    btnPrev.addEventListener('click', () => goTo(currentIndex - 1));
    btnNext.addEventListener('click', () => goTo(currentIndex + 1));

    setup();
    window.addEventListener('resize', setup); // se recalcula si cambia el tamaño
})();
