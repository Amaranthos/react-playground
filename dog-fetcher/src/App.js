import React, { useEffect, useReducer } from "react";

export default () => (
  <>
    <DogFetcher />
  </>
);

const initialState = { status: "idle", dog: null, error: null };

const DogFetcher = () => {
  const [state, dispatch] = useReducer(dogReducer, initialState);
  const { error, dog, status } = state;

  useEffect(() => {
    if (state.status === "loading") {
      let canceled = false;

      fetch(`https://dog.ceo/api/breeds/image/random`)
        .then(data => data.json())
        .then(data => {
          if (canceled) return;
          dispatch({ type: "RESOLVE", data });
        })
        .catch(error => {
          if (canceled) return;
          dispatch({ type: "REJECT", error });
        });
      return () => {
        canceled = true;
      };
    }
  }, [state.status]);

  return (
    <div>
      {error && <span style={{ color: "red" }}>{error}</span>}
      <button
        style={{ padding: "1em" }}
        onClick={() => dispatch({ type: "FETCH" })}
      >
        {status === "loading" ? "Fetching..." : "Fetch dog!"}
      </button>
      <figure className="dog" onDoubleClick={() => dispatch({ type: "FETCH" })}>
        {dog && <img src={dog} alt="doggo" />}
      </figure>
    </div>
  );
};

const dogReducer = (state = initialState, { type, data, error }) =>
  switchcase({
    FETCH: { ...state, status: "loading", error: null },
    RESOLVE: { ...state, status: "success", dog: data && data.message },
    REJECT: { ...state, status: "failure", error },
    CANCEL: { ...state, status: "idle" }
  })(state)(type);

const switchcase = cases => defaultCase => key =>
  (f => (f instanceof Function ? f() : f))(
    (cases => defaultCase => key =>
      cases.hasOwnProperty(key) ? cases[key] : defaultCase)(cases)(defaultCase)(
      key
    )
  );
