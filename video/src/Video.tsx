import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion';
import timeline from './timeline.json';

const C = {
  paper: '#fbf7ee', ink: '#2e2a24', muted: '#75695a', blue: '#003b5c',
  red: '#b0463b', gold: '#c9a24d', teal: '#17453f',
};

const fonts = `
@font-face{font-family:Frank;src:url(${staticFile('frank.ttf')});font-weight:400}
@font-face{font-family:Frank;src:url(${staticFile('frank-bold.ttf')});font-weight:700}
@font-face{font-family:Heebo;src:url(${staticFile('heebo.ttf')});font-weight:400}
@font-face{font-family:Heebo;src:url(${staticFile('heebo-bold.ttf')});font-weight:700}`;

type Scene = { id: string; kind: string; text: string; from: number; dur: number; audio?: string };

// A line renders by its prefix: "##" the name (big, blue), "!!" the turn (red),
// "**...**" an emphasised line (bold, blue). Lines enter one after another.
const Lines: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines = text.split('\n');
  const step = Math.min(18, Math.floor((dur * 0.55) / lines.length));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      {lines.map((raw, i) => {
        const p = spring({ frame: frame - i * step, fps, config: { damping: 200 } });
        let line = raw, style: React.CSSProperties = { fontSize: 66, color: C.ink, fontWeight: 400 };
        if (raw.startsWith('##')) { line = raw.slice(2); style = { fontSize: 128, color: C.blue, fontWeight: 700 }; }
        else if (raw.startsWith('!!')) { line = raw.slice(2); style = { fontSize: 92, color: C.red, fontWeight: 700 }; }
        else if (raw.startsWith('**')) { line = raw.replace(/\*\*/g, ''); style = { fontSize: 72, color: C.blue, fontWeight: 700 }; }
        return (
          <div key={i} style={{
            ...style, fontFamily: 'Frank', lineHeight: 1.25, textAlign: 'center',
            opacity: p, transform: `translateY(${(1 - p) * 24}px)`,
          }}>{line}</div>
        );
      })}
    </div>
  );
};

const fadeInOut = (frame: number, dur: number) =>
  interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const GoldDot = () => (
  <div style={{ width: 18, height: 18, borderRadius: 9, background: C.gold }} />
);

// Upper image with a slow push-in; the paper panel below carries the words.
const ImageScene: React.FC<{ s: Scene; src: string; pos: string; startZoom: number }> = ({ s, src, pos, startZoom }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, s.dur], [startZoom, startZoom + 0.06]);
  return (
    <AbsoluteFill style={{ background: C.paper, opacity: fadeInOut(frame, s.dur) }}>
      <div style={{ height: 1000, overflow: 'hidden', position: 'relative' }}>
        <Img src={staticFile(src)} style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos,
          transform: `scale(${zoom})`,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 70%, ${C.paper})` }} />
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 70px 120px' }}>
        <Lines text={s.text} dur={s.dur} />
      </div>
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  const frame = useCurrentFrame();
  if (s.kind === 'door') return <ImageScene s={s} src="lama-korim-li-efraim.png" pos="50% 50%" startZoom={1.15} />;
  if (s.kind === 'photo') return <ImageScene s={s} src="chacham-efraim-hacohen.png" pos="50% 25%" startZoom={1.0} />;
  if (s.kind === 'name') {
    // The name is heard in a dark room: the panel stays paper, the door goes dim.
    return (
      <AbsoluteFill style={{ background: C.paper, opacity: fadeInOut(frame, s.dur),
        alignItems: 'center', justifyContent: 'center', padding: 70 }}>
        <Lines text={s.text} dur={s.dur} />
      </AbsoluteFill>
    );
  }
  if (s.kind === 'title') {
    const p = spring({ frame, fps: 30, config: { damping: 200 } });
    return (
      <AbsoluteFill style={{ background: C.paper, alignItems: 'center', justifyContent: 'center',
        gap: 40, opacity: fadeInOut(frame, s.dur) }}>
        <GoldDot />
        <div style={{ fontFamily: 'Frank', fontWeight: 700, fontSize: 96, color: C.blue,
          textAlign: 'center', lineHeight: 1.2, padding: '0 80px', opacity: p }}>{s.text}</div>
        <div style={{ width: 120 * p, height: 3, background: C.gold }} />
      </AbsoluteFill>
    );
  }
  // end card
  return (
    <AbsoluteFill style={{ background: C.paper, alignItems: 'center', justifyContent: 'center',
      gap: 44, opacity: fadeInOut(frame, s.dur + 10) }}>
      <Img src={staticFile('logo.jpg')} style={{ width: 220, height: 220, borderRadius: 110 }} />
      <Lines text={s.text} dur={s.dur} />
      <div style={{ fontFamily: 'Heebo', fontWeight: 700, fontSize: 54, color: C.teal, direction: 'ltr' }}>
        nekudatmabat.blog
      </div>
      <div style={{ fontFamily: 'Heebo', fontSize: 40, color: C.muted, textAlign: 'center', lineHeight: 1.5 }}>
        נקודת מבט · אפרים עטייה
      </div>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, direction: 'rtl' }}>
    <style>{fonts}</style>
    {(timeline.scenes as Scene[]).map((s) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.dur}>
        <SceneView s={s} />
        {s.audio ? <Sequence from={8}><Audio src={staticFile(s.audio)} /></Sequence> : null}
      </Sequence>
    ))}
  </AbsoluteFill>
);
