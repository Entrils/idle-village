import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { removeNotification } from "../model/notificationSlice";
import styles from "./Notifications.module.css";

const NOTIFICATION_LIFETIME = 2000;

const NotificationItem: React.FC<{
  id: string;
  message: string;
  type: "success" | "error" | "info" | "achievement";
  onClose: (id: string) => void;
}> = ({ id, message, type, onClose }) => {
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // запускаем анимацию после монтирования
    requestAnimationFrame(() => setAnimate(true));

    // таймер для удаления
    timerRef.current = setTimeout(() => {
      onClose(id);
    }, NOTIFICATION_LIFETIME);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span>{message}</span>
      <span onClick={() => onClose(id)} className={styles.close}>
        ×
      </span>

      {/* прогресс-бар */}
      <div className={styles.progressBarWrapper}>
        <div
          className={`${styles.progressBar} ${animate ? styles.animate : ""}`}
        ></div>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const notifications = useSelector(
    (state: RootState) => state.notifications.list
  );
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          id={n.id}
          message={n.message}
          type={n.type}
          onClose={(id) => dispatch(removeNotification(id))}
        />
      ))}
    </div>
  );
};

export default Notifications;
