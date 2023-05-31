import React from "react";
import { Popup } from "./Popup";
import { Button } from "./Button";

export default () => (
  <>
    <Popup
      heading="test"
      body="Hello, world..."
      onClose={() => alert("Closed")}
    />
    <h1>Welcome to React Parcel Micro App!</h1>
    <p>Hard to get more minimal than this React app.</p>
    <Button />
  </>
);
