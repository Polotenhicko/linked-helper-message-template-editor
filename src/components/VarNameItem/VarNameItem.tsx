import styles from './VarNameItem.module.css';

interface IVarNameItem {
  varName: string;
}

export function VarNameItem({ varName }: IVarNameItem) {
  const templateString = `{${varName}}`;
  return <li className={styles.varNameItem}>{templateString}</li>;
}
