import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './TextArea.module.css';
import { TSetLastFocusedInput } from '../../components/MessageEditor/MessageEditor';

interface ITextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  autoResize?: boolean;
  onFocusInput?: TSetLastFocusedInput;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  textAreaRef?: React.RefObject<HTMLTextAreaElement>;
}

export function TextArea({
  className,
  onFocusInput,
  textAreaRef,
  autoResize = true,
  onChange,
  ...other
}: ITextAreaProps) {
  const classNames = cn(styles.textarea, className);
  const [minHeight, setMinHeight] = useState<null | number>(null);

  let ref = useRef<HTMLTextAreaElement>(null);
  if (textAreaRef) ref = textAreaRef;

  useLayoutEffect(() => {
    if (!autoResize) return;
    if (!ref || !ref.current) return;
    if (!(ref.current instanceof HTMLTextAreaElement)) return;

    const textAreaEl = ref.current;
    const { offsetHeight, clientHeight } = textAreaEl;

    // set height 0, for after set scrollHeight

    textAreaEl.style.height = '0';

    if (!minHeight) {
      // Первый ввод текста, сохраняем минимальную высоту, чтобы textarea не прыгала
      const currentHeight = offsetHeight;
      textAreaEl.style.height = currentHeight + 5 + 'px';
      setMinHeight(currentHeight);
    } else {
      // leftHeight необходим, т.к. scrollHeight с минимальной высотой == clientHeight
      const leftHeight = offsetHeight - clientHeight;
      const currentHeight = textAreaEl.scrollHeight - leftHeight;
      textAreaEl.style.height = (currentHeight < minHeight ? minHeight : currentHeight) + 5 + 'px';
    }
  });

  const handleKeyDownRepeat = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (e.repeat && !allowedKeys.includes(e.key)) e.preventDefault();
  };

  const handleOnFocus = () => {
    if (!onFocusInput) return;
    if (!ref || !ref.current) return;

    onFocusInput(ref.current);
  };

  return (
    <textarea
      className={classNames}
      onChange={onChange}
      onKeyDown={handleKeyDownRepeat}
      ref={ref}
      onFocus={handleOnFocus}
      {...other}
    ></textarea>
  );
}
