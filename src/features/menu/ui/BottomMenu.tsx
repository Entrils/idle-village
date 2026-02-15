import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Workers from "@/entities/worker/ui/Worker";
import VillageUpgrade from "@/features/village/ui/VillageUpgrade";
import Goals from "@/entities/goals/ui/Goals";
import HireWorkers from "@/features/hire/ui/HireWorkers";
import ResetButton from "@/features/reset/ui/ResetButton";

type ModalName = "workers" | "village" | "goals" | "settings" | null;

type MenuItem = {
  id: Exclude<ModalName, null>;
  title: string;
  subtitle: string;
  icon?: string;
  iconLabel?: string;
};

type BottomMenuProps = {
  isSfxOn: boolean;
  masterVolume: number;
  effectsVolume: number;
  onToggleSfx: () => void;
  onMasterVolumeChange: (value: number) => void;
  onEffectsVolumeChange: (value: number) => void;
};

const MODAL_ANIMATION_MS = 240;
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const menuItems: MenuItem[] = [
  {
    id: "workers",
    title: "Рабочие",
    subtitle: "Найм и роли",
    icon: "/assets/icons/hire.png",
  },
  {
    id: "village",
    title: "Деревня",
    subtitle: "Улучшения",
    icon: "/assets/icons/townhall.png",
  },
  {
    id: "goals",
    title: "Цели",
    subtitle: "Квесты и награды",
    icon: "/assets/icons/quests.png",
  },
  {
    id: "settings",
    title: "Настройки",
    subtitle: "Звук и сброс",
    icon: "/assets/icons/setting.png",
  },
];

const BottomMenu: React.FC<BottomMenuProps> = ({
  isSfxOn,
  masterVolume,
  effectsVolume,
  onToggleSfx,
  onMasterVolumeChange,
  onEffectsVolumeChange,
}) => {
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  const modalCardRef = useRef<HTMLElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isModalClosing) return;

    const timer = setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
      lastTriggerRef.current?.focus();
    }, MODAL_ANIMATION_MS);

    return () => clearTimeout(timer);
  }, [isModalClosing]);

  const openModal = useCallback((name: Exclude<ModalName, null>, trigger: HTMLButtonElement) => {
    lastTriggerRef.current = trigger;
    setActiveModal(name);
    setIsModalClosing(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalClosing((prev) => {
      if (prev) return prev;
      if (!activeModal) return prev;
      return true;
    });
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal || isModalClosing) return;

    const modalCard = modalCardRef.current;
    if (!modalCard) return;

    const focusables = Array.from(modalCard.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      modalCard.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key !== "Tab") return;

      const currentFocusables = Array.from(modalCard.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

      if (currentFocusables.length === 0) {
        event.preventDefault();
        modalCard.focus();
        return;
      }

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !modalCard.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, isModalClosing, closeModal]);

  useEffect(() => {
    if (!activeModal) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

  const modalTitle = useMemo(() => {
    if (activeModal === "workers") return "Рабочие";
    if (activeModal === "village") return "Деревня";
    if (activeModal === "goals") return "Цели";
    if (activeModal === "settings") return "Настройки";
    return "";
  }, [activeModal]);

  return (
    <>
      <section className="bottomMenu">
        <div className="dockMeta">
          <p className="dockTitle">Меню деревни</p>
          <p className="dockHint">Открой раздел для управления прогрессом</p>
        </div>

        <div className="dockActions">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`menuCard ${activeModal === item.id && !isModalClosing ? "active" : ""}`}
              onClick={(event) => openModal(item.id, event.currentTarget)}
            >
              {item.icon ? (
                <img src={item.icon} alt="" className="menuIcon" />
              ) : (
                <span className="menuIcon menuIconLabel">{item.iconLabel}</span>
              )}
              <span className="menuText">
                <span className="menuTitle">{item.title}</span>
                <span className="menuSubtitle">{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {activeModal && (
        <div className={`modalOverlay ${isModalClosing ? "closing" : ""}`} onClick={closeModal}>
          <section
            ref={modalCardRef}
            className="modalCard"
            onClick={(event) => event.stopPropagation()}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
            aria-label={modalTitle}
          >
            <header className="modalHeader">
              <h2 className="modalTitle">{modalTitle}</h2>
              <button className="closeButton" onClick={closeModal}>
                Закрыть
              </button>
            </header>

            <div className="modalBody">
              {activeModal === "workers" && (
                <>
                  <Workers />
                  <HireWorkers />
                </>
              )}

              {activeModal === "village" && <VillageUpgrade />}

              {activeModal === "goals" && <Goals />}

              {activeModal === "settings" && (
                <>
                  <div className="settingsControls">
                    <button className={`sfxButton ${isSfxOn ? "on" : "off"}`} onClick={onToggleSfx}>
                      SFX: {isSfxOn ? "ON" : "OFF"}
                    </button>

                    <label className="volumeControl settingsVolumeControl">
                      Master
                      <input
                        className="volumeRange settingsVolumeRange"
                        type="range"
                        min={0}
                        max={100}
                        value={masterVolume}
                        onChange={(event) => onMasterVolumeChange(Number(event.target.value))}
                      />
                    </label>

                    <label className="volumeControl settingsVolumeControl">
                      FX
                      <input
                        className="volumeRange settingsVolumeRange"
                        type="range"
                        min={0}
                        max={100}
                        value={effectsVolume}
                        onChange={(event) => onEffectsVolumeChange(Number(event.target.value))}
                      />
                    </label>
                  </div>

                  <div className="resetWrap">
                    <ResetButton />
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default BottomMenu;

