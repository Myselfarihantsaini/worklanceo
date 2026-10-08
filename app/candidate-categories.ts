export const candidateCategories = [
  "Logistics & warehouse",
  "Delivery & driving",
  "Retail & e-commerce",
  "Manufacturing",
  "BPO & customer support",
  "Hospitality & facilities",
  "Healthcare",
  "Office & administration",
  "Sales & marketing",
  "IT & technology",
  "Other",
] as const;

export const candidateCategorySet = new Set<string>(candidateCategories);
