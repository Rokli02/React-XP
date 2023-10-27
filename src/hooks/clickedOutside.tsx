import { RefObject, useEffect, useRef } from "react";

function _useClickedOutsideListener(this: any, e: MouseEvent) {
  if (this.ref.current && e.target && !this.ref.current.contains(e.target as any)) {
    if (this.canTrigger.current) {
      this.onClose();
      return;
    }

    this.canTrigger.current = true;
  }
}

export const useClickedOutside = (ref: React.MutableRefObject<HTMLDivElement>, onClose: () => void, shouldListen: boolean = true) => {
  const canTrigger = useRef(false);

  useEffect(
    () => {
      const eventListener = _useClickedOutsideListener.bind({ ref, onClose, canTrigger });
      // Add event listener
      if (shouldListen) {
        document.addEventListener('click', eventListener);
      }
      
      return () => {
        // Remove event listener
        document.removeEventListener('click', eventListener);
        canTrigger.current = false;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldListen, ref?.current],
  )
}


export function clickedOutsideListener(this: {ref: RefObject<HTMLDivElement>, onClose: () => void}, e: MouseEvent) {
    if (this.ref.current && e.target && !this.ref.current.contains(e.target as any)) {
      this.onClose();
    }
  }