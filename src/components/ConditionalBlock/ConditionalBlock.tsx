import { ConditionalPart } from '../ConditionalPart';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalBlock.module.css';

interface IConditionalBlockProps {
  onFocusInput: TSetLastFocusedInput;
}

export function ConditionalBlock({ onFocusInput }: IConditionalBlockProps) {
  return (
    <div className={styles.conditionalBlock}>
      <ConditionalPart onFocusInput={onFocusInput} operator="IF" />
      <ConditionalPart onFocusInput={onFocusInput} operator="THEN" />
      <ConditionalPart onFocusInput={onFocusInput} operator="ELSE" />
    </div>
  );
}
