import type { RouteObject } from 'react-router-dom'
import PaymentsHubHomePage from './pages/PaymentsHubHomePage'
import FinancingsListPage from './pages/financings/FinancingsListPage'
import FinancingsFxQuotePage from './pages/financings/FinancingsFxQuotePage'
import FinancingsCheckoutPage from './pages/financings/FinancingsCheckoutPage'
import FinancingsConfirmationPage from './pages/financings/FinancingsConfirmationPage'
import InvoicesListPage from './pages/invoices/InvoicesListPage'
import InvoicesFxQuotePage from './pages/invoices/InvoicesFxQuotePage'
import InvoicesCheckoutPage from './pages/invoices/InvoicesCheckoutPage'
import InvoicesConfirmationPage from './pages/invoices/InvoicesConfirmationPage'
import DashboardHomePage from './pages/dashboard/DashboardHomePage'
import DashboardFinancingsPage from './pages/dashboard/DashboardFinancingsPage'
import DashboardInvoicesPage from './pages/dashboard/DashboardInvoicesPage'

export const paymentsHubRoutes: RouteObject[] = [
  { index: true, element: <PaymentsHubHomePage /> },
  { path: 'financings', element: <FinancingsListPage /> },
  { path: 'financings/fx-quote', element: <FinancingsFxQuotePage /> },
  { path: 'financings/checkout', element: <FinancingsCheckoutPage /> },
  { path: 'financings/confirmation', element: <FinancingsConfirmationPage /> },
  { path: 'invoices', element: <InvoicesListPage /> },
  { path: 'invoices/fx-quote', element: <InvoicesFxQuotePage /> },
  { path: 'invoices/checkout', element: <InvoicesCheckoutPage /> },
  { path: 'invoices/confirmation', element: <InvoicesConfirmationPage /> },
  { path: 'dashboard', element: <DashboardHomePage /> },
  { path: 'dashboard/financings', element: <DashboardFinancingsPage /> },
  { path: 'dashboard/invoices', element: <DashboardInvoicesPage /> },
]
