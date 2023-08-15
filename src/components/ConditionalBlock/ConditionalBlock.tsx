import { useLayoutEffect, useState } from 'react';
import { TextArea } from '../../controls/TextArea';
import { IConditionalBlock } from '../../services/template.service';
import { ConditionalOperator } from '../ConditionalOperator';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalBlock.module.css';

interface IConditionalBlockProps {
  onFocusInput: TSetLastFocusedInput;
  conditionalBlock: IConditionalBlock;
  setChangesNotSaved: () => void;
  parentId?: number;
  parentOperator?: 'if' | 'then' | 'else';
  arrConditionalBlocks: IConditionalBlock[];
}

type TOperators = ['if', 'then', 'else'];

export function ConditionalBlock({
  onFocusInput,
  conditionalBlock,
  setChangesNotSaved,
  parentId,
  parentOperator,
  arrConditionalBlocks,
}: IConditionalBlockProps) {
  const [finalMessage, setFinalMessage] = useState(conditionalBlock.finalMessage);

  useLayoutEffect(() => {
    // may be, that finalMessage is sliced, or will be connected
    setFinalMessage(conditionalBlock.finalMessage);
  }, [arrConditionalBlocks.length]);

  const operators: TOperators = ['if', 'then', 'else'];

  const handleChangeFinalMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFinalMessage(value);
    setChangesNotSaved();
    conditionalBlock.finalMessage = value;
  };

  return (
    <>
      <div className={styles.conditionalBlock}>
        {operators.map((operator, i) => (
          <ConditionalOperator
            onFocusInput={onFocusInput}
            conditionalOperator={conditionalBlock[operator]}
            setChangesNotSaved={setChangesNotSaved}
            operator={operator}
            id={conditionalBlock.id}
            parentId={parentId}
            parentOperator={parentOperator}
            key={i}
          />
        ))}
      </div>
      <TextArea
        value={finalMessage}
        onChange={handleChangeFinalMessage}
        onFocusInput={onFocusInput}
        data-parent-id={parentId}
        data-parent-operator={parentOperator}
        data-id={conditionalBlock.id}
        data-final-message
      />
    </>
  );
}
