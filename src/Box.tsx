import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';
import PropTypes from 'prop-types';

interface Props {
    id: string,
    speed: number,
    size: number,
    colour: string,
    targetLeft: number,
    targetTop: number,
    onPositionUpdate: (id: string, left: number, top: number, rotation: number) => void
}

export type BoxTransforms = Pick<State, "rotation" | "left" | "top">

interface State {
    speed: number,
    rotation: number,
    hasDefinitelyArrived: boolean,
    left: number,
    top: number
}

export const radToDeg: number = 180/Math.PI;

export class Box extends Component<Props, State> {
    private date: number = Date.now();

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            speed: this.props.speed,
            rotation: 0,
            hasDefinitelyArrived: true,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };

        this.advance = this.advance.bind(this);
        this.hasArrivedAtCoord = this.hasArrivedAtCoord.bind(this);
        this.hasArrived = this.hasArrived.bind(this);
        this.update = this.update.bind(this); // ABSOLUTELY necessary - update() is getting called from somewhere invisible.
    }

    hasArrivedAtCoord(target: number, current: number): boolean {
        return Math.abs(target - current) < 0.00001;
    }

    hasArrived(): boolean {
        return this.hasArrivedAtCoord(this.props.targetLeft, this.state.left) && this.hasArrivedAtCoord(this.props.targetTop, this.state.top);
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.setState({
            hasDefinitelyArrived: this.hasArrivedAtCoord(nextProps.targetTop, this.state.top) && this.hasArrivedAtCoord(nextProps.targetLeft, this.state.left)
        });
    }

    update() {
        // this.date = Date.now();
        if(this.state.hasDefinitelyArrived){
            this.date = Date.now();
            return;
        } else {
            this.advance(Date.now());
        }
    };

    componentDidMount(): void {
        this.context.loop.subscribe(this.update); // Not actually a Promise, despite what IDE might say.
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update); // Not actually a Promise, despite what IDE might say.
    }

    advance(date: number): void {
        const dateDiff: number = date - this.date;
        this.date = date;

        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        const angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.cos(angle) * (this.state.speed * dateDiff);
        const maxAdvanceY: number = Math.sin(angle) * (this.state.speed * dateDiff);

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
                rotation: newRotation,
                left: left,
                top: top,
                hasDefinitelyArrived: this.hasArrivedAtCoord(props.targetLeft, left) && this.hasArrivedAtCoord(props.targetTop, top)
            }
        });
    }

    /** Very likely that my naive implementation has room for improvement here. Open to comments. */
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(nextProps.size !== this.props.size) return true;
        if(this.state.top === nextState.top && this.state.left === nextState.left){
            return false;
        }
        return true;
    }

    render() {
        const individualStyle: Partial<ComponentStyle> = {
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
                style={[styles.generic, individualStyle]}
            />
        );
    }
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;
export interface StyleObject {
    [key: string]: Partial<ComponentStyle>;
}
export interface BoxStyleObject extends StyleObject {
    generic: Partial<ViewStyle>;
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    generic: {
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        position: "absolute"
    }
});
