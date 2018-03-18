import React from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Box} from "./src/Box";
import {Battlefield} from "./src/GameLoop";

export default class App extends React.Component {

    onResponderMove(ev: GestureResponderEvent): void {

    }

    render() {
        return (
            <Battlefield/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        backgroundColor: 'orange',
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    fullscreen: {
    }
});
