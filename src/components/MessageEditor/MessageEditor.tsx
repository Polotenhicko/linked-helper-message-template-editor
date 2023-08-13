import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { useEffect, useRef, useState } from 'react';
import { AddConditionalBlock } from '../AddConditionalBlock';
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
  // first input, if lastFocused does not exist
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);

  useObserverService(templateService);

  // get sample from props, or getTemplate from service
  const template = sample ?? templateService.getTemplate();

  const [isOpenMessagePreview, setIsOpenMessagePreview] = useState(false);
  const [startMessage, setStartMessage] = useState(template.startMessage);
  const [finalMessage, setfinalMessage] = useState(template.finalMessage);
  const [isLastChangesSaved, setIsLastChangesSaved] = useState(true);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Block scroll when show modal
    document.body.style.overflow = 'hidden';
    // force update for animation
    setIsRendered(true);

    return () => {
      // return scroll
      document.body.style.overflow = 'auto';
    };
  }, []);

  // callback-ref for set lastFocusedRef on last focus
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

  // final close processing
  const handleClose = () => {
    templateService.clearTemplate();
    onClose();
  };

  // close attempt processing
  const handleAttemptToClose = () => {
    if (!isLastChangesSaved) {
      // open close dialog
      handleOpenCloseDialog();
    } else {
      // close modal
      handleClose();
    }
  };

  const handleClickOutsideModal = (e: React.MouseEvent<Node>) => {
    // if current does not exist, then return
    if (!messageEditorRef.current) return;
    // narrow down the type to Node
    if (!(e.target instanceof Node)) return;

    // handler click to indicate click past the modal
    if (!messageEditorRef.current.contains(e.target)) {
      handleAttemptToClose();
    }
  };

  // handler click on varName
  const handleClickVarName: TOnClickVarName = (varName: string) => {
    const existLastFocusedInput = document.body.contains(lastFocusedInput.current);
    // choose ref, lastFocused if exist, else firstInput
    const input = existLastFocusedInput ? lastFocusedInput.current : firstInput.current;

    if (input) {
      // use Selection API (method in input)
      input.setRangeText(varName, input.selectionStart, input.selectionEnd, 'end');
      // setRangeText does not call input event in input
      // thats why used dispatchEvent
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

  // callbacksave handler
  // async, to able to add handler after saving
  const handleSaveTemplate = async (): Promise<void> => {
    await callbackSave();
    setIsLastChangesSaved(true);
  };

  const handleCloseMessagePreview = () => {
    setIsOpenMessagePreview(false);
  };

  const handleShowMessagePreview = () => {
    setIsOpenMessagePreview(true);
  };

  return (
    <Modal>
      <div
        className={styles.modal}
        onClick={handleClickOutsideModal}
        style={{
          opacity: isRendered ? 1 : 0,
        }}
      >
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} onClickVarName={handleClickVarName} />
          <AddConditionalBlock setChangesNotSaved={setChangesNotSaved} lastFocusedInput={lastFocusedInput} />
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
