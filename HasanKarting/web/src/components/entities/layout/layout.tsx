import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Layout as LayoutAntd, Breadcrumb, Menu, theme } from 'antd';
import userObject from "../userObject";


const { Header, Content, Footer } = LayoutAntd;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

interface PropsType {
    setUser: userObject | null;
}

const Layout = ({ setUser }: PropsType) => {
    const {
        token: {colorBgContainer, borderRadiusLG },
    } = theme.useToken();
}
// TODO: ДОДЕЛАТЬ LAYOUT
export default Layout