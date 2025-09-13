import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { addResource } from "@/entities/resource/model/resourceSlice";

const workerToResource: Record<"lumberjack" | "miner" | "hunter", "wood" | "stone" | "food"> = {
  lumberjack: "wood",
  miner: "stone",
  hunter: "food",
};

export function useAutoGather() {
  const dispatch = useDispatch();
  const workers = useSelector((state: RootState) => state.workers);

  useEffect(() => {
    const interval = setInterval(() => {
      (Object.keys(workers) as Array<keyof typeof workers>).forEach((type) => {
        if (workers[type] > 0) {
          const resourceType = workerToResource[type];
          dispatch(addResource({ type: resourceType, amount: workers[type] }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [workers, dispatch]);
}