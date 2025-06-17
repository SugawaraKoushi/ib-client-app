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
    SwapLeftOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab1 = () => {
    const { TextArea } = Input;

    const [form] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);
    const [frequencyData, setFrequencyData] = useState([]);

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
                key: values.key,
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
            return Promise.reject(new Error("Поле должно быть заполнено"));
        }

        const regex = /^[А-Яа-яЁё_.,]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Недопустимый символ алфавита"));
        }

        return Promise.resolve();
    };

    const handleCalculateFrequencyAnalysis = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            let url = "/lab1/freq-analysis/calculate";
            const response = await axios.get(url, {
                params: {
                    text: values.result,
                },
            });

            const symbols = response.data;
            const data = Object.entries(symbols).map(
                ([symbol, frequency], index) => ({
                    key: index + 1,
                    symbol,
                    frequency,
                })
            );

            setFrequencyData(data);
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

    const columns = [
        {
            title: "Символ",
            dataIndex: "symbol",
            key: "symbol",
            width: "50%",
        },
        {
            title: "Частота повторений",
            dataIndex: "frequency",
            key: "frequency",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.frequency - b.frequency,
            width: "50%",
        },
    ];

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
                    {algorithm !== 3 && (
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
                    {algorithm === 3 && (
                        <Form.Item name="key" label="Ключевое слово">
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
            <Flex
                gap="small"
                style={{ minWidth: "100%" }}
                align="center"
                justify="space-between"
            >
                <Form.Item
                    name="text"
                    style={{ width: "50%" }}
                    rules={[{ validator: alphabetValidate }]}
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
            <Flex>
                <Form.Item>
                    <Button
                        color="primary"
                        variant="solid"
                        icon={<SearchOutlined />}
                        loading={loading}
                        onClick={handleCalculateFrequencyAnalysis}
                    >
                        Частотный анализ
                    </Button>
                </Form.Item>
            </Flex>
            <Table
                dataSource={frequencyData}
                columns={columns}
                size="small"
                pagination={{ pageSize: 99, hideOnSinglePage: true }}
            />
        </Form>
    );
};

export default Lab1;
