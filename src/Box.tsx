import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';

interface Props {
    size: number,
    colour: string,
    left: number,
    top: number
    // onTouchEvent: (left: number, top: number) => void
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

interface State {
    speed: number,
    size: number,
    rotation: number
    // left: number,
    // top: number
}

export class Box extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            speed: 1,
            size: this.props.size,
            rotation: 0
            // left: this.props.left,
            // top: this.props.top
        };
    }

    // onTouchEvent(left: number, top: number): void {
    //     this.setState({
    //         left: left,
    //         top: top
    //     });
    // }

    render() {
        const combinedStyles: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            left: this.props.left,
            top: this.props.top,
            width: this.state.size,
            height: this.state.size,
            transform: [
                { rotate: `${this.state.rotation}deg` }
            ]
        };

        return (
            <View
                onStartShouldSetResponder={(ev: GestureResponderEvent) => false}
                onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
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
