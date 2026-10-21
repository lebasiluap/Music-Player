/** Generate a short, original ambient study as PCM WAV entirely on this device. */
export function createDemoAudio(notes) {
  const rate = 22050;
  const duration = 18;
  const count = rate * duration;
  const buffer = new ArrayBuffer(44 + count * 2);
  const view = new DataView(buffer);
  const text = (offset, value) => {
    for (let i = 0; i < value.length; i++)
      view.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + count * 2, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, count * 2, true);
  for (let i = 0; i < count; i++) {
    const time = i / rate;
    const envelope = Math.min(1, time / 2, (duration - time) / 3);
    let sample =
      notes.reduce(
        (sum, frequency, voice) =>
          sum +
          Math.sin(2 * Math.PI * frequency * time) *
            (0.65 + 0.35 * Math.sin(time * 0.55 + voice)),
        0,
      ) / notes.length;
    sample +=
      0.13 *
      Math.sin(2 * Math.PI * notes[Math.floor(time * 2) % 4] * 2 * time) *
      Math.exp(-((time * 2) % 1) * 5);
    view.setInt16(
      44 + i * 2,
      Math.round(Math.max(-1, Math.min(1, sample * envelope * 0.45)) * 32767),
      true,
    );
  }
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}
