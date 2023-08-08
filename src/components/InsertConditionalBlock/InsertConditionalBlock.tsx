import { Button } from '../../controls/Button';
import templateService from '../../services/template.service';
import styles from './InsertConditionalBlock.module.css';

interface IInsertConditionalBlockProps {
  setChangesNotSaved: () => void;
  lastFocusedInput: React.RefObject<HTMLTextAreaElement | null>;
}

export function InsertConditionalBlock({ setChangesNotSaved, lastFocusedInput }: IInsertConditionalBlockProps) {
  const handleAddConditionalBlock = () => {
    const lastFocus = lastFocusedInput.current;

    const id: number | null = lastFocus?.dataset.id ? Number(lastFocus.dataset.id) : null;
    const operator: string | null = lastFocus?.dataset.operator ? lastFocus.dataset.operator : null;

    if (!lastFocus || !id || !operator) {
      templateService.addEmptyConditionalBlock();
      setChangesNotSaved();
      console.log(templateService.template);

      return;
    }

    switch (operator) {
      case 'if':
      case 'then':
      case 'else':
        templateService.addEmptyConditionalBlock({ id, operator });
        break;
      default:
        return;
    }

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
