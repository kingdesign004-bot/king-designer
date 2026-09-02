export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export function getLevelForPublishedPosts(count: number) {
  return Math.max(1, Math.floor(Math.max(0, count) / 5) + 1);
}

export function decodeUploadData(data: string) {
  const raw = data.includes(",") ? data.split(",")[1] : data;
  if (!raw) throw new Error("بيانات الملف غير صالحة");
  const buffer = Buffer.from(raw, "base64");
  if (buffer.byteLength > MAX_UPLOAD_BYTES) throw new Error("حجم الملف يتجاوز 15MB");
  return buffer;
}

export function isValidPublicId(value: string) {
  return /^[0-9]{4,20}$/.test(value);
}

export function canAssignPublicId(value: string, isOwner: boolean) {
  return isValidPublicId(value) && (value !== "10000" || isOwner);
}

export function canEditCountry(countryLocked: number | null | undefined, isAdmin: boolean) {
  return isAdmin || !countryLocked;
}

export function isValidReward(amount: number, referenceId: string) {
  return Number.isInteger(amount) && amount > 0 && amount <= 100000 && referenceId.trim().length >= 4;
}
