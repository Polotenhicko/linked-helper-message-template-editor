import { cn } from '../../utils/cn';
import styles from './SaveStatus.module.css';
import { ReactComponent as CheckSvg } from '../../assets/icons/check.svg';
import { ReactComponent as CrossSvg } from '../../assets/icons/cross.svg';

interface ISaveStatusProps {
  isLastChangesSaved: boolean;
}

export function SaveStatus({ isLastChangesSaved }: ISaveStatusProps) {
  const statusText = isLastChangesSaved ? (
    <>
      <CheckSvg />
      Сохранено
    </>
  ) : (
    <>
      <CrossSvg />
      Не сохранено
    </>
  );

  const className = cn({
    [styles.status]: true,
    [styles.saved]: isLastChangesSaved,
  });

  return <div className={className}>{statusText}</div>;
}
