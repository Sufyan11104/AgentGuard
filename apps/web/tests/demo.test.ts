import { describe, expect, it } from "vitest";
import {
  DemoTargetTypeSchema,
  createDemoAdapter,
  getDemoTargetDescription,
  getDemoTargetName,
} from "../src/lib/demo";

describe("web demo utilities", () => {
  it("validates supported demo target types", () => {
    expect(DemoTargetTypeSchema.parse("mock_safe")).toBe("mock_safe");
    expect(DemoTargetTypeSchema.safeParse("http").success).toBe(false);
  });

  it("maps demo target names and descriptions", () => {
    expect(getDemoTargetName("mock_safe")).toBe("Local Safe Mock Agent");
    expect(getDemoTargetName("mock_vulnerable")).toBe("Local Vulnerable Mock Agent");
    expect(getDemoTargetDescription("mock_vulnerable")).toContain("intentionally vulnerable");
  });

  it("creates local mock adapters without external providers", () => {
    expect(createDemoAdapter("mock_safe").type).toBe("mock_safe");
    expect(createDemoAdapter("mock_vulnerable").type).toBe("mock_vulnerable");
  });
});
