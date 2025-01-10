export const Errors = {
  InvalidOrExpiredJWT: "invalid or expired jwt",
  MissingToken: "missing token",
  InvalidToken: "invalid token",
};

const Version = process.env.NEXT_PUBLIC_APP_VERSION || "";

export const DrawioExtension = ".drawio.png.base64";

export { Version };

export const NotificationInterval = 60 * 1000; // 1000 = 1 segundo
export const AlertInterval = 10 * 1000; // 1000 = 1 segundo

export const MinDataSourceCPUResource = 0;
export const MaxDataSourceCPUResource = 2000;
export const MinDataSourceMemoryResource = 0;
export const MaxDataSourceMemoryResource = 2000;
