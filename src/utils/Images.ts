// Copyright © 2018 Jamie Birch
// Licensed under GPL; find at repo root, in LICENSE.txt.

import {Image, ImageRequireSource} from 'react-native';
import {Asset, RequireSource} from 'expo';

export interface ImageObj {
    source: ImageRequireSource
}

export interface ImageObjs {
    [key: string]: ImageObj;
}

export function cacheImages(images: (RequireSource|string)[]): Promise<void> {
    return Promise.all(
        images.map(image => {
            if (typeof image === 'string') {
                return Image.prefetch(image);
            } else {
                return Asset.fromModule(image).downloadAsync();
            }
        })
    )
    .then((val: void[]) => {
        console.log("All images loaded into imageObjs!")
    })
}