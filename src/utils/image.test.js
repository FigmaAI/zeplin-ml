import { getFittedDimensions, getTranslateValuesForFittedDimensions } from "./image";

describe("Image: getFittedDimensions", () => {
  it("returns dimensions that fit to page given small image", () => {
    const width = 300;
    const height = 100;
    const pageWidth = 600;
    const pageHeight = 400;

    const expected = {
      width: 600,
      height: 200,
    };

    const actual = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });

  it("returns dimensions that fit to page given overflowing image", () => {
    const width = 900;
    const height = 720;
    const pageWidth = 600;
    const pageHeight = 400;

    const expected = {
      width: 500,
      height: 400,
    };

    const actual = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });

  it("returns dimensions that fit to page given image with <1 aspect ratio", () => {
    const width = 400;
    const height = 500;
    const pageWidth = 600;
    const pageHeight = 400;

    const expected = {
      width: 320,
      height: 400,
    };

    const actual = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });

  it("returns dimensions that fit to page given overflowing image with >1 aspect ratio", () => {
    const width = 500;
    const height = 900;
    const pageWidth = 600;
    const pageHeight = 400;

    const expected = {
      width: 222,
      height: 400,
    };

    const actual = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });
});

describe("Image: getTranslateValuesForFittedDimensions", () => {
  it("returns translate values given small image", () => {
    const width = 300;
    const height = 100;
    const pageWidth = 600;
    const pageHeight = 400;

    const fittedDimensions = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    const expected = {
      translateY: 100,
    };

    const actual = getTranslateValuesForFittedDimensions({
      ...fittedDimensions,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });
});

describe("Image: getTranslateValuesForFittedDimensions", () => {
  it("returns translate values given big image with <1 aspect ratio", () => {
    const width = 400;
    const height = 1600;
    const pageWidth = 600;
    const pageHeight = 400;

    const fittedDimensions = getFittedDimensions({
      width,
      height,
      pageWidth,
      pageHeight,
    });

    const expected = {
      translateX: 250,
    };

    const actual = getTranslateValuesForFittedDimensions({
      ...fittedDimensions,
      pageWidth,
      pageHeight,
    });

    expect(actual).toEqual(expected);
  });
});
