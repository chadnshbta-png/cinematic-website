export interface FrameSequenceConfig {
  totalFrames: number;
  basePath: string;
  prefix: string;
  extension: string;
  paddingLength: number;
}

export interface ScrollAnimationConfig {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  pin?: boolean | string;
  pinSpacing?: boolean;
  markers?: boolean;
  anticipatePin?: number;
  invalidateOnRefresh?: boolean;
}

export interface LoaderState {
  progress: number;
  isComplete: boolean;
  phase: 'loading' | 'revealing' | 'done';
}

export interface CollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  videoSrc?: string;
  specs: { label: string; value: string }[];
  color: string;
}

export interface StoryScene {
  id: string;
  headline: string;
  body: string;
  visual: 'video' | 'frame';
  src: string;
  accent: string;
}

export interface SpecItem {
  label: string;
  value: string;
  unit: string;
  percentage: number;
}

export interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
}
