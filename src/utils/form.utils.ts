import { FormEvent } from "react";
import { submitableTypes } from "./constants";
import { SubmitableType } from "../types";

export function getFormValues<T = any>(e: FormEvent<HTMLFormElement>): T {
  const target: any = e.target;
  const result: any = {};

  for (let index = 0; index < target.length; index++) {
    try {
      if (submitableTypes.includes(target[index].type)) {
        result[target[index].name] = getValueFromInputField(target[index]);
      }
    } catch (err) {
      if (err.message !== 'SKIP') {
        throw err;
      }
    }
  }

  return result;
}

function getValueFromInputField (target: any): any {
  switch ((target.type as SubmitableType)) {
    case 'checkbox':
      return target.checked;
    case 'radio':
      if (!target.checked) {
        throw new Error('SKIP');
      }

      return target.value;
    case 'text':
    default:
      return target.value;
  }
}

const defaultExport = {
  getFormValues,
}

export default defaultExport;
