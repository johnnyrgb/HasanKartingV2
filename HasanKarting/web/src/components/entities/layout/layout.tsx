import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout as LayoutAntd, Menu } from "antd";
import { NavLink } from "reactstrap";
import userObject from "../userObject";
import "../../../styles/fonts.css";
import "../../../styles/navlink.css";

const { Header, Content, Footer } = LayoutAntd;

interface PropsType {
  user: userObject | null;
}

const DefaultItems = [
  {
    label: (
      <NavLink
        tag={Link}
        to="/"
        className="custom-navlink"
        style={{
          fontFamily: "Lozung, sans-serif",
          fontSize: "28px",
        }}
      >
        Hasan Karting
      </NavLink>
    ),
    key: "2",
  },
];
const RacerItems = [
  {
    label: (
      <NavLink tag={Link} to="/myraces" className="custom-navlink">
        Мои Заезды
      </NavLink>
    ),
    key: "/myraces",
  },
];

const AdministratorItems = [
  {
    label: (
      <NavLink tag={Link} to="/races" className="custom-navlink">
        Заезды
      </NavLink>
    ),
    key: "/races",
  },
  {
    label: (
      <NavLink tag={Link} to="/racers" className="custom-navlink">
        Гонщики
      </NavLink>
    ),
    key: "/racers",
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

const LogoutItem = {
  label: (
    <NavLink
      tag={Link}
      to="/logout"
      className="custom-navlink right-align"
      style={{ fontSize: "16px" }}
    >
      Выйти
    </NavLink>
  ),
  key: "/logout",
};

const GuestItems = [
  {
    label: (
      <NavLink tag={Link} to="/register" className="custom-navlink">
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
        style={{ display: "flex", backgroundColor: "#ef0000", height: 100 }}
      >
        <div style={{ display: "flex", flex: 1, justifyContent: "flex-start" }}>
          <Menu
            style={{
              minWidth: "888px",
              backgroundColor: "transparent",
              color: "#ffcc00",
            }}
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={[
              ...DefaultItems,
              ...(user?.roles.includes("Racer")
                ? RacerItems.filter((item) => item.key !== "/logout")
                : user?.roles.includes("Administrator")
                ? AdministratorItems.filter((item) => item.key !== "/logout")
                : GuestItems),
            ]}
          ></Menu>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {user?.roles.includes("Racer") && (
            <Menu
              style={{ backgroundColor: "transparent", color: "#ffcc00" }}
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={[LogoutItem]}
            ></Menu>
          )}
          {user?.roles.includes("Administrator") && (
            <Menu
              style={{ backgroundColor: "transparent", color: "#ffcc00" }}
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={[LogoutItem]}
            ></Menu>
          )}
        </div>
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
