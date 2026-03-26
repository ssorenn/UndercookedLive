const STORAGE_KEY = "undercookedLevelProgress";
const TOTAL_LEVELS = 9;

function getLevelName(levelId) {
  const names = {
    1: "Let's clean and collect fish!",
    2: "Prepare Your Fish",
    3: "Stack the Sushi",
    4: "Trash Sorting",
    5: "River Rescue",
    6: "Forest Cleanup",
    7: "Sorting Sprint",
    8: "Bear Builder",
    9: "Clean Air Quest",
  };

  return names[levelId] || `Level ${levelId}`;
}

function buildDefaultProgress() {
  return Array.from({ length: TOTAL_LEVELS }, (_, index) => ({
    id: index + 1,
    name: getLevelName(index + 1),
    stars: 0,
    unlocked: index === 0,
  }));
}

export function getLevelProgress() {
  const savedProgress = localStorage.getItem(STORAGE_KEY);

  if (!savedProgress) {
    const defaultProgress = buildDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
    return defaultProgress;
  }

  try {
    const parsedProgress = JSON.parse(savedProgress);

    if (!Array.isArray(parsedProgress) || parsedProgress.length !== TOTAL_LEVELS) {
      const defaultProgress = buildDefaultProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }

    return parsedProgress.map((level, index) => ({
      id: index + 1,
      name: getLevelName(index + 1),
      stars: Number(level.stars) || 0,
      unlocked: index === 0 ? true : Boolean(level.unlocked),
    }));
  } catch {
    const defaultProgress = buildDefaultProgress();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
    return defaultProgress;
  }
}

export function saveLevelResult(levelId, earnedStars) {
  const progress = getLevelProgress();
  const levelIndex = progress.findIndex((level) => level.id === levelId);

  if (levelIndex === -1) {
    return progress;
  }

  progress[levelIndex].stars = Math.max(progress[levelIndex].stars, earnedStars);

  if (earnedStars > 0 && levelIndex + 1 < progress.length) {
    progress[levelIndex + 1].unlocked = true;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  return progress;
}

export function resetLevelProgress() {
  const defaultProgress = buildDefaultProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProgress));
  return defaultProgress;
}

/*
  ===== Supabase version for later =====

  import { supabase } from "../supabase";

  export async function fetchLevelProgressFromSupabase(userId) {
    const { data, error } = await supabase
      .from("level_progress")
      .select("*")
      .eq("user_id", userId)
      .order("level_id", { ascending: true });

    if (error || !data?.length) {
      return buildDefaultProgress();
    }

    return Array.from({ length: TOTAL_LEVELS }, (_, index) => {
      const levelId = index + 1;
      const row = data.find((item) => item.level_id === levelId);

      return {
        id: levelId,
        name: getLevelName(levelId),
        stars: row?.stars ?? 0,
        unlocked: levelId === 1 ? true : Boolean(row?.unlocked),
      };
    });
  }

  export async function saveLevelResultToSupabase(userId, levelId, earnedStars) {
    const currentProgress = await fetchLevelProgressFromSupabase(userId);
    const levelIndex = currentProgress.findIndex((level) => level.id === levelId);

    if (levelIndex === -1) return;

    const currentStars = currentProgress[levelIndex].stars;
    const bestStars = Math.max(currentStars, earnedStars);

    await supabase.from("level_progress").upsert({
      user_id: userId,
      level_id: levelId,
      stars: bestStars,
      unlocked: true,
    });

    if (earnedStars > 0 && levelId < TOTAL_LEVELS) {
      await supabase.from("level_progress").upsert({
        user_id: userId,
        level_id: levelId + 1,
        unlocked: true,
      });
    }
  }
*/