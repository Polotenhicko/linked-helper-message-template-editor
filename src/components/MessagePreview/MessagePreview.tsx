import styles from './MessagePreview.module.css';
import { Modal } from '../Modal';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { ITemplate } from '../../services/template.service';
import { ReactComponent as CloseSvg } from '../../assets/icons/close.svg';
import { PreviewVariableList } from '../PreviewVariableList';
import { useRef } from 'react';
import { Button } from '../../controls/Button';

interface IMessagePreviewProps {
  arrVarNames: TArrVarNames;
  template: ITemplate;
  onClose: () => void;
}

export function MessagePreview({ arrVarNames, template: sample, onClose }: IMessagePreviewProps) {
  const messagePreviewRef = useRef<HTMLDivElement | null>(null);

  const handleClose = () => {
    onClose();
  };

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    if (!messagePreviewRef.current) return;
    if (!(e.target instanceof Node)) return;

    if (!messagePreviewRef.current.contains(e.target)) {
      handleClose();
    }
  };

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messagePreview} ref={messagePreviewRef}>
          <h2 className={styles.title}>Message Preview</h2>
          <div className={styles.message}></div>
          <PreviewVariableList arrVarNames={arrVarNames} />
          <Button className={styles.actionPanelCloseBtn} onClick={handleClose}>
            Close
          </Button>
          <CloseSvg className={styles.closeBtn} onClick={handleClose} />
        </div>
      </div>
    </Modal>
  );
}
