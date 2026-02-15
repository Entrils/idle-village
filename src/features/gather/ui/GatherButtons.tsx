import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { getGatherAmount } from "@/shared/config/gameBalance";
import { playSfx } from "@/shared/lib/sfx";
import styles from "./GatherButtons.module.css";

type ResourceType = "wood" | "stone" | "food" | "gold";

type SpriteConfig = {
  src: string;
  columns: number;
  rows: number;
  frameDurationMs: number;
  canvasSize: number;
  viewportClassName: string;
  canvasClassName: string;
};

const SMOKE_CONFIG: SpriteConfig = {
  src: "/assets/anims/smoke.png",
  columns: 3,
  rows: 3,
  frameDurationMs: 70,
  canvasSize: 220,
  viewportClassName: styles.smokeViewport,
  canvasClassName: styles.smokeCanvas,
};

const SPARK_CONFIG: SpriteConfig = {
  src: "/assets/anims/iskra.png",
  columns: 3,
  rows: 2,
  frameDurationMs: 55,
  canvasSize: 150,
  viewportClassName: styles.sparkViewport,
  canvasClassName: styles.sparkCanvas,
};
const GATHER_COOLDOWN_MS = 100;

const gatherNodes: Array<{
  type: ResourceType;
  title: string;
  icon: string;
  positionClass: "woodNode" | "stoneNode" | "foodNode" | "goldNode";
}> = [
  {
    type: "wood",
    title: "Лес",
    icon: "/assets/resources/wood.png",
    positionClass: "woodNode",
  },
  {
    type: "stone",
    title: "Камень",
    icon: "/assets/resources/stone.png",
    positionClass: "stoneNode",
  },
  {
    type: "food",
    title: "Еда",
    icon: "/assets/resources/food.png",
    positionClass: "foodNode",
  },
  {
    type: "gold",
    title: "Золото",
    icon: "/assets/resources/gold.png",
    positionClass: "goldNode",
  },
];

const SpriteEffect: React.FC<{ playId: number; config: SpriteConfig }> = ({
  playId,
  config,
}) => {
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let mounted = true;
    const image = new Image();
    image.src = config.src;
    image.onload = () => {
      if (!mounted) return;
      imageRef.current = image;
      setReady(true);
    };

    return () => {
      mounted = false;
    };
  }, [config.src]);

  useEffect(() => {
    if (playId < 0 || !ready) return;

    const totalFrames = config.columns * config.rows;
    setFrame(0);
    const interval = setInterval(() => {
      setFrame((prev) => {
        if (prev >= totalFrames - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, config.frameDurationMs);

    return () => clearInterval(interval);
  }, [playId, ready, config.columns, config.rows, config.frameDurationMs]);

  useEffect(() => {
    if (playId < 0 || !ready) return;

    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (!image || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const frameWidth = Math.floor(image.width / config.columns);
    const frameHeight = Math.floor(image.height / config.rows);
    const col = frame % config.columns;
    const row = Math.floor(frame / config.columns);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingEnabled = true;
    context.drawImage(
      image,
      col * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }, [frame, playId, ready, config.columns, config.rows]);

  if (playId < 0) return null;

  return (
    <span className={config.viewportClassName} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={config.canvasClassName}
        width={config.canvasSize}
        height={config.canvasSize}
      />
    </span>
  );
};

const GatherButtons: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const dispatch = useDispatch();
  const lastGatherAtRef = useRef<Record<ResourceType, number>>({
    wood: 0,
    stone: 0,
    food: 0,
    gold: 0,
  });
  const [fxByType, setFxByType] = useState<Record<ResourceType, number>>({
    wood: -1,
    stone: -1,
    food: -1,
    gold: -1,
  });

  const handleGather = (type: ResourceType) => {
    const now = Date.now();
    if (now - lastGatherAtRef.current[type] < GATHER_COOLDOWN_MS) {
      return;
    }
    lastGatherAtRef.current[type] = now;

    const amount = getGatherAmount(type, isNight);
    dispatch(addResource({ type, amount }));
    playSfx("gather");
    setFxByType((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  };

  return (
    <div className={styles.fieldNodes}>
      {gatherNodes.map((node) => (
        <div className={`${styles.node} ${styles[node.positionClass]}`} key={node.type}>
          <button
            className={styles.nodeButton}
            onClick={() => handleGather(node.type)}
            title={node.title}
            aria-label={node.title}
          >
            <img src={node.icon} alt="" className={styles.nodeIcon} />
          </button>
          <span className={styles.nodeLabel}>{node.title}</span>
          <SpriteEffect
            key={`smoke-${node.type}-${fxByType[node.type]}`}
            playId={fxByType[node.type]}
            config={SMOKE_CONFIG}
          />
          <SpriteEffect
            key={`spark-${node.type}-${fxByType[node.type]}`}
            playId={fxByType[node.type]}
            config={SPARK_CONFIG}
          />
        </div>
      ))}
    </div>
  );
};

export default GatherButtons;
