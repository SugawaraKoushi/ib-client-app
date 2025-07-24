import { Flex, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { Link, Outlet } from "react-router";

const Root = () => {
    const items = [
        {
            key: "/lab1",
            label: <Link to="/lab1">Лаб №1</Link>,
        },
        {
            key: "/lab2",
            label: <Link to="/lab2">Лаб №2</Link>,
        },
        {
            key: "/lab3",
            label: <Link to="/lab3">Лаб №3</Link>,
        },
        {
            key: "/lab4",
            label: <Link to="/lab4">Лаб №4</Link>,
        },
        {
            key: "/lab5",
            label: <Link to="/lab5">Лаб №5</Link>,
        },
        {
            key: "/lab6",
            label: <Link to="/lab6">Лаб №6</Link>,
        },
        {
            key: "/lab7",
            label: <Link to="/lab7">Лаб №7</Link>,
        },
        {
            key: "/lab8",
            label: <Link to="/lab8">Лаб №8</Link>,
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header>
                <Flex
                    style={{ maxWidth: "1200px", margin: "auto" }}
                    align="center"
                    justify="space-between"
                >
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        items={items}
                        disabledOverflow
                    />
                </Flex>
            </Header>
            <Layout
                style={{
                    margin: "auto",
                    width: "100%",
                    maxWidth: "1200px",
                }}
            >
                <Content className="content-layout">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Root;
