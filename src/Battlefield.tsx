import React, { Component } from 'react';
import {View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle} from 'react-native';

interface Props {
    size: number,
    colour: string
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

export class Box extends Component<Props, {}> {
    render() {
        const combinedStyles: Partial<ViewStyle> = {
            // ...styles.boxItself,
            backgroundColor: this.props.colour,
            width: this.props.size,
            height: this.props.size
        };

        return (
            <View
                style={[styles.boxItself, combinedStyles]}
                // style={combinedStyles}
                // style={Object.assign({}, styles.boxItself, combinedStyles)}
                // style={{
                //     // ...styles.boxItself,
                //     width: this.props.size,
                //     height: this.props.size,
                // }}
                // width={this.props.width}
            />
        );
    }
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;
export interface StyleObject {
    // [key: string]: Partial<CSSStyleDeclaration>;
    [key: string]: Partial<ComponentStyle>;
}
export interface BattlefieldStyleObject extends StyleObject {
    boxItself: Partial<ViewStyle>;
}

// export type CreatedStyleSheet<P, T> = { [P in keyof T]: RegisteredStyle<T[P]> }
// export type CreatedStyleSheet<T extends NamedStyles<T>> = { [P in keyof T]: RegisteredStyle<T[P]> }
// export type CreatedStyleSheet<T extends NamedStyles<T>> = { [P in keyof T]: RegisteredStyle<T[P]> }

// const styles: CreatedStyleSheet<StyleObject> = StyleSheet.create<StyleObject>({
const styles: StyleObject = StyleSheet.create<StyleObject>({
    boxItself: {
        // backgroundColor: "red",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
    },

});

console.log(styles);
console.log(styles.boxItself);
console.log(typeof styles);

