import React, { Component } from 'react';
import {
    View, StyleSheet, Text, ViewStyle, TextStyle, ImageStyle, RegisteredStyle,
    GestureResponderEvent
} from 'react-native';
import PropTypes from 'prop-types';

interface Props {
    speed: number,
    size: number,
    colour: string,
    targetLeft: number,
    targetTop: number
    // onTouchEvent: (targetLeft: number, targetTop: number) => void
    // count: number,
    // increment: () => any,
    // decrement: () => any
}

interface State {
    speed: number,
    size: number,
    rotation: number,
    hasDefinitelyArrived: boolean,
    left: number,
    top: number
    // targetLeft: number,
    // targetTop: number
}

export const radToDeg: number = 180/Math.PI;

export class Box extends Component<Props, State> {
    // static propTypes = {
    //     radToDeg: 180/Math.PI // must be a function
    //     // keys: PropTypes.object,
    //     // onEnterBuilding: PropTypes.func,
    //     // store: PropTypes.object,
    // };

    static contextTypes = {
        loop: PropTypes.object,
    };

    constructor(props: Props) {
        super(props);
        // console.log("RECONSTRUCTED");

        this.state = {
            speed: this.props.speed,
            size: this.props.size,
            rotation: 0,
            hasDefinitelyArrived: true,
            left: this.props.targetLeft,
            top: this.props.targetTop
        };

        this.advance = this.advance.bind(this);
        this.hasArrivedAtCoord = this.hasArrivedAtCoord.bind(this);
        this.hasArrived = this.hasArrived.bind(this);
        this.update = this.update.bind(this); // ABSOLUTELY necessary - update() is getting called from somewhere invisible.
    }

    hasArrivedAtCoord(target: number, current: number): boolean {
        return Math.abs(target - current) < 0.00001;
    }

    hasArrived(): boolean {
        return this.hasArrivedAtCoord(this.props.targetLeft, this.state.left) && this.hasArrivedAtCoord(this.props.targetTop, this.state.top);
    }

    componentWillReceiveProps(nextProps: Props): void {
        this.setState({
            hasDefinitelyArrived: this.hasArrivedAtCoord(nextProps.targetTop, this.state.top) && this.hasArrivedAtCoord(nextProps.targetLeft, this.state.left)
        });
    }

    // instead of loop()
    update() {
        if(this.state.hasDefinitelyArrived){
            return;
        } else {
            this.advance();
        }
        // console.log("this.state", this.state);
        // console.log("BOX UPDATE");
        // if(!this.hasArrived()){
        // }
    };

    componentDidMount(): void {
        this.context.loop.subscribe(this.update); // Not actually a promise!
        // if(this.props.colour !== "red") {
        // }
    }

    componentWillUnmount(): void {
        this.context.loop.unsubscribe(this.update); // Not actually a promise!
    }

    advance(): void {
        // if(this.hasArrived()) return;

        // console.log(`[advance()] targetLeft: ${this.props.targetLeft.toFixed(1)}; targetTop: ${this.props.targetTop.toFixed(1)}; left: ${this.state.left.toFixed(1)}; top: ${this.state.top.toFixed(1)}`);
        const xDiff: number = this.props.targetLeft - this.state.left;
        const yDiff: number = this.props.targetTop - this.state.top;

        const angle: number = Math.atan2(yDiff, xDiff);
        const maxAdvanceX: number = Math.cos(angle) * this.state.speed;
        const maxAdvanceY: number = Math.sin(angle) * this.state.speed;
        // console.log(`[advance()] angle: ${(angle * (180/3.14159)).toFixed(2)}º; maxAdvanceY: ${maxAdvanceX.toFixed(0)}; maxAdvanceX ${maxAdvanceX.toFixed(0)}`);

        this.setState((prevState: Readonly<State>, props: Props) => {
            const left: number = (xDiff >= 0 ? Math.min(prevState.left + maxAdvanceX, props.targetLeft) : Math.max(prevState.left + maxAdvanceX, props.targetLeft));
            const top: number = (yDiff >= 0 ? Math.min(prevState.top + maxAdvanceY, props.targetTop) : Math.max(prevState.top + maxAdvanceY, props.targetTop));
            return {
                rotation: prevState.rotation + (angle * radToDeg - prevState.rotation)/4, // Easing!
                left: left,
                top: top,
                hasDefinitelyArrived: this.hasArrivedAtCoord(props.targetLeft, left) && this.hasArrivedAtCoord(props.targetTop, top)
            }
        });
    }

    render() {
        const combinedStyles: Partial<ComponentStyle> = {
            backgroundColor: this.props.colour,
            // left: this.props.targetLeft,
            // top: this.props.targetTop,
            // left: this.state.left,
            // top: this.state.top,
            width: this.state.size,
            height: this.state.size,
            transform: [
                { translateX: this.state.left },
                { translateY: this.state.top },
                { rotate: `${this.state.rotation}deg` }
            ]
        };

        return (
            <View
                // onStartShouldSetResponder={(ev: GestureResponderEvent) => false}
                // onMoveShouldSetResponder={(ev: GestureResponderEvent) => false}
                style={[styles.boxItself, combinedStyles]}
            />
        );
    }
}

export type ComponentStyle = ViewStyle|ImageStyle|TextStyle;
export interface StyleObject {
    [key: string]: Partial<ComponentStyle>;
}
export interface BoxStyleObject extends StyleObject {
    boxItself: Partial<ViewStyle>;
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    boxItself: {
        // backgroundColor: "red",
        borderColor: "black",
        borderStyle: "solid",
        borderWidth: 1,
        position: "absolute"
    }
});
