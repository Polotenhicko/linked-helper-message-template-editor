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
  // if has conditional blocks, then render textarea with secondValue
  const withConditionalBlock = !!conditionalBlocks.length;
  const isIfOperator = operator === 'if';

  useLayoutEffect(() => {
    // set first and second value from template when appears and disappears conditional blocks in operator
    // cause after adding or removing, may be that firstText will be cut out for second text
    setFirstValue(conditionalOperator.firstText);
    setSecondValue(conditionalOperator.secondText);
  }, [!!conditionalOperator.conditionalBlocks.length]);

  const handleFirstChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // after change input, set value from input to conditional operator and setFirstValue
    const value = e.target.value;
    conditionalOperator.firstText = value;
    setFirstValue(value);
    // user update teplate and not saved
    setChangesNotSaved();
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // after change input, set value from input to conditional operator and setFirstValue
    const value = e.target.value;
    conditionalOperator.secondText = value;
    setSecondValue(value);
    // user update teplate and not saved
    setChangesNotSaved();
  };

  const handleClickDeleteButton = () => {
    // if parent does not exist, then delete block in first arr conditional blocks
    if (parentId === undefined || !parentOperator) {
      templateService.deleteConditionalBlock(id);
      setChangesNotSaved();
      return;
    }

    // else insert parentInfo
    templateService.deleteConditionalBlock(id, { id: parentId, operator: parentOperator });
    setChangesNotSaved();
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
