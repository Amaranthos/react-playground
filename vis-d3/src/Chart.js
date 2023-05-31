import { useCallback, useEffect, useRef } from "react";
import * as d3 from "d3";

export function Chart() {
  const ref = useRef();

  const drawChart = useCallback((data) => {
    const height = 400;
    const width = 600;
    const scale = 20;

    const canvas = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("border", "1px solid black");

    canvas
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("width", 40)
      .attr("height", (dp) => dp * scale)
      .attr("fill", "orange")
      .attr("x", (dp, itr) => itr * 45)
      .attr("y", (dp) => height - dp * scale);

    canvas
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (dp, i) => i * 45 + 10)
      .attr("y", (dp, i) => height - dp * scale - 10)
      .text((dp) => dp);
  }, []);

  useEffect(() => {
    const data = [2, 4, 2, 6, 8];
    drawChart(data);
  }, [drawChart]);

  return <div ref={ref}></div>;
}
