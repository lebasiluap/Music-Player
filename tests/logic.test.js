import test from "node:test";
import assert from "node:assert/strict";
import { nextIndex, formatTime } from "../Music Player/logic.js";
test("queue boundaries and repeat", () => {
  assert.equal(nextIndex(2, 3), null);
  assert.equal(nextIndex(2, 3, { repeat: "all" }), 0);
  assert.equal(nextIndex(0, 3, { direction: -1 }), null);
  assert.equal(nextIndex(0, 0), null);
  assert.equal(nextIndex(1, 3, { shuffle: true, random: () => 0 }), 0);
  assert.equal(nextIndex(1, 3, { shuffle: true, random: () => 0.99 }), 2);
});
test("time formatting handles metadata edge cases", () => {
  assert.equal(formatTime(Infinity), "0:00");
  assert.equal(formatTime(65), "1:05");
  assert.equal(formatTime(NaN), "0:00");
});

import {createDemoAudio} from '../Music Player/demo-audio.js';
test('generated demo is a valid 18-second PCM WAV',async()=>{const url=createDemoAudio([110,138.59,164.81,220]);try{const data=await(await fetch(url)).arrayBuffer();const v=new DataView(data);assert.equal(new TextDecoder().decode(new Uint8Array(data,0,4)),'RIFF');assert.equal(v.getUint32(24,true),22050);assert.equal(v.getUint32(40,true),22050*18*2);assert.equal(data.byteLength,44+22050*18*2)}finally{URL.revokeObjectURL(url)}});
