import { TOnClickVarName } from '../MessageEditor/MessageEditor';
import styles from './VarNameItem.module.css';

interface IVarNameItem {
  varName: string;
  onClick: TOnClickVarName;
}

export function VarNameItem({ varName, onClick }: IVarNameItem) {
  const templateString = `{${varName}}`;

  const handleClick = () => {
    onClick(templateString);
  };
  return (
    <li className={styles.varNameItem} onClick={handleClick}>
      {templateString}
    </li>
  );
}
