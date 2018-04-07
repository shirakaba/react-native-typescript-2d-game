// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import {Audio, RequireSource, PlaybackSource, PlaybackStatus} from 'expo';

export interface SoundObj {
    source: RequireSource,
    obj?: Audio.Sound
}

export interface SoundObjs {
    [key: string]: SoundObj;
}

export function loadSoundObjects(soundObjs: SoundObjs): Promise<void> {
    return Promise.all(
        Object.keys(soundObjs)
        .map((key: string, i: number, arr: string[]) =>
            loadSound(soundObjs[key].source)
            .then((obj: Audio.Sound) => soundObjs[key].obj = obj)
        )
    )
    .then((val: Audio.Sound[]) => {
        console.log("All sounds loaded into soundObjs!")
    })
}

function loadSound(source: PlaybackSource): Promise<Audio.Sound> {
    return Audio.Sound.create(
        source,
        {
            // All the defaults
            progressUpdateIntervalMillis: 500,
            positionMillis: 0,
            shouldPlay: false,
            rate: 1.0,
            shouldCorrectPitch: false,
            volume: 1.0,
            isMuted: false,
            isLooping: false,
        },
        null,
        // (status: PlaybackStatus) => {
        //     console.log("Status update", status);
        // },
        false // Toggle this to TRUE to download asset before beginning app.
    )
    .then(({ sound, status }) => {
        if(status.isLoaded) return sound;
        else throw new Error("Sound did not load!");
    })
}