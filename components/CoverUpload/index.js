'use client';
import { useState, useEffect } from 'react';
import Img from 'next/image';
import styles from './index.module.css';
import { RiInbox2Line } from 'react-icons/ri';

export default function CoverUpload({ name, id, coverRef, cover, original, upload }) {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (cover && cover[0]) {
      const files = cover;
      let reader = new FileReader();
      reader.onload = function (event) {
        setImgSrc(event.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImgSrc(original ? original : null);
    }
  }, [cover, original]);

  return (
    <div className={styles.wrapper}>
      <input type="file" name={name} id={id} ref={coverRef} onChange={upload} />
      <label htmlFor={id}>
        {
          imgSrc
            ? <Img src={imgSrc} width={900} height={600} alt="cover" />
            : (
              <>
                <RiInbox2Line />選擇一張封面圖片
              </>
            )
        }
      </label>
    </div>
  );
}