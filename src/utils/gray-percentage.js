function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default function gray(lightness, hue, darkBackground) {
  if (typeof hue === 'undefined') {
    hue = 0;
  }
  if (typeof darkBackground === 'undefined') {
    darkBackground = false;
  }

  // Convert named hues into numeric lightness value.
  if (hue === 'cool') {
    hue = 237;
  } else if (hue === 'slate') {
    hue = 122;
  } else if (hue === 'warm') {
    hue = 69;
  }

  if (!isNumeric(hue)) {
    throw new Error('Hue is not a number');
  }

  if (!isNumeric(lightness)) {
    throw new Error('Lightness is not a number');
  }

  if (lightness > 100) {
    lightness = 100;
  }
  if (lightness < 0) {
    lightness = 0;
  }

  let saturation = 0;
  if (hue !== 0) {
    let a = 19.92978;
    let b = -0.3651759;
    let c = 0.001737214;
    saturation = a + b * lightness + c * Math.pow(lightness, 2);
  }

  let opacity = 0;
  if (darkBackground) {
    opacity = lightness / 100;
    lightness = '100%,';
  } else {
    opacity = (100 - lightness) / 100;
    lightness = '0%,';
  }

  return 'hsla(' + hue + ',' + saturation + '%,' + lightness + opacity + ')';
}