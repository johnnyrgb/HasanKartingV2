import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout as LayoutAntd, Menu } from "antd";
import { NavLink } from "reactstrap";
import userObject from "../userObject";
import "../../../styles/fonts.css";
import "../../../styles/navlink.css";

const { Header, Content, Footer } = LayoutAntd; // Определяем разделы LayoutAntd

interface PropsType { // Определяем интерфейс PropsType для пропсов компонента Layout
  user: userObject | null;
}

const DefaultItems = [ // Элемент меню по умолчанию
  {
    label: (
      <NavLink
        tag={Link}
        to="/main"
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
const RacerItems = [ // Элементы меню для гонщика
  {
    label: (
      <NavLink tag={Link} to="/myraces" className="custom-navlink">
        Мои Заезды
      </NavLink>
    ),
    key: "/myraces",
  },
];

const AdministratorItems = [ // Элементы меню для администратора
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

const LogoutItem = { // Элемент меню для выхода
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

const GuestItems = [ // Элементы меню для гостя

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

const Layout = ({ user }: PropsType) => { // Определяем компонент Layout
  const location = useLocation();  // Получаем текущий путь из useLocation
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
            items={[ // Добавляем элементы меню в зависимости от роли пользователя
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
          {user?.roles.includes("Racer") && ( // Отображаем меню выхода для гонщика
            <Menu
              style={{ backgroundColor: "transparent", color: "#ffcc00" }}
              theme="dark"
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={[LogoutItem]}
            ></Menu>
          )}
          {user?.roles.includes("Administrator") && ( // Отображаем меню выхода для администратора
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
