import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';
import styles from './DialogSaveChanges.module.css';
import { Button } from '../../controls/Button';
import { cn } from '../../utils/cn';

interface DialogSaveChangesProps {
  onCloseDialog: () => void;
  onSave: () => Promise<void>;
}

export function DialogSaveChanges({ onCloseDialog, onSave }: DialogSaveChangesProps) {
  const dialogElRef = useRef<HTMLDivElement>(null);

  const [isRendered, setisRendered] = useState(false);

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    if (!dialogElRef.current) return;
    if (!(e.target instanceof Node)) return;

    const dialogEl = dialogElRef.current;

    if (!dialogEl.contains(e.target)) {
      onCloseDialog();
    }
  };

  const handleClickSave = () => {
    onSave();
    onCloseDialog();
  };

  useEffect(() => {
    setisRendered(true);
  }, []);

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.dialog} style={{ opacity: isRendered ? 1 : 0 }} ref={dialogElRef}>
          <div className={styles.title}>You haven't saved your changes! Are you sure you want to leave?</div>
          <div className={styles.buttonList}>
            <Button className={cn(styles.agree, styles.button)} onClick={handleClickSave}>
              Yes
            </Button>
            <Button className={cn(styles.disagree, styles.button)} onClick={onCloseDialog}>
              No
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
