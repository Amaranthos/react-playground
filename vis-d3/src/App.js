import { Chart } from "./Chart";

// const temperatures = [8, 5, 13, 9, 12];

function App() {
  // const divRef = useRef();

  // useEffect(() => {
  //   d3.select(divRef.current)
  //     .selectAll("h2")
  //     .data(temperatures)
  //     .enter()
  //     .append("h2")
  //     .text((dp) => dp + " deg")
  //     .style((dp) => `background-color: ${dp > 10 ? "red" : "blue"}`);
  // }, []);

  // return <div ref={divRef} className="App"></div>;
  return <Chart />;
}

export default App;
