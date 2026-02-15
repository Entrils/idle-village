import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import Resources from "@/entities/resource/ui/Resources";
import GatherButtons from "@/features/gather/ui/GatherButtons";
import BottomMenu from "@/features/menu/ui/BottomMenu";
import Notifications from "@/entities/notifications/ui/Notifications";
import { addNotification } from "@/entities/notifications/model/notificationSlice";
import { DAY_FOOD_BONUS, NIGHT_GOLD_BONUS } from "@/shared/config/gameBalance";
import {
  getEffectsVolume,
  getMasterVolume,
  getSfxEnabled,
  setEffectsVolume,
  setMasterVolume,
  setSfxEnabled,
} from "@/shared/lib/sfx";
import { useAutoGather } from "@/shared/hooks/useAutoGather";
import { useGoalsChecker } from "@/shared/hooks/useGoalsChecker";
import "./App.css";

const DAY_NIGHT_PHASE_MS = 15 * 60 * 1000;
const FULL_DAY_MS = DAY_NIGHT_PHASE_MS * 2;
const MINUTES_IN_DAY = 24 * 60;
const GAME_DAY_START_MINUTES = 8 * 60;
const GAME_TIME_STORAGE_KEY = "idle-village:game-time";

type PersistedGameTime = {
  phaseStartedAt: number;
  gameStartedAt: number;
  isNight: boolean;
};

function loadPersistedGameTime(): PersistedGameTime | null {
  try {
    const raw = localStorage.getItem(GAME_TIME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedGameTime>;
    if (
      typeof parsed.phaseStartedAt !== "number" ||
      typeof parsed.gameStartedAt !== "number" ||
      typeof parsed.isNight !== "boolean"
    ) {
      return null;
    }
    return {
      phaseStartedAt: parsed.phaseStartedAt,
      gameStartedAt: parsed.gameStartedAt,
      isNight: parsed.isNight,
    };
  } catch {
    return null;
  }
}

function savePersistedGameTime(state: PersistedGameTime): void {
  try {
    localStorage.setItem(GAME_TIME_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage write errors (private mode / quota)
  }
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatGameTime(totalMinutes: number): string {
  const minutesInDay = ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(minutesInDay / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (minutesInDay % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

function calculateGameMinutes(elapsedMs: number): number {
  const dayProgressMinutes = Math.floor((elapsedMs / FULL_DAY_MS) * MINUTES_IN_DAY);
  return (GAME_DAY_START_MINUTES + dayProgressMinutes) % MINUTES_IN_DAY;
}

const App: React.FC = () => {
  const dispatch = useDispatch();
  const persistedTime = useMemo(() => loadPersistedGameTime(), []);
  const now = Date.now();
  const initialPhaseStartedAt = persistedTime?.phaseStartedAt ?? now;
  const initialGameStartedAt = persistedTime?.gameStartedAt ?? now;
  const [isNight, setIsNight] = useState(persistedTime?.isNight ?? false);
  const isNightRef = useRef<boolean>(persistedTime?.isNight ?? false);
  const phaseStartedAtRef = useRef<number>(initialPhaseStartedAt);
  const gameStartedAtRef = useRef<number>(initialGameStartedAt);
  const [secondsUntilSwitch, setSecondsUntilSwitch] = useState(() => {
    const elapsedInCurrentPhase = now - initialPhaseStartedAt;
    const remainMs = Math.max(0, DAY_NIGHT_PHASE_MS - elapsedInCurrentPhase);
    return Math.ceil(remainMs / 1000);
  });
  const [gameTimeMinutes, setGameTimeMinutes] = useState(() =>
    calculateGameMinutes(now - initialGameStartedAt)
  );

  const [isSfxOn, setIsSfxOn] = useState(() => getSfxEnabled());
  const [masterVolume, setMasterVolumeState] = useState(() => Math.round(getMasterVolume() * 100));
  const [effectsVolume, setEffectsVolumeState] = useState(() => Math.round(getEffectsVolume() * 100));

  useAutoGather(isNight);
  useGoalsChecker();

  useEffect(() => {
    isNightRef.current = isNight;
  }, [isNight]);

  useEffect(() => {
    savePersistedGameTime({
      phaseStartedAt: phaseStartedAtRef.current,
      gameStartedAt: gameStartedAtRef.current,
      isNight: isNightRef.current,
    });
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const elapsedSinceGameStart = now - gameStartedAtRef.current;
      const elapsed = now - phaseStartedAtRef.current;
      const transitionsCount = Math.floor(elapsed / DAY_NIGHT_PHASE_MS);

      if (transitionsCount > 0) {
        phaseStartedAtRef.current += transitionsCount * DAY_NIGHT_PHASE_MS;

        if (transitionsCount % 2 === 1) {
          const nextIsNight = !isNightRef.current;
          isNightRef.current = nextIsNight;
          setIsNight(nextIsNight);
          dispatch(
            addNotification({
              message: nextIsNight
                ? `Наступила ночь. Золото приносит +${NIGHT_GOLD_BONUS}.`
                : `Наступило утро. Еда приносит +${DAY_FOOD_BONUS}.`,
              type: "info",
            })
          );
        }

        savePersistedGameTime({
          phaseStartedAt: phaseStartedAtRef.current,
          gameStartedAt: gameStartedAtRef.current,
          isNight: isNightRef.current,
        });
      }

      const elapsedInCurrentPhase = now - phaseStartedAtRef.current;
      const remainMs = Math.max(0, DAY_NIGHT_PHASE_MS - elapsedInCurrentPhase);
      setSecondsUntilSwitch(Math.ceil(remainMs / 1000));

      const nextGameTimeMinutes = calculateGameMinutes(elapsedSinceGameStart);
      setGameTimeMinutes(nextGameTimeMinutes);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [dispatch]);

  useEffect(() => {
    setSfxEnabled(isSfxOn);
  }, [isSfxOn]);

  useEffect(() => {
    setMasterVolume(masterVolume / 100);
  }, [masterVolume]);

  useEffect(() => {
    setEffectsVolume(effectsVolume / 100);
  }, [effectsVolume]);

  const countdown = useMemo(() => formatCountdown(secondsUntilSwitch), [secondsUntilSwitch]);
  const gameTime = useMemo(() => formatGameTime(gameTimeMinutes), [gameTimeMinutes]);

  return (
    <div className={`app ${isNight ? "night" : "day"}`}>
      <header className="topBar">
        <div>
          <p className="eyebrow">Симулятор деревни</p>
          <h1 className="title">Entrils: Idle Village</h1>
        </div>

        <div className="topControls">
          <div className={`timeBadge ${isNight ? "night" : "day"}`}>
            <span className="gameClock">Время: {gameTime}</span>
            <span className="timePhase">{isNight ? "Ночь" : "День"}</span>
            <span className="timeCountdown">До смены: {countdown}</span>
          </div>
        </div>
      </header>

      <aside className="resourcesPanel">
        <Resources compact />
      </aside>

      <GatherButtons isNight={isNight} />
      <BottomMenu
        isSfxOn={isSfxOn}
        masterVolume={masterVolume}
        effectsVolume={effectsVolume}
        onToggleSfx={() => setIsSfxOn((prev) => !prev)}
        onMasterVolumeChange={setMasterVolumeState}
        onEffectsVolumeChange={setEffectsVolumeState}
      />

      <Notifications />
    </div>
  );
};

export default App;
