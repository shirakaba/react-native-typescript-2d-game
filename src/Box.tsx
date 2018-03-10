import React, { Component } from 'react';
import {View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle} from 'react-native';

interface Props {
    size: number,
    colour: string,
    initialLeft: number,
    initialTop: number,
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

interface State {
    speed: number,
    size: number,
    left: number,
    top: number
}

export class Box extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            speed: 1,
            size: this.props.size,
            left: this.props.initialLeft,
            top: this.props.initialTop
        };
    }

    render() {
        const combinedStyles: Partial<ViewStyle> = {
            backgroundColor: this.props.colour,
            left: this.props.initialLeft,
            top: this.props.initialTop,
            width: this.props.size,
            height: this.props.size,
            position: "absolute"
        };

        return (
            <View
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
    }
});
