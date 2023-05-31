import React, { useState } from "react";
import { Accordion } from "./Accordion";

export default () => {
  const [activeEventKey, setActiveEventKey] = useState(0);
  return (
    <>
      <h1>Welcome to React Parcel Micro App!</h1>
      <Accordion activeEventKey={activeEventKey} onToggle={setActiveEventKey}>
        <Accordion.Toggle>Click</Accordion.Toggle>
        <Accordion.Collapse>
          <article>
            <p>
              Aliqua consectetur laborum dolor velit mollit sint ipsum non sit.
              Non sit sunt sunt velit Lorem do id do consequat et. Enim culpa
              commodo incididunt culpa enim. Labore magna sunt velit adipisicing
              id id voluptate culpa et dolore qui. Ullamco sit ipsum adipisicing
              elit. Magna officia aute occaecat qui in do. Nisi do aliqua tempor
              officia officia elit eiusmod non. Officia pariatur labore
              excepteur adipisicing duis exercitation officia non. Minim
              voluptate sunt ad est consequat laboris cupidatat adipisicing
              tempor enim. Laboris do do cupidatat nulla elit anim excepteur
              reprehenderit consequat ullamco ea irure est eu.
            </p>
          </article>
        </Accordion.Collapse>
      </Accordion>
    </>
  );
};
