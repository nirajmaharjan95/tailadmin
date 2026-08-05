import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const DEFAULT_INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000;

// Last-activity is kept in localStorage (not component state) so all open
// tabs share one inactivity window: activity in any tab resets the timer
// for every tab, and the `storage` event keeps their timers in sync.
const LAST_ACTIVITY_STORAGE_KEY = "auth:last-activity-at";

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "touchstart",
  "scroll",
  "wheel",
];

// Throttle localStorage writes so continuous mousemove does not write on
// every event; 1s granularity is negligible against a 10-minute window.
const ACTIVITY_WRITE_INTERVAL_MS = 1000;

// Signs the user out and redirects to /signin after `timeoutMs` of
// inactivity across all tabs. The timeout is configurable so tests can use
// a short duration; production callers must use the 10-minute default.
export const useInactivitySignOut = (
  timeoutMs = DEFAULT_INACTIVITY_TIMEOUT_MS
) => {
  const { status, signOut } = useAuth();
  const navigate = useNavigate();
  const isSignedIn = status === "authenticated";

  useEffect(() => {
    if (!isSignedIn) return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastWriteAt = 0;

    const readLastActivity = (): number => {
      const raw = localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY);
      const value = raw ? Number(raw) : NaN;
      return Number.isFinite(value) ? value : Date.now();
    };

    const scheduleExpiryCheck = () => {
      clearTimeout(timer);
      const remaining = timeoutMs - (Date.now() - readLastActivity());
      if (remaining <= 0) {
        localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY);
        signOut().finally(() => navigate("/signin"));
        return;
      }
      timer = setTimeout(scheduleExpiryCheck, remaining);
    };

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastWriteAt < ACTIVITY_WRITE_INTERVAL_MS) return;
      lastWriteAt = now;
      localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now));
      scheduleExpiryCheck();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === LAST_ACTIVITY_STORAGE_KEY) scheduleExpiryCheck();
    };

    localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()));
    scheduleExpiryCheck();
    ACTIVITY_EVENTS.forEach(eventName =>
      window.addEventListener(eventName, recordActivity, { passive: true })
    );
    window.addEventListener("storage", onStorage);

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach(eventName =>
        window.removeEventListener(eventName, recordActivity)
      );
      window.removeEventListener("storage", onStorage);
    };
  }, [isSignedIn, signOut, navigate, timeoutMs]);
};
