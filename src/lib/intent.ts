export function detectIntent(text: string): "input_data" | "default" {
  const normalized = text.toLowerCase().normalize("NFC");
  if (normalized.includes("nhập liệu")) {
    return "input_data";
  }
  return "default";
}
