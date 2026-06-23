import type { RouteObject } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../pages/HomePage'
import DesignSystemPreview from '../pages/DesignSystemPreview'
import NotFoundPage from '../pages/NotFoundPage'
import PaymentsHubLayout from '../features/payments-hub/layouts/PaymentsHubLayout'
import { paymentsHubRoutes } from '../features/payments-hub/routes'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'design-system', element: <DesignSystemPreview /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/payments-hub',
    element: <PaymentsHubLayout />,
    children: paymentsHubRoutes,
  },
]
