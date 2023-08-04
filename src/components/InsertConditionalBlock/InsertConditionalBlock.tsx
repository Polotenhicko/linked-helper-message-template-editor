import { Button } from '../../controls/Button';
import { ConditionalWordsDecorator } from '../ConditionalWordsDecorator';
import styles from './InsertConditionalBlock.module.css';

interface IInsertConditionalBlockProps {
  onInsertConditionalBlock: () => void;
}

export function InsertConditionalBlock({ onInsertConditionalBlock }: IInsertConditionalBlockProps) {
  return (
    <Button className={styles.button} onClick={onInsertConditionalBlock}>
      <span className={styles.title}>Click to add:</span>
      <ConditionalWordsDecorator>IF</ConditionalWordsDecorator>
      {'[{some_variable} or expression]'}
      <ConditionalWordsDecorator>THEN</ConditionalWordsDecorator>
      {'[then_value]'}
      <ConditionalWordsDecorator>ELSE</ConditionalWordsDecorator>
      {'[else_value]'}
    </Button>
  );
}
