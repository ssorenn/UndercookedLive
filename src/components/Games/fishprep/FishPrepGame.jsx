import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { saveLevelResult } from "../../../utils/levelProgress";
import Settings from "../../Settings";
import "./styles.css";

import backgroundImg from "../../../assets/sprites/fish-prep/background2.png";
import deadfishImg from "../../../assets/sprites/fish-prep/deadfish.png";
import filletImg from "../../../assets/sprites/fish-prep/fillet.png";
import bonefishImg from "../../../assets/sprites/fish-prep/fishbone2.png";
import fishtailImg from "../../../assets/sprites/fish-prep/fishtail.png";
import knifeImg from "../../../assets/sprites/fish-prep/knife.png";
import compostbinImg from "../../../assets/sprites/fish-prep/compostbin.png";
import recyclebinImg from "../../../assets/sprites/fish-prep/recyclebin.png";
import trashbinImg from "../../../assets/sprites/fish-prep/trashbin.png";
import blankHoneyImg from "../../../assets/sprites/fish-prep/blankhoney.png";
import filledHoneyImg from "../../../assets/sprites/fish-prep/honey2.png";
import settingsCogImg from "../../../assets/settings_cog.png";

// Base design size
const BASE_W = 2048;
const BASE_H = 1559;
const BOARD_LEFT = 369;
const BOARD_TOP = 1006;
const BOARD_W = 737;
const BOARD_H = 377;
const BOARD_CX = BOARD_LEFT + BOARD_W / 2 + 20;
const BOARD_CY = BOARD_TOP + BOARD_H / 2 - 164;
const BONE_INIT_X = BOARD_CX + 60;
const BONE_INIT_Y = BOARD_CY;
const TAIL_INIT_X = BOARD_CX - 220;
const TAIL_INIT_Y = BOARD_CY + 10;
const KNIFE_INIT_X = 1229;
const KNIFE_INIT_Y = BOARD_CY;
const HIT_PAD_X = 200;
const HIT_PAD_Y = 120;
const TRAY_ZONE_X = 100;
const TRAY_ZONE_Y = 30;
const TRAY_ZONE_W = 750;
const TRAY_ZONE_H = 470;
const FISH_TRAY_CX = 450;
const FISH_TRAY_CY = 250;
const BIN_W = 226;
const BIN_H = 207;
const TRAY_CX = 1576;
const COMPOST_CY = 764;
const RECYCLE_CY = 1007;
const TRASH_CY = 1249;

export default function FishPrepGame() {
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [sustainabilityScore, setSustainabilityScore] = useState(3);
  const [stage, setStageState] = useState("grab_fish");
  const [dragging, setDragging] = useState(null);
  const [openBin, setOpenBin] = useState(null);
  const [glowBin, setGlowBin] = useState(null); // { bin, correct }
  const [hint, setHint] = useState("Grab a fish from the tray!");
  const [hintDone, setHintDone] = useState(false);
  const [bonefishTossed, setBonefishTossed] = useState(false);
  const [fishtailTossed, setFishtailTossed] = useState(false);
  const [bonefishVisible, setBonefishVisible] = useState(true);
  const [fishtailVisible, setFishtailVisible] = useState(true);
  const [fishDodged, setFishDodged] = useState(false);
  const [knifeCutting, setKnifeCutting] = useState(false);
  const [filletVisible, setFilletVisible] = useState(false);
  const [deadfishTransform, setDeadfishTransform] = useState("translate(-50%, -50%)");
  const [honeyStars, setHoneyStars] = useState([false, false, false]);

  const sceneRef = useRef(null);
  const stageRef = useRef("grab_fish");
  const fishDodgedRef = useRef(false);
  const knifeCuttingRef = useRef(false);
  const bonefishTossedRef = useRef(false);
  const fishtailTossedRef = useRef(false);
  const sustainabilityRef = useRef(3);
  const draggingRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const knifePosRef = useRef(null);
  const bonePosRef = useRef(null);
  const tailPosRef = useRef(null);
  const fishPosRef = useRef(null);

  // DOM refs
  const deadfishRef = useRef(null);
  const bonefishRef = useRef(null);
  const fishtailRef = useRef(null);
  const filletRef = useRef(null);
  const knifeRef = useRef(null);
  const compostBinRef = useRef(null);
  const recycleBinRef = useRef(null);
  const trashBinRef = useRef(null);
  const zoneCompostRef = useRef(null);
  const zoneRecycleRef = useRef(null);
  const zoneTrashRef = useRef(null);
  const zoneFishtrayRef = useRef(null);
  const cutLineRef = useRef(null);
  const dot0 = useRef(null);
  const dot1 = useRef(null);
  const dot2 = useRef(null);
  const dot3 = useRef(null);

  const sx = useCallback((x) => {
    if (!sceneRef.current) return 0;
    return x * (sceneRef.current.getBoundingClientRect().width / BASE_W);
  }, []);

  const sy = useCallback((y) => {
    if (!sceneRef.current) return 0;
    return y * (sceneRef.current.getBoundingClientRect().height / BASE_H);
  }, []);

  const toLocal = useCallback((clientX, clientY) => {
    const r = sceneRef.current.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }, []);

  const hint_ = useCallback((text, done = false) => {
    setHint(text);
    setHintDone(done);
  }, []);

  const setStage = useCallback((next) => {
    stageRef.current = next;
    setStageState(next);
  }, []);

  const pointInZone = useCallback((zoneEl, x, y) => {
    if (!zoneEl || !sceneRef.current) return false;
    const r = zoneEl.getBoundingClientRect();
    const s = sceneRef.current.getBoundingClientRect();
    return x >= r.left - s.left && x <= r.right - s.left &&
           y >= r.top - s.top && y <= r.bottom - s.top;
  }, []);

  const placeEl = useCallback((el, x, y) => {
    if (!el) return;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }, []);

  const placeBin = useCallback((el, cxBase, cyBase) => {
    if (!el) return;
    el.style.left = `${sx(cxBase)}px`;
    el.style.top = `${sy(cyBase)}px`;
    el.style.width = `${sx(BIN_W)}px`;
    el.style.height = `${sy(BIN_H)}px`;
  }, [sx, sy]);

  const placeZone = useCallback((el, cxBase, cyBase, wBase, hBase) => {
    if (!el) return;
    el.style.left = `${sx(cxBase - wBase / 2)}px`;
    el.style.top = `${sy(cyBase - hBase / 2)}px`;
    el.style.width = `${sx(wBase)}px`;
    el.style.height = `${sy(hBase)}px`;
  }, [sx, sy]);

  const placeSprites = useCallback(() => {
    const cx = sx(BOARD_CX);
    const cy = sy(BOARD_CY);
    const currentStage = stageRef.current;
    const currentDragging = draggingRef.current;

    // deadfish
    if (currentStage === "grab_fish" && currentDragging === "deadfish") {
      placeEl(deadfishRef.current, fishPosRef.current.x, fishPosRef.current.y);
      if (deadfishRef.current) {
        deadfishRef.current.style.opacity = "1";
        deadfishRef.current.style.display = "block";
      }
    } else if (currentStage === "grab_fish") {
      if (deadfishRef.current) deadfishRef.current.style.display = "none";
    } else {
      placeEl(deadfishRef.current, cx, cy);
      if (deadfishRef.current) {
        deadfishRef.current.style.display = "block";
        deadfishRef.current.style.opacity = currentStage === "initial" ? "1" : "0";
      }
    }

    // fillet
    placeEl(filletRef.current, cx, cy);

    // bonefish
    if (bonePosRef.current)
      placeEl(bonefishRef.current, bonePosRef.current.x, bonePosRef.current.y + sy(20));

    // fishtail
    if (tailPosRef.current)
      placeEl(fishtailRef.current, tailPosRef.current.x, tailPosRef.current.y + sy(20));

    // knife
    if (knifePosRef.current)
      placeEl(knifeRef.current, knifePosRef.current.x, knifePosRef.current.y);

    if (knifeRef.current)
      knifeRef.current.style.display = currentStage === "initial" ? "block" : "none";

    // bins
    placeBin(compostBinRef.current, TRAY_CX, COMPOST_CY);
    placeBin(recycleBinRef.current, TRAY_CX, RECYCLE_CY);
    placeBin(trashBinRef.current, TRAY_CX, TRASH_CY);
    placeZone(zoneCompostRef.current, TRAY_CX, COMPOST_CY, 110, 110);
    placeZone(zoneRecycleRef.current, TRAY_CX, RECYCLE_CY, 110, 110);
    placeZone(zoneTrashRef.current, TRAY_CX, TRASH_CY, 110, 110);

    // fish tray zone
    if (zoneFishtrayRef.current) {
      zoneFishtrayRef.current.style.left = `${sx(TRAY_ZONE_X)}px`;
      zoneFishtrayRef.current.style.top = `${sy(TRAY_ZONE_Y)}px`;
      zoneFishtrayRef.current.style.width = `${sx(TRAY_ZONE_W)}px`;
      zoneFishtrayRef.current.style.height = `${sy(TRAY_ZONE_H)}px`;
      zoneFishtrayRef.current.style.display =
        currentStage === "grab_fish" && currentDragging !== "deadfish" ? "block" : "none";
    }

    // dots
    const order = ["grab_fish", "initial", "fish_cut", "fillet_done"];
    const idx = order.indexOf(currentStage);
    const dotRefs = [dot0, dot1, dot2, dot3];
    dotRefs.forEach((d, i) => {
      if (!d.current) return;
      d.current.classList.toggle("on", i <= idx);
      d.current.classList.toggle("current", order[i] === currentStage);
    });
  }, [sx, sy, placeEl, placeBin, placeZone]);

  const initPositions = useCallback(() => {
    knifePosRef.current = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
    bonePosRef.current = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
    tailPosRef.current = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
    fishPosRef.current = { x: sx(FISH_TRAY_CX), y: sy(FISH_TRAY_CY) };
  }, [sx, sy]);

  const triggerGlow = useCallback((bin, correct) => {
    setGlowBin({ bin, correct });
    setTimeout(() => setGlowBin(null), 1400);
  }, []);

  const checkAllSorted = useCallback(() => {
    if (bonefishTossedRef.current && fishtailTossedRef.current) {
      setTimeout(() => {
        setStage("fillet_done");
        setFilletVisible(true);
        if (sustainabilityRef.current === 3) hint_("Perfect! All waste composted!", true);
        setTimeout(() => setShowResults(true), 2800);
      }, 1500);
    }
  }, [setStage, hint_]);

  // Pointer events
  useEffect(() => {
    initPositions();
    placeSprites();

    const onPointerMove = (e) => {
      if (!draggingRef.current) return;
      const p = toLocal(e.clientX, e.clientY);
      const nx = p.x - dragOffsetRef.current.x;
      const ny = p.y - dragOffsetRef.current.y;

      if (draggingRef.current === "deadfish") fishPosRef.current = { x: nx, y: ny };
      if (draggingRef.current === "knife") knifePosRef.current = { x: nx, y: ny };
      if (draggingRef.current === "bonefish") bonePosRef.current = { x: nx, y: ny };
      if (draggingRef.current === "fishtail") tailPosRef.current = { x: nx, y: ny };

      if (draggingRef.current === "bonefish" || draggingRef.current === "fishtail") {
        const pos = draggingRef.current === "bonefish" ? bonePosRef.current : tailPosRef.current;
        if (pointInZone(zoneCompostRef.current, pos.x, pos.y)) setOpenBin("compost");
        else if (pointInZone(zoneRecycleRef.current, pos.x, pos.y)) setOpenBin("recycle");
        else if (pointInZone(zoneTrashRef.current, pos.x, pos.y)) setOpenBin("trash");
        else setOpenBin(null);
      }

      placeSprites();
    };

    const onPointerUp = () => {
      if (!draggingRef.current) return;
      const fishCX = sx(BOARD_CX);
      const fishCY = sy(BOARD_CY);
      setOpenBin(null);

      // deadfish drop
      if (draggingRef.current === "deadfish") {
        draggingRef.current = null;
        setDragging(null);
        const hit = Math.abs(fishPosRef.current.x - fishCX) <= sx(200) &&
                    Math.abs(fishPosRef.current.y - fishCY) <= sy(150);
        if (hit) {
          setStage("initial");
          hint_("Go ahead and pick up the knife and drop it on the fish!");
        } else {
          hint_("Place the fish on the cutting board!");
          if (deadfishRef.current) deadfishRef.current.style.display = "none";
        }
        placeSprites();
        return;
      }

      // knife drop
      if (draggingRef.current === "knife") {
        const hit = Math.abs(knifePosRef.current.x - fishCX) <= sx(HIT_PAD_X) &&
                    Math.abs(knifePosRef.current.y - fishCY) <= sy(HIT_PAD_Y);

        if (hit && !fishDodgedRef.current) {
          fishDodgedRef.current = true;
          setFishDodged(true);
          draggingRef.current = null;
          setDragging(null);

          // fish flop
          const fish = deadfishRef.current;
          if (fish) {
            fish.style.transition = "transform 100ms ease";
            const flops = [
              [100, "translate(-50%,-50%) rotate(15deg) scaleY(0.85)"],
              [200, "translate(-50%,-50%) rotate(-12deg) scaleY(1.15) scaleX(0.9)"],
              [300, "translate(-50%,-50%) rotate(10deg) scaleY(0.8) scaleX(1.1)"],
              [400, "translate(-50%,-50%) rotate(-8deg) scaleY(1.1)"],
              [500, "translate(-50%,-50%) rotate(3deg) scaleY(0.95)"],
              [600, "translate(-50%,-50%) rotate(0deg) scaleY(1)"],
            ];
            flops.forEach(([delay, transform]) => {
              setTimeout(() => {
                if (fish) fish.style.transform = transform;
                if (delay === 600) fish.style.transition = "none";
              }, delay);
            });
          }

          knifePosRef.current = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
          hint_("Looks like there's still some life in the fella. Don't be shy, try again!");
          placeSprites();
          return;
        }

        if (hit && fishDodgedRef.current) {
          knifeCuttingRef.current = true;
          setKnifeCutting(true);
          draggingRef.current = null;
          setDragging(null);
          hint_("Slicing…");

          const knife = knifeRef.current;
          const cutLine = cutLineRef.current;
          if (knife) {
            knife.style.display = "block";
            knife.style.left = `${fishCX}px`;
            knife.style.top = `${fishCY}px`;
            knife.classList.add("knife-slicing");
          }
          if (cutLine) {
            cutLine.style.left = `${fishCX}px`;
            cutLine.style.top = `${fishCY}px`;
            setTimeout(() => cutLine.classList.add("visible"), 250);
          }

          setTimeout(() => {
            if (knife) knife.classList.remove("knife-slicing");
            if (cutLine) cutLine.classList.remove("visible");
            knifePosRef.current = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
            bonePosRef.current = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
            tailPosRef.current = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
            knifeCuttingRef.current = false;
            setKnifeCutting(false);
            setStage("fish_cut");
            setBonefishVisible(true);
            setFishtailVisible(true);
            hint_("Sort the fish waste into the correct bin!");
            placeSprites();
          }, 800);
          return;
        }

        knifePosRef.current = { x: sx(KNIFE_INIT_X), y: sy(KNIFE_INIT_Y) };
        hint_("Don't be scared, he won't bite! Drop the knife directly on the fish.");
        draggingRef.current = null;
        setDragging(null);
        placeSprites();
        return;
      }

      // bonefish drop
      if (draggingRef.current === "bonefish") {
        draggingRef.current = null;
        setDragging(null);
        const overCompost = pointInZone(zoneCompostRef.current, bonePosRef.current.x, bonePosRef.current.y);
        const overRecycle = pointInZone(zoneRecycleRef.current, bonePosRef.current.x, bonePosRef.current.y);
        const overTrash = pointInZone(zoneTrashRef.current, bonePosRef.current.x, bonePosRef.current.y);

        if (overCompost || overRecycle || overTrash) {
          bonefishTossedRef.current = true;
          setBonefishTossed(true);
          setBonefishVisible(false);

          if (overCompost) {
            triggerGlow("compost", true);
            hint_("Bones in compost — nice!", true);
          } else {
            sustainabilityRef.current -= 1;
            setSustainabilityScore(sustainabilityRef.current);
            triggerGlow(overRecycle ? "recycle" : "trash", false);
            hint_("Fish bones should go in compost... cmon now");
          }

          setTimeout(() => {
            if (!fishtailTossedRef.current) hint_("Now sort the fish tail!");
          }, 1400);

          checkAllSorted();
          placeSprites();
          return;
        }

        bonePosRef.current = { x: sx(BONE_INIT_X), y: sy(BONE_INIT_Y) };
        hint_("Drop it in the correct bin on the right!");
        placeSprites();
        return;
      }

      // fishtail drop
      if (draggingRef.current === "fishtail") {
        draggingRef.current = null;
        setDragging(null);
        const overCompost = pointInZone(zoneCompostRef.current, tailPosRef.current.x, tailPosRef.current.y);
        const overRecycle = pointInZone(zoneRecycleRef.current, tailPosRef.current.x, tailPosRef.current.y);
        const overTrash = pointInZone(zoneTrashRef.current, tailPosRef.current.x, tailPosRef.current.y);

        if (overCompost || overRecycle || overTrash) {
          fishtailTossedRef.current = true;
          setFishtailTossed(true);
          setFishtailVisible(false);

          if (overCompost) {
            triggerGlow("compost", true);
            hint_("Tail in compost, NICE!", true);
          } else {
            sustainabilityRef.current -= 1;
            setSustainabilityScore(sustainabilityRef.current);
            triggerGlow(overRecycle ? "recycle" : "trash", false);
            hint_("HEY! The fish tail should go in compost!");
          }

          setTimeout(() => {
            if (!bonefishTossedRef.current) hint_("Now sort the fish bones!");
          }, 1400);

          checkAllSorted();
          placeSprites();
          return;
        }

        tailPosRef.current = { x: sx(TAIL_INIT_X), y: sy(TAIL_INIT_Y) };
        hint_("Drop it in the correct bin on the right!");
        placeSprites();
        return;
      }

      draggingRef.current = null;
      setDragging(null);
      placeSprites();
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", () => { initPositions(); placeSprites(); });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [sx, sy, toLocal, pointInZone, placeSprites, initPositions, setStage, hint_, checkAllSorted, triggerGlow]);

  // Show results - animate stars
  useEffect(() => {
    if (!showResults) return;
    const score = sustainabilityRef.current;
    setHoneyStars([false, false, false]);
    [0, 1, 2].forEach((i) => {
      if (i < score) {
        setTimeout(() => {
          setHoneyStars((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 600 + i * 450);
      }
    });
  }, [showResults]);

  const onFishtrayPointerDown = (e) => {
    if (stageRef.current !== "grab_fish") return;
    e.preventDefault();
    const p = toLocal(e.clientX, e.clientY);
    fishPosRef.current = { x: p.x, y: p.y };
    dragOffsetRef.current = { x: 0, y: 0 };
    draggingRef.current = "deadfish";
    setDragging("deadfish");
    hint_("Drop the fish on the cutting board!");
    placeSprites();
  };

  const onKnifePointerDown = (e) => {
    if (stageRef.current !== "initial" || knifeCuttingRef.current) return;
    e.preventDefault();
    const p = toLocal(e.clientX, e.clientY);
    dragOffsetRef.current = { x: p.x - knifePosRef.current.x, y: p.y - knifePosRef.current.y };
    draggingRef.current = "knife";
    setDragging("knife");
    if (knifeRef.current) knifeRef.current.style.width = "clamp(70px, 12vw, 120px)";
    hint_("Drop the knife onto the fish!");
    placeSprites();
  };

  const onBonefishPointerDown = (e) => {
    if (stageRef.current !== "fish_cut" || bonefishTossedRef.current) return;
    e.preventDefault();
    const p = toLocal(e.clientX, e.clientY);
    dragOffsetRef.current = { x: p.x - bonePosRef.current.x, y: p.y - bonePosRef.current.y };
    draggingRef.current = "bonefish";
    setDragging("bonefish");
    hint_("Drop the fish bones into the correct bin!");
    placeSprites();
  };

  const onFishtailPointerDown = (e) => {
    if (stageRef.current !== "fish_cut" || fishtailTossedRef.current) return;
    e.preventDefault();
    const p = toLocal(e.clientX, e.clientY);
    dragOffsetRef.current = { x: p.x - tailPosRef.current.x, y: p.y - tailPosRef.current.y };
    draggingRef.current = "fishtail";
    setDragging("fishtail");
    hint_("Drop the fish tail into the correct bin!");
    placeSprites();
  };

  const handleContinue = () => {
    saveLevelResult(2, sustainabilityRef.current);
    navigate("/level-selection");
  };

  const getBinClass = (binName) => {
    let cls = "bin";
    if (openBin === binName) cls += " open";
    if (glowBin?.bin === binName) cls += glowBin.correct ? " glow-correct" : " glow-wrong";
    if (glowBin?.correct && binName === "compost" && glowBin?.bin !== "compost") cls += " glow-correct";
    return cls;
  };

  const messages = {
    3: "Perfect! You composted all the fish waste. Great sustainability practice!",
    2: "Almost! One piece went to the wrong bin. Fish waste belongs in compost!",
    1: "Both pieces went to the wrong bins. Remember: fish waste is compostable!",
  };

  return (
    <div className="page">
      <div id="scene" className="scene" ref={sceneRef}
        style={{ backgroundImage: `url(${backgroundImg})` }}>

        <div id="hint" className="hint" style={{
          background: hintDone ? "rgba(74,124,89,0.85)" : "rgba(184,92,32,0.85)"
        }}>{hint}</div>

        {/* Fish tray zone */}
        <div ref={zoneFishtrayRef} className="fishTrayZone"
          onPointerDown={onFishtrayPointerDown} />

        {/* Sprites */}
        <img ref={deadfishRef} id="deadfish" className="sprite" src={deadfishImg}
          draggable="false" style={{ display: "none", transform: deadfishTransform }} />

        <div ref={cutLineRef} id="cut-line" className="cut-line" />

        <img ref={filletRef} id="fillet" className={`sprite fillet${filletVisible ? " visible" : ""}`}
          src={filletImg} draggable="false"
          style={{ display: filletVisible ? "block" : "none" }} />

        <img ref={bonefishRef} id="bonefish" className="sprite bonefish" src={bonefishImg}
          draggable="false"
          onPointerDown={onBonefishPointerDown}
          style={{
            display: (stage === "fish_cut" || stage === "fillet_done") && bonefishVisible ? "block" : "none",
            cursor: bonefishTossed ? "default" : dragging === "bonefish" ? "grabbing" : "grab",
            transform: dragging === "bonefish"
              ? "translate(-50%,-50%) rotate(-6deg) scale(1.04)"
              : "translate(-50%,-50%)",
            filter: dragging === "bonefish" ? "drop-shadow(0 8px 16px rgba(0,0,0,0.35))" : "none",
          }} />

        <img ref={fishtailRef} id="fishtail" className="sprite fishtail" src={fishtailImg}
          draggable="false"
          onPointerDown={onFishtailPointerDown}
          style={{
            display: (stage === "fish_cut" || stage === "fillet_done") && fishtailVisible ? "block" : "none",
            cursor: fishtailTossed ? "default" : dragging === "fishtail" ? "grabbing" : "grab",
            transform: dragging === "fishtail"
              ? "translate(-50%,-50%) rotate(5deg) scale(1.06)"
              : "translate(-50%,-50%)",
            filter: dragging === "fishtail" ? "drop-shadow(0 8px 16px rgba(0,0,0,0.35))" : "none",
          }} />

        <img ref={knifeRef} id="knife" className="sprite knife" src={knifeImg}
          draggable="false"
          onPointerDown={onKnifePointerDown}
          style={{
            display: stage === "initial" ? "block" : "none",
            cursor: knifeCutting ? "default" : dragging === "knife" ? "grabbing" : "grab",
            transform: dragging === "knife"
              ? "translate(-50%,-50%) rotate(-10deg) scale(1.06) scaleX(-1)"
              : "translate(-50%,-50%) scaleX(-1)",
            filter: dragging === "knife" ? "drop-shadow(0 8px 20px rgba(0,0,0,0.4))" : "none",
          }} />

        {/* Bins */}
        <img ref={compostBinRef} className={getBinClass("compost")} src={compostbinImg} />
        <img ref={recycleBinRef} className={getBinClass("recycle")} src={recyclebinImg} />
        <img ref={trashBinRef} className={getBinClass("trash")} src={trashbinImg} />

        <div ref={zoneCompostRef} className="binZone" />
        <div ref={zoneRecycleRef} className="binZone" />
        <div ref={zoneTrashRef} className="binZone" />

        {/* Dots */}
        <div className="dots">
          <div ref={dot0} className="dot" />
          <div ref={dot1} className="dot" />
          <div ref={dot2} className="dot" />
          <div ref={dot3} className="dot" />
        </div>

        {/* Results overlay */}
        <div id="results-overlay" className={`results-overlay${showResults ? "" : " hidden"}`}>
          <div className="results-card">
            <h2 className="results-title">Fish Prep Complete!</h2>
            <div className="results-subtitle">Sustainability Rating</div>
            <div className="results-stars" id="results-stars">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`honey${honeyStars[i] ? " earned" : ""}`}>
                  <img src={honeyStars[i] ? filledHoneyImg : blankHoneyImg} />
                </div>
              ))}
            </div>
            <div className="results-message">
              {messages[sustainabilityScore] || messages[1]}
            </div>
            <button className="results-btn" onClick={handleContinue}>Continue</button>
          </div>
        </div>

        {/* Settings button */}
        <button onClick={() => setShowSettings(true)} title="Settings"
          style={{
            position: "absolute", top: "14px", right: "14px", zIndex: 30,
            width: "46px", height: "46px",
            background: "rgba(255,255,255,0.22)",
            backdropFilter: "blur(14px) saturate(1.6)",
            WebkitBackdropFilter: "blur(14px) saturate(1.6)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "14px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) rotate(22deg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.45)";
          }}>
          <img src={settingsCogImg} alt="settings"
            style={{ width: "26px", height: "26px", objectFit: "contain" }} />
        </button>
      </div>

      {showSettings && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60 }}>
          <Settings
            onClose={() => setShowSettings(false)}
            extraButtons={
              <button
                onClick={() => navigate("/level-selection")}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  padding: "14px 38px", fontSize: "20px", borderRadius: "18px",
                  border: "none", backgroundColor: "#c0392b", color: "white",
                  cursor: "pointer", boxShadow: "0 8px 15px rgba(0,0,0,0.15)",
                  fontFamily: "'Fredoka One', cursive", transition: "transform 0.1s ease",
                }}>
                Main Menu
              </button>
            }
          />
        </div>
      )}
    </div>
  );
}