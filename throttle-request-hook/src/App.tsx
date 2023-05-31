import React, { useCallback, useMemo, useState } from "react";
import { useAsync } from "react-use";
import "./App.css";
import { useThrottleRequests } from "./useThrottleRequests";

type GithubUser = { name: string; blog?: string };

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function useContributors(contributorsUrlToLoad: string) {
  const { throttle, updateThrottle } = useThrottleRequests<GithubUser>();
  const [progress, setProgress] = useState("");

  useAsync(async () => {
    if (!contributorsUrlToLoad) return;

    setProgress("loading contributors");

    const contributorsResponse = await fetch(contributorsUrlToLoad);
    const contributors: { url: string }[] = await contributorsResponse.json();

    setProgress(`loading ${contributors.length} contributors...`);

    const promises = contributors.map(({ url }, index) => async () => {
      try {
        setProgress(`loading ${index} / ${contributors.length}: ${url}...`);

        const response = await fetch(url);
        const json: GithubUser = await response.json();

        await timeout(1000);

        updateThrottle.promiseResolved(json);
      } catch (error) {
        console.error(`failed to load ${url}`, error);
      }
    });

    await updateThrottle.queuePromises(promises);

    setProgress("");
  }, [contributorsUrlToLoad, updateThrottle, setProgress]);

  return { progress, throttle };
}

function App() {
  const [owner, setOwner] = useState("DefinitelyTyped");
  const [repo, setRepo] = useState("DefinitelyTyped");

  const onOwnerChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setOwner(event.target.value),
    [setOwner]
  );
  const onRepoChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setRepo(event.target.value),
    [setRepo]
  );

  const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;

  const [contributorsUrlToLoad, setUrlToLoad] = useState("");
  const { progress, throttle } = useContributors(contributorsUrlToLoad);

  const bloggers = useMemo(
    () => throttle.values.filter((contributor) => contributor.blog),
    [throttle]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blogging devs</h1>

        <p>
          Show me the{" "}
          <a
            className="App-link"
            href={contributorsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            contributors for {owner}/{repo}
          </a>{" "}
          who have blogs.
        </p>
        <div className="App-labelinput">
          <label htmlFor="owner">Github Owner</label>
          <input
            id="owner"
            type="text"
            value={owner}
            onChange={onOwnerChange}
          />
          <label htmlFor="repo">Github Repo</label>
          <input id="repo" type="text" value={repo} onChange={onRepoChange} />
        </div>

        <button
          className="App-button"
          onClick={(e) => setUrlToLoad(contributorsUrl)}
        >
          Load bloggers from Github
        </button>

        {progress && <div className="App-progress">{progress}</div>}

        {throttle.percentComplete > 0 && (
          <>
            <h3>Behold {bloggers.length} bloggers:</h3>
            <div className="App-results">
              {bloggers.map((blogger) => (
                <div key={blogger.name}>
                  <div>{blogger.name}</div>
                  <a
                    className="App-link"
                    href={blogger.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {blogger.blog}
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {throttle.errors.length > 0 && (
          <div className="App-results">
            {throttle.errors.length} requests errored
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
