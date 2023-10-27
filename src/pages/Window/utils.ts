import { MutableRefObject, RefObject } from "react";
import { IWindowSettings } from "./types";
import { MIN_HEIGHT, MIN_WIDTH } from "./constants";

export function fullScreen(
  this: {
    windowRef: RefObject<HTMLDivElement>,
    styles: MutableRefObject<IWindowSettings>,
  },
) {
  this.styles.current.left = this.windowRef.current!.parentElement!.offsetLeft;
  this.styles.current.top = this.windowRef.current!.parentElement!.offsetTop;
  this.styles.current.width = this.windowRef.current!.parentElement!.clientWidth!;
  this.styles.current.height = this.windowRef.current!.parentElement!.clientHeight!;

  this.windowRef.current!.style.left = `${this.styles.current.left}px`;
  this.windowRef.current!.style.top = `${this.styles.current.top}px`;
  this.windowRef.current!.style.width = `${this.styles.current.width}px`;
  this.windowRef.current!.style.height = `${this.styles.current.height}px`;
}

export function minimalize(
  this: {
    windowRef: RefObject<HTMLDivElement>,
    styles: MutableRefObject<IWindowSettings>,
  },
) {
  this.styles.current.width = MIN_WIDTH;
  this.styles.current.height = MIN_HEIGHT;

  this.windowRef.current!.style.left = `calc(50% - ${Math.floor(MIN_WIDTH / 2)}px)`;
  this.styles.current.left = this.windowRef.current!.offsetLeft;

  this.windowRef.current!.style.top = `calc(50% - ${Math.floor(MIN_HEIGHT / 2)}px)`;
  this.styles.current.top = this.windowRef.current!.offsetTop;

  this.windowRef.current!.style.width = `${this.styles.current.width}px`;
  this.windowRef.current!.style.height = `${this.styles.current.height}px`;
}