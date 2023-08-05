import { Button } from '../../controls/Button';
import { ConditionalWordsDecorator } from '../ConditionalWordsDecorator';
import styles from './InsertConditionalBlock.module.css';

interface IInsertConditionalBlockProps {
  onAddConditionalBlock: () => void;
}

export function InsertConditionalBlock({ onAddConditionalBlock }: IInsertConditionalBlockProps) {
  return (
    <Button className={styles.button} onClick={onAddConditionalBlock}>
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
