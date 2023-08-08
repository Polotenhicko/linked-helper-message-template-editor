import { useState } from 'react';
import { Input } from '../../controls/Input';
import styles from './PreviewVariable.module.css';

interface IPreviewVariable {
  varName: string;
}

export function PreviewVariable({ varName }: IPreviewVariable) {
  const [value, setValue] = useState('');
  const handleChangeVariable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.variableWrap}>
      <div className={styles.floatingPlaceholder}>{varName}</div>
      <Input
        className={styles.variableInput}
        value={value}
        onChange={handleChangeVariable}
        placeholder={varName}
      />
    </div>
  );
}
