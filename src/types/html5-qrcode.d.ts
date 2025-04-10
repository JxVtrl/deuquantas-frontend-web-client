declare module 'html5-qrcode' {
  export interface Html5QrcodeResult {
    decodedText: string;
    result: {
      text: string;
      format: string;
    };
  }

  export interface QrDimensions {
    width: number;
    height: number;
  }

  export interface Html5QrcodeConfigs {
    fps?: number;
    qrbox?: number | QrDimensions;
    aspectRatio?: number;
    disableFlip?: boolean;
    videoConstraints?: MediaTrackConstraints;
  }

  export interface CameraDevice {
    id: string;
    label: string;
  }

  export class Html5Qrcode {
    constructor(elementId: string);

    start(
      cameraIdOrConfig: string | MediaTrackConstraints,
      configuration: Html5QrcodeConfigs,
      qrCodeSuccessCallback: (
        decodedText: string,
        result?: Html5QrcodeResult,
      ) => void,
      qrCodeErrorCallback?: (errorMessage: string, error: any) => void,
    ): Promise<void>;

    stop(): Promise<void>;

    clear(): void;

    static getCameras(): Promise<CameraDevice[]>;
  }
}
