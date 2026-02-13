import React, { useEffect, useMemo, useState } from "react";
import Resources from "@/entities/resource/ui/Resources";
import Workers from "@/entities/worker/ui/Worker";
import VillageUpgrade from "@/features/village/ui/VillageUpgrade";
import Goals from "@/entities/goals/ui/Goals";
import GatherButtons from "@/features/gather/ui/GatherButtons";
import HireWorkers from "@/features/hire/ui/HireWorkers";
import ResetButton from "@/features/reset/ui/ResetButton";
import Notifications from "@/entities/notifications/ui/Notifications";
import { useAutoGather } from "@/shared/hooks/useAutoGather";
import { useGoalsChecker } from "@/shared/hooks/useGoalsChecker";
import "./App.css";

type ModalName = "workers" | "village" | "goals" | null;

const MODAL_ANIMATION_MS = 240;

const menuItems: Array<{
  id: Exclude<ModalName, null>;
  title: string;
  subtitle: string;
  icon: string;
}> = [
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
];

const App: React.FC = () => {
  useAutoGather();
  useGoalsChecker();

  const [isNight, setIsNight] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);

  useEffect(() => {
    if (!isModalClosing) return;

    const timer = setTimeout(() => {
      setActiveModal(null);
      setIsModalClosing(false);
    }, MODAL_ANIMATION_MS);

    return () => clearTimeout(timer);
  }, [isModalClosing]);

  const openModal = (name: Exclude<ModalName, null>) => {
    setActiveModal(name);
    setIsModalClosing(false);
  };

  const closeModal = () => {
    if (!activeModal || isModalClosing) return;
    setIsModalClosing(true);
  };

  const modalTitle = useMemo(() => {
    if (activeModal === "workers") return "Рабочие";
    if (activeModal === "village") return "Деревня";
    if (activeModal === "goals") return "Цели";
    return "";
  }, [activeModal]);

  return (
    <div className={`app ${isNight ? "night" : "day"}`}>
      <header className="topBar">
        <div>
          <p className="eyebrow">Симулятор деревни</p>
          <h1 className="title">Entrils: Idle Village</h1>
        </div>
        <button className="modeButton" onClick={() => setIsNight((prev) => !prev)}>
          {isNight ? "Дневной режим" : "Ночной режим"}
        </button>
      </header>

      <aside className="resourcesPanel">
        <Resources compact />
      </aside>

      <GatherButtons />

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
              onClick={() => openModal(item.id)}
            >
              <img src={item.icon} alt="" className="menuIcon" />
              <span className="menuText">
                <span className="menuTitle">{item.title}</span>
                <span className="menuSubtitle">{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {activeModal && (
        <div
          className={`modalOverlay ${isModalClosing ? "closing" : ""}`}
          onClick={closeModal}
        >
          <section className="modalCard" onClick={(event) => event.stopPropagation()}>
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

              {activeModal === "village" && (
                <>
                  <VillageUpgrade />
                  <div className="resetWrap">
                    <ResetButton />
                  </div>
                </>
              )}

              {activeModal === "goals" && <Goals />}
            </div>
          </section>
        </div>
      )}

      <Notifications />
    </div>
  );
};

export default App;
