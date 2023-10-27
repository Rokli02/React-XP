import { useState } from "react";

export const useReload = () => {
  const [refresh, setRefresh] = useState(false);

  const reload = () => {
    setRefresh(pre => !pre);
  }

  return { reloadState: refresh, reloadComponent: reload };
}