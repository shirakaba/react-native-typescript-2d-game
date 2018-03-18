import React, {Component} from 'react';
import { Loop, Stage } from 'react-game-kit/native';
import {Battlefield} from "./Battlefield";

interface Props {
}

interface State {
}

export class GameLoop extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Loop>
                <Battlefield/>
            </Loop>
        );
    }
}