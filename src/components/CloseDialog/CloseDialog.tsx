import { useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';
import styles from './CloseDialog.module.css';
import { Button } from '../../controls/Button';
import { cn } from '../../utils/cn';

interface CloseDialogProps {
  onCloseDialog: () => void;
  onCloseMessageEditor: () => void;
}

export function CloseDialog({ onCloseDialog, onCloseMessageEditor }: CloseDialogProps) {
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

  useEffect(() => {
    setisRendered(true);
  }, []);

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.dialog} style={{ opacity: isRendered ? 1 : 0 }} ref={dialogElRef}>
          <div className={styles.title}>You haven't saved your changes! Are you sure want to leave?</div>
          <div className={styles.buttonList}>
            <Button className={cn(styles.disagree, styles.button)} onClick={onCloseMessageEditor}>
              Yes
            </Button>
            <Button className={cn(styles.agree, styles.button)} onClick={onCloseDialog}>
              No
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
