import { forwardRef } from "react";
import style from './startMenu.module.css';
import mergeStyles from "../../../utils/mergeStyles";

interface StartMenuProps {}

export const StartMenu = forwardRef<HTMLDivElement, StartMenuProps>((_, startMenuRef) => {
  return (
    <div ref={startMenuRef} className={mergeStyles(style, 'menu hide')}>
      <p>aaaa</p>
      <p>bbbbb</p>
      <p>ccc</p>
    </div>
  );
});
