import {useCallback} from "react";
import {useSearchParams} from "react-router-dom";

export function useSearchParamsPatch<T extends Record<string, string>>(defaults: T) {
  const [searchParams, setSearchParams] = useSearchParams();

  const values = {...defaults};
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    values[key] = (searchParams.get(String(key)) ?? defaults[key]) as T[keyof T];
  }

  const setValues = useCallback(
    (patch: Partial<T>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const key of Object.keys(defaults) as (keyof T)[]) {
            const existing = (current.get(String(key)) ?? defaults[key]) as T[keyof T];
            const value = patch[key] === undefined ? existing : patch[key];
            if (!value) {
              next.delete(String(key));
            } else {
              next.set(String(key), value);
            }
          }
          return next;
        },
        {replace: true},
      );
    },
    [defaults, setSearchParams],
  );

  return [values, setValues] as const;
}
