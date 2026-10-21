import { createDemoAudio } from "./demo-audio.js";
import { nextIndex, formatTime } from "./logic.js";
const $ = (id) => document.getElementById(id),
  audio = $("audio");
const demos = [
  {
    id: "blue",
    title: "Blue hour",
    artist: "Afterhours · ambient study",
    src: "",
    notes: [130.81, 164.81, 196, 261.63],
  },
  {
    id: "warm",
    title: "Warm current",
    artist: "Afterhours · ambient study",
    src: "",
    notes: [146.83, 185, 220, 293.66],
  },
  {
    id: "drift",
    title: "Slow drift",
    artist: "Afterhours · ambient study",
    src: "",
    notes: [110, 138.59, 164.81, 220],
  },
];
let tracks = [...demos],
  current = "blue",
  shuffle = false,
  repeat = "off",
  playRequest = 0;
audio.volume = 0.7;
function active() {
  return tracks.find((t) => t.id === current);
}
function render() {
  $("track-count").textContent =
    `${tracks.length} TRACK${tracks.length === 1 ? "" : "S"}`;
  const term = $("search").value.toLowerCase();
  const filtered = tracks.filter((t) =>
    (t.title + " " + t.artist).toLowerCase().includes(term),
  );
  $("playlist").replaceChildren(
    ...filtered.map((t) => {
      const li = document.createElement("li");
      li.className = "track";
      li.setAttribute("aria-current", t.id === current);
      const b = document.createElement("button");
      b.className = "track-select";
      const num = document.createElement("span");
      num.className = "track-num";
      num.textContent = String(tracks.indexOf(t) + 1).padStart(2, "0");
      const desc = document.createElement("span"),
        title = document.createElement("strong"),
        artist = document.createElement("small");
      title.textContent = t.title;
      artist.textContent = t.artist;
      desc.append(title, artist);
      b.append(num, desc);
      b.onclick = () => select(t.id, true);
      const remove = document.createElement("button");
      remove.className = "remove";
      remove.textContent = "×";
      remove.setAttribute("aria-label", "Remove " + t.title);
      remove.onclick = () => removeTrack(t.id);
      li.append(b, remove);
      return li;
    }),
  );
  if (!filtered.length)
    $("playlist").innerHTML =
      '<li class="empty">No tracks here. Add audio or restore the demos.</li>';
  ["play", "prev", "next", "shuffle", "repeat"].forEach(
    (id) => ($(id).disabled = !tracks.length),
  );
}
function playbackUI() {
  const playing = !audio.paused;
  $("play").textContent = playing ? "Ⅱ" : "▶";
  $("play").setAttribute("aria-label", playing ? "Pause" : "Play");
  $("play-state").textContent = playing ? "PLAYING" : "PAUSED";
  $("artwork").classList.toggle("playing", playing);
}
async function play() {
  const id = ++playRequest;
  try {
    await audio.play();
    if (id === playRequest)
      $("status").textContent = "Now playing " + active()?.title;
  } catch (e) {
    if (id === playRequest && e.name !== "AbortError")
      $("status").textContent =
        "This track could not play. Try again or add another audio file.";
  }
  playbackUI();
}
function select(id, start = false) {
  const t = tracks.find((t) => t.id === id);
  if (!t) return;
  ++playRequest;
  audio.pause();
  current = id;
  if (t.notes && !t.src) t.src = createDemoAudio(t.notes);
  audio.src = t.src;
  $("title").textContent = t.title;
  $("artist").textContent = t.artist;
  $("art-number").textContent = String(tracks.indexOf(t) + 1).padStart(2, "0");
  $("seek").value = 0;
  $("elapsed").textContent = "0:00";
  $("duration").textContent = "0:00";
  $("seek").disabled = true;
  $("status").textContent = "Ready to play " + t.title;
  render();
  playbackUI();
  if (start) play();
}
function move(direction, auto = false) {
  if (!tracks.length) return;
  const i = tracks.findIndex((t) => t.id === current),
    next = nextIndex(i, tracks.length, { direction, shuffle, repeat });
  if (next === null) {
    audio.pause();
    audio.currentTime = 0;
    playbackUI();
    $("status").textContent = "End of the listening queue.";
    return;
  }
  select(tracks[next].id, auto || !audio.paused);
}
function removeTrack(id) {
  const index = tracks.findIndex((t) => t.id === id),
    t = tracks[index];
  if (!t) return;
  const wasPlaying = !audio.paused;
  if (id === current) {
    ++playRequest;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  tracks = tracks.filter((t) => t.id !== id);
  if (t.local) URL.revokeObjectURL(t.src);
  if (id === current && tracks.length)
    select(tracks[Math.min(index, tracks.length - 1)].id, wasPlaying);
  else if (!tracks.length) {
    current = null;
    $("title").textContent = "Your next discovery";
    $("artist").textContent = "Add audio to begin";
    $("duration").textContent = $("elapsed").textContent = "0:00";
    $("seek").value = 0;
    $("seek").disabled = true;
    playbackUI();
  }
  render();
}
$("play").onclick = () => {
  if (!tracks.length) return;
  if (audio.paused) play();
  else {
    ++playRequest;
    audio.pause();
  }
};
$("next").onclick = () => move(1);
$("prev").onclick = () => {
  if (audio.currentTime > 3) audio.currentTime = 0;
  else move(-1);
};
$("shuffle").onclick = () => {
  shuffle = !shuffle;
  $("shuffle").setAttribute("aria-pressed", shuffle);
};
$("repeat").onclick = () => {
  repeat = { off: "all", all: "one", one: "off" }[repeat];
  $("repeat").textContent = repeat === "one" ? "↻¹" : "↻";
  $("repeat").setAttribute("aria-label", "Repeat mode " + repeat);
  $("repeat").setAttribute("aria-pressed", repeat !== "off");
};
$("volume").oninput = () => {
  audio.volume = Number($("volume").value);
  $("volume-value").textContent = Math.round(audio.volume * 100) + "%";
};
$("seek").oninput = () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0)
    audio.currentTime = (audio.duration * Number($("seek").value)) / 100;
};
audio.onloadedmetadata = () => {
  $("duration").textContent = formatTime(audio.duration);
  $("seek").disabled = !Number.isFinite(audio.duration) || audio.duration <= 0;
};
audio.ontimeupdate = () => {
  $("elapsed").textContent = formatTime(audio.currentTime);
  $("seek").value =
    Number.isFinite(audio.duration) && audio.duration > 0
      ? (audio.currentTime / audio.duration) * 100
      : 0;
};
audio.onplay = audio.onpause = playbackUI;
audio.onended = () => {
  if (repeat === "one") {
    audio.currentTime = 0;
    play();
  } else move(1, true);
};
audio.onerror = () => {
  $("status").textContent =
    "Audio unavailable or unsupported. Choose another track or add a local file.";
  playbackUI();
};
$("search").oninput = render;
$("files").onchange = () => {
  let added = 0;
  for (const file of $("files").files) {
    if (
      !file.type.startsWith("audio/") &&
      !/\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(file.name)
    )
      continue;
    if (file.size > 100 * 1024 * 1024) {
      $("status").textContent = "Files must be smaller than 100 MB.";
      continue;
    }
    const t = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, ""),
      artist: "Your local audio",
      src: URL.createObjectURL(file),
      local: true,
    };
    tracks.push(t);
    added++;
    if (!current) select(t.id);
  }
  $("files").value = "";
  render();
  if (added)
    $("status").textContent =
      `Added ${added} local track${added === 1 ? "" : "s"}. Files stay on this device.`;
};
$("restore").onclick = () => {
  for (const d of demos) if (!tracks.some((t) => t.id === d.id)) tracks.push(d);
  if (!current) select(tracks[0].id);
  render();
  $("status").textContent = "Demo tracks restored.";
};
window.addEventListener("beforeunload", () =>
  [...new Set([...tracks, ...demos].map((t) => t.src))]
    .filter((s) => s.startsWith("blob:"))
    .forEach((s) => URL.revokeObjectURL(s)),
);
select(current);
