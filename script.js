// ====== CUSTOMIZE HERE ======
const HER_NAME = "";   // e.g. "Priya"  (or share the page as index.html?name=Priya&from=Rahul)
const YOUR_NAME = "";  // e.g. "Rahul"

const STORY = [
  { emoji: "✨", text: "From the first time we talked, something felt different." },
  { emoji: "😊", text: "You make my ordinary days feel special." },
  { emoji: "🌙", text: "Your smile is my favourite thing to see." },
  { emoji: "💭", text: "And I can't keep this to myself any longer…" },
];

const NO_MESSAGES = [
  "Are you sure? 🥺",
  "Think again… 💭",
  "Pretty please? 🙏",
  "I'll be very sad 😢",
  "Don't break my heart 💔",
  "The No button is broken 😜",
  "You know you want to say yes 😏",
];
// ============================

const params = new URLSearchParams(location.search);
const herName = params.get("name") || HER_NAME;
const fromName = params.get("from") || YOUR_NAME;

document.querySelectorAll(".her-name").forEach(el => { if (herName) el.textContent = herName; });
document.querySelectorAll(".from-name").forEach(el => { if (fromName) el.textContent = fromName; });

const $ = id => document.getElementById(id);
function show(stepId) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  $(stepId).classList.add("active");
}

// ----- Floating hearts -----
const heartsBox = $("hearts");
const HEART_EMOJIS = ["💖", "💕", "💗", "💘", "❤️", "💞"];
function spawnHeart() {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 14 + Math.random() * 26 + "px";
  h.style.animationDuration = 6 + Math.random() * 6 + "s";
  heartsBox.appendChild(h);
  setTimeout(() => h.remove(), 12500);
}
setInterval(spawnHeart, 450);

// ----- Story flow -----
let storyIndex = 0;
function showStory() {
  const item = STORY[storyIndex];
  $("story-emoji").textContent = item.emoji;
  const el = $("story-text");
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += item.text[i++];
    if (i >= item.text.length) clearInterval(timer);
  }, 35);
  $("next").textContent = storyIndex === STORY.length - 1 ? "Continue 💕" : "Next →";
}

$("start").addEventListener("click", () => { show("step-story"); showStory(); });
$("next").addEventListener("click", () => {
  storyIndex++;
  if (storyIndex < STORY.length) showStory();
  else show("step-question");
});

// ----- The "No" button runs away -----
const noBtn = $("no");
const yesBtn = $("yes");
let noCount = 0;

function dodge() {
  noCount++;
  $("sub").textContent = NO_MESSAGES[(noCount - 1) % NO_MESSAGES.length];

  // Yes button grows each time
  const scale = Math.min(1 + noCount * 0.15, 2.2);
  yesBtn.style.transform = `scale(${scale})`;

  // Move the No button to a random spot on screen
  noBtn.style.position = "fixed";
  const pad = 20;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  noBtn.style.left = pad + Math.random() * Math.max(maxX - pad, 0) + "px";
  noBtn.style.top = pad + Math.random() * Math.max(maxY - pad, 0) + "px";
  noBtn.style.zIndex = 10;
}
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", e => { e.preventDefault(); dodge(); }, { passive: false });
noBtn.addEventListener("click", dodge);

// ----- Yes! -----
yesBtn.addEventListener("click", () => {
  noBtn.style.display = "none";
  show("step-yes");
  launchConfetti();
  for (let i = 0; i < 30; i++) setTimeout(spawnHeart, i * 60);
});

// ----- Confetti -----
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize();
addEventListener("resize", resize);

function launchConfetti() {
  const colors = ["#ff4d79", "#ffd166", "#06d6a0", "#4cc9f0", "#b388ff", "#ffffff"];
  const pieces = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    r: 4 + Math.random() * 6,
    c: colors[Math.floor(Math.random() * colors.length)],
    vy: 2 + Math.random() * 4,
    vx: -2 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: -0.15 + Math.random() * 0.3,
  }));

  (function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < canvas.height + 20) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    }
    if (alive) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  })();
}
