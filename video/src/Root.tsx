import React from 'react';
import { Composition } from 'remotion';
import { Video } from './Video';
import { Promo, PROMO_FRAMES } from './Promo';
import timeline from './timeline.json';
export const Root: React.FC = () => (
  <>
    <Composition id="story" component={Video} width={1080} height={1920}
      fps={30} durationInFrames={timeline.total} />
    <Composition id="promo" component={Promo} width={1080} height={1920}
      fps={30} durationInFrames={PROMO_FRAMES} defaultProps={{ lang: 'he' as const }} />
    <Composition id="promo-es" component={Promo} width={1080} height={1920}
      fps={30} durationInFrames={PROMO_FRAMES} defaultProps={{ lang: 'es' as const }} />
  </>
);
