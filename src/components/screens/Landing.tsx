// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, {Component} from 'react';
import { Loop, Stage } from 'react-game-kit/native';
import {Button, StyleSheet, Text, View} from "react-native";
import {StyleObject} from "../../utils/utils";
import {NavigationNavigatorProps} from "react-navigation";
import {NavigationNavigatorPropsNarrowed, ScreenProps} from "./RootNavigation";

const pkg: { version: string } = require('../../../package.json');

type LandingProps = Props & NavigationNavigatorPropsNarrowed;
// type LandingProps = Props & ScreenProps;

interface Props {
}

interface State {
}
export class Landing extends Component<LandingProps, State> {
    constructor(props: LandingProps) {
        super(props);

    }

    componentDidMount(): void {
        this.props.screenProps.onStatusBarVisibilityChange(true);
    }

    render() {
        return (
            <View
                style={[styles.mainView]}
            >
                <Text style={styles.title}>The Box</Text>
                <Button
                    onPress={() => (this.props.navigation as any).navigate('Play')}
                    title={"PLAY"}
                    accessibilityLabel="Play"
                />
                <Text>{`Version ${pkg.version}`}</Text>
            </View>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    mainView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 32
    }
});