const state = {
  score: 0,
  carType: null,
  color: "#ef4b45",
  wheels: "sport",
  engine: "V8",
  interior: "sport",
  aero: "spoiler",
  coPilot: true,
  stage: 0
};

const screen = document.getElementById("screen");
const dialogue = document.getElementById("dialogue");
const dialogueText = document.getElementById("dialogueText");
const dialogueNext = document.getElementById("dialogueNext");
const stageLabel = document.getElementById("stageLabel");
const scoreEl = document.getElementById("score");

function score(n) {
  state.score += n;
  scoreEl.textContent = String(state.score).padStart(3, "0");
}

function setStage(label) {
  stageLabel.textContent = label;
}

function host(lines, onDone = null) {
  let i = 0;
  dialogue.classList.remove("hidden");
  dialogueText.textContent = lines[i];

  const next = () => {
    i++;
    if (i >= lines.length) {
      dialogue.classList.add("hidden");
      dialogueNext.removeEventListener("click", next);
      if (onDone) onDone();
      return;
    }
    dialogueText.textContent = lines[i];
  };

  dialogueNext.addEventListener("click", next);
}

function carMarkup(extraClass = "") {
  return `
    <div class="pixel-car ${extraClass}" style="--car:${state.color}">
      <div class="window"></div>
      <div class="window two"></div>
      <div class="headlight"></div>
      <div class="tail-light"></div>
      <div class="wheel left"></div>
      <div class="wheel right"></div>
    </div>
  `;
}

function start() {
  setStage("START");
  screen.className = "screen title-screen";
  screen.innerHTML = `
    <div class="kicker">BOYFRIEND'S DAY // 2026</div>
    <h1>BUILD<br>YOUR DREAM CAR</h1>
    <p class="subtitle">A tiny automotive adventure. Choose your car, build it, make it yours, then take it for a drive.</p>
    <button class="pixel-button" id="startBtn">START ENGINE ▶</button>
  `;
  document.getElementById("startBtn").onclick = () => {
    score(10);
    host([
      "Hey!",
      "I've decided you need a new car.",
      "Don't ask questions. Just trust me."
    ], chooseBase);
  };
}

function chooseBase() {
  setStage("GARAGE 01");
  screen.className = "screen garage";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 01</div>
      <h2>Choose your base.</h2>
      <p>Every dream car has to start somewhere. Pick the one that feels right.</p>
    </div>
    <div class="car-display">${carMarkup()}</div>
    <div class="selection-grid">
      <button class="option" data-car="GT">
        <strong>GT</strong>
        <span>Balanced · Comfortable · Fast enough</span>
      </button>
      <button class="option" data-car="SPORT">
        <strong>SPORT</strong>
        <span>Sharp · Quick · A little dramatic</span>
      </button>
      <button class="option" data-car="CLASSIC">
        <strong>CLASSIC</strong>
        <span>Timeless · Cool · Zero explanation needed</span>
      </button>
    </div>
  `;
  document.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => {
      state.carType = btn.dataset.car;
      score(15);
      host(["Interesting choice.", "Okay. That's our starting point."], engine);
    };
  });
}

function engine() {
  setStage("GARAGE 02");
  screen.className = "screen garage center";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 02 // ENGINE</div>
      <h2>Let's make it move.</h2>
      <p>Hit the button when the needle reaches the green zone.</p>
    </div>
    <div style="width:min(620px,100%);margin:25px auto">
      <div style="height:34px;border:4px solid #f5e9cf;background:linear-gradient(90deg,#243126 0 48%,#3e7e4d 48% 72%,#9a7d32 72% 86%,#8e2929 86%);position:relative">
        <div id="needle" style="position:absolute;top:-8px;left:8%;width:6px;height:46px;background:#fff2a8;box-shadow:3px 3px 0 #000"></div>
      </div>
      <button class="pixel-button" id="revBtn">REV IT</button>
      <p id="revResult" style="min-height:24px;color:#ffad3d"></p>
    </div>
    <div class="selection-grid" id="engineChoices" style="display:none">
      <button class="option" data-engine="V6"><strong>V6</strong><span>Balanced power</span></button>
      <button class="option" data-engine="V8"><strong>V8</strong><span>Big power</span></button>
      <button class="option" data-engine="V12"><strong>V12</strong><span>Completely unnecessary</span></button>
    </div>
  `;

  const needle = document.getElementById("needle");
  const result = document.getElementById("revResult");
  const choices = document.getElementById("engineChoices");
  let pos = 8;
  let dir = 1;
  let running = true;

  const timer = setInterval(() => {
    if (!running) return;
    pos += dir * 2.4;
    if (pos > 94 || pos < 6) dir *= -1;
    needle.style.left = pos + "%";
  }, 35);

  document.getElementById("revBtn").onclick = () => {
    running = false;
    clearInterval(timer);
    const good = pos >= 48 && pos <= 72;
    result.textContent = good ? "PERFECT REV. Okayyy. Not bad." : "Hmm. We'll call that character development.";
    score(good ? 25 : 8);
    choices.style.display = "grid";
  };

  choices.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => {
      state.engine = btn.dataset.engine;
      host(["Engine locked in.", "Now let's make it look good."], paint);
    };
  });
}

function paint() {
  setStage("GARAGE 03");
  screen.className = "screen garage center";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 03 // PAINT</div>
      <h2>Make it yours.</h2>
      <p>Pick a colour. I promise I won't judge.</p>
    </div>
    <div class="paint-preview">${carMarkup()}</div>
    <div class="color-grid">
      <button class="swatch" title="Racing Red" style="background:#ef4b45" data-color="#ef4b45"></button>
      <button class="swatch" title="Midnight" style="background:#252936" data-color="#252936"></button>
      <button class="swatch" title="Pearl" style="background:#e9e6dc" data-color="#e9e6dc"></button>
      <button class="swatch" title="Electric Blue" style="background:#398cff" data-color="#398cff"></button>
      <button class="swatch" title="Green" style="background:#2f9b68" data-color="#2f9b68"></button>
      <button class="swatch" title="Orange" style="background:#ff8c32" data-color="#ff8c32"></button>
    </div>
    <button class="pixel-button" id="paintDone">LOCK COLOUR ▶</button>
  `;

  document.querySelectorAll(".swatch").forEach(s => {
    s.onclick = () => {
      state.color = s.dataset.color;
      document.querySelector(".paint-preview").innerHTML = carMarkup();
    };
  });

  document.getElementById("paintDone").onclick = () => {
    score(20);
    host(["Okay wait...", "That colour actually looks really good.", "Let's finish the details."], wheels);
  };
}

function wheels() {
  setStage("GARAGE 04");
  screen.className = "screen garage center";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 04 // WHEELS</div>
      <h2>One important question.</h2>
      <p>How are we going to stand on the road?</p>
    </div>
    <div class="car-display">${carMarkup()}</div>
    <div class="selection-grid">
      <button class="option" data-wheel="classic"><strong>CLASSIC</strong><span>Clean and timeless</span></button>
      <button class="option" data-wheel="sport"><strong>SPORT</strong><span>Because obviously</span></button>
      <button class="option" data-wheel="race"><strong>RACE</strong><span>Subtle was never the plan</span></button>
    </div>
  `;
  document.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => {
      state.wheels = btn.dataset.wheel;
      score(15);
      host(["Much better.", "Now for the part you actually spend time looking at."], interior);
    };
  });
}

function interior() {
  setStage("GARAGE 05");
  screen.className = "screen garage center";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 05 // INTERIOR</div>
      <h2>Pick the vibe.</h2>
      <p>Because what's the point of a nice car if you don't want to sit in it?</p>
    </div>
    <div class="selection-grid">
      <button class="option" data-interior="sport"><strong>SPORT</strong><span>Black · Red · Focused</span></button>
      <button class="option" data-interior="luxury"><strong>LUXURY</strong><span>Tan · Warm · Ridiculously comfortable</span></button>
      <button class="option" data-interior="future"><strong>FUTURE</strong><span>Digital · Minimal · Slightly suspicious</span></button>
    </div>
  `;
  document.querySelectorAll(".option").forEach(btn => {
    btn.onclick = () => {
      state.interior = btn.dataset.interior;
      score(15);
      host(["Perfect.", "One last upgrade.", "And this one is important."], special);
    };
  });
}

function special() {
  setStage("GARAGE 06");
  screen.className = "screen garage center";
  screen.innerHTML = `
    <div class="section-copy">
      <div class="kicker">GARAGE 06 // FINAL UPGRADE</div>
      <h2>One slot remains.</h2>
      <p>Choose carefully.</p>
    </div>
    <div class="choice-row">
      <button class="pixel-button" data-box="1">BOX 01</button>
      <button class="pixel-button" data-box="2">BOX 02</button>
      <button class="pixel-button" data-box="3">BOX 03</button>
    </div>
    <div id="boxResult" style="min-height:100px;margin-top:20px"></div>
  `;
  document.querySelectorAll("[data-box]").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("[data-box]").forEach(b => b.disabled = true);
      score(30);
      document.getElementById("boxResult").innerHTML = `
        <div style="font-size:26px;color:#ffad3d">★ CO-PILOT UNLOCKED ★</div>
        <p style="color:#a6a9b4">Some things make a car better. This one makes the drive better.</p>
        <button class="pixel-button" id="driveBtn">TAKE IT FOR A DRIVE ▶</button>
      `;
      host(["Well...", "Looks like you're stuck with me."], () => {
        document.getElementById("driveBtn").onclick = race;
      });
    };
  });
}

function race() {
  setStage("FINAL LAP");
  screen.className = "screen race";
  screen.innerHTML = `
    <div class="race-sky"></div>
    <div class="city"></div>
    <div class="road"></div>
    <div class="finish">FINISH ★</div>
    <div class="race-car" style="--car:${state.color}">
      <div class="race-wheel a"></div>
      <div class="race-wheel b"></div>
    </div>
    <div style="position:absolute;left:20px;top:20px;background:#11131a;color:#f5e9cf;border:3px solid #f5e9cf;padding:10px;z-index:4">
      USE ← → TO DRIVE
    </div>
    <div id="raceMessage" style="position:absolute;left:50%;top:22%;transform:translateX(-50%);background:#11131a;border:3px solid #f5e9cf;padding:10px;z-index:4;display:none"></div>
  `;

  const car = document.querySelector(".race-car");
  let x = 50;
  let distance = 0;
  let keys = {};
  let won = false;

  const keydown = e => { keys[e.key] = true; };
  const keyup = e => { keys[e.key] = false; };
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);

  function loop() {
    if (won) return;
    if (keys.ArrowLeft) x -= 0.7;
    if (keys.ArrowRight) x += 0.7;
    x = Math.max(12, Math.min(88, x));
    distance += 0.35;
    car.style.left = x + "%";

    if (distance > 100) {
      won = true;
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      score(50);
      setTimeout(finish, 500);
      return;
    }
    requestAnimationFrame(loop);
  }
  host(["Okay, driver.", "Let's see what you've built."], () => requestAnimationFrame(loop));
}

function finish() {
  setStage("COMPLETE");
  screen.className = "screen title-screen";
  screen.innerHTML = `
    <div class="kicker">BUILD COMPLETE</div>
    <h2 style="font-size:42px">DREAM CAR: UNLOCKED</h2>
    <div class="car-display">${carMarkup()}</div>
    <div class="stats">
      <div class="stat">ENGINE<b>${state.engine}</b></div>
      <div class="stat">STYLE<b>98</b></div>
      <div class="stat">SCORE<b>${state.score}</b></div>
      <div class="stat">CO-PILOT<b>♥</b></div>
    </div>
    <p class="subtitle">Every dream car needs a good co-pilot.</p>
    <button class="pixel-button" id="endBtn">PARK THE CAR ♥</button>
  `;
  document.getElementById("endBtn").onclick = () => {
    host([
      "I think we're ready.",
      "So... where are we going?",
      "Happy Boyfriend's Day ❤️"
    ]);
  };
}

start();
