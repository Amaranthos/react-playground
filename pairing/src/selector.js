import React from "react";

export const Selector = ({ developers }) => (
  <select>
    {developers &&
      developers.map(developer => (
        <option key={developer.index} value={developer.index}>
          {developer.name}
        </option>
      ))}
  </select>
);
