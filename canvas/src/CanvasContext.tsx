import React, { useCallback, useContext, useRef, useState } from "react";

export type CanvasState = {
  offset: Point;
  sacle: number;
};

export const CanvasContext = React.createContext<CanvasState>({} as any);

export const Canvas = () => {
  const { state } = useContext(CanvasContext);
  return <div>The desired user zoom level is {state.scale}</div>;
};

type Point = { x: number; y: number };
const ORIGIN: Point = Object.freeze({ x: 0, y: 0 });

export function usePan(): [Point, (e: React.MouseEvent) => void] {
  const [panState, setPanState] = useState<Point>(ORIGIN);

  const lastPointRef = useRef(ORIGIN);

  const pan = useCallback((e: MouseEvent) => {
    const lastPoint = lastPointRef.current;
    const point: Point = { x: e.pageX, y: e.pageY };
    lastPointRef.current = point;

    setPanState((panState) => ({
      x: panState.x + lastPoint.x - point.x,
      y: panState.y + lastPoint.y - point.y,
    }));
  }, []);

  const endPan = useCallback(() => {
    document.removeEventListener("mousemove", pan);
    document.removeEventListener("mouseup", endPan);
  }, [pan]);

  const startPan = useCallback(
    (e: React.MouseEvent) => {
      document.addEventListener("mousemove", pan);
      document.addEventListener("mouseup", endPan);
      lastPointRef.current = { x: e.pageX, y: e.pageY };
    },
    [pan, endPan]
  );

  return [panState, startPan];
}

export const UsePanExample = () => {
  const [offset, startPan] = usePan();

  return (
    <div onMouseDown={startPan}>
      <span>{JSON.stringify(offset)}</span>
    </div>
  );
};
