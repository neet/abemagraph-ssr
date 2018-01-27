import * as React from 'react';
import { Program } from '../../types/abema';
import { PROGRAM_IMAGE_ENDPOINT } from '../constant/endpoint';

export const EpisodeItem = ({ program }: { program: Program }) => (
    <div className='episode'>
        <img src={`${PROGRAM_IMAGE_ENDPOINT}${program.id}/${program.providedInfo.thumbImg}.w280.png`} />
        <div className='episode-body'>
            <h4>{(program.episode.name || program.episode.title) ?
                [program.episode.name, program.episode.title].join(' ') : `${program.episode.sequence}話`}</h4>
            <span>{(program.episode.content ? program.episode.content :
                (program.episode.name || program.episode.title) ? <small>参考情報: {program.episode.sequence}話</small> :
                    <small>ID: {program.id}</small>)}</span>
        </div>
    </div>
)