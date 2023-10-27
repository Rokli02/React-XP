import { FC, useLayoutEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/navigation/Navbar/Navbar";
import style from './layout.module.css';
import { defaultPath, resolvePaths } from "../utils/page.utils";
import ErrorPage from "./Error/ErrorPage";

export const Layout: FC = () => {
  const [paths, setPaths] = useState<React.ReactElement>(defaultPath);

  useLayoutEffect(() => {
    fetch(process.env.PUBLIC_URL + '/urls.json', { 
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
     }).then(async (value) => {
      const paths = await value.json();
      
      setPaths(resolvePaths(paths));
    }).catch((reason) => {
      console.error(reason);
    })
  }, [])

  return (
    <div className={style['container']}>
      <div className={style['sub-container']}>
        <Routes>
          {paths}
          <Route path="*" Component={ErrorPage} />
        </Routes>
      </div>
      <Navbar />
    </div>
  )
}

export default Layout;