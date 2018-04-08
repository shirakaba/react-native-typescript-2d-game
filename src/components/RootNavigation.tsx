import React, {Component} from 'react';
import {NavigationContainer, StackNavigator, StackNavigatorConfig} from 'react-navigation';

import {DimensionsState} from "../../App";
import {GameLoop} from "./GameLoop";
import {Landing} from "./Landing";

type RootNavigatorProps = Props & DimensionsState;

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
                Landing: {
                    screen: Landing,
                },
            },
            {
                headerMode: "none", // To remove the UINavigationBar altogether. Alternatively: "float"|"screen"
                cardStyle: {
                    // The background colour that the navigator should show if its given screen has any transparency.
                    backgroundColor: "#DDDDDD"
                },
                initialRouteName: "Landing",

                /* This doesn't seem to affect anything... Maybe is just a callback invoked upon any changes?
                 * Unsure what initialRouteParams is for. I am resigned to pass props via screenProps instead.
                 * Thanks to: https://github.com/react-navigation/react-navigation/issues/876#issuecomment-302945124
                 **/
                // navigationOptions:
                //     ({ navigation, navigationOptions, screenProps }) => {
                //         return {
                //             headerTitleStyle: {
                //                 fontWeight: 'normal',
                //             },
                //             headerMode: "none",
                //             initialRouteName: "Play",
                //             initialRouteParams: {
                //                 ...this.props
                //             }
                //         };
                //     },
            }
        );

    }

    render() {
        return <this.RootStackNavigator screenProps={this.props} />;
    }
}