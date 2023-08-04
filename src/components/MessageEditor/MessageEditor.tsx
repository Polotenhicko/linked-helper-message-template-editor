import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { useEffect, useRef, useState } from 'react';
import styles from './MessageEditor.module.css';
import { ConditionalBlock } from '../ConditionalBlock';
import templateService from '../../services/template.service';
import { StartMessage } from '../StartMessage';
import { FinalMessage } from '../FinalMessage';
import { InsertConditionalBlock } from '../InsertConditionalBlock';

interface IMessageEditorProps {
  onClose: () => void;
  arrVarNames: TArrVarNames;
}

export type TOnClickVarName = (varName: string) => void;

export type TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => void;

export function MessageEditor({ onClose, arrVarNames }: IMessageEditorProps) {
  const lastFocusedInput = useRef<HTMLTextAreaElement | null>(null);
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);

  // const template = templateService.getTemplate();

  const setLastFocusedInput: TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => {
    lastFocusedInput.current = ref;
  };

  const handleInsertConditionalBlock = () => {
    // const isSuccessAdded = templateService.addEmptyConditionalBlock();
    // if (isSuccessAdded) {
    // }
  };

  const handleDeleteConditionalBlock = () => {};

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
    const input = lastFocusedInput.current ? lastFocusedInput.current : firstInput.current;

    if (input) {
      input.setRangeText(varName, input.selectionStart, input.selectionEnd, 'end');
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} onClickVarName={handleClickVarName} />
          <InsertConditionalBlock onInsertConditionalBlock={handleInsertConditionalBlock} />

          <StartMessage onFocusInput={setLastFocusedInput} textAreaRef={firstInput} />
          <ConditionalBlock onFocusInput={setLastFocusedInput} />
          <FinalMessage onFocusInput={setLastFocusedInput} />
        </div>
      </div>
    </Modal>
  );
}
