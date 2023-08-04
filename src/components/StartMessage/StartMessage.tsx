import { useState } from 'react';
import { TextArea } from '../../controls/TextArea';
// import { ITemplate } from '../../services/template.service';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';

interface IStartMessageProps {
  // template: ITemplate;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  onFocusInput: TSetLastFocusedInput;
}

export function StartMessage({ textAreaRef, onFocusInput }: IStartMessageProps) {
  // const [value, setValue] = useState(template.startMessage);

  // const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   setValue(inputValue);
  //   // template.startMessage = inputValue;
  // };

  return (
    // <TextArea value={value} onChange={handleChangeValue} onFocusInput={onFocusInput} textAreaRef={textAreaRef} />
    <TextArea />
  );
}
