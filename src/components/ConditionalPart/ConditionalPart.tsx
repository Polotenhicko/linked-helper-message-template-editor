import { Button } from '../../controls/Button';
import { TextArea } from '../../controls/TextArea';
import { ConditionalWordsDecorator } from '../ConditionalWordsDecorator';
import styles from './ConditionalPart.module.css';
// import TrashBucketSvg from './../../assets/icons/traskBucket.svg';
import { TrashBucketSvg } from '../../assets/icons/TrashBucket';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';

interface IConditionalPartProps {
  operator: string;
  onFocusInput: TSetLastFocusedInput;
}

export function ConditionalPart({ operator, onFocusInput }: IConditionalPartProps) {
  const isIfOperator = operator.toLowerCase() === 'if';
  return (
    <div className={styles.conditionalPart}>
      <div className={styles.conditionalOperator}>
        <ConditionalWordsDecorator>{operator}</ConditionalWordsDecorator>
        {isIfOperator && (
          <Button className={styles.btnDeleteConditionalBlock}>
            <TrashBucketSvg /> Delete
          </Button>
        )}
      </div>
      <div className={styles.conditionalInputWrap}>
        <TextArea onFocusInput={onFocusInput} className={styles.conditionalInput} />
      </div>
    </div>
  );
}
