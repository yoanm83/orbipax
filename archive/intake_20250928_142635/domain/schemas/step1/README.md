# Step 1 - Demographics Domain Schemas

## Purpose
This folder contains Zod schemas for Step 1 (Demographics) domain validation.

## Expected Files
- `demographics.schema.ts` - Main demographics validation schema
- `personal.schema.ts` - Personal information sub-schema
- `address.schema.ts` - Address validation sub-schema
- `contact.schema.ts` - Contact information sub-schema
- `legal.schema.ts` - Legal guardian sub-schema
- `index.ts` - Barrel exports

## Current Status
Demographics schema currently located at:
- `../demographics/demographics.schema.ts`

## Architecture Guidelines
- Zod schemas for domain validation
- USCDI v4 compliant field definitions
- HIPAA-compliant data structures
- Reusable sub-schemas for composition
- Type inference for TypeScript types

## IMPORTANT
**DO NOT MOVE EXISTING FILES IN THIS TASK**

This folder was created for organizational consistency. Files will be moved in separate tasks.