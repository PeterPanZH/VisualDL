/**
 * Copyright 2020 Baidu Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {Sample, TagData, Worker} from './types';

const worker: Worker = async io => {
    const components = await io.getData<string[]>('/components');
    if (!components.includes('audio')) {
        return;
    }

    const {runs, tags} = await io.save<TagData>('/audio/tags');
    for (const [index, run] of runs.entries()) {
        for (const tag of tags[index]) {
            const list = (await io.save<Sample[]>('/audio/list', {run, tag})) ?? [];
            for (const [index, audio] of list.entries()) {
                await io.saveBinary('/audio/audio', {run, tag, index, ts: audio.wallTime});
            }
        }
    }
};

export default worker;
