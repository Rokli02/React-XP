import { Dispatch, ReactNode, CSSProperties } from "react";

export interface IFormContext<T = any> {
  fields: T;
  setField: (name: string, value: unknown, rerenderOnSet?: boolean) => void;
  setFields: Dispatch<T>;
}

export interface FormSettings {
  refreshOnSet: boolean;
}

export interface IFormProviderProps {
  children: ReactNode;
  onSubmit?: (formValue: unknown) => void;
  style?: CSSProperties,
}