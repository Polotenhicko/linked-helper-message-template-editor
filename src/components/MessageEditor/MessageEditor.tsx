import { Modal } from '../Modal';
import { VarNameList } from '../VarNameList';
import { TArrVarNames } from '../VarNameList/VarNameList';
import { useEffect, useRef, useState } from 'react';
import { ConditionalBlock } from '../ConditionalBlock';
import { InsertConditionalBlock } from '../InsertConditionalBlock';
import { TextArea } from '../../controls/TextArea';
import templateService, { IConditionalBlock, ITemplate } from '../../services/template.service';
import styles from './MessageEditor.module.css';

interface IMessageEditorProps {
  onClose: () => void;
  arrVarNames: TArrVarNames;
  template: ITemplate;
  callbackSave: () => void;
}

export type TOnClickVarName = (varName: string) => void;

export type TSetLastFocusedInput = (ref: HTMLTextAreaElement | null) => void;

export function MessageEditor({ onClose, arrVarNames, template: sample }: IMessageEditorProps) {
  const lastFocusedInput = useRef<HTMLTextAreaElement | null>(null);
  const firstInput = useRef<HTMLTextAreaElement>(null);
  const messageEditorRef = useRef<HTMLDivElement>(null);

  const [conditionalBlocks, setConditionalBlocks] = useState<IConditionalBlock[]>(sample.conditionalBlocks);
  const [startMessage, setStartMessage] = useState(sample.startMessage);
  const [finalMessage, setfinalMessage] = useState(sample.finalMessage);

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
    // Block scroll when show modal
    document.body.style.overflow = 'hidden';
    // Close modal on Esc
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

  const handleChangeStartMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStartMessage(e.target.value);
  };

  const handleChangeFinalMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setfinalMessage(e.target.value);
  };

  const firstConditionalBlock = conditionalBlocks[0];

  const handleAddConditionalBlock = () => {
    templateService.addEmptyConditionalBlock(conditionalBlocks);

    setConditionalBlocks([...conditionalBlocks]);
    console.log(conditionalBlocks);
  };

  return (
    <Modal>
      <div className={styles.modal} onClick={handleClickOutsideModal}>
        <div className={styles.messageEditor} ref={messageEditorRef}>
          <h2 className={styles.title}>Message Template Editor</h2>
          <VarNameList arrVarNames={arrVarNames} onClickVarName={handleClickVarName} />
          <InsertConditionalBlock onAddConditionalBlock={handleAddConditionalBlock} />

          <TextArea
            onFocusInput={setLastFocusedInput}
            onChange={handleChangeStartMessage}
            value={startMessage}
            textAreaRef={firstInput}
          />
          <ConditionalBlock onFocusInput={setLastFocusedInput} conditionalBlock={firstConditionalBlock} id={0} />
          <TextArea onFocusInput={setLastFocusedInput} onChange={handleChangeFinalMessage} value={finalMessage} />
        </div>
      </div>
    </Modal>
  );
}
