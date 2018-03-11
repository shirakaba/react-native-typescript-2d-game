import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';

interface Props {
    speed: number,
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
            speed: this.props.speed,
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
        if(
            nextProps.targetLeft.toFixed(1) !== this.state.left.toFixed(1) ||
            nextProps.targetTop.toFixed(1) !== this.state.top.toFixed(1)){
            // this.advance();
            clearInterval(this.timerID);
            this.advance();
            this.timerID = window.setInterval(
                () => this.advance(),
                // this.props.updateFreq || 1000
                20
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
        if(
            this.props.targetLeft.toFixed(1) === this.state.left.toFixed(1) &&
            this.props.targetTop.toFixed(1) === this.state.top.toFixed(1)
        ){
            // console.log(`[advance() stopped] targetLeft: ${this.props.targetLeft.toFixed(1)}; targetTop: ${this.props.targetTop.toFixed(1)}; left: ${this.state.left.toFixed(1)}; top: ${this.state.top.toFixed(1)}`);
            clearInterval(this.timerID);
            return;
        }
        // console.log(`[advance()] targetLeft: ${this.props.targetLeft.toFixed(1)}; targetTop: ${this.props.targetTop.toFixed(1)}; left: ${this.state.left.toFixed(1)}; top: ${this.state.top.toFixed(1)}`);
        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        let angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.cos(angle) * this.state.speed;
        const maxAdvanceY: number = Math.sin(angle) * this.state.speed;
        // console.log(`[advance()] angle: ${(angle * (180/3.14159)).toFixed(2)}º; maxAdvanceY: ${maxAdvanceX.toFixed(0)}; maxAdvanceX ${maxAdvanceX.toFixed(0)}`);

        this.setState((prevState: Readonly<State>, props: Props) => {
            return {
                rotation: prevState.rotation + (angle * 180/3.14159 - prevState.rotation)/4, // Easing!
                left: (xDiff >= 0 ? Math.min(prevState.left + maxAdvanceX, props.targetLeft) : Math.max(prevState.left + maxAdvanceX, props.targetLeft)),
                top: (yDiff >= 0 ? Math.min(prevState.top + maxAdvanceY, props.targetTop) : Math.max(prevState.top + maxAdvanceY, props.targetTop)),
                // top: Math.min(prevState.top + maxAdvanceY, props.targetTop)
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
