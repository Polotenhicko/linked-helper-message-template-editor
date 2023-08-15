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
  const [startMessage, setStartMessage] = useState(conditionalOperator.startMessage);

  const isIfOperator = operator === 'if';

  useLayoutEffect(() => {
    // may be, that startMessage is sliced, or will be connected
    setStartMessage(conditionalOperator.startMessage);
  }, [conditionalOperator.conditionalBlocks.length]);

  const handleChangeStartMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // after change input, set value from input to conditional operator and setStartMessage
    const value = e.target.value;
    setStartMessage(value);
    // user update teplate and not saved
    setChangesNotSaved();
    conditionalOperator.startMessage = value;
  };

  const handleClickDeleteButton = () => {
    // if parent does not exist, then delete block in first arr conditional blocks
    if (parentId === undefined || !parentOperator) {
      const isSuccesDelete = templateService.deleteConditionalBlock(id);
      if (isSuccesDelete) setChangesNotSaved();
      return;
    }

    // else insert parentInfo
    const isSuccesDelete = templateService.deleteConditionalBlock(id, { id: parentId, operator: parentOperator });
    if (isSuccesDelete) setChangesNotSaved();
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
          value={startMessage}
          onChange={handleChangeStartMessage}
          onFocusInput={onFocusInput}
          className={styles.conditionalInput}
          data-id={id}
          data-operator={operator}
          data-start-message
        />
        <ConditionalBlockList
          conditionalBlocks={conditionalOperator.conditionalBlocks}
          onFocusInput={onFocusInput}
          setChangesNotSaved={setChangesNotSaved}
          parentId={id}
          parentOperator={operator}
        />
      </div>
    </div>
  );
}
