import { Button, Flex, Form, Input, InputNumber, Select, Space } from "antd";
import { useState } from "react";
import { KeyOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab5 = () => {
    const { TextArea } = Input;
    const [rootsForm] = useForm();
    const [keysForm] = useForm();
    const [system, setSystem] = useState(10);
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
            const values = await rootsForm.validateFields();
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
            rootsForm.setFieldValue("result", result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetKeys = async () => {
        try {
            setLoading(true);
            const values = await keysForm.validateFields();
            const url = "/lab5/key-exchange/diffie-hellman";
            const params = {
                x1: values.x1,
                x2: values.x2,
                g: values.g,
                n: values.n,
            };
            const response = await axios.get(url, { params });
            const data = response.data;
            const result = `Ключ Алисы: ${data.keyAlice};\nКлюч Боба: ${data.keyBob};`;
            keysForm.setFieldValue("result", result);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateX1 = async () => {
        const values = await keysForm.validateFields();
        const url = "/lab4/prime-numbers/generate-prime-number";
        const params = {
            bits: values.bits1,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        keysForm.setFieldValue("x1", response.data);
    };

    const handleGenerateX2 = async () => {
        const values = await keysForm.validateFields();
        const url = "/lab4/prime-numbers/generate-prime-number";
        const params = {
            bits: values.bits2,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        keysForm.setFieldValue("x2", response.data);
    };

    const handleGenerateN = async () => {
        const values = await keysForm.validateFields();
        const url = "/lab4/prime-numbers/generate-prime-number";
        const params = {
            bits: values.bits3,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        keysForm.setFieldValue("n", response.data);
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
        <Flex
            vertical
            style={{
                width: "100%",
            }}
        >
            <Form
                form={rootsForm}
                name="lab5PrimitiveRoots"
                style={{ width: "100%" }}
            >
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
                                                return decimalValidate(
                                                    _,
                                                    value
                                                );
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
            <Form>
                <Form
                    form={keysForm}
                    name="lab5DiffieHellman"
                    style={{ width: "100%" }}
                >
                    <Flex style={{ width: "100%" }}>
                        <Space>
                            <Flex vertical>
                                <Flex justify="space-between">
                                    <Space>
                                        <Form.Item
                                            style={{ width: "400px" }}
                                            name="x1"
                                            label="x1"
                                            // rules={[
                                            //     {
                                            //         validator: (_, value) =>
                                            //             decimalValidate(
                                            //                 _,
                                            //                 value
                                            //             ),
                                            //     },
                                            // ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: "180px" }}
                                            name="bits1"
                                            label="Количество бит"
                                            initialValue={64}
                                        >
                                            <InputNumber
                                                changeOnWheel
                                                style={{ width: "100%" }}
                                                min={1}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                loading={loading}
                                                onClick={handleGenerateX1}
                                            >
                                                Сгенертировать число
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Flex>

                                <Flex justify="space-between">
                                    <Space>
                                        <Form.Item
                                            style={{ width: "400px" }}
                                            name="x2"
                                            label="x2"
                                            // rules={[
                                            //     {
                                            //         validator: (_, value) =>
                                            //             decimalValidate(
                                            //                 _,
                                            //                 value
                                            //             ),
                                            //     },
                                            // ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: "180px" }}
                                            name="bits2"
                                            label="Количество бит"
                                            initialValue={64}
                                        >
                                            <InputNumber
                                                changeOnWheel
                                                style={{ width: "100%" }}
                                                min={1}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                loading={loading}
                                                onClick={handleGenerateX2}
                                            >
                                                Сгенертировать число
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Flex>
                                <Flex justify="space-between">
                                    <Space>
                                        <Form.Item
                                            style={{ width: "400px" }}
                                            name="n"
                                            label="n"
                                            // rules={[
                                            //     {
                                            //         validator: (_, value) =>
                                            //             decimalValidate(
                                            //                 _,
                                            //                 value
                                            //             ),
                                            //     },
                                            // ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            style={{ width: "180px" }}
                                            name="bits3"
                                            label="Количество бит"
                                            initialValue={64}
                                        >
                                            <InputNumber
                                                changeOnWheel
                                                style={{ width: "100%" }}
                                                min={1}
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                variant="solid"
                                                color="primary"
                                                loading={loading}
                                                onClick={handleGenerateN}
                                            >
                                                Сгенертировать число
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </Flex>
                                <Form.Item
                                    style={{ width: "400px" }}
                                    name="g"
                                    label="g"
                                    // rules={[
                                    //     {
                                    //         validator: (_, value) =>
                                    //             decimalValidate(_, value),
                                    //     },
                                    // ]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        icon={<KeyOutlined />}
                                        onClick={handleGetKeys}
                                        loading={loading}
                                    >
                                        Получить ключи
                                    </Button>
                                </Form.Item>
                            </Flex>
                        </Space>
                    </Flex>
                    <Flex
                        gap="small"
                        style={{ minWidth: "100%" }}
                        align="center"
                        justify="space-between"
                    >
                        <Form.Item name="result" style={{ width: "100%" }}>
                            <TextArea
                                placeholder="Результат"
                                rows={10}
                                readOnly
                            />
                        </Form.Item>
                    </Flex>
                </Form>
            </Form>
        </Flex>
    );
};

export default Lab5;
