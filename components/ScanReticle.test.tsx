import React from "react";
import { render, act } from "@testing-library/react-native";
import { View, PixelRatio } from "react-native";
import { ScanReticle } from "./ScanReticle";

const FRAME = { x: 0, y: 0, width: 411.42857, height: 796.57143 };

const flatten = (view: any) =>
  Array.isArray(view.props.style)
    ? Object.assign({}, ...view.props.style.filter(Boolean))
    : view.props.style ?? {};

function renderMeasured() {
  const tree = render(<ScanReticle />);
  act(() => {
    tree.UNSAFE_getAllByType(View)[0].props.onLayout({
      nativeEvent: { layout: FRAME },
    });
  });

  const styles = tree.UNSAFE_getAllByType(View).map(flatten);
  return {
    masks: styles.filter((s) => s.backgroundColor === "rgba(0, 0, 0, 0.55)"),
    hole: styles.find(
      (s) => s.width === s.height && s.width > 0 && !s.backgroundColor
    ),
    corners: tree
      .UNSAFE_getAllByType(View)
      .filter((v: any) => v.props.className === "border-white"),
  };
}

it("draws four masks around a single reticle hole", () => {
  const { masks, hole, corners } = renderMeasured();

  expect(masks).toHaveLength(4);
  expect(corners).toHaveLength(4);
  expect(hole).toBeDefined();
});

it("aligns every mask edge to a whole device pixel", () => {
  const ratio = PixelRatio.get();
  const isAligned = (value: number) =>
    Math.abs(value * ratio - Math.round(value * ratio)) < 1e-9;

  const { masks, hole } = renderMeasured();

  for (const mask of masks) {
    for (const edge of ["top", "left", "width", "height"] as const) {
      if (typeof mask[edge] === "number") expect(isAligned(mask[edge])).toBe(true);
    }
  }

  expect(isAligned(hole.top + hole.height)).toBe(true);
  expect(isAligned(hole.left + hole.width)).toBe(true);
});

it("tiles the masks flush against the hole with no gap", () => {
  const { masks, hole } = renderMeasured();

  const above = masks.find((m) => m.top === 0 && m.right === 0);
  const below = masks.find((m) => m.bottom === 0 && m.right === 0);
  const before = masks.find((m) => m.left === 0 && m.width !== undefined);
  const after = masks.find((m) => m.right === 0 && m.top === hole.top);

  expect(above.height).toBe(hole.top);
  expect(below.top).toBe(hole.top + hole.height);
  expect(before.width).toBe(hole.left);
  expect(after.left).toBe(hole.left + hole.width);
});
