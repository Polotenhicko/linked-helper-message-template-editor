import { useCallback, useEffect, useState } from 'react';
import { ISubject } from '../services/observer.service';

export function useObserverService(service: ISubject) {
  const [, forceUpdate] = useState<object>({});
  const refresh = useCallback(() => forceUpdate({}), []);

  useEffect(() => {
    service.subscribe(refresh);

    return () => {
      service.unsubscribe(refresh);
    };
  }, [refresh]);
}
