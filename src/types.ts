/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Supporting types for role-based access control
export type UserRole =
  | 'Retail Customer'
  | 'Loan Officer'
  | 'Manager'
  | 'Admin'
  | 'Credit Analyst'
  | 'Fraud Officer'
  | 'Document Reviewer'
  | 'Customer Service Agent';

// 1. Customer Core Data Object
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  creditScore: number;
  monthlyIncome: number;
  employmentType: 'Salaried' | 'SelfEmployed' | 'Contractor' | 'Unemployed';
  status: 'Active' | 'Delinquent' | 'Closed';
  createdAt: string;
}

// 2. Loan Application Core Data Object
export interface LoanApplication {
  id: string;
  customerId: string;
  requestedAmount: number;
  purpose: string;
  facilityStructureId: string; // Ref to FacilityStructure
  status: 'Draft' | 'Applied' | 'InReview' | 'Approved' | 'Disbursed' | 'ExceptionPending' | 'Closed';
  appliedAt: string;
  approvedAt?: string;
  disbursedAt?: string;
  closedAt?: string;
  riskRatingId?: string; // Ref to RiskRating
  collateralId?: string; // Ref to Collateral
  pricingTermsId?: string; // Ref to PricingAndTerms
}

// 3. Financial Statement Core Data Object
export interface FinancialStatement {
  id: string;
  applicationId: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  existingDebtService: number; // monthly obligation payments
  otherIncome: number;
  netMonthlyIncome: number;
  dtiRatio: number; // Debt-to-income calculated as (existingDebtService / monthlyIncome)
  auditStatus: 'Pending' | 'Verified' | 'FlagsDetected';
  parsedTransactions?: Array<{ date: string; desc: string; amount: number; type: 'credit' | 'debit' }>;
}

// 4. Risk Rating Core Data Object (AI risk scoring engine predictions)
export interface RiskRating {
  id: string;
  applicationId: string;
  scoreIndex: number; // 0 to 100
  ratingLetter: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';
  probabilityOfDefault: number; // percentage (e.g. 1.25)
  fraudScore: number; // 0 (low) to 100 (critical)
  riskExplanation: string;
  fraudWarnings: string[];
  systemDecision: 'Approve' | 'ManualReview' | 'Reject';
  auditedAt: string;
}

// 5. Collateral Core Data Object (Collateral Monitoring and Release workflows)
export interface Collateral {
  id: string;
  applicationId: string;
  type: 'Property' | 'Vehicle' | 'Gold' | 'Securities' | 'Equipment';
  description: string;
  estimatedWorth: number;
  currentValuation: number;
  lastValuationDate: string;
  ltvRatio: number; // Loan-to-Value calculated as (LoanAmount / CollateralValue)
  status: 'Pledged' | 'Monitoring' | 'Released';
  legalReviewStatus: 'Pending' | 'Passed' | 'Failed';
  titleDeedReference: string;
}

// 6. Customer Obligation Core Data Object
export interface CustomerObligation {
  id: string;
  customerId: string;
  creditorName: string;
  typeOfDebt: 'CreditCard' | 'Mortgage' | 'AutoLoan' | 'StandardRetail';
  outstandingAmount: number;
  monthlyPayment: number;
  status: 'Active' | 'Paid';
}

// 7. KYC Profile Core Data Object (KYC verification)
export interface KYCProfile {
  id: string;
  customerId: string;
  documentType: 'ID' | 'Passport' | 'DriverLicense';
  documentNumber: string;
  verificationLevel: 'Level_1' | 'Level_2' | 'Full';
  verificationStatus: 'Verified' | 'Failed' | 'Pending';
  failureReason?: string;
  verifiedAt?: string;
}

// 8. Supporting Document Core Data Object (Secure Document handling UI)
export interface SupportingDocument {
  id: string;
  applicationId: string;
  name: string;
  category: 'KYC' | 'IncomeProof' | 'CollateralProof' | 'BankStatement';
  classificationLabel: string; // e.g. "Passport Copy", "Q1 Tax Summary"
  fileSize: string;
  uploadTime: string;
  verificationStatus: 'Approved' | 'Rejected' | 'Pending';
  reviewComments?: string;
}

// 9. Pricing and Terms Core Data Object
export interface PricingAndTerms {
  id: string;
  applicationId: string;
  baseInterestRate: number; // annual base rate e.g. 5.25%
  marginRate: number; // annual risk premium e.g. 1.5%
  finalRate: number; // base + margin e.g. 6.75%
  fixedOrFloating: 'Fixed' | 'Floating';
  amortizationType: 'Linear' | 'Annuity';
  penaltyRate: number; // penalty interest rate for overdue e.g. 2.0%
  termMonths: number;
}

// 10. Facility Structure Core Data Object (Dynamic loan facility categories)
export interface FacilityStructure {
  id: string;
  name: string;
  description: string;
  interestType: 'Fixed' | 'Floating' | 'Hybrid';
  maxAmount: number;
  maxTermMonths: number;
  status: 'Active' | 'Discontinued';
}

// 11. Condition Precedent Core Data Object
export interface ConditionPrecedent {
  id: string;
  applicationId: string;
  description: string;
  isMet: boolean;
  metAt?: string;
  metByOfficer?: string;
}

// Payment Transaction structure (For Payment Processing & Amortization Scheduler)
export interface LoanPayment {
  id: string;
  loanApplicationId: string;
  dueDate: string;
  paidDate?: string;
  principalDue: number;
  interestDue: number;
  amountPaid: number;
  penaltyApplied: number;
  status: 'Overdue' | 'Due' | 'Paid' | 'GracePeriod';
}

// Audit Trail entry for Regulatory Compliance Workflow
export interface ComplianceAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  role: UserRole;
  action: string;
  details: string;
  category: 'KYC' | 'Underwriting' | 'Disbursement' | 'Payment' | 'Override' | 'Collateral';
}

// Early Warning System Trigger (AI warning alerts)
export interface EarlyWarningAlert {
  id: string;
  customerId: string;
  applicationId: string;
  severity: 'Low' | 'Medium' | 'High';
  triggerType: 'DTI_Spike' | 'CreditScoreDrop' | 'MissedObligation' | 'LTV_Erosion' | 'AnomalousTransactions';
  explanation: string;
  triggeredAt: string;
  status: 'Active' | 'Investigating' | 'Resolved';
}

// Standard Customer Servicing Ticketing/Query details
export interface CustomerQuery {
  id: string;
  customerId: string;
  applicationId?: string;
  subject: string;
  message: string;
  status: 'Open' | 'InProgress' | 'Resolved';
  createdAt: string;
  agentResponse?: string;
}

// Single structured state container returned from mock DB
export interface ServerDataStore {
  customers: Customer[];
  applications: LoanApplication[];
  financialStatements: FinancialStatement[];
  riskRatings: RiskRating[];
  collaterals: Collateral[];
  obligations: CustomerObligation[];
  kycProfiles: KYCProfile[];
  documents: SupportingDocument[];
  pricingTerms: PricingAndTerms[];
  facilities: FacilityStructure[];
  conditions: ConditionPrecedent[];
  payments: LoanPayment[];
  auditLogs: ComplianceAuditLog[];
  warningAlerts: EarlyWarningAlert[];
  queries: CustomerQuery[];
}
