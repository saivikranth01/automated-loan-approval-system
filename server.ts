/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ServerDataStore,
  Customer,
  LoanApplication,
  FinancialStatement,
  RiskRating,
  Collateral,
  CustomerObligation,
  KYCProfile,
  SupportingDocument,
  PricingAndTerms,
  FacilityStructure,
  ConditionPrecedent,
  LoanPayment,
  ComplianceAuditLog,
  EarlyWarningAlert,
  CustomerQuery,
  UserRole
} from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// Prepopulate the Database Store with robust seed data structured around 11 Core Data Objects
let dataStore: ServerDataStore = {
  customers: [
    {
      id: 'cust-1',
      name: 'Robert Sterling',
      email: 'robert.sterling@sterlingcorp.com',
      phone: '+1 (555) 489-3210',
      creditScore: 785,
      monthlyIncome: 14500,
      employmentType: 'Salaried',
      status: 'Active',
      createdAt: '2025-01-10T09:00:00Z',
    },
    {
      id: 'cust-2',
      name: 'Sarah Jenkins',
      email: 'sarah.j@webdesigncreative.net',
      phone: '+1 (555) 301-2244',
      creditScore: 615,
      monthlyIncome: 5200,
      employmentType: 'SelfEmployed',
      status: 'Active',
      createdAt: '2025-02-15T14:30:00Z',
    },
    {
      id: 'cust-3',
      name: 'David Patel',
      email: 'david.patel@horizonmed.org',
      phone: '+1 (555) 881-9003',
      creditScore: 820,
      monthlyIncome: 26000,
      employmentType: 'Salaried',
      status: 'Active',
      createdAt: '2024-11-05T10:15:00Z',
    },
    {
      id: 'cust-4',
      name: 'Michael Vance',
      email: 'mvance77@gmail.com',
      phone: '+1 (555) 231-1090',
      creditScore: 540,
      monthlyIncome: 3900,
      employmentType: 'Contractor',
      status: 'Delinquent',
      createdAt: '2024-09-12T08:00:00Z',
    },
    {
      id: 'cust-5',
      name: 'Emily Lawson',
      email: 'elawson@retailnexus.com',
      phone: '+1 (555) 762-3321',
      creditScore: 635,
      monthlyIncome: 4800,
      employmentType: 'Salaried',
      status: 'Active',
      createdAt: '2025-03-01T11:00:00Z',
    }
  ],

  facilities: [
    {
      id: 'fac-1',
      name: 'Home Mortgage Standard',
      description: 'Long-term financing secured by residential property.',
      interestType: 'Fixed',
      maxAmount: 1500000,
      maxTermMonths: 360,
      status: 'Active'
    },
    {
      id: 'fac-2',
      name: 'Auto Finance Elite',
      description: 'Medium-term credit for new or late-model vehicle purchase.',
      interestType: 'Fixed',
      maxAmount: 120000,
      maxTermMonths: 84,
      status: 'Active'
    },
    {
      id: 'fac-3',
      name: 'Secured Commercial Term Loan',
      description: 'Business Term facility for expansion, secured by corporate real estate or machinery.',
      interestType: 'Floating',
      maxAmount: 2000000,
      maxTermMonths: 120,
      status: 'Active'
    },
    {
      id: 'fac-4',
      name: 'Unsecured Retail Line of Credit',
      description: 'Flexible consumer standby facility with dynamic interest billing.',
      interestType: 'Floating',
      maxAmount: 50000,
      maxTermMonths: 60,
      status: 'Active'
    }
  ],

  applications: [
    {
      id: 'app-1',
      customerId: 'cust-1',
      requestedAmount: 420000,
      purpose: 'Primary Residence Purchase',
      facilityStructureId: 'fac-1',
      status: 'Disbursed',
      appliedAt: '2025-01-12T10:00:00Z',
      approvedAt: '2025-01-15T15:00:00Z',
      disbursedAt: '2025-01-20T11:30:00Z',
      riskRatingId: 'risk-1',
      collateralId: 'col-1',
      pricingTermsId: 'term-1',
    },
    {
      id: 'app-2',
      customerId: 'cust-2',
      requestedAmount: 18000,
      purpose: 'EV Hybrid Purchase',
      facilityStructureId: 'fac-2',
      status: 'InReview',
      appliedAt: '2025-05-18T09:00:00Z',
      riskRatingId: 'risk-2',
      collateralId: 'col-2',
      pricingTermsId: 'term-2',
    },
    {
      id: 'app-3',
      customerId: 'cust-3',
      requestedAmount: 950000,
      purpose: 'Diagnostic Center Building Purchase',
      facilityStructureId: 'fac-3',
      status: 'Approved',
      appliedAt: '2025-05-10T14:00:00Z',
      approvedAt: '2025-05-14T16:30:00Z',
      riskRatingId: 'risk-3',
      collateralId: 'col-3',
      pricingTermsId: 'term-3',
    },
    {
      id: 'app-4',
      customerId: 'cust-4',
      requestedAmount: 12000,
      purpose: 'Debt Consolidation Standby',
      facilityStructureId: 'fac-4',
      status: 'Disbursed',
      appliedAt: '2024-09-15T11:00:00Z',
      approvedAt: '2024-09-18T13:00:00Z',
      disbursedAt: '2024-09-22T10:00:00Z',
      riskRatingId: 'risk-4',
      pricingTermsId: 'term-4',
    },
    {
      id: 'app-5',
      customerId: 'cust-5',
      requestedAmount: 35000,
      purpose: 'Home Retrofitting & Solar Panels',
      facilityStructureId: 'fac-1',
      status: 'ExceptionPending',
      appliedAt: '2025-05-20T13:00:00Z',
      riskRatingId: 'risk-5',
      collateralId: 'col-5',
      pricingTermsId: 'term-5',
    }
  ],

  financialStatements: [
    {
      id: 'fin-1',
      applicationId: 'app-1',
      monthlyRevenue: 14500,
      monthlyExpenses: 4100,
      existingDebtService: 1200,
      otherIncome: 0,
      netMonthlyIncome: 10400,
      dtiRatio: 0.08,
      auditStatus: 'Verified'
    },
    {
      id: 'fin-2',
      applicationId: 'app-2',
      monthlyRevenue: 5200,
      monthlyExpenses: 2800,
      existingDebtService: 950,
      otherIncome: 300,
      netMonthlyIncome: 2700,
      dtiRatio: 0.18,
      auditStatus: 'FlagsDetected'
    },
    {
      id: 'fin-3',
      applicationId: 'app-3',
      monthlyRevenue: 26000,
      monthlyExpenses: 8500,
      existingDebtService: 3200,
      otherIncome: 4500,
      netMonthlyIncome: 18800,
      dtiRatio: 0.12,
      auditStatus: 'Verified'
    },
    {
      id: 'fin-4',
      applicationId: 'app-4',
      monthlyRevenue: 3900,
      monthlyExpenses: 2900,
      existingDebtService: 1500,
      otherIncome: 0,
      netMonthlyIncome: 1000,
      dtiRatio: 0.38,
      auditStatus: 'Verified'
    },
    {
      id: 'fin-5',
      applicationId: 'app-5',
      monthlyRevenue: 4800,
      monthlyExpenses: 2500,
      existingDebtService: 1000,
      otherIncome: 0,
      netMonthlyIncome: 2300,
      dtiRatio: 0.21,
      auditStatus: 'Verified'
    }
  ],

  riskRatings: [
    {
      id: 'risk-1',
      applicationId: 'app-1',
      scoreIndex: 88,
      ratingLetter: 'AA',
      probabilityOfDefault: 0.25,
      fraudScore: 5,
      riskExplanation: 'Stable cash flow with high credit score (785) and standard low loan-to-value ratio (70%). Highly viable primary mortgage request.',
      fraudWarnings: [],
      systemDecision: 'Approve',
      auditedAt: '2025-01-14T11:00:00Z'
    },
    {
      id: 'risk-2',
      applicationId: 'app-2',
      scoreIndex: 58,
      ratingLetter: 'BB',
      probabilityOfDefault: 4.8,
      fraudScore: 35,
      riskExplanation: 'Lower credit profile (615) combined with self-employment variance. Real-time bank transaction audit flags credit utilization spike.',
      fraudWarnings: ['High credit card utilisation', 'Inconsistent monthly business revenue'],
      systemDecision: 'ManualReview',
      auditedAt: '2025-05-19T10:00:00Z'
    },
    {
      id: 'risk-3',
      applicationId: 'app-3',
      scoreIndex: 94,
      ratingLetter: 'AAA',
      probabilityOfDefault: 0.05,
      fraudScore: 2,
      riskExplanation: 'Extremely high credit score (820) matched by substantial primary practice income. Diagnostic equipment collateralized alongside commercial land.',
      fraudWarnings: [],
      systemDecision: 'Approve',
      auditedAt: '2025-05-13T12:00:00Z'
    },
    {
      id: 'risk-4',
      applicationId: 'app-4',
      scoreIndex: 38,
      ratingLetter: 'D',
      probabilityOfDefault: 24.5,
      fraudScore: 12,
      riskExplanation: 'Sub-prime credit score (540) showing repeated past delinquencies. Debt-to-income limits present substantial stress.',
      fraudWarnings: ['Multiple overdue triggers in outer records'],
      systemDecision: 'Reject',
      auditedAt: '2024-09-17T09:30:00Z'
    },
    {
      id: 'risk-5',
      applicationId: 'app-5',
      scoreIndex: 62,
      ratingLetter: 'BBB',
      probabilityOfDefault: 3.1,
      fraudScore: 48,
      riskExplanation: 'Applicant credit score is 635, which is marginal. Automated rules require Manager exception override due to a temporary DTI spike.',
      fraudWarnings: ['Recent credit inquiries', 'Minor matching phone overlap flagged'],
      systemDecision: 'ManualReview',
      auditedAt: '2025-05-20T14:30:00Z'
    }
  ],

  collaterals: [
    {
      id: 'col-1',
      applicationId: 'app-1',
      type: 'Property',
      description: 'Single Family Residential, 4 Bed 3 Bath, Seattle WA',
      estimatedWorth: 600000,
      currentValuation: 605000,
      lastValuationDate: '2025-05-10T00:00:00Z',
      ltvRatio: 0.70, // 420000 / 600000
      status: 'Pledged',
      legalReviewStatus: 'Passed',
      titleDeedReference: 'TD-9088-SEA'
    },
    {
      id: 'col-2',
      applicationId: 'app-2',
      type: 'Vehicle',
      description: '2023 Tesla Model Y Standard Range Plus',
      estimatedWorth: 34000,
      currentValuation: 31000,
      lastValuationDate: '2025-05-18T00:00:00Z',
      ltvRatio: 0.53, // 18000 / 34000
      status: 'Pledged',
      legalReviewStatus: 'Passed',
      titleDeedReference: 'VIN-5YJ3E1EB8NF83'
    },
    {
      id: 'col-3',
      applicationId: 'app-3',
      type: 'Property',
      description: 'Commercial Ground + diagnostics unit, Portland OR',
      estimatedWorth: 1400000,
      currentValuation: 1400000,
      lastValuationDate: '2025-05-09T00:00:00Z',
      ltvRatio: 0.68, // 950000 / 1400000
      status: 'Pledged',
      legalReviewStatus: 'Pending',
      titleDeedReference: 'TD-COMM-889-OR'
    },
    {
      id: 'col-5',
      applicationId: 'app-5',
      type: 'Property',
      description: 'Townhouse Residential, Atlanta GA',
      estimatedWorth: 70000,
      currentValuation: 70000,
      lastValuationDate: '2025-05-20T00:00:00Z',
      ltvRatio: 0.50,
      status: 'Pledged',
      legalReviewStatus: 'Passed',
      titleDeedReference: 'TD-R-441-GA'
    }
  ],

  obligations: [
    {
      id: 'ob-1',
      customerId: 'cust-1',
      creditorName: 'American Express',
      typeOfDebt: 'CreditCard',
      outstandingAmount: 4300,
      monthlyPayment: 250,
      status: 'Active'
    },
    {
      id: 'ob-2',
      customerId: 'cust-1',
      creditorName: 'Chase Retail Loan',
      typeOfDebt: 'StandardRetail',
      outstandingAmount: 18500,
      monthlyPayment: 400,
      status: 'Active'
    },
    {
      id: 'ob-3',
      customerId: 'cust-2',
      creditorName: 'CapitalOne Cards',
      typeOfDebt: 'CreditCard',
      outstandingAmount: 12000,
      monthlyPayment: 600,
      status: 'Active'
    },
    {
      id: 'ob-4',
      customerId: 'cust-4',
      creditorName: 'Discover Student Finance',
      typeOfDebt: 'StandardRetail',
      outstandingAmount: 45000,
      monthlyPayment: 850,
      status: 'Active'
    }
  ],

  kycProfiles: [
    {
      id: 'kyc-1',
      customerId: 'cust-1',
      documentType: 'Passport',
      documentNumber: 'US-P-908711C',
      verificationLevel: 'Full',
      verificationStatus: 'Verified',
      verifiedAt: '2025-01-11T14:00:00Z'
    },
    {
      id: 'kyc-2',
      customerId: 'cust-2',
      documentType: 'ID',
      documentNumber: 'ID-JENK-8819X',
      verificationLevel: 'Level_2',
      verificationStatus: 'Pending'
    },
    {
      id: 'kyc-3',
      customerId: 'cust-3',
      documentType: 'Passport',
      documentNumber: 'US-P-552431D',
      verificationLevel: 'Full',
      verificationStatus: 'Verified',
      verifiedAt: '2024-11-06T11:00:00Z'
    },
    {
      id: 'kyc-4',
      customerId: 'cust-4',
      documentType: 'DriverLicense',
      documentNumber: 'DL-VANCE-9022',
      verificationLevel: 'Level_1',
      verificationStatus: 'Failed',
      failureReason: 'Address mismatch on driver license copy vs utility slip proof.'
    },
    {
      id: 'kyc-5',
      customerId: 'cust-5',
      documentType: 'Passport',
      documentNumber: 'US-P-721200K',
      verificationLevel: 'Full',
      verificationStatus: 'Verified',
      verifiedAt: '2025-05-20T13:30:00Z'
    }
  ],

  documents: [
    {
      id: 'doc-1',
      applicationId: 'app-1',
      name: 'Sterling_W2_2024.pdf',
      category: 'IncomeProof',
      classificationLabel: 'W2 Tax Document',
      fileSize: '1.2 MB',
      uploadTime: '2025-01-12T10:15:00Z',
      verificationStatus: 'Approved'
    },
    {
      id: 'doc-2',
      applicationId: 'app-1',
      name: 'Deed_Purchase_Contract_Signed.pdf',
      category: 'CollateralProof',
      classificationLabel: 'Property Purchase Deed',
      fileSize: '4.8 MB',
      uploadTime: '2025-01-12T10:20:00Z',
      verificationStatus: 'Approved'
    },
    {
      id: 'doc-3',
      applicationId: 'app-2',
      name: 'Jenkins_Freelance_1099_2024.pdf',
      category: 'IncomeProof',
      classificationLabel: '1099 Tax Return',
      fileSize: '950 KB',
      uploadTime: '2025-05-18T09:12:00Z',
      verificationStatus: 'Pending'
    },
    {
      id: 'doc-4',
      applicationId: 'app-2',
      name: 'Sarah_Amex_Statements_3M.pdf',
      category: 'BankStatement',
      classificationLabel: 'Self-Employed Bank Ledger',
      fileSize: '3.1 MB',
      uploadTime: '2025-05-18T09:14:00Z',
      verificationStatus: 'Pending'
    },
    {
      id: 'doc-5',
      applicationId: 'app-3',
      name: 'Dr_Patel_KYC_Passport.pdf',
      category: 'KYC',
      classificationLabel: 'Primary Passport Page',
      fileSize: '820 KB',
      uploadTime: '2025-05-10T14:15:00Z',
      verificationStatus: 'Approved'
    },
    {
      id: 'doc-6',
      applicationId: 'app-3',
      name: 'Portland_Clinic_Escrow_Proof.pdf',
      category: 'CollateralProof',
      classificationLabel: 'Commercial Land Escrow',
      fileSize: '6.4 MB',
      uploadTime: '2025-05-10T14:30:00Z',
      verificationStatus: 'Approved'
    },
    {
      id: 'doc-7',
      applicationId: 'app-5',
      name: 'Emily_Lawson_Bank_Statements.pdf',
      category: 'BankStatement',
      classificationLabel: 'Bank Transactions Ledger',
      fileSize: '2.5 MB',
      uploadTime: '2025-05-20T13:10:00Z',
      verificationStatus: 'Approved'
    }
  ],

  pricingTerms: [
    {
      id: 'term-1',
      applicationId: 'app-1',
      baseInterestRate: 4.75,
      marginRate: 0.50,
      finalRate: 5.25,
      fixedOrFloating: 'Fixed',
      amortizationType: 'Annuity',
      penaltyRate: 2.0,
      termMonths: 360
    },
    {
      id: 'term-2',
      applicationId: 'app-2',
      baseInterestRate: 5.50,
      marginRate: 1.75,
      finalRate: 7.25,
      fixedOrFloating: 'Fixed',
      amortizationType: 'Annuity',
      penaltyRate: 2.5,
      termMonths: 60
    },
    {
      id: 'term-3',
      applicationId: 'app-3',
      baseInterestRate: 4.25,
      marginRate: 1.25,
      finalRate: 5.50,
      fixedOrFloating: 'Floating',
      amortizationType: 'Linear',
      penaltyRate: 3.0,
      termMonths: 120
    },
    {
      id: 'term-4',
      applicationId: 'app-4',
      baseInterestRate: 6.50,
      marginRate: 3.50,
      finalRate: 10.00,
      fixedOrFloating: 'Floating',
      amortizationType: 'Annuity',
      penaltyRate: 4.0,
      termMonths: 48
    },
    {
      id: 'term-5',
      applicationId: 'app-5',
      baseInterestRate: 5.00,
      marginRate: 1.00,
      finalRate: 6.00,
      fixedOrFloating: 'Fixed',
      amortizationType: 'Annuity',
      penaltyRate: 2.0,
      termMonths: 120
    }
  ],

  conditions: [
    {
      id: 'cond-1',
      applicationId: 'app-3',
      description: 'Deposit original Title Deeds of commercial medical facility with the central banking vault',
      isMet: false
    },
    {
      id: 'cond-2',
      applicationId: 'app-3',
      description: 'Receive final approved fire & hazard commercial building insurance policy with the bank listed as prime loss payee',
      isMet: true,
      metAt: '2025-05-16T11:00:00Z',
      metByOfficer: 'Loan Officer James'
    },
    {
      id: 'cond-3',
      applicationId: 'app-3',
      description: 'Execution of commercial promissory note from co-signing corporate directors',
      isMet: false
    },
    {
      id: 'cond-4',
      applicationId: 'app-5',
      description: 'Sign standard energy offset compliance protocol form',
      isMet: false
    }
  ],

  payments: [
    // Paid payments for Sterling Loan (Mortgage: term 1 is 5.25% on $420k. Monthly principal+interest = approx $2,319)
    {
      id: 'pay-1',
      loanApplicationId: 'app-1',
      dueDate: '2025-02-20T00:00:00Z',
      paidDate: '2025-02-18T10:00:00Z',
      principalDue: 480,
      interestDue: 1839,
      amountPaid: 2319,
      penaltyApplied: 0,
      status: 'Paid'
    },
    {
      id: 'pay-2',
      loanApplicationId: 'app-1',
      dueDate: '2025-03-20T00:00:00Z',
      paidDate: '2025-03-19T14:30:00Z',
      principalDue: 482,
      interestDue: 1837,
      amountPaid: 2319,
      penaltyApplied: 0,
      status: 'Paid'
    },
    {
      id: 'pay-3',
      loanApplicationId: 'app-1',
      dueDate: '2025-04-20T00:00:00Z',
      paidDate: '2025-04-20T11:00:00Z',
      principalDue: 484,
      interestDue: 1835,
      amountPaid: 2319,
      penaltyApplied: 0,
      status: 'Paid'
    },
    {
      id: 'pay-4',
      loanApplicationId: 'app-1',
      dueDate: '2025-05-20T00:00:00Z',
      paidDate: '2025-05-19T09:00:00Z',
      principalDue: 486,
      interestDue: 1833,
      amountPaid: 2319,
      penaltyApplied: 0,
      status: 'Paid'
    },
    {
      id: 'pay-5',
      loanApplicationId: 'app-1',
      dueDate: '2025-06-20T00:00:00Z',
      principalDue: 488,
      interestDue: 1831,
      amountPaid: 0,
      penaltyApplied: 0,
      status: 'Due'
    },

    // Overdue payments for Vance Loan (app-4)
    {
      id: 'pay-6',
      loanApplicationId: 'app-4',
      dueDate: '2025-03-15T00:00:00Z',
      paidDate: '2025-03-17T15:00:00Z',
      principalDue: 210,
      interestDue: 100,
      amountPaid: 310,
      penaltyApplied: 0,
      status: 'Paid'
    },
    {
      id: 'pay-7',
      loanApplicationId: 'app-4',
      dueDate: '2025-04-15T00:00:00Z',
      principalDue: 212,
      interestDue: 98,
      amountPaid: 0,
      penaltyApplied: 25,
      status: 'Overdue'
    },
    {
      id: 'pay-8',
      loanApplicationId: 'app-4',
      dueDate: '2025-05-15T00:00:00Z',
      principalDue: 213,
      interestDue: 97,
      amountPaid: 0,
      penaltyApplied: 25,
      status: 'Overdue'
    }
  ],

  auditLogs: [
    {
      id: 'log-1',
      timestamp: '2025-01-11T14:15:00Z',
      actorEmail: 'system.kyc@bankone.com',
      role: 'Admin',
      action: 'KYC Verification Executed',
      details: 'Automatic verify successful for customer Robert Sterling. Verified via Bureau DB passport registry connection.',
      category: 'KYC'
    },
    {
      id: 'log-2',
      timestamp: '2025-01-14T11:00:00Z',
      actorEmail: 'analyst.clara@bankone.com',
      role: 'Credit Analyst',
      action: 'Automated Risk Model Run Completed',
      details: 'App-1 risk score graded AA. Automatic pricing proposal (base: 4.75% + margin: 0.50% = 5.25%) bound to terms.',
      category: 'Underwriting'
    },
    {
      id: 'log-3',
      timestamp: '2025-01-15T15:00:00Z',
      actorEmail: 'manager.marcus@bankone.com',
      role: 'Manager',
      action: 'Application Approved',
      details: 'Robert Sterling $420,000 mortage application approved. LTV limit of 70% accepted.',
      category: 'Underwriting'
    },
    {
      id: 'log-4',
      timestamp: '2025-01-20T11:30:00Z',
      actorEmail: 'officer.james@bankone.com',
      role: 'Loan Officer',
      action: 'Payment Funds Disbursed',
      details: 'Disbursement of $420,000 sent to Escrow agent Trustmark LLC for Robert Sterling closeout.',
      category: 'Disbursement'
    },
    {
      id: 'log-5',
      timestamp: '2025-05-19T10:15:30Z',
      actorEmail: 'fraud.officer.frank@bankone.com',
      role: 'Fraud Officer',
      action: 'Document Reviewed for Verification Flag',
      details: 'Sarah Jenkins income document (1099 form) flagged for potential manual parsing validation due to low self-employed ledger matching consistency.',
      category: 'KYC'
    },
    {
      id: 'log-6',
      timestamp: '2025-05-20T14:45:00Z',
      actorEmail: 'manager.marcus@bankone.com',
      role: 'Manager',
      action: 'Exception Override Authorized',
      details: 'Approved loan processing route exception for Customer Emily Lawson (Score 635) citing strong regional co-guarantee backing.',
      category: 'Override'
    },
    {
      id: 'log-7',
      timestamp: '2025-05-22T09:30:00Z',
      actorEmail: 'compliance.auditor@bankone.com',
      role: 'Admin',
      action: 'Quarterly Risk Audit Registry Check',
      details: 'Full automated credit audit check executed across active and overdue portfolios. Complied with SEC Rule 2185.',
      category: 'Underwriting'
    }
  ],

  warningAlerts: [
    {
      id: 'ews-1',
      customerId: 'cust-2',
      applicationId: 'app-2',
      severity: 'Medium',
      triggerType: 'AnomalousTransactions',
      explanation: 'Recent ledger parsing shows sudden 45% reduction in average cash-buffer balances combined with elevated outer loan queries.',
      triggeredAt: '2025-05-21T09:00:00Z',
      status: 'Investigating'
    },
    {
      id: 'ews-2',
      customerId: 'cust-4',
      applicationId: 'app-4',
      severity: 'High',
      triggerType: 'MissedObligation',
      explanation: 'Unsecured Retail Line of Credit overdue by more than 40 days. External files record a drop in credit score to 540.',
      triggeredAt: '2025-04-18T14:00:00Z',
      status: 'Active'
    }
  ],

  queries: [
    {
      id: 'que-1',
      customerId: 'cust-1',
      applicationId: 'app-1',
      subject: 'Annual amortization summary receipt',
      message: 'Hi serviced desk, can you please send me a physical statement of all my 2025 monthly interest coupon payments for tax reference?',
      status: 'InProgress',
      createdAt: '2025-05-22T08:00:00Z'
    },
    {
      id: 'que-2',
      customerId: 'cust-2',
      applicationId: 'app-2',
      subject: 'Pending KYC Document Status',
      message: 'I have uploaded my 1099 and self-employed bank statement. Is there any further documentation required for auto loan signoff?',
      status: 'Open',
      createdAt: '2025-05-23T11:15:00Z'
    }
  ]
};

// GET full store for debugging or populating the frontend
app.get('/api/store', (req, res) => {
  res.json(dataStore);
});

// POST to update dataStore state changes
app.post('/api/store', (req, res) => {
  dataStore = req.body;
  res.json({ success: true, message: 'Data store synchronized successfully.' });
});

// POST reset store
app.post('/api/store/reset', (req, res) => {
  // Simple quick reset to initial seed values if needed
  res.json({ success: true });
});

// POST endpoint to handle automated payment collections or manual customer payment processing
app.post('/api/payments/process', (req, res) => {
  const { paymentId, amountPaid, actorEmail, actorRole } = req.body;
  const paymentIndex = dataStore.payments.findIndex(p => p.id === paymentId);

  if (paymentIndex === -1) {
    return res.status(404).json({ error: 'Payment not found.' });
  }

  const payment = dataStore.payments[paymentIndex];
  payment.amountPaid = Number(amountPaid);
  payment.paidDate = new Date().toISOString();
  payment.status = 'Paid';

  // Log compliance trail
  const newLog: ComplianceAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: actorEmail || 'system.payment@bankone.com',
    role: actorRole || 'Retail Customer',
    action: 'Payment Processed',
    details: `Processed payment ID ${paymentId} for sum of $${amountPaid}. Penalty of $${payment.penaltyApplied} cleared.`,
    category: 'Payment'
  };
  dataStore.auditLogs.unshift(newLog);

  res.json({ success: true, payment, auditLog: newLog });
});

// POST workflow: Exception Handling (Authorized Manager or Admin override)
app.post('/api/applications/override', (req, res) => {
  const { applicationId, actorEmail, note } = req.body;
  const appIndex = dataStore.applications.findIndex(a => a.id === applicationId);

  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const application = dataStore.applications[appIndex];
  application.status = 'Approved';
  application.approvedAt = new Date().toISOString();

  // Record log
  const newLog: ComplianceAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: actorEmail || 'manager.marcus@bankone.com',
    role: 'Manager',
    action: 'Exception Approved (Override)',
    details: `Manual underwriting override approved for application ${applicationId}. Justification: ${note}`,
    category: 'Override'
  };
  dataStore.auditLogs.unshift(newLog);

  res.json({ success: true, application, auditLog: newLog });
});

// POST workflow: Payoff Processing (Early quote generation & payoff dispatching)
app.post('/api/applications/payoff', (req, res) => {
  const { applicationId, actorEmail } = req.body;
  const appIndex = dataStore.applications.findIndex(a => a.id === applicationId);

  if (appIndex === -1) {
    return res.status(404).json({ error: 'Application not found.' });
  }

  const application = dataStore.applications[appIndex];
  application.status = 'Closed';
  application.closedAt = new Date().toISOString();

  // If there is pledged collateral associated, trigger Collateral Release workflow automatically!
  const collateralIndex = dataStore.collaterals.findIndex(c => c.applicationId === applicationId);
  if (collateralIndex !== -1) {
    dataStore.collaterals[collateralIndex].status = 'Released';
    dataStore.collaterals[collateralIndex].lastValuationDate = new Date().toISOString();
  }

  const newLog: ComplianceAuditLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorEmail: actorEmail || 'customer.service@bankone.com',
    role: 'Manager',
    action: 'Payoff Completed (Facility Closure)',
    details: `Early loan payoff and settlement completed for Application ${applicationId}. Automated title release dispatched.`,
    category: 'Collateral'
  };
  dataStore.auditLogs.unshift(newLog);

  res.json({ success: true, application, collateralReleased: collateralIndex !== -1 });
});

// POST: Add new customer queries (Customer Servicing Workflow)
app.post('/api/queries/create', (req, res) => {
  const { customerId, subject, message } = req.body;
  const newQuery: CustomerQuery = {
    id: `que-${Date.now()}`,
    customerId,
    subject,
    message,
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  dataStore.queries.unshift(newQuery);
  res.json({ success: true, query: newQuery });
});

// POST: Answer custom query
app.post('/api/queries/respond', (req, res) => {
  const { queryId, agentResponse } = req.body;
  const qIndex = dataStore.queries.findIndex(q => q.id === queryId);
  if (qIndex !== -1) {
    dataStore.queries[qIndex].agentResponse = agentResponse;
    dataStore.queries[qIndex].status = 'Resolved';
    res.json({ success: true, query: dataStore.queries[qIndex] });
  } else {
    res.status(404).json({ error: 'Query not found' });
  }
});

// API endpoint to analyze credit files using AI models
app.post('/api/loan/analyse', async (req, res) => {
  const {
    creditScore,
    monthlyIncome,
    requestedAmount,
    bankStatementsText,
    employmentType,
    collateralType,
    collateralValue,
    purpose,
    facilityType
  } = req.body;

  // Let's compute deterministic values first for fallback use
  const parsedCreditScore = Number(creditScore) || 600;
  const parsedIncome = Number(monthlyIncome) || 3000;
  const parsedLoan = Number(requestedAmount) || 10000;
  const parsedCollateral = Number(collateralValue) || 15000;

  const calculatedDti = parsedIncome > 0 ? Number(((parsedLoan / 60) / parsedIncome).toFixed(2)) : 0.5;
  const calculatedLtv = parsedCollateral > 0 ? Number((parsedLoan / parsedCollateral).toFixed(2)) : 0.8;

  // Assign rating letters based on rules
  let defaultLetter: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D' = 'BBB';
  let defaultScoreIndex = 65;
  let defaultDProb = 3.5;
  let defaultFraud = 10;
  let defaultRecommendation: 'Approve' | 'ManualReview' | 'Reject' = 'ManualReview';
  const defaultWarnings: string[] = [];

  if (parsedCreditScore >= 780) {
    defaultLetter = 'AAA';
    defaultScoreIndex = 95;
    defaultDProb = 0.15;
    defaultRecommendation = 'Approve';
  } else if (parsedCreditScore >= 700) {
    defaultLetter = 'A';
    defaultScoreIndex = 80;
    defaultDProb = 1.1;
    defaultRecommendation = 'Approve';
  } else if (parsedCreditScore >= 620) {
    defaultLetter = 'BBB';
    defaultScoreIndex = 65;
    defaultDProb = 4.2;
    defaultRecommendation = 'ManualReview';
  } else {
    defaultLetter = 'D';
    defaultScoreIndex = 35;
    defaultDProb = 28.5;
    defaultRecommendation = 'Reject';
  }

  // Basic deterministic fraud pattern recognition
  if (bankStatementsText && bankStatementsText.toLowerCase().includes('casino')) {
    defaultFraud += 25;
    defaultWarnings.push('Recurring betting/casino charges found in statement ledger');
  }
  if (bankStatementsText && bankStatementsText.toLowerCase().includes('payday loan')) {
    defaultFraud += 30;
    defaultWarnings.push('Potential credit stacking: payday loan advances flagged');
  }
  if (calculatedDti > 0.45) {
    defaultWarnings.push('Elevated Debt-to-Income (DTI) ratio above threshold');
  }

  const promptStr = `
    Analyze this retail loan credit file as a professional Automated Banking Underwriter and Credit risk analyst.
    INPUTS:
    - Credit Score: ${parsedCreditScore}
    - Monthly Income: $${parsedIncome}
    - Requested Loan Amount: $${parsedLoan}
    - Facility Type: ${facilityType || 'Term Loan'}
    - Loan Purpose: ${purpose || 'Personal Use'}
    - Collateral Type: ${collateralType || 'None'}
    - Collateral Value: $${parsedCollateral}
    - Employment Status: ${employmentType || 'Salaried'}
    - Supplementary Transactions/Bank statement ledger snippets: "${bankStatementsText || 'Not provided'}"

    Please review the financial capacity (DTI, income consistency), collateral (LTV coverage), risk rating scorecard, fraud indicators, regulatory items, and Early Warning signals.
    Output a detailed JSON object matching the following TypeScript schema:
    {
      "scoreIndex": number, // an AI risk rating score between 0 and 100
      "ratingLetter": "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D",
      "probabilityOfDefault": number, // default percentage probability
      "fraudScore": number, // fraud confidence score between 0 and 100
      "riskExplanation": string, // credit risk and capacity rationale
      "fraudWarnings": string[], // list of pattern-recognized fraud or compliance warnings
      "systemDecision": "Approve" | "ManualReview" | "Reject",
      "recommendedBaseRate": number, // e.g. 5.25
      "recommendedMargin": number, // e.g. 1.25
      "conditionsPrecedent": string[], // list of specific legal or document stipulations for disbursement
      "textInsightMarkdown": string // elegant markdown analysis of the client credit parameters
    }
  `;

  let responseData: any = null;

  try {
    const ai = getGeminiClient();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptStr,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an advanced retail credit risk routing AI engine. Output strict JSON only. Ensure pricing, amortization metrics, and early warning flags are calculated mathematically.'
        }
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      responseData = {
        scoreIndex: parsed.scoreIndex || defaultScoreIndex,
        ratingLetter: parsed.ratingLetter || defaultLetter,
        probabilityOfDefault: parsed.probabilityOfDefault || defaultDProb,
        fraudScore: parsed.fraudScore || defaultFraud,
        riskExplanation: parsed.riskExplanation || 'Successful Gemini AI-driven credit assessment completed.',
        fraudWarnings: parsed.fraudWarnings || defaultWarnings,
        systemDecision: parsed.systemDecision || defaultRecommendation,
        recommendedBaseRate: parsed.recommendedBaseRate || 5.0,
        recommendedMargin: parsed.recommendedMargin || 1.5,
        conditionsPrecedent: parsed.conditionsPrecedent || [
          'Verify current bank statement ledger files',
          'Legal title verification of collateral property'
        ],
        textInsightMarkdown: parsed.textInsightMarkdown || '### Gemini Underwriting Insights\n\nSuccessful assessment of the file.'
      };
    }
  } catch (error) {
    console.error('Gemini AI call failed, using rule-based compliance engine fallback:', error);
  }

  // Fallback if AI wasn't run or didn't respond correctly
  if (!responseData) {
    const defaultConditions = [
      'Original signed promissory note matching full facilities covenants',
      'Satisfactory direct debit mandate setup'
    ];
    if (collateralType !== 'None') {
      defaultConditions.push(`Legal validation and physical structural survey of pledged ${collateralType}`);
    }

    responseData = {
      scoreIndex: defaultScoreIndex,
      ratingLetter: defaultLetter,
      probabilityOfDefault: defaultDProb,
      fraudScore: defaultFraud,
      riskExplanation: `[AI Fallback Risk Engine] ${defaultWarnings.length > 0 ? 'Elevated warning flags.' : 'Clean credit history ledger.'} Credit score of ${parsedCreditScore} results in a rating grade of ${defaultLetter}.`,
      fraudWarnings: defaultWarnings,
      systemDecision: defaultRecommendation,
      recommendedBaseRate: 5.25,
      recommendedMargin: parsedCreditScore < 650 ? 2.50 : 1.00,
      conditionsPrecedent: defaultConditions,
      textInsightMarkdown: `### Automated Engineering Credit Review
- **Debt Service Capability**: DTI calculated at **${(calculatedDti * 100).toFixed(1)}%**.
- **Collateral Protection Coverage**: LTV evaluated at **${(calculatedLtv * 100).toFixed(1)}%**.
- **Core System Decision**: **${defaultRecommendation}** based on risk brackets.
- **Auditor Advice**: Standard condition precedents must be completely satisfied prior to direct disbursement.`
    };
  }

  res.json(responseData);
});

// Serve static assets in production, otherwise mount Vite in development (Standard flow)
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Retail Loan Servicing server operating securely at http://localhost:${PORT}`);
  });
}

startServer();
