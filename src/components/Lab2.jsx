import { Button, Flex, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab2 = () => {
    const { TextArea } = Input;
    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);

    const algorithms = [
        { value: 1, label: "Без ключа" },
        { value: 2, label: "С ключом" },
        { value: 3, label: "Комбинированный с ключом" },
        { value: 4, label: "Двойной" },
    ];

    const handleSelectAlgorithmChange = (value) => {
        setAlgorithm(value);
    };

    const handleEncrypt = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let url = "/lab2/encrypt";

            switch (values.algorithm) {
                case 1:
                    url = url.concat("/rail-fence");
                    break;
                case 2:
                    url = url.concat("/with-key");
                    break;
                case 3:
                    url = url.concat("/combine");
                    break;
                case 4:
                    url = url.concat("/double");
                    break;
                default:
                    break;
            }

            const response = await axios.post(url, {
                text: values.text,
                keys: [values.key1, values.key2],
            });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDecrypt = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let url = "/lab2/decrypt";
            switch (values.algorithm) {
                case 1:
                    url = url.concat("/rail-fence");
                    break;
                case 2:
                    url = url.concat("/with-key");
                    break;
                case 3:
                    url = url.concat("/combine");
                    break;
                case 4:
                    url = url.concat("/double");
                    break;
                default:
                    break;
            }

            const response = await axios.post(url, {
                text: values.text,
                keys: [values.key1, values.key2],
            });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const alphabetValidate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Обязательное поле"));
        }

        if (value.length < 10000) {
            return Promise.reject(
                new Error("Длина текста должна быть не менее 10000 символов")
            );
        }

        const regex = /^[А-Яа-яЁё_.,]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Недопустимый символ алфавита"));
        }

        return Promise.resolve();
    };

    const keyValidate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Обязательное поле"));
        }

        const regex = /^[\d]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Ключ должен состоять из цифр"));
        }

        return Promise.resolve();
    };

    return (
        <Form form={form} name="lab1" style={{ width: "100%" }}>
            <Flex style={{ width: "100%" }}>
                <Space>
                    <Form.Item
                        name="algorithm"
                        label="Алгоритм"
                        initialValue={1}
                    >
                        <Select
                            style={{ width: "200px" }}
                            options={algorithms}
                            onChange={handleSelectAlgorithmChange}
                        />
                    </Form.Item>
                    {algorithm !== 1 && (
                        <Form.Item
                            name="key1"
                            label="Ключ"
                            rules={[{ validator: keyValidate }]}
                        >
                            <Input style={{ width: "200px" }} />
                        </Form.Item>
                    )}
                    {algorithm === 4 && (
                        <Form.Item
                            name="key2"
                            label="Ключ"
                            rules={[{ validator: keyValidate }]}
                        >
                            <Input style={{ width: "200px" }} />
                        </Form.Item>
                    )}
                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<LockOutlined />}
                            onClick={handleEncrypt}
                            loading={loading}
                        >
                            Зашифровать
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<UnlockOutlined />}
                            loading={loading}
                            onClick={handleDecrypt}
                        >
                            Дешифровать
                        </Button>
                    </Form.Item>
                </Space>
            </Flex>
            <Flex gap="small" style={{ minWidth: "100%" }}>
                <Form.Item
                    name="text"
                    style={{ width: "50%" }}
                    rules={[{ validator: alphabetValidate }]}
                >
                    <TextArea
                        placeholder="Введите текст"
                        rows={10}
                        minLength={10000}
                        count={{ show: true, minLength: 10000 }}
                    />
                </Form.Item>
                <Form.Item name="result" style={{ width: "50%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab2;
