/**
 * Takes a css gradient and converts it into a values need to draw on canvas
 * @param cssGradient css gradient properties
 * @param gradientWidth width of gradient
 * @param gradientHeight height of gradient
 * @param ParentWidth width of parent/container
 * @param parentHeight height of parent/container
 * @returns contains all values need to create a gradient,transform and draw
 */
export function CssGradientToCanvasGradientLinear(
    cssGradient: string,
    gradientWidth: number,
    gradientHeight: number,
    ParentWidth: number,
    parentHeight: number
): CanvasGradientParameters {
    if (!cssGradient) throw new Error('Missing "cssGradient"');
    if (!gradientWidth) throw new Error('Missing "gradientWidth"');
    if (!gradientHeight) throw new Error('Missing "gradientHeight"');
    if (!ParentWidth) throw new Error('Missing "canvasWidth"');
    if (!parentHeight) throw new Error('Missing "canvasHeight"');

    let colours: Array<ColourStop> = ParseGrandientColours(cssGradient);

    if (!colours) throw new Error("Couldn't parse colour for gradient");

    let angle: number = ParseGrandientAngle(cssGradient);

    if (typeof angle !== 'number') throw new Error("Couldn't calculate angle");

    // let rotateScaleGradient = CalculateRotateScale(angle, gradientWidth, gradientHeight, ParentWidth, parentHeight);
    let gradientParams = ScaleGradient(angle, gradientWidth, gradientHeight);

    // if (!rotateScaleGradient) throw new Error("Couldn't calculate rotations");
    if (!gradientParams) throw new Error("Couldn't calculate rotations");

    // rotateScaleGradient.ColourStops = colours;gradient

    return new CanvasGradientParameters(gradientParams, colours);
}

/**
 * Parse the colour part of the css gradient and return a object wil all colours and offsets
 * @param cssGradient css gradient properties
 */
export function ParseGrandientColours(cssGradient: string): Array<ColourStop> {
    let colourStops: Array<ColourStop> = new Array<ColourStop>();
    if (cssGradient) {
        let split: Array<string> = cssGradient.split(',');
        if (split[0].includes('to') || split[0].includes('deg')) {
            split.shift();
        }

        if (split.length > 0) {
            for (let i = 0; i < split.length; i++) {
                split[i] = split[i].trim();
                let colourValues: Array<string> = split[i].split(' ');
                let colour: string | undefined;

                if (colourValues[0] && !colourValues[0].includes('%')) {
                    colour = colourValues.shift();
                }

                // REVIEW: This is not perfect maybe I'll look at how to calculate offset again
                if (colour) {
                    if (colourValues.length > 0) {
                        for (const offset of colourValues) {
                            if (offset.substr(offset.length - 1, 1) === '%') {
                                colourStops.push(
                                    new ColourStop(colour, Number(offset.substr(0, offset.length - 1)) / 100)
                                );
                            }
                        }
                    } else {
                        if (i === 0) {
                            colourStops.push(new ColourStop(colour, 0));
                        } else if (i === split.length - 1) {
                            colourStops.push(new ColourStop(colour, 1));
                        } else {
                            colourStops.push(new ColourStop(colour, (1 / (split.length - 1)) * i));
                        }
                    }
                }
            }
        }
    } else {
        throw new Error('No cssGradient provided');
    }
    return colourStops;
}

/**
 * Parse the angle part of the css gradient and return number in radians
 * @param cssGradient css gradient properties
 */
export function ParseGrandientAngle(cssGradient: string): number {
    let angle: number = 90;
    if (cssGradient) {
        let split: Array<string> = cssGradient.split(',');
        if (split[0].includes('to') || split[0].includes('deg')) {
            let directions = split.shift();
            if (directions) {
                if (directions.includes('to')) {
                    let directionsSplit = directions.split(' ');
                    directionsSplit.shift();
                    if (directionsSplit.length > 0 || directionsSplit.length < 2) {
                        let direction: string = '';
                        directionsSplit.forEach((d) => {
                            direction += d.toUpperCase();
                        });

                        // Yes I am ashamed of this code
                        switch (direction) {
                            case 'BOTTOM':
                                angle = 90;
                                break;
                            case 'TOP':
                                angle = 270;
                                break;
                            case 'RIGHT':
                                angle = 0;
                                break;
                            case 'LEFT':
                                angle = 180;
                                break;
                            case 'BOTTOMRIGHT':
                            case 'RIGHTBOTTOM':
                                angle = 45;
                                break;
                            case 'BOTTOMLEFT':
                            case 'LEFTBOTTOM':
                                angle = 135;
                                break;
                            case 'TOPRIGHT':
                            case 'RIGHTTOP':
                                angle = 315;
                                break;
                            case 'TOPLEFT':
                            case 'LEFTTOP':
                                angle = 225;
                                break;
                        }
                    } else {
                        throw new Error('No direction or too many. Directions:' + directionsSplit.length);
                    }
                } else {
                    directions = directions.trim();
                    let degree: number = Number(directions.substr(0, directions.length - 3));
                    angle = degree + 90;
                }
            } else {
                console.log('Error parsing angle, setting to default');
            }
        }
    }

    return DegToRad(angle);
}

// https://stackoverflow.com/questions/35346296/scale-rotated-image-to-fill-html5-canvas-using-javascript-trigonometry
// Math Hard
// REVIEW: Figure out how to convert matrix into x0,y0,x1,y1 coord instead of using transform maxtrix
/**
 * Calculates the rotation and scale of the gradient on given angle in radians
 * @param angle angle to rotate by in radians
 * @param imageWidth width of gradient
 * @param imageHeight height of gradient
 * @param parentWidth width of parent/container used to scale
 * @param parentHeight height of parent/container used to scale
 */
export function CalculateRotateScale(
    angle: number,
    imageWidth: number,
    imageHeight: number,
    parentWidth: number,
    parentHeight: number
): RotateScaleGradient {
    let dist = Math.sqrt(Math.pow(parentWidth, 2) + Math.pow(parentHeight, 2));
    let diagAngle = Math.asin(parentHeight / dist);
    let a1 = ((angle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2);
    if (a1 > Math.PI) {
        a1 -= Math.PI;
    }
    if (a1 > Math.PI / 2 && a1 <= Math.PI) {
        a1 = Math.PI / 2 - (a1 - Math.PI / 2);
    }
    let ang1 = Math.PI / 2 - diagAngle - Math.abs(a1);
    let ang2 = Math.abs(diagAngle - Math.abs(a1));
    let scale1 = (Math.cos(ang1) * dist) / imageHeight;
    let scale2 = (Math.cos(ang2) * dist) / imageWidth;
    let scale = Math.max(scale1, scale2);
    let dx = Math.cos(angle) * scale;
    let dy = Math.sin(angle) * scale;

    let transformParams = new TransformMatrix(dx, dy, -dy, dx, parentWidth / 2, parentHeight / 2);
    let linearGradientParameters = new LinearGradientParameters(imageWidth / 2, 0, -imageWidth / 2, 0);
    let drawRectParameters = new DrawRectParameters(-imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);

    let rotateScaleGradient = new RotateScaleGradient(
        transformParams,
        linearGradientParameters,
        drawRectParameters,
        new Array<ColourStop>()
    );

    return rotateScaleGradient;
}
// https://stackoverflow.com/questions/45624502/html5-canvas-rotate-gradient-around-centre
export function ScaleGradient(angle: number, wdith: number, heigh: number): LinearGradientParameters {
    const w = wdith;
    const h = heigh;
    const maxWidth = w / 2;
    const aspect = h / w;
    let linearGradientParameters = new LinearGradientParameters(
        w / 2 + Math.cos(angle) * maxWidth,
        h / 2 + Math.sin(angle) * maxWidth * aspect,
        w / 2 - Math.cos(angle) * maxWidth,
        h / 2 - Math.sin(angle) * maxWidth * aspect
    );
    return linearGradientParameters;
}

export class ColourStop {
    Colour: string;
    Offset: number;
    constructor(colour: string, offset: number) {
        this.Colour = colour;
        this.Offset = offset;
    }
}

class TransformMatrix {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
    F: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.A = a;
        this.B = b;
        this.C = c;
        this.D = d;
        this.E = e;
        this.F = f;
    }
}

class DrawRectParameters {
    X: number;
    Y: number;
    Width: number;
    Height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }
}

class LinearGradientParameters {
    X0: number;
    Y0: number;
    X1: number;
    Y1: number;

    constructor(x0: number, y0: number, x1: number, y1: number) {
        this.X0 = x0;
        this.Y0 = y0;
        this.X1 = x1;
        this.Y1 = y1;
    }
}

export class RotateScaleGradient {
    TransformMatrix: TransformMatrix;
    LinearGradientParameters: LinearGradientParameters;
    DrawRectParameters: DrawRectParameters;
    ColourStops: Array<ColourStop>;

    /**
     * All value need to create canvas linear gradient, transform/scale and draw
     * @param transformMatrix
     * @param linearGradientParameters
     * @param drawRectParameters
     * @param colourStops
     */
    constructor(
        transformMatrix: TransformMatrix,
        linearGradientParameters: LinearGradientParameters,
        drawRectParameters: DrawRectParameters,
        colourStops: Array<ColourStop>
    ) {
        this.TransformMatrix = transformMatrix;
        this.LinearGradientParameters = linearGradientParameters;
        this.DrawRectParameters = drawRectParameters;
        this.ColourStops = colourStops;
    }
}

export class CanvasGradientParameters {
    LinearGradientParameters: LinearGradientParameters;
    ColourStops: Array<ColourStop>;

    /**
     * All value need to create canvas linear gradient/colours
     * @param linearGradientParameters
     * @param colourStops
     */
    constructor(linearGradientParameters: LinearGradientParameters, colourStops: Array<ColourStop>) {
        this.LinearGradientParameters = linearGradientParameters;
        this.ColourStops = colourStops;
    }
}

/**
 * Draws gradient using RotateScaleGradient which is gerenate using CalculateRotateScale
 * @param ctx Canvas context
 * @param gradientConfig RotateScaleGradient object
 */
export function DrawGradientToFit(ctx: CanvasRenderingContext2D, gradientConfig: RotateScaleGradient): void {
    let gradient = ctx.createLinearGradient(
        gradientConfig.LinearGradientParameters.X0,
        gradientConfig.LinearGradientParameters.Y0,
        gradientConfig.LinearGradientParameters.X1,
        gradientConfig.LinearGradientParameters.Y1
    );

    gradient = AddColourStops(gradientConfig.ColourStops, gradient);

    ctx.setTransform(
        gradientConfig.TransformMatrix.A,
        gradientConfig.TransformMatrix.B,
        gradientConfig.TransformMatrix.C,
        gradientConfig.TransformMatrix.D,
        gradientConfig.TransformMatrix.E,
        gradientConfig.TransformMatrix.F
    );

    //ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = gradient;
    ctx.fillRect(
        gradientConfig.DrawRectParameters.X,
        gradientConfig.DrawRectParameters.Y,
        gradientConfig.DrawRectParameters.Width,
        gradientConfig.DrawRectParameters.Height
    );

    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

/**
 * Draw gadient using CanvasGradientParameters
 * @param ctx canvas context
 * @param gradientConfig CanvasGradientParameters object
 * @param x
 * @param y
 * @param width
 * @param height
 */
export function DrawGradient(
    ctx: CanvasRenderingContext2D,
    gradientConfig: CanvasGradientParameters,
    x: number,
    y: number,
    width: number,
    height: number
): void {
    let gradient = ctx.createLinearGradient(
        gradientConfig.LinearGradientParameters.X0,
        gradientConfig.LinearGradientParameters.Y0,
        gradientConfig.LinearGradientParameters.X1,
        gradientConfig.LinearGradientParameters.Y1
    );

    gradient = AddColourStops(gradientConfig.ColourStops, gradient);

    //ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
}

/**
 * Converts degree to radians
 * @param deg
 */
export function DegToRad(deg: number) {
    return deg * (Math.PI / 180);
}

export function AddColourStops(colours: Array<ColourStop>, gradient: CanvasGradient): CanvasGradient {
    if (!gradient) throw new Error('Missing gradient');
    if (!colours) throw new Error('Missing colours');
    if (colours.length <= 0) throw new Error('Colour array equal or less then 0');

    for (const colour of colours) {
        gradient.addColorStop(colour.Offset, colour.Colour);
    }

    return gradient;
}
