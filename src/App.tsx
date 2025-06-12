import { RouterProvider } from 'react-router-dom';
import { router } from '@/shared/lib/router';
import { ToastContainer } from './shared/components/ui/toast';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;