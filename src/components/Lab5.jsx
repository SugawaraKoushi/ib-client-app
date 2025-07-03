import { Button, Flex, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab5 = () => {
    const { TextArea } = Input;
    const [form] = useForm();
    const [system, setSystem] = useState(2);
    const [loading, setLoading] = useState(false);
    const systems = [
        { value: 2, label: 2 },
        {
            value: 10,
            label: 10,
        },
        {
            value: 16,
            label: 16,
        },
    ];

    const handleNumeralSystemChange = (value) => {
        setSystem(value);
    };

    const handleGetRoots = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const url = "/lab5/primitive-roots/get-roots";
            const params = {
                type: values.system,
                value: values.value,
            };
            const response = await axios.get(url, { params });
            const data = response.data;
            const result = `Корни: ${data.roots.join(
                ", "
            )}\nЗатрачено времени: ${data.seconds} с.`;
            form.setFieldValue("result", result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const binaryValidate = (_, value) => {
        const regex = /^[0-1]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 2-ричное число"));
        }

        return Promise.resolve();
    };

    const decimalValidate = (_, value) => {
        const regex = /^[\d]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 10-ричное число"));
        }

        return Promise.resolve();
    };

    const hexadecimalValidate = (_, value) => {
        const regex = /^[\dA-Fa-f]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 16-ричное число"));
        }

        return Promise.resolve();
    };

    return (
        <Form form={form} name="lab4" style={{ width: "100%" }}>
            <Flex style={{ width: "100%" }}>
                <Space>
                    <Form.Item
                        name="system"
                        label="Система счисления"
                        initialValue={10}
                    >
                        <Select
                            style={{ width: "70px" }}
                            options={systems}
                            onChange={handleNumeralSystemChange}
                        />
                    </Form.Item>
                    <Form.Item
                        style={{ width: "400px" }}
                        name="value"
                        label="Число"
                        rules={[
                            {
                                validator: (_, value) => {
                                    switch (system) {
                                        case 2:
                                            return binaryValidate(_, value);
                                        case 10:
                                            return decimalValidate(_, value);
                                        case 16:
                                            return hexadecimalValidate(
                                                _,
                                                value
                                            );
                                        default:
                                            return;
                                    }
                                },
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<QuestionCircleOutlined />}
                            onClick={handleGetRoots}
                            loading={loading}
                        >
                            Найти корни
                        </Button>
                    </Form.Item>
                </Space>
            </Flex>
            <Flex
                gap="small"
                style={{ minWidth: "100%" }}
                align="center"
                justify="space-between"
            >
                <Form.Item name="result" style={{ width: "100%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab5;
