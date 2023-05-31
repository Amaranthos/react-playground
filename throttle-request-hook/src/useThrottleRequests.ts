import { stat } from "fs";
import { useMemo, useReducer } from "react";
import { act } from "react-dom/test-utils";
import { AsyncState } from "react-use/lib/useAsync";

export type RequestToMake = () => Promise<void>;

async function throttleRequests(requests: RequestToMake[], maxParallel = 6) {
  const queue: Promise<void>[] = [];

  for (const request of requests) {
    const promise = request().then((res) => {
      queue.splice(queue.indexOf(promise), 1);
      return res;
    });
    queue.push(promise);
    if (queue.length >= maxParallel) {
      await Promise.race(queue);
    }
  }

  await Promise.all(queue);
}

export type ThrottledProgress<T> = {
  totalCount: number;
  errors: Error[];
  values: T[];
  percentComplete: number;
  loading: boolean;
};

function createThrottledProgress<T>(totalCount: number): ThrottledProgress<T> {
  return {
    totalCount,
    percentComplete: 0,
    loading: false,
    errors: [],
    values: [],
  };
}

function updateThrottledProgress<T>(
  current: ThrottledProgress<T>,
  next: AsyncState<T>
): ThrottledProgress<T> {
  const errors = next.error ? [...current.errors, next.error] : current.errors;

  const values = next.value ? [...current.values, next.value] : current.values;

  const percentComplete =
    current.totalCount === 0
      ? 0
      : Math.round(
          ((errors.length + values.length) / current.totalCount) * 100
        );

  const loading =
    current.totalCount === 0
      ? false
      : errors.length + values.length < current.totalCount;

  return {
    totalCount: current.totalCount,
    loading,
    percentComplete,
    errors,
    values,
  };
}

type ThrottleActions<T> =
  | {
      type: "initialise";
      totalCount: number;
    }
  | {
      type: "resolved";
      value: T;
    }
  | {
      type: "rejected";
      error: Error;
    };

export function useThrottleRequests<T>() {
  function reducer(
    state: ThrottledProgress<T>,
    action: ThrottleActions<T>
  ): ThrottledProgress<T> {
    switch (action.type) {
      case "initialise":
        return createThrottledProgress(action.totalCount);

      case "resolved":
        return updateThrottledProgress(state, {
          loading: false,
          value: action.value,
        });

      case "rejected":
        return updateThrottledProgress(state, {
          loading: false,
          error: action.error,
        });
    }
  }

  const [throttle, dispatch] = useReducer(
    reducer,
    createThrottledProgress<T>(0)
  );

  const updateThrottle = useMemo(() => {
    function promiseResolved(value: T) {
      return dispatch({
        type: "resolved",
        value,
      });
    }

    function promiseRejected(error: Error) {
      return dispatch({
        type: "rejected",
        error,
      });
    }

    function queuePromises(promises: RequestToMake[], maxParallel = 6) {
      dispatch({
        type: "initialise",
        totalCount: promises.length,
      });
      return throttleRequests(promises, maxParallel);
    }

    return {
      queuePromises,
      promiseResolved,
      promiseRejected,
    };
  }, [dispatch]);

  return {
    throttle,
    updateThrottle,
  };
}
