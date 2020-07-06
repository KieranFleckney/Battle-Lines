/**
 * Basic check if hex colour
 * @param gradient
 */
export function IsHexColour(colour: string): boolean {
    let isColour = false;
    if (colour && (colour = colour.trim())) {
        if (colour.length === 7) {
            if (colour.substr(0, 1) === '#') {
                isColour = true;
            }
        }
    }

    return isColour;
}

/**
 * Basic check if css graident
 * @param gradient
 */
export function IsCssGradient(gradient: string): boolean {
    let isGradient = false;
    gradient.trim();

    if (gradient) {
        if (gradient.includes('to') || gradient.includes('deg')) {
            isGradient = true;
        }
    }

    return isGradient;
}

/**
 * @param value Value to check is odd
 * @returns true or false
 */
export function IsOdd(value: number): boolean {
    if (IsNumeric(value)) {
        if (value % 2 == 0) {
            return false;
        } else {
            return true;
        }
    } else {
        throw new Error('Not a number');
    }
}

export function IsNumeric(value: any): boolean {
    if (value && !isNaN(value) && typeof value === 'number') {
        return true;
    } else {
        return false;
    }
}

export function IsNodejs() {
    return (
        typeof process === 'object' &&
        typeof process.versions === 'object' &&
        typeof process.versions.node !== 'undefined'
    );
}

export function IsBrowser() {
    return typeof window !== 'undefined' || typeof self !== 'undefined';
}
