import React from "react";
import { useAsync } from "./useAsync";

export default () => (
  <>
    <h1>Welcome to React Parcel Micro App!</h1>
    <p>Hard to get more minimal than this React app.</p>
    <Dog />
  </>
);

const dogFetcher = () =>
  new Promise((resolve, reject) => {
    fetch(`https://dog.ceo/api/breeds/image/random`)
      .then((json) => (json.ok ? json.json() : new Error("")))
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });

const Dog = () => {
  const [fetchDog, { status, error, response }] = useAsync(dogFetcher, true);

  return (
    <div>
      {status === "rejected" && (
        <span style={{ color: "red" }}>{error.message}</span>
      )}
      <button style={{ padding: "1em" }} onClick={fetchDog}>
        {status === "loading" ? "Fetching..." : "Fetch dog!"}
      </button>
      <figure className="dog" onDoubleClick={fetchDog}>
        {response && <img src={response.message} alt="doggo" />}
      </figure>
    </div>
  );
};
