// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

export interface Direction {
    rotation: number
}

export interface Location {
    left: number,
    top: number
}

/**
 * "Good enough" rectangle-based collision detection. Obviously the red box becomes more dangerous (and the blue box
 * becomes more vulnerable) when rotated, as the hitboxes increase to encompass their 'diamond shapes' in upright
 * rectangles. In the original The Box Flash game, this was compensated for by simply reducing the hitbox size whilst
 * the red box was rotated (and the blue box didn't even rotate!). This solution would be both practical and performant.
 * TODO: implement Separating Axis Theorem-based collision detection if feeling brave.
 */
export function isColliding(a: Location, aSize: number, b: Location, bSize: number): boolean {
    const aRight: number = a.left + aSize;
    const aBottom: number = a.top + aSize;

    const bRight: number = b.left + bSize;
    const bBottom: number = b.top + bSize;

    if(
        bRight > a.left && bRight < aRight || // b's right edge is in bounds
        b.left > a.left && b.left < aRight // b's left edge is in bounds
    ){
        if(
            b.top > a.top && b.top < aBottom || // b's top edge is in bounds
            bBottom < aBottom && bBottom > a.top // b's bottom edge is in bounds
        ){
            return true;
        }
    }
    return false;
}

export function hasArrivedAtCoord(target: number, current: number): boolean {
    return Math.abs(target - current) < 0.00001;
}