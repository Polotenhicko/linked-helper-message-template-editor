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

  if (!conditionalBlock) return null;

  const operators: ['if', 'then', 'else'] = ['if', 'then', 'else'];

  return (
    <div className={styles.conditionalBlock} ref={conditionalBlockRef}>
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
