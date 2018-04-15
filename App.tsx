// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React from 'react';
import {GameLoop} from "./src/components/screens/GameLoop";
import {Dimensions, Platform, ScaledSize, StatusBar, StyleSheet, View} from "react-native";
import {loadSoundObjects} from "./src/utils/Sounds";
import {cacheImages} from "./src/utils/Images";
import {AppLoading} from "expo";
import {itemImageObjs, itemSoundObjs} from "./src/components/Item";
import {RootNavigator} from './src/components/screens/RootNavigation';
import {StyleObject} from "./src/utils/utils";

type AppState = State & DimensionsState;
type AppProps = Props & StatusBarProps;

interface Props {}
interface State {
    loaded: boolean;
    statusBarHidden: boolean;
}

export interface StatusBarProps {
    onStatusBarVisibilityChange: (visible: boolean) => void;
}

export interface DimensionsState {
    portrait: boolean;
    windowDimensions: ScaledSize;
    screenDimensions: ScaledSize;
}

interface Dimension {
    window: ScaledSize;
    screen: ScaledSize;
}

/**
 * Seems odd just to return one component here, but this class is available for expansion (eg. if you want to route to
 * different screens in future).
 */
export default class App extends React.Component<Props, AppState> {

    constructor(props: Props) {
        super(props);

        const windowDimensions: ScaledSize = Dimensions.get("window");

        this.state = {
            statusBarHidden: false,
            loaded: false,
            portrait: windowDimensions.height > windowDimensions.width,
            windowDimensions,
            screenDimensions: Dimensions.get("screen")
        };
    }

    /**
      * Any tasks that may have side-effects (e.g. setState()) are recommended to be done here rather than in constructor:
      * https://stackoverflow.com/a/40832293/5951226
      */
    componentDidMount(): void {
        Dimensions.addEventListener(
            "change",
            ({ window, screen }: Dimension) => {
                this.setState({
                    portrait: window.height > window.width,
                    windowDimensions: window,
                    screenDimensions: screen,
                });
            }
        );
    }

    private loadAssets(): Promise<void | [void, void, {}]> {
        return Promise.all([
            loadSoundObjects(itemSoundObjs),
            cacheImages(Object.keys(itemImageObjs).map((key: string) => itemImageObjs[key].source)),
            // new Promise((resolve, reject) => {
            //     console.log("Delaying chain to inspect loading screen...");
            //     window.setTimeout(() => resolve(), 10000);
            // })
        ])
        .then(() => {
            console.log("All assets loaded successfully!");
        })
    }

    render() {
        if (!this.state.loaded) {
            return (
                <AppLoading
                    startAsync={this.loadAssets.bind(this)}
                    onFinish={() => this.setState({ loaded: true })}
                    onError={console.warn}
                />
            );
        }

        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle="default" hidden={this.state.statusBarHidden} />}
                <RootNavigator
                    portrait={this.state.portrait}
                    screenDimensions={this.state.screenDimensions}
                    windowDimensions={this.state.windowDimensions}
                    onStatusBarVisibilityChange={(visible: boolean) => this.setState({ statusBarHidden: !visible })}
                />
            </View>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
});