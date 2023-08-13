import { Button } from '../../controls/Button';
import templateService from '../../services/template.service';
import styles from './AddConditionalBlock.module.css';

interface IAddConditionalBlockProps {
  setChangesNotSaved: () => void;
  lastFocusedInput: React.RefObject<HTMLTextAreaElement | null>;
}

export function AddConditionalBlock({ setChangesNotSaved, lastFocusedInput }: IAddConditionalBlockProps) {
  const handleAddConditionalBlock = () => {
    const lastFocus = lastFocusedInput.current;
    // may be input was focused, but now is deleted from html
    const isRemovedInput = !document.body.contains(lastFocus);

    const id: number | null = lastFocus?.dataset.id ? Number(lastFocus.dataset.id) : null;
    const operator: string | null = lastFocus?.dataset.operator ? lastFocus.dataset.operator : null;

    // if id or operator is null or last focused input was deleted
    const isAddConditionalBlockToStart = !id || !operator || isRemovedInput;
    // then add empty conditional block into first arr conditional blocks
    if (isAddConditionalBlockToStart) {
      templateService.addEmptyConditionalBlock();
      // template was updated
      setChangesNotSaved();

      return;
    }
    // checking the operator that it is valid
    switch (operator) {
      case 'if':
      case 'then':
      case 'else':
        templateService.addEmptyConditionalBlock({ id, operator });
        break;
      default:
        return;
    }

    // template was updated
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
