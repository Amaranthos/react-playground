import React, { useContext, useMemo } from "react";

const Accordion = ({
  element: Component,
  activeEventKey,
  onToggle,
  children,
  ...otherProps
}) => {
  const context = useMemo(
    () => ({
      activeEventKey,
      onToggle
    }),
    [activeEventKey, onToggle]
  );
  return (
    <Accordion.Context.Provider value={context}>
      <Component {...otherProps}>{children}</Component>
    </Accordion.Context.Provider>
  );
};

Accordion.defaultProps = {
  element: "div"
};

const Toggle = ({
  element: Component,
  eventKey,
  onClick,
  children,
  ...otherProps
}) => {
  const accordionClick = onAccordionClick(eventKey, onClick);
  return (
    <Component onClick={accordionClick} {...otherProps}>
      {children}
    </Component>
  );
};

Toggle.defaultProps = {
  element: "div"
};

const Collapse = ({
  element: Component,
  eventKey,
  children,
  ...otherProps
}) => {
  const { activeEventKey } = useAccordionContext();
  return (
    <>
      {activeEventKey === eventKey && (
        <Component {...otherProps}>{children}</Component>
      )}
    </>
  );
};

Collapse.defaultProps = {
  element: "div"
};

Accordion.Toggle = Toggle;
Accordion.Collapse = Collapse;

Accordion.Context = React.createContext(null);

const useAccordionContext = () => {
  const context = useContext(Accordion.Context);
  if (!context) {
    throw new Error(
      "Accordion compound components must be nested with Accordion"
    );
  }
  return context;
};

const onAccordionClick = (eventKey, onClick) => {
  const { onToggle, activeEventKey } = useAccordionContext();

  return event => {
    onToggle(eventKey === activeEventKey ? null : eventKey);
    if (onClick) {
      onClick(event);
    }
  };
};

export { Accordion, useAccordionContext };
