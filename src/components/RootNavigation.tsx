import React, {Component} from 'react';
import {NavigationContainer, StackNavigator, StackNavigatorConfig} from 'react-navigation';

import {DimensionsState} from "../../App";
import {GameLoop} from "./GameLoop";

type RootNavigatorProps = Props & DimensionsState;

export interface NavigationScreenProps {
    // The only way that react-navigation can pass props.
    // From: https://github.com/react-navigation/react-navigation/issues/876#issuecomment-302945124
    screenProps: DimensionsState;
}

interface Props {
}

interface State {
}

export class RootNavigator extends Component<RootNavigatorProps, State> {
    private readonly RootStackNavigator: NavigationContainer;

    constructor(props: RootNavigatorProps){
        super(props);

        // console.log(props);

        this.RootStackNavigator = StackNavigator(
            {
                Play: {
                    screen: GameLoop,
                },
            },
            /* This doesn't seem to affect anything... */
            // {
            //     navigationOptions:
            //         ({ navigation, navigationOptions, screenProps }) => {
            //             return {
            //                 headerTitleStyle: {
            //                     fontWeight: 'normal',
            //                 },
            //                 initialRouteName: "Play",
            //                 initialRouteParams: {
            //                     ...this.props
            //                 }
            //             };
            //         },
            // }
        );

    }

    componentWillMount(): void {
        console.log("componentWillMount(). props:", this.props);
    }
    componentDidMount(): void {
        console.log("componentDidMount");
    }

    render() {
        return <this.RootStackNavigator screenProps={this.props} />;
    }
}