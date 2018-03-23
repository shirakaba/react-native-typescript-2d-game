// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import React, {Component} from 'react';
import { Loop, Stage } from 'react-game-kit/native';
import {Battlefield} from "./Battlefield";

interface Props {
}

interface State {
}

/**
 * Everything descending from GameLoop will inherit the 'loop' object in their context, which can be subscribed to.
 * This is provided by the <Loop> component at the top of the tree.
 */
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