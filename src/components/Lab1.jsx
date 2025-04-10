import { Button, Flex, Form, Input, InputNumber, Select, Space } from "antd";
import { useState } from "react";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab1 = () => {
    const { TextArea } = Input;

    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);

    const algorithms = [
        { value: 1, label: "Аддитивный" },
        { value: 2, label: "Мультипликативный" },
        { value: 3, label: "Шифр Плейфера" },
    ];

    const handleSelectAlgorithmChange = (value) => {
        setAlgorithm(value);
    };

    const handleEncrypt = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let url = "/lab1/encrypt";

            switch (values.algorithm) {
                case 1:
                    url = url.concat("/additive");
                    break;
                case 2:
                    url = url.concat("/multiplicative");
                    break;
                case 3:
                    url = url.concat("/playfair");
                    break;
                default:
                    break;
            }

            const response = await axios.post(url, {
                text: values.text,
                shift: values.shift,
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
            let url = "/lab1/decrypt";
            switch (values.algorithm) {
                case 1:
                    url = url.concat("/additive");
                    break;
                case 2:
                    url = url.concat("/multiplicative");
                    break;
                case 3:
                    url = url.concat("/playfair");
                    break;
                default:
                    break;
            }

            const response = await axios.post(url, {
                text: values.text,
                shift: values.shift,
            });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                    <Form.Item
                        name="shift"
                        label="Смещение"
                        rules={[
                            {
                                required: algorithm !== 3,
                                message: "Обязательное поле",
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: "200px" }}
                            disabled={algorithm > 2}
                            min={0}
                            changeOnWheel
                        />
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
                <Form.Item name="text" style={{ width: "50%" }}>
                    <TextArea placeholder="Введите текст" rows={10} />
                </Form.Item>
                <Form.Item name="result" style={{ width: "50%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab1;
