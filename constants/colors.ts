export const CLR_LIGHT_PRIMARY = '#00BCD4';
export const CLR_LIGHT_ACCENT = '#FF9800';
export const CLR_LIGHT_TOGGLE = '#00BFA5';
export const CLR_LIGHT_PROCEDURE = '#7B1FA2';

export const CLR_DARK_GRAY_1 = '#8a7d7dff'; 
export const CLR_DARK_GRAY_2 = '#b6b3b3ff'; 

export const getThemeColors = (isSecondDegree: boolean) => {
  const CLR_PRIMARY = isSecondDegree ? CLR_DARK_GRAY_1 : CLR_LIGHT_PRIMARY; 
  const CLR_ACCENT = isSecondDegree ? CLR_DARK_GRAY_2 : CLR_LIGHT_ACCENT; 
  const CLR_TOGGLE = isSecondDegree ? CLR_DARK_GRAY_1 : CLR_LIGHT_TOGGLE;
  const CLR_PROCEDURE = isSecondDegree ? CLR_DARK_GRAY_2 : CLR_LIGHT_PROCEDURE;
  const CLR_SECONDARY = isSecondDegree ? '#03DAC6' : '#4CAF50';
  const CLR_BACKGROUND = isSecondDegree ? '#121212' : '#E0F7FA';
  const CLR_SURFACE = isSecondDegree ? '#1E1E1E' : '#FFF';
  const CLR_ON_SURFACE = isSecondDegree ? '#FFFFFF' : '#333';
  const CLR_BORDER = isSecondDegree ? '#3C3C3C' : '#E0E0E0';
  const CLR_PLACEHOLDER = isSecondDegree ? '#A8A8A8' : '#888';
  const CLR_RESULT_BOX = isSecondDegree ? '#2A2A2A' : '#E8F5E9';
  const CLR_RESULT_BORDER = CLR_SECONDARY;
  const CLR_SHADOW = '#000';

  return {
    CLR_PRIMARY,
    CLR_ACCENT,
    CLR_TOGGLE,
    CLR_PROCEDURE,
    CLR_SECONDARY,
    CLR_BACKGROUND,
    CLR_SURFACE,
    CLR_ON_SURFACE,
    CLR_BORDER,
    CLR_PLACEHOLDER,
    CLR_RESULT_BOX,
    CLR_RESULT_BORDER,
    CLR_SHADOW,
  };
};


