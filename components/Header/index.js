'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import Button from '@/components/Button';
import Input from '@/components/Input';
import clsx from 'clsx';
import styles from './index.module.css';
import { RiSearch2Line, RiSunLine, RiMoonLine, RiQuillPenFill, RiSettingsLine, RiTerminalFill, RiArrowLeftLine } from 'react-icons/ri';
import { CgLogIn, CgLogOut } from 'react-icons/cg';
import { TbArticle, TbBell } from 'react-icons/tb';
import { useTheme } from 'next-themes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getToken } from '@/utils/getToken';

export default function Header() {
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const router = useRouter();
  const pathname = usePathname();

  const [auth, setAuth] = useState(true);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = getToken();
      setAuth(currentUser ? true : false);
      setUserData(currentUser);
    }
  }, [pathname]);

  const [notiCount, setNotiCount] = useState(false);

  const handleFetchNoti = useCallback(() => {
    if (!userData?.token) return;
    axios
      .get(`${process.env.baseUrl}/api/blog/noti?type=count`, {
        headers: {
          Authorization: userData.token,
        },
      })
      .then((res) => {
        const { message, data } = res.data;
        if (res.status === 200) {
          setNotiCount(data);
        } else {
          setNotiCount(0);
          console.log(message)
        }
      })
      .catch((error) => {
        setNotiCount(0);
        console.log(error);
      });
  }, [userData]);

  useEffect(() => {
    if (pathname !== '/dashboard/notifications') {
      handleFetchNoti();
    }
  }, [pathname, handleFetchNoti]);

  const defaultProps = {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    theme: theme,
    // transition: bounce,
  };

  const handleLogout = () => {
    // localStorage.removeItem('token');
    Cookies.remove('token');
    toast.success('登出成功！將於三秒後跳轉至登入頁！', {...defaultProps});
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  const searchRef = useRef(null);

  const [composing, setComposing] = useState(false);

  const handleCompositionStart = () => {
    setComposing(true);
  };

  const handleCompositionEnd = () => {
    setComposing(false);
  };

  const handleKeywordFilter = useDebouncedCallback((event) => {
    if (!composing && event.target.value === '' && pathname !== '/') {
      router.push('/');
    }
    if (!composing && event.target.value) {
      router.push(`/search/${event.target.value}`);
    }
  }, 500);

  useEffect(() => {
    const handleSearchInputFocus = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        searchRef.current.focus();
      }
    };
    window.addEventListener('keydown', handleSearchInputFocus);
    return () => {
      window.removeEventListener('keydown', handleSearchInputFocus);
    }
  }, []);

  const [dropdownShow, setDropdownShow] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownShow(!dropdownShow);
  };

  const handleHistoryBack = () => {
    router.back();
  };

  return (
    <>
      <header className={styles.header}>
        <Button
          isIconType={true}
          onClick={handleHistoryBack}
          icon={<RiArrowLeftLine />}
        />
        <Link href="/" className={styles.logo} data-desktop>
          <Logo />
        </Link>
        <Input
          type="text"
          name="test"
          id="test"
          placeholder="搜索"
          inputRef={searchRef}
          onKeyDown={(event) => {
            handleKeywordFilter(event)
          }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          color="secondary"
          rounded={true}
          left={<RiSearch2Line />}
          kbd="ctrl + K"
          desktop={true}
        />
        <Input
          type="text"
          name="test2"
          id="test2"
          placeholder="搜索"
          onKeyDown={(event) => {
            handleKeywordFilter(event)
          }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          color="secondary"
          rounded={true}
          flex={true}
          left={<RiSearch2Line />}
          mobile={true}
        />
            <div className={styles.buttons}>
              {
                ['admin'].includes(userData?.role) ? (
                  <>
                    <Button
                      isNextLink="/publish"
                      color="primary"
                      desktop={true}
                      icon={<RiQuillPenFill />}
                      content="發文"
                    />
                    <Button
                      isNextLink="/dashboard/blogs"
                      isIconType={true}
                      icon={<TbArticle />}
                      desktop={true}
                      tippy={{
                        content: '部落格管理',
                        placement: 'bottom',
                      }}
                    />
                  </>
                ) : null
              }
              {
                ['admin', 'user'].includes(userData?.role) ? (
                  <div  className={styles.noti} data-desktop>
                    <Button
                      isNextLink="/dashboard/notifications"
                      isIconType={true}
                      icon={<TbBell />}
                      tippy={{
                        content: notiCount > 0 ? `有 ${notiCount} 則新通知` : '通知中心',
                        placement: 'bottom',
                      }}
                      onClick={() => {
                        setNotiCount(0);
                      }}
                    />
                    <div className={clsx(styles.notiChip, {[styles.show]: notiCount > 0})}></div>
                  </div>
                ) : null
              }
              {
                !userData ? (
                  <>
                    <Button
                      isNextLink="/login"
                      isIconType={true}
                      icon={<CgLogIn />}
                      mobile={true}
                    />
                    <Button
                      isNextLink="/login"
                      color="secondary2"
                      icon={<CgLogIn />}
                      content="登入"
                      desktop={true}
                    />
                  </>
                ) : null
              }
              {
                auth && (
                  <>
                    <Button
                      isIconType={true}
                      icon={<CgLogOut />}
                      onClick={handleLogout}
                      desktop={true}
                      tippy={{
                        content: '點擊登出',
                        placement: 'bottom',
                      }}
                    />
                    <div  className={styles.noti} data-mobile>
                      <Button
                        isNextLink="/dashboard/notifications"
                        isIconType={true}
                        icon={<TbBell />}
                        onClick={() => {
                          setNotiCount(0);
                        }}
                      />
                      <div className={clsx(styles.notiChip, {[styles.show]: notiCount > 0})}></div>
                    </div>
                  </>
                )
              }
              <Button
                isIconType={true}
                onClick={handleThemeToggle}
                icon={mounted ? theme === 'dark' ? <RiSunLine /> : <RiMoonLine /> : <RiTerminalFill />}
                desktop={true}
                tippy={{
                  content: `點擊切換為${theme === 'dark' ? '淺色' : '深色'}主題`,
                  placement: 'bottom',
                }}
              />
              {
                auth ? (
                  <Button
                    isIconType={true}
                    mobile={true}
                    icon={<RiSettingsLine />}
                    onClick={handleDropdownToggle}
                  />
                ) : (
                  <Button
                    isIconType={true}
                    onClick={handleThemeToggle}
                    icon={mounted ? theme === 'dark' ? <RiSunLine /> : <RiMoonLine /> : <RiTerminalFill />}
                    mobile={true}
                  />
                )
              }
              {
                dropdownShow && (
                  <div className={styles.dropdown} data-mobile>
                    <ul>
                      {
                        ['admin'].includes(userData?.role) && (
                          <>
                            <li>
                              <Link href="/publish" className={styles.item} onClick={handleDropdownToggle}>
                                <RiQuillPenFill />發文
                              </Link>
                            </li>
                            <li>
                              <Link href="/dashboard/blogs" className={styles.item} onClick={handleDropdownToggle}>
                                <TbArticle />部落格管理
                              </Link>
                            </li>
                          </>
                        )
                      }
                      <li>
                        <button type="button" className={styles.item} onClick={() => {
                          handleThemeToggle();
                          handleDropdownToggle();
                        }}>
                          {theme === 'dark' ? <RiSunLine /> : <RiMoonLine />}{theme === 'dark' ? '淺色' : '深色'}主題
                        </button>
                      </li>
                      <li>
                        <button type="button" className={styles.item} onClick={() => {
                          handleLogout();
                          handleDropdownToggle();
                        }}>
                          <CgLogOut />登出
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              }
            </div>
      </header>
    </>
  )
}