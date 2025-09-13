import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import styles from "./Resources.module.css";

const Resources: React.FC = () => {
  const resources = useSelector((state: RootState) => state.resources);

  return (
    <ul className={styles.resourceList}>
      <li className={styles.resourceItem}>🌲 Дерево: {resources.wood}</li>
      <li className={styles.resourceItem}>🪨 Камень: {resources.stone}</li>
      <li className={styles.resourceItem}>🍖 Еда: {resources.food}</li>
      <li className={styles.resourceItem}>💰 Золото: {resources.gold}</li>
    </ul>
  );
};

export default Resources;
