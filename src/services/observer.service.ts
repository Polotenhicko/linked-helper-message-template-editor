export type TObserver = () => void;

export interface ISubject {
  // Присоединяет наблюдателя к издателю.
  subscribe(observer: TObserver): void;

  // Отсоединяет наблюдателя от издателя.
  unsubscribe(observer: TObserver): void;

  // Уведомляет всех наблюдателей о событии.
  notify(): void;
}

export class ObserverService implements ISubject {
  public subscribe(observer: TObserver): void {
    const hasObserver = this.observers.includes(observer);

    if (!hasObserver) {
      this.observers.push(observer);
    }
  }

  public unsubscribe(observer: TObserver): void {
    const indexObserver = this.observers.findIndex((obs) => observer === obs);

    if (~indexObserver) {
      this.observers.splice(indexObserver, 1);
    }
  }

  public notify(): void {
    this.observers.forEach((observer) => observer());
  }

  private observers: TObserver[] = [];
}
