export interface IWindowPage {
  title?: string;
}

export interface Coordination {
  x: number;
  y: number;
}

export interface IWindowSettings {
  left: number;
  top: number;
  width: number;
  height: number;
  _move: {
    down?: Coordination;
    type: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  };
}
