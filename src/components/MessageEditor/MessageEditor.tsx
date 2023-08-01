import { ButtonAddConditionChain } from '../ButtonAddConditionChain';
import { FinalMessage } from '../FinalMessage';
import { Modal } from '../Modal';
import { StartMessage } from '../StartMessage';
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

  const handleKeydownEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    // Блокируем скролл во время показа модалки
    document.body.style.overflow = 'hidden';
    // Закрываем модалку на Esc
    document.body.addEventListener('keydown', handleKeydownEscape);
    return () => {
      document.body.style.overflow = 'auto';
      document.body.removeEventListener('keydown', handleKeydownEscape);
    };
  }, []);

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} />
          <ButtonAddConditionChain />
          <StartMessage />
          <FinalMessage />
        </div>
      </div>
    </Modal>
  );
}
