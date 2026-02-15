import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { addResource } from "@/entities/resource/model/resourceSlice";
import { getGatherAmount } from "@/shared/config/gameBalance";

const workerToResource: Record<"lumberjack" | "miner" | "hunter", "wood" | "stone" | "food"> = {
  lumberjack: "wood",
  miner: "stone",
  hunter: "food",
};

export function useAutoGather(isNight: boolean) {
  const dispatch = useDispatch();
  const workers = useSelector((state: RootState) => state.workers);

  useEffect(() => {
    const interval = setInterval(() => {
      (Object.keys(workers) as Array<keyof typeof workers>).forEach((type) => {
        if (workers[type] > 0) {
          const resourceType = workerToResource[type];
          const gatherPerWorker = getGatherAmount(resourceType, isNight);
          dispatch(addResource({ type: resourceType, amount: workers[type] * gatherPerWorker }));
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [workers, dispatch, isNight]);
}
