const signatures = [
  {
    extension: "jpg",
    mime: "image/jpeg",
    matches: (b: Uint8Array) => b[0] === 255 && b[1] === 216 && b[2] === 255,
  },
  {
    extension: "png",
    mime: "image/png",
    matches: (b: Uint8Array) =>
      [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => v === b[i]),
  },
  {
    extension: "webp",
    mime: "image/webp",
    matches: (b: Uint8Array) =>
      ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP",
  },
  {
    extension: "mp4",
    mime: "video/mp4",
    matches: (b: Uint8Array) =>
      ascii(b, 4, 8) === "ftyp" &&
      ["isom", "iso2", "mp41", "mp42", "avc1", "M4V "].includes(
        ascii(b, 8, 12),
      ),
  },
  {
    extension: "webm",
    mime: "video/webm",
    matches: (b: Uint8Array) =>
      [26, 69, 223, 163].every((v, i) => v === b[i]) &&
      ascii(b, 0, 256).includes("webm"),
  },
];
function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}
export const maxMediaBytes = 4 * 1024 * 1024;
export function identifyMedia(bytes: Uint8Array, type: string) {
  return signatures.find((s) => s.mime === type && s.matches(bytes));
}
export function mediaType(path: string) {
  return signatures.find((s) => path.endsWith("." + s.extension))?.mime;
}
