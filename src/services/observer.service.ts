export type TObserver = () => void;

// simple observer service by observer pattern

export interface ISubject {
  // subscribe observer to subject
  subscribe(observer: TObserver): void;

  // unsubscrive observer from subject
  unsubscribe(observer: TObserver): void;

  // notify all observers about event
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
