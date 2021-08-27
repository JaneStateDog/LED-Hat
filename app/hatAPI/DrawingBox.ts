import { EmIngMask } from "./EmIngMask";
import { Coord } from "./types";

export class DrawingBox {

    private _root: HTMLElement;
    private _mask: EmIngMask;

    constructor(rootElement: HTMLElement | string, mask: EmIngMask) {
        this._root = typeof rootElement === "string" ? document.getElementById(rootElement) : rootElement;
        this._mask = mask;
    }

    public display() {
        this._root.innerHTML = "";

        for (let y = 0; y < 12; y++) {
            const row = document.createElement("div");
            row.classList.add("row");

            for (let x = 0; x < 36; x++) {

                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute("data-coord", `{ "x": ${x}, "y": ${y} }`)
                cell.addEventListener("click", (e) => { this.handleClick(e) });

                row.appendChild(cell);
            }

            this._root.appendChild(row);
        }
    }

    async handleClick(e: MouseEvent) {
        const element = e.target as HTMLElement;
        const coords = element.getAttribute("data-coord");
        const parsed = JSON.parse(coords) as Coord;

        const picker = <HTMLInputElement>document.getElementById("colorPicker");
        const color = picker.value;

        await this._mask.pixels.set({ x: parsed.x, y: parsed.y }, color);

        element.style.backgroundColor = color;
    }

}