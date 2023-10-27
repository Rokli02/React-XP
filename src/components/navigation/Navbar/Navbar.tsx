/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { MdInput } from "react-icons/md";
import { SiWindowsxp } from "react-icons/si";
import { SlFolder } from "react-icons/sl";
import style from './styles.module.css';
import startMenuStyle from '../StartMenu/startMenu.module.css';
import { Link, NavigateOptions, useNavigate } from "react-router-dom";
import { StartMenu } from "../StartMenu/StartMenu";
import { clickedOutsideListener } from "../../../hooks/clickedOutside";
import { IStartMenuToggle, INavbarItem } from "./types";

export const Navbar: FC = () => {
  const navigate = useNavigate();
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startMenuToggle = useRef<IStartMenuToggle>({ ...DefaultStartMenuToggle });
  const [navbarItems] = useState<INavbarItem[]>([
    {
      to: '/',
      icon: <SlFolder fontSize="1.5em"/>,
      text: undefined,
    },
    {
      to: '/form/simple-input',
      icon: undefined,
      text: 'Form',
      // inactive: true,
    },
  ]);

  const navigateTo = useCallback(
    (path: string = '/', options: NavigateOptions = {}) => {
      return () => {
        navigate(path, options)
      }
    },
    [navigate]
  )

  const toggleMenu = useCallback(
    () => {
      const onClose = () => {
        if (!startMenuToggle.current.isFirstOpen) {
          startMenuRef.current!.classList.add(startMenuStyle['hide']);
          startMenuToggle.current.abortController?.abort();
          startMenuToggle.current.isOpen = false;
          startMenuToggle.current.isFirstOpen = true;
          
          return;
        }
    
        startMenuToggle.current.isFirstOpen = false;
      };

      startMenuRef.current?.classList.toggle(startMenuStyle['hide']);
      startMenuToggle.current.isOpen = !startMenuToggle.current.isOpen;
  
      if (startMenuToggle.current.isOpen && startMenuToggle.current.isFirstOpen) {
        startMenuToggle.current.abortController = new AbortController();
        
        // Add event listener
        document.addEventListener('click', clickedOutsideListener.bind({ ref: startMenuRef, onClose }), { signal: startMenuToggle.current.abortController.signal });
      }
    },
    []  
  );

  const navbarElements = useMemo(
    () => navbarItems.map((item) => { return makeNavbarItemElement(item, navigateTo) }),
    [navbarItems, navigateTo]
  );

  return (
    <div className={style['navbar']}>
      {/* Logó középen */}
      <header>
        <img src={process.env.PUBLIC_URL + "/logo.svg"} alt="logo" />
      </header>

      {/* Start Menu */}
      <StartMenu ref={startMenuRef} />
      <div className={style['navbar-section']}>
        <a className={style['navbar-item']} onClick={toggleMenu}>
          <SiWindowsxp fontSize="1.5em"/>
          <span>Start</span>
        </a>
      </div>
      
      {/* Balra húzódó itemek középen */}
      <div className={style['navbar-section']}>{ navbarElements }</div>

      {/* Jobb szélső itemek */}
      <div className={style['navbar-section']}>
        <a data-inactive className={style['navbar-item']}>nicsmi</a>
        <a className={style['navbar-item']}>kotor</a>
        <Link className={style['navbar-item']} to="/">
          <MdInput fontSize="1.5em"/>
        </Link>
      </div>
    </div>
  )
}

function makeNavbarItemElement(item: INavbarItem, navigateTo: (path?: string, options?: NavigateOptions) => () => void) {
  return (
    <a key={item.to} className={style['navbar-item']} { ...item.inactive ? { 'data-inactive': true } : { onClick: navigateTo(item.to) } }>
      {item.icon}
      { item.text !== undefined ? <span>{ item.text }</span> : '' }
    </a>
  )
};

const DefaultStartMenuToggle:IStartMenuToggle = {
  isOpen: false,
  isFirstOpen: true,
  abortController: undefined,
};

export default Navbar;