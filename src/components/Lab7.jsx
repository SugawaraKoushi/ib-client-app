import {
    Button,
    Flex,
    Form,
    Input,
    Select,
    Space,
} from "antd";
import { useState } from "react";
import {
    SearchOutlined,
    SwapLeftOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab7 = () => {
    const { TextArea } = Input;

    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);

    const algorithms = [
        { value: 1, label: "SHA-256" },
        { value: 2, label: "RSA" },
    ];

    const handleSelectAlgorithmChange = (value) => {
        setAlgorithm(value);
    };

    const handleEncrypt = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let url = "/lab7";

            switch (values.algorithm) {
                case 1:
                    url = url.concat("/sha-256/get");
                    break;
                case 2:
                    // url = url.concat("/multiplicative");
                    break;
                default:
                    break;
            }

            const response = await axios.get(url, {
                params: { text: values.text },
            });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwapResultText = async () => {
        const values = await form.validateFields();
        form.setFieldValue("text", values.result);
    };

    return (
        <Form form={form} name="lab7" style={{ width: "100%" }}>
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
                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<SearchOutlined />}
                            onClick={handleEncrypt}
                            loading={loading}
                        >
                            Получить
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
                <Form.Item
                    name="text"
                    style={{ width: "50%" }}
                >
                    <TextArea placeholder="Введите текст" rows={10} />
                </Form.Item>
                <Button
                    color="primary"
                    variant="solid"
                    loading={loading}
                    icon={<SwapLeftOutlined />}
                    onClick={handleSwapResultText}
                />
                <Form.Item name="result" style={{ width: "50%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab7;
