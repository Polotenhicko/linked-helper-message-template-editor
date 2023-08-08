import { IConditionalBlock } from '../../services/template.service';
import { ConditionalOperator } from '../ConditionalOperator';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalBlock.module.css';

interface IConditionalBlockProps {
  onFocusInput: TSetLastFocusedInput;
  conditionalBlock?: IConditionalBlock;
  setChangesNotSaved: () => void;
  parentId?: number;
  parentOperator?: 'if' | 'then' | 'else';
}

export function ConditionalBlock({
  onFocusInput,
  conditionalBlock,
  setChangesNotSaved,
  parentId,
  parentOperator,
}: IConditionalBlockProps) {
  if (!conditionalBlock) return null;

  return (
    <div className={styles.conditionalBlock}>
      <ConditionalOperator
        onFocusInput={onFocusInput}
        conditionalOperator={conditionalBlock.if}
        setChangesNotSaved={setChangesNotSaved}
        operator="if"
        id={conditionalBlock.id}
        parentId={parentId}
        parentOperator={parentOperator}
      />
      <ConditionalOperator
        onFocusInput={onFocusInput}
        conditionalOperator={conditionalBlock.then}
        setChangesNotSaved={setChangesNotSaved}
        operator="then"
        id={conditionalBlock.id}
        parentId={parentId}
        parentOperator={parentOperator}
      />
      <ConditionalOperator
        onFocusInput={onFocusInput}
        conditionalOperator={conditionalBlock.else}
        setChangesNotSaved={setChangesNotSaved}
        operator="else"
        id={conditionalBlock.id}
        parentId={parentId}
        parentOperator={parentOperator}
      />
    </div>
  );
}
