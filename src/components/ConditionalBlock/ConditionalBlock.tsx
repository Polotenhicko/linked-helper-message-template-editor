import { IConditionalBlock } from '../../services/template.service';
import { ConditionalPart } from '../ConditionalPart';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalBlock.module.css';

interface IConditionalBlockProps {
  id: number;
  onFocusInput: TSetLastFocusedInput;
  conditionalBlock?: IConditionalBlock;
}

export function ConditionalBlock({ onFocusInput, conditionalBlock, id }: IConditionalBlockProps) {
  if (!conditionalBlock) return null;

  return (
    <div className={styles.conditionalBlock}>
      <ConditionalPart onFocusInput={onFocusInput} operator="IF" />
      <ConditionalPart onFocusInput={onFocusInput} operator="THEN" />
      <ConditionalPart onFocusInput={onFocusInput} operator="ELSE" />
    </div>
  );
}
