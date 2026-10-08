import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const { fps, scenes } = JSON.parse(fs.readFileSync('src/scenes.json', 'utf8'));
let from = 0;
const out = scenes.map((s) => {
  const file = `audio/${s.id}.mp3`;
  let dur = Math.round(s.sec * fps), audio;
  if (s.speak && fs.existsSync(`public/${file}`)) {
    const secs = parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
      '-of', 'csv=p=0', `public/${file}`]).toString());
    dur = Math.round(secs * fps) + 8 + (s.id === 's5' || s.id === 's7' ? 30 : 18);
    audio = file;
  }
  const r = { id: s.id, kind: s.kind, text: s.text, from, dur, audio };
  from += dur;
  return r;
});
fs.writeFileSync('src/timeline.json', JSON.stringify({ total: from, scenes: out }, null, 2));
console.log(`total ${(from / fps).toFixed(1)}s`, out.map((s) => `${s.id}:${(s.dur / fps).toFixed(1)}${s.audio ? '♪' : ''}`).join(' '));
