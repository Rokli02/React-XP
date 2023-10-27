import { FC, InputHTMLAttributes, ChangeEvent, memo, useEffect } from 'react';
import inputFieldStyle from '../InputField/styles.module.css';
// import style from './styles.module.css';
import { useForm } from '../../../contexts/form';
 
export interface IInputField extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' > {
  label?: string;
  regExpTemplate?: RegExp;
  name: string;
};


export const FormInputField: FC<IInputField> = memo(({ name, label, onChange, defaultValue, regExpTemplate, ...others }) => {
  const { fields, setField } = useForm();
  
  useEffect(
    () => {
      setField(name, defaultValue || '');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, defaultValue]
  );

  return (
    <div className={inputFieldStyle['InputFieldWrapper']}>
      {label !== undefined && <label htmlFor={name}>{label}</label>}
      <input name={name} defaultValue={fields[name]} onChange={(e) => {
        onChange?.(e);
        if (regExpTemplate && e.target.type === 'text') {
          checkRegexOnChange(e, name, fields[name], setField, regExpTemplate);
        }
      }} {...others} />
    </div>
  );
})

function checkRegexOnChange(
  e: ChangeEvent<HTMLInputElement>,
  name: string,
  value: unknown,
  setField: (name: string, value: unknown, rerenderOnSet?: boolean | undefined) => void,
  regex: RegExp
) {
  let _value = value;

  if (e.target.value.match(regex) !== null || !e.target.value) {
    _value = setField(name, e.target.value);
  }

  e.target.value = (_value as string);
}

export default FormInputField;
