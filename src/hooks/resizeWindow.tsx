import { MutableRefObject, RefObject, useEffect } from "react";
import {
  MIN_HEIGHT,
  MIN_WIDTH,
  RESIZE_BORDER_DETECTION_TOLERANCE,
  WINDON_MOVE_SS_KEY,
  WINDON_RESIZE_SS_KEY,
  WINDOW_RESIZE_MODE
} from "../pages/Window/constants";
import { IWindowSettings } from "../pages/Window/types";

export const useResizeWindow = (
  windowRef: RefObject<HTMLDivElement>,
  borderRef: RefObject<HTMLDivElement>,
  styles: MutableRefObject<IWindowSettings>,
  resizeKey: string = WINDON_RESIZE_SS_KEY,
  moveKey: string = WINDON_MOVE_SS_KEY
) => {
  useEffect(
    () => {
      const _borderRef = borderRef.current;

      const _mouseMoveListener = mouseMoveListener.bind({ styles, windowRef });
      const _mouseUpListener = mouseUpListener.bind({ styles, moveEvent: _mouseMoveListener, windowRef, resizeKey, moveKey });
      const _mouseDownListener = mouseDownListener.bind({ styles, moveEvent: _mouseMoveListener, upEvent: _mouseUpListener, windowRef });
      
      // Get Size from sessionStorage
      let resizeSettings: any = sessionStorage.getItem(resizeKey);
      if (resizeSettings !== null) {
        resizeSettings = JSON.parse(resizeSettings);

        windowRef.current!.style.width = `${resizeSettings.width}px`;
        styles.current.width = resizeSettings.width;
        windowRef.current!.style.height = `${resizeSettings.height}px`;
        styles.current.height = resizeSettings.height;
      }
      else {
        windowRef.current!.style.width = `${styles.current.width}px`;
        windowRef.current!.style.height = `${styles.current.height}px`;
      }

      // Add resize listener
      _borderRef?.addEventListener('mousedown', _mouseDownListener);
      
      return () => {
        // Remove resize listener
        _borderRef?.removeEventListener('mousedown', _mouseDownListener);
        document.removeEventListener('mouseup', _mouseUpListener);
        document.removeEventListener('mousemove', _mouseMoveListener);
      }
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
  },
  ev: MouseEvent,
) {
  document.addEventListener('mousemove', this.moveEvent);
  document.addEventListener('mouseup', this.upEvent, { once: true });

  this.windowRef.current!.setAttribute('data-noselect', '');

  this.styles.current._move.down = {
    x: ev.clientX,
    y: ev.clientY,
  };
  const toleranceX = RESIZE_BORDER_DETECTION_TOLERANCE;
  const toleranceY = RESIZE_BORDER_DETECTION_TOLERANCE;

  if (ev.offsetX < toleranceX) {
    this.styles.current._move.type += WINDOW_RESIZE_MODE.LEFT;
  } else if ((this.styles.current.width - ev.offsetX) < toleranceX) {
    this.styles.current._move.type += WINDOW_RESIZE_MODE.RIGHT;
  }

  if (ev.offsetY < toleranceY) {
    this.styles.current._move.type += WINDOW_RESIZE_MODE.TOP;
  } else if ((this.styles.current.height - ev.offsetY) < toleranceY) {
    this.styles.current._move.type += WINDOW_RESIZE_MODE.BOTTOM;
  }

  this.styles.current._move.left = this.styles.current.left;
  this.styles.current._move.top = this.styles.current.top;
  this.styles.current._move.width = this.styles.current.width;
  this.styles.current._move.height = this.styles.current.height;
}

function mouseMoveListener(
  this: {
    styles: MutableRefObject<IWindowSettings>,
    windowRef: RefObject<HTMLDivElement>,
  },
  ev: MouseEvent,
) {
  if (!this.styles.current._move.down) return;

  switch (this.styles.current._move.type) {
    case WINDOW_RESIZE_MODE.LEFT:
      calculateWidthLeftSide(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.RIGHT:
      calculateWidthRightSide(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.TOP:
      calculateHeightTop(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.TOP_LEFT:
      calculateWidthLeftSide(this.windowRef, this.styles, ev);
      calculateHeightTop(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.TOP_RIGHT:
      calculateWidthRightSide(this.windowRef, this.styles, ev);
      calculateHeightTop(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.BOTTOM:
      calculateHeightBottom(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.BOTTOM_LEFT:
      calculateHeightBottom(this.windowRef, this.styles, ev);
      calculateWidthLeftSide(this.windowRef, this.styles, ev);

      break;
    case WINDOW_RESIZE_MODE.BOTTOM_RIGHT:
      calculateWidthRightSide(this.windowRef, this.styles, ev);
      calculateHeightBottom(this.windowRef, this.styles, ev);

      break;
    case 0:
    default:
      return;
  }
}

function mouseUpListener(
  this: {
    styles: MutableRefObject<IWindowSettings>,
    moveEvent: (ev: MouseEvent) => void,
    windowRef: RefObject<HTMLDivElement>,
    resizeKey: string,
    moveKey: string,
  },
  ev: MouseEvent,
) {
  document.removeEventListener('mousemove', this.moveEvent);

  this.windowRef.current!.removeAttribute('data-noselect');

  if (!this.styles.current._move.down) return;
  
  this.styles.current.left = this.styles.current._move.left!;
  this.styles.current.top = this.styles.current._move.top!;
  this.styles.current.width = this.styles.current._move.width!;
  this.styles.current.height = this.styles.current._move.height!;

  sessionStorage.setItem(this.resizeKey, JSON.stringify({
    width: this.styles.current.width,
    height: this.styles.current.height,
  }));

  if (this.styles.current.top !== undefined && this.styles.current.left !== undefined) {
    sessionStorage.setItem(this.moveKey, JSON.stringify({
      top: this.styles.current.top,
      left: this.styles.current.left,
    }));
  }

  this.styles.current._move.left = undefined;
  this.styles.current._move.top = undefined;
  this.styles.current._move.width = undefined;
  this.styles.current._move.height = undefined;

  this.styles.current._move.down = undefined;
  this.styles.current._move.type = 0;
}

function calculateWidthLeftSide(windowRef: RefObject<HTMLDivElement>, styles: MutableRefObject<IWindowSettings>, ev: MouseEvent) {
  const newWidth = Math.max(MIN_WIDTH, styles.current.width + styles.current._move.down?.x! - ev.clientX);
  if (newWidth > MIN_WIDTH && ev.clientX > 0) {
    windowRef.current!.style.left = `${ev.clientX}px`;
    windowRef.current!.style.width = `${newWidth}px`;
    styles.current._move.left = ev.clientX;
    styles.current._move.width = newWidth;
  }
}

function calculateWidthRightSide(windowRef: RefObject<HTMLDivElement>, styles: MutableRefObject<IWindowSettings>, ev: MouseEvent) {
  const newWidth = Math.max(MIN_WIDTH, styles.current.width + ev.clientX - styles.current._move.down?.x!);
  if (windowRef.current?.parentElement?.clientWidth! - styles.current._move.left! > newWidth) {
    windowRef.current!.style.width = `${newWidth}px`;
    styles.current._move.width = newWidth;
  }
}

function calculateHeightTop(windowRef: RefObject<HTMLDivElement>, styles: MutableRefObject<IWindowSettings>, ev: MouseEvent) {
  const newHeight = Math.max(MIN_HEIGHT, styles.current.height + styles.current._move.down?.y! - ev.clientY);
  if (newHeight > MIN_HEIGHT && ev.clientY > 0) {
    windowRef.current!.style.top = `${ev.clientY}px`;
    windowRef.current!.style.height = `${newHeight}px`;
    styles.current._move.top = ev.clientY;
    styles.current._move.height = newHeight;
  }
}

function calculateHeightBottom(windowRef: RefObject<HTMLDivElement>, styles: MutableRefObject<IWindowSettings>, ev: MouseEvent) {
  const newHeight = Math.max(MIN_HEIGHT, styles.current.height + ev.clientY - styles.current._move.down?.y!);
  if (windowRef.current?.parentElement?.clientHeight! - styles.current._move.top! > newHeight) { 
    windowRef.current!.style.height = `${newHeight}px`;
    styles.current._move.height = newHeight;
  }
}

export default useResizeWindow;