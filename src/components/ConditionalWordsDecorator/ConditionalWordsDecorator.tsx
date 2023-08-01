import styles from './ConditionalWordsDecorator.module.css';

interface IConditionalWordsDecoratorProps {
  children: React.ReactNode;
}

export function ConditionalWordsDecorator({ children }: IConditionalWordsDecoratorProps) {
  return <span className={styles.conditionalStroke}>{children}</span>;
}
