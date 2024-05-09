'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Button from '@/components/Button';
import Input from '@/components/Input';
import pageStyles from '@/styles/page.module.css';
import formStyles from '@/styles/form.module.css';
import styles from './index.module.css';
import { MdRemoveRedEye } from 'react-icons/md';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Login() {
  const { theme } = useTheme();

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

  const router = useRouter();

  const formRef = useRef(null);
  const [passwordType, setPasswordType] = useState('password');
  const passwordRef = useRef(null);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const submitToast = useRef(null);

  const handleLogin = (event) => {
    event.preventDefault();
    setBtnDisabled(true);
    submitToast.current = toast.loading('登入中', {...defaultProps});
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    axios
      .post(`${process.env.baseUrl}/api/blog/login`, formData).then((res) => {
        if (res.status === 200) {
          toast.update(submitToast.current, { render: `${res.data.message}！將於三秒後跳轉至首頁！`, type: "success", isLoading: false, ...defaultProps });
          Cookies.set('token', JSON.stringify(res.data));
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } else {
          toast.update(submitToast.current, { render: res.data.message, type: "error", isLoading: false, ...defaultProps });
          return;
        }
      })
      .catch((error) => {
        console.log('error', error);
        toast.update(submitToast.current, { render: error, type: "error", isLoading: false, ...defaultProps });
        return;
      });
    setBtnDisabled(false);
  };

  const handlePasswordToggle = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  return (
    <main className={pageStyles.wrapper}>
      <form method="post" action="" ref={formRef} className={styles.form}>
        <h1>登入</h1>
        <div className={formStyles.field}>
          <div className={formStyles.fieldTitle}>帳號</div>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="填寫您的帳號"
            size="large"
            flex={true}
            rounded={true}
          />
        </div>
        <div className={formStyles.field}>
          <div className={formStyles.fieldTitle}>密碼</div>
          <Input
            type={passwordType}
            name="password"
            id="password"
            inputRef={passwordRef}
            placeholder="輸入您的密碼"
            size="large"
            flex={true}
            rounded={true}
            right={<MdRemoveRedEye />}
            passWordToggle={handlePasswordToggle}
          />
        </div>
        <p>尚未註冊？請前往<Link href="/register" className="link">註冊</Link>！</p>
        <div className={formStyles.actions}>
          <Button
            color="primary"
            content={btnDisabled ? "登入中" : "登入"}
            size="large"
            width="relaxed"
            onClick={handleLogin}
            disabled={btnDisabled}
          />
          <Button
            color="secondary2"
            content="重設"
            type="reset"
            size="large"
            width="relaxed"
          />
        </div>
      </form>
    </main>
  )
}
