import clsx from 'clsx';
import styles from './index.module.css';
import { ImSpinner8 } from 'react-icons/im';
import { RiErrorWarningLine, RiAlertLine, RiInbox2Line } from 'react-icons/ri';
import { MdInfoOutline } from 'react-icons/md';

export default function DataStatus({ content, type, color }) {
  const icon = {
    loading: <ImSpinner8 />,
    error: <RiErrorWarningLine />,
    warning: <RiAlertLine />,
    empty: <RiInbox2Line />,
    info: <MdInfoOutline />,
  };

  return (
    <div className={clsx(styles.wrapper, styles[type], {
      [styles[color]]: color,
    })}>
      {icon[type]}
      {content}
    </div>
  );
}