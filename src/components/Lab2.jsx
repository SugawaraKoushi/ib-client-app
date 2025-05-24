import {
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Table,
} from "antd";
import { useState } from "react";
import {
    LockOutlined,
    SearchOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab2 = () => {
    const { TextArea } = Input;

    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);
    const [frequencyData, setFrequencyData] = useState([]);

    const algorithms = [{ value: 1, label: "Без ключа" }];

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
                default:
                    break;
            }

            const response = await axios.post(url, { text: values.text });

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
                default:
                    break;
            }

            const response = await axios.post(url, { text: values.text });

            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const alphabetValidate = (_, value) => {
        if (!value) {
            return Promise.reject(new Error("Поле должно быть заполнено"));
        }

        const regex = /^[А-Яа-яЁё_.,]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Недопустимый символ алфавита"));
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
                    {/* {algorithm !== 5 && (
                        <Form.Item
                            name="shift"
                            label="Смещение"
                            rules={[
                                {
                                    required: true,
                                    message: "Обязательное поле",
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: "200px" }}
                                min={0}
                                changeOnWheel
                            />
                        </Form.Item>
                    )}
                    {algorithm === 5 && (
                        <Form.Item name="key" label="Ключевое слово">
                            <Input style={{ width: "200px" }} />
                        </Form.Item>
                    )} */}
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
                    <TextArea placeholder="Введите текст" rows={10} />
                </Form.Item>
                <Form.Item name="result" style={{ width: "50%" }}>
                    <TextArea placeholder="Результат" rows={10} readOnly />
                </Form.Item>
            </Flex>
        </Form>
    );
};

export default Lab2;
