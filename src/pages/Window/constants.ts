import { IWindowSettings } from "./types";

export const MIN_WIDTH = 600;
export const MIN_HEIGHT = 400;
export const RESIZE_BORDER_DETECTION_TOLERANCE = 5;
export const WINDON_RESIZE_SS_KEY = 'resizeOpts';
export const WINDON_MOVE_SS_KEY = 'moveOpts';

export const WINDOW_RESIZE_MODE = {
  LEFT: 1,
  RIGHT: 2,
  TOP: 4,
  BOTTOM: 8,
  TOP_LEFT: 5,
  TOP_RIGHT: 6,
  BOTTOM_LEFT: 9,
  BOTTOM_RIGHT: 10,
}

export const defaultWindowSettings: IWindowSettings = {
  height: 400,
  width: 600,
  left: undefined as unknown as number,
  top: undefined as unknown as number,
  _move: {
    type: 0,
  },
};