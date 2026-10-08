"""An original, gentle piano score for the promo: slow chords, a simple melody, a soft room.

usage: promo-music.py <seconds> <cut,cut,...> <out.wav>
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = float(sys.argv[1])
CUTS = [float(x) for x in sys.argv[2].split(',')]
BPM = 72
beat = 60 / BPM
n = int(SR * DUR)
L = np.zeros(n); R = np.zeros(n)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
rng = np.random.default_rng(3)


def piano(m: int, start: float, length: float, vel: float, pan: float = 0.0) -> None:
    """A soft felt-piano tone: decaying harmonics, a short hammer, slightly detuned strings."""
    i0 = int(start * SR)
    if i0 >= n:
        return
    k = min(int((length + 2.5) * SR), n - i0)
    t = np.arange(k) / SR
    f = hz(m)
    tone = np.zeros(k)
    for h, (amp, dec) in enumerate([(1, 1.6), (0.45, 2.4), (0.22, 3.4), (0.1, 4.6), (0.05, 6)], start=1):
        for det in (-0.6, 0.6):
            tone += amp * np.exp(-t * dec * (0.7 + f / 900)) * np.sin(2 * np.pi * (f * h + det) * t)
    tone *= np.minimum(1, t / 0.006)                        # no click
    tone *= np.where(t < length, 1, np.exp(-(t - length) / 0.35))  # damper
    tone += 0.02 * rng.standard_normal(k) * np.exp(-t * 60)  # felt hammer
    g = vel * 0.12
    L[i0:i0 + k] += g * (1 - pan) * tone
    R[i0:i0 + k] += g * (1 + pan) * tone


# D – A/C# – Bm – G, one chord per bar, played as a slow rolled left hand and a quiet right hand.
chords = [
    (38, [50, 57, 62, 66]), (37, [49, 57, 61, 64]), (35, [50, 54, 59, 62]), (31, [50, 55, 59, 62]),
]
melody = [  # (beat offset in the 4-bar phrase, midi, beats)
    (0, 78, 1.5), (1.5, 76, 0.5), (2, 74, 2),
    (4, 73, 1.5), (5.5, 74, 0.5), (6, 76, 2),
    (8, 74, 1.5), (9.5, 73, 0.5), (10, 71, 2),
    (12, 74, 3), (15, 73, 1),
]
bar = beat * 4
phrase = bar * 4
for p, ps in enumerate(np.arange(0, DUR, phrase)):
    for c, (bass, notes) in enumerate(chords):
        s = ps + c * bar
        piano(bass, s, bar, 0.8, -0.3)
        for j, m in enumerate(notes):
            piano(m, s + 0.06 * j + beat * (0 if j < 2 else 2), bar - beat, 0.42, 0.2 * (j - 1.5))
    for off, m, ln in melody:
        if p == 0 and off < 4:  # the first bar is chords only, then the melody enters
            continue
        piano(m, ps + off * beat, ln * beat, 0.55 + 0.1 * rng.random(), 0.15)

# A warm low swell under each cut, felt more than heard.
for c in CUTS:
    i0 = int(c * SR); k = min(int(SR * 1.6), n - i0)
    t = np.arange(k) / SR
    s = 0.09 * np.sin(np.pi * np.minimum(1, t / 1.6)) * np.sin(2 * np.pi * 73.4 * t)
    L[i0:i0 + k] += s; R[i0:i0 + k] += s

# Room: convolve with a 2.4s decaying stereo noise tail.
def room(x: np.ndarray, seed: int) -> np.ndarray:
    k = int(SR * 2.4); t = np.arange(k) / SR
    ir = np.random.default_rng(seed).standard_normal(k) * np.exp(-t * 2.6)
    ir[0] = 0; ir /= np.abs(ir).sum() / 6
    size = 1 << int(np.ceil(np.log2(len(x) + k)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:len(x)]
    return 0.72 * x + 0.28 * wet

L, R = room(L, 1), room(R, 2)
t = np.arange(n) / SR
fade = np.minimum(1, t / 0.8) * np.minimum(1, (DUR - t) / 3.0)
L *= fade; R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = np.stack([L, R], 1) / peak * 0.7

with wave.open(sys.argv[3], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype(np.int16).tobytes())
