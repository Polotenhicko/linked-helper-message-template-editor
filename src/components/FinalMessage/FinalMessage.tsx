import { useLayoutEffect, useState } from 'react';
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

  useLayoutEffect(() => {
    // set final value from template when appears and disappears conditional blocks in operator
    // cause after adding or removing, may be that startMessage will be cut out for finalMessage
    setFinalMessage(template.finalMessage);
  }, [!!template.conditionalBlocks.length]);

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // update visual text in textarea
    setFinalMessage(value);
    setChangesNotSaved();
    // set text value in startMessage
    template.finalMessage = value;
  };

  if (!template.conditionalBlocks.length) return null;

  return <TextArea onFocusInput={onFocusInput} onChange={handleChangeMessage} value={finalMessage} />;
}
