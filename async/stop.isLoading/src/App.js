import React from "react";

// https://kentcdodds.com/blog/stop-using-isloading-booleans

export default () => (
  <>
    <h1>Welcome to React Parcel Micro App!</h1>
    <Position />
  </>
);

export const switchcase = cases => defaultCase => key =>
  (f => (f instanceof Function ? f() : f))(
    (cases => defaultCase => key =>
      cases.hasOwnProperty(key) ? cases[key] : defaultCase)(cases)(defaultCase)(
      key
    )
  );

const geoPositionReducer = (state, { type, error, position }) =>
  switchcase({
    error: () => ({ ...state, status: "rejected", error }),
    success: () => ({ ...state, status: "resolved", position }),
    started: () => ({ ...state, status: "pending" })
  })(new Error(`Unhandled action type: ${type}`))(type);

const useGeoPosition = () => {
  const [state, dispatch] = React.useReducer(geoPositionReducer, {
    status: "idle",
    position: null,
    error: null
  });

  React.useEffect(() => {
    if (!navigator.geolocation) {
      dispatch({
        type: "error",
        error: new Error("Geolocation is not supported")
      });
      return;
    }
    dispatch({ type: "started" });

    const geoWatch = navigator.geolocation.watchPosition(
      position => dispatch({ type: "success", position }),
      error => dispatch({ type: "error", error })
    );

    return () => navigator.geolocation.clearWatch(geoWatch);
  }, []);

  return state;
};

const Position = () => {
  const { status, position, error } = useGeoPosition();

  return (
    <div>
      {(status === "idle" || status === "pending") && <div>Loading...</div>}
      {status === "resolved" && (
        <div>
          Lat: {position.coords.latitude}, Long: {position.coords.longitude}
        </div>
      )}
      {status === "rejected" && (
        <div>
          error:
          <pre>{error.message}</pre>
        </div>
      )}
    </div>
  );
};
