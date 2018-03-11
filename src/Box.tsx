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
    private timerID: number;

    constructor(props: Props) {
        super(props);
        // console.log("RECONSTRUCTED");

        this.state = {
            speed: 10,
            size: this.props.size,
            rotation: 0,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };

        this.advance = this.advance.bind(this);

        // setInterval()
        // this.advance(this.props.targetLeft, this.props.targetTop);
    }

    componentWillReceiveProps(nextProps: Props): void {
        // Guard against un-needed renders.
        if(nextProps.targetLeft !== this.state.left || nextProps.targetTop !== this.state.top){
            // this.advance();
            clearInterval(this.timerID);
            this.timerID = window.setInterval(
                () => this.advance(),
                // this.props.updateFreq || 1000
                100
            );
        } else {
            clearInterval(this.timerID);
        }
    }

    componentDidMount(): void {
        if(this.props.colour !== "red") {
        }
    }

    componentWillUnmount(): void {
        clearInterval(this.timerID);
    }

    // rotateToPoint(newLeft: number, newTop: number): void {
    //     // const leftDiff: number = newLeft - this.state.targetLeft
    // }

    advance(): void {
        console.log(`[advance()] targetLeft: ${this.props.targetLeft.toFixed(0)}; targetTop: ${this.props.targetTop.toFixed(0)}; left: ${this.state.left.toFixed(0)}; top: ${this.state.top.toFixed(0)}`);
        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        let angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.sin(angle + Math.sin(Math.asin(1))) * this.state.speed;
        const maxAdvanceY: number = Math.sin(angle) * this.state.speed;
        console.log(`[advance()] angle: ${(angle * (180/3.14159)).toFixed(2)}º; maxAdvanceY: ${maxAdvanceX.toFixed(0)}; maxAdvanceX ${maxAdvanceX.toFixed(0)}`);

        this.setState((prevState: Readonly<State>, props: Props) => {

            return {
                rotation: angle,
                left: Math.min(prevState.left + maxAdvanceX, props.targetLeft),
                top: Math.min(prevState.top + maxAdvanceY, props.targetTop)
            }
        });

        // this.setState({
        //     rotation: angle,
        //     left: maxAdvanceX,
        //     top: maxAdvanceY
        // });
    }

    render() {
        const combinedStyles: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            // left: this.props.targetLeft,
            // top: this.props.targetTop,
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
