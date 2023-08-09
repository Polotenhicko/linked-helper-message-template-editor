import styles from './ActionPanel.module.css';
import { Button } from '../../controls/Button';
import { ReactComponent as CanvasSvg } from '../../assets/icons/canvas.svg';
import { ReactComponent as CheckSvg } from '../../assets/icons/check.svg';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';

interface IActionPanelProps {
  onSaveTemplate: () => void;
  onClose: () => void;
  onShowMessagePreview: () => void;
}

export function ActionPanel({ onSaveTemplate, onClose, onShowMessagePreview }: IActionPanelProps) {
  return (
    <div className={styles.actionPanel}>
      <Button className={styles.actionButton} onClick={onShowMessagePreview}>
        <CanvasSvg />
        Preview
      </Button>
      <Button className={styles.actionButton} onClick={onSaveTemplate}>
        <CheckSvg />
        Save
      </Button>
      <Button className={styles.actionButton} onClick={onClose}>
        <CloseSvg />
        Close
      </Button>
    </div>
  );
}
