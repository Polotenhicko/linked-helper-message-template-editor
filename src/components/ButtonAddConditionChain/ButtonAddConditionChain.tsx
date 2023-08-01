import { Button } from '../../controls/Button';
import { ConditionalWordsDecorator } from '../ConditionalWordsDecorator';
import styles from './ButtonAddConditionChain.module.css';

export function ButtonAddConditionChain() {
  return (
    <Button className={styles.button}>
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
