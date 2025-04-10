interface LottieKeyframe {
  t: number;
  s?: number[];
  i?: { x: number; y: number };
  o?: { x: number; y: number };
  to?: number[];
  ti?: number[];
}

interface LottieKeyframeObject {
  a?: number;
  k: LottieKeyframe[];
}

interface LottieAsset {
  id: string;
  w?: number;
  h?: number;
  u?: string;
  p?: string;
  e?: number;
}

interface LottieLayer {
  ddd: number;
  ind: number;
  ty: number;
  nm: string;
  cl?: string;
  refId?: string;
  sr?: number;
  ks: Record<string, LottieKeyframeObject>;
}

interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: LottieAsset[];
  layers: LottieLayer[];
}

declare module '*.json' {
  const value: LottieAnimation;
  export default value;
}
