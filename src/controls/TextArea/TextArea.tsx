import { useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextArea.module.css';
import { TSetLastFocusedInput } from '../../components/MessageEditor/MessageEditor';

interface ITextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  onFocusInput?: TSetLastFocusedInput;
}

export function TextArea({ className, onFocusInput }: ITextAreaProps) {
  const classNames = cn(styles.textarea, className ? className : '');
  const [minHeight, setMinHeight] = useState(0);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    if (!textAreaRef.current) return;
    if (!(textAreaRef.current instanceof HTMLTextAreaElement)) return;

    const textAreaEl = textAreaRef.current;
    const { offsetHeight, clientHeight } = textAreaEl;
    // ставим высоту 0, чтобы потом засетить scrollHeight
    textAreaEl.style.height = '0';

    if (!minHeight) {
      // Первый ввод текста, сохраняем минимальную высоту, чтобы textarea не прыгала
      const currentHeight = offsetHeight;
      textAreaEl.style.height = currentHeight + 'px';
      setMinHeight(currentHeight);
    } else {
      // leftHeight необходим, т.к. scrollHeight с минимальной высотой == clientHeight
      const leftHeight = offsetHeight - clientHeight;
      const currentHeight = textAreaEl.scrollHeight - leftHeight;
      textAreaEl.style.height =
        (currentHeight < minHeight ? minHeight : currentHeight) + 'px';
    }
  };

  const handleOnFocus = () => {
    if (!onFocusInput) return;
    if (!textAreaRef.current) return;

    onFocusInput(textAreaRef.current);
  };

  return (
    <textarea
      className={classNames}
      onInput={autoResize}
      ref={textAreaRef}
      onFocus={handleOnFocus}
    ></textarea>
  );
}
