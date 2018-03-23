export interface Direction {
    rotation: number
}

export interface Location {
    left: number,
    top: number
}

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