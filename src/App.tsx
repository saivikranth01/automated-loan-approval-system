/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserRole,
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
  ServerDataStore
} from './types';
import {
  ShieldCheck,
  User,
  Users,
  Briefcase,
  Sliders,
  DollarSign,
  FileCheck,
  Search,
  FileText,
  AlertTriangle,
  LogOut,
  Sparkles,
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  HardDrive,
  CheckSquare,
  Lock,
  UploadCloud,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  ChevronRight,
  Inbox,
  Award,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Navigation & Role states
  const [selectedRole, setSelectedRole] = useState<UserRole>('Retail Customer');
  const [selectedWorkflowTab, setSelectedWorkflowTab] = useState<string>('AI Early Warning');

  // Portal Select Mode (Separating Customer Self-Service from Executive Bank Analytics)
  const [portalMode, setPortalMode] = useState<'customer' | 'bank'>('customer');
  const [customerActiveTab, setCustomerActiveTab] = useState<'dashboard' | 'documents' | 'payments' | 'disputes'>('dashboard');

  const handlePortalSwitch = (mode: 'customer' | 'bank') => {
    setPortalMode(mode);
    if (mode === 'customer') {
      setSelectedRole('Retail Customer');
      setSelectedWorkflowTab('AI Early Warning');
      triggerToast('Switched to Customer Self-Service Portal. Internal bank analysis locked.');
    } else {
      setSelectedRole('Loan Officer');
      setSelectedWorkflowTab('Collateral Monitoring');
      triggerToast('Unlocked Vanguard Bank Staff Risk & Operations Terminal.');
    }
  };
  
  // Dynamic Synchronized Portfolios
  const [store, setStore] = useState<ServerDataStore | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  
  // Selected resource item states
  const [selectedAppId, setSelectedAppId] = useState<string>('app-5');
  const [selectedCustomerIdForServicing, setSelectedCustomerIdForServicing] = useState<string>('cust-1');

  // Customer application wizard state
  const [creditScore, setCreditScore] = useState<number>(710);
  const [requestedAmount, setRequestedAmount] = useState<number>(45000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(6500);
  const [loanPurpose, setLoanPurpose] = useState<string>('Green Home Solar Panel Installation');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('fac-1');
  const [employmentType, setEmploymentType] = useState<'Salaried' | 'SelfEmployed' | 'Contractor' | 'Unemployed'>('Salaried');
  const [collateralType, setCollateralType] = useState<'Property' | 'Vehicle' | 'Gold' | 'Securities' | 'Equipment'>('Property');
  const [collateralDescription, setCollateralDescription] = useState<string>('Suburban Residential Home, GA');
  const [collateralWorth, setCollateralWorth] = useState<number>(85000);
  const [bankStatementsText, setBankStatementsText] = useState<string>(
    'Deposit 05/01: $6,500 Salary Payroll\nTransfer 05/05: -$450 Auto Credit payment\nAtm 05/10: -$120 Cash Out\nUtilities 05/12: -$230 Electricity Grid'
  );

  // PDF Uploader implementation
  const [uploadingPdf, setUploadingPdf] = useState<boolean>(false);
  const [uploadedPdfName, setUploadedPdfName] = useState<string | null>(null);

  const handlePdfStatementUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setUploadedPdfName(file.name);
    triggerToast(`AI scanning & parsing "${file.name}" for OCR bank transaction ledger data...`);

    setTimeout(() => {
      let simulatedTransactions = '';
      const filenameLower = file.name.toLowerCase();

      if (filenameLower.includes('fraud') || filenameLower.includes('risk') || filenameLower.includes('warning') || filenameLower.includes('bad')) {
        simulatedTransactions = [
          'Deposit 05/01: $3,200 Self-Employed Direct Deposit Refund',
          'Transfer 05/02: -$1,200 Golden Crown Online Casino (Wager deposit)',
          'Withdrawal 05/04: -$950 ATM Emergency Cash Advance',
          'Payment 05/08: -$350 QuickCash Payday Loan (Urgent rollover fee)',
          'Debit 05/10: -$480 Lucky Streak Gaming / Sportsbook',
          'Transfer 05/15: -$250 External Consumer Debt payout'
        ].join('\n');
        triggerToast('OCR Complete: Parsed 6 transactions with elevated risk indicators!');
      } else {
        simulatedTransactions = [
          'Deposit 05/01: $7,500 Sterling Corp Payroll Credit',
          'Transfer 05/03: -$420 Principal Auto Finance Payment',
          'Debit 05/07: -$180 WholeFoods Market Grocery Store',
          'Refund 05/09: +$250 IRS Tax Offset Credit Return',
          'Payment 05/12: -$210 Electric Board Energy Offset Utility',
          'Deposit 05/15: $1,200 External Consulting Honorarium Fee',
          'Debit 05/18: -$85 Costco Wholesale Membership Outlet'
        ].join('\n');
        triggerToast(`OCR Complete: Successfully parsed 7 clear transaction items from "${file.name}"!`);
      }

      setBankStatementsText(simulatedTransactions);
      setUploadingPdf(false);

      // Append this bank statement automatically to the documents ledger database and audit log
      if (store) {
        const newDoc: SupportingDocument = {
          id: `doc-${Date.now()}`,
          applicationId: selectedAppId,
          name: file.name,
          category: 'BankStatement',
          classificationLabel: 'Verified OCR Bank Statement Ledger',
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB` === '0.0 MB' ? '1.4 MB' : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadTime: new Date().toISOString(),
          verificationStatus: 'Approved'
        };

        const updatedStore: ServerDataStore = {
          ...store,
          documents: [newDoc, ...store.documents],
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actorEmail: 'saivikranthpulikonda@gmail.com',
              role: 'Retail Customer',
              action: 'Bank Statement Uploaded (PDF Parser)',
              details: `Self-service PDF bank statement "${file.name}" uploaded. Underwriter AI extracted transactions ledger transcript.`,
              category: 'KYC'
            },
            ...store.auditLogs
          ]
        };
        syncStoreToBackend(updatedStore);
      }
    }, 2000);
  };

  // New Document Upload helper state
  const [docName, setDocName] = useState<string>('Tax_Summary_Assessment.pdf');
  const [docCategory, setDocCategory] = useState<'KYC' | 'IncomeProof' | 'CollateralProof' | 'BankStatement'>('IncomeProof');
  const [docClassification, setDocClassification] = useState<string>('W2 Form / 1099 Transcript');
  
  // Custom Customer Query input
  const [customerQuerySubject, setCustomerQuerySubject] = useState<string>('Amortization Revision Query');
  const [customerQueryMessage, setCustomerQueryMessage] = useState<string>('Hello, I am requesting a minor revision to my payment terms due to an upcoming energy offset rebate credit. Thanks.');

  // AI Analyzed output state
  const [aiReport, setAiReport] = useState<{
    scoreIndex: number;
    ratingLetter: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'D';
    probabilityOfDefault: number;
    fraudScore: number;
    riskExplanation: string;
    fraudWarnings: string[];
    systemDecision: 'Approve' | 'ManualReview' | 'Reject';
    recommendedBaseRate: number;
    recommendedMargin: number;
    conditionsPrecedent: string[];
    textInsightMarkdown: string;
  } | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);

  // Manager Overrides and workflow state
  const [managerOverrideNote, setManagerOverrideNote] = useState<string>('Exception approved based on collateral value and strong credit files matching guidelines.');
  const [agentResponseText, setAgentResponseText] = useState<string>('We have reviewed your documents and updated your loan compliance profile. Statement sent.');
  
  // Amendment panel state
  const [amendmentRate, setAmendmentRate] = useState<number>(6.5);
  const [amendmentTerm, setAmendmentTerm] = useState<number>(120);

  // Fetch complete data store state from Express server on load
  const fetchStoreAndSync = async () => {
    try {
      const response = await fetch('/api/store');
      if (response.ok) {
        const data = await response.json();
        setStore(data);
      } else {
        setErrorMsg('Failed to sync data store state from remote bank database cluster.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error communicating with underlying API. Running rules locally.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreAndSync();
  }, []);

  // Update backend store whenever client makes edits
  const syncStoreToBackend = async (updatedStore: ServerDataStore) => {
    try {
      await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStore),
      });
      setStore(updatedStore);
    } catch (err) {
      console.error('Failed to sync to server database', err);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  // Run AI Underwriter Model Analyser
  const handleAIAnalysis = async () => {
    setAnalyzing(true);
    setAiReport(null);
    try {
      const response = await fetch('/api/loan/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditScore,
          monthlyIncome,
          requestedAmount,
          bankStatementsText,
          employmentType,
          collateralType,
          collateralValue: collateralWorth,
          purpose: loanPurpose,
          facilityType: selectedFacilityId === 'fac-1' ? 'Home Mortgage' : 'Auto Finance'
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiReport(data);
        triggerToast('AI Automated Loan Underwriting analysis completed successfully!');
      } else {
        triggerToast('Warning: High portfolio traffic. AI model yielded fallback assessment metrics.');
      }
    } catch (e) {
      console.error(e);
      triggerToast('Underwriter API error. Localized risk scorecard calculated.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Submit Newly created Customer Application wizard
  const handleSubmitApplication = () => {
    if (!store) return;

    const newAppId = `app-${Date.now()}`;
    const newCustId = `cust-${Date.now()}`;
    const newCollateralId = collateralType !== 'None' ? `col-${Date.now()}` : '';
    const newRiskId = `risk-${Date.now()}`;
    const newTermId = `term-${Date.now()}`;

    // Create 1. Customer Core Data Object
    const newCustomer: Customer = {
      id: newCustId,
      name: 'Logged-in Customer User',
      email: 'saivikranthpulikonda@gmail.com', // Direct from context
      phone: '+1 (555) 777-1020',
      creditScore,
      monthlyIncome,
      employmentType,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    // Create 5. Collateral Core Data Object
    const newCollateral: Collateral = {
      id: newCollateralId || `col-dummy`,
      applicationId: newAppId,
      type: collateralType,
      description: collateralDescription,
      estimatedWorth: collateralWorth,
      currentValuation: collateralWorth,
      lastValuationDate: new Date().toISOString(),
      ltvRatio: Number((requestedAmount / collateralWorth).toFixed(2)),
      status: 'Pledged',
      legalReviewStatus: 'Pending',
      titleDeedReference: `TD-PLG-${Math.floor(1000 + Math.random() * 9000)}-GA`
    };

    // Create 4. Risk Rating Core Data Object
    const newRisk: RiskRating = {
      id: newRiskId,
      applicationId: newAppId,
      scoreIndex: aiReport?.scoreIndex || (creditScore > 700 ? 85 : 55),
      ratingLetter: aiReport?.ratingLetter || (creditScore > 700 ? 'A' : 'BBB'),
      probabilityOfDefault: aiReport?.probabilityOfDefault || (creditScore > 700 ? 1.0 : 5.8),
      fraudScore: aiReport?.fraudScore || 12,
      riskExplanation: aiReport?.riskExplanation || 'Client submitted self-service onboarding portfolio with initial statement credentials.',
      fraudWarnings: aiReport?.fraudWarnings || [],
      systemDecision: aiReport?.systemDecision || 'ManualReview',
      auditedAt: new Date().toISOString()
    };

    // Create 9. Pricing & Terms Core Data Object
    const newTerms: PricingAndTerms = {
      id: newTermId,
      applicationId: newAppId,
      baseInterestRate: aiReport?.recommendedBaseRate || 5.5,
      marginRate: aiReport?.recommendedMargin || 1.25,
      finalRate: (aiReport?.recommendedBaseRate || 5.5) + (aiReport?.recommendedMargin || 1.25),
      fixedOrFloating: 'Fixed',
      amortizationType: 'Annuity',
      penaltyRate: 2.0,
      termMonths: 120
    };

    // Create 2. Loan Application Core Data Object
    const newApplication: LoanApplication = {
      id: newAppId,
      customerId: newCustId,
      requestedAmount,
      purpose: loanPurpose,
      facilityStructureId: selectedFacilityId,
      status: 'Applied',
      appliedAt: new Date().toISOString(),
      riskRatingId: newRiskId,
      collateralId: newCollateralId || undefined,
      pricingTermsId: newTermId
    };

    // Create 3. Financial Statement Core Data Object
    const newFinancialState: FinancialStatement = {
      id: `fin-${Date.now()}`,
      applicationId: newAppId,
      monthlyRevenue: monthlyIncome,
      monthlyExpenses: monthlyIncome * 0.4,
      existingDebtService: monthlyIncome * 0.15,
      otherIncome: 0,
      netMonthlyIncome: monthlyIncome * 0.45,
      dtiRatio: 0.15,
      auditStatus: 'Pending'
    };

    // Create 7. KYC Profile Object
    const newKYC: KYCProfile = {
      id: `kyc-${Date.now()}`,
      customerId: newCustId,
      documentType: 'Passport',
      documentNumber: 'US-P-NEW-90X',
      verificationLevel: 'Level_2',
      verificationStatus: 'Verified',
      verifiedAt: new Date().toISOString()
    };

    // Build standard Condition Precedents
    const cond1: ConditionPrecedent = {
      id: `cond-new-1`,
      applicationId: newAppId,
      description: 'Signature on the master loan covenants agreement',
      isMet: false
    };
    const cond2: ConditionPrecedent = {
      id: `cond-new-2`,
      applicationId: newAppId,
      description: 'Verification of original submitted income and bank statements',
      isMet: true,
      metAt: new Date().toISOString(),
      metByOfficer: 'AI Auto Review'
    };

    // Append to list of documents
    const initialDocs: SupportingDocument[] = [
      {
        id: `doc-up-1`,
        applicationId: newAppId,
        name: 'Bank_Statement_Summary_Primary.pdf',
        category: 'BankStatement',
        classificationLabel: 'Customer bank statement ledger',
        fileSize: '1.4 MB',
        uploadTime: new Date().toISOString(),
        verificationStatus: 'Pending'
      }
    ];

    const updatedStore: ServerDataStore = {
      ...store,
      customers: [newCustomer, ...store.customers],
      applications: [newApplication, ...store.applications],
      collaterals: collateralType !== 'None' ? [newCollateral, ...store.collaterals] : store.collaterals,
      riskRatings: [newRisk, ...store.riskRatings],
      pricingTerms: [newTerms, ...store.pricingTerms],
      financialStatements: [newFinancialState, ...store.financialStatements],
      kycProfiles: [newKYC, ...store.kycProfiles],
      conditions: [cond1, cond2, ...store.conditions],
      documents: [...initialDocs, ...store.documents],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'saivikranthpulikonda@gmail.com',
          role: 'Retail Customer',
          action: 'Created Onboarding Loan Portfolio',
          details: `Submitted a $${requestedAmount} loan request with credit metric score ${creditScore}. Collateral type ${collateralType} pledged.`,
          category: 'KYC'
        },
        ...store.auditLogs
      ]
    };

    syncStoreToBackend(updatedStore);
    setSelectedAppId(newAppId);
    triggerToast('Perfect! Your loan portfolio was registered. Reviewing details in your dashboard.');
  };

  // Add supporting documents
  const handleAddDocument = () => {
    if (!store) return;
    const newDoc: SupportingDocument = {
      id: `doc-${Date.now()}`,
      applicationId: selectedAppId,
      name: docName,
      category: docCategory,
      classificationLabel: docClassification,
      fileSize: '2.5 MB',
      uploadTime: new Date().toISOString(),
      verificationStatus: 'Pending'
    };

    const updatedStore: ServerDataStore = {
      ...store,
      documents: [newDoc, ...store.documents],
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'saivikranthpulikonda@gmail.com',
          role: selectedRole,
          action: 'Document Uploaded',
          details: `Document "${docName}" uploaded under category "${docCategory}" for Review.`,
          category: 'KYC'
        },
        ...store.auditLogs
      ]
    };

    syncStoreToBackend(updatedStore);
    triggerToast(`Document loaded and queued for automated document reviewer auditing.`);
  };

  // Document status override (Reviewer/Fraud officer target)
  const handleSetDocStatus = (id: string, status: 'Approved' | 'Rejected', comments?: string) => {
    if (!store) return;
    const updatedDocs = store.documents.map(d => {
      if (d.id === id) {
        return { ...d, verificationStatus: status, reviewComments: comments || 'Passed automated banking verification protocols.' };
      }
      return d;
    });

    const doc = store.documents.find(d => d.id === id);
    const updatedStore: ServerDataStore = {
      ...store,
      documents: updatedDocs,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'reviewer.audit@vanguardbank.com',
          role: selectedRole,
          action: 'Document Classification Updated',
          details: `Document "${doc?.name}" marked ${status} by role ${selectedRole}.`,
          category: 'KYC'
        },
        ...store.auditLogs
      ]
    };

    syncStoreToBackend(updatedStore);
    triggerToast(`Document verified & signed off as ${status}.`);
  };

  // Change loan parameters (Loan Amendment Workflow)
  const handlePostAmendment = () => {
    if (!store) return;
    const updatedPricing = store.pricingTerms.map(p => {
      if (p.applicationId === selectedAppId) {
        return { ...p, finalRate: amendmentRate, termMonths: amendmentTerm };
      }
      return p;
    });

    const updatedStore: ServerDataStore = {
      ...store,
      pricingTerms: updatedPricing,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'manager.marcus@bankone.com',
          role: selectedRole,
          action: 'Loan Terms Amended',
          details: `Amended Terms for ${selectedAppId}: adjusted rate to ${amendmentRate}% over ${amendmentTerm} months.`,
          category: 'Underwriting'
        },
        ...store.auditLogs
      ]
    };

    syncStoreToBackend(updatedStore);
    triggerToast('Facility updated. Structured amortization schedule values recalculated.');
  };

  // Perform Early Settlement (Payoff Processing & Collateral Release)
  const handleEarlyPayoff = async (appId: string) => {
    try {
      const response = await fetch('/api/applications/payoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          actorEmail: 'manager.marcus@vanguard.com'
        })
      });
      if (response.ok) {
        await fetchStoreAndSync();
        triggerToast('Payoff settled! Outstanding balances cleared and related collateral flags released.');
      } else {
        triggerToast('Error processing payload payoff logic.');
      }
    } catch {
      triggerToast('Error updating payoff state.');
    }
  };

  // Perform Underwriting Exception Overrride (Exception Handling Workflow)
  const handleExceptionOverride = async (appId: string) => {
    try {
      const response = await fetch('/api/applications/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: appId,
          actorEmail: 'manager.marcus@vanguard.com',
          note: managerOverrideNote
        })
      });
      if (response.ok) {
        await fetchStoreAndSync();
        triggerToast('Override successful. Credit approval status set to Approved.');
      } else {
        triggerToast('Error approving override.');
      }
    } catch {
      triggerToast('Backend connection dropped');
    }
  };

  // Execute actual repayment transaction (Payment Processing Workflow)
  const handleProcessPayment = async (paymentId: string, amount: number) => {
    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          amountPaid: amount,
          actorEmail: 'saivikranthpulikonda@gmail.com',
          actorRole: selectedRole
        })
      });
      if (response.ok) {
        await fetchStoreAndSync();
        triggerToast(`Manual payment of $${amount} executed successfully. Coupon status updated.`);
      } else {
        triggerToast('Payment verification failure.');
      }
    } catch {
      triggerToast('Server offline');
    }
  };

  // Toggle single Condition Precedent item status
  const handleToggleCondition = (condId: string) => {
    if (!store) return;
    const updatedConds = store.conditions.map(c => {
      if (c.id === condId) {
        return {
          ...c,
          isMet: !c.isMet,
          metAt: !c.isMet ? new Date().toISOString() : undefined,
          metByOfficer: !c.isMet ? `${selectedRole} Signoff` : undefined
        };
      }
      return c;
    });

    const updatedStore: ServerDataStore = {
      ...store,
      conditions: updatedConds,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'officer.compliance@vanguardbank.com',
          role: selectedRole,
          action: 'Stipulation Status Toggled',
          details: `Condition precedent ${condId} modified by ${selectedRole}.`,
          category: 'Override'
        },
        ...store.auditLogs
      ]
    };
    syncStoreToBackend(updatedStore);
    triggerToast('Condition checklist updated successfully.');
  };

  // Trigger quick manual disbursement (Officer function once approved)
  const handleDisburseLoanFunds = (appId: string) => {
    if (!store) return;
    const target = store.applications.find(a => a.id === appId);
    if (!target) return;

    if (target.status !== 'Approved') {
      triggerToast('Stipulation Error: Facility structure must be marked "Approved" to trigger automated escrow wire transfers.');
      return;
    }

    // Verify condition precedents are satisfied
    const unmet = store.conditions.filter(c => c.applicationId === appId && !c.isMet);
    if (unmet.length > 0) {
      triggerToast(`Disbursement Blocked: ${unmet.length} Condition Precedents remain unsatisfied.`);
      return;
    }

    const updatedApps = store.applications.map(a => {
      if (a.id === appId) {
        return { ...a, status: 'Disbursed' as const, disbursedAt: new Date().toISOString() };
      }
      return a;
    });

    const updatedStore: ServerDataStore = {
      ...store,
      applications: updatedApps,
      auditLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'officer.disburse@vanguardbank.com',
          role: selectedRole,
          action: 'Principal Funds Wired',
          details: `Disbursed principal capital sum of $${target.requestedAmount} to customer settlement ledger account.`,
          category: 'Disbursement'
        },
        ...store.auditLogs
      ]
    };
    syncStoreToBackend(updatedStore);
    triggerToast(`Escrow dispatch completed. Initial payment calendar set.`);
  };

  // Create Customer Query
  const handleCreateCustomerQuery = async () => {
    try {
      const response = await fetch('/api/queries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: 'cust-1',
          subject: customerQuerySubject,
          message: customerQueryMessage
        })
      });
      if (response.ok) {
        await fetchStoreAndSync();
        triggerToast('Support ticket dispatched to Vanguard customer care representatives.');
      }
    } catch {
      triggerToast('Query fail.');
    }
  };

  // Respond to Customer Query (Customer Service agent role)
  const handleRespondToQuery = async (queryId: string) => {
    try {
      const response = await fetch('/api/queries/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryId,
          agentResponse: agentResponseText
        })
      });
      if (response.ok) {
        await fetchStoreAndSync();
        triggerToast('Response registered, notifying client via automated electronic bulletin.');
      }
    } catch {
      triggerToast('Response submit failure.');
    }
  };

  // Quick reset for testing and evaluation
  const handleResetDataStore = () => {
    fetch('/api/store/reset', { method: 'POST' }).then(() => {
      fetchStoreAndSync();
      triggerToast('Banking database reset and seeded with standard retail profiles.');
    });
  };

  // Simple quick computation stats
  const totalLendingVolumeActive = store?.applications
    .filter(a => a.status === 'Disbursed')
    .reduce((prev, current) => prev + current.requestedAmount, 0) || 0;

  const delinquentAccountsCount = store?.customers.filter(c => c.status === 'Delinquent').length || 0;
  const inReviewApplicationsCount = store?.applications.filter(a => a.status === 'InReview' || a.status === 'Applied').length || 0;

  // Selected object references in view
  const currentApp = store?.applications.find(a => a.id === selectedAppId);
  const currentCustomerObj = store?.customers.find(c => c.id === currentApp?.customerId);
  const currentFinancialObj = store?.financialStatements.find(f => f.applicationId === selectedAppId);
  const currentRiskObj = store?.riskRatings.find(r => r.applicationId === selectedAppId);
  const currentCollateralObj = store?.collaterals.find(c => c.applicationId === selectedAppId);
  const currentTermsObj = store?.pricingTerms.find(t => t.applicationId === selectedAppId);

  return (
    <div id="main_wrapper" className="w-full min-h-screen bg-[#FDFCFB] text-[#2D3331] font-sans flex flex-col antialiased">
      
      {/* 1. Global Navigation Bar & Brand Header */}
      <header id="banking_main_header" className="h-20 border-b border-[#E8E4DF] bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#5A6A50] rounded-xl flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-serif italic text-xl font-bold tracking-tight text-[#3E4543] block">
              Vanguard Retail Loan Core
            </span>
            <span className="text-[10px] font-bold text-[#A59D94] uppercase tracking-[0.15em] block -mt-1">
              AI-Based Banking Automation System
            </span>
          </div>
        </div>

        {/* Global Notifications Panel (Real-time toast block) */}
        {toastMessage && (
          <div id="system_toast" style={{animation: 'fadeIn 0.2s ease-out'}} className="absolute left-1/3 right-1/3 top-4 bg-[#2D3331] text-[#FDFCFB] px-4 py-2 rounded-full text-xs shadow-xl border border-[#CBD5E1] flex items-center gap-2 justify-center z-50">
            <span className="w-2 h-2 rounded-full bg-[#C17E61] animate-ping"></span>
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* 2. Beautiful Dual-Portal Mode Selector (Segmented Toggle) */}
        <div id="portal_mode_toggle_container" className="flex items-center bg-[#F2F0EB] p-1 rounded-full border border-[#E8E4DF] gap-1 shrink-0">
          <button
            type="button"
            id="portal_customer_btn"
            onClick={() => handlePortalSwitch('customer')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              portalMode === 'customer'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-[#706B63] hover:text-[#2D3331]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            👤 Customer Portal
          </button>
          <button
            type="button"
            id="portal_bank_btn"
            onClick={() => handlePortalSwitch('bank')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              portalMode === 'bank'
                ? 'bg-[#2D3331] text-[#FDFCFB] shadow-md'
                : 'text-[#706B63] hover:text-[#2D3331]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            💼 Bank Staff Terminal
          </button>
        </div>

        {/* Persona Switcher Menu: Role-Based Access Control Selection */}
        <div className="flex items-center gap-4">
          {portalMode === 'bank' ? (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-[#A59D94] uppercase tracking-wider">
                Simulation Workspace Role
              </span>
              <div className="relative">
                <select
                  id="role_selector_widget"
                  value={selectedRole}
                  onChange={(e) => {
                    const role = e.target.value as UserRole;
                    setSelectedRole(role);
                    triggerToast(`Switched active security session profile: ${role}`);
                    // Auto-switch to relevant workflow tab to coordinate views
                    if (role === 'Loan Officer') {
                      setSelectedWorkflowTab('Collateral Monitoring');
                    } else if (role === 'Manager') {
                      setSelectedWorkflowTab('Exception Handling');
                    } else if (role === 'Admin') {
                      setSelectedWorkflowTab('Regulatory Compliance');
                    } else if (role === 'Credit Analyst') {
                      setSelectedWorkflowTab('Loan Amendment');
                    } else if (role === 'Fraud Officer') {
                      setSelectedWorkflowTab('Delinquency Monitoring');
                    } else if (role === 'Document Reviewer') {
                      setSelectedWorkflowTab('Collateral Monitoring');
                    } else if (role === 'Customer Service Agent') {
                      setSelectedWorkflowTab('Customer Servicing');
                    }
                  }}
                  className="bg-[#F2F0EB] text-[#2D3331] font-semibold text-xs py-1.5 pl-3 pr-8 rounded-full border border-[#E8E4DF] hover:border-[#5A6A50] focus:ring-1 focus:ring-[#5A6A50] focus:outline-hidden appearance-none cursor-pointer"
                >
                  <option value="Loan Officer">💼 Loan Officer</option>
                  <option value="Manager">👔 Loan Senior Manager</option>
                  <option value="Admin">🛠️ Administrative Auditor</option>
                  <option value="Credit Analyst">📊 Credit Risk Analyst</option>
                  <option value="Fraud Officer">🔎 Fraud & Security Officer</option>
                  <option value="Document Reviewer">📂 Document Reviewer</option>
                  <option value="Customer Service Agent">🎧 Customer Service Agent</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#5A6A50]">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-[#A59D94] uppercase tracking-wider">
                My Client Status
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full px-3 py-1 text-xs font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Verified Borrower Account</span>
              </div>
            </div>
          )}

          <div className="h-10 w-px bg-[#E8E4DF]"></div>

          <button
            onClick={handleResetDataStore}
            title="Reset simulation parameters and reload baseline seed data objects"
            className="p-2 text-[#706B63] hover:text-red-600 hover:bg-[#F2F0EB] rounded-lg transition-colors cursor-pointer"
            id="db_reset_btn"
          >
            <RefreshCw className="w-4 h-4 animate-spin-hover" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F2F0EB] text-[#5A6A50] flex items-center justify-center font-bold text-xs ring-2 ring-[#E8E4DF]">
              SV
            </div>
            <div className="text-left hidden md:block">
              <span className="text-xs font-semibold block text-[#3E4543]">saivikranth</span>
              <span className="text-[8px] tracking-wider uppercase text-[#A59D94] block">saivikranthpulikonda@...</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Side Panel Workflow Navigation & Context Metrics Indicator */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR: Conditionally rendered depending on active portal mode to restrict visibility */}
        <aside id="system_sidebar" className="w-[280px] bg-[#F2F0EB] border-r border-[#E8E4DF] flex flex-col p-5 justify-between shrink-0">
          {portalMode === 'customer' ? (
            /* CUSTOMER ECOSYSTEM MENU */
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[10px] font-bold text-[#5A6A50] uppercase tracking-[0.2em]">
                  Customer Portal (4)
                </h2>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  CLIENT SECURE
                </span>
              </div>
              
              <nav id="customer_nav_group" className="flex flex-col gap-1.5">
                {[
                  { name: '📱 Overview & Scorecard', key: 'dashboard', label: 'My ratings & applications' },
                  { name: '📁 Document Vault & OCR', key: 'documents', label: 'PDF bank statement parsing' },
                  { name: '💳 Repayments Center', key: 'payments', label: 'View & pay coupons' },
                  { name: '💬 Live Customer Hotline', key: 'disputes', label: 'Ask care agents & tickets' }
                ].map((tab) => {
                  const isActive = customerActiveTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      id={`cust_tab_btn_${tab.key}`}
                      type="button"
                      onClick={() => {
                        setCustomerActiveTab(tab.key as any);
                        triggerToast(`Client workspace navigated: ${tab.name}.`);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isActive
                          ? 'bg-white shadow-xs border border-[#E8E4DF] text-[#5A6A50]'
                          : 'text-[#706B63] hover:bg-white/50 hover:text-[#2D3331]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-[#2D3331]">{tab.name}</span>
                      </div>
                      <span className="text-[9px] text-[#A59D94] leading-[10px]">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : (
            /* EXECUTIVE WORKFLOWS MENU */
            <div>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[10px] font-bold text-[#A59D94] uppercase tracking-[0.2em]">
                  System Workflows (11)
                </h2>
                <span className="text-[10px] bg-[#E8E4DF] text-[#5A6A50] px-2 py-0.5 rounded-full font-bold">
                  AUTOMATED ACTIVE
                </span>
              </div>
              
              <nav id="workflow_nav_group" className="flex flex-col gap-1">
                {[
                  { name: 'AI Early Warning', key: 'AI Early Warning', alert: true, label: 'EWS default predictor' },
                  { name: 'Payment Processing', key: 'Payment Processing', label: 'Amortization & scheduling' },
                  { name: 'Interest Management', key: 'Interest Management', label: 'Penalty & pricing logs' },
                  { name: 'Customer Servicing', key: 'Customer Servicing', label: 'Tickets & helpdesk lines' },
                  { name: 'Loan Amendment', key: 'Loan Amendment', label: 'Contract alterations' },
                  { name: 'Delinquency Monitoring', key: 'Delinquency Monitoring', alert: delinquentAccountsCount > 0, label: 'Collection triggers' },
                  { name: 'Collateral Monitoring', key: 'Collateral Monitoring', label: 'Valuation & LTV check' },
                  { name: 'Exception Handling', key: 'Exception Handling', label: 'Manager status override' },
                  { name: 'Payoff Processing', key: 'Payoff Processing', label: 'Early payoff settlements' },
                  { name: 'Regulatory Compliance', key: 'Regulatory Compliance', label: 'Audit footprints' },
                  { name: 'Collateral Release', key: 'Collateral Release', label: 'Settled deeds return' }
                ].map((wf) => {
                  const isActive = selectedWorkflowTab === wf.key;
                  return (
                    <button
                      key={wf.key}
                      id={`wf_tab_${wf.key.toLowerCase().replace(/\s+/g, '_')}`}
                      type="button"
                      onClick={() => {
                        setSelectedWorkflowTab(wf.key);
                        // Auto-synchronize Active Persona (role) to guarantee a highly tailored top cockpit panel for every tab
                        if (wf.key === 'AI Early Warning') {
                          setSelectedRole('Retail Customer');
                        } else if (wf.key === 'Payment Processing') {
                          setSelectedRole('Admin');
                        } else if (wf.key === 'Interest Management') {
                          setSelectedRole('Credit Analyst');
                        } else if (wf.key === 'Customer Servicing') {
                          setSelectedRole('Customer Service Agent');
                        } else if (wf.key === 'Loan Amendment') {
                          setSelectedRole('Credit Analyst');
                        } else if (wf.key === 'Delinquency Monitoring') {
                          setSelectedRole('Fraud Officer');
                        } else if (wf.key === 'Collateral Monitoring') {
                          setSelectedRole('Document Reviewer');
                        } else if (wf.key === 'Exception Handling') {
                          setSelectedRole('Manager');
                        } else if (wf.key === 'Payoff Processing') {
                          setSelectedRole('Manager');
                        } else if (wf.key === 'Regulatory Compliance') {
                          setSelectedRole('Admin');
                        } else if (wf.key === 'Collateral Release') {
                          setSelectedRole('Manager');
                        }
                        triggerToast(`Switched workspace views to: ${wf.name} functional workflow.`);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isActive
                          ? 'bg-white shadow-xs border border-[#E8E4DF] text-[#5A6A50]'
                          : 'text-[#706B63] hover:bg-white/50 hover:text-[#2D3331]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-semibold">{wf.name}</span>
                        {wf.alert && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>}
                      </div>
                      <span className="text-[9px] text-[#A59D94] leading-[10px]">
                        {wf.label}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

          {portalMode === 'customer' ? (
            <div id="customer_sidebar_badge" className="bg-white/90 p-4 rounded-2xl border border-[#E8E4DF] space-y-1.5 shadow-2xs">
              <span className="text-[9px] font-bold text-[#A59D94] uppercase tracking-wider block">
                Session Vault
              </span>
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3E4543]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>SECURE CLIENT ACCREDITED</span>
              </div>
              <p className="text-[9px] text-[#706B63] leading-[11px]">
                Portals isolated. Back-office data analysis locked for client privacy rules.
              </p>
            </div>
          ) : (
            <div id="sidebar_portfolio_stats" className="bg-white/80 p-3.5 rounded-2xl border border-[#E8E4DF] space-y-2 shadow-2xs">
              <span className="text-[10px] font-bold text-[#5A6A50] uppercase tracking-wider block">
                Core Bank Vault Metric
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[8px] uppercase tracking-wide text-[#A59D94] block">Lent Capital</span>
                  <span className="text-xs font-bold text-[#2D3331] block">
                    ${(totalLendingVolumeActive / 1000).toFixed(0)}k
                  </span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wide text-[#A59D94] block">Delinquent Flag</span>
                  <span className="text-xs font-bold text-red-600 block">
                    {delinquentAccountsCount} Accounts
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#E8E4DF] flex items-center justify-between text-[9px] text-[#706B63]">
                <span>In-Queue Apps:</span>
                <span className="font-bold text-[#5A6A50]">{inReviewApplicationsCount}</span>
              </div>
            </div>
          )}
        </aside>

        {/* 3. Main Workspace Area */}
        <main id="banking_main_content" className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#FDFCFB]">
          
          {portalMode === 'customer' ? (
            /* RENDERING INTEGRATED CUSTOMER PORTAL WORKSPACE (No Internal Deep Analyses Visible!) */
            <div id="customer_portal_view" className="space-y-6 animate-fadeIn pb-10">
              
              {/* Customer Top Header Panel */}
              <div id="customer_portal_header" className="bg-[#5A6A50]/[0.04] border border-[#5A6A50]/15 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                      🟢 Verified Individual Client Session
                    </span>
                    <span className="text-xs text-[#706B63] font-medium font-sans">• Vanguard Customer Self-Service Portal</span>
                  </div>
                  <h2 className="text-2xl font-serif text-[#2D3331] font-semibold">
                    Welcome back, saivikranth!
                  </h2>
                  <p className="text-xs text-[#706B63] max-w-2xl leading-relaxed">
                    Check your credit risk index scores, drag & drop statements to run automated OCR ledger processing, view scheduling contracts, and submit support inquiries.
                  </p>
                </div>
                
                <div className="flex shrink-0 items-center gap-2 self-start md:self-center font-mono text-xs bg-emerald-500/10 text-emerald-950 px-4 py-2 rounded-xl">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">AES-256 ENCRYPTED</span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT 2 COLUMNS */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* TAB 1: DASHBOARD & APPLICATION FORM WIZARD */}
                  {customerActiveTab === 'dashboard' && (
                    <div id="cust_tab_dashboard_pane" className="space-y-6">
                      
                      {/* Application wizard form */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                          <div>
                            <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                              <Sparkles className="w-5 h-5 text-[#C17E61]" /> Build a New Loan Portfolio (Customer Portal)
                            </h3>
                            <p className="text-xs text-[#706B63] mt-0.5">
                              Specify your target credit rating metrics, bank sheet details, and document parameters for automatic underwriting review.
                            </p>
                          </div>
                          <span className="text-xs font-mono font-bold bg-[#F2F0EB] text-[#5A6A50] px-3 py-1 rounded-full">
                            FORM AP-109
                          </span>
                        </div>

                        {/* RENDER ALL FORM FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Applicant Credit Score Index
                            </label>
                            <input
                              type="number"
                              id="score_input"
                              min="300"
                              max="850"
                              value={creditScore}
                              onChange={(e) => setCreditScore(Number(e.target.value))}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                            />
                            <div className="flex items-center justify-between text-[9px] text-[#A59D94] mt-1">
                              <span>300 (Subprime Limit)</span>
                              <span>850 (Exceptional Tier)</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Requested Principal Loan Amount ($)
                            </label>
                            <input
                              type="number"
                              id="amount_input"
                              min="1000"
                              max="1000000"
                              value={requestedAmount}
                              onChange={(e) => setRequestedAmount(Number(e.target.value))}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                            />
                            <div className="flex items-center justify-between text-[9px] text-[#A59D94] mt-1">
                              <span>$1k Min</span>
                              <span>$1M Max Facility Cap</span>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Customer Net Monthly Income ($)
                            </label>
                            <input
                              type="number"
                              id="income_input"
                              value={monthlyIncome}
                              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Employment Verification Category
                            </label>
                            <select
                              id="employment_selector"
                              value={employmentType}
                              onChange={(e: any) => setEmploymentType(e.target.value)}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            >
                              <option value="Salaried">Salaried (Full-time Payroll Employee)</option>
                              <option value="SelfEmployed">SelfEmployed (Freelance / LLC Proprietor)</option>
                              <option value="Contractor">Contractor (W9 Temporary Term)</option>
                              <option value="Unemployed">Unemployed (Requires Co-Guarantor)</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Asset Collateral Pledging Type
                            </label>
                            <select
                              id="collateral_type_selector"
                              value={collateralType}
                              onChange={(e: any) => setCollateralType(e.target.value)}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            >
                              <option value="Property">Property (Real Estate Residential / Commercial)</option>
                              <option value="Vehicle">Vehicle (Title Lien Registered)</option>
                              <option value="Gold">Gold Reserve Asset</option>
                              <option value="Securities">Investment Brokerage Securities account</option>
                              <option value="Equipment">Heavy Commercial Equipment</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Collateral Estimated Market Worth ($)
                            </label>
                            <input
                              type="number"
                              id="collateral_worth_input"
                              value={collateralWorth}
                              onChange={(e) => setCollateralWorth(Number(e.target.value))}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Descriptive Primary Collateral Location References
                            </label>
                            <input
                              type="text"
                              id="collateral_ref_input"
                              value={collateralDescription}
                              onChange={(e) => setCollateralDescription(e.target.value)}
                              placeholder="e.g. 522 Cascade Ave, Portland OR 97201"
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Loan Purpose & Amortization Rationale
                            </label>
                            <input
                              type="text"
                              id="purpose_input"
                              value={loanPurpose}
                              onChange={(e) => setLoanPurpose(e.target.value)}
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl font-medium"
                            />
                          </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-col md:flex-row gap-3 pt-3 border-t border-[#E8E4DF]">
                          <button
                            type="button"
                            id="run_ai_analyser_button"
                            onClick={handleAIAnalysis}
                            disabled={analyzing}
                            className="flex-1 bg-[#2D3331] text-[#FDFCFB] hover:bg-black py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                          >
                            {analyzing ? (
                              <><RefreshCw className="w-4 h-4 animate-spin" /> Auto-Underwriting analysis processing...</>
                            ) : (
                              <><Sparkles className="w-4 h-4 text-[#C17E61]" /> Trigger Rule & AI Scorecard Assessment</>
                            )}
                          </button>

                          <button
                            type="button"
                            id="register_portfolio_button"
                            onClick={handleSubmitApplication}
                            className="bg-[#5A6A50] text-[#FDFCFB] hover:bg-[#4a5841] py-2.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Register Loan Portfolio <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display Real-Time AI Scorecard Analysis output if available */}
                      {aiReport && (
                        <div id="realtime_ai_scorecard_result" className="bg-[#2D3331] rounded-3xl p-6 text-white space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-1.5 text-[#C17E61]">
                              <Sparkles className="w-4 h-4 animate-pulse" />
                              <span className="text-xs font-bold tracking-widest uppercase font-sans">
                                My Real-Time AI Underwriting Assessment Scorecard
                              </span>
                            </div>
                            <span className="text-[10px] text-white/50 font-mono">CLIENT DISCLOSURE STATEMENT</span>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">Risk Rating Letter</span>
                              <span className="text-2xl font-serif font-bold text-[#C17E61] block mt-1">{aiReport.ratingLetter}</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">Risk Score Index</span>
                              <span className="text-2xl font-serif font-bold text-white block mt-1">{aiReport.scoreIndex}/100</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">Yield Interest Rate</span>
                              <span className="text-2xl font-serif font-bold text-[#C17E61] block mt-1">{aiReport.recommendedBaseRate + aiReport.recommendedMargin}%</span>
                            </div>
                            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                              <span className="text-[9px] uppercase tracking-wider text-white/50 block font-sans">System Verdict</span>
                              <span className="text-xs font-mono font-bold text-emerald-400 block mt-3 uppercase">{aiReport.systemDecision}</span>
                            </div>
                          </div>

                          <div className="text-xs text-white/80 space-y-1 bg-white/5 p-3.5 rounded-xl">
                            <span className="font-bold text-white block">Explanation Report:</span>
                            <p className="text-white/75">{aiReport.riskExplanation}</p>
                          </div>
                        </div>
                      )}

                      {/* My Active Loan Portfolio List (Customer Only) */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4 font-sans">
                        <h4 className="text-sm font-serif font-semibold text-[#2D3331] flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4 text-[#5A6A50]" /> My Registered Loan Portfolios ({store?.applications.filter(a => a.customerId === 'cust-5' || a.id === selectedAppId || a.id.startsWith('app-')).length} Active)
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs divide-y divide-[#E8E4DF]">
                            <thead>
                              <tr className="text-[10px] uppercase font-bold text-[#A59D94] bg-[#F2F0EB]/40">
                                <th className="p-3">Reference ID</th>
                                <th className="p-3">Purpose</th>
                                <th className="p-3">Requested Principal</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Compliance Review</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E4DF]">
                              {(store?.applications || []).map((app) => {
                                return (
                                  <tr key={app.id} className="hover:bg-emerald-50/10">
                                    <td className="p-3 font-semibold font-mono text-[#5A6A50]">{app.id}</td>
                                    <td className="p-3 font-medium text-[#2D3331]">{app.purpose}</td>
                                    <td className="p-3 font-mono">${app.requestedAmount.toLocaleString()}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        app.status === 'Approved' || app.status === 'Disbursed'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                                        }`}>
                                        {app.status}
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span className="text-[10px] text-[#A59D94]">AI Safe Check Certified</span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DOCUMENTS VAULT & OCR UPLOADER */}
                  {customerActiveTab === 'documents' && (
                    <div id="cust_tab_documents_pane" className="space-y-6">
                      
                      {/* PDF Uploader Section */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4">
                        <div className="border-b border-[#E8E4DF] pb-3">
                          <h3 className="font-serif text-lg font-semibold text-[#2D3331]">
                            📁 PDF Bank Statement Ledger Analyzer
                          </h3>
                          <p className="text-xs text-[#706B63] mt-0.5">
                            Underwriter OCR automatically parses checking ledger PDF files to compute subprime flags or debt ratios.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F2F0EB]/30 p-4 border border-[#E8E4DF] rounded-2xl">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A50] block font-sans">
                                PDF Upload Box
                              </label>
                              <span className="text-[8px] bg-[#E8E4DF] text-[#706B63] px-2 py-0.5 rounded-full font-bold">
                                SECURE OCR
                              </span>
                            </div>
                            
                            <div 
                              className="border-2 border-dashed border-[#E8E4DF] hover:border-[#5A6A50] bg-white rounded-xl p-4 transition-all text-center relative cursor-pointer group flex flex-col items-center justify-center min-h-[120px]"
                              onClick={() => document.getElementById('pdf-bank-statement-input-inside')?.click()}
                            >
                              <input 
                                id="pdf-bank-statement-input-inside"
                                type="file" 
                                accept=".pdf" 
                                onChange={handlePdfStatementUpload} 
                                className="hidden" 
                              />
                              
                              {uploadingPdf ? (
                                <div className="space-y-2 flex flex-col items-center">
                                  <RefreshCw className="w-8 h-8 text-[#5A6A50] animate-spin" />
                                  <span className="text-xs font-semibold text-[#2D3331] block">Running Underwriting AI OCR scanning...</span>
                                </div>
                              ) : uploadedPdfName ? (
                                <div className="space-y-1.5 flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                  <span className="text-xs font-bold text-[#2D3331] block break-all text-center">{uploadedPdfName}</span>
                                </div>
                              ) : (
                                <div className="space-y-1 flex flex-col items-center">
                                  <UploadCloud className="w-8 h-8 text-[#A59D94] group-hover:text-[#5A6A50] transition-transform group-hover:-translate-y-0.5" />
                                  <span className="text-xs font-semibold text-[#2D3331] block">Click to upload statement PDF</span>
                                  <span className="text-[9px] text-[#A59D94] block">Supports standard banking ledger tables</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 flex flex-col">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block">
                              OCR extracted ledger transactions
                            </label>
                            <textarea
                              rows={6}
                              value={bankStatementsText}
                              onChange={(e) => setBankStatementsText(e.target.value)}
                              placeholder="Extracted ledger transactions appear here..."
                              className="w-full flex-1 bg-white border border-[#E8E4DF] p-3 text-xs font-mono rounded-xl leading-relaxed resize-none text-[10px]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Supporting Document Checklist */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4 font-sans">
                        <div className="flex justify-between items-center border-b border-[#E8E4DF] pb-3">
                          <div>
                            <h3 className="font-serif text-lg font-semibold text-[#2D3331]">
                              📂 Document Checklist & Verified Vault
                            </h3>
                            <p className="text-xs text-[#706B63] mt-0.5">
                              Add required proofs below to clear outstanding pre-disbursement conditions instantly.
                            </p>
                          </div>
                          
                          {/* Easy new uploader */}
                          <button
                            type="button"
                            onClick={handleAddDocument}
                            className="bg-[#2D3331] hover:bg-black text-[#FDFCFB] text-xs font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Document Record
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#F2F0EB]/35 p-4 rounded-2xl border border-[#E8E4DF] mb-4">
                          <div>
                            <label className="text-[8px] font-bold uppercase text-[#706B63] block mb-1">Doc Label</label>
                            <input 
                              type="text" 
                              value={docName} 
                              onChange={(e)=>setDocName(e.target.value)} 
                              className="w-full bg-white border border-[#E8E4DF] rounded-lg px-2 py-1 text-xs" 
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-bold uppercase text-[#706B63] block mb-1">Doc Category</label>
                            <select 
                              value={docCategory} 
                              onChange={(e: any)=>setDocCategory(e.target.value)} 
                              className="w-full bg-white border border-[#E8E4DF] rounded-lg px-2 py-1 text-xs font-sans"
                            >
                              <option value="KYC font-sans">KYC Proof (Passport/ID)</option>
                              <option value="IncomeProof">Income Proof (Tax assessed / Paystub)</option>
                              <option value="CollateralProof">Collateral Proof (Land Deed / Valuation)</option>
                              <option value="BankStatement">Bank checking statement journal</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[8px] font-bold uppercase text-[#706B63] block mb-1 font-sans">Doc Verification Status</label>
                            <span className="text-xs font-mono font-bold text-[#5A6A50] block mt-1">✓ Instantly Pre-Approved</span>
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs divide-y divide-[#E8E4DF]">
                            <thead>
                              <tr className="text-[10px] uppercase font-bold text-[#A59D94] bg-[#F2F0EB]/40">
                                <th className="p-3">File Name</th>
                                <th className="p-3">Classification</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Size</th>
                                <th className="p-3">Review Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E4DF]">
                              {(store?.documents || []).map((doc) => {
                                return (
                                  <tr key={doc.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-semibold text-[#2D3331]">{doc.name}</td>
                                    <td className="p-3 font-mono text-[10px]">{doc.classificationLabel}</td>
                                    <td className="p-3 uppercase text-[9px] font-bold text-[#5A6A50]">{doc.category}</td>
                                    <td className="p-3 text-slate-500 font-mono text-[10px]">{doc.fileSize}</td>
                                    <td className="p-3">
                                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-100">
                                        {doc.verificationStatus}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: REPAYMENTS CENTER */}
                  {customerActiveTab === 'payments' && (
                    <div id="cust_tab_payments_pane" className="space-y-6">
                      
                      {/* Active coupons list */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4">
                        <div className="border-b border-[#E8E4DF] pb-3">
                          <h3 className="font-serif text-lg font-semibold text-[#2D3331]">
                            💳 My Loan Repayment Coupons (Sandbox Scheduler)
                          </h3>
                          <p className="text-xs text-[#706B63] mt-0.5">
                            Submit scheduled interest and principal repayments to build up your positive credibility index.
                          </p>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs divide-y divide-[#E8E4DF]">
                            <thead>
                              <tr className="text-[10px] uppercase font-bold text-[#A59D94] bg-[#F2F0EB]/40">
                                <th className="p-3">Payment Coupon</th>
                                <th className="p-3">Principal Amount</th>
                                <th className="p-3">Interest Fee</th>
                                <th className="p-3">Penalty Applied</th>
                                <th className="p-3">Repayment Due Date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Amortization Settle Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E8E4DF]">
                              {(store?.payments || []).map((p) => {
                                const totalCost = p.principalDue + p.interestDue + p.penaltyApplied;
                                return (
                                  <tr key={p.id} className="hover:bg-slate-50 font-sans">
                                    <td className="p-3 font-mono font-bold text-[#5A6A50]">{p.id}</td>
                                    <td className="p-3 font-mono">${p.principalDue}</td>
                                    <td className="p-3 font-mono">${p.interestDue}</td>
                                    <td className="p-3 text-red-600 font-mono">+${p.penaltyApplied}</td>
                                    <td className="p-3 text-slate-500 font-mono">{new Date(p.dueDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                        p.status === 'Paid'
                                          ? 'bg-green-50 text-green-700 border border-green-100'
                                          : p.status === 'Overdue'
                                            ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse'
                                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                                      }`}>
                                        {p.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right font-sans">
                                      {p.status !== 'Paid' ? (
                                        <button
                                          type="button"
                                          onClick={() => handleProcessPayment(p.id, totalCost)}
                                          className="bg-emerald-700 text-white hover:bg-emerald-800 text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer"
                                        >
                                          Settle ${totalCost}
                                        </button>
                                      ) : (
                                        <span className="text-[10px] text-[#A59D94] italic font-semibold">✓ Paid & Authenticated</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DISPUTES & HOTLINE */}
                  {customerActiveTab === 'disputes' && (
                    <div id="cust_tab_disputes_pane" className="space-y-6">
                      
                      {/* Customer Live support request form */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4">
                        <div className="border-b border-[#E8E4DF] pb-3">
                          <h3 className="font-serif text-lg font-semibold text-[#2D3331]">
                            💬 Direct Customer Support Hotline File Center
                          </h3>
                          <p className="text-xs text-[#706B63] mt-0.5">
                            Submit a message directly to care representatives regarding account status, interest rates, or payout covenants.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Subject Header / Issue Topic
                            </label>
                             <input
                              type="text"
                              value={customerQuerySubject}
                              onChange={(e) => setCustomerQuerySubject(e.target.value)}
                              placeholder="e.g. Inquire about lower margin rate adjustment"
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                              Brief Narrative Message
                            </label>
                            <textarea
                              rows={4}
                              value={customerQueryMessage}
                              onChange={(e) => setCustomerQueryMessage(e.target.value)}
                              placeholder="Provide transaction details, OCR scanning issues, or application dates..."
                              className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={handleCreateCustomerQuery}
                            className="w-full bg-[#2D3331] text-[#FDFCFB] hover:bg-black py-2 rounded-xl text-xs font-bold uppercase font-sans tracking-wide cursor-pointer animate-none"
                          >
                            Dispatch support ticket
                          </button>
                        </div>
                      </div>

                      {/* Submitted Service Tickets list */}
                      <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4 font-sans">
                        <h4 className="text-sm font-serif font-semibold text-[#2D3331]">
                          Active Hotline Support Tickets ({store?.queries.length} Opened)
                        </h4>
                        
                        <div className="space-y-3">
                          {(store?.queries || []).map(q => (
                            <div key={q.id} className="p-4 bg-[#F2F0EB]/30 border border-[#E8E4DF] rounded-2xl text-xs space-y-2.5">
                              <div className="flex justify-between items-center bg-transparent">
                                <span className="font-bold text-[#5A6A50] font-mono uppercase tracking-wider">Ticket {q.id}</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  q.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {q.status}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <span className="font-bold text-[#2D3331]">{q.subject}</span>
                                <p className="text-[#706B63]">{q.message}</p>
                              </div>
                              {q.agentResponse && (
                                <div className="p-3 bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-xl space-y-1">
                                  <span className="font-bold uppercase tracking-wider text-[8px] text-emerald-800">
                                    Official Agent Care Response:
                                  </span>
                                  <p className="font-medium text-[11px]">{q.agentResponse}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* RIGHT 1 COLUMN: CLIENT SECURE TRACKER (CLEAN PROGRESS FLOW) */}
                <div className="space-y-6">
                  
                  {/* Visual checklist showing missing pre-disbursal items */}
                  <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-4 font-sans">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5A6A50]">
                      My Progress Checklist
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#2D3331] -mt-1.5 leading-tight">
                      Automatic Underwriting Stages
                    </h3>
                    
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-2.5 text-xs text-[#2D3331]">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">✓</div>
                        <div>
                          <span className="font-bold block">1. Form AP-109 Received</span>
                          <span className="text-[10px] text-[#706B63]">All credit and collateral declarations captured</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-[#2D3331]">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] ${
                          uploadedPdfName ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {uploadedPdfName ? '✓' : '•'}
                        </div>
                        <div>
                          <span className="font-bold block">2. Bank Statement OCR Verification</span>
                          <span className="text-[10px] text-[#706B63]">
                            {uploadedPdfName ? `Successfully scanned "${uploadedPdfName}"` : 'Requires monthly statement PDF ledger upload'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-[#2D3331]">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">✓</div>
                        <div>
                          <span className="font-bold block">3. Automated AI Scorecard Assessment</span>
                          <span className="text-[10px] text-[#706B63]">Real-time underwriting analysis triggered</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs text-[#2D3331]">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                          •
                        </div>
                        <div>
                          <span className="font-bold block text-[#A59D94]">4. Manual Covenant Auditing</span>
                          <span className="text-[10px] text-[#A59D94]">Staff is verifying asset liens & contracts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing terms details summary */}
                  <div className="bg-[#2D3331] rounded-3xl p-6 text-white space-y-4 font-sans">
                    <span className="text-[9px] tracking-widest uppercase text-[#A59D94] block">
                      Guaranteed Rate Covenant
                    </span>
                    <h4 className="text-sm font-serif font-semibold text-[#FDFCFB] tracking-tight -mt-2 leading-snug">
                      Yield Structure & Monthly Commitment Limits
                    </h4>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Borrowing terms are calculated dynamically by our integrated automated credit scorer engine based on debt schedules.
                    </p>

                    <div className="divide-y divide-white/10 text-xs text-white">
                      <div className="flex justify-between py-2 text-white/80">
                        <span>Base Interest Rate:</span>
                        <span className="font-mono font-bold text-white">5.25%</span>
                      </div>
                      <div className="flex justify-between py-2 text-white/80 font-sans">
                        <span>Risk Premium Adj:</span>
                        <span className="font-mono font-bold text-[#C17E61]">+1.50%</span>
                      </div>
                      <div className="flex justify-between py-2 font-semibold text-white">
                        <span>Total Expected Yield:</span>
                        <span className="font-mono text-[#C17E61]">6.75% APP</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          ) : (
            /* STANDARD RENDERING FOR BANK STAFF TERMINAL (FULL RISK & WORKFLOW WORKSPACE VISIBLE) */
            <div id="bank_staff_terminal" className="space-y-6">
              {/* Top Info Banner - Showing role capabilities */}
              <div id="role_context_banner" className="bg-[#F2F0EB] border border-[#E8E4DF] rounded-3xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-[#5A6A50] text-[#FDFCFB] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active Persona: {selectedRole}
                </span>
                <span className="text-xs text-[#706B63]">• Direct Secure System Privilege Assigned</span>
              </div>
              <h2 className="text-xl font-serif text-[#2D3331] font-semibold">
                {selectedRole === 'Retail Customer' && '👋 Welcome! Retail Customer Financial Self-Service Portal'}
                {selectedRole === 'Loan Officer' && '💼 Loan Origination & Condition Precedent Checklist Board'}
                {selectedRole === 'Manager' && '👔 Core Underwriting & Exception Overrides Workspace'}
                {selectedRole === 'Admin' && '🛠️ Full Regulatory Audit Logs & Active Facilities Configuration'}
                {selectedRole === 'Credit Analyst' && '📊 Deep AI Rating Scorecard & Interest Term Amortization Planner'}
                {selectedRole === 'Fraud Officer' && '🔎 High-Risk Warning Flags & Document Authenticity Ledger'}
                {selectedRole === 'Document Reviewer' && '📂 Client Supporting Income Papers Audit Vault'}
                {selectedRole === 'Customer Service Agent' && '🎧 Interactive Customer Servicing & Digital Bulletins Management'}
              </h2>
              <p className="text-xs text-[#706B63]">
                {selectedRole === 'Retail Customer' && 'Check your risk scorecard rating in real-time, submit new loan applications with specific credit scores + deposit sheets, upload compliance documents, and execute manual payments.'}
                {selectedRole === 'Loan Officer' && 'Monitor approved loan covenants, investigate pending applicant conditions, and trigger wired fund disbursements immediately upon fulfillment.'}
                {selectedRole === 'Manager' && 'Review border exceptions, approve executive overrides with written justification, structure custom amendments, and authorise settlements.'}
                {selectedRole === 'Admin' && 'Overview overall bank loan parameters, query all raw structured objects in memory, and view compliance ledger audit trails.'}
                {selectedRole === 'Credit Analyst' && 'Adjust interest formulas, verify calculated debt-to-income limits, and inspect Gemini AI underwriting variables.'}
                {selectedRole === 'Fraud Officer' && 'Inspect transactions transcript for payday credit stacks or recreational gaming risks, examine suspicious documents, and protect banking assets.'}
                {selectedRole === 'Document Reviewer' && 'Audit client proofs, authorize category classifications, detect document compliance, and send verification status alerts.'}
                {selectedRole === 'Customer Service Agent' && 'Review pending communication bulletins, handle inquiries, and dispatch status alerts for ongoing customer applications.'}
              </p>
            </div>
            
            {/* Rapid switch context shortcut */}
            <div className="flex shrink-0 items-center gap-2 self-start md:self-center">
              <span className="text-xs text-[#706B63] font-medium font-mono">Workspace Sync Status:</span>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold text-[#5A6A50] font-mono">SECURE</span>
            </div>
          </div>

          {/* Core Dynamic Content Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT 2 COLUMNS: Main Core interactive Panels for the selected role */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* TARGET WORKSPACE RENDERING FOR RETAIL CUSTOMER PORTAL */}
              {selectedRole === 'Retail Customer' && selectedWorkflowTab === 'AI Early Warning' && (
                <div id="retail_customer_section" className="space-y-6">
                  
                  {/* Customer Application Wizard Block */}
                  <div className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                      <div>
                        <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                          <Sparkles className="w-5 h-5 text-[#C17E61]" /> Build a New Loan Portfolio (Customer Portal)
                        </h3>
                        <p className="text-xs text-[#706B63] mt-0.5">
                          Specify your target credit rating metrics, bank sheet details, and document parameters for automatic underwriting review.
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold bg-[#F2F0EB] text-[#5A6A50] px-3 py-1 rounded-full">
                        FORM AP-109
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Form Field 1 */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Applicant Credit Score Index
                        </label>
                        <input
                          type="number"
                          id="score_input"
                          min="300"
                          max="850"
                          value={creditScore}
                          onChange={(e) => setCreditScore(Number(e.target.value))}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        />
                        <div className="flex items-center justify-between text-[9px] text-[#A59D94] mt-1">
                          <span>300 (Subprime Limit)</span>
                          <span>850 (Exceptional Tier)</span>
                        </div>
                      </div>

                      {/* Form Field 2 */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Requested Principal Loan Amount ($)
                        </label>
                        <input
                          type="number"
                          id="amount_input"
                          min="1000"
                          max="1000000"
                          value={requestedAmount}
                          onChange={(e) => setRequestedAmount(Number(e.target.value))}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        />
                        <div className="flex items-center justify-between text-[9px] text-[#A59D94] mt-1">
                          <span>$1k Min</span>
                          <span>$1M Max Facility Cap</span>
                        </div>
                      </div>

                      {/* Form Field 3 */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Customer Net Monthly Income ($)
                        </label>
                        <input
                          type="number"
                          id="income_input"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        />
                      </div>

                      {/* Form Field 4 */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Employment Verification Category
                        </label>
                        <select
                          id="employment_selector"
                          value={employmentType}
                          onChange={(e: any) => setEmploymentType(e.target.value)}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        >
                          <option value="Salaried">Salaried (Full-time Payroll Employee)</option>
                          <option value="SelfEmployed">SelfEmployed (Freelance / LLC Proprietor)</option>
                          <option value="Contractor">Contractor (W9 Temporary Term)</option>
                          <option value="Unemployed">Unemployed (Requires Co-Guarantor)</option>
                        </select>
                      </div>

                      {/* Form Field 5 - Collateral */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Asset Collateral Pledging Type
                        </label>
                        <select
                          id="collateral_type_selector"
                          value={collateralType}
                          onChange={(e: any) => setCollateralType(e.target.value)}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        >
                          <option value="Property">Property (Real Estate Residential / Commercial)</option>
                          <option value="Vehicle">Vehicle (Title Lien Registered)</option>
                          <option value="Gold">Gold Reserve Asset</option>
                          <option value="Securities">Investment Brokerage Securities account</option>
                          <option value="Equipment">Heavy Commercial Equipment</option>
                        </select>
                      </div>

                      {/* Form Field 6 - Collateral worth */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Collateral Estimated Market Worth ($)
                        </label>
                        <input
                          type="number"
                          id="collateral_worth_input"
                          value={collateralWorth}
                          onChange={(e) => setCollateralWorth(Number(e.target.value))}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Descriptive Primary Collateral Location References
                        </label>
                        <input
                          type="text"
                          id="collateral_ref_input"
                          value={collateralDescription}
                          onChange={(e) => setCollateralDescription(e.target.value)}
                          placeholder="e.g. 522 Cascade Ave, Portland OR 97201"
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mb-1">
                          Loan Purpose & Amortization Rationale
                        </label>
                        <input
                          type="text"
                          id="purpose_input"
                          value={loanPurpose}
                          onChange={(e) => setLoanPurpose(e.target.value)}
                          className="w-full bg-[#fcfcfc] border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl"
                        />
                      </div>

                      {/* Bank Statement Upload Area - Dual PDF Drag & Drop + Manual Transcript Editor */}
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F2F0EB]/30 p-4 border border-[#E8E4DF] rounded-2xl">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#5A6A50] block">
                              📁 Streamlined PDF Bank Statement Uploader
                            </label>
                            <span className="text-[8px] bg-[#E8E4DF] text-[#706B63] px-2 py-0.5 rounded-full font-bold">
                              SECURE PLAID ACCREDITED
                            </span>
                          </div>
                          
                          {/* Interactive Drag & Drop Box */}
                          <div 
                            className="border-2 border-dashed border-[#E8E4DF] hover:border-[#5A6A50] bg-white rounded-xl p-4 transition-all text-center relative cursor-pointer group flex flex-col items-center justify-center min-h-[120px]"
                            onClick={() => document.getElementById('pdf-bank-statement-input')?.click()}
                          >
                            <input 
                              id="pdf-bank-statement-input"
                              type="file" 
                              accept=".pdf" 
                              onChange={handlePdfStatementUpload} 
                              className="hidden" 
                            />
                            
                            {uploadingPdf ? (
                              <div className="space-y-2 flex flex-col items-center">
                                <RefreshCw className="w-8 h-8 text-[#5A6A50] animate-spin" />
                                <span className="text-xs font-semibold text-[#2D3331] block">Running Underwriting AI OCR scanning...</span>
                                <span className="text-[9px] text-[#A59D94] block">Parsing financial ledger transactions & risks</span>
                              </div>
                            ) : uploadedPdfName ? (
                              <div className="space-y-1.5 flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                  <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="px-2 text-center">
                                  <span className="text-xs font-bold text-[#2D3331] block break-all">{uploadedPdfName}</span>
                                  <span className="text-[9px] text-[#5A6A50] font-mono uppercase font-bold block mt-0.5">✓ EXTRACTED & VERIFIED SECURE</span>
                                </div>
                                <span className="text-[9px] text-[#A59D94] group-hover:text-[#5A6A50] transition-colors block mt-1">
                                  Click to replace statement PDF
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-1 flex flex-col items-center">
                                <UploadCloud className="w-8 h-8 text-[#A59D94] group-hover:text-[#5A6A50] transition-transform group-hover:-translate-y-0.5 duration-150" />
                                <span className="text-xs font-semibold text-[#2D3331] block">Drag & drop or Click to upload PDF</span>
                                <span className="text-[9px] text-[#A59D94] block">Supports standard checking/savings PDF ledgers</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-[#706B63] leading-relaxed">
                            Upload a standard bank PDF statement (e.g., upload <code>warning_statements.pdf</code> for risk testing or <code>salary_ledger.pdf</code>) to extract transaction history instantly.
                          </p>
                        </div>

                        {/* Supplementary view showing OCR-extracted logs text-area */}
                        <div className="space-y-2 flex flex-col">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block">
                              📄 OCR extracted transactions ledger transcript
                            </label>
                            <span className="text-[8px] text-[#A59D94] italic font-mono">*Editable text logs</span>
                          </div>
                          <textarea
                            id="bank_statements_transcript"
                            rows={6}
                            value={bankStatementsText}
                            onChange={(e) => setBankStatementsText(e.target.value)}
                            placeholder="Extracted ledger statements appear here..."
                            className="w-full flex-1 min-h-[120px] bg-white border border-[#E8E4DF] p-3 text-xs rounded-xl font-mono text-[10px] focus:outline-hidden focus:ring-1 focus:ring-[#5A6A50] overflow-y-auto leading-relaxed resize-none"
                          />
                          <div className="flex items-center justify-between text-[9px] text-[#A59D94]">
                            <span>Include terms like "casino" or "payday loan" for risk testing</span>
                            <span className="font-bold text-[#5A6A50] font-mono">PLAID COMPLIANT</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Section & Interactive AI Check triggers */}
                    <div className="flex flex-col md:flex-row gap-3 pt-3 border-t border-[#E8E4DF]">
                      <button
                        type="button"
                        id="run_ai_analyser_button"
                        onClick={handleAIAnalysis}
                        disabled={analyzing}
                        className="flex-1 bg-[#2D3331] text-[#FDFCFB] hover:bg-black py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {analyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Auto-Underwriting analysis processing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-[#C17E61]" /> Trigger Rule & AI Scorecard Assessment
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        id="register_portfolio_button"
                        onClick={handleSubmitApplication}
                        className="bg-[#5A6A50] text-[#FDFCFB] hover:bg-[#4a5841] py-2.5 px-6 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Register Loan Portfolio <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Display Real-Time AI Scorecard Analysis output if available */}
                    {aiReport && (
                      <div id="realtime_ai_scorecard_result" style={{animation: 'slideUp 0.3s ease-out'}} className="bg-[#2D3331] rounded-2xl p-5 text-white space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-1.5 text-[#C17E61]">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">
                              Underwriting Decision Analysis Engine Output (Gemini-3.5)
                            </span>
                          </div>
                          <span className="text-[10px] text-white/50 tracking-wider">SEC REGULATED AUDIT COMPLIANT</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 block">Rating Letters</span>
                            <span className="text-2xl font-serif font-bold text-[#C17E61] block mt-1">
                              {aiReport.ratingLetter}
                            </span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 block">Risk Score Index</span>
                            <span className="text-2xl font-serif font-bold text-white block mt-1">
                              {aiReport.scoreIndex}<span className="text-[10px] text-white/40 font-sans">/100</span>
                            </span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 block">Default Prob.</span>
                            <span className="text-2xl font-serif font-bold text-[#C17E61] block mt-1">
                              {aiReport.probabilityOfDefault}%
                            </span>
                          </div>
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 block">Fraud Score</span>
                            <span className="text-2xl font-serif font-bold text-white block mt-1">
                              {aiReport.fraudScore}<span className="text-[10px] text-white/40 font-sans">/100</span>
                            </span>
                          </div>
                        </div>

                        {/* Fraud indicators / warnings checklist */}
                        {aiReport.fraudWarnings && aiReport.fraudWarnings.length > 0 && (
                          <div className="bg-red-950/40 border border-red-500/30 p-3 rounded-xl space-y-1.5 text-xs text-red-100">
                            <div className="flex items-center gap-1 text-red-300 font-semibold uppercase text-[10px] tracking-wider">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                              ATM Transaction Warning Flags Discovered
                            </div>
                            <ul className="list-disc pl-5 space-y-1">
                              {aiReport.fraudWarnings.map((warning, idx) => (
                                <li key={idx}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="text-xs text-white/80 space-y-1 bg-white/5 p-3.5 rounded-xl">
                          <span className="font-bold text-white block">Credit Capacity Decision: {aiReport.systemDecision}</span>
                          <p className="text-white/75">{aiReport.riskExplanation}</p>
                          <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <span className="text-[8px] text-white/40 uppercase block">Underwriter Base Rate</span>
                              <span className="font-semibold text-white block">{aiReport.recommendedBaseRate}%</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-white/40 uppercase block">Risk Adjustment Margin</span>
                              <span className="font-semibold text-white block">+{aiReport.recommendedMargin}%</span>
                            </div>
                          </div>
                        </div>

                        {aiReport.conditionsPrecedent && aiReport.conditionsPrecedent.length > 0 && (
                          <div className="space-y-1 text-xs">
                            <span className="text-[9px] uppercase tracking-wider text-white/50 font-bold block">
                              Automated Conditions Precedent Covenants Check
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1">
                              {aiReport.conditionsPrecedent.map((cond, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-white/70">
                                  <div className="w-2 h-2 rounded-full bg-[#5A6A50]"></div>
                                  <span>{cond}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="prose prose-invert prose-xs text-xs text-white/70 max-h-40 overflow-y-auto border-t border-white/10 pt-3">
                          <p className="font-semibold text-white/90 mb-1">Underwriting Assessment Text Insight Report:</p>
                          <div className="whitespace-pre-wrap">{aiReport.textInsightMarkdown}</div>
                        </div>

                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR LOAN OFFICER */}
              {selectedRole === 'Loan Officer' && (selectedWorkflowTab === 'Collateral Monitoring' || selectedWorkflowTab === 'Regulatory Compliance') && (
                <div id="loan_officer_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <Briefcase className="w-5 h-5 text-[#5A6A50]" /> Active Application Pipeline & Funds Disbursement
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Review condition precedent checklists for approved retail loans, and initiate escrow wired transfers upon complete compliance signoff.
                      </p>
                    </div>
                  </div>

                  {/* List of Applications */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-[#A59D94] uppercase tracking-wider block">
                      Active Customer Borrowing Facilities Queue ({store?.applications.length} applications matched)
                    </span>

                    <div className="divide-y divide-[#E8E4DF] border border-[#E8E4DF] rounded-2xl overflow-hidden">
                      {store?.applications.map((app) => {
                        const cust = store.customers.find(c => c.id === app.customerId);
                        const kyc = store.kycProfiles.find(k => k.customerId === app.customerId);
                        const isAppSelected = selectedAppId === app.id;
                        
                        return (
                          <div
                            key={app.id}
                            style={{ transition: 'all 0.15s ease-in-out' }}
                            className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-[#FDFCFB] ${
                              isAppSelected ? 'bg-[#F2F0EB]/40 border-l-4 border-l-[#5A6A50]' : ''
                            }`}
                            onClick={() => setSelectedAppId(app.id)}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-[#2D3331]">
                                  {cust?.name || 'Onboarding Registry'}
                                </span>
                                <span className="text-[10px] bg-[#E8E4DF] text-[#5A6A50] px-2 py-0.5 rounded-full font-bold">
                                  {app.id}
                                </span>
                                <span className={`text-[9px] uppercase font-bold tracking-wider ${
                                  app.status === 'Disbursed' ? 'text-green-600' :
                                  app.status === 'Approved' ? 'text-[#5A6A50]' :
                                  app.status === 'InReview' ? 'text-[#C17E61]' :
                                  app.status === 'ExceptionPending' ? 'text-orange-500' : 'text-[#706B63]'
                                }`}>
                                  Status: {app.status}
                                </span>
                              </div>
                              <div className="text-xs text-[#757771] flex items-center gap-3">
                                <span>Purpose: <strong>{app.purpose}</strong></span>
                                <span>• Requested: <strong>${app.requestedAmount.toLocaleString()}</strong></span>
                                <span>• Score: <strong>{cust?.creditScore || 610}</strong></span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {app.status === 'Approved' ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDisburseLoanFunds(app.id);
                                  }}
                                  className="bg-[#5A6A50] text-[#FDFCFB] hover:bg-[#4a5841] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer transition-all"
                                >
                                  Disburse Funds
                                </button>
                              ) : app.status === 'Disbursed' ? (
                                <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 uppercase font-black px-2 py-1 rounded-sm">
                                  Funded Wire OK
                                </span>
                              ) : (
                                <span className="text-[9px] bg-[#F2F0EB] text-[#706B63] uppercase font-bold px-2 py-1 rounded-sm">
                                  In Review Queue
                                </span>
                              )}
                              
                              <ChevronRight className="w-4 h-4 text-[#A59D94]" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Conditions checklist for selected application */}
                  {currentApp && (
                    <div style={{animation: 'slideUp 0.15s ease-out'}} className="bg-[#F2F0EB]/50 border border-[#E8E4DF] rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-3">
                        <span className="text-xs font-bold text-[#5A6A50] uppercase tracking-wider block">
                          Legal Conditions Precedent Checks ({store?.conditions.filter(c => c.applicationId === selectedAppId).length || 0} Required items)
                        </span>
                        <span className="text-[10px] text-[#706B63]">Toggle item once documentation verified</span>
                      </div>

                      <div className="space-y-2">
                        {store?.conditions.filter(c => c.applicationId === selectedAppId).map((cond) => {
                          return (
                            <div
                              key={cond.id}
                              className="flex items-start justify-between p-3 bg-white rounded-xl border border-[#E8E4DF]"
                            >
                              <div className="flex items-start gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCondition(cond.id)}
                                  className="mt-0.5 cursor-pointer"
                                >
                                  {cond.isMet ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-[#E8E4DF] hover:border-[#5A6A50]"></div>
                                  )}
                                </button>
                                <div className="text-xs">
                                  <p className={cond.isMet ? 'line-through text-[#A59D94]' : 'text-[#2D3331] font-medium'}>
                                    {cond.description}
                                  </p>
                                  {cond.isMet && cond.metAt && (
                                    <p className="text-[9px] text-[#5A6A50] mt-0.5 font-mono">
                                      ✓ Satisfied at {new Date(cond.metAt).toLocaleDateString()} {new Date(cond.metAt).toLocaleTimeString()} - By: {cond.metByOfficer}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <span className={`text-[8px] font-bold px-2 py-0.5 rounded font-mono ${
                                cond.isMet ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {cond.isMet ? 'SATISFIED' : 'PENDING'}
                              </span>
                            </div>
                          );
                        })}
                        {store?.conditions.filter(c => c.applicationId === selectedAppId).length === 0 && (
                          <div className="text-center py-4 bg-white rounded-xl border border-[#E8E4DF]">
                            <BookOpen className="w-5 h-5 mx-auto text-[#A59D94] mb-1" />
                            <p className="text-xs text-[#706B63]">No outstanding conditions precedent set for this category of loan.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR MANAGER */}
              {selectedRole === 'Manager' && (selectedWorkflowTab === 'Exception Handling' || selectedWorkflowTab === 'Payoff Processing' || selectedWorkflowTab === 'Collateral Release') && (
                <div id="manager_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex justify-between items-center border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <User className="w-5 h-5 text-[#C17E61]" /> Underwriting Exception Overrides & Payoff Admin
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Oversee risk parameters, execute manual credit bypass approvals, and authorize early loan facility settlements.
                      </p>
                    </div>
                  </div>

                  {/* Exception authorization action panel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Override Box */}
                    <div className="bg-[#F2F0EB]/40 border border-[#E8E4DF] rounded-2xl p-4 space-y-4">
                      <span className="text-xs font-bold text-[#5A6A50] uppercase tracking-wider block border-b border-[#E8E4DF] pb-2">
                        Execute Status Exception Override
                      </span>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block">
                          Select Application to Override
                        </label>
                        <select
                          value={selectedAppId}
                          onChange={(e) => setSelectedAppId(e.target.value)}
                          className="w-full bg-white border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl focus:outline-hidden"
                        >
                          {store?.applications.map(app => (
                            <option key={app.id} value={app.id}>
                              {app.id} - ${app.requestedAmount.toLocaleString()} ({app.status})
                            </option>
                          ))}
                        </select>

                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#706B63] block mt-2">
                          Audited Exception Note Justification
                        </label>
                        <textarea
                          rows={2}
                          value={managerOverrideNote}
                          onChange={(e) => setManagerOverrideNote(e.target.value)}
                          className="w-full bg-white border border-[#E8E4DF] px-3 py-2 text-xs rounded-xl font-sans"
                        />

                        <button
                          type="button"
                          onClick={() => handleExceptionOverride(selectedAppId)}
                          className="w-full bg-[#5A6A50] text-white hover:bg-[#4a5841] text-xs font-semibold py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Approve Exception (Force Status: APPROVED)
                        </button>
                      </div>
                    </div>

                    {/* Settlement Box */}
                    <div className="bg-[#F2F0EB]/40 border border-[#E8E4DF] rounded-2xl p-4 space-y-4">
                      <span className="text-xs font-bold text-[#C17E61] uppercase tracking-wider block border-b border-[#E8E4DF] pb-2">
                        Payoff Settlement Processing
                      </span>

                      <div className="space-y-3">
                        <p className="text-xs text-[#706B63] leading-relaxed">
                          Close active portfolios early. Once authorized, outstanding principal balances are settled, facility status transforms to 'Closed' and related property collateral releases.
                        </p>

                        <div className="bg-white p-3 rounded-xl border border-[#E8E4DF] space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#A59D94]">Application:</span>
                            <span className="font-bold text-[#2D3331]">{selectedAppId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A59D94]">Pledged Collateral Worth:</span>
                            <span className="font-bold text-[#5A6A50]">
                              ${currentCollateralObj ? currentCollateralObj.estimatedWorth.toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#A59D94]">LTV Ration Threshold:</span>
                            <span className="font-bold text-red-600">
                              {currentCollateralObj ? `${(currentCollateralObj.ltvRatio * 100).toFixed(1)}%` : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEarlyPayoff(selectedAppId)}
                          className="w-full bg-[#2D3331] text-white hover:bg-black text-xs font-semibold py-2 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Authorize Payoff & Release Deeds
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR ADMIN */}
              {selectedRole === 'Admin' && (selectedWorkflowTab === 'Regulatory Compliance' || selectedWorkflowTab === 'Payment Processing') && (
                <div id="admin_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <Sliders className="w-5 h-5 text-[#5A6A50]" /> Administrative Facility Settings & Data View
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Inspect running memory records of the 11 Core Data Objects directly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#F2F0EB]/50 p-4 rounded-xl border border-[#E8E4DF] text-xs space-y-2">
                      <span className="font-semibold block text-[#5A6A50]">System Database Status</span>
                      <div className="space-y-1 text-[#706B63]">
                        <p>✓ Customers Profile Store: {store?.customers.length} Objects</p>
                        <p>✓ Loan Application Covenants: {store?.applications.length} Objects</p>
                        <p>✓ Financial Statements Audits: {store?.financialStatements.length} Objects</p>
                        <p>✓ Collateral Valuation Records: {store?.collaterals.length} Objects</p>
                        <p>✓ Active Obligations Matrix: {store?.obligations.length} Objects</p>
                        <p>✓ Secure KYC Verify Files: {store?.kycProfiles.length} Objects</p>
                        <p>✓ Support Enquiries Stream: {store?.queries.length} Objects</p>
                        <p>✓ Amortization Payments Registry: {store?.payments.length} Objects</p>
                      </div>
                    </div>

                    <div className="bg-[#F2F0EB]/50 p-4 rounded-xl border border-[#E8E4DF] text-xs space-y-2">
                      <span className="font-semibold block text-[#C17E61]">Active Borrowing Facility Covenants</span>
                      <div className="space-y-1.5">
                        {store?.facilities.map(f => (
                          <div key={f.id} className="p-2 bg-white rounded-lg border border-[#E8E4DF]">
                            <div className="flex justify-between font-bold text-[10px] text-[#2D3331]">
                              <span>{f.name}</span>
                              <span className="text-[#5A6A50]">{f.interestType}</span>
                            </div>
                            <span className="text-[10px] text-[#706B63] block">{f.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR CREDIT ANALYST */}
              {selectedRole === 'Credit Analyst' && (selectedWorkflowTab === 'Interest Management' || selectedWorkflowTab === 'Loan Amendment') && (
                <div id="credit_analyst_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <BarChart3 className="w-5 h-5 text-[#5A6A50]" /> Underwriting Analyst Ledger & Debt Service Adjuster
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Review financial capability statements, computed DTI metrics, and adjust core margins to fit macro profiles.
                      </p>
                    </div>
                  </div>

                  {currentApp && (
                    <div className="space-y-4">
                      
                      {/* Financial statistics dashboard */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[#FDFCFB] p-4 rounded-xl border border-[#E8E4DF]">
                          <span className="text-[9px] uppercase tracking-wider text-[#A59D94] block">Verified Monthly Income</span>
                          <span className="text-xl font-bold block text-[#5A6A50]">${currentCustomerObj?.monthlyIncome.toLocaleString()}</span>
                          <span className="text-[9px] text-[#A59D94] mt-0.5 block">Audit Status: {currentFinancialObj?.auditStatus}</span>
                        </div>
                        <div className="bg-[#FDFCFB] p-4 rounded-xl border border-[#E8E4DF]">
                          <span className="text-[9px] uppercase tracking-wider text-[#A59D94] block">Obligations Ratio (DTI)</span>
                          <span className="text-xl font-bold block text-red-600">
                            {currentFinancialObj ? `${(currentFinancialObj.dtiRatio * 100).toFixed(1)}%` : '15.0%'}
                          </span>
                          <span className="text-[9px] text-[#A59D94] mt-0.5 block">Standard ceiling is 45.0%</span>
                        </div>
                        <div className="bg-[#FDFCFB] p-4 rounded-xl border border-[#E8E4DF]">
                          <span className="text-[9px] uppercase tracking-wider text-[#A59D94] block">Pricing Interest Matrix</span>
                          <span className="text-xl font-bold block text-[#2D3331]">
                            {currentTermsObj ? `${currentTermsObj.finalRate}%` : '6.75%'}
                          </span>
                          <span className="text-[9px] text-[#A59D94] mt-0.5 block">{currentTermsObj?.fixedOrFloating} Annuity Mode</span>
                        </div>
                      </div>

                      {/* Manual Rate Adjuster Form */}
                      <div className="bg-[#F2F0EB]/40 p-4 rounded-xl border border-[#E8E4DF] space-y-4">
                        <span className="text-xs font-bold text-[#5A6A50] uppercase tracking-wider block">
                          Recalculate Yield Margin
                        </span>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-[#706B63] block mb-1">Amended Final Interest Rate (%)</label>
                            <input
                              type="number"
                              step="0.05"
                              value={amendmentRate}
                              onChange={(e) => setAmendmentRate(Number(e.target.value))}
                              className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-[#706B63] block mb-1">Amended Duration Term (Months)</label>
                            <input
                              type="number"
                              value={amendmentTerm}
                              onChange={(e) => setAmendmentTerm(Number(e.target.value))}
                              className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-lg"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handlePostAmendment}
                          className="px-4 py-2 bg-[#5A6A50] text-[#FDFCFB] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Commit pricing term revision
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR FRAUD OFFICER */}
              {selectedRole === 'Fraud Officer' && (selectedWorkflowTab === 'Delinquency Monitoring' || selectedWorkflowTab === 'AI Early Warning') && (
                <div id="fraud_officer_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-5 h-5 text-red-500" /> Security Screening & Pattern Recognition Board
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Review risk indexes, highlight payday credit patterns, track duplicate data matches, and mark document fraud indicators.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {store?.riskRatings.filter(r => r.fraudScore > 20).map(risk => (
                      <div key={risk.id} className="p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-red-800 text-xs uppercase tracking-wide">
                              Suspicious Score: {risk.fraudScore}/100
                            </span>
                            <span className="text-[9px] bg-red-100 text-red-700 px-2 rounded-full font-mono font-bold">
                              APP REF {risk.applicationId}
                            </span>
                          </div>
                          <p className="text-xs text-red-700 font-medium">RATIONALE: {risk.riskExplanation}</p>
                          {risk.fraudWarnings && risk.fraudWarnings.length > 0 && (
                            <div className="text-[10px] text-red-800/80 pt-1">
                              <strong>Flags Detected:</strong> {risk.fraudWarnings.join(', ')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetDocStatus(risk.applicationId, 'Rejected', 'Rejected based on high fraud indicators')}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg cursor-pointer"
                          >
                            Block Covenant Approved Route
                          </button>
                        </div>
                      </div>
                    ))}
                    {store?.riskRatings.filter(r => r.fraudScore > 20).length === 0 && (
                      <div className="text-center py-6 border border-[#E8E4DF] rounded-2xl">
                        <HelpCircle className="w-6 h-6 mx-auto text-[#A59D94] mb-1" />
                        <span className="text-xs text-[#7s7771]">Excellent. Clear of high-risk security indices.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR DOCUMENT REVIEWER */}
              {selectedRole === 'Document Reviewer' && selectedWorkflowTab === 'Collateral Monitoring' && (
                <div id="document_reviewer_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <FileText className="w-5 h-5 text-[#5A6A50]" /> Secured Client Document Review Auditing Room
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Perform manual verification checks on uploaded income statements, payroll records, and physical deed assets.
                      </p>
                    </div>
                  </div>

                  {/* Manual Document Uploader form */}
                  <div className="bg-[#F2F0EB]/30 p-4 border border-[#E8E4DF] rounded-2xl space-y-4">
                    <span className="text-xs font-bold text-[#5A6A50] uppercase tracking-wider block border-b border-[#E8E4DF] pb-2">
                      Secure Direct Client File Integration
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-[#706B63] block mb-1">File Name</label>
                        <input
                          type="text"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#706B63] block mb-1">Upload Categorization</label>
                        <select
                          value={docCategory}
                          onChange={(e: any) => setDocCategory(e.target.value)}
                          className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-xl"
                        >
                          <option value="KYC">KYC Verify Slip Account</option>
                          <option value="IncomeProof">Income Statement Proof</option>
                          <option value="CollateralProof">Collateral Appraisal Copy</option>
                          <option value="BankStatement">Plaid Bank Transaction Sheet</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#706B63] block mb-1">Classification Label</label>
                        <input
                          type="text"
                          value={docClassification}
                          onChange={(e) => setDocClassification(e.target.value)}
                          className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-xl"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddDocument}
                      className="inline-flex items-center gap-1 bg-[#5A6A50] text-white hover:bg-[#4a5841] text-xs font-bold px-4 py-2 rounded-xl uppercase tracking-wider cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" /> Trigger Automated Review Upload
                    </button>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-[#706B63] block">
                      Uploaded Documents Ledger ({store?.documents.length} objects queued)
                    </span>

                    <div className="space-y-2">
                      {store?.documents.map((doc) => (
                        <div key={doc.id} className="p-3.5 bg-[#F9F8F6] rounded-xl border border-[#E8E4DF] flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2D3331]">{doc.name}</span>
                              <span className="text-[9px] bg-sky-100 text-sky-800 uppercase px-2 py-0.5 rounded-full font-bold">
                                {doc.category}
                              </span>
                            </div>
                            <p className="text-[#757771] text-[11px] mt-0.5">Classification: {doc.classificationLabel} | Upload: {new Date(doc.uploadTime).toUTCString()}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.verificationStatus === 'Pending' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSetDocStatus(doc.id, 'Approved')}
                                  className="bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm cursor-pointer"
                                >
                                  Mark Approved
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSetDocStatus(doc.id, 'Rejected')}
                                  className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-sm cursor-pointer"
                                >
                                  Mark Rejected
                                </button>
                              </>
                            ) : (
                              <span className={`px-2 py-1 rounded-sm text-[9px] font-bold ${
                                doc.verificationStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                STATUS: {doc.verificationStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TARGET WORKSPACE RENDERING FOR CUSTOMER SERVICE AGENT */}
              {selectedRole === 'Customer Service Agent' && selectedWorkflowTab === 'Customer Servicing' && (
                <div id="service_agent_section" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                    <div>
                      <h3 className="font-serif text-lg text-[#2D3331] font-semibold flex items-center gap-1.5">
                        <HelpCircle className="w-5 h-5 text-[#C17E61]" /> Institutional Customer Servicing Tickets Box
                      </h3>
                      <p className="text-xs text-[#706B63]">
                        Log customer comments, dispatch answers, and handle digital bulletins instantly.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create Customer Query panel */}
                    <div className="bg-[#F2F0EB]/30 p-4 border border-[#E8E4DF] rounded-2xl space-y-4">
                      <span className="text-xs font-bold text-[#5A6A50] uppercase tracking-wider block">
                        Create Support Ticket
                      </span>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">Ticket Subject</label>
                          <input
                            type="text"
                            value={customerQuerySubject}
                            onChange={(e) => setCustomerQuerySubject(e.target.value)}
                            className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-[#706B63] uppercase block mb-1">Inquiry Description Message</label>
                          <textarea
                            rows={3}
                            value={customerQueryMessage}
                            onChange={(e) => setCustomerQueryMessage(e.target.value)}
                            className="w-full bg-white border border-[#E8E4DF] px-3 py-1.5 text-xs rounded-xl"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleCreateCustomerQuery}
                          className="w-full bg-[#5A6A50] hover:bg-[#4a5841] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Send Ticket to Support Pool
                        </button>
                      </div>
                    </div>

                    {/* Pending Service Center Pool */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-[#2D3331] block">
                        Pending Inquiries Pool ({store?.queries.length} queries)
                      </span>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {store?.queries.map(q => (
                          <div key={q.id} className="p-3 bg-white border border-[#E8E4DF] rounded-xl space-y-2 text-xs">
                            <div className="flex justify-between items-center bg-[#F2F0EB] p-2 rounded">
                              <span className="font-bold text-[#2D3331]">{q.subject}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                q.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {q.status}
                              </span>
                            </div>
                            <p className="text-[#757771]">{q.message}</p>
                            
                            {q.agentResponse ? (
                              <div className="p-2 bg-green-50/50 border border-green-200 rounded leading-relaxed text-green-900 text-[11px]">
                                <strong>Vanguard Response:</strong> {q.agentResponse}
                              </div>
                            ) : (
                              <div className="pt-2 border-t border-[#E8E4DF] space-y-2">
                                <textarea
                                  rows={1}
                                  placeholder="Type response bulletin message..."
                                  value={agentResponseText}
                                  onChange={(e) => setAgentResponseText(e.target.value)}
                                  className="w-full bg-slate-50 border border-[#E8E4DF] px-2 py-1 rounded text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRespondToQuery(q.id)}
                                  className="w-full bg-[#2D3331] hover:bg-black text-white text-[10px] font-bold uppercase py-1 rounded transition-colors cursor-pointer"
                                >
                                  Submit Resolution Reply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SPECIFIC WORKFLOW TARGET VIEW (THE 11 BANKING WORKFLOWS VIEWER) */}
              <div id="active_workflow_panel" className="bg-white rounded-3xl border border-[#E8E4DF] p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5A6A50]"></span>
                    <h3 className="font-serif text-lg text-[#2D3331] font-semibold">
                      Automated Process Workspace: {selectedWorkflowTab}
                    </h3>
                  </div>
                  <span className="text-[10px] bg-[#F2F0EB] text-[#706B63] font-bold font-mono px-3 py-1 rounded-full">
                    SYSTEM INSTANCE 48
                  </span>
                </div>

                {/* 1. AI Early Warning default risk predictor */}
                {selectedWorkflowTab === 'AI Early Warning' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      AI-driven warnings check for rapid changes in creditworthiness, including balance alerts, LTV changes, and high credit utilizations.
                    </p>
                    <div className="space-y-3">
                      {store?.warningAlerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs ${
                          alert.severity === 'High' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-orange-50/50 border-orange-200 text-orange-950'
                        }`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold uppercase tracking-wider text-[10px]">
                                SEVERITY: {alert.severity} ({alert.triggerType})
                              </span>
                              <span className="text-[8px] bg-white/60 text-[#3E4543] px-2 rounded font-mono">
                                TRG: {new Date(alert.triggeredAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="font-medium">{alert.explanation}</p>
                          </div>
                          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-300 font-mono">
                            STATUS: {alert.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Payment Processing scheduler ledger */}
                {selectedWorkflowTab === 'Payment Processing' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      Review Scheduled Coupon repayments. You can trigger manual payment simulation to clear outstanding penalty fee balances.
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs divide-y divide-[#E8E4DF]">
                        <thead>
                          <tr className="text-[10px] uppercase font-bold text-[#A59D94] bg-[#F2F0EB]/30">
                            <th className="p-3">Payment ID</th>
                            <th className="p-3">Application Ref</th>
                            <th className="p-3">Principal Coupon</th>
                            <th className="p-3">Interest Fee</th>
                            <th className="p-3">Amount Processed</th>
                            <th className="p-3">Penalty Applied</th>
                            <th className="p-3">Due Target</th>
                            <th className="p-3 text-right">Amortization Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E4DF]">
                          {store?.payments.map(pay => {
                            const isOverdue = pay.status === 'Overdue';
                            return (
                              <tr key={pay.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-mono text-[11px]">{pay.id}</td>
                                <td className="p-3 font-bold text-[#5A6A50]">{pay.loanApplicationId}</td>
                                <td className="p-3 font-mono">${pay.principalDue}</td>
                                <td className="p-3 font-mono">${pay.interestDue}</td>
                                <td className="p-3 font-mono font-bold">${pay.amountPaid}</td>
                                <td className="p-3 text-red-600 font-mono">+${pay.penaltyApplied}</td>
                                <td className="p-3 text-[#706B63]">{new Date(pay.dueDate).toLocaleDateString()}</td>
                                <td className="p-3 text-right">
                                  {pay.status !== 'Paid' ? (
                                    <button
                                      type="button"
                                      onClick={() => handleProcessPayment(pay.id, pay.principalDue + pay.interestDue + pay.penaltyApplied)}
                                      className="bg-[#2D3331] hover:bg-black text-[9px] text-[#FDFCFB] px-2.5 py-1 rounded uppercase tracking-wider font-bold cursor-pointer transition-colors"
                                    >
                                      Settle ${pay.principalDue + pay.interestDue + pay.penaltyApplied}
                                    </button>
                                  ) : (
                                    <span className="text-[9px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded font-black">
                                      SETTLED OK
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3. Interest Management Penalty Logs */}
                {selectedWorkflowTab === 'Interest Management' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      View annual interest rates, calculated default margins, and dynamic penalty rates for early or late collections.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {store?.pricingTerms.map(term => (
                        <div key={term.id} className="p-4 bg-[#F2F0EB]/30 rounded-2xl border border-[#E8E4DF] text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#2D3331]">TERM COVENANT FOR APP {term.applicationId}</span>
                            <span className="text-[9px] bg-[#5A6A50] text-[#FDFCFB] px-2 rounded-full font-bold">
                              {term.fixedOrFloating}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 py-2 text-center text-[11px] font-mono border-y border-[#E8E4DF]">
                            <div>
                              <span className="text-[8px] text-[#A59D94] block uppercase">Base Rate</span>
                              <span className="font-extrabold text-[#3E4543]">{term.baseInterestRate}%</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-[#A59D94] block uppercase">Risk Margin</span>
                              <span className="font-extrabold text-[#5A6A50]">+{term.marginRate}%</span>
                            </div>
                            <div>
                              <span className="text-[8px] text-[#A59D94] block uppercase">Total Yield</span>
                              <span className="font-extrabold text-[#C17E61]">{term.finalRate}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-[10px] text-[#706B63]">
                            <span>Penalty Surcharge Rate:</span>
                            <span className="font-bold text-red-600">+{term.penaltyRate}% p.a.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Customer Servicing */}
                {selectedWorkflowTab === 'Customer Servicing' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      Comprehensive communications stream linking customer queries to the resolution agent panel. Respond to open requests instantly.
                    </p>
                    <div className="space-y-3">
                      {store?.queries.map(query => (
                        <div key={query.id} className="p-4 bg-[#FDFCFB] rounded-2xl border border-[#E8E4DF] space-y-2 text-xs">
                          <div id="ticket_header" className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-[#2D3331]">{query.subject}</p>
                              <p className="text-[10px] text-[#706B63]">Created at {new Date(query.createdAt).toUTCString()}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase ${
                              query.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {query.status}
                            </span>
                          </div>
                          <p className="text-[#3E4543] leading-relaxed italic">"{query.message}"</p>
                          {query.agentResponse && (
                            <div className="p-3 bg-green-50 text-green-900 rounded-xl border border-green-200 mt-2">
                              <strong>✓ Agent Resolution:</strong> {query.agentResponse}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Loan Amendment */}
                {selectedWorkflowTab === 'Loan Amendment' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-xs text-[#706B63]">
                      Manage active borrowing agreements. Role constraints require **Credit Analyst** or **Manager** session parameters to authorize covenant rate amendments.
                    </p>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 leading-relaxed">
                      💡 To amend contract variables, select the **Credit Analyst** from the persona switcher dropdown top right. You can adjust final rates and durations iteratively.
                    </div>
                  </div>
                )}

                {/* 6. Delinquency Monitoring */}
                {selectedWorkflowTab === 'Delinquency Monitoring' && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#706B63]">
                      Automatic triggers screen active accounts for late payments. Portfolios defaulting beyond the 14-day grace window spark formal regulatory warnings.
                    </p>
                    <div className="space-y-2">
                      {store?.payments.filter(p => p.status === 'Overdue').map(p => {
                        const appObj = store.applications.find(a => a.id === p.loanApplicationId);
                        const customerObj = store.customers.find(c => c.id === appObj?.customerId);
                        return (
                          <div key={p.id} className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between text-xs text-red-900 text-left">
                            <div>
                              <p className="font-bold">Overdue repayment limit breached for payment {p.id}</p>
                              <p className="text-[#706B63]">Customer: {customerObj?.name} | Outstanding Term Surcharge: ${p.principalDue + p.interestDue} (+${p.penaltyApplied} penalty)</p>
                            </div>
                            <span className="font-mono text-red-700 bg-red-100 border border-red-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              Delinquency Letter Triggered
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. Collateral Monitoring */}
                {selectedWorkflowTab === 'Collateral Monitoring' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      Calculate loan-to-value (LTV) limits dynamically based on the latest property appraisal valuations.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {store?.collaterals.map(col => {
                        const applicationObj = store.applications.find(a => a.id === col.applicationId);
                        const evaluatedLtv = applicationObj ? Number((applicationObj.requestedAmount / col.currentValuation).toFixed(2)) : 0.7;
                        return (
                          <div key={col.id} className="p-4 bg-white border border-[#E8E4DF] rounded-2xl space-y-3 text-xs">
                            <div className="flex justify-between items-center border-b border-[#E8E4DF] pb-2">
                              <span className="font-bold text-[#2D3331]">{col.type} - REF {col.titleDeedReference}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                col.status === 'Released' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {col.status}
                              </span>
                            </div>
                            <p className="text-[#706B63]">{col.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                              <div>
                                <span className="text-[9px] text-[#A59D94] block uppercase">Appraisal valuation</span>
                                <span className="font-bold text-[#3E4543]">${col.currentValuation.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-[#A59D94] block uppercase">Computed-LTV Limit</span>
                                <span className={`font-bold ${evaluatedLtv > 0.8 ? 'text-red-600' : 'text-[#5A6A50]'}`}>
                                  {(evaluatedLtv * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 8. Exception Handling */}
                {selectedWorkflowTab === 'Exception Handling' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-xs text-[#706B63]">
                      Authorize underwriters exception approval status overrides. Standard compliance requires a written explanation submitted to the SEC logs.
                    </p>
                    <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl text-slate-800 leading-relaxed">
                      💡 To authorize status exceptions, select the **Loan Senior Manager** role from the persona dropdown widget dynamically.
                    </div>
                  </div>
                )}

                {/* 9. Payoff Processing */}
                {selectedWorkflowTab === 'Payoff Processing' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-[#706B63]">
                      Execute mortgage or auto loan settlement procedures. Early settlements release the associated assets.
                    </p>
                    <div className="p-4 bg-slate-100 border border-[#CBD5E1] rounded-2xl text-slate-800 leading-relaxed">
                      💡 Outstanding coupon payoff procedures are administrative. Switch to the **Loan Senior Manager** role to perform early settlements and execute title release.
                    </div>
                  </div>
                )}

                {/* 10. Regulatory Compliance and Audit Logs */}
                {selectedWorkflowTab === 'Regulatory Compliance' && (
                  <div className="space-y-4">
                    <p className="text-xs text-[#706B63]">
                      Automatic audit traces logged onto our mock centralized core cluster ledger, tracking actor identities, roles, action details, and categories.
                    </p>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                      {store?.auditLogs.map(log => (
                        <div key={log.id} style={{fontFamily: 'var(--font-sans)', fontSize: '11px'}} className="p-3 bg-white border border-[#E8E4DF] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-[#2D3331] uppercase tracking-wider text-[9px]">{log.action}</span>
                              <span className="text-[9px] bg-sky-50 text-sky-800 border border-sky-200 px-2 rounded-full font-bold">
                                {log.category}
                              </span>
                            </div>
                            <p className="text-[#706B63] leading-relaxed text-xs">{log.details}</p>
                            <div className="text-[9px] text-[#A59D94] flex items-center gap-3 font-mono">
                              <span>Actor: <strong>{log.actorEmail}</strong></span>
                              <span>Role: <strong>{log.role}</strong></span>
                            </div>
                          </div>
                          <span className="text-[9px] text-[#A59D94] font-mono tracking-wider shrink-0">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 11. Collateral Release */}
                {selectedWorkflowTab === 'Collateral Release' && (
                  <div className="space-y-3">
                    <p className="text-xs text-[#706B63]">
                      When payoff settlement clears, collateral status shifts permanently to 'Released' and the legal title deed reference dispatches back to the verified client.
                    </p>
                    <div className="space-y-2">
                      {store?.collaterals.filter(s => s.status === 'Released').map(col => (
                        <div key={col.id} className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between text-xs text-green-900 text-left">
                          <div>
                            <p className="font-bold">✓ Automated Legal Title Release Dispatched</p>
                            <p className="text-[#706B63]">Asset Reference: {col.titleDeedReference} | Category: {col.type} | Worth: ${col.estimatedWorth.toLocaleString()}</p>
                          </div>
                          <span className="text-[10px] bg-green-600 text-white font-extrabold py-1 px-2 rounded tracking-wide uppercase font-mono">
                            Released
                          </span>
                        </div>
                      ))}
                      {store?.collaterals.filter(s => s.status === 'Released').length === 0 && (
                        <div className="text-center py-6 border border-[#E8E4DF] rounded-2xl">
                          <HelpCircle className="w-6 h-6 mx-auto text-[#A59D94] mb-1" />
                          <span className="text-xs text-[#757771]">No released deeds found on database. Pay off active loans to release.</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* RIGHT COLUMN: The 11 Core Data Objects & Active Application Inspections */}
            <div id="right_data_objects_grid" className="space-y-6">
              
              {/* Core Active Loan Object Details Card */}
              <div id="inspector_widget_card" className="bg-[#2D3331] rounded-3xl p-6 text-white space-y-6 shadow-md border border-[#E8E4DF]/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-serif text-lg tracking-tight">Active Core Loan Object</h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">DB Inspector Tool</p>
                  </div>
                  <HelpCircle className="w-5 h-5 text-white/40" />
                </div>

                <div className="space-y-4">
                  {/* Select loan application reference */}
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-[#A59D94] block mb-1.5">
                      Select DB Record ID
                    </label>
                    <select
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white font-semibold text-xs py-1.5 px-3 rounded-xl focus:outline-hidden"
                    >
                      {store?.applications.map(app => (
                        <option className="bg-[#2D3331] text-white" key={app.id} value={app.id}>
                          {app.id} - ${app.requestedAmount.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {currentApp ? (
                    <div className="space-y-4 text-xs">
                      
                      {/* Customer core variables */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[9px] text-[#A59D94] uppercase tracking-wider font-extrabold block">
                          [1] Customer Profile
                        </span>
                        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px] text-white/80">
                          <span className="text-white/40">Name:</span>
                          <span className="font-bold text-right">{currentCustomerObj?.name}</span>
                          <span className="text-white/40">Credit Score:</span>
                          <span className={`font-bold text-right ${currentCustomerObj && currentCustomerObj.creditScore > 700 ? 'text-green-400' : 'text-red-400'}`}>
                            {currentCustomerObj?.creditScore}
                          </span>
                          <span className="text-white/40">Monthly Income:</span>
                          <span className="font-bold text-right">${currentCustomerObj?.monthlyIncome.toLocaleString()}</span>
                          <span className="text-white/40">Employment:</span>
                          <span className="font-bold text-right">{currentCustomerObj?.employmentType}</span>
                        </div>
                      </div>

                      {/* Application core variables */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[9px] text-[#A59D94] uppercase tracking-wider font-extrabold block">
                          [2] Loan Application Record
                        </span>
                        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px] text-white/80">
                          <span className="text-white/40">Facility status:</span>
                          <span className="font-bold text-right uppercase tracking-wider text-[#C17E61]">{currentApp.status}</span>
                          <span className="text-white/40">Requested:</span>
                          <span className="font-bold text-right text-white">${currentApp.requestedAmount.toLocaleString()}</span>
                          <span className="text-white/40">Applied Time:</span>
                          <span className="font-bold text-right text-[10px] truncate">{new Date(currentApp.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Plaid financial variables */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[9px] text-[#A59D94] uppercase tracking-wider font-extrabold block">
                          [3] Financial Statement metrics
                        </span>
                        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px] text-white/80">
                          <span className="text-white/40">Debt Ratio DTI:</span>
                          <span className="font-bold text-right text-red-400">
                            {currentFinancialObj ? `${(currentFinancialObj.dtiRatio * 100).toFixed(1)}%` : '15%'}
                          </span>
                          <span className="text-white/40">Audit checks:</span>
                          <span className="font-bold text-right text-[#C17E61]">{currentFinancialObj?.auditStatus}</span>
                        </div>
                      </div>

                      {/* AI Risk ratings variables */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[9px] text-[#A59D94] uppercase tracking-wider font-extrabold block">
                          [4] AI/ML Risk Rating
                        </span>
                        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px] text-white/80">
                          <span className="text-white/40">Rating Grade:</span>
                          <span className="font-bold text-right text-green-400">{currentRiskObj?.ratingLetter}</span>
                          <span className="text-white/40">Default chance:</span>
                          <span className="font-bold text-right">{currentRiskObj?.probabilityOfDefault}%</span>
                          <span className="text-white/40">Fraud index:</span>
                          <span className="font-bold text-right">{currentRiskObj?.fraudScore}/100</span>
                        </div>
                      </div>

                      {/* Collateral variables */}
                      <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                        <span className="text-[9px] text-[#A59D94] uppercase tracking-wider font-extrabold block">
                          [5] Collateral Security
                        </span>
                        <div className="grid grid-cols-2 gap-y-1.5 font-mono text-[11px] text-white/80">
                          <span className="text-white/40">Asset category:</span>
                          <span className="font-bold text-right">{currentCollateralObj?.type || 'No Collateral Pledg'}</span>
                          <span className="text-white/40">Computed LTV:</span>
                          <span className="font-bold text-right text-[#C17E61]">
                            {currentCollateralObj ? `${(currentCollateralObj.ltvRatio * 100).toFixed(1)}%` : 'N/A'}
                          </span>
                          <span className="text-white/40">Valuation:</span>
                          <span className="font-bold text-right">${currentCollateralObj?.currentValuation.toLocaleString()}</span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <p className="text-xs text-white/50">Register dynamic loan portfolio above to inspect the fully populated data schemas...</p>
                  )}
                </div>
              </div>

              {/* Regulatory Checklist widget */}
              <div id="compliance_checklist_widget" className="bg-white rounded-3xl border border-[#E8E4DF] p-5 flex flex-col shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E4DF] pb-3">
                  <h3 className="font-serif text-base text-[#2D3331]">Regulatory Audit Checklist</h3>
                  <span className="px-2 py-0.5 bg-[#F2F0EB] text-[#5A6A50] text-[10px] rounded font-bold uppercase">
                    SEC COMPLIANT
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                    <div className="text-xs">
                      <p className="font-bold text-[#2D3331]">OFAC Screening Protocol</p>
                      <p className="text-[10px] text-[#706B63]">0 matches on centralized criminal lists • Audited</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                    <div className="text-xs">
                      <p className="font-bold text-[#2D3331]">Anti-Money Laundering Checks</p>
                      <p className="text-[10px] text-[#706B63]">Pattern: Clean Cash Flow Buffer • Code SAR-392</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#5A6A50] shrink-0"></div>
                    <div className="text-xs">
                      <p className="font-bold text-[#2D3331]">Reg B Disclosure Statement</p>
                      <p className="text-[10px] text-[#706B63]">Covenant files signed & authorized automatically</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E4DF]">
                  <p className="text-[10px] uppercase font-bold text-[#A59D94] tracking-wider mb-2">Automated Notifications Bullettin</p>
                  <div className="bg-[#F2F0EB] p-3 rounded-xl border border-[#E8E4DF] space-y-1 text-[11px] text-[#2D3331] leading-relaxed">
                    <div className="flex items-center gap-1.5 text-[#5A6A50] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Electronic Bulletins Dispatched</span>
                    </div>
                    <p>✓ Email notification issued to saivikranthpulikonda@gmail.com</p>
                    <p>✓ SMS bulletin sent to +1 (555) 777-1020</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
          </div>
          )}

        </main>
      </div>

      {/* 4. Footer Status Bar styling */}
      <footer id="banking_main_footer" className="h-10 bg-[#2D3331] text-[9px] text-[#A59D94] px-6 flex items-center justify-between uppercase tracking-[0.2em] border-t border-white/5">
        <div className="flex gap-6">
          <span>Database Node State: <span className="text-green-400 font-bold">ACTIVE OK</span></span>
          <span>Core AI Processor: <span className="text-white">Gemini-3.5-Flash</span></span>
        </div>
        <div className="flex gap-6 italic">
          <span>Real-time Compliance Sync: 100%</span>
          <span>Last SEC Registry update: 14:02 UTC</span>
        </div>
      </footer>

    </div>
  );
}
