import { describe, expect, it } from "vitest";
import { tokenize } from "./RichText";

describe("RichText tokens", () => {
  it("extracts Arabic hashtags and mentions from content", () => {
    expect(tokenize("مشروع #هوية مع @مصمم"))
      .toEqual([
        { value: "مشروع ", type: "text" },
        { value: "#هوية", type: "hashtag" },
        { value: " مع ", type: "text" },
        { value: "@مصمم", type: "mention" },
      ]);
  });
});
