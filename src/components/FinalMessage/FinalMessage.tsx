import { useState } from 'react';
import { TextArea } from '../../controls/TextArea';
// import { ITemplate } from '../../services/template.service';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';

interface IFinalMessageProps {
  // template: ITemplate;
  onFocusInput: TSetLastFocusedInput;
}

export function FinalMessage({ onFocusInput }: IFinalMessageProps) {
  // const [value, setValue] = useState(template.finalMessage);
  // const handleChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   setValue(inputValue);
  //   template.finalMessage = inputValue;
  // };

  // return <TextArea value={value} onChange={handleChangeValue} onFocusInput={onFocusInput} />;
  return <TextArea />;
}
