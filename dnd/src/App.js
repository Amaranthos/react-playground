import React from "react";

import { fire } from "./firebase";

export default () => {
  const [spells, setSpells] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      const db = fire.firestore();
      const data = await db
        .collection("spells")
        .onSnapshot(data =>
          setSpells(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
        );
    })();
  }, []);

  return (
    <ul>
      {spells.map(spell => (
        <li key={spell.name}>
          <SpellInput spell={spell} />
        </li>
      ))}
    </ul>
  );
};

const SpellInput = ({ spell }) => {
  const [name, setName] = React.useState(spell.name);
  const updateSpellName = () => {
    const db = fire.firestore();
    db.collection("spells")
      .doc(spell.id)
      .set({ ...spell, name });
  };
  const deleteSpell = () => {
    const db = fire.firestore();
    db.collection("spells")
      .doc(spell.id)
      .delete();
  };
  return (
    <>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={updateSpellName}>Update</button>
      <button onClick={deleteSpell}>Delete</button>
    </>
  );
};
