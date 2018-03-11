import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';

interface Props {
    size: number,
    colour: string,
    targetLeft: number,
    targetTop: number
    // onTouchEvent: (targetLeft: number, targetTop: number) => void
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

interface State {
    speed: number,
    size: number,
    rotation: number,
    left: number,
    top: number
    // targetLeft: number,
    // targetTop: number
}

export class Box extends Component<Props, State> {
    private maxAdvancePerTick: number = 10;

    constructor(props: Props) {
        super(props);

        this.state = {
            speed: 10,
            size: this.props.size,
            rotation: 0,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };
    }

    // rotateToPoint(newLeft: number, newTop: number): void {
    //     // const leftDiff: number = newLeft - this.state.targetLeft
    // }

    advance(newLeft: number, newTop: number): void {
        const xDiff: number = newLeft - this.state.left;
        const yDiff: number = newTop - this.state.top;

        const angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.sin(angle) * this.state.speed;
        const maxAdvanceY: number = Math.sin(angle) * this.state.speed;

        this.setState({
            rotation: angle,
            left: maxAdvanceX,
            top: maxAdvanceY
        });
    }

    render() {
        const combinedStyles: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            left: this.state.left,
            top: this.state.top,
            width: this.state.size,
            height: this.state.size,
            transform: [
                { rotate: `${this.state.rotation}deg` }
            ]
        };

        return (
            <View
                // onStartShouldSetResponder={(ev: GestureResponderEvent) => false}
                // onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
                style={[styles.boxItself, combinedStyles]}
            />
        );
    }
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;
export interface StyleObject {
    [key: string]: Partial<ComponentStyle>;
}
export interface BoxStyleObject extends StyleObject {
    boxItself: Partial<ViewStyle>;
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    boxItself: {
        // backgroundColor: "red",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        position: "absolute"
    }
});
