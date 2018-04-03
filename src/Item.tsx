// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, { Component } from 'react';
import {
    View, StyleSheet
} from 'react-native';
import {ComponentStyle, hasArrivedAtCoord, StyleObject} from "./utils";

interface Props {
    id: string,
    left: number,
    top: number
}

interface State {
    consumed: boolean
}

export class Item extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            consumed: false
        };
    }

    componentDidMount(): void {
    }

    componentWillUnmount(): void {
    }

    /** Very likely that my naive implementation has room for improvement here. Open to comments. */
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(nextProps === this.props) return false;
        if(nextProps.top === this.props.top && nextProps.left === this.props.left) return false;
        return true;
    }

    /**
     * As an easy proof-of-concept, each Item is rendered as a View component, but it is likely much more efficient to
     * render them with Canvas or some other dedicated graphics feature to reduce their overhead!
     */
    render() {
        const dynamicStyle: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            width: this.props.size,
            height: this.props.size,
            transform: [
                { translateX: this.props.left },
                { translateY: this.props.top }
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
