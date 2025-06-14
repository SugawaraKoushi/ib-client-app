import { Button, Flex, Form, Input, Select, Space } from "antd";
import { useRef, useState } from "react";
import {
    LockOutlined,
    SearchOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab3 = () => {
    const { TextArea } = Input;
    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);
    const bruteForceIteration = useRef(10);

    const algorithms = [
        { value: 1, label: "текст" },
        { value: 2, label: "16-ричный код" },
    ];

    const handleSelectAlgorithmChange = (value) => {
        setAlgorithm(value);
    };

    const handleEncrypt = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log(values);
            
            let url = "/lab3/encrypt/aes-128";

            const response = await axios.post(url, {
                text: values.text,
                key: values.key,
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
            let url = "/lab3/decrypt/aes-128";

            const response = await axios.post(url, {
                text: values.text,
                key: values.key,
            });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // const keyValidate = (_, value) => {
    //     if (!value) {
    //         return Promise.reject(new Error("Обязательное поле"));
    //     }

    //     const regex = /^[\d]+$/;

    //     if (!regex.test(value)) {
    //         return Promise.reject(new Error("Ключ должен состоять из цифр"));
    //     }

    //     return Promise.resolve();
    // };

    return (
        <Form form={form} name="lab2" style={{ width: "100%" }}>
            <Flex style={{ width: "100%" }}>
                <Space>
                    <Form.Item
                        name="keyType"
                        label="Тип ключа"
                        initialValue={1}
                    >
                        <Select
                            style={{ width: "200px" }}
                            options={algorithms}
                            onChange={handleSelectAlgorithmChange}
                        />
                    </Form.Item>
                    <Form.Item
                        name="key"
                        label="Ключ"
                        // rules={[{ validator: keyValidate }]}
                    >
                        <Input style={{ width: "200px" }} />
                    </Form.Item>
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
                    // rules={[{ validator: alphabetValidate }]}
                >
                    <TextArea
                        placeholder="Введите текст"
                        rows={10}
                        // minLength={10000}
                        // count={{ show: true, minLength: 10000 }}
                    />
                </Form.Item>
                <Form.Item name="result" style={{ width: "50%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab3;
