import { VarNameItem } from '../VarNameItem';
import styles from './VarNameList.module.css';

export type TArrVarNames = string[];

interface IVarNameList {
  arrVarNames: TArrVarNames;
}

export function VarNameList({ arrVarNames }: IVarNameList) {
  return (
    <ul className={styles.varNamesList}>
      {arrVarNames.map((varName, i) => (
        <VarNameItem key={i} varName={varName} />
      ))}
    </ul>
  );
}
