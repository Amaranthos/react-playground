import React, { useContext, useEffect, useState } from "react";

export const App = () => (
  <SharedCountProvider>
    <ClickCounter />
  </SharedCountProvider>
);

const ClickCounter = () => {
  const { count, incA, incB } = useSharedCount();

  return (
    <section>
      <Row>
        <p>Count A: {count.a}</p>
        &nbsp;
        <PrettyButton onClick={incA}>A +1</PrettyButton>
      </Row>
      <Row>
        <p>Count B: {count.b}</p>
        &nbsp;
        <PrettyButton onClick={incB}>B +1</PrettyButton>
      </Row>
      <Row>
        <AltClick />
      </Row>
    </section>
  );
};

const AltClick = () => {
  const { count, incB } = useSharedCount();

  return (
    <div>
      <PrettyButton onClick={incB}>B + 1</PrettyButton>
      <p>Count B 2: {count.b}</p>
    </div>
  );
};

const Row = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center" }}>{children}</div>
);

const PrettyButton = ({ onClick, children }) => (
  <button
    style={{
      borderRadius: 4,
      border: 0,
      backgroundColor: "pink",
      padding: "5px 10px",
      cursor: "pointer",
    }}
    onClick={onClick}
  >
    {children}
  </button>
);

const SharedCountContext = React.createContext();

const SharedCountProvider = ({ children }) => {
  const [state, setState] = useState({ a: 0, b: 0 });

  const [contextValue, setContextValue] = useState({
    state,
    setSharedCount: (key, val) => {
      setState((state) => ({ ...state, [key]: val }));
    },
  });

  useEffect(() => {
    setContextValue((currentValue) => ({
      ...currentValue,
      state,
    }));
  }, [state]);

  return (
    <SharedCountContext.Provider value={contextValue}>
      {children}
    </SharedCountContext.Provider>
  );
};

const useSharedCount = () => {
  const { state, setSharedCount } = useContext(SharedCountContext);

  const incA = () => setSharedCount("a", state.a + 1);
  const incB = () => setSharedCount("b", state.b + 1);

  return { count: state, incA, incB };
};
