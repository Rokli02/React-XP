import { FC } from "react";

interface IErrorPage {
  text?: string;
}

export const ErrorPage: FC<IErrorPage> = ({ text = 'Oldal nem található!' }) => {
  return (
    <div>
      <h2>{ text }</h2>
    </div>
  )
}

export default ErrorPage;