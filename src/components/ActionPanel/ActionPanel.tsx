import styles from './ActionPanel.module.css';
import { Button } from '../../controls/Button';
import { ReactComponent as CanvasSvg } from '../../assets/icons/canvas.svg';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';
import { ReactComponent as SaveSvg } from '../../assets/icons/save.svg';
import { cn } from '../../utils/cn';
import { SaveStatus } from '../SaveStatus';

interface IActionPanelProps {
  onSaveTemplate: () => void;
  onClose: () => void;
  onShowMessagePreview: () => void;
  isLastChangesSaved: boolean;
}

export function ActionPanel({
  onSaveTemplate,
  onClose,
  onShowMessagePreview,
  isLastChangesSaved,
}: IActionPanelProps) {
  return (
    <div className={styles.actionPanel}>
      <SaveStatus isLastChangesSaved={isLastChangesSaved} />
      <div className={styles.buttonList}>
        <Button className={styles.actionButton} onClick={onShowMessagePreview}>
          <CanvasSvg />
          Preview
        </Button>
        <Button className={cn(styles.actionButton, styles.savingButton)} onClick={onSaveTemplate}>
          <SaveSvg />
          Save
        </Button>
        <Button className={styles.actionButton} onClick={onClose}>
          <CloseSvg />
          Close
        </Button>
      </div>
    </div>
  );
}
