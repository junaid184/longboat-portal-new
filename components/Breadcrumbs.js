import { useState, useEffect, useContext } from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import Link from 'next/link';
import menuItems from './MenuItems';
import { useRouter } from 'next/router';
import { UserContext } from './UserContext';

export default function BasicBreadcrumbs() {
  const [menuTitle, setMenuTitle] = useState("");
  const { user } = useContext(UserContext);
  const router = useRouter();
  let asPath = router.asPath;

  useEffect(() => {
    getMenuItem();
  }, [asPath])

  function getMenuItem() {
    console.log(asPath)
    // if (asPath === "/admin" || asPath === "/school") setMenuTitle("")
    // else {
    menuItems[user?.role]?.map((item) => {
      if (item.url === asPath) setMenuTitle(item.title);
    })
    // }
  }

  return (
    <div role="presentation">
      {
        menuTitle &&
        <Breadcrumbs aria-label="breadcrumb" separator='>'>
          <Link underline="hover" color="inherit" href={`/${user?.role}`}>Dashboard</Link>
          <Typography color="text.primary">{menuTitle}</Typography>
        </Breadcrumbs>
      }
    </div>
  );
}
