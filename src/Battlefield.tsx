import React, {Component} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Box} from "./Box";

interface Props {
}

type BattlefieldState = BoxPositionStates;

interface BoxPositionState {
    left: number,
    top: number
}

interface BoxPositionStates {
    redBoxPosition: BoxPositionState,
    blueBoxPosition: BoxPositionState
}

export class Battlefield extends Component<Props, BattlefieldState> {
    private blueBoxSize: number = 50;
    private blueBoxHalfSize: number = this.blueBoxSize / 2;
    // private blueBoxHalfSize: number = 0;

    constructor(props: Props) {
        super(props);

        this.state = {
            redBoxPosition: {
                left: 90,
                top: 75
            },
            blueBoxPosition: {
                left: 50,
                top: 50
            }
        };
    }

    // DO NOT log the whole ev.nativeEvent because it has a circular ref in the changedTouches property.
    // Interface: https://facebook.github.io/react-native/docs/gesture-responder-system.html
    // 22:52:46: onResponderRelease(): Object {
    // 22:52:46:   "changedTouches": Array [
    // 22:52:46:     [Circular],
    // 22:52:46:   ],
    // 22:52:46:   "force": 0,
    // 22:52:46:   "identifier": 1,
    // 22:52:46:   "locationX": 176,
    // 22:52:46:   "locationY": 439.3333282470703,
    // 22:52:46:   "pageX": 176,
    // 22:52:46:   "pageY": 439.3333282470703,
    // 22:52:46:   "target": 4,
    // 22:52:46:   "timestamp": 29493094.725702003,
    // 22:52:46:   "touches": Array [],
    // 22:52:46: }

    onResponderGrant(ev: GestureResponderEvent): void {
        // console.log(`[onResponderGrant] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    onResponderMove(ev: GestureResponderEvent): void {
        // console.log(`[${name}] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        // this.moveBlueBox(ev.nativeEvent.locationX, ev.nativeEvent.locationY);
        this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    moveRedBox(left: number, top: number): void {
        this.setState({
            redBoxPosition: {
                left: left,
                top: top
            }
        });
    }

    moveBlueBox(left: number, top: number): void {
        // console.log(`moveBlueBox()...`);
        this.setState({
            blueBoxPosition: {
                left: left - this.blueBoxHalfSize,
                top: top - this.blueBoxHalfSize
            }
        });
    }

    render() {
        return (
            <View
                style={styles.container}
                onStartShouldSetResponder={(ev: GestureResponderEvent) => true}
                // onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
                onResponderGrant={this.onResponderGrant.bind(this)}
                // onResponderGrant={(ev: GestureResponderEvent) => { console.log(`onResponderGrant():`, ev.nativeEvent); }}
                // onResponderReject={(ev: GestureResponderEvent) => { console.log(`onResponderReject():`, ev.nativeEvent); }}
                onResponderMove={this.onResponderMove.bind(this)}
                // onResponderRelease={(ev: GestureResponderEvent) => { console.log(`onResponderRelease():`, ev.nativeEvent); }}
                // onResponderTerminationRequest={(ev: GestureResponderEvent) => true}
                // onResponderTerminate={(ev: GestureResponderEvent) => { console.log(`onResponderTerminate():`, ev.nativeEvent); }}
            >
                <Box size={200} colour={"red"} targetLeft={this.state.redBoxPosition.left} targetTop={this.state.redBoxPosition.top}/>
                <Box size={this.blueBoxSize} colour={"blue"} targetLeft={this.state.blueBoxPosition.left} targetTop={this.state.blueBoxPosition.top}/>
            </View>
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
