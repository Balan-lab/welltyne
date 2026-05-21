export type BiomarkerKey =
  | "glucose" | "hba1c" | "total_cholesterol" | "ldl" | "hdl" | "triglycerides"
  | "hscrp" | "hemoglobin" | "wbc" | "platelets" | "creatinine" | "egfr"
  | "alt" | "ast" | "tsh" | "vitamin_d" | "vitamin_b12" | "ferritin"
  | "uric_acid" | "albumin";

export const BIOMARKERS: { key: BiomarkerKey; label: string; unit: string }[] = [
  { key: "glucose", label: "Glucose", unit: "mg/dL" },
  { key: "hba1c", label: "HbA1c", unit: "%" },
  { key: "total_cholesterol", label: "Total Cholesterol", unit: "mg/dL" },
  { key: "ldl", label: "LDL Cholesterol", unit: "mg/dL" },
  { key: "hdl", label: "HDL Cholesterol", unit: "mg/dL" },
  { key: "triglycerides", label: "Triglycerides", unit: "mg/dL" },
  { key: "hscrp", label: "hsCRP / CRP", unit: "mg/L" },
  { key: "hemoglobin", label: "Haemoglobin", unit: "g/dL" },
  { key: "wbc", label: "WBC Count", unit: "x10³/µL" },
  { key: "platelets", label: "Platelets", unit: "x10³/µL" },
  { key: "creatinine", label: "Serum Creatinine", unit: "mg/dL" },
  { key: "egfr", label: "eGFR", unit: "mL/min" },
  { key: "alt", label: "ALT / SGPT", unit: "U/L" },
  { key: "ast", label: "AST / SGOT", unit: "U/L" },
  { key: "tsh", label: "TSH", unit: "mIU/L" },
  { key: "vitamin_d", label: "Vitamin D", unit: "ng/mL" },
  { key: "vitamin_b12", label: "Vitamin B12", unit: "pg/mL" },
  { key: "ferritin", label: "Ferritin", unit: "ng/mL" },
  { key: "uric_acid", label: "Uric Acid", unit: "mg/dL" },
  { key: "albumin", label: "Albumin", unit: "g/dL" },
];
