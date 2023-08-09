import { THandleChangeInput } from '../MessagePreview/MessagePreview';
import { PreviewVariable } from '../PreviewVariable/PreviewVariable';
import { TArrVarNames } from '../VarNameList/VarNameList';
import styles from './PreviewVariableList.module.css';

interface IPreviewVariableListProps {
  arrVarNames: TArrVarNames;
  onChangeInput: THandleChangeInput;
}

export function PreviewVariableList({ arrVarNames, onChangeInput }: IPreviewVariableListProps) {
  const isEmptyVarNames = !arrVarNames.length;

  return (
    <div className={styles.variableList}>
      <span className={styles.variableIdea}>Variables: </span>
      {isEmptyVarNames
        ? 'VarNames is empty!'
        : arrVarNames.map((varName, i) => (
            <PreviewVariable key={i} varName={varName} onChangeInput={onChangeInput} />
          ))}
    </div>
  );
}
