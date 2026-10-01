export type Template = "keynote" | "after-hours" | "blueprint" | "club";
export interface CardInput {
  name: string;
  description: string;
  template: Template;
}
export function validateCard(input: unknown): CardInput {
  if (!input || typeof input !== "object")
    throw new Error("A card is required");
  const value = input as Record<string, unknown>;
  if (
    typeof value.name !== "string" ||
    !value.name.trim() ||
    value.name.length > 48
  )
    throw new Error("Product name must contain 1–48 characters");
  if (
    typeof value.description !== "string" ||
    !value.description.trim() ||
    value.description.length > 160
  )
    throw new Error("Description must contain 1–160 characters");
  if (
    !["keynote", "after-hours", "blueprint", "club"].includes(
      String(value.template),
    )
  )
    throw new Error("Unknown template");
  return {
    name: value.name.trim(),
    description: value.description.trim(),
    template: value.template as Template,
  };
}
export function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= width) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = "";
    for (const character of word) {
      if (line && context.measureText(line + character).width > width) {
        lines.push(line);
        line = "";
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export function drawCard(
  context: CanvasRenderingContext2D,
  input: CardInput,
  mascot: HTMLImageElement,
) {
  const dark = input.template === "after-hours";
  const background = dark
    ? "#172019"
    : input.template === "blueprint"
      ? "#edf4df"
      : input.template === "club"
        ? "#dfefbd"
        : "#f7f8f2";
  context.fillStyle = background;
  context.fillRect(0, 0, 1200, 675);
  if (input.template === "blueprint") {
    context.strokeStyle = "#d4e1c7";
    context.lineWidth = 1;
    for (let x = 0; x < 1200; x += 32) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, 675);
      context.stroke();
    }
    for (let y = 0; y < 675; y += 32) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(1200, y);
      context.stroke();
    }
  }
  context.fillStyle = dark ? "#f5f7ef" : "#1c2c20";
  context.font = "600 26px Arial, sans-serif";
  context.fillText("Pear Studio", 64, 77);
  context.font = "18px Arial, sans-serif";
  context.fillText(
    input.template === "club"
      ? "PEAR CLUB EDITION"
      : "AN IDEA FROM THE ORCHARD",
    64,
    148,
  );
  let fontSize = 80;
  context.font = `600 ${fontSize}px Arial, sans-serif`;
  while (wrapText(context, input.name, 730).length > 2 && fontSize > 24) {
    fontSize -= 2;
    context.font = `600 ${fontSize}px Arial, sans-serif`;
  }
  wrapText(context, input.name, 730).forEach((line, index) =>
    context.fillText(line, 60, 245 + index * (fontSize + 6)),
  );
  context.fillStyle = dark ? "#bdc8b8" : "#56604e";
  let descriptionSize = 28;
  context.font = `${descriptionSize}px Arial, sans-serif`;
  while (
    wrapText(context, input.description, 720).length > 4 &&
    descriptionSize > 14
  ) {
    descriptionSize--;
    context.font = `${descriptionSize}px Arial, sans-serif`;
  }
  wrapText(context, input.description, 720).forEach((line, index) =>
    context.fillText(line, 64, 413 + index * 37),
  );
  context.drawImage(mascot, 835, 221, 321, 321);
  context.strokeStyle = dark ? "#3e4a3b" : "#d6dccd";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(64, 583);
  context.lineTo(1136, 583);
  context.stroke();
  context.fillStyle = dark ? "#bfd687" : "#567034";
  context.font = "16px Arial, sans-serif";
  context.fillText("A FICTIONAL PEAR PRODUCT · COMMUNITY CONCEPT", 64, 622);
  context.textAlign = "right";
  context.fillText("APPLES TO PEARS", 1136, 622);
  context.textAlign = "left";
}
