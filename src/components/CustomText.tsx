import { Text, type TextProps } from "react-native";
import FONTS, { FontFamilyType } from "../assets/Fonts";
import { PALETTE } from "../utils/Colors";
import { responsiveFontSize } from "../utils/Metrics";

export type CustomTextProps = TextProps & {
  color?: string;
  fontFamily?: FontFamilyType;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
};

export function CustomText({
  style,
  fontFamily = 'regular',
  fontSize = 16,
  color = PALETTE.white,
  lineHeight,
  ...rest
}: CustomTextProps) {
  const resolvedFontSize = responsiveFontSize(fontSize);

  return (
    <Text
      maxFontSizeMultiplier={1.3}
      style={[
        {
          color,
          fontFamily: FONTS[fontFamily],
          fontSize: resolvedFontSize,
          lineHeight: lineHeight ?? resolvedFontSize * 1.3,
          opacity: rest.disabled ? 0.7 : 1,
        },
        style,
      ]}
      {...rest}
    />
  );
}
