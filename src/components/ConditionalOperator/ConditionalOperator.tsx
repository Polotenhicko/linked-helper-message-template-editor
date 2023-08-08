import { useEffect, useState } from 'react';
import { TextArea } from '../../controls/TextArea';
import { IConditionalBlock, IConditionalOperatorObj } from '../../services/template.service';
import { ConditionalBlock } from '../ConditionalBlock';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './ConditionalOperator.module.css';
import { ConditionalBlockList } from '../ConditionalBlockList';

interface IConditionalOperatorProps {
  onFocusInput: TSetLastFocusedInput;
  conditionalOperator: IConditionalOperatorObj;
  setChangesNotSaved: () => void;
  id: number;
  operator: 'if' | 'then' | 'else';
  parentId?: number;
  parentOperator?: 'if' | 'then' | 'else';
}

export function ConditionalOperator({
  id,
  operator,
  onFocusInput,
  setChangesNotSaved,
  conditionalOperator,
  parentId,
  parentOperator,
}: IConditionalOperatorProps) {
  const [firstValue, setFirstValue] = useState(conditionalOperator.firstText);
  const [secondValue, setSecondValue] = useState(conditionalOperator.secondText);

  const { conditionalBlocks } = conditionalOperator;
  const withConditionalBlock = !!conditionalBlocks.length;

  useEffect(() => {
    if (conditionalOperator.secondText === '' && conditionalOperator.firstText !== '') {
      setSecondValue('');
    }
  }, [conditionalOperator.secondText]);

  const handleFirstChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFirstValue(value);
    conditionalOperator.firstText = value;
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSecondValue(value);
    conditionalOperator.secondText = value;
  };

  return (
    <div className={styles.conditionalOperatorWrap}>
      <div className={styles.conditionalOperator}>
        <span className="conditionalStroke">{operator}</span>
      </div>
      <div className={styles.conditionalInputWrap}>
        <TextArea
          value={firstValue}
          onChange={handleFirstChange}
          onFocusInput={onFocusInput}
          className={styles.conditionalInput}
          data-id={id}
          data-operator={operator}
        />
        <ConditionalBlockList
          conditionalBlocks={conditionalBlocks}
          onFocusInput={onFocusInput}
          setChangesNotSaved={setChangesNotSaved}
        />
        {withConditionalBlock && (
          <TextArea
            value={secondValue}
            onChange={handleSecondChange}
            onFocusInput={onFocusInput}
            className={styles.conditionalInput}
            data-id={id}
            data-operator={operator}
          />
        )}
      </div>
    </div>
  );
}
