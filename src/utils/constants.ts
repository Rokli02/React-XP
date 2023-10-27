import { SubmitableType } from "../types";

const constants = {
  submitableTypes: ['checkbox', 'color', 'date', 'datetime-local', 'email', 'file', 'image', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'] satisfies SubmitableType[],
  incrementalRegExpTemplates: {
    licensePlateNumber: /(^[A-Za-z]{1,3}$)|(^[A-Za-z]{3}-$)|(^[A-Za-z]{3}-\d{1,3}$)/gm,
  },
  regExpTemplates: {
    licensePlateNumber: {
      incremental: /(^[A-Za-z]{1,3}$)|(^[A-Za-z]{3}-$)|(^[A-Za-z]{3}-\d{1,3}$)/gm,
      full: /^[A-Za-z]{3}-\d{3}$/gm,
    }
  },
};

export const {
  submitableTypes,
  incrementalRegExpTemplates,
  regExpTemplates,
} = constants;

export default constants;