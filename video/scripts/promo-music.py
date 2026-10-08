"""An original, quiet score for the promo: a warm pad, a bell arpeggio, soft pulses on the cuts."""
import sys
import wave
import numpy as np

SR, DUR, BPM = 44100, 26.0, 96
t = np.arange(int(SR * DUR)) / SR
beat = 60 / BPM
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

# D – Bm – G – A, two bars each, looping.
chords = [[50, 57, 62, 66], [47, 54, 62, 66], [43, 55, 59, 62], [45, 52, 61, 64]]
bar = beat * 4
out = np.zeros_like(t)

for i, start in enumerate(np.arange(0, DUR, bar * 2)):
    seg = (t >= start) & (t < start + bar * 2 + 0.6)
    lt = t[seg] - start
    env = np.minimum(1, lt / 0.8) * np.exp(-np.maximum(0, lt - bar * 2) / 0.3)
    for m in chords[i % 4]:
        f = hz(m)
        out[seg] += 0.05 * env * (np.sin(2 * np.pi * f * lt) + 0.3 * np.sin(2 * np.pi * f * 2.001 * lt))

# Bell arpeggio in eighths from bar 2: the moment the music "starts walking".
rng = np.random.default_rng(7)
for k, start in enumerate(np.arange(bar, DUR - 1.5, beat / 2)):
    chord = chords[int(start // (bar * 2)) % 4]
    m = chord[[0, 2, 3, 2, 1, 3, 2, 3][k % 8]] + 12
    n = int(SR * 1.6); i0 = int(start * SR)
    lt = np.arange(min(n, len(t) - i0)) / SR
    f = hz(m)
    bell = np.exp(-lt * 3.2) * (np.sin(2 * np.pi * f * lt) + 0.25 * np.sin(2 * np.pi * f * 3.01 * lt) * np.exp(-lt * 6))
    out[i0:i0 + len(lt)] += 0.07 * (0.8 + 0.2 * rng.random()) * bell

# Soft low pulses on the scene cuts.
for c in [float(x) for x in sys.argv[1].split(',')]:
    i0 = int(c * SR); lt = np.arange(int(SR * 1.2)) / SR
    out[i0:i0 + len(lt)] += 0.25 * np.exp(-lt * 5) * np.sin(2 * np.pi * (55 + 30 * np.exp(-lt * 20)) * lt)

# A short room: a few decaying echoes, then fades.
for d, g in [(0.11, 0.3), (0.23, 0.2), (0.37, 0.12)]:
    s = int(d * SR); out[s:] += g * out[:-s]
out *= np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 2.5)
out = out / np.abs(out).max() * 0.6

with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
