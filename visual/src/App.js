import React, { useState } from "react";

export default () => {
  const { count, increment } = useCounter();
  return (
    <>
      <h3>App</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <ComponentA />
    </>
  );
};

const ComponentA = () => {
  const { count, increment } = useCounter();
  return (
    <div>
      <h3>Component A</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <ComponentB />
    </div>
  );
};

const ComponentB = () => {
  const { count, increment } = useCounter();
  return (
    <div>
      <h3>Component B</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <ComponentC />
    </div>
  );
};

const ComponentC = React.memo(() => {
  const { count, increment } = useCounter();
  return (
    <div>
      <h3>Component C</h3>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
});

const Counter = () => {
  const { count, increment } = useCounter();

  return (
    <>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </>
  );
};

const useCounter = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  return { count, increment };
};
