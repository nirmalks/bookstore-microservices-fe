import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { AppState } from '../types/store';

const links = [
  { id: 1, url: '/', text: 'Home' },
  { id: 2, url: 'about', text: 'About' },
  { id: 3, url: 'books', text: 'Books' },
  { id: 4, url: 'checkout', text: 'Checkout' },
  { id: 5, url: 'orders?page=0', text: 'Orders' },
];

const NavLinks = () => {
  const user = useSelector((state: AppState) => state.userState.user);
  return (
    <>
      {links.map((link) => {
        const { id, url, text } = link;
        if ((url === 'checkout' || url === 'orders') && !user) {
          return;
        }
        return (
          <li key={id}>
            <NavLink className="capitalize" to={url}>
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
