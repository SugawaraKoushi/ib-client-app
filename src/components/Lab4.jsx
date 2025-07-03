import { Button, Flex, Form, Input, InputNumber, Select, Space } from "antd";
import { useState } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab4 = () => {
    const { TextArea } = Input;

    const [form] = useForm();
    const [test, setTest] = useState(1);
    const [loading, setLoading] = useState(false);

    const tests = [
        { value: 1, label: "Тест Ферма" },
        {
            value: 2,
            label: "Тест Рабина-Миллера",
        },
        {
            value: 3,
            label: "Тест делимостью",
        },
        {
            value: 4,
            label: "Сгенерировать простое число",
        },
    ];

    const handleSelectTestChange = (value) => {
        setTest(value);
    };

    const handleTest = async () => {
        try {
            setLoading(true);

            const values = await form.validateFields();
            let url = "/lab4/prime-numbers";
            let params;

            switch (values.test) {
                case 1:
                    url = url.concat(`/fermat-test`);
                    params = {
                        n: values.n,
                    };
                    break;
                case 2:
                    url = url.concat(`/miller-rabin-test`);
                    params = {
                        n: values.n,
                        k: values.k,
                    };
                    break;
                case 3:
                    url = url.concat(`/division-test`);
                    params = {
                        n: values.n,
                    };
                    break;
                case 4:
                    url = url.concat(`/generate-prime-number`);
                    params = {
                        bits: values.bits,
                        rounds: values.k,
                    };
                    break;

                default:
                    break;
            }

            const response = await axios.get(url, { params });
            const data = response.data;
            let text;

            if (test < 4) {
                if (data.numberType < 0) {
                    text = `Число составное, затраченное время: ${data.seconds} сек.`;
                } else if (data.numberType === 0) {
                    text = `Число является числом Карлмайкла, затраченное время: ${data.seconds} сек.`;
                } else if (data.numberType > 0 || test < 3) {
                    text = `Число вероятно простое, затраченное время: ${data.seconds} сек.`;
                } else {
                    text = `Число простое, затраченное время: ${data.seconds} сек.`;
                }

                form.setFieldValue("result", text);
            } else {
                form.setFieldValue("result", response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const fermatTestValidate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Поле должно быть заполнено"));
        }

        if (value < 5) {
            return Promise.reject(
                new Error("Число должно быть больше или равно 5")
            );
        }

        if (value % 2 === 0) {
            return Promise.reject(new Error("Число должно быть нечетным"));
        }

        return Promise.resolve();
    };

    const millerRabinTestValidate = (_, value) => {
        if (value < 2) {
            return Promise.reject(
                new Error("Число должно быть больше или равно 2")
            );
        }

        if (value % 2 === 0) {
            return Promise.reject(new Error("Число должно быть нечетным"));
        }

        return Promise.resolve();
    };

    const divisionTestValidate = (_, value) => {
        if (value < 2) {
            return Promise.reject(
                new Error("Число должно быть больше или равно 2")
            );
        }

        return Promise.resolve();
    };

    return (
        <Form form={form} name="lab4" style={{ width: "100%" }}>
            <Flex style={{ width: "100%" }}>
                <Space>
                    <Form.Item name="test" label="Тест" initialValue={1}>
                        <Select
                            style={{ width: "200px" }}
                            options={tests}
                            onChange={handleSelectTestChange}
                        />
                    </Form.Item>
                    {test !== 4 && (
                        <Form.Item
                            style={{ width: "400px" }}
                            name="n"
                            label="Число"
                            initialValue={2}
                            rules={[
                                {
                                    validator: (_, value) => {
                                        switch (test) {
                                            case 1:
                                                return fermatTestValidate(
                                                    _,
                                                    value
                                                );
                                            case 2:
                                                return millerRabinTestValidate(
                                                    _,
                                                    value
                                                );
                                            case 3:
                                                return divisionTestValidate(
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
                            <InputNumber
                                changeOnWheel
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    )}
                    {test === 4 && (
                        <Form.Item
                            style={{ width: "400px" }}
                            name="bits"
                            label="Количество бит"
                            initialValue={64}
                        >
                            <InputNumber
                                changeOnWheel
                                style={{ width: "100%" }}
                                min={1}
                            />
                        </Form.Item>
                    )}
                    {(test === 2 || test === 4) && (
                        <Form.Item
                            style={{ width: "250px" }}
                            name="k"
                            label="Количество раундов"
                            initialValue={1}
                        >
                            <InputNumber
                                changeOnWheel
                                min={1}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    )}

                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<QuestionCircleOutlined />}
                            onClick={handleTest}
                            loading={loading}
                        >
                            Проверить
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

export default Lab4;
