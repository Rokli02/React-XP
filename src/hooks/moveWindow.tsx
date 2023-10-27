import { MutableRefObject, RefObject, useEffect } from "react"
import { IWindowSettings } from "../pages/Window/types";
import { WINDON_MOVE_SS_KEY } from "../pages/Window/constants";

export const useMoveWindow = (windowRef: RefObject<HTMLDivElement>, menubarRef: RefObject<HTMLDivElement>, styles: MutableRefObject<IWindowSettings>, moveKey: string = WINDON_MOVE_SS_KEY) => {
  useEffect(
    () => {
      const _menubarRef = menubarRef.current;

      const _mouseMoveListener = mouseMoveListener.bind({ styles, windowRef });
      const _mouseUpListener = mouseUpListener.bind({
        styles,
        moveEvent: _mouseMoveListener,
        windowRef,
        menubarRef,
        moveKey,
      });
      const _mouseDownListener = mouseDownListener.bind({
        styles,
        moveEvent: _mouseMoveListener,
        upEvent: _mouseUpListener,
        windowRef,
        menubarRef,
      });

      // Get Offset from sessionStorage
      let moveSettings: any = sessionStorage.getItem(moveKey);
      if (moveSettings !== null) {
        moveSettings = JSON.parse(moveSettings);

        windowRef.current!.style.left = `${moveSettings.left}px`;
        styles.current.left = moveSettings.left;
        windowRef.current!.style.top = `${moveSettings.top}px`;
        styles.current.top = moveSettings.top;
      }
      else {
        if (styles.current.left !== undefined) {
          windowRef.current!.style.left = `${styles.current.left}px`;
        }
        else {
          windowRef.current!.style.left = `calc(50% - ${Math.floor(styles.current.width / 2)}px)`;
          styles.current.left = windowRef.current!.offsetLeft;
        }
        
        if (styles.current.top !== undefined) {
          windowRef.current!.style.top = `${styles.current.top}px`;
        }
        else {
          windowRef.current!.style.top = `calc(50% - ${Math.floor(styles.current.height / 2)}px)`;
          styles.current.top = windowRef.current!.offsetTop;
        }
      }
      
      // Add move listener
      _menubarRef?.addEventListener('mousedown', _mouseDownListener);

      return () => {
        // Remove move listener
        _menubarRef?.removeEventListener('mousedown', _mouseDownListener);
        document.removeEventListener('mouseup', _mouseUpListener);
        document.removeEventListener('mousemove', _mouseMoveListener);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

function mouseDownListener(
  this: {
    styles: MutableRefObject<IWindowSettings>,
    moveEvent: (ev: MouseEvent) => void,
    upEvent: (ev: MouseEvent) => void,
    windowRef: RefObject<HTMLDivElement>,
    menubarRef: RefObject<HTMLDivElement>,
  },
  ev: MouseEvent,
) {
  document.addEventListener('mousemove', this.moveEvent);
  document.addEventListener('mouseup', this.upEvent, { once: true,  });

  this.menubarRef.current?.setAttribute('data-moving', '');
  this.windowRef.current!.setAttribute('data-noselect', '');
  
  this.styles.current.left = this.windowRef.current!.offsetLeft;
  this.styles.current.top = this.windowRef.current!.offsetTop;
  
  this.styles.current._move.down = {
    x: ev.x,
    y: ev.y,
  };

  this.styles.current._move.left = this.styles.current.left;
  this.styles.current._move.top = this.styles.current.top;
}

function mouseMoveListener(
  this: {
    styles: MutableRefObject<IWindowSettings>,
    windowRef: RefObject<HTMLDivElement>,
  },
  ev: MouseEvent,
) {
  if (this.styles.current._move.left === undefined || this.styles.current._move.top === undefined) return;
  
  const newLeftOffset = Math.min(
    Math.max(
      0,
      this.styles.current.left + (ev.x - this.styles.current._move.down!.x),
    ),
    this.windowRef.current!.parentElement!.clientWidth - this.windowRef.current!.clientWidth,
  );
  const newTopOffset = Math.min(
    Math.max(
      0,
      this.styles.current.top + (ev.y - this.styles.current._move.down!.y),
    ),
    this.windowRef.current!.parentElement!.clientHeight - this.windowRef.current!.clientHeight,
  );

  this.windowRef.current!.style.left = `${newLeftOffset}px`;
  this.styles.current._move.left = newLeftOffset;
  this.windowRef.current!.style.top = `${newTopOffset}px`;
  this.styles.current._move.top = newTopOffset;

}

function mouseUpListener(
  this: {
    styles: MutableRefObject<IWindowSettings>,
    moveEvent: (ev: MouseEvent) => void,
    windowRef: RefObject<HTMLDivElement>,
    menubarRef: RefObject<HTMLDivElement>,
    moveKey: string,
  },
  ev: MouseEvent,
) {
  document.removeEventListener('mousemove', this.moveEvent);

  this.menubarRef.current?.removeAttribute('data-moving');
  this.windowRef.current!.removeAttribute('data-noselect');

  if (this.styles.current._move.left === undefined || this.styles.current._move.top === undefined) return;

  this.styles.current.left = this.styles.current._move.left!;
  this.styles.current.top = this.styles.current._move.top!;

  sessionStorage.setItem(this.moveKey, JSON.stringify({
    top: this.styles.current.top,
    left: this.styles.current.left,
  }));

  this.styles.current._move.left = undefined;
  this.styles.current._move.top = undefined;

  this.styles.current._move.down = undefined;
}

export default useMoveWindow;