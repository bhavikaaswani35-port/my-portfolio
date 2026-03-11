const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

const tiltCards = document.querySelectorAll('.tilt');

function handleTilt(event) {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  const centerX = bounds.width / 2;
  const centerY = bounds.height / 2;
  const rotateX = -((y - centerY) / centerY) * 4;
  const rotateY = ((x - centerX) / centerX) * 4;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
}

function resetTilt(event) {
  event.currentTarget.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
}

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

const canvas = document.getElementById('scene3d');

if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 11);

  const particleCount = 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 12;
    positions[i + 2] = (Math.random() - 0.5) * 12;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x4f94ff,
    size: 0.055,
    transparent: true,
    opacity: 0.8,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 0.8;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 0.8;
  });

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', resize);
  resize();

  function animate() {
    points.rotation.y += 0.0008;
    points.rotation.x += 0.0003;

    camera.position.x += (mouseX - camera.position.x) * 0.03;
    camera.position.y += (-mouseY - camera.position.y) * 0.03;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

const videoEditingPlayer = document.querySelector('.video-editing-player');

if (videoEditingPlayer) {
  videoEditingPlayer.addEventListener('click', () => {
    videoEditingPlayer.muted = false;
    if (videoEditingPlayer.paused) {
      videoEditingPlayer.play().catch(() => {});
    }
  });
}
