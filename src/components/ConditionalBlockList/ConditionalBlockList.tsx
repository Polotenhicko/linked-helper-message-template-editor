import { IConditionalBlock } from '../../services/template.service';
import { ConditionalBlock } from '../ConditionalBlock/ConditionalBlock';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalBlockList.module.css';

interface IConditionalBlockListProps {
  onFocusInput: TSetLastFocusedInput;
  conditionalBlocks: IConditionalBlock[];
  setChangesNotSaved: () => void;
}

export function ConditionalBlockList({
  onFocusInput,
  conditionalBlocks,
  setChangesNotSaved,
}: IConditionalBlockListProps) {
  if (!conditionalBlocks.length) return null;

  return (
    <div className={styles.conditionalBlockList}>
      {conditionalBlocks.map((conditionalBlock) => (
        <ConditionalBlock
          key={conditionalBlock.id}
          onFocusInput={onFocusInput}
          conditionalBlock={conditionalBlock}
          setChangesNotSaved={setChangesNotSaved}
        />
      ))}
    </div>
  );
}
