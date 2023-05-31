import React, { useRef, useEffect, useState } from "react";

export const Visualization = ({ developers }) => {
  const canvas = useRef();

  useEffect(() => {
    const ctx = canvas.current.getContext("2d");
    draw(ctx, developers);
    window.addEventListener("resize", () => draw(ctx, developers));
  });

  return (
    <div
      style={{
        display: "block",
        width: "100%",
        flex: "1 1 auto"
      }}
    >
      <canvas style={{ width: "100%", height: "100%" }} ref={canvas}></canvas>
    </div>
  );
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const draw = (ctx, developers) => {
  const { clientWidth: width, clientHeight: height } = ctx.canvas;
  resize(ctx);

  ctx.clearRect(0, 0, width, height);

  ctx.font = "32px Roboto";
  ctx.textAlign = "center";
  Object.keys(developers).forEach(index => {
    const { [index]: developer } = developers;
    const count = Object.keys(developers).length;
    const [x, y] = position(index, count, width, height);

    const [nx, ny] = position(index, count, width, height, 20);

    const radians = angle(index, count);

    ctx.save();
    ctx.translate(nx, ny);
    ctx.rotate(radians + Math.PI / 2);
    ctx.fillText(developer.name, 0, 0);
    ctx.restore();

    developer.pairedWith.forEach(pair => {
      const [px, py] = position(pair, count, width, height);
      const direction = [x - px, y - py];

      const unitVec = normalize(...direction);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(width / 2, height / 2, width / 2, height / 2, px, py);
      ctx.stroke();
    });
  });
};

/**
 * @param {CanvasRenderingContext2D} ctx
 */
const resize = ctx => {
  const { clientWidth: width, clientHeight: height } = ctx.canvas;
  const { canvas } = ctx;

  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
};

const angle = (index, count) =>
  (index * Math.PI * 2) / count + (-90 * Math.PI) / 180;

const position = (index, count, width, height, offset = 0) => {
  const radius = Math.min(width, height) / 3 + offset;
  const radians = angle(index, count);
  return [
    width / 2 + Math.cos(radians) * radius,
    height / 2 + Math.sin(radians) * radius
  ];
};

const magnitude = (x, y) => Math.sqrt(x * x + y * y);

const normalize = (x, y) => {
  const distance = magnitude(x, y);
  return distance === 0 ? [0, 0] : [x / distance, y / distance];
};
