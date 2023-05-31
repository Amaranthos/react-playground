import React from "react";

// import "./index.css";

export const Button = () => {
  const ref = React.useRef();

  function onClick() {
    ref.current.classList.toggle("animate");
  }

  function onAnimationStart() {
    console.log("started");
  }

  function onAnimationEnd(event) {
    console.log("ended", event);
  }

  return (
    <button
      className="button"
      ref={ref}
      onClick={onClick}
      onTransitionEnd={onAnimationEnd}
      // onAnimationEnd={onAnimationEnd}
    >
      Test
    </button>
  );
};
