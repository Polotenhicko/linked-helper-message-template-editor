import { useState } from 'react';
import { Input } from '../../controls/Input';
import styles from './PreviewVariable.module.css';
import { THandleChangeInput } from '../MessagePreview/MessagePreview';

interface IPreviewVariable {
  varName: string;
  onChangeInput: THandleChangeInput;
}

export function PreviewVariable({ varName, onChangeInput }: IPreviewVariable) {
  const [value, setValue] = useState('');

  const handleChangeVariable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChangeInput(e);
  };

  return (
    <div className={styles.variableWrap}>
      <div className={styles.floatingPlaceholder}>{varName}</div>
      <Input
        className={styles.variableInput}
        value={value}
        onChange={handleChangeVariable}
        placeholder={varName}
        name={varName}
      />
    </div>
  );
}
