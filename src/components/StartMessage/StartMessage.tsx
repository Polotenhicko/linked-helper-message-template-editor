import { TextArea } from '../../controls/TextArea';
import { TSetLastFocusedInput } from '../MessageEditor/MessageEditor';
import styles from './StartMessage.module.css';

interface IStartMessage {
  onFocusInput: TSetLastFocusedInput;
}

export function StartMessage({ onFocusInput }: IStartMessage) {
  return <TextArea onFocusInput={onFocusInput} className={styles.startMessage} />;
}
