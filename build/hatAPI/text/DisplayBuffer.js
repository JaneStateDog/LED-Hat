import {BufferDiffer} from "./BufferDiffer.js";
export class DisplayBuffer {
  get width() {
    return this._buffer[0].length;
  }
  get position() {
    return this._position;
  }
  constructor(contents = []) {
    this._position = 0;
    this._buffer = defaultBuffer();
    this.push(contents);
  }
  clear() {
    this._buffer = defaultBuffer();
  }
  push(content) {
    if (content.length !== 12) {
      return;
    }
    for (let y in content) {
      this._buffer[y] += content[y];
    }
  }
  scrollViewport(distance = 1) {
    const preScrollSnapshot = this.visibleArea;
    this._position += distance;
    const diff = BufferDiffer.createDelta(preScrollSnapshot, this.visibleArea);
    if (this._viewportUpdatedCallback) {
      this._viewportUpdatedCallback(this.visibleArea, diff, this._position > this.width);
    }
  }
  onViewportUpdated(callback) {
    this._viewportUpdatedCallback = callback;
  }
  async autoScroll(speedMs = 250) {
    const timer = setInterval(() => {
      this.scrollViewport();
      if (this._position > this.width) {
        clearInterval(timer);
      }
    }, speedMs);
  }
  get visibleArea() {
    const visibleArea = [];
    for (let row of this._buffer) {
      const sub = row.slice(this._position, this._position + 36);
      visibleArea.push(sub);
    }
    return visibleArea;
  }
}
const defaultBuffer = () => [
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    ",
  "                                    "
];
