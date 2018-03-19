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
    top: number,
    rotation?: number
}

interface BoxPositionStates {
    redBoxPosition: BoxPositionState,
    redBoxTarget: BoxPositionState,
    blueBoxPosition: BoxPositionState
    blueBoxTarget: BoxPositionState
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
            redBoxTarget: {
                left: 90,
                top: 75
            },
            blueBoxPosition: {
                left: 200,
                top: 400
            },
            blueBoxTarget: {
                left: 200,
                top: 400
            }
        };

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

    onPositionUpdate(id: string, left: number, top: number, rotation: number): void {
        switch(id){
            case "red":
                this.setState({
                    redBoxPosition: {
                        left,
                        top,
                        rotation
                    }
                });
                break;
            case "blue":
                this.setState({
                    blueBoxPosition: {
                        left,
                        top,
                        rotation
                    }
                });
                break;
            default:
                break;
        }
    }

    // shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<BattlefieldState>, nextContext: any): boolean {
    //     // console.log(`this.state.redBoxPosition is ${JSON.stringify(this.state.redBoxPosition, null,3)}\n nextState.redBoxPosition is ${JSON.stringify(nextState.redBoxPosition, null, 3)}`);
    //     if(this.state.redBoxPosition === nextState.redBoxPosition && this.state.blueBoxPosition === nextState.blueBoxPosition){
    //         if(this.props === nextProps){
    //             console.log("both positions shallow-equal, as do the nextProps!");
    //         }
    //     } else {
    //         console.log("Both positions don't shallow-equal!");
    //     }
    //     return true;
    // }

    moveRedBox(left: number, top: number): void {
        this.setState({
            redBoxTarget: {
                left: left - this.redBoxHalfSize,
                top: top - this.redBoxHalfSize
            }
        });
    }

    moveBlueBox(left: number, top: number): void {
        // console.log(`moveBlueBox()...`);
        this.setState({
            blueBoxTarget: {
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
                    id={"red"}
                    speed={5}
                    size={this.redBoxSize}
                    colour={"red"}
                    targetLeft={this.state.redBoxTarget.left}
                    targetTop={this.state.redBoxTarget.top}
                    onPositionUpdate={this.onPositionUpdate.bind(this)}
                />
                <Box
                    id={"blue"}
                    speed={10}
                    size={this.blueBoxSize}
                    colour={"blue"}
                    targetLeft={this.state.blueBoxTarget.left}
                    targetTop={this.state.blueBoxTarget.top}
                    onPositionUpdate={this.onPositionUpdate.bind(this)}
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
