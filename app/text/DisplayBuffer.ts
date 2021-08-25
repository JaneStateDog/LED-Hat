import { BufferDiffer } from "./BufferDiffer";

export type ViewportUpdatedCallback = (viewableArea: string[], diff: string[], finished: boolean) => void;

export class DisplayBuffer {

    public get width() { return this._buffer[0].length; }
    public get position() { return this._position; }

    private _buffer: string[];
    private _position: number;
    private _viewportUpdatedCallback: ViewportUpdatedCallback;

    constructor(contents: string[] = []) {
        this._position = 0;
        this._buffer = defaultBuffer();
        this.push(contents);
    }

    public clear() {
        this._buffer = defaultBuffer();
    }

    public push(content: string[]) {
        if (content.length !== 12) {
            return;
        }

        for (let y in content) {
            this._buffer[y] += content[y];
        }

    }

    public scrollViewport(distance: number = 1) {
        const preScrollSnapshot = this.visibleArea;

        this._position += distance;

        const diff = BufferDiffer.createDelta(preScrollSnapshot, this.visibleArea);

        if (this._viewportUpdatedCallback) {
            this._viewportUpdatedCallback(this.visibleArea, diff, this._position > this.width);
        }
    }

    public onViewportUpdated(callback: ViewportUpdatedCallback) {
        this._viewportUpdatedCallback = callback;
    }

    public async autoScroll(speedMs: number = 250) {
        const timer = setInterval(() => {
            this.scrollViewport();

            if (this._position > this.width) {
                clearInterval(timer)
            }
        }, speedMs)
    }

    public get visibleArea(): string[] {
        const visibleArea: string[] = [];

        for (let row of this._buffer) {
            const sub = row.slice(this._position, this._position + 36);
            visibleArea.push(sub);
        }

        return visibleArea;
    }
}

const defaultBuffer = () => ([
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
    "                                    ",
]);