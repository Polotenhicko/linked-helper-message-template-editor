import { Button } from '../../controls/Button';
import templateService from '../../services/template.service';
import styles from './AddConditionalBlock.module.css';

interface IAddConditionalBlockProps {
  setChangesNotSaved: () => void;
  lastFocusedInput: React.RefObject<HTMLTextAreaElement>;
  firstInput: React.RefObject<HTMLTextAreaElement>;
}

export function AddConditionalBlock({
  setChangesNotSaved,
  lastFocusedInput,
  firstInput,
}: IAddConditionalBlockProps) {
  const handleAddConditionalBlock = () => {
    // lastFocusEl - last focused element
    // firstInputEl - always first input el
    const lastFocusEl = lastFocusedInput.current;
    const firstInputEl = firstInput.current;

    if (!firstInputEl) return;

    templateService.addEmptyConditionalBlock(firstInputEl, lastFocusEl);
    setChangesNotSaved();
  };

  return (
    <Button className={styles.button} onClick={handleAddConditionalBlock}>
      <span className={styles.title}>Click to add:</span>
      <span className="conditionalStroke">IF</span>
      {'[{some_variable} or expression]'}
      <span className="conditionalStroke">THEN</span>
      {'[then_value]'}
      <span className="conditionalStroke">ELSE</span>
      {'[else_value]'}
    </Button>
  );
}
