import React from "react";

export default () => (
  <Toggle onToggle={on => console.log(on)}>
    <Toggle.On>The button is on</Toggle.On>
    <Toggle.Off>The button is off</Toggle.Off>
    <Toggle.Button />
  </Toggle>
);

const ToggleContext = React.createContext();

const useEffectAfterMount = (cb, dependencies) => {
  const justMounted = React.useRef(true);
  React.useEffect(() => {
    if (!justMounted.current) {
      return cb();
    }
    justMounted.current = false;
  }, dependencies);
};

const Toggle = ({ onToggle, children }) => {
  const [on, setOn] = React.useState(false);
  const toggle = React.useCallback(() => setOn(oldOn => !oldOn), []);
  useEffectAfterMount(() => {
    onToggle(on);
  }, [on]);
  const value = React.useMemo(() => ({ on, toggle }), [on]);

  return (
    <ToggleContext.Provider value={value}>{children}</ToggleContext.Provider>
  );
};

const useToggleContext = () => {
  const context = React.useContext(ToggleContext);
  if (!context) {
    throw new Error(
      "Toggle compound components cannot be rendered outside the Toggle component"
    );
  }
  return context;
};

const On = ({ children }) => {
  const { on } = useToggleContext();
  return on ? children : null;
};

const Off = ({ children }) => {
  const { on } = useToggleContext();
  return on ? null : children;
};

const Button = props => {
  const { on, toggle } = useToggleContext();
  return <input type="checkbox" onClick={toggle} {...props} />;
};

Toggle.On = On;
Toggle.Off = Off;
Toggle.Button = Button;
