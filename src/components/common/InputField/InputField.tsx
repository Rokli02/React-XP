import { FC, useRef, InputHTMLAttributes, ChangeEvent, MutableRefObject, memo } from 'react';
import style from './styles.module.css';
 
export interface IInputField extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  regExpTemplate?: RegExp;
  name: string;
};


export const InputField: FC<IInputField> = memo(({ name, label, onChange, defaultValue, regExpTemplate, ...others }) => {
  const textRef = useRef(defaultValue || '');
  
  return (
    <div className={style['InputFieldWrapper']}>
      {label !== undefined && <label htmlFor={name}>{label}</label>}
      <input id={name} name={name} defaultValue={others.value ? undefined : textRef.current} onChange={(e) => {
        onChange?.(e);
        if (regExpTemplate && e.target.type === 'text') {
          matchRegexOnChange(e, textRef, regExpTemplate);
        }
      }} {...others} />
    </div>
  );
})

function matchRegexOnChange(e: ChangeEvent<HTMLInputElement>, textRef: MutableRefObject<string | number | readonly string[] | undefined>, regex: RegExp) {
  if (e.target.value.match(regex) !== null || !e.target.value) {
    textRef.current = e.target.value;
  }

  e.target.value = (textRef.current as string);
}

export default InputField;
