import { TextArea } from '../../controls/TextArea';
import { ButtonAddConditionChain } from '../ButtonAddConditionChain';
import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { useEffect, useRef } from 'react';
import styles from './MessageEditor.module.css';
import { ConditionalBlock } from '../ConditionalBlock';

interface IMessageEditorProps {
  onClose: () => void;
  arrVarNames: TArrVarNames;
}

export type TOnClickVarName = (varName: string) => void;

export type TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => void;

export function MessageEditor({ onClose, arrVarNames }: IMessageEditorProps) {
  const messageEditorRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedInput = useRef<HTMLTextAreaElement | null>(null);

  const setLastFocusedInput: TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => {
    lastFocusedInput.current = ref;
  };

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

  const handleClickVarName: TOnClickVarName = (varName: string) => {
    if (lastFocusedInput.current) {
      const input = lastFocusedInput.current;
      input.setRangeText(varName, input.selectionStart, input.selectionEnd, 'end');
    }
  };

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} onClickVarName={handleClickVarName} />
          <ButtonAddConditionChain />
          <TextArea onFocusInput={setLastFocusedInput} />
          <ConditionalBlock onFocusInput={setLastFocusedInput} />
          <TextArea onFocusInput={setLastFocusedInput} />
        </div>
      </div>
    </Modal>
  );
}
