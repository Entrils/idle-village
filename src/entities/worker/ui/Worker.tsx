import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Workers.module.css";

const getHireCost = (count: number) => 10 + count * 2;

const Workers: React.FC = () => {
  const workers = useSelector((state: RootState) => state.workers);
  const village = useSelector((state: RootState) => state.village);

  const maxWorkers = village.level * 5;
  const totalWorkers =
    workers.lumberjack + workers.miner + workers.hunter;

  return (
    <div className={styles.workersWrapper}>
      <p className={styles.total}>
        Всего: {totalWorkers}/{maxWorkers}
      </p>
      <ul className={styles.workerList}>
        <li className={styles.workerItem}>
          Лесорубы: {workers.lumberjack} (стоимость:{" "}
          {getHireCost(workers.lumberjack)} еды)
        </li>
        <li className={styles.workerItem}>
          Каменотёсы: {workers.miner} (стоимость:{" "}
          {getHireCost(workers.miner)} еды)
        </li>
        <li className={styles.workerItem}>
          Охотники: {workers.hunter} (стоимость:{" "}
          {getHireCost(workers.hunter)} еды)
        </li>
      </ul>
    </div>
  );
};

export default Workers;
