import { useNavigate } from 'react-router-dom'
import HubReceiptPanel from '../../components/HubReceiptPanel'
import { clearFlowSession, getFlowSession } from '../../utils/flowSession'

export default function FinancingsConfirmationPage() {
  const navigate = useNavigate()
  const session = getFlowSession()
  const confirmation = session.confirmation

  if (!confirmation) {
    navigate('/payments-hub/financings', { replace: true })
    return null
  }

  return (
    <HubReceiptPanel
      confirmation={confirmation}
      onBackHub={() => {
        clearFlowSession()
        navigate('/payments-hub')
      }}
      onDashboard={() => navigate('/payments-hub/dashboard/financings')}
      onDownload={() => undefined}
    />
  )
}
