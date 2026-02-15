import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { hireWorker, type WorkerType } from "@/entities/worker/model/workerSlice";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { addNotification } from "@/entities/notifications/model/notificationSlice";
import { getHireCost } from "@/shared/config/gameBalance";
import { playSfx } from "@/shared/lib/sfx";
import styles from "./HireWorkers.module.css";

const workerInfo: Record<
  WorkerType,
  { title: string; action: string; portrait: string }
> = {
  lumberjack: {
    title: "Лесоруб",
    action: "Нанять лесоруба",
    portrait: "/assets/portraits/lesorub.png",
  },
  miner: {
    title: "Каменотёс",
    action: "Нанять каменотёса",
    portrait: "/assets/portraits/shaxter.png",
  },
  hunter: {
    title: "Охотник",
    action: "Нанять охотника",
    portrait: "/assets/portraits/hunter.png",
  },
};

const HireWorkers: React.FC = () => {
  const dispatch = useDispatch();
  const workers = useSelector((state: RootState) => state.workers);
  const village = useSelector((state: RootState) => state.village);
  const resources = useSelector((state: RootState) => state.resources);

  const maxWorkers = village.maxWorkers;
  const totalWorkers = workers.lumberjack + workers.miner + workers.hunter;
  const isLimitReached = totalWorkers >= maxWorkers;

  const handleHire = (type: WorkerType) => {
    if (isLimitReached) {
      playSfx("error");
      dispatch(
        addNotification({
          message: "Лимит работников достигнут.",
          type: "error",
        })
      );
      return;
    }

    const cost = getHireCost(workers[type]);
    if (resources.food < cost) {
      playSfx("error");
      dispatch(
        addNotification({
          message: "Не хватает еды для найма.",
          type: "error",
        })
      );
      return;
    }

    dispatch(hireWorker({ type }));
    dispatch(addResource({ type: "food", amount: -cost }));

    const messageByType = {
      lumberjack: "Нанят лесоруб.",
      miner: "Нанят каменотёс.",
      hunter: "Нанят охотник.",
    } as const;

    playSfx("hire");
    dispatch(
      addNotification({
        message: messageByType[type],
        type: "success",
      })
    );
  };

  return (
    <div className={styles.group}>
      {(Object.keys(workerInfo) as WorkerType[]).map((type) => {
        const info = workerInfo[type];
        const cost = getHireCost(workers[type]);
        const hasFood = resources.food >= cost;
        const isDisabled = isLimitReached || !hasFood;

        let statusText = "Доступно";
        if (isLimitReached) statusText = "Лимит деревни";
        else if (!hasFood) statusText = "Не хватает еды";

        return (
          <article
            key={type}
            className={`${styles.card} ${isDisabled ? styles.cardDisabled : styles.cardReady}`}
          >
            <img src={info.portrait} alt={info.title} className={styles.avatar} />

            <div className={styles.meta}>
              <p className={styles.name}>{info.title}</p>
              <p className={styles.status}>{statusText}</p>
            </div>

            <div className={styles.costRow}>
              <img src="/assets/resources/food.png" alt="Еда" className={styles.costIcon} />
              <span className={styles.costValue}>{cost}</span>
            </div>

            <button
              className={styles.hireButton}
              onClick={() => handleHire(type)}
              disabled={isDisabled}
            >
              {info.action}
            </button>
          </article>
        );
      })}
    </div>
  );
};

export default HireWorkers;
