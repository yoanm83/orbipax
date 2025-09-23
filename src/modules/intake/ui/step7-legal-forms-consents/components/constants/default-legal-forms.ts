import { type LegalForm } from "@/lib/store/intake-form-store"

export const DEFAULT_LEGAL_FORMS: LegalForm[] = [
  {
    id: "hipaa",
    title: "HIPAA Notice of Privacy Practices",
    description:
      "This form explains how your medical information may be used and disclosed and how you can get access to this information.",
    isRequired: true,
    isExpanded: false,
    isRead: false,
    isSigned: false,
    signatureDate: null,
    signature: "",
  },
  {
    id: "consent-treatment",
    title: "Consent for Treatment",
    description:
      "This form provides your consent to receive mental health services from our agency and acknowledges the risks and benefits of treatment.",
    isRequired: true,
    isExpanded: false,
    isRead: false,
    isSigned: false,
    signatureDate: null,
    signature: "",
  },
  {
    id: "financial",
    title: "Financial Responsibility Agreement",
    description:
      "This form outlines your financial responsibilities for services provided, including insurance billing and payment policies.",
    isRequired: true,
    isExpanded: false,
    isRead: false,
    isSigned: false,
    signatureDate: null,
    signature: "",
  },
  {
    id: "telehealth",
    title: "Telehealth Consent",
    description:
      "This form provides your consent to receive services via telehealth and outlines the technology requirements and limitations.",
    isRequired: true,
    isExpanded: false,
    isRead: false,
    isSigned: false,
    signatureDate: null,
    signature: "",
  },
  {
    id: "roi",
    title: "Release of Information (ROI)",
    description:
      "This form authorizes our agency to share your protected health information with specified individuals or organizations.",
    isRequired: false,
    isExpanded: false,
    isRead: false,
    isSigned: false,
    signatureDate: null,
    signature: "",
  },
] as const 