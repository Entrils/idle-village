import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Resources.module.css";

const resourceIcons = {
  wood: "/assets/resources/wood.png",
  stone: "/assets/resources/stone.png",
  food: "/assets/resources/food.png",
  gold: "/assets/resources/gold.png",
} as const;

const Resources: React.FC = () => {
  const resources = useSelector((state: RootState) => state.resources);

  return (
    <ul className={styles.resourceList}>
      <li className={styles.resourceItem}>
        <span className={styles.labelWrap}>
          <img src={resourceIcons.wood} alt="Дерево" className={styles.icon} />
          <span className={styles.label}>Дерево</span>
        </span>
        <strong>{resources.wood}</strong>
      </li>

      <li className={styles.resourceItem}>
        <span className={styles.labelWrap}>
          <img src={resourceIcons.stone} alt="Камень" className={styles.icon} />
          <span className={styles.label}>Камень</span>
        </span>
        <strong>{resources.stone}</strong>
      </li>

      <li className={styles.resourceItem}>
        <span className={styles.labelWrap}>
          <img src={resourceIcons.food} alt="Еда" className={styles.icon} />
          <span className={styles.label}>Еда</span>
        </span>
        <strong>{resources.food}</strong>
      </li>

      <li className={styles.resourceItem}>
        <span className={styles.labelWrap}>
          <img src={resourceIcons.gold} alt="Золото" className={styles.icon} />
          <span className={styles.label}>Золото</span>
        </span>
        <strong>{resources.gold}</strong>
      </li>
    </ul>
  );
};

export default Resources;
