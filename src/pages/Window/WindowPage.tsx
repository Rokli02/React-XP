import { FC, useEffect, useRef } from "react";
import style from './window.module.css';
import { IWindowPage, IWindowSettings } from "./types";
import { WINDON_MOVE_SS_KEY, WINDON_RESIZE_SS_KEY, defaultWindowSettings } from "./constants";
import { Outlet } from "react-router-dom";
import useResizeWindow from "../../hooks/resizeWindow";
import useMoveWindow from "../../hooks/moveWindow";
import { BsXLg } from 'react-icons/bs';
import { BiCaretDown, BiExpand } from 'react-icons/bi';
import { fullScreen, minimalize } from "./utils";

export const WindowPage: FC<IWindowPage> = ({ title = 'Default window' }) => {
  const styles = useRef<IWindowSettings>({ ...defaultWindowSettings });
  const windowRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  const menubarRef = useRef<HTMLDivElement>(null);

  useResizeWindow(windowRef, borderRef, styles, WINDON_RESIZE_SS_KEY);
  useMoveWindow(windowRef, menubarRef, styles, WINDON_MOVE_SS_KEY);
  
  useEffect(
    () => {
      windowRef.current!.oncontextmenu = (ev) => {
        ev.preventDefault();
      }
    },
    []
  );

  return (
    <div
      className={style['window']}
      ref={windowRef}
    >
      <div className={style['border']} ref={borderRef}/>
      <div className={style['content']}>
        <div className={style['menubar']}>
          <section className={style['menubar-drag']} ref={menubarRef}>
            <span className={style['title']}>{ title }</span>
          </section>
          <section className={style['action-buttons']}>
            <button className={style['action-button']} onClick={minimalize.bind({ styles, windowRef })}><BiCaretDown fontSize="1.15rem" /></button>
            <button className={style['action-button']} onClick={fullScreen.bind({ styles, windowRef })}><BiExpand fontSize="1.15rem" /></button>
            <button className={style['action-button']} onClick={() => console.log('X')}><BsXLg fontSize="1.15rem" /></button>
          </section>
        </div>
        <Outlet />
      </div>
    </div>
  )
} 

export default WindowPage;