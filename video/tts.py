"""Narration for each scene in src/scenes.json, one mp3 per scene, into public/audio/.

A clip per scene (not one long take) is what keeps the words on screen in step
with the voice: the timeline sizes every scene to its own clip.
"""
import asyncio
import json
import pathlib
import sys

import edge_tts

VOICE = "he-IL-AvriNeural"   # male Hebrew voice
RATE = "-8%"                 # a story, not an announcement

async def main(only: set[str]) -> None:
    scenes = json.loads(pathlib.Path("src/scenes.json").read_text("utf-8"))["scenes"]
    out = pathlib.Path("public/audio")
    out.mkdir(parents=True, exist_ok=True)
    for s in scenes:
        if not s["speak"] or (only and s["id"] not in only):
            continue
        await edge_tts.Communicate(s["speak"], VOICE, rate=RATE).save(str(out / f"{s['id']}.mp3"))
        print("voiced", s["id"])

asyncio.run(main(set(sys.argv[1:])))
