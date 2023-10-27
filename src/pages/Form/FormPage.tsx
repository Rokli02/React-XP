import { FC } from "react";
import { FormProvider } from "../../contexts/form";
import { Outlet } from "react-router-dom";

export const FormPage: FC = () => {
  return (
    <div>
      <FormProvider>
        <Outlet />
      </FormProvider>
    </div>
  )
}

export default FormPage;