// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React from 'react';
import {GameLoop} from "./src/GameLoop";
import {Dimensions, ScaledSize} from "react-native";

type AppState = State & DimensionsState;

interface Props {}
interface State {}

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

    render() {
        return (
            <GameLoop portrait={this.state.portrait} screenDimensions={this.state.screenDimensions} windowDimensions={this.state.windowDimensions}/>
        );
    }
}