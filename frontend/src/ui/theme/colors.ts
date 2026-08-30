export const COLORS = {
  cream: "#F8F3EC",
  creamDark: "#EFE5D8",
  chocolate: "#3A241C",
  espresso: "#241611",
  brown: "#6B4A3A",
  gold: "#C9A66B",
  goldLight: "#E4D1AD",
  beige: "#E9DCCB",
  white: "#FFFDFC",
  text: "#2E211C",
  textLight: "#796A61",
  border: "#E6D9CC",
  success: "#58745A",
  danger: "#A45145",
  shadow: "#2C1A12"
} as const;

export type ColorKey = keyof typeof COLORS;
