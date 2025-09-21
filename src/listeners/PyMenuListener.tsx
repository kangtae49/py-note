import {useEffect} from "react";
import type {PyMenuEvent} from "@/models";
import {useMosaicStore} from "@/store/mosaicStore.ts";

function PyMenuListener() {
  const {addView} = useMosaicStore();
  useEffect(() => {
    const handler = (e: CustomEvent<PyMenuEvent>) => {
      // alert(`${e.detail.action}`);
      const action = e.detail.action;
      console.log(action);
      addView(action);
      // if (e.detail.action === "about") {
      // } else if (e.detail.action === "help") {
      // }
    };
    window.addEventListener("menu-click", handler as EventListener);
    return () => {
      window.removeEventListener("menu-click", handler as EventListener);
    };
  }, [])

  return null;
}

export default PyMenuListener;