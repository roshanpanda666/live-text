export const ASCII_CHARS = " .`-_':,;^=+/\"|)\\<>)iv%xclrs{*}I?!][1taeo7zjLuT#JCwfy325Fp6mqSghVd4EgXPGZbYkOA&8U$@HwN0WQ#M";

export function brightnessToAscii(brightness: number): string {
    // Brightness is 0-255. Map it to the ASCII string index.
    const interval = 255 / (ASCII_CHARS.length - 1);
    return ASCII_CHARS[Math.floor(brightness / interval)];
}

export function drawFrameToCanvas(video: HTMLVideoElement, canvas: HTMLCanvasElement, width: number, height: number) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}

export function imageToAscii(imageData: ImageData): string {
    const data = imageData.data;
    let result = "";

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate brightness using standard luminance formula
        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

        result += brightnessToAscii(brightness);

        // After every row (width * 4 bytes per pixel), add a newline
        if ((i + 4) % (imageData.width * 4) === 0) {
            result += "\n";
        }
    }

    return result;
}
