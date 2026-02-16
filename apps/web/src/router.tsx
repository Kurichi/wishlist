import { createBrowserRouter } from 'react-router';
import { ItemsPage } from '@/pages/items-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ItemsPage />,
  },
]);
