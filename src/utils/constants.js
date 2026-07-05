export const CATEGORIES = [
  {
    id: "identity",
    name: "Identity",
    color: "#6366f1", // Indigo
    bgLight: "rgba(99, 102, 241, 0.1)",
    border: "rgba(99, 102, 241, 0.3)",
    placeholder: "e.g., Aadhaar, Passport, Driver's License",
    numberPlaceholder: "e.g., 1234 5678 9012"
  },
  {
    id: "financial",
    name: "Financial",
    color: "#10b981", // Emerald
    bgLight: "rgba(16, 185, 129, 0.1)",
    border: "rgba(16, 185, 129, 0.3)",
    placeholder: "e.g., PAN Card, Credit Card, Debit Card",
    numberPlaceholder: "e.g., ABCDE1234F"
  },
  {
    id: "education",
    name: "Education",
    color: "#f59e0b", // Amber
    bgLight: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.3)",
    placeholder: "e.g., Degree Certificate, Marksheet",
    numberPlaceholder: "e.g., Roll No. / Reg No."
  },
  {
    id: "health",
    name: "Health",
    color: "#f43f5e", // Rose
    bgLight: "rgba(244, 63, 94, 0.1)",
    border: "rgba(244, 63, 94, 0.3)",
    placeholder: "e.g., Health Insurance, Vaccine Certificate",
    numberPlaceholder: "e.g., Policy Number / ID"
  },
  {
    id: "work",
    name: "Work",
    color: "#8b5cf6", // Violet
    bgLight: "rgba(139, 92, 246, 0.1)",
    border: "rgba(139, 92, 246, 0.3)",
    placeholder: "e.g., Employee ID, Offer Letter",
    numberPlaceholder: "e.g., Employee Code"
  },
  {
    id: "other",
    name: "Other",
    color: "#6b7280", // Slate
    bgLight: "rgba(107, 114, 128, 0.1)",
    border: "rgba(107, 114, 128, 0.3)",
    placeholder: "e.g., Lease Agreement, Utility Bills",
    numberPlaceholder: "e.g., Document ID / Reference"
  }
];

const aadhaarSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%"><rect width="400" height="250" rx="15" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><rect width="400" height="45" fill="%231e3a8a" rx="15"/><rect y="30" width="400" height="15" fill="%2315803d"/><text x="20" y="28" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="14">GOVERNMENT OF INDIA</text><text x="20" y="70" fill="%231e3a8a" font-family="sans-serif" font-weight="bold" font-size="16">Aadhaar Card</text><rect x="20" y="90" width="80" height="100" rx="8" fill="%23cbd5e1" stroke="%2394a3b8" stroke-width="1"/><circle cx="60" cy="125" r="20" fill="%2364748b"/><path d="M30,175 C30,150 90,150 90,175 Z" fill="%2364748b"/><text x="120" y="105" fill="%23475569" font-family="sans-serif" font-size="10" font-weight="bold">Name:</text><text x="120" y="120" fill="%230f172a" font-family="sans-serif" font-size="12" font-weight="600">Rahul Sharma</text><text x="120" y="145" fill="%23475569" font-family="sans-serif" font-size="10" font-weight="bold">DOB / Year:</text><text x="120" y="160" fill="%230f172a" font-family="sans-serif" font-size="12" font-weight="600">1990</text><rect x="120" y="180" width="260" height="15" fill="%23000000"/><rect x="130" y="180" width="5" height="15" fill="%23ffffff"/><rect x="145" y="180" width="10" height="15" fill="%23ffffff"/><rect x="160" y="180" width="3" height="15" fill="%23ffffff"/><rect x="180" y="180" width="8" height="15" fill="%23ffffff"/><rect x="200" y="180" width="4" height="15" fill="%23ffffff"/><rect x="210" y="180" width="12" height="15" fill="%23ffffff"/><rect x="230" y="180" width="3" height="15" fill="%23ffffff"/><text x="20" y="225" fill="%230f172a" font-family="sans-serif" font-weight="bold" font-size="18" letter-spacing="4">1234 5678 9012</text></svg>`;

const panSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%"><rect width="400" height="250" rx="15" fill="%230b1329" stroke="%2338bdf8" stroke-width="1.5"/><text x="20" y="30" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="9" letter-spacing="1">INCOME TAX DEPARTMENT</text><text x="20" y="45" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="11">GOVERNMENT OF INDIA</text><text x="260" y="35" fill="%2338bdf8" font-family="sans-serif" font-size="8" font-weight="bold">PERMANENT ACCOUNT CARD</text><rect x="20" y="70" width="70" height="85" rx="5" fill="%23cbd5e1" stroke="%2364748b" stroke-width="1"/><circle cx="55" cy="100" r="16" fill="%23475569"/><path d="M30,140 C30,120 80,120 80,140 Z" fill="%23475569"/><rect x="20" y="170" width="120" height="25" rx="3" fill="%23ffffff" stroke="%2394a3b8" stroke-width="1"/><path d="M30,190 Q50,175 70,185 T110,180" fill="none" stroke="%231e3a8a" stroke-width="2"/><text x="110" y="80" fill="%2338bdf8" font-family="sans-serif" font-size="7" font-weight="bold">NAME</text><text x="110" y="92" fill="%23ffffff" font-family="sans-serif" font-size="10" font-weight="600">PRIYA PATEL</text><text x="110" y="110" fill="%2338bdf8" font-family="sans-serif" font-size="7" font-weight="bold">FATHER\\'S NAME</text><text x="110" y="122" fill="%23ffffff" font-family="sans-serif" font-size="10" font-weight="600">RAMESH PATEL</text><text x="110" y="140" fill="%2338bdf8" font-family="sans-serif" font-size="7" font-weight="bold">DATE OF BIRTH</text><text x="110" y="152" fill="%23ffffff" font-family="sans-serif" font-size="10" font-weight="600">14/08/1993</text><text x="160" y="215" fill="%23ffffff" font-family="sans-serif" font-weight="bold" font-size="18" letter-spacing="3">ABCDE1234F</text></svg>`;

export const DEFAULT_CARDS = [
  {
    id: 1,
    title: "Aadhaar Card",
    number: "1234 5678 9012",
    image: aadhaarSvg,
    category: "identity",
    notes: "Primary identity verification card. Issued by UIDAI.",
    createdAt: new Date("2026-01-15").toLocaleDateString()
  },
  {
    id: 2,
    title: "PAN Card",
    number: "ABCDE1234F",
    image: panSvg,
    category: "financial",
    notes: "Permanent Account Number for tax and banking operations.",
    createdAt: new Date("2026-02-20").toLocaleDateString()
  }
];
