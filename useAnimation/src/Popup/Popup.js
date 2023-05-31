import React, { useEffect, useState } from "react";
// import "./styles.css";

export const Popup = ({ heading, body, timeout = 1000, onClose }) => {
  const [transitionOut, setTransitionOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitionOut(true);
    }, timeout);
    return () => clearTimeout(timer);
  }, []);

  function onAnimEnd() {
    onClose();
  }

  return (
    <div
      role="alert"
      aria-label={heading}
      onClick={onClose}
      style={
        transitionOut
          ? {
              opacity: 0,
              transition: "opacity 0.8s",
            }
          : {}
      }
      className={transitionOut ? "fadeOut" : undefined}
      onTransitionEnd={onAnimEnd}
    >
      <div>
        <div aria-hidden={true}>
          <img />
        </div>
        <div>
          <h2 data-testid="notification-title">{heading}</h2>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
};
