// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, { Component } from 'react';
import {
    View, StyleSheet, ViewStyle, TextStyle, ImageStyle
} from 'react-native';
import PropTypes from 'prop-types';
import {ComponentStyle, hasArrivedAtCoord, StyleObject} from "./utils";

export const enum BoxId {
    Hero,
    Villain
}

interface Props {
    // Used to calculate how far we have to move (our speed is based on time, not framerate)
    lastFrameDate: number,
    currentFrameDate: number,

    // date: number,
    id: BoxId,
    speed: number,
    size: number,
    colour: string,
    targetLeft: number,
    targetTop: number,
    onPositionUpdate: (id: BoxId, left: number, top: number, rotation: number) => void
}

export type BoxTransforms = Pick<State, "rotation" | "left" | "top">

interface State {
    rotation: number,
    hasDefinitelyArrived: boolean,
    left: number,
    top: number
}

// TODO: I want this to be a static class field, but not sure how to do so once PropTypes is imported (and interfering).
export const radToDeg: number = 180/Math.PI;

export class Box extends Component<Props, State> {
    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            rotation: 0,
            hasDefinitelyArrived: true,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };

        this.advance = this.advance.bind(this);
        this.hasArrivedAtTargetCoords = this.hasArrivedAtTargetCoords.bind(this);
        this.update = this.update.bind(this); // ABSOLUTELY necessary - update() is getting called from somewhere invisible.
    }

    private hasArrivedAtTargetCoords(): boolean {
        return hasArrivedAtCoord(this.props.targetLeft, this.state.left) && hasArrivedAtCoord(this.props.targetTop, this.state.top);
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.setState({
            hasDefinitelyArrived: hasArrivedAtCoord(nextProps.targetTop, this.state.top) && hasArrivedAtCoord(nextProps.targetLeft, this.state.left)
        });
    }

    /**
     * Called each frame of the game loop.
     * Checks whether the box has arrived at its target; otherwise, advances towards it. Updates the stored date to
     * enable time-based displacement calculation for the advance() method.
     */
    update() {
        if(this.state.hasDefinitelyArrived){
            return;
        } else {
            this.advance(this.props.currentFrameDate);
        }
    };

    componentDidMount(): void {
        this.context.loop.subscribe(this.update); // See react-game-kit for (limited) documentation. Not a Promise.
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update); // See react-game-kit for (limited) documentation. Not a Promise.
    }

    /**
     * Advance towards the target position. Movement initialSpeed is dependent on the time elapsed rather than the framerate,
     * so it won't fall short of the expected distance if ever a frame is dropped. This is why date is a required param.
     * If this can be written with some much simpler maths somehow, I'll cry.
     */
    private advance(date: number): void {
        const dateDiff: number = date - this.props.lastFrameDate;

        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        const angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.cos(angle) * (this.props.speed * dateDiff);
        const maxAdvanceY: number = Math.sin(angle) * (this.props.speed * dateDiff);

        this.setState((prevState: Readonly<State>, props: Props) => {
            const left: number = xDiff >= 0 ?
                Math.min(prevState.left + maxAdvanceX, props.targetLeft) :
                Math.max(prevState.left + maxAdvanceX, props.targetLeft);
            const top: number = yDiff >= 0 ?
                Math.min(prevState.top + maxAdvanceY, props.targetTop) :
                Math.max(prevState.top + maxAdvanceY, props.targetTop);
            const extraRotation: number = angle * radToDeg - prevState.rotation;
            const easing: number = 4;

            const optimalRotation: number =
                // If extraRotation is -181, then optimal to instead add 179 (360 + -181)
                extraRotation < -180 ?
                    360 + extraRotation :
                    (
                        // If extraRotation is 181, then optimal to instead add -179 (181 - 360)
                        extraRotation > 180 ?
                            extraRotation - 360 :
                            extraRotation
                    );
            const optimalEasedRotation: number = optimalRotation/easing;

            /* When adding prevState.rotation (e.g. 359°) simply to extraRotation, it self-regulates to stay within 360°
             * (but doesn't take the optimal route; it'll always turn clockwise).
             * By contrast, when adding prevState.rotation to optimalRotation, the total rotation may exceed 360°,
             * and thus, we need to moderate it with a modulo to prevent the numbers growing each time the box turns
             * anti-clockwise. */
            const newRotation: number = (prevState.rotation + optimalEasedRotation) % 360;

            /* I'm uncertain whether this should preferably be called before this setState() call (now) or after it
             * (e.g. during the componentWillUpdate() call). */
            this.props.onPositionUpdate(this.props.id, left, top, newRotation);

            return {
                // lastFrameDate: date,
                rotation: newRotation,
                left: left,
                top: top,
                hasDefinitelyArrived: hasArrivedAtCoord(props.targetLeft, left) && hasArrivedAtCoord(props.targetTop, top)
            }
        });
    }

    /** Very likely that my naive implementation has room for improvement here. Open to comments.
      * We don't want to re-render the component if the state change is purely non-visible (e.g. lastFrameDate or
      * hasDefinitelyArrived). We do want to re-render it if the state change includes visible aspects (e.g. position
      * and rotation). */
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        // Visual props
        if(nextProps.size !== this.props.size) return true;

        // Visual state
        if(this.state.left !== nextState.left) return true;
        if(this.state.top !== nextState.top) return true;

        return false;
    }

    /**
     * As an easy proof-of-concept, each Box is rendered as a View component, but it is likely much more efficient to
     * render them with Canvas or some other dedicated graphics feature to reduce their overhead!
     */
    render() {
        const dynamicStyle: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            width: this.props.size,
            height: this.props.size,
            transform: [
                { translateX: this.state.left },
                { translateY: this.state.top },
                { rotate: `${this.state.rotation}deg` }
            ]
        };

        return (
            <View
                style={[styles.static, dynamicStyle]}
            />
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    static: {
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        position: "absolute"
    }
});
