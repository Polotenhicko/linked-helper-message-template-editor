import { TextArea } from '../../controls/TextArea';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './FinalMessage.module.css';

interface IFinalMessage {
  onFocusInput: TSetLastFocusedInput;
}

export function FinalMessage({ onFocusInput }: IFinalMessage) {
  return <TextArea onFocusInput={onFocusInput} className={styles.finalMessage} />;
}
