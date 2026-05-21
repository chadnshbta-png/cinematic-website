export const FRAME_COUNT = 240;
export const FRAME_BASE_PATH = '/frame';
export const FRAME_PREFIX = 'First-';
export const FRAME_EXTENSION = '.webp';

export function getFramePath(index: number): string {
  const padded = String(index).padStart(4, '0');
  return `${FRAME_BASE_PATH}/${FRAME_PREFIX}${padded}${FRAME_EXTENSION}`;
}

export function generateFramePaths(): string[] {
  return Array.from({ length: FRAME_COUNT }, (_, i) => getFramePath(i + 1));
}

export function frameIndexFromProgress(progress: number, total: number = FRAME_COUNT): number {
  return Math.min(Math.floor(progress * (total - 1)), total - 1);
}

export async function preloadFrameBatch(
  paths: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<HTMLImageElement[]> {
  const images: HTMLImageElement[] = [];
  let loaded = 0;

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        onProgress?.(loaded, paths.length);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });

  const batchSize = 20;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const batchImages = await Promise.all(batch.map(loadImage));
    images.push(...batchImages);
  }

  return images;
}

export function drawFrameOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement
): void {
  const { width, height } = canvas;
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const canvasAspect = width / height;

  let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

  if (canvasAspect > imgAspect) {
    drawWidth = width;
    drawHeight = width / imgAspect;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2;
  } else {
    drawWidth = height * imgAspect;
    drawHeight = height;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}
