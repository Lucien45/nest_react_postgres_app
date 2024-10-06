import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppLayout from '../views/AppLayout';
import Users from '../views/Users';
import { AddEditUsers, ListUsers } from '../components/UserComp';
import Page404 from '../views/Page404';
import '../assets/css/customize.css'

interface AdminRouteProps {
  setLoading: (value: boolean) => void; // Define prop type
}

const AppRoute = ({ setLoading }: AdminRouteProps) => {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const handleComplete = () => setLoading(false);
    const timeout = setTimeout(handleComplete, 500);

    return () => clearTimeout(timeout);
  }, [location, setLoading]);

  return (
    <Routes>
      <Route element={<AppLayout/>}>
        <Route path='/' element={<Users/>}>
          <Route path='/manage' element={<ListUsers />} />
          <Route path='/add' element={<AddEditUsers />} />
        </Route>
        <Route path='*' element={<Page404/>} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
