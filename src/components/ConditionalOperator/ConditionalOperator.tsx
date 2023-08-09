import { useLayoutEffect, useState } from 'react';
import { TextArea } from '../../controls/TextArea';
import templateService, { IConditionalOperatorObj } from '../../services/template.service';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import { ConditionalBlockList } from '../ConditionalBlockList';
import { Button } from '../../controls/Button';
import { ReactComponent as TrashBucketSvg } from '../../assets/icons/trashBucket.svg';
import styles from './ConditionalOperator.module.css';

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
  const isIfOperator = operator === 'if';

  useLayoutEffect(() => {
    if (conditionalOperator.secondText === '' && conditionalOperator.firstText !== '') {
      setFirstValue(conditionalOperator.firstText);
      setSecondValue('');
    }
  }, [conditionalOperator.secondText, conditionalOperator.firstText]);

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

  const handleClickDeleteButton = () => {
    if (parentId === undefined || !parentOperator) {
      templateService.deleteConditionalBlock(id);
      return;
    }

    templateService.deleteConditionalBlock(id, { id: parentId, operator: parentOperator });
  };

  return (
    <div className={styles.conditionalOperatorWrap}>
      <div className={styles.conditionalOperator}>
        <span className="conditionalStroke">{operator}</span>
        {isIfOperator && (
          <Button className={styles.btnDeleteConditionalBlock} onClick={handleClickDeleteButton}>
            <TrashBucketSvg />
            Delete
          </Button>
        )}
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
          parentId={id}
          parentOperator={operator}
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
