import { Form, Input } from "antd";
import "./index.css";

const Lab1 = () => {
    return (
        <Form className=".content-layout ">
            <Form.Item
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Введите Ваш логин!",
                        },
                    ]}
                >
                    <Input placeholder="Логин" />
                </Form.Item>
        </Form>
    );
};

export default Lab1;
