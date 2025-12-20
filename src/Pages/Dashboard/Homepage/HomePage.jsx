import { Commet } from "react-loading-indicators";
import useAuth from "../../../Hooks/useAuth";
import useRole from "../../../Hooks/useRole";
import AdminHomepage from "../RoleBasedHomepage/AdminHomepage";
import DonorHomepage from "../RoleBasedHomepage/DonorHomepage";




const HomePage = () => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole()

  if (loading || roleLoading) {
    return <div className='flex justify-center items-center'><Commet color="#32cd32" size="medium" text="" textColor="" /></div>;
  }
  if (!role) {
    return <DonorHomepage />;
  }
  if (role === 'admin') {
    return <AdminHomepage></AdminHomepage>;
  }

  if (role === 'volunteer') {
    return <AdminHomepage></AdminHomepage>
  }

  return <DonorHomepage></DonorHomepage>;


};

export default HomePage;
