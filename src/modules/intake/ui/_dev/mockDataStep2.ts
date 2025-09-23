// Mock data for Step 2 visual harness testing - NO PHI
export const mockInsuranceData = {
  // Government Coverage
  hasMedicaid: true,
  medicaidId: 'MCD123456789',
  medicaidStartDate: new Date('2023-01-01'),
  medicaidEndDate: new Date('2024-12-31'),

  hasMedicare: false,
  medicareId: '',
  medicarePartA: false,
  medicarePartB: false,
  medicarePartD: false,
  medicareAdvantage: false,
  medicareStartDate: null,

  hasOtherGovCoverage: false,
  otherGovCoverageDetails: '',

  // Eligibility Records
  eligibilityRecords: [
    {
      id: '1',
      checkDate: new Date('2023-12-01'),
      coverageType: 'Medicaid',
      status: 'Active',
      effectiveDate: new Date('2023-01-01'),
      expirationDate: new Date('2024-12-31'),
      benefitDetails: 'Standard coverage with mental health benefits',
    }
  ],

  // Insurance Records
  insuranceRecords: [
    {
      id: '1',
      carrier: 'Blue Cross Blue Shield',
      memberId: 'BCB987654321',
      groupNumber: 'GRP001234',
      effectiveDate: new Date('2023-06-01'),
      expirationDate: new Date('2024-05-31'),
      planType: 'PPO',
      planName: 'Premium Health Plan',
      subscriberName: 'John Doe',
      relationship: 'Self',
    },
    {
      id: '2',
      carrier: 'Aetna',
      memberId: 'AET456789012',
      groupNumber: 'GRP005678',
      effectiveDate: new Date('2023-01-01'),
      expirationDate: undefined,
      planType: 'HMO',
      planName: 'Basic Health Plan',
      subscriberName: 'Jane Doe',
      relationship: 'Spouse',
    }
  ],

  // Authorization Records
  authorizationRecords: [
    {
      id: '1',
      procedureCode: '90834',
      procedureDescription: 'Individual Psychotherapy - 45 minutes',
      authorizationNumber: 'AUTH123456',
      providerName: 'Dr. Smith, MD',
      startDate: new Date('2023-12-01'),
      expirationDate: new Date('2024-06-01'),
      unitsApproved: '24',
      unitsUsed: '8',
      unitsRemaining: '16',
    },
    {
      id: '2',
      procedureCode: '90837',
      procedureDescription: 'Individual Psychotherapy - 60 minutes',
      authorizationNumber: 'AUTH789012',
      providerName: 'Dr. Johnson, PhD',
      startDate: new Date('2023-11-01'),
      expirationDate: new Date('2024-05-01'),
      unitsApproved: '12',
      unitsUsed: '3',
      unitsRemaining: '9',
    }
  ],

  // Section expansion state
  expandedSections: {
    government: true,
    eligibility: false,
    insurance: false,
    authorizations: false
  },

  // Additional fields
  primaryInsuranceIndex: 0,
  verificationStatus: 'verified',
  lastVerificationDate: new Date('2023-12-15'),
  notes: 'Coverage verified with carrier. Pre-authorization obtained for therapy sessions.',

  // Billing preferences
  billingPreference: 'insurance' as const,
  selfPayRate: '',
  paymentPlan: false,
  financialAssistanceRequested: false,
};

// Mock handlers for testing interactions
export const mockStep2Handlers = {
  onSectionToggle: (section: string) => {
    console.log(`Toggle section: ${section}`);
  },
  onChange: (field: string, value: any) => {
    console.log(`Field changed: ${field} = ${value}`);
  },
  onAddRecord: (type: string) => {
    console.log(`Add record: ${type}`);
  },
  onRemoveRecord: (type: string, id: string) => {
    console.log(`Remove record: ${type} - ${id}`);
  },
  onSubmit: (data: any) => {
    console.log('Form submitted:', data);
  }
};