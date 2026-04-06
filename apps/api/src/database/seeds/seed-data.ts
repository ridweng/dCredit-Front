import { CategoryType } from '../../common/enums/category-type.enum';
import { AccountType } from '../../common/enums/account-type.enum';
import { CreditType } from '../../common/enums/credit-type.enum';
import { FinancialSourceStatus } from '../../common/enums/financial-source-status.enum';
import { InstallmentStatus } from '../../common/enums/installment-status.enum';
import { PreferredLanguage } from '../../common/enums/preferred-language.enum';
import { ProviderType } from '../../common/enums/provider-type.enum';
import { TransactionType } from '../../common/enums/transaction-type.enum';

export const demoVerifiedUserSeed = {
  email: 'demo@dcredit.local',
  password: 'ChangeMe123!',
  fullName: 'Alex Rivera',
  emailVerified: true,
  preferredLanguage: PreferredLanguage.EN,
};

export const demoUnverifiedUserSeed = {
  email: 'pending@dcredit.local',
  password: 'VerifyMe123!',
  fullName: 'Jamie Torres',
  emailVerified: false,
  preferredLanguage: PreferredLanguage.ES,
};

export const demoUnverifiedVerificationTokenSeed = {
  token: 'demo-unverified-verification-token',
  expiresAt: new Date('2026-12-31T23:59:59.000Z'),
};

export const demoFinancialSourceSeed = {
  providerName: 'Demo Bank',
  providerType: ProviderType.MANUAL,
  status: FinancialSourceStatus.ACTIVE,
  credentialReference: 'vault://demo-bank/alex-rivera',
};

export const demoAccountSeed = {
  accountName: 'Main Checking',
  accountType: AccountType.CHECKING,
  currency: 'USD',
  currentBalance: 2450.75,
  availableBalance: 2380.75,
};

export const demoCategoriesSeed = [
  { key: 'salary', name: 'Salary', type: CategoryType.INCOME },
  { key: 'housing', name: 'Housing', type: CategoryType.EXPENSE },
  { key: 'groceries', name: 'Groceries', type: CategoryType.EXPENSE },
  { key: 'transport', name: 'Transport', type: CategoryType.EXPENSE },
  { key: 'credit-payment', name: 'Credit Payment', type: CategoryType.CREDIT_PAYMENT },
];

export const demoCreditSeed = {
  name: 'Visa Platinum',
  creditType: CreditType.CREDIT_CARD,
  originalAmount: 7200,
  outstandingBalance: 3850.5,
  interestRate: 24.9,
  monthlyPayment: 230,
  nextPaymentDate: '2026-05-10',
  deferredPaymentDate: null,
  totalInstallments: null,
  remainingInstallments: null,
};

export const demoInstallmentsSeed = [
  {
    installmentNumber: 1,
    dueDate: '2026-05-10',
    amount: 230,
    principalPortion: 150,
    interestPortion: 80,
    status: InstallmentStatus.PENDING,
  },
  {
    installmentNumber: 2,
    dueDate: '2026-06-10',
    amount: 230,
    principalPortion: 155,
    interestPortion: 75,
    status: InstallmentStatus.PENDING,
  },
  {
    installmentNumber: 3,
    dueDate: '2026-07-10',
    amount: 230,
    principalPortion: 160,
    interestPortion: 70,
    status: InstallmentStatus.PENDING,
  },
];

export const demoTransactionsSeed = [
  {
    date: new Date('2026-04-01T09:00:00.000Z'),
    description: 'Monthly Salary',
    amount: 5200,
    type: TransactionType.INCOME,
    merchant: 'Employer Inc.',
    categoryKey: 'salary',
  },
  {
    date: new Date('2026-04-02T14:35:00.000Z'),
    description: 'Rent Payment',
    amount: -1650,
    type: TransactionType.EXPENSE,
    merchant: 'Landlord LLC',
    categoryKey: 'housing',
  },
  {
    date: new Date('2026-04-04T18:20:00.000Z'),
    description: 'Weekly Groceries',
    amount: -132.42,
    type: TransactionType.EXPENSE,
    merchant: 'Fresh Market',
    categoryKey: 'groceries',
  },
  {
    date: new Date('2026-04-08T11:10:00.000Z'),
    description: 'Credit Card Payment',
    amount: -230,
    type: TransactionType.PAYMENT,
    merchant: 'Demo Bank',
    categoryKey: 'credit-payment',
  },
];
