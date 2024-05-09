'use client';
import clsx from 'clsx';
import styles from './index.module.css';

export default function Tabs({ tabs, handleClick, activeTab }) {
  return (
    <>
      <ul className={styles.tabs}>
        {
          tabs.map((tab) => {
            return (
              <li
                key={tab.id}
                className={clsx({[styles.active]: tab.value === activeTab})}
                onClick={() => {
                  handleClick(tab.value)
                }}
              >
                {tab.name}
              </li>
            )
          })
        }
      </ul>
    </>
  )
}