import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { removeNotification } from "../model/notificationSlice";
import styles from "./Notifications.module.css";

const NOTIFICATION_LIFETIME = 2000;
const PROGRESS_TICK_MS = 50;

const NotificationItem: React.FC<{
  id: string;
  message: string;
  type: "success" | "error" | "info" | "achievement";
  onClose: (id: string) => void;
}> = ({ id, message, type, onClose }) => {
  const [progress, setProgress] = useState(100);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startedAt = Date.now();

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, NOTIFICATION_LIFETIME - elapsed);
      setProgress((remaining / NOTIFICATION_LIFETIME) * 100);
    }, PROGRESS_TICK_MS);

    closeTimerRef.current = setTimeout(() => {
      onClose(id);
    }, NOTIFICATION_LIFETIME);

    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [id, onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span>{message}</span>
      <button type="button" onClick={() => onClose(id)} className={styles.close}>
        x
      </button>

      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

const Notifications: React.FC = () => {
  const notifications = useSelector((state: RootState) => state.notifications.list);
  const dispatch = useDispatch();
  const handleClose = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return (
    <div className={styles.container}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          message={notification.message}
          type={notification.type}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default Notifications;
