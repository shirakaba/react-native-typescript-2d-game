// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import {ImageStyle, Platform, ScaledSize, TextStyle, ViewStyle} from "react-native";
import {ITEM_LENGTH} from "../components/Item";

export interface StyleObject {
    [key: string]: Partial<ComponentStyle>;
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;

export interface Direction {
    rotation: number
}

export interface Point {
    left: number,
    top: number
}

export interface Size {
    width: number,
    height: number
}

export type Zone = Point & Size;

export type milliseconds = number;
export type seconds = number;

/**
 * "Good enough" square-based collision detection. Obviously the red box becomes more dangerous (and the blue box
 * becomes more vulnerable) when rotated, as the hitboxes increase to encompass their 'diamond shapes' in upright
 * rectangles. In the original The Box Flash game, this was compensated for by simply reducing the hitbox size whilst
 * the red box was rotated (and the blue box didn't even rotate!). This solution would be both practical and performant.
 * TODO: implement Separating Axis Theorem-based collision detection if feeling brave.
 */
export function isColliding(a: Zone, b: Zone): boolean {
    const aRight: number = a.left + a.width;
    const aBottom: number = a.top + a.height;

    const bRight: number = b.left + b.width;
    const bBottom: number = b.top + b.height;

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

export function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Returns a random potentially* unoccupied point, given an allowed zone (e.g. the stage) and a forbidden zone (e.g.
 * where the character is already standing) and the size of the object that the point is needed for.
 *
 * * If the first randomly generated point would collide with the forbidden zone, we offset the point by the width and
 * height of the forbidden zone, using modulo maths to keep the point within the allowed zone. For tiny stages, this
 * may still produce a collision. For The Box, whose window is expected to be fullscreen, this shouldn't be a problem.
 * TODO: perfect this preliminary algorithm.
 *
 * @param {Zone} allowedZone
 * @param {Zone} forbiddenZone
 * @param {Size} objectSize
 * @returns {Point}
 */
export function getPotentiallyUnoccupiedPoint(allowedZone: Zone, forbiddenZone: Zone, objectSize: Size): Point {
    const allowedZoneRespectingObjectSize: Size = {
        width: allowedZone.width - objectSize.width,
        height: allowedZone.height - objectSize.height
    };

    const point: Point = {
        left: getRandomInt(allowedZone.left, allowedZone.left + allowedZoneRespectingObjectSize.width),
        top: getRandomInt(allowedZone.top, allowedZone.top + allowedZoneRespectingObjectSize.height)
    };

    if(isColliding({ ...point, ...objectSize }, forbiddenZone)){
        return {
            left: allowedZoneRespectingObjectSize.width % point.left + forbiddenZone.width,
            top: allowedZoneRespectingObjectSize.height % point.top + forbiddenZone.height
        }
    } else {
        return point;
    }
}

export function getPotentiallyUnoccupiedPointWithinWindow(
    forbiddenZone: Zone,
    objectSize: Size,
    portrait: boolean,
    screenDimensions: ScaledSize,
    windowDimensions: ScaledSize
): Point {
    const isIphoneX: boolean = Platform.OS === 'ios' && (screenDimensions.width === 812 || screenDimensions.height === 812);
    // console.log("IS IPHONE X: ", isIphoneX);
    // https://www.paintcodeapp.com/news/iphone-x-screen-demystified
    // https://developer.apple.com/ios/human-interface-guidelines/overview/iphone-x/
    const NOTCH_DEPTH: number = 30;
    const OPPOSITE_CURVE_DEPTH: number = NOTCH_DEPTH; // Best guess.

    const windowWidth: number = windowDimensions.width;
    const windowHeight: number = windowDimensions.height;

    return getPotentiallyUnoccupiedPoint(
        {
            // I don't know how to determine whether we're in primary/secondary portrait/landscape mode, so I design as if there's a notch on BOTH sides.
            left: isIphoneX ? (portrait ? 0 : NOTCH_DEPTH) : 0,
            top: isIphoneX ? (portrait ? NOTCH_DEPTH  : 0) : 0,
            width: isIphoneX ? (portrait ? windowWidth : windowWidth - (NOTCH_DEPTH + OPPOSITE_CURVE_DEPTH)) : windowWidth,
            height: isIphoneX ? (portrait ? windowHeight - (NOTCH_DEPTH + OPPOSITE_CURVE_DEPTH) : windowHeight) : windowHeight,
        },
        forbiddenZone,
        objectSize
    );
}