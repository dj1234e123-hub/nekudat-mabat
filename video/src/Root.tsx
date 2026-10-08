import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import timeline from './timeline.json';
export const Root: React.FC = () => (
  <Composition id="story" component={Video} width={1080} height={1920}
    fps={30} durationInFrames={timeline.total} />
);
