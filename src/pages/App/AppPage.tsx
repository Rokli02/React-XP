import { Dispatch, FormEvent, useState } from 'react';
import style from './App.module.css';
import InputField from '../../components/common/InputField/InputField';
import { getFormValues } from '../../utils/form.utils';
import { incrementalRegExpTemplates } from '../../utils/constants';

export function AppPage() {
  const [state, setState] = useState<any>({text1: ''});

  return (
    <div className={style["App"]}>
      <section>
        <form onSubmit={onFormSubmit(setState)}>
          <InputField label='text1' name='text1' regExpTemplate={incrementalRegExpTemplates.licensePlateNumber}/>
          <InputField label='text2' name='text2'/>
          <InputField label='text3 upper' name='text3'/>
          <InputField name='submitButton' type='submit' value='Szubmit'/>
        </form>
      </section>
      <pre>
        {JSON.stringify(state, null, 4)}
      </pre>
    </div>
  );
}

const onFormSubmit = (setState: Dispatch<any>) => (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const form = getFormValues(e);

  let result: any;
  for (const key in form) {
    if (form[key] !== undefined && form[key] !== null && form[key] !== '') {
      if (!result) {
        result = {};
      }

      result[key] = form[key];
    }
  }

  setState(result);
}

export default AppPage;
