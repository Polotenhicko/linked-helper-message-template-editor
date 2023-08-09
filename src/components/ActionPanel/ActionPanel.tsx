import styles from './ActionPanel.module.css';
import { Button } from '../../controls/Button';
import { ReactComponent as CanvasSvg } from '../../assets/icons/canvas.svg';
import { ReactComponent as CheckSvg } from '../../assets/icons/check.svg';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';
import { ReactComponent as CrossSvg } from '../../assets/icons/cross.svg';
import { cn } from '../../utils/cn';

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
  const classNameBtnLastSaves = cn({
    [styles.actionButton]: true,
    [styles.savingButton]: true,
    [styles.saved]: isLastChangesSaved,
  });

  const buttonSave = isLastChangesSaved ? (
    <>
      <CheckSvg /> Saved
    </>
  ) : (
    <>
      <CrossSvg /> Not saved
    </>
  );

  return (
    <div className={styles.actionPanel}>
      <Button className={styles.actionButton} onClick={onShowMessagePreview}>
        <CanvasSvg />
        Preview
      </Button>
      <Button className={classNameBtnLastSaves} onClick={onSaveTemplate}>
        {buttonSave}
      </Button>
      <Button className={styles.actionButton} onClick={onClose}>
        <CloseSvg />
        Close
      </Button>
    </div>
  );
}
