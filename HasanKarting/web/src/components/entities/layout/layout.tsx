import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout as LayoutAntd, Breadcrumb, Menu, theme } from "antd";
import { NavLink } from "reactstrap";
import userObject from "../userObject";
import hasanImage from "../../../resources/hasan.png";
import '../../../styles/fonts.css';
import '../../../styles/navlink.css';

const { Header, Content, Footer } = LayoutAntd;

interface PropsType {
  user: userObject | null;
}
const DefaultItems = [
    {
        label: (
          <NavLink tag={Link} to="/"
          className="custom-navlink"
          style={{
            fontFamily: "Lozung, sans-serif",
            fontSize: '28px',
          }}>
            Hasan Karting
          </NavLink>
        ),
        key: "2",
      },
];
const RacerItems = [
  {
    label: (
      <NavLink tag={Link} to="/" className="custom-navlink">
        Заезды
      </NavLink>
    ),
    key: "2",
  },
  {
    label: (
      <NavLink tag={Link} to="/" className="custom-navlink">
        Личный кабинет
      </NavLink>
    ),
    key: "3",
  },
];

const AdministratorItems = [
  {
    label: (
      <NavLink tag={Link} to="/" className="custom-navlink">
        Заезды
      </NavLink>
    ),
    key: "2",
  },
  {
    label: (
      <NavLink tag={Link} to="/" className="custom-navlink">
        Гонщики
      </NavLink>
    ),
    key: "3",
  },
  {
    label: (
      <NavLink tag={Link} to="/cars" className="custom-navlink"> 
        Болиды
      </NavLink>
    ),
    key: "/cars",
  },
];

const GuestItems = [
  {
    label: (
      <NavLink tag={Link} to="/register"
      className="custom-navlink" >
        Регистрация
      </NavLink>
    ),
    key: "/register",
  },
  {
    label: (
      <NavLink tag={Link} to="/login" className="custom-navlink">
        Вход
      </NavLink>
    ),
    key: "/login",
  },
];

const Layout = ({ user }: PropsType) => {
    const location = useLocation();
  return (
    <LayoutAntd>
      <Header 
      style={{ display: "flex",
        backgroundColor: "#ef0000",
        height: 100
       }}>
        <Menu
            style={{ minWidth: "1000px",
                backgroundColor: "transparent",
                color: "#ffcc00",
             }}
             theme="dark"

          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={
            [...DefaultItems, ...user?.roles.includes("Racer")
              ? RacerItems
              : user?.roles.includes("Administrator")
              ? AdministratorItems
              : GuestItems]
          }
        ></Menu>
      </Header>
      <Content className="site-layout" style={{ minHeight: "100%" }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Картинг-центр Hasan Karting
      </Footer>
    </LayoutAntd>
  );
};

export default Layout;