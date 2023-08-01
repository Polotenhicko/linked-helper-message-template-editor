import { useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextArea.module.css';

interface ITextAreaProps {
  className?: string;
}

export function TextArea({ className }: ITextAreaProps) {
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

  return (
    <textarea className={classNames} onInput={autoResize} ref={textAreaRef}></textarea>
  );
}
