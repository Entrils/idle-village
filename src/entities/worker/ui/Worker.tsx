import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Workers.module.css";

const getHireCost = (count: number) => 10 + count * 2;

const portraits = {
  lumberjack: "/assets/portraits/lesorub.png",
  miner: "/assets/portraits/shaxter.png",
  hunter: "/assets/portraits/hunter.png",
} as const;

const Workers: React.FC = () => {
  const workers = useSelector((state: RootState) => state.workers);
  const village = useSelector((state: RootState) => state.village);

  const maxWorkers = village.maxWorkers;
  const totalWorkers = workers.lumberjack + workers.miner + workers.hunter;

  return (
    <div className={styles.workersWrapper}>
      <p className={styles.total}>
        Население: {totalWorkers}/{maxWorkers}
      </p>

      <ul className={styles.workerList}>
        <li className={styles.workerItem}>
          <img src={portraits.lumberjack} alt="Лесоруб" className={styles.avatar} />
          <div className={styles.meta}>
            <p className={styles.name}>Лесорубы: {workers.lumberjack}</p>
            <p className={styles.cost}>Найм: {getHireCost(workers.lumberjack)} еды</p>
          </div>
        </li>

        <li className={styles.workerItem}>
          <img src={portraits.miner} alt="Каменотёс" className={styles.avatar} />
          <div className={styles.meta}>
            <p className={styles.name}>Каменотёсы: {workers.miner}</p>
            <p className={styles.cost}>Найм: {getHireCost(workers.miner)} еды</p>
          </div>
        </li>

        <li className={styles.workerItem}>
          <img src={portraits.hunter} alt="Охотник" className={styles.avatar} />
          <div className={styles.meta}>
            <p className={styles.name}>Охотники: {workers.hunter}</p>
            <p className={styles.cost}>Найм: {getHireCost(workers.hunter)} еды</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Workers;
