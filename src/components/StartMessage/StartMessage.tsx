import { useState } from 'react';
import { TextArea } from '../../controls/TextArea';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import { ITemplate } from '../../services/template.service';

interface IStartMessage {
  onFocusInput: TSetLastFocusedInput;
  template: ITemplate;
  setChangesNotSaved: () => void;
  firstInputRef: React.RefObject<HTMLTextAreaElement>;
}

export function StartMessage({ onFocusInput, template, setChangesNotSaved, firstInputRef }: IStartMessage) {
  const [startMessage, setStartMessage] = useState(template.startMessage);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // update visual text in textarea
    setStartMessage(value);
    setChangesNotSaved();
    // set text value in startMessage
    template.startMessage = value;
  };

  return (
    <TextArea
      onFocusInput={onFocusInput}
      onChange={handleChangeMessage}
      value={startMessage}
      textAreaRef={firstInputRef}
    />
  );
}
