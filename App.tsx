import React from 'react';
import {GameLoop} from "./src/GameLoop";

/**
 * Seems odd just to return one component here, but this class is available for expansion (eg. if you want to route to
 * different screens in future).
 */
export default class App extends React.Component {

    render() {
        return (
            <GameLoop/>
        );
    }
}