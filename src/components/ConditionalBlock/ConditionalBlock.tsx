import { useLayoutEffect, useRef, useState } from 'react';
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
  const conditionalBlockRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const conditionalBlock = conditionalBlockRef.current;
    if (!conditionalBlock) return;

    if (expanded) {
      setBlockHeight(conditionalBlock.scrollHeight);
    } else {
      setBlockHeight(0);
      setExpanded(true);
    }
  }, [expanded]);

  if (!conditionalBlock) return null;

  const operators: ['if', 'then', 'else'] = ['if', 'then', 'else'];

  const handleTransitionEnd = () => {
    setBlockHeight(null);
  };

  return (
    <div
      className={styles.conditionalBlock}
      ref={conditionalBlockRef}
      onTransitionEnd={handleTransitionEnd}
      style={{ height: blockHeight !== null ? `${blockHeight}px` : 'auto' }}
    >
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
  );
}
