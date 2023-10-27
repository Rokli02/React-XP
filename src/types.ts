import { HTMLInputTypeAttribute } from "react";

export type VoidFunction = () => void;

export type SubmitableType = Exclude<HTMLInputTypeAttribute, 'button' | 'hidden' | 'submit' | 'reset'>;