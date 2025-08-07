export function shareObservable(observable: any) {
  let observers = [] as any[];

  let subscription : any;

  return new (window as any).Observable((observer: any) => {
    if (!subscription) {
      subscription = observable.subscribe({
        complete() {
          observers.forEach(observer => observer.complete());
        },
        error(err : any ) {
          observers.forEach(observer => observer.error(err));
        },
        next(value : any) {
          observers.forEach(observer => observer.next(value));
        }
      });
    }
    observers.push(observer);

    return () => {
      observers = observers.filter(o => o !== observer);
      if (!observers.length) {
        subscription.unsubscribe();
        subscription = null;
      }
    };
  });
}