function getAspectRatio(width, height) {
  return width / height;
}

function getDimensionsGivenWidth(width, ratio) {
  return {
    width,
    height: Math.round(width / ratio),
  };
}

function getDimensionsGivenHeight(height, ratio) {
  return {
    width: Math.round(height * ratio),
    height,
  };
}

export function getFittedDimensions({ width, height, pageWidth, pageHeight }) {
  const aspectRatio = getAspectRatio(width, height);
  const pageAspectRatio = getAspectRatio(pageWidth, pageHeight);

  if (pageAspectRatio > aspectRatio) {
    return getDimensionsGivenHeight(pageHeight, aspectRatio);
  }

  return getDimensionsGivenWidth(pageWidth, aspectRatio);
}

function getTranslateValueToCenter(value, pageValue) {
  return Math.round((pageValue - value) / 2);
}

export function getTranslateValuesForFittedDimensions({
  width,
  height,
  pageWidth,
  pageHeight,
}) {
  const aspectRatio = getAspectRatio(width, height);
  const pageAspectRatio = getAspectRatio(pageWidth, pageHeight);

  if (pageAspectRatio > aspectRatio) {
    return {
      translateX: getTranslateValueToCenter(width, pageWidth),
    };
  }

  return {
    translateY: getTranslateValueToCenter(height, pageHeight),
  };
}

export function getScreenImageProperties({ pageId, width, height, pageSize }) {
  const {
    width: { magnitude: pageWidth, unit },
    height: { magnitude: pageHeight },
  } = pageSize;

  const fittedDimensions = getFittedDimensions({
    width,
    height,
    pageWidth,
    pageHeight,
  });
  const translateValues = getTranslateValuesForFittedDimensions({
    ...fittedDimensions,
    pageWidth,
    pageHeight,
  });

  return {
    pageObjectId: pageId,
    size: {
      height: {
        magnitude: fittedDimensions.height,
        unit,
      },
      width: {
        magnitude: fittedDimensions.width,
        unit,
      },
    },
    transform: {
      scaleX: 1,
      scaleY: 1,
      ...translateValues,
      unit,
    },
  };
}
