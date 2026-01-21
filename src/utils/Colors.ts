// src/Styles/colors.ts

// --- Base Palette Colors (Raw HEX/RGB values) ---
// These are your unique, named colors.
export const PALETTE = {
  white: "#FFFFFF",
  black: "#000000",
  dangerRed: "#FF3B30",
  mysticPurple: "#2C0E4E", // Deep, dark purple
  sacredGold: "#F6C859", // Bright, warm gold
  gold: "#DEA856",
  lightSkin: "#EECBB7",
  softLavender: "#9F79D1", // Lighter, muted purple
  duskRose: "#D89CA1", // Soft, earthy pink
  midnightIndigo: "#1B063B", // Very dark, almost black indigo
  celestialBlue: "#6AB8C9", // Bright, airy blue
  purple: "#492F66",
  blue: "#4D81E7",
  earthGradient: {
    start: "#8C4B9C",
    end: "#C03C3A",
  },
  waterGradient: {
    start: "#657DE9",
    end: "#764CA5",
  },
  fireGradient: {
    start: "#F86671",
    end: "#FF9B49",
  },
  airGradient: {
    start: "#27F1A3",
    end: "#17A6EF",
  },
  LightGrey: "#F0F0F0", // A common light grey for subtle backgrounds/borders
  MediumGrey: "#A0A0A0", // For secondary text or disabled states
  DarkGrey: "#252525", // For deep backgrounds or borders in dark mode
  PlaceHolderText: "#fdfdfd89",
  heading: "#D5CAC3",
  inputBorder: "#ffffff4c",
  lightTextColor: "#ffffffba",
};

// --- Semantic Theme Colors ---
// This structure defines the *roles* of colors in your UI.
// You will assign colors from your PALETTE to these roles for each theme.

export const ThemeColors = {
  light: {
    // --- Backgrounds ---
    backgroundPrimary: PALETTE.white, // Main screen background
    backgroundSecondary: PALETTE.LightGrey, // Used for cards, sections, or secondary containers
    backgroundTertiary: PALETTE.LightGrey, // Even lighter/subtler background

    // --- Text Colors ---
    textPrimary: PALETTE.black, // Main text content
    textSecondary: PALETTE.MediumGrey, // Secondary information, captions
    textHighlight: PALETTE.mysticPurple, // For emphasized text, links, headings

    // --- Borders & Separators ---
    borderPrimary: PALETTE.LightGrey, // Default border for cards, inputs
    borderSecondary: PALETTE.MediumGrey, // Stronger separators

    // --- Icons ---
    iconPrimary: PALETTE.black, // Default icon color
    iconAccent: PALETTE.mysticPurple, // Accent icons

    // --- Buttons & Interactive Elements ---
    buttonPrimary: PALETTE.mysticPurple, // Primary action buttons
    buttonPrimaryText: PALETTE.white, // Text on primary buttons
    buttonSecondary: PALETTE.softLavender, // Secondary action buttons
    buttonSecondaryText: PALETTE.black, // Text on secondary buttons

    // --- Special / Accent Colors ---
    accent: PALETTE.sacredGold, //  accent color (e.g., progress bars, selection)
    danger: PALETTE.dangerRed, // Error states, destructive actions
    success: PALETTE.celestialBlue, // Success messages, positive indicators
    warning: PALETTE.sacredGold, // Warning states

    // --- Gradients (assign specific gradients from your PALETTE) ---
    gradientMain: PALETTE.earthGradient, // For primary background elements or hero sections
    gradientAccent: PALETTE.waterGradient, // For specific decorative elements

    // --- Compatibility Mappings (if you still have older components expecting these) ---
    // If your existing components use `Colors.bglight`, `Colors.bgsoft`, `Colors.greyText`,
    // you can map them here to your new semantic colors.
    bglight: PALETTE.LightGrey, // Map to backgroundSecondary or inputBackground
    bgsoft: PALETTE.LightGrey, // Map to borderPrimary or backgroundTertiary
    greyText: PALETTE.MediumGrey, // Map to textSecondary
  },
  dark: {
    // --- Backgrounds ---
    backgroundPrimary: PALETTE.midnightIndigo, // Main screen background
    backgroundSecondary: PALETTE.mysticPurple, // Used for cards, sections, or secondary containers (a slightly lighter dark)
    backgroundTertiary: PALETTE.mysticPurple, // Even lighter/subtler dark background

    // --- Text Colors ---
    textPrimary: PALETTE.white, // Main text content on dark backgrounds
    textSecondary: PALETTE.softLavender, // Muted text for secondary info
    textHighlight: PALETTE.sacredGold, // For emphasized text, links, headings

    // --- Borders & Separators ---
    borderPrimary: PALETTE.DarkGrey, // Default border for cards, inputs
    borderSecondary: PALETTE.softLavender, // Stronger separators

    // --- Icons ---
    iconPrimary: PALETTE.white, // Default icon color
    iconAccent: PALETTE.sacredGold, // Accent icons

    // --- Buttons & Interactive Elements ---
    buttonPrimary: PALETTE.sacredGold, // Primary action buttons
    buttonPrimaryText: PALETTE.black, // Text on primary buttons (contrast with gold)
    buttonSecondary: PALETTE.celestialBlue, // Secondary action buttons
    buttonSecondaryText: PALETTE.white, // Text on secondary buttons

    // --- Special / Accent Colors ---
    accent: PALETTE.celestialBlue, //  accent color (e.g., progress bars, selection)
    danger: PALETTE.dangerRed, // Error states, destructive actions (often same across themes)
    success: PALETTE.airGradient.start, // Success messages (can use a gradient start/end or a new color)
    warning: PALETTE.fireGradient.end, // Warning states

    // --- Gradients (assign specific gradients from your PALETTE) ---
    gradientMain: PALETTE.fireGradient, // For primary background elements or hero sections
    gradientAccent: PALETTE.airGradient, // For specific decorative elements

    // --- Compatibility Mappings (if you still have older components expecting these) ---
    bglight: PALETTE.mysticPurple, // Map to backgroundSecondary or inputBackground
    bgsoft: PALETTE.DarkGrey, // Map to borderPrimary or backgroundTertiary
    greyText: PALETTE.softLavender, // Map to textSecondary
  },
};

// Export the type of a theme to be used in ThemeContextType
export type AppThemeColors = typeof ThemeColors.light;
