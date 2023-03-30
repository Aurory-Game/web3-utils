import fs from "fs";

interface WriteJsonArgs {
  path: string;
  data: Record<string, any>;
  override?: boolean;
  addTs?: boolean;
}

export function writeJson(args: WriteJsonArgs): void {
  let finalPath = args.path;
  if (args.addTs) {
    const parts: string[] = args.path.split(".");
    const ext: string = parts.pop()!;
    const lastPart = parts.pop();
    parts.push(`${lastPart}_${new Date().toISOString()}`);
    parts.push(ext);
    finalPath = parts.join(".");
  }
  if (args.override === false && fs.existsSync(finalPath))
    throw new Error("File already exists");
  fs.writeFileSync(finalPath, JSON.stringify(args.data, null, 2));
}

export function loadJson(path: string): any {
  return JSON.parse(fs.readFileSync(path).toString());
}
