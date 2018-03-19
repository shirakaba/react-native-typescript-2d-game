import React, {Component} from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import { Loop, Stage } from 'react-game-kit/native';
import {Box} from "./Box";
import PropTypes from 'prop-types';

interface Props {
}

type BattlefieldState = BoxPositionStates & CollisionState;

interface CollisionState {
    colliding: boolean
}

interface BoxPositionState extends BoxTargetState {
    rotation: number
}

interface BoxTargetState {
    left: number,
    top: number
}

interface BoxPositionStates {
    redBoxPosition: BoxPositionState,
    redBoxTarget: BoxTargetState,
    blueBoxPosition: BoxPositionState
    blueBoxTarget: BoxTargetState
}

export class Battlefield extends Component<Props, BattlefieldState> {
    private blueBoxSize: number = 50;
    private redBoxSize: number = 200;
    // private blueBoxHalfSize: number = this.blueBoxSize / 2;
    // private redBoxHalfSize: number = this.redBoxSize / 2;
    private blueBoxHalfSize: number = 0;
    private redBoxHalfSize: number = 0;

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);
        const redInitialLeft: number = 90;
        const redInitialTop: number = 75;
        const blueInitialLeft: number = 200;
        const blueInitialTop: number = 400;

        this.state = {
            colliding: false,
            redBoxPosition: {
                left: redInitialLeft,
                top: redInitialTop,
                rotation: 0
            },
            redBoxTarget: {
                left: redInitialLeft,
                top: redInitialTop
            },
            blueBoxPosition: {
                left: blueInitialLeft,
                top: blueInitialTop,
                rotation: 0
            },
            blueBoxTarget: {
                left: blueInitialLeft,
                top: blueInitialTop
            }
        };

        this.update = this.update.bind(this);
    }

    // instead of loop()
    update() {
        if(this.checkCollisions(this.state.blueBoxPosition, this.state.redBoxPosition)){
            if(!this.state.colliding){
                this.setState({
                    colliding: true
                });
            }
        } else {
            if(this.state.colliding){
                this.setState({
                    colliding: false
                });
            }
        }
    };

    checkCollisions(blue: BoxPositionState, red: BoxPositionState): boolean {
        const blueRight: number = blue.left + this.blueBoxSize;
        const blueBottom: number = blue.top + this.blueBoxSize;
        const redRight: number = red.left + this.redBoxSize;
        const redBottom: number = red.top + this.redBoxSize;
        if(
            blueRight > red.left && blueRight < redRight || // blue's right edge is in bounds
            blue.left > red.left && blue.left < redRight // blue's right edge is in bounds
        ){
            if(
                blue.top > red.top && blue.top < redBottom || // blue's top edge is in bounds
                blueBottom < redBottom && blueBottom > red.top // blue's bottom edge is in bounds
            ){
                return true;
            }
        }
        return false;
    }

    componentDidMount(): void {
        this.context.loop.subscribe(this.update);
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update);
    }

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
