const colors = {
  black: '#000000',
  white: '#ffffff',
  radiant: '#f9e292',
}

const themes = {
  light: {
    primary: colors.white,
    secondary: colors.black,
    contrast: colors.radiant,
  },
  dark: {
    primary: colors.black,
    secondary: colors.white,
    contrast: colors.radiant,
  },
}

const breakpoints = {
  mobile: '800px',
}

const viewports = {
  mobile: {
    width: '375px',
    height: '650px',
  },
  desktop: {
    width: '1440px',
    height: '816px',
  },
}

module.exports = {
  colors,
  themes,
  breakpoints,
  viewports,
}
