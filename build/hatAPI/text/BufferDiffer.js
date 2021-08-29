export class BufferDiffer {
  static createDelta(first, second) {
    const delta = [];
    for (let y in first) {
      const row = first[y].split("");
      const newRow = second[y].split("");
      let rowDelta = "";
      for (let x in row) {
        const firstValue = row[x];
        const secondValue = newRow[x];
        if (firstValue === secondValue) {
          rowDelta += " ";
          continue;
        }
        if (firstValue === " " && secondValue !== " ") {
          rowDelta += "+";
          continue;
        }
        if (firstValue !== " " && secondValue === " ") {
          rowDelta += "-";
          continue;
        }
      }
      delta.push(rowDelta);
    }
    return delta;
  }
}
