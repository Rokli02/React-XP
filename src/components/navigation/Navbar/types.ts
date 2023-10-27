import { ReactElement } from "react";

export interface IStartMenuToggle {
  isOpen: boolean;
  isFirstOpen: boolean;
  abortController?: AbortController;
}

export interface INavbarItem {
  to: string,
  icon?: ReactElement,
  text?: string,
  inactive?: boolean;
}