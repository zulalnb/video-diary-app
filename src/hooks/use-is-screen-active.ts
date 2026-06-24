import { useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';

export function useIsScreenActiveRef() {
  const isScreenActiveRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      isScreenActiveRef.current = true;

      return () => {
        isScreenActiveRef.current = false;
      };
    }, [])
  );

  return isScreenActiveRef;
}
