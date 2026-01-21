const FONTS = {
  bold: 'PlusJakartaSans-Bold',
  boldItalic: 'PlusJakartaSans-BoldItalic',
  extraBold: 'PlusJakartaSans-ExtraBold',
  extraBoldItalic: 'PlusJakartaSans-ExtraBoldItalic',
  extraLight: 'PlusJakartaSans-ExtraLight',
  extraLightItalic: 'PlusJakartaSans-ExtraLightItalic',
  italic: 'PlusJakartaSans-Italic',
  light: 'PlusJakartaSans-Light',
  lightItalic: 'PlusJakartaSans-LightItalic',
  medium: 'PlusJakartaSans-Medium',
  mediumItalic: 'PlusJakartaSans-MediumItalic',
  regular: 'PlusJakartaSans-Regular',
  semiBold: 'PlusJakartaSans-SemiBold',
  semiBoldItalic: 'PlusJakartaSans-SemiBoldItalic',
  belganAesthetic: 'Belgan Aesthetic',
};

export default FONTS;

export type FontFamilyType = keyof typeof FONTS;
