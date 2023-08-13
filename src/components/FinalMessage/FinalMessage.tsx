import { useState } from 'react';
import { TextArea } from '../../controls/TextArea';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import { ITemplate } from '../../services/template.service';

interface IFinalMessage {
  onFocusInput: TSetLastFocusedInput;
  template: ITemplate;
  setChangesNotSaved: () => void;
}

export function FinalMessage({ onFocusInput, template, setChangesNotSaved }: IFinalMessage) {
  const [finalMessage, setFinalMessage] = useState(template.finalMessage);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // update visual text in textarea
    setFinalMessage(value);
    setChangesNotSaved();
    // set text value in startMessage
    template.finalMessage = value;
  };

  return <TextArea onFocusInput={onFocusInput} onChange={handleChangeMessage} value={finalMessage} />;
}
