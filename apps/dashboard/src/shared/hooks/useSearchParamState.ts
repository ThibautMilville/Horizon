import {useCallback} from "react";
import {useSearchParams} from "react-router-dom";

export function useSearchParamState<Value extends string>(
  key: string,
  allowedValues: readonly Value[],
  defaultValue: Value,
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawValue = searchParams.get(key);
  const value = allowedValues.includes(rawValue as Value) ? (rawValue as Value) : defaultValue;

  const setValue = useCallback(
    (nextValue: string) => {
      const validValue = allowedValues.includes(nextValue as Value)
        ? (nextValue as Value)
        : defaultValue;
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (validValue === defaultValue) {
            next.delete(key);
          } else {
            next.set(key, validValue);
          }
          return next;
        },
        {replace: true},
      );
    },
    [allowedValues, defaultValue, key, setSearchParams],
  );

  return [value, setValue] as const;
}
