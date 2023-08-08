import { PreviewVariable } from '../PreviewVariable/PreviewVariable';
import { TArrVarNames } from '../VarNameList/VarNameList';
import styles from './PreviewVariableList.module.css';

interface IPreviewVariableListProps {
  arrVarNames: TArrVarNames;
}

export function PreviewVariableList({ arrVarNames }: IPreviewVariableListProps) {
  const isEmptyVarNames = !arrVarNames.length;

  return (
    <div className={styles.variableList}>
      <span className={styles.variableIdea}>Variables: </span>
      {isEmptyVarNames
        ? 'VarNames is empty!'
        : arrVarNames.map((varName, i) => <PreviewVariable key={i} varName={varName} />)}
    </div>
  );
}
