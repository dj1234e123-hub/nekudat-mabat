import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import wall from './wall.json';

const C = {
  paper: '#fbf7ee', cream: '#f3e9d3', ink: '#2e2a24', muted: '#75695a', blue: '#003b5c',
  red: '#b0463b', gold: '#c9a24d', goldText: '#8f6f28', teal: '#1f5c57', tealDeep: '#17453f', night: '#0f2f2c',
};

const fonts = `
@font-face{font-family:Frank;src:url(${staticFile('frank.ttf')});font-weight:400}
@font-face{font-family:Frank;src:url(${staticFile('frank-bold.ttf')});font-weight:700}
@font-face{font-family:Heebo;src:url(${staticFile('heebo.ttf')});font-weight:400}
@font-face{font-family:Heebo;src:url(${staticFile('heebo-bold.ttf')});font-weight:700}`;

// Cut points in frames (30fps); the music's low pulses land on the same seconds.
export const CUTS = [0, 105, 225, 330, 465, 615, 780, 930];
export const PROMO_FRAMES = CUTS[CUTS.length - 1];

const ease = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

const Title: React.FC<{ children: React.ReactNode; at?: number; color?: string; size?: number; top?: number }> =
  ({ children, at = 0, color = C.paper, size = 92, top }) => {
    const f = useCurrentFrame();
    const p = spring({ frame: f - at, fps: 30, config: { damping: 200 } });
    return (
      <div style={{
        position: top === undefined ? 'relative' : 'absolute', top, left: 0, right: 0,
        fontFamily: 'Frank', fontWeight: 700, fontSize: size, color, textAlign: 'center',
        lineHeight: 1.2, padding: '0 70px', opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
      }}>{children}</div>
    );
  };

const Sub: React.FC<{ children: React.ReactNode; at?: number; color?: string; top?: number; size?: number }> =
  ({ children, at = 0, color = C.cream, top, size = 46 }) => {
    const f = useCurrentFrame();
    const p = ease(f, at, at + 14);
    return (
      <div style={{
        position: top === undefined ? 'relative' : 'absolute', top, left: 0, right: 0,
        fontFamily: 'Heebo', fontSize: size, color, textAlign: 'center', lineHeight: 1.45,
        padding: '0 90px', opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
      }}>{children}</div>
    );
  };

const Hl: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.gold }) =>
  <span style={{ color }}>{children}</span>;

// A tilted wall of every story cover, drifting slowly.
const Wall: React.FC<{ dim?: number; speed?: number }> = ({ dim = 0.55, speed = 1 }) => {
  const f = useCurrentFrame();
  const cols = 6, size = 330, gap = 22;
  const tiles = Array.from({ length: cols * 9 }, (_, i) => wall[(i * 7) % wall.length]);
  return (
    <AbsoluteFill style={{ background: C.night, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: -560, top: -700, width: cols * (size + gap),
        display: 'flex', flexWrap: 'wrap', gap,
        transform: `rotate(-14deg) translate(${f * 0.9 * speed}px, ${f * -1.6 * speed}px)`,
      }}>
        {tiles.map((src, i) => (
          <Img key={i} src={staticFile(src)} style={{
            width: size, height: size, objectFit: 'cover', borderRadius: 26,
            transform: `translateY(${(i % cols) % 2 ? 60 : 0}px)`,
          }} />
        ))}
      </div>
      <AbsoluteFill style={{ background: `rgba(15,47,44,${dim})` }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${ease(f, 0, 96, 1.25, 1.05)})` }}>
        <Wall dim={ease(f, 20, 70, 0.15, 0.6)} speed={1.4} />
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', gap: 30 }}>
        <Title at={18} size={150}>סיפור אחד</Title>
        <Title at={40} size={84} color={C.cream}>יכול לשנות לך את <Hl>היום.</Hl></Title>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const S2: React.FC = () => (
  <AbsoluteFill style={{ background: C.red, justifyContent: 'center', gap: 50 }}>
    <Title at={4} size={100}>לא עוד הרצאה.</Title>
    <Title at={24} size={100}>לא עוד עצה.</Title>
    <div style={{ height: 30 }} />
    <Title at={52} size={84} color={C.cream}>רק סיפור.<br />ואתה מבין לבד.</Title>
  </AbsoluteFill>
);

// The brand mark: a paper circle opens, the gold point lands in its centre.
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const r = ease(f, 0, 30, 0, 330);
  const dot = spring({ frame: f - 26, fps: 30, config: { damping: 12, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ background: C.tealDeep, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: r * 2, height: r * 2, borderRadius: '50%', background: C.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 34 * dot, height: 34 * dot, borderRadius: '50%', background: C.gold }} />
      </div>
      <Title at={40} size={74} top={1340}>לא אומרים לך מה לחשוב.</Title>
      <Title at={58} size={86} color={C.gold} top={1450}>נותנים לך לראות.</Title>
    </AbsoluteFill>
  );
};

const worlds = [
  { img: 'gate-stories-red.jpg', label: 'משלים', color: C.red, x: -230, y: -330, rot: -7 },
  { img: 'gate-stories-teal.jpg', label: 'סיפורי צדיקים', color: C.teal, x: 230, y: -170, rot: 6 },
  { img: 'gate-stories-blue.jpg', label: 'מהיומן שלי', color: C.blue, x: -210, y: 170, rot: 5 },
  { img: 'gate-stories-gold.jpg', label: 'מהחיים', color: C.goldText, x: 220, y: 340, rot: -6 },
];

const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Wall dim={0.82} speed={0.5} />
      <Title at={2} size={84} top={170}>סיפורים שנשארים איתך.</Title>
      <Sub at={14} top={290}>אמיתיים, קצרים, וכל אחד נקרא בכמה דקות.</Sub>
      {worlds.map((w, i) => {
        const p = spring({ frame: f - 14 - i * 9, fps: 30, config: { damping: 15, stiffness: 110 } });
        return (
          <div key={w.label} style={{
            position: 'absolute', left: 540 - 200 - w.x, top: 1010 - 150 + w.y, width: 400,
            transform: `translateY(${(1 - p) * 500}px) rotate(${w.rot * p}deg)`, opacity: p,
          }}>
            <div style={{ background: C.paper, padding: 14, borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.35)' }}>
              <Img src={staticFile(w.img)} style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <div style={{ position: 'absolute', bottom: -24, insetInlineStart: 30, background: w.color, color: C.paper,
              fontFamily: 'Frank', fontWeight: 700, fontSize: 40, padding: '8px 26px', borderRadius: 40 }}>{w.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// The real site, scrolling inside a phone.
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const enter = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const screenW = 560, screenH = 1140;
  const shotH = (12492 / 780) * screenW;
  const scroll = interpolate(f, [24, 140], [0, -(shotH * 0.42)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Wall dim={0.85} speed={0.4} />
      <Title at={4} size={80} top={130}>
        <span style={{ color: C.gold }}>38</span> סיפורים.<br />
        <span style={{ color: C.gold }}>יותר ממאה</span> רגעים.
      </Title>
      <Sub at={18} top={1745}>חינם. בלי פרסומות. בלי רעש.</Sub>
      <div style={{
        position: 'absolute', left: (1080 - screenW - 36) / 2, top: 520,
        transform: `translateY(${(1 - enter) * 900}px)`,
        width: screenW + 36, height: screenH + 36, borderRadius: 70, background: '#111', padding: 18,
        boxShadow: '0 40px 90px rgba(0,0,0,.5)',
      }}>
        <div style={{ width: screenW, height: screenH, borderRadius: 54, overflow: 'hidden', position: 'relative', background: C.paper }}>
          <Img src={staticFile('site-stories.png')} style={{ width: screenW, position: 'absolute', top: scroll }} />
          <div style={{ position: 'absolute', top: 16, left: screenW / 2 - 80, width: 160, height: 38, borderRadius: 20, background: '#111' }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const gates = [
  { img: 'gate-hurting.jpg', label: 'כשכואב' },
  { img: 'gate-self.jpg', label: 'כשקשה מול עצמך' },
  { img: 'gate-stuck.jpg', label: 'כשקשה להתקדם' },
  { img: 'gate-beginning.jpg', label: 'כשמשהו נפתח' },
  { img: 'gate-upward.jpg', label: 'כשמרימים את המבט' },
];

// The five gates; the eye moves from one to the next, as a reader choosing.
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const chosen = Math.min(4, Math.floor(Math.max(0, f - 30) / 16));
  const pos = [[-260, 0], [0, 0], [260, 0], [-130, 420], [130, 420]];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title at={0} size={88} color={C.blue} top={170}>מה עובר עליך עכשיו?</Title>
      <Sub at={12} top={300} color={C.muted}>לא מחפשים. בוחרים לפי מה שמרגישים.</Sub>
      {gates.map((g, i) => {
        const p = spring({ frame: f - 6 - i * 4, fps: 30, config: { damping: 200 } });
        const on = i === chosen;
        const lit = f > 30 && on;
        return (
          <div key={g.label} style={{
            position: 'absolute', left: 540 - 115 - pos[i][0], top: 520 + pos[i][1], width: 230,
            opacity: p * (lit || f <= 30 ? 1 : 0.45), transform: `scale(${lit ? 1.08 : 1})`,
            textAlign: 'center',
          }}>
            <div style={{ height: 300, borderRadius: '115px 115px 14px 14px', overflow: 'hidden',
              border: `4px solid ${lit ? C.gold : 'transparent'}` }}>
              <Img src={staticFile(g.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: 'Frank', fontWeight: 700, fontSize: 34, color: C.ink, marginTop: 14, lineHeight: 1.2 }}>{g.label}</div>
          </div>
        );
      })}
      <Title at={104} size={74} color={C.red} top={1560}>יש רגע שנכתב<br />בדיוק בשבילך.</Title>
    </AbsoluteFill>
  );
};

const S7: React.FC = () => {
  const f = useCurrentFrame();
  const logo = spring({ frame: f - 4, fps: 30, config: { damping: 14 } });
  return (
    <AbsoluteFill>
      <Wall dim={0.9} speed={0.3} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 46 }}>
        <Img src={staticFile('logo.jpg')} style={{ width: 300, height: 300, borderRadius: '50%', transform: `scale(${logo})` }} />
        <Title at={16} size={120}>נקודת מבט</Title>
        <Title at={30} size={58} color={C.cream}>סיפורים שמשאירים אותך<br />עם מחשבה.</Title>
        <Sub at={48} size={40}>מאת אפרים עטייה</Sub>
        <div style={{ fontFamily: 'Heebo', fontWeight: 700, fontSize: 56, color: C.gold, direction: 'ltr', opacity: ease(f, 66, 82) }}>
          nekudatmabat.blog
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const scenes = [S1, S2, S3, S4, S5, S6, S7];

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: C.night, direction: 'rtl' }}>
    <style>{fonts}</style>
    <Audio src={staticFile('audio/promo.mp3')} />
    {scenes.map((S, i) => (
      <Sequence key={i} from={CUTS[i]} durationInFrames={CUTS[i + 1] - CUTS[i]}>
        <S />
      </Sequence>
    ))}
  </AbsoluteFill>
);
