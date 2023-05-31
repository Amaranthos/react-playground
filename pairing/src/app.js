import React, { useRef, useEffect, useState, useReducer } from "react";
import { switchcase } from "./switchcase";
import { Visualization } from "./visualization";
import { Selector } from "./selector";

const developerReducer = (state, { type, payload }) =>
  switchcase({
    add_dev: {
      ...state,
      [Object.keys(state).length]: { name: payload, pairedWith: [] }
    },
    remove_dev: state,
    add_pair: () => ({
      ...state,
      [payload[0]]: {
        ...state[payload[0]],
        pairedWith: [...state[payload[0]].pairedWith, payload[1]]
      }
    }),
    clear_paring: state
  })(state)(type);

const initialState =
  process.env.NODE_ENV === "developement"
    ? {
        0: { name: "Joshua", pairedWith: [1, 1, 1, 1] },
        1: { name: "Paul", pairedWith: [2] },
        2: { name: "Jason", pairedWith: [] }
      }
    : {};

export default () => {
  const [developers, dispatch] = useReducer(developerReducer, initialState);
  const [developerName, setDeveloperName] = useState("");
  const [pair, setPair] = useState([]);
  const [pairIndex, setPairIndex] = useState(0);

  const addDeveloper = () => {
    developerName && dispatch({ type: "add_dev", payload: developerName });
    setDeveloperName("");
  };

  const selectPair = index => {
    if (!pair.includes(index)) {
      pair[pairIndex] = index;
      setPair(pair);
      setPairIndex(1 - pairIndex);
    }
  };

  const addPairing = () => {
    if (pair.length === 2) {
      dispatch({ type: "add_pair", payload: pair });
      setPair([]);
      setPairIndex(0);
    }
  };

  return (
    <>
      <h1>Prototype pairing tracker</h1>
      <ol>
        <li>Add each team member</li>
        <li>Select 2 team members to record a pairing session</li>
      </ol>
      <form
        className="flex"
        style={{ flexDirection: "row" }}
        onSubmit={e => e.preventDefault()}
      >
        <input
          className="card"
          type="text"
          value={developerName}
          placeholder="Team member's name"
          onChange={e => setDeveloperName(e.target.value)}
        />
        <input
          className="card depth"
          type="submit"
          onClick={addDeveloper}
          value="Add team member"
        />
      </form>
      <div className="flex" style={{ flexDirection: "column" }}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {Object.entries(developers).map(([index, developer]) => (
            <DevCard
              key={index}
              index={index}
              developer={developer}
              selected={pair.includes(index)}
              selectPair={selectPair}
            />
          ))}
        </div>
        {Object.entries(developers).length >= 2 && (
          <button
            style={{ width: "12em", margin: "0 auto" }}
            className="card"
            onClick={addPairing}
          >
            Record pairing session
          </button>
        )}
      </div>
      <Visualization developers={developers} />
    </>
  );
};

const DevCard = ({ index, developer, selected, selectPair }) => (
  <div
    className={`card ${selected && "selected"}`}
    key={index}
    style={{
      flex: "1 0 auto"
    }}
    onClick={() => selectPair(index)}
  >
    {developer.name}
  </div>
);
