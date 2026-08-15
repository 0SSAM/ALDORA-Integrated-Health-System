import { describe, expect, it } from "vitest";
import { buildDemoReceipt, printerModels, validateDemoBarcode } from "./HardwareWorkspace";

describe("HardwareWorkspace simulator", () => {
  it("offers distinct printer families and only declared transports", () => {
    expect(new Set(printerModels.map(model => model.family)).size).toBe(3);
    expect(printerModels.every(model => model.transports.length > 0 && model.media.length > 0)).toBe(true);
  });

  it("validates bounded barcode-like demo payloads locally", () => {
    expect(validateDemoBarcode("8901234567890")).toBe(true);
    expect(validateDemoBarcode("DMX:GTIN-LOT-01")).toBe(true);
    expect(validateDemoBarcode("short")).toBe(false);
    expect(validateDemoBarcode("8901 <script>")).toBe(false);
  });

  it("builds a clearly simulated receipt without external identifiers", () => {
    const receipt = buildDemoReceipt("thermal-generic-80", "8901234567890", "إيصال 80mm");
    expect(receipt.model).toContain("Thermal");
    expect(receipt.lines[1]).toContain("NOT A REAL SALE");
    expect(receipt.barcode).toBe("8901234567890");
  });
});
