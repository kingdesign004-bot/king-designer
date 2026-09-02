import { describe, expect, it } from "vitest";
import { decodeUploadData, getLevelForPublishedPosts } from "./validation";

describe("profile progression and uploads", () => {
  it("raises the numeric level every five public posts", () => {
    expect(getLevelForPublishedPosts(0)).toBe(1);
    expect(getLevelForPublishedPosts(4)).toBe(1);
    expect(getLevelForPublishedPosts(5)).toBe(2);
    expect(getLevelForPublishedPosts(10)).toBe(3);
  });

  it("rejects invalid upload data", () => {
    expect(() => decodeUploadData("data:image/png;base64,")).toThrow("بيانات الملف غير صالحة");
  });
});
