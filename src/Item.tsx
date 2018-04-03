// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, { Component } from 'react';
import {
    View, StyleSheet
} from 'react-native';
import {ComponentStyle, getRandomInt, StyleObject, Zone} from "./utils";

export enum ItemType {
    Speed,
    Shrink,
    Teleport,
    Mine,
}

interface Props {
    id: number,
    type: ItemType,
    left: number,
    top: number
}

interface State {
    consumed: boolean
}

// TODO: Figure out how to rewrite as class static.
export const itemSize: number = 10;

export class Item extends Component<Props, State> {
    // TODO: Find out why static values don't work in a React component. May be due to PropTypes.
    // private static size: number = 10;
    private readonly colour: string;

    constructor(props: Props) {
        super(props);

        this.colour = Item.mapItemTypeToColour(props.type);

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
        // Visual props
        // if(nextProps === this.props) return false;
        if(this.props.left !== nextProps.left) return true;
        if(this.props.top !== nextProps.top) return true;

        // Visual state
        if(this.state.consumed !== nextState.consumed) return true;

        return false;
    }

    static mapItemTypeToColour(type: ItemType): string {
        switch(type){
            case ItemType.Speed:
                return "yellow";
            case ItemType.Shrink:
                return "white";
            case ItemType.Teleport:
                return "cyan";
            case ItemType.Mine:
                return "gray";
            default:
                return "black";
        }
    }

    /**
     * As an easy proof-of-concept, each Item is rendered as a View component, but it is likely much more efficient to
     * render them with Canvas or some other dedicated graphics feature to reduce their overhead!
     */
    render() {
        const dynamicStyle: Partial<ComponentStyle> = {
            backgroundColor: this.colour,
            width: itemSize,
            height: itemSize,
            transform: [
                { translateX: this.props.left },
                { translateY: this.props.top }
            ],
            display: this.state.consumed ? "none" : "flex"
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
