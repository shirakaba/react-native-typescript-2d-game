import React, {Component} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import {Box} from "./Box";
import PropTypes from 'prop-types';

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
    private redBoxSize: number = 200;
    private blueBoxHalfSize: number = this.blueBoxSize / 2;
    private redBoxHalfSize: number = this.redBoxSize / 2;
    // private blueBoxHalfSize: number = 0;

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            redBoxPosition: {
                left: 90,
                top: 75
            },
            blueBoxPosition: {
                left: 200,
                top: 400
            }
        };

        // console.log(this.context);
    }

    // instead of loop()
    update() {

    };

    onResponderGrant(ev: GestureResponderEvent): void {
        // console.log(`[onResponderGrant] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
        this.moveRedBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    onResponderMove(ev: GestureResponderEvent): void {
        // console.log(`[onResponderMove] x: ${ev.nativeEvent.locationX}, y: ${ev.nativeEvent.locationY}, target: ${ev.nativeEvent.target}`);
        // this.moveBlueBox(ev.nativeEvent.locationX, ev.nativeEvent.locationY);
        this.moveBlueBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
        this.moveRedBox(ev.nativeEvent.pageX, ev.nativeEvent.pageY);
    }

    moveRedBox(left: number, top: number): void {
        this.setState({
            redBoxPosition: {
                left: left - this.redBoxHalfSize,
                top: top - this.redBoxHalfSize
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
            <Loop>
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
                <Box
                    speed={5}
                    size={this.redBoxSize}
                    colour={"red"}
                    targetLeft={this.state.redBoxPosition.left}
                    targetTop={this.state.redBoxPosition.top}
                />
                <Box
                    speed={10}
                    size={this.blueBoxSize}
                    colour={"blue"}
                    targetLeft={this.state.blueBoxPosition.left}
                    targetTop={this.state.blueBoxPosition.top}
                />
            </View>
        </Loop>
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
