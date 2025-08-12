import { useNavigation, Outlet } from 'react-router';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';

const HomeLayout: React.FC = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  return (
    <>
      <Navbar />
      {isPageLoading ? (
        <Loading />
      ) : (
        <section className="align-element py-20">
          <Outlet />
        </section>
      )}
    </>
  );
};
export default HomeLayout;
