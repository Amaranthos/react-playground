import React from "react";
import "./App.css";

export function App() {
  return (
    <ToggleProvider>
      <div className="App">
        <Toggle />
      </div>
    </ToggleProvider>
  );
}

function toggleReducer(state = { toggled: false }, { type }) {
  switch (type) {
    case "ON":
      return { ...state, toggled: true };
    case "OFF":
      return { ...state, toggled: false };
    default:
      return state;
  }
}

const ToggleContext = React.createContext({ toggled: false });

function ToggleProvider({ children }) {
  const [store, dispatch] = React.useReducer(toggleReducer, {
    toggled: false,
  });

  return (
    <ToggleContext.Provider value={{ store, dispatch }}>
      {children}
    </ToggleContext.Provider>
  );
}

function useToggle() {
  const context = React.useContext(ToggleContext);

  if (!context) throw new Error("Must be wrapped in ToggleProvider");

  const { store, dispatch } = context;
  const { toggled } = store;

  const toggleOn = () => {
    dispatch({ type: "ON" });
  };

  const toggleOff = () => {
    dispatch({ type: "OFF" });
  };

  return {
    toggled,
    toggleOn,
    toggleOff,
  };
}

function Toggle(props) {
  const { toggled, toggleOn, toggleOff } = useToggle();

  return (
    <div style={{ padding: "10px" }}>
      <button
        onClick={toggleOn}
        style={{ background: `${toggled ? "blue" : "red"}` }}
      >
        on
      </button>
      <button
        onClick={toggleOff}
        style={{ background: `${toggled ? "blue" : "red"}` }}
      >
        off
      </button>
    </div>
  );
}
