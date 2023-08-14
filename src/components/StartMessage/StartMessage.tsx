import { useLayoutEffect, useState } from 'react';
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

  useLayoutEffect(() => {
    // set start value from template when appears and disappears conditional blocks in operator
    // cause after adding or removing, may be that startMessage will be cut out for finalMessage
    setStartMessage(template.startMessage);
  }, [!!template.conditionalBlocks.length]);

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
