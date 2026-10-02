import { describe, expect, it } from "vitest";
import { ExperienceIdSchema } from "./experiences";

describe("ExperienceIdSchema", () => {
    it.each([
        ["1", 1],
        ["42", 42],
    ])("accepts %s", (input, expected) => {
        expect(ExperienceIdSchema.parse(input)).toBe(expected);
    });

    it.each(["0", "-1", "01", "1.0", "1e0", "0x1", " 1", "abc", ""])("rejects %j", (input) => {
        expect(ExperienceIdSchema.safeParse(input).success).toBe(false);
    });
});
