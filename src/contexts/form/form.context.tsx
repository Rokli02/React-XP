import { FC, createContext, useContext, useState, useRef } from "react";
import { FormSettings, IFormContext, IFormProviderProps } from "./types";
import { InitFormSettings } from "./utils";

const FormContext = createContext<IFormContext>(null as unknown as IFormContext);

export const FormProvider: FC<IFormProviderProps> = ({ children, onSubmit, style, ...otherProps }) => {
  const [state, setState] = useState<any>();
  const settingsRef = useRef<FormSettings>(InitFormSettings);

  const setField: IFormContext['setField'] = (name, value, shouldRerender = settingsRef.current.refreshOnSet) => {
    if (shouldRerender) {
      setState((pre: any) => ({
        ...pre,
        [name]: value,
      }))
      return value;
    }

    return state[name] = value;
  }


  const _onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(state);
    }
  }

  return (
    <FormContext.Provider value={{
      fields: state,
      setField,
      setFields: setState,
    }}>
      <form onSubmit={_onSubmit} style={{
        padding: '8px',
        ...style,
      }} {...otherProps}>
        {children}
      </form>
      
    </FormContext.Provider>
  );
}

export const useForm = () => useContext(FormContext);