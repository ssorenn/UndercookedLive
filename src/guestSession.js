// src/guestSession.js

const KEY = "guest_profile";

export function getGuestProfile() {
  const raw = sessionStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function isGuestMode() {
  return !!getGuestProfile();
}

export function startGuestMode(partial = {}) {
  const guest = {
    user_id: "guest",
    display_name: partial.display_name ?? "Guest",
    sustain_score: partial.sustain_score ?? 0,
    mon_score: partial.mon_score ?? 0,
    level: partial.level ?? 1,
    created_at: partial.created_at ?? new Date().toISOString(),
    updated_at: partial.updated_at ?? new Date().toISOString(),
  };

  sessionStorage.setItem(KEY, JSON.stringify(guest));
  return guest;
}

export function updateGuestProfile(patch = {}) {
  const cur = getGuestProfile();
  if (!cur) return null;

  const next = {
    ...cur,
    ...patch,
    updated_at: new Date().toISOString(),
  };

  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function endGuestMode() {
  sessionStorage.removeItem(KEY);
}
