import { useNavigate } from 'react-router-dom'
import { HubDashboardSelector } from '../../components/HubInvoiceTable'

export default function DashboardHomePage() {
  const navigate = useNavigate()

  return (
    <HubDashboardSelector
      onFinancings={() => navigate('/payments-hub/dashboard/financings')}
      onInvoices={() => navigate('/payments-hub/dashboard/invoices')}
      onBack={() => navigate('/payments-hub')}
    />
  )
}
