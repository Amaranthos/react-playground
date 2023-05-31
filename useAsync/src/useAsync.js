import { useCallback, useEffect, useReducer } from "react";

export const useAsync = (callback, immediate = false) => {
  const [{ status, error, response }, dispatch] = useReducer(asyncReducer, {
    status: "idle",
    error: null,
    response: null,
  });

  const execute = useCallback(() => {
    dispatch({ type: "started" });

    return callback()
      .then((response) => {
        dispatch({ type: "success", response });
      })
      .catch((error) => {
        dispatch({ type: "error", error });
      });
  }, [callback]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return [execute, { status, response, error }];
};

const asyncReducer = (state, { type, response, error }) => {
  switch (type) {
    case "error":
      return { ...state, status: "rejected", error };

    case "success":
      return { ...state, status: "resolved", response };

    case "started":
      return { ...state, status: "pending", error: null };

    default:
      return state;
  }
};
