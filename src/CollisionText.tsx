// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, {PureComponent} from 'react';
import { StyleSheet, Text } from 'react-native';
import {ComponentStyle, StyleObject } from "./utils";

interface Props {
    colliding: boolean
}

export class CollisionText extends PureComponent<Props, {}> {
    render() {
        const dynamicCollisionIndicatorStyle: Partial<ComponentStyle> = {
            color: this.props.colliding ? "red" : "green"
        };

        return (
            <Text style={[styles.collisionIndicator, dynamicCollisionIndicatorStyle]}>{this.props.colliding ? "COLLIDING!" : "SAFE!"}</Text>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    collisionIndicator: {
        position: 'absolute',
        left: 50,
        top: 50,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: "rgba(255, 255, 0, 1)"
    }
});
