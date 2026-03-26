// Base design size 
const BASE_W = 2048;
const BASE_H = 1559;

// Board area in BASE coords
const BOARD_LEFT = 369;
const BOARD_TOP  = 1006;
const BOARD_W    = 737;
const BOARD_H    = 377;

// Board center in BASE coords
const BOARD_CX = BOARD_LEFT + BOARD_W / 2 + 20;
const BOARD_CY = BOARD_TOP  + BOARD_H / 2 - 164;

// Piece spawn positions (BASE coords) 
const BONE_INIT_X = BOARD_CX + 60;
const BONE_INIT_Y = BOARD_CY;
const TAIL_INIT_X = BOARD_CX - 220;
const TAIL_INIT_Y = BOARD_CY + 10;

// Knife spawn
const KNIFE_INIT_X = 1229;
const KNIFE_INIT_Y = BOARD_CY;

// Hit box padding
const HIT_PAD_X = 200;
const HIT_PAD_Y = 120;

// Fish tray zone — covers the fish on ice area
const TRAY_ZONE_X = 100;
const TRAY_ZONE_Y = 30;
const TRAY_ZONE_W = 750;
const TRAY_ZONE_H = 470;

// Where the fish spawns when grabbed from tray (BASE coords)
const FISH_TRAY_CX = 450;
const FISH_TRAY_CY = 250;

// DOM
const scene    = document.getElementById("scene");
const hintEl   = document.getElementById("hint");

const zoneFishtray = document.getElementById("zone-fishtray");
const deadfish = document.getElementById("deadfish");
const bonefish = document.getElementById("bonefish");
const fishtail = document.getElementById("fishtail");
const fillet   = document.getElementById("fillet");
const knife    = document.getElementById("knife");

const dots = Array.from(document.querySelectorAll(".dot"));

//responsive scaling helpers
function sceneRect() { return scene.getBoundingClientRect(); }
function sx(x) { return x * (sceneRect().width / BASE_W); }
function sy(y) { return y * (sceneRect().height / BASE_H); }
function toLocal(clientX, clientY) {
  const r = sceneRect();
  return { x: clientX - r.left, y: clientY - r.top };
}

// BINS (BASE coords)
const BIN_W = 226;
const BIN_H = 207;

const TRAY_CX = 1576;
const COMPOST_CY = 764;
const RECYCLE_CY = 1007;
const TRASH_CY   = 1249;

const compostBin = document.getElementById("compostbin");
const recycleBin = document.getElementById("recyclebin");
const trashBin   = document.getElementById("trashbin");

const zoneCompost = document.getElementById("zone-compost");
const zoneRecycle = document.getElementById("zone-recycle");
const zoneTrash   = document.getElementById("zone-trash");

//game state
let stage = "grab_fish";
let fishDodged = false;
let dragging = null;
let knifeCutting = false;
let bonefishTossed = false;
let fishtailTossed = false;
let sustainabilityScore = 3; // lose 1 per wrong bin

let knifePos = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
let bonePos  = { x: sx(BONE_INIT_X),  y: sy(BONE_INIT_Y) };
let tailPos  = { x: sx(TAIL_INIT_X),  y: sy(TAIL_INIT_Y) };
let fishPos = { x: sx(FISH_TRAY_CX), y: sy(FISH_TRAY_CY) };

let dragOffset = { x: 0, y: 0 };

// Results popup DOM
const resultsOverlay  = document.getElementById("results-overlay");
const resultsStars    = document.getElementById("results-stars");
const resultsMessage  = document.getElementById("results-message");
const resultsContinue = document.getElementById("results-continue");

// UI helpers
function setHint(text, done = false) {
  hintEl.textContent = text;
  hintEl.style.background = done
    ? "rgba(74,124,89,0.85)"
    : "rgba(184,92,32,0.85)";
}

function updateDots() {
  const order = ["grab_fish", "initial", "fish_cut", "fillet_done"];
  const idx = order.indexOf(stage);
  dots.forEach((d, i) => {
    d.classList.toggle("on", i <= idx);
    d.classList.toggle("current", order[i] === stage);
  });
}

//check if both pieces are sorted
function checkAllSorted() {
  if (bonefishTossed && fishtailTossed) {
    setTimeout(() => {
      setStage("fillet_done");

      if (sustainabilityScore === 3) {
        setHint("Perfect! All waste composted!", true);
      }
      setTimeout(() => { showResults(); }, 2800);
    }, 1500);
  }
}
//fade out and hide a piece
function fadeOutPiece(el) {
  el.style.pointerEvents = "none";
  el.style.transition = "opacity 250ms ease";
  el.style.opacity = "0";
  setTimeout(() => { el.style.display = "none"; }, 250);
}

// positioning / rendering 
function placeSprites() {
  const cx = sx(BOARD_CX);
  const cy = sy(BOARD_CY);

// During grab_fish stage, fish follows cursor, otherwise on board
  if (stage === "grab_fish" && dragging === "deadfish") {
    deadfish.style.left = `${fishPos.x}px`;
    deadfish.style.top  = `${fishPos.y}px`;
    deadfish.style.opacity = "1";
    deadfish.style.pointerEvents = "none";
  } else if (stage === "grab_fish") {
    deadfish.style.display = "none";
  } else {
    deadfish.style.left = `${cx}px`;
    deadfish.style.top  = `${cy}px`;
    deadfish.style.opacity = stage === "initial" ? "1" : "0";
  }

  fillet.style.left = `${cx}px`;
  fillet.style.top  = `${cy}px`;

  bonefish.style.left = `${bonePos.x}px`;
  bonefish.style.top  = `${bonePos.y + sy(20)}px`;

  fishtail.style.left = `${tailPos.x}px`;
  fishtail.style.top  = `${tailPos.y + sy(20)}px`;

  knife.style.left = `${knifePos.x}px`;
  knife.style.top  = `${knifePos.y}px`;

  // Show/hide
  knife.style.display = stage === "initial" ? "block" : "none";
    if (stage !== "grab_fish" || dragging === "deadfish") {
      deadfish.style.display = "block";
    }

  if (stage === "fish_cut" || stage === "fillet_done") {
    if (!bonefishTossed) bonefish.style.display = "block";
    if (!fishtailTossed) fishtail.style.display = "block";
  } else {
    bonefish.style.display = "none";
    fishtail.style.display = "none";
  }

  // Bins + zones
  placeBin(compostBin, TRAY_CX, COMPOST_CY);
  placeBin(recycleBin, TRAY_CX, RECYCLE_CY);
  placeBin(trashBin,   TRAY_CX, TRASH_CY);
  placeZone(zoneCompost, TRAY_CX, COMPOST_CY, 110, 110);
  placeZone(zoneRecycle, TRAY_CX, RECYCLE_CY, 110, 110);
  placeZone(zoneTrash,   TRAY_CX, TRASH_CY,   110, 110);

  // Fish tray grab zone
  zoneFishtray.style.left   = `${sx(TRAY_ZONE_X)}px`;
  zoneFishtray.style.top    = `${sy(TRAY_ZONE_Y)}px`;
  zoneFishtray.style.width  = `${sx(TRAY_ZONE_W)}px`;
  zoneFishtray.style.height = `${sy(TRAY_ZONE_H)}px`;
  zoneFishtray.style.display = stage === "grab_fish" && dragging !== "deadfish" ? "block" : "none";

  // Fillet — visible once BOTH pieces sorted
  fillet.classList.toggle("visible", stage === "fillet_done");
  fillet.style.display = (stage === "fillet_done") ? "block" : "none";


  // Knife visuals
  if (dragging === "knife") {
    knife.style.transform = "translate(-50%, -50%) rotate(-10deg) scale(1.06) scaleX(-1)";
    knife.style.filter = "drop-shadow(0 8px 20px rgba(0,0,0,0.4))";
    knife.style.cursor = "grabbing";
  } else {
    knife.style.transform = "translate(-50%, -50%) scaleX(-1)";
    knife.style.filter = "none";
    knife.style.cursor = knifeCutting ? "default" : "grab";
  }

  // Bonefish visuals
  if (bonefishTossed) {
    bonefish.style.cursor = "default";
  } else if (dragging === "bonefish") {
    bonefish.style.transform = "translate(-50%, -50%) rotate(-6deg) scale(1.04)";
    bonefish.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.35))";
    bonefish.style.cursor = "grabbing";
  } else {
    bonefish.style.transform = "translate(-50%, -50%)";
    bonefish.style.filter = "none";
    bonefish.style.cursor = "grab";
  }

  // Fishtail visuals
  if (fishtailTossed) {
    fishtail.style.cursor = "default";
  } else if (dragging === "fishtail") {
    fishtail.style.transform = "translate(-50%, -50%) rotate(5deg) scale(1.06)";
    fishtail.style.filter = "drop-shadow(0 8px 16px rgba(0,0,0,0.35))";
    fishtail.style.cursor = "grabbing";
  } else {
    fishtail.style.transform = "translate(-50%, -50%)";
    fishtail.style.filter = "none";
    fishtail.style.cursor = "grab";
  }

  updateDots();
}

scene.addEventListener("click", (e) => {
  const p = toLocal(e.clientX, e.clientY);
  const bx = Math.round(p.x * (BASE_W / sceneRect().width));
  const by = Math.round(p.y * (BASE_H / sceneRect().height));
  console.log("BASE coords:", bx, by);
});

function placeBin(el, cxBase, cyBase) {
  el.style.left   = `${sx(cxBase)}px`;
  el.style.top    = `${sy(cyBase)}px`;
  el.style.width  = `${sx(BIN_W)}px`;
  el.style.height = `${sy(BIN_H)}px`;
}

function placeZone(el, cxBase, cyBase, wBase, hBase) {
  el.style.left   = `${sx(cxBase - wBase/2)}px`;
  el.style.top    = `${sy(cyBase - hBase/2)}px`;
  el.style.width  = `${sx(wBase)}px`;
  el.style.height = `${sy(hBase)}px`;
}

function pointInZone(zoneEl, x, y) {
  const r = zoneEl.getBoundingClientRect();
  const s = scene.getBoundingClientRect();
  return x >= (r.left - s.left) && x <= (r.right - s.left) &&
         y >= (r.top - s.top)   && y <= (r.bottom - s.top);
}

function closeAllBins() {
  compostBin.classList.remove("open");
  recycleBin.classList.remove("open");
  trashBin.classList.remove("open");
}

function openOnly(which) {
  closeAllBins();
  if (which === "compost") compostBin.classList.add("open");
  if (which === "recycle") recycleBin.classList.add("open");
  if (which === "trash")   trashBin.classList.add("open");
}

function setStage(next) {
  stage = next;
  placeSprites();
}


// Results popup 
function showResults() {
  const stars = resultsStars.querySelectorAll(".honey");
  stars.forEach(s => {
    s.classList.remove("earned", "pop");
    s.querySelector("img").src = "/src/assets/sprites/fish-prep/blankhoney.png";
  });

  const messages = {
    3: "Perfect! You composted all the fish waste. Great sustainability practice!",
    2: "Almost! One piece went to the wrong bin. Fish waste belongs in compost!",
    1: "Both pieces went to the wrong bins. Remember: fish waste is compostable!"
  };
  resultsMessage.textContent = messages[sustainabilityScore] || messages[1];

  resultsOverlay.classList.remove("hidden");

  stars.forEach((s, i) => {
    if (i < sustainabilityScore) {
      setTimeout(() => {
        const img = s.querySelector("img");
        img.style.opacity = "0";
        setTimeout(() => {
          img.src = "/src/assets/sprites/fish-prep/honey2.png";
          img.style.opacity = "1";
        }, 200);
        s.classList.add("earned", "pop");
        setTimeout(() => s.classList.remove("pop"), 400);
      }, 600 + i * 450);
    }
  });
}

// ← Replace the old resultsContinue listener with this:
resultsContinue.addEventListener("click", () => {
  resultsOverlay.classList.add("hidden");
  window.parent.postMessage({
    type: "fishPrepComplete",
    stars: sustainabilityScore
  }, "*");
});

// resize
window.addEventListener("resize", () => {
  if (stage === "grab_fish") {
    fishPos = { x: sx(FISH_TRAY_CX), y: sy(FISH_TRAY_CY) };
  }
  if (stage === "initial") {
    knifePos = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
    knife.style.width = "clamp(55px, 9vw, 90px)";
    knife.style.transform = "translate(-50%, -50%) rotate(-70deg) scaleX(-1)";
  }
  if (stage === "fish_cut") {
    if (!bonefishTossed) bonePos = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
    if (!fishtailTossed) tailPos = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
  }
  placeSprites();
});

// input: fish tray grab
zoneFishtray.addEventListener("pointerdown", (e) => {
  if (stage !== "grab_fish") return;
  e.preventDefault();
  zoneFishtray.setPointerCapture(e.pointerId);

  const p = toLocal(e.clientX, e.clientY);
  fishPos = { x: p.x, y: p.y };
  dragOffset = { x: 0, y: 0 };
  dragging = "deadfish";
  setHint("Drop the fish on the cutting board!");
  placeSprites();
});
// input: knife 
knife.addEventListener("pointerdown", (e) => {
  if (stage !== "initial" || knifeCutting) return;
  e.preventDefault();
  knife.setPointerCapture(e.pointerId);
  const p = toLocal(e.clientX, e.clientY);
  dragOffset = { x: p.x - knifePos.x, y: p.y - knifePos.y };
  dragging = "knife";
  knife.style.width = "clamp(70px, 12vw, 120px)";
  setHint("Drop the knife onto the fish!");
  placeSprites();
});

// input: bonefish
bonefish.addEventListener("pointerdown", (e) => {
  if (stage !== "fish_cut" || bonefishTossed) return;
  e.preventDefault();
  bonefish.setPointerCapture(e.pointerId);
  const p = toLocal(e.clientX, e.clientY);
  dragOffset = { x: p.x - bonePos.x, y: p.y - bonePos.y };
  dragging = "bonefish";
  setHint("Drop the fish bones into the correct bin!");
  placeSprites();
});

// input: fishtail 
fishtail.addEventListener("pointerdown", (e) => {
  if (stage !== "fish_cut" || fishtailTossed) return;
  e.preventDefault();
  fishtail.setPointerCapture(e.pointerId);
  const p = toLocal(e.clientX, e.clientY);
  dragOffset = { x: p.x - tailPos.x, y: p.y - tailPos.y };
  dragging = "fishtail";
  setHint("Drop the fish tail into the correct bin!");
  placeSprites();
});

// pointermove
  // pointermove
window.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const p = toLocal(e.clientX, e.clientY);
  const nx = p.x - dragOffset.x;
  const ny = p.y - dragOffset.y;

  if (dragging === "deadfish") fishPos  = { x: nx, y: ny };
  if (dragging === "knife")    knifePos = { x: nx, y: ny };
  if (dragging === "bonefish") bonePos  = { x: nx, y: ny };
  if (dragging === "fishtail") tailPos  = { x: nx, y: ny };

  if (dragging === "bonefish" || dragging === "fishtail") {
    const pos = dragging === "bonefish" ? bonePos : tailPos;
    const overCompost = pointInZone(zoneCompost, pos.x, pos.y);
    const overRecycle = pointInZone(zoneRecycle, pos.x, pos.y);
    const overTrash   = pointInZone(zoneTrash,   pos.x, pos.y);

    if (overCompost)      openOnly("compost");
    else if (overRecycle) openOnly("recycle");
    else if (overTrash)   openOnly("trash");
    else                  closeAllBins();
  }

  placeSprites();
});


// pointerup
window.addEventListener("pointerup", () => {
  if (!dragging) return;

  const fishCX = sx(BOARD_CX);
  const fishCY = sy(BOARD_CY);

  // deadfish drop from tray to board
  if (dragging === "deadfish") {
    dragging = null;

    const hit =
      Math.abs(fishPos.x - fishCX) <= sx(200) &&
      Math.abs(fishPos.y - fishCY) <= sy(150);

    if (hit) {
      stage = "initial";
      setHint("Go ahead and pick up the knife and drop it on the fish!");
      placeSprites();
      return;
    }

    // Missed — hide fish and let them try again
    setHint("Place the fish on the cutting board!");
    deadfish.style.display = "none";
    dragging = null;
    placeSprites();
    return;
  }

 // knife drop
  if (dragging === "knife") {
    const hit =
      Math.abs(knifePos.x - fishCX) <= sx(HIT_PAD_X) &&
      Math.abs(knifePos.y - fishCY) <= sy(HIT_PAD_Y);

if (hit && !fishDodged) {
      // First fish dodges
      fishDodged = true;
      dragging = null;

// Fish flop animation
      deadfish.style.transition = "transform 100ms ease";
      deadfish.style.transform = "translate(-50%, -50%) rotate(15deg) scaleY(0.85) translateY(-10px)";
      setTimeout(() => {
        deadfish.style.transform = "translate(-50%, -50%) rotate(-12deg) scaleY(1.15) scaleX(0.9) translateY(-20px)";
      }, 100);
      setTimeout(() => {
        deadfish.style.transform = "translate(-50%, -50%) rotate(10deg) scaleY(0.8) scaleX(1.1) translateY(-5px)";
      }, 200);
      setTimeout(() => {
        deadfish.style.transform = "translate(-50%, -50%) rotate(-8deg) scaleY(1.1) translateY(-15px)";
      }, 300);
      setTimeout(() => {
        deadfish.style.transform = "translate(-50%, -50%) rotate(3deg) scaleY(0.95) translateY(-3px)";
      }, 400);
      setTimeout(() => {
        deadfish.style.transform = "translate(-50%, -50%) rotate(0deg) scaleY(1) translateY(0px)";
        deadfish.style.transition = "none";
      }, 500);

      // Snap knife back
      knifePos = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
      setHint("Looks like there's still some life in the fella. Don't be shy, try again!");
      placeSprites();
      return;
    }

    if (hit && fishDodged) {
      knifeCutting = true;
      dragging = null;
      setHint("Slicing…");

      const cx = sx(BOARD_CX);
      const cy = sy(BOARD_CY);
      knife.style.display = "block";
      knife.style.left = `${cx}px`;
      knife.style.top = `${cy}px`;
      knife.classList.add("knife-slicing");

      const cutLine = document.getElementById("cut-line");
      cutLine.style.left = `${cx}px`;
      cutLine.style.top = `${cy}px`;
      setTimeout(() => {
        cutLine.classList.add("visible");
      }, 250);

      placeSprites();

      setTimeout(() => {
        knife.classList.remove("knife-slicing");
        cutLine.classList.remove("visible");
        setStage("fish_cut");
        knifePos = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
        knifeCutting = false;
        bonePos = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
        tailPos = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
        setHint("Sort the fish waste into the correct bin!");
        bonefish.style.opacity = "0";
        fishtail.style.opacity = "0";
        bonefish.style.transition = "opacity 400ms ease";
        fishtail.style.transition = "opacity 400ms ease";
        setTimeout(() => {
          bonefish.style.opacity = "1";
          fishtail.style.opacity = "1";
        }, 50);
        placeSprites();
      }, 800);
      return;
    } else {
      knifePos = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
      setHint("Don't be scared, he won't bite! Drop the knife directly on the fish.");
    }
  }

  // bonefish drop 
  if (dragging === "bonefish") {
    closeAllBins();
    dragging = null;

    const overCompost = pointInZone(zoneCompost, bonePos.x, bonePos.y);
    const overRecycle = pointInZone(zoneRecycle, bonePos.x, bonePos.y);
    const overTrash   = pointInZone(zoneTrash,   bonePos.x, bonePos.y);

    if (overCompost || overRecycle || overTrash) {
      bonefishTossed = true;
      fadeOutPiece(bonefish);

      if (overCompost) {
        compostBin.classList.add("glow-correct");
        setHint("Bones in compost — nice!", true);
      } else {
        sustainabilityScore -= 1;
        if (overRecycle) recycleBin.classList.add("glow-wrong");
        if (overTrash)   trashBin.classList.add("glow-wrong");
        compostBin.classList.add("glow-correct");
        setHint("Fish bones should go in compost... cmon now", false);
      }

      setTimeout(() => {
        compostBin.classList.remove("glow-correct", "glow-wrong");
        recycleBin.classList.remove("glow-correct", "glow-wrong");
        trashBin.classList.remove("glow-correct", "glow-wrong");
        if (!fishtailTossed && !checkingDone()) setHint("Now sort the fish tail!");
      }, 1400);

      checkAllSorted();
      placeSprites();
      return;
    }

    setHint("Drop it in the correct bin on the right!");
    bonePos = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
    placeSprites();
    return;
  }

  // fishtail drop
  if (dragging === "fishtail") {
    closeAllBins();
    dragging = null;

    const overCompost = pointInZone(zoneCompost, tailPos.x, tailPos.y);
    const overRecycle = pointInZone(zoneRecycle, tailPos.x, tailPos.y);
    const overTrash   = pointInZone(zoneTrash,   tailPos.x, tailPos.y);

    if (overCompost || overRecycle || overTrash) {
      fishtailTossed = true;
      fadeOutPiece(fishtail);

      if (overCompost) {
        compostBin.classList.add("glow-correct");
        setHint("Tail in compost, NICE!", true);
      } else {
        sustainabilityScore -= 1;
        if (overRecycle) recycleBin.classList.add("glow-wrong");
        if (overTrash)   trashBin.classList.add("glow-wrong");
        compostBin.classList.add("glow-correct");
        setHint("HEY! The fish tail should go in compost!", false);
      }

      setTimeout(() => {
        compostBin.classList.remove("glow-correct", "glow-wrong");
        recycleBin.classList.remove("glow-correct", "glow-wrong");
        trashBin.classList.remove("glow-correct", "glow-wrong");
        if (!bonefishTossed && !checkingDone()) setHint("Now sort the fish bones!");
      }, 1400);

      checkAllSorted();
      placeSprites();
      return;
    }

    setHint("Drop it in the correct bin on the right!");
    tailPos = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
    placeSprites();
    return;
  }

  dragging = null;
  placeSprites();
});

// Helper to avoid overwriting the final hint
function checkingDone() {
  return bonefishTossed && fishtailTossed;
}

// init 
(function init() {
  setHint("Grab a fish from the tray!");
  placeSprites();
})();