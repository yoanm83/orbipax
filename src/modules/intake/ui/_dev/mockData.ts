// Mock data for visual harness testing - NO PHI
export const mockDemographicsData = {
  // Personal Info
  fullName: 'John Doe',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: new Date('1990-01-15'),
  genderIdentity: 'male' as const,
  sexAssignedAtBirth: 'male' as const,
  ethnicity: 'not-hispanic' as const,
  races: ['white'],
  languages: ['english', 'spanish'],
  photoPreview: '',

  // Address Info
  streetAddress: '123 Main Street',
  streetAddress2: 'Apt 4B',
  addressLine2: 'Apt 4B',
  homeAddress: '123 Main Street',
  city: 'Boston',
  state: 'MA',
  zipCode: '02134',
  housingStatus: 'permanent' as const,
  housingStatusOther: '',
  isTemporary: false,
  tempEndDate: null,
  mailingState: 'MA',

  // Contact Info
  primaryPhone: '(555) 123-4567',
  alternatePhone: '(555) 987-6543',
  email: 'john.doe@example.com',
  preferredContactMethod: 'email' as const,
  bestTimeToReach: 'morning' as const,
  contactNotes: 'Prefers email communication',

  // Legal Info
  legalFullName: 'John Michael Doe',
  maritalStatus: 'single' as const,
  veteranStatus: 'no' as const,
  communicationMethod: 'email' as const,
  caregiverName: '',
  caregiverPhone: '',
  caregiverRelationship: '',

  // State flags for testing
  expandedSections: {
    personal: true,
    address: true,
    contact: true,
    legal: true
  }
};

// Mock handlers for testing interactions
export const mockHandlers = {
  onSectionToggle: (section: string) => {
    console.log(`Toggle section: ${section}`);
  },
  onChange: (field: string, value: any) => {
    console.log(`Field changed: ${field} = ${value}`);
  },
  onSubmit: (data: any) => {
    console.log('Form submitted:', data);
  }
};