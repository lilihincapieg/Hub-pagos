import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import HomePage from '../pages/HomePage'
import DesignSystemPreview from '../pages/DesignSystemPreview'
import ImportacionComoCentroPage from '../pages/ImportacionComoCentroPage'
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
      { path: 'importacion-como-centro', element: <ImportacionComoCentroPage /> },
      {
        path: 'importacion-como-centro/nueva-factura',
        element: <Navigate to="/importacion-como-centro" replace />,
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/payments-hub',
    element: <PaymentsHubLayout />,
    children: paymentsHubRoutes,
  },
]
