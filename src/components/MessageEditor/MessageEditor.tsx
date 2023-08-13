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
import { CloseDialog } from '../CloseDialog';
import { MessagePreview } from '../MessagePreview';

interface IMessageEditorProps {
  arrVarNames: TArrVarNames;
  template?: ITemplate;
  callbackSave: TCallbackSave;
  onClose: () => void;
}

export type TOnClickVarName = (varName: string) => void;

export type TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => void;

export function MessageEditor({ onClose, arrVarNames, template: sample, callbackSave }: IMessageEditorProps) {
  const lastFocusedInput = useRef<HTMLTextAreaElement | null>(null);
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);

  useObserverService(templateService);

  const template = sample ? sample : templateService.getTemplate();

  const [isOpenMessagePreview, setIsOpenMessagePreview] = useState(false);
  const [startMessage, setStartMessage] = useState(template.startMessage);
  const [finalMessage, setfinalMessage] = useState(template.finalMessage);
  const [isLastChangesSaved, setIsLastChangesSaved] = useState(true);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Block scroll when show modal
    document.body.style.overflow = 'hidden';

    setIsRendered(true);
    console.log();

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const setLastFocusedInput: TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => {
    lastFocusedInput.current = ref;
  };

  const setChangesNotSaved = () => {
    setIsLastChangesSaved(false);
  };

  const handleOpenCloseDialog = () => {
    setShowCloseDialog(true);
  };

  const handleEndCloseDialog = () => {
    setShowCloseDialog(false);
  };

  const handleClose = () => {
    templateService.clearTemplate();
    onClose();
  };

  const handleAttemptToClose = () => {
    if (!isLastChangesSaved) {
      handleOpenCloseDialog();
    } else {
      handleClose();
    }
  };

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    // Если реф диалогового окна === null, то выходим
    if (!messageEditorRef.current) return;
    // Сужаем тип у e.target до ноды, чтобы contains смог его схавать
    if (!(e.target instanceof Node)) return;

    // Если клик был сделан не внутри компонента
    if (!messageEditorRef.current.contains(e.target)) {
      handleAttemptToClose();
    }
  };

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
    template.startMessage = val;
  };

  const handleChangeFinalMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setfinalMessage(val);
    setChangesNotSaved();
    template.finalMessage = val;
  };

  const handleSaveTemplate = async (): Promise<void> => {
    return callbackSave().then(() => {
      setIsLastChangesSaved(true);
    });
  };

  const handleCloseMessagePreview = () => {
    setIsOpenMessagePreview(false);
  };

  const handleShowMessagePreview = () => {
    setIsOpenMessagePreview(true);
  };

  const modalStyle = {
    opacity: isRendered ? 1 : 0,
  };

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal} style={modalStyle}>
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
            conditionalBlocks={template.conditionalBlocks}
            setChangesNotSaved={setChangesNotSaved}
          />
          <TextArea onFocusInput={setLastFocusedInput} onChange={handleChangeFinalMessage} value={finalMessage} />
          <ActionPanel
            onSaveTemplate={handleSaveTemplate}
            onClose={handleAttemptToClose}
            onShowMessagePreview={handleShowMessagePreview}
            isLastChangesSaved={isLastChangesSaved}
          />
        </div>
      </div>
      {isOpenMessagePreview && (
        <MessagePreview arrVarNames={arrVarNames} template={template} onClose={handleCloseMessagePreview} />
      )}
      {showCloseDialog && <CloseDialog onCloseMessageEditor={handleClose} onCloseDialog={handleEndCloseDialog} />}
    </Modal>
  );
}
