import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, interpolate, spring,
  staticFile, useCurrentFrame, useVideoConfig, Easing,
} from 'remotion';
import wallHe from './wall.json';
import wallEs from './wall-es.json';

const C = {
  paper: '#fbf7ee', cream: '#f3e9d3', ink: '#2e2a24', muted: '#75695a', blue: '#003b5c',
  red: '#b0463b', gold: '#c9a24d', goldText: '#8f6f28', teal: '#1f5c57', tealDeep: '#17453f', night: '#0f2f2c',
};

const fonts = `
@font-face{font-family:Frank;src:url(${staticFile('frank.ttf')});font-weight:400}
@font-face{font-family:Frank;src:url(${staticFile('frank-bold.ttf')});font-weight:700}
@font-face{font-family:Heebo;src:url(${staticFile('heebo.ttf')});font-weight:400}
@font-face{font-family:Heebo;src:url(${staticFile('heebo-bold.ttf')});font-weight:700}
@font-face{font-family:Hand;src:url(${staticFile('playpen-hebrew.woff2')})}`;

type Lang = 'he' | 'es';
const TEXT = {
  he: {
    dir: 'rtl', wall: wallHe, site: 'site-stories.png', siteH: 12492,
    s1a: 'רגע לפני שממשיכים לגלול,', s1b: ['יש לי משהו', 'לספר ', 'לך.'],
    s2a: 'אני אפרים.', s2b: ['כבר שנים', 'אני אוסף סיפורים.'],
    s3a: ['סיפורים שעצרו אותי', 'באמצע היום,'], s3b: ['והשאירו אותי', 'עם מחשבה.'],
    s4a: ['על צדיקים,', 'על אנשים שפגשתי,'], s4b: 'ולפעמים גם עליי.',
    worlds: ['משלים', 'סיפורי צדיקים', 'מהיומן שלי', 'מהחיים'],
    s5a: ['כתבתי אותם ', 'בשבילך.'], s5b: ['38', ' סיפורים, ויותר ממאה', 'רגעים קצרים.'],
    s6a: ['ובימים שקשה', 'למצוא מילים,'], s6b: ['אפשר פשוט לבחור', 'מה עובר עליך עכשיו.'],
    gates: ['כשכואב', 'כשקשה מול עצמך', 'כשקשה להתקדם', 'כשמשהו נפתח', 'כשמרימים את המבט'],
    s7a: ['כל יום אני שולח', 'לקבוצה שלי', 'סיפור חדש.'], s7b: 'קבוצה שקטה. רק אני שולח.',
    s7c: ['רוצים להצטרף?', 'שלחו לי ', '"מבט"'], phone: '053-484-9068',
    s8a: 'מאמין בך,', s8b: 'אפרים', url: 'nekudatmabat.blog',
  },
  es: {
    dir: 'ltr', wall: wallEs, site: 'site-stories-es.png', siteH: 13944,
    s1a: 'Antes de seguir deslizando,', s1b: ['tengo algo', 'para ', 'contarte.'],
    s2a: 'Soy Efraim.', s2b: ['Hace años', 'que colecciono historias.'],
    s3a: ['Historias que me detuvieron', 'en medio del día'], s3b: ['y me dejaron', 'pensando.'],
    s4a: ['Sobre tzadikim,', 'sobre personas que conocí'], s4b: 'y a veces también sobre mí.',
    worlds: ['Parábolas', 'Historias de tzadikim', 'De mi diario', 'De la vida'],
    s5a: ['Las escribí ', 'para ti.'], s5b: ['38', ' historias y más de cien', 'momentos breves.'],
    s6a: ['Y en los días en que', 'cuesta encontrar palabras'], s6b: ['puedes elegir', 'lo que estás viviendo ahora.'],
    gates: ['Cuando duele', 'Cuando cuesta frente al espejo', 'Cuando cuesta avanzar', 'Cuando algo se abre', 'Cuando levantamos la mirada'],
    s7a: ['Cada día envío', 'a mi grupo', 'una historia nueva.'], s7b: 'Un grupo tranquilo. Solo yo envío.',
    s7c: ['¿Quieres unirte?', 'Envíame ', '«Vista»'], phone: '+972 53-484-9068',
    s8a: 'Creo en ti,', s8b: 'Rabino Efraim Atia', url: 'nekudatmabat.blog/es',
  },
} as const;
const LangCtx = React.createContext<Lang>('he');
const useT = () => TEXT[React.useContext(LangCtx)];
// Positions are written for Hebrew (right to left); Spanish mirrors them.
const useSide = () => (React.useContext(LangCtx) === 'he' ? 1 : -1);

// Cut points in frames (30fps); the music's low pulses land on the same seconds.
export const CUTS = [0, 120, 240, 360, 495, 645, 810, 960, 1080];
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
  const wall = useT().wall;
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

// The video is a letter from Efraim to whoever is watching: first person, ending in the invitation.

const S1: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${ease(f, 0, 120, 1.25, 1.05)})` }}>
        <Wall dim={ease(f, 10, 60, 0.15, 0.62)} speed={1.3} />
      </div>
      <AbsoluteFill style={{ justifyContent: 'center', gap: 34 }}>
        <Title at={20} size={78} color={C.cream}>{t.s1a}</Title>
        <Title at={46} size={108}>{t.s1b[0]}<br />{t.s1b[1]}<Hl>{t.s1b[2]}</Hl></Title>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// A sheet of paper: the letter begins with the man who writes it, as a printed photo
// (the same white frame and tilt as on the "who am I" page).
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const p = spring({ frame: f, fps: 30, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ background: C.paper, alignItems: 'center' }}>
      <div style={{
        position: 'absolute', top: 200, width: 560, padding: 20, paddingBottom: 26, background: '#fff',
        boxShadow: '0 22px 50px rgba(46,42,36,.22)', opacity: p,
        transform: `rotate(${-2 * useSide() * p}deg) translateY(${(1 - p) * 60}px) scale(${1.04 - 0.04 * ease(f, 0, 120)})`,
      }}>
        <Img src={staticFile('efraim.jpg')} style={{ width: '100%', display: 'block' }} />
      </div>
      <Title at={14} size={130} color={C.blue} top={930}>{t.s2a}</Title>
      <Title at={38} size={76} color={C.ink} top={1130}>{t.s2b[0]}<br />{t.s2b[1]}</Title>
    </AbsoluteFill>
  );
};

// The brand mark: a paper circle opens, the gold point lands in its centre.
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const r = ease(f, 0, 30, 0, 300);
  const dot = spring({ frame: f - 24, fps: 30, config: { damping: 12, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ background: C.tealDeep, alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 360, width: r * 2, height: r * 2, borderRadius: '50%', background: C.paper,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 34 * dot, height: 34 * dot, borderRadius: '50%', background: C.gold }} />
      </div>
      <Title at={34} size={72} top={1120}>{t.s3a[0]}<br />{t.s3a[1]}</Title>
      <Title at={60} size={80} color={C.gold} top={1330}>{t.s3b[0]}<br />{t.s3b[1]}</Title>
    </AbsoluteFill>
  );
};

const worlds = [
  { img: 'gate-stories-red.jpg', label: 'משלים', color: C.red, x: -230, y: -260, rot: -7 },
  { img: 'gate-stories-teal.jpg', label: 'סיפורי צדיקים', color: C.teal, x: 230, y: -100, rot: 6 },
  { img: 'gate-stories-blue.jpg', label: 'מהיומן שלי', color: C.blue, x: -210, y: 240, rot: 5 },
  { img: 'gate-stories-gold.jpg', label: 'מהחיים', color: C.goldText, x: 220, y: 410, rot: -6 },
];

const S4: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const side = useSide();
  return (
    <AbsoluteFill>
      <Wall dim={0.82} speed={0.5} />
      <Title at={2} size={78} top={150}>{t.s4a[0]}<br />{t.s4a[1]}</Title>
      <Title at={60} size={74} color={C.gold} top={1700}>{t.s4b}</Title>
      {worlds.map((w, i) => {
        const p = spring({ frame: f - 14 - i * 9, fps: 30, config: { damping: 15, stiffness: 110 } });
        return (
          <div key={w.label} style={{
            position: 'absolute', left: 540 - 200 - side * w.x, top: 960 - 150 + w.y, width: 400,
            transform: `translateY(${(1 - p) * 500}px) rotate(${side * w.rot * p}deg)`, opacity: p,
          }}>
            <div style={{ background: C.paper, padding: 14, borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,.35)' }}>
              <Img src={staticFile(w.img)} style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 10 }} />
            </div>
            <div style={{ position: 'absolute', bottom: -24, insetInlineStart: 30, background: w.color, color: C.paper,
              fontFamily: 'Frank', fontWeight: 700, fontSize: side === 1 ? 40 : 34, padding: '8px 26px', borderRadius: 40, whiteSpace: 'nowrap' }}>{t.worlds[i]}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// The real site, scrolling inside a phone.
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const enter = spring({ frame: f, fps: 30, config: { damping: 18 } });
  const screenW = 540, screenH = 1080;
  const shotH = (t.siteH / 780) * screenW;
  const scroll = interpolate(f, [24, 140], [0, -(shotH * 0.42)], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <Wall dim={0.85} speed={0.4} />
      <Title at={4} size={96} top={140}>{t.s5a[0]}<Hl>{t.s5a[1]}</Hl></Title>
      <div style={{
        position: 'absolute', left: (1080 - screenW - 36) / 2, top: 420,
        transform: `translateY(${(1 - enter) * 900}px)`,
        width: screenW + 36, height: screenH + 36, borderRadius: 70, background: '#111', padding: 18,
        boxShadow: '0 40px 90px rgba(0,0,0,.5)',
      }}>
        <div style={{ width: screenW, height: screenH, borderRadius: 54, overflow: 'hidden', position: 'relative', background: C.paper }}>
          <Img src={staticFile(t.site)} style={{ width: screenW, position: 'absolute', top: scroll }} />
          <div style={{ position: 'absolute', top: 16, left: screenW / 2 - 80, width: 160, height: 38, borderRadius: 20, background: '#111' }} />
        </div>
      </div>
      <Sub at={30} top={1600} size={50}><Hl>{t.s5b[0]}</Hl>{t.s5b[1]}<br />{t.s5b[2]}</Sub>
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
  const t = useT();
  const side = useSide();
  const chosen = Math.min(4, Math.floor(Math.max(0, f - 40) / 18));
  const pos = [[-260, 0], [0, 0], [260, 0], [-130, 420], [130, 420]];
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title at={0} size={74} color={C.ink} top={150}>{t.s6a[0]}<br />{t.s6a[1]}</Title>
      {gates.map((g, i) => {
        const p = spring({ frame: f - 10 - i * 4, fps: 30, config: { damping: 200 } });
        const lit = f > 40 && i === chosen;
        return (
          <div key={g.label} style={{
            position: 'absolute', left: 540 - 115 - side * pos[i][0], top: 520 + pos[i][1], width: 230,
            opacity: p * (lit || f <= 40 ? 1 : 0.45), transform: `scale(${lit ? 1.08 : 1})`,
            textAlign: 'center',
          }}>
            <div style={{ height: 300, borderRadius: '115px 115px 14px 14px', overflow: 'hidden',
              border: `4px solid ${lit ? C.gold : 'transparent'}` }}>
              <Img src={staticFile(g.img)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: 'Frank', fontWeight: 700, fontSize: side === 1 ? 34 : 29, color: C.ink, marginTop: 14, lineHeight: 1.2 }}>{t.gates[i]}</div>
          </div>
        );
      })}
      <Title at={40} size={70} color={C.blue} top={1530}>{t.s6b[0]}<br />{t.s6b[1]}</Title>
    </AbsoluteFill>
  );
};

// The invitation: what the group is, then how to join.
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const pop = spring({ frame: f - 62, fps: 30, config: { damping: 13 } });
  return (
    <AbsoluteFill style={{ background: C.paper, alignItems: 'center' }}>
      <Title at={4} size={76} color={C.ink} top={260}>{t.s7a[0]}<br />{t.s7a[1]}<br /><Hl color={C.blue}>{t.s7a[2]}</Hl></Title>
      <Sub at={30} top={720} color={C.muted} size={52}>{t.s7b}</Sub>
      <div style={{ position: 'absolute', top: 960, left: 90, right: 90, padding: '56px 30px', borderRadius: 40,
        background: C.tealDeep, textAlign: 'center', transform: `scale(${0.85 + 0.15 * pop})`, opacity: pop }}>
        <div style={{ fontFamily: 'Frank', fontWeight: 700, fontSize: 70, color: C.paper, lineHeight: 1.25 }}>
          {t.s7c[0]}<br />{t.s7c[1]}<span style={{ color: C.gold }}>{t.s7c[2]}</span>
        </div>
        <div style={{ fontFamily: 'Heebo', fontWeight: 700, fontSize: 76, color: C.paper, direction: 'ltr', marginTop: 26, letterSpacing: 2 }}>
          {t.phone}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The signature, as at the end of every story on the site.
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const t = useT();
  const he = React.useContext(LangCtx) === 'he';
  const write = ease(f, 26, 62);
  return (
    <AbsoluteFill style={{ background: C.paper, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <Img src={staticFile('efraim.jpg')} style={{ width: 260, height: 260, borderRadius: '50%', marginBottom: 40,
        border: `5px solid ${C.gold}`, opacity: ease(f, 0, 14) }} />
      <Title at={4} size={72} color={C.ink}>{t.s8a}</Title>
      <div style={{ fontFamily: he ? 'Hand' : 'Frank', fontWeight: he ? 400 : 700, fontSize: he ? 150 : 96, color: C.blue, lineHeight: 1.3,
        clipPath: he ? `inset(0 0 0 ${100 - write * 100}%)` : `inset(0 ${100 - write * 100}% 0 0)` }}>{t.s8b}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 120, opacity: ease(f, 60, 76) }}>
        <Img src={staticFile('logo.jpg')} style={{ width: 90, height: 90, borderRadius: '50%' }} />
        <div style={{ fontFamily: 'Heebo', fontWeight: 700, fontSize: 46, color: C.tealDeep, direction: 'ltr' }}>{t.url}</div>
      </div>
    </AbsoluteFill>
  );
};

const scenes = [S1, S2, S3, S4, S5, S6, S7, S8];

export const Promo: React.FC<{ lang: Lang }> = ({ lang }) => (
  <LangCtx.Provider value={lang}>
  <AbsoluteFill style={{ background: C.night, direction: TEXT[lang].dir }}>
    <style>{fonts}</style>
    <Audio src={staticFile('audio/promo.mp3')} />
    {scenes.map((S, i) => (
      <Sequence key={i} from={CUTS[i]} durationInFrames={CUTS[i + 1] - CUTS[i]}>
        <S />
      </Sequence>
    ))}
  </AbsoluteFill>
  </LangCtx.Provider>
);
