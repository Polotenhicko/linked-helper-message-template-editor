import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import styles from './MessageEditor.module.css';
import { useEffect, useRef } from 'react';

interface IMessageEditorProps {
  onClose: () => void;
  arrVarNames: TArrVarNames;
}

export function MessageEditor({ onClose, arrVarNames }: IMessageEditorProps) {
  const messageEditorRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    // Если реф диалогового окна === null, то выходим
    if (!messageEditorRef.current) return;
    // Сужаем тип у e.target до ноды, чтобы contains смог его схавать
    if (!(e.target instanceof Node)) return;

    // Если клик был сделан не внутри компонента
    if (!messageEditorRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    // Блокируем скролл во время показа модалки
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} />
        </div>
      </div>
    </Modal>
  );
}
