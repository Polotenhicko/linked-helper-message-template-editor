import { TOnClickVarName } from '../MessageEditor/MessageEditor';
import { VarNameItem } from '../VarNameItem';
import styles from './VarNameList.module.css';

export type TArrVarNames = string[];

interface IVarNameList {
  arrVarNames: TArrVarNames;
  onClickVarName: TOnClickVarName;
}

export function VarNameList({ arrVarNames, onClickVarName }: IVarNameList) {
  return (
    <ul className={styles.varNamesList}>
      {arrVarNames.map((varName, i) => (
        <VarNameItem key={i} varName={varName} onClick={onClickVarName} />
      ))}
    </ul>
  );
}
