// Allow only numbers + 1 decimal point, no spaces
export const validateDecimalInput = (value) => {
  // Remove invalid characters
  let cleaned = value.replace(/[^0-9.]/g, "");

  // Prevent multiple decimals
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }

  // Convert ".7" to "0.7"
  if (cleaned.startsWith(".")) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
};


export const validateIntegerInput = (value) => {
  // Remove anything that's not a digit
  let cleaned = value.replace(/[^0-9]/g, "");



  // Remove leading zeros (e.g., "007" -> "7")
  cleaned = cleaned.replace(/^0+/, "");

  return cleaned;
};