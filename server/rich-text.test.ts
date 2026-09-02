import { describe, expect, it } from "vitest";
import { tokenize, tokenHref } from "../client/src/components/RichText";

describe("RichText tokens", () => {
  it("extracts Arabic hashtags and mentions from content", () => {
    expect(tokenize("مشروع #هوية مع @مصمم")).toEqual([
      { value: "مشروع ", type: "text" },
      { value: "#هوية", type: "hashtag" },
      { value: " مع ", type: "text" },
      { value: "@مصمم", type: "mention" },
    ]);
    const tokens = tokenize("#هوية @مصمم");
    expect(tokenHref(tokens[0]!, {})).toBe("/search?q=%23%D9%87%D9%88%D9%8A%D8%A9");
    expect(tokenHref(tokens[2]!, { "مصمم": 7 })).toBe("/profile/7");
  });
});
