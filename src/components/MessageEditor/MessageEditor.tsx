import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { useEffect, useRef, useState } from 'react';
import { InsertConditionalBlock } from '../InsertConditionalBlock';
import { TextArea } from '../../controls/TextArea';
import templateService, { ITemplate } from '../../services/template.service';
import styles from './MessageEditor.module.css';
import { useObserverService } from '../../hooks/useObserverService';
import { TCallbackSave } from '../../App';
import { ActionPanel } from '../ActionPanel';
import { ConditionalBlockList } from '../ConditionalBlockList';

interface IMessageEditorProps {
  onClose: () => void;
  arrVarNames: TArrVarNames;
  template: ITemplate;
  callbackSave: TCallbackSave;
  onShowMessagePreview: () => void;
}

export type TOnClickVarName = (varName: string) => void;

export type TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => void;

export function MessageEditor({
  onClose,
  arrVarNames,
  template: sample,
  callbackSave,
  onShowMessagePreview,
}: IMessageEditorProps) {
  const lastFocusedInput = useRef<HTMLTextAreaElement | null>(null);
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);

  useObserverService(templateService);

  const [startMessage, setStartMessage] = useState(sample.startMessage);
  const [finalMessage, setfinalMessage] = useState(sample.finalMessage);
  const [isLastChangesSaved, setIsLastChangesSaved] = useState(true);

  const setLastFocusedInput: TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => {
    lastFocusedInput.current = ref;
  };

  const setChangesNotSaved = () => {
    setIsLastChangesSaved(false);
  };

  const handleConfirmClose = (): boolean => {
    if (!isLastChangesSaved) {
      return window.confirm('Вы не сохранили изменения! Вы действиельной хотите выйти?');
    }

    return true;
  };

  const handleClose = () => {
    if (!handleConfirmClose()) return;
    templateService.clearTemplate();
    onClose();
  };

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    // Если реф диалогового окна === null, то выходим
    if (!messageEditorRef.current) return;
    // Сужаем тип у e.target до ноды, чтобы contains смог его схавать
    if (!(e.target instanceof Node)) return;

    // Если клик был сделан не внутри компонента
    if (!messageEditorRef.current.contains(e.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    // Block scroll when show modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClickVarName: TOnClickVarName = (varName: string) => {
    const existLastFocusedInput = document.body.contains(lastFocusedInput.current);
    const input = existLastFocusedInput ? lastFocusedInput.current : firstInput.current;

    if (input) {
      input.setRangeText(varName, input.selectionStart, input.selectionEnd, 'end');
      const event = new Event('input', { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const handleChangeStartMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setStartMessage(val);
    setChangesNotSaved();
    sample.startMessage = val;
  };

  const handleChangeFinalMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setfinalMessage(val);
    setChangesNotSaved();
    sample.finalMessage = val;
  };

  const handleSaveTemplate = () => {
    callbackSave().then(() => {
      setIsLastChangesSaved(true);
    });
  };

  const conditionalBlocks = sample.conditionalBlocks;

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} onClickVarName={handleClickVarName} />
          <InsertConditionalBlock setChangesNotSaved={setChangesNotSaved} lastFocusedInput={lastFocusedInput} />

          <TextArea
            onFocusInput={setLastFocusedInput}
            onChange={handleChangeStartMessage}
            value={startMessage}
            textAreaRef={firstInput}
          />
          <ConditionalBlockList
            onFocusInput={setLastFocusedInput}
            conditionalBlocks={conditionalBlocks}
            setChangesNotSaved={setChangesNotSaved}
          />
          <TextArea onFocusInput={setLastFocusedInput} onChange={handleChangeFinalMessage} value={finalMessage} />
          <ActionPanel
            onSaveTemplate={handleSaveTemplate}
            onClose={handleClose}
            onShowMessagePreview={onShowMessagePreview}
            isLastChangesSaved={isLastChangesSaved}
          />
        </div>
      </div>
    </Modal>
  );
}
