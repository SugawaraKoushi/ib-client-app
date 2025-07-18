import {
    Button,
    Flex,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
    Splitter,
} from "antd";
import { use, useState } from "react";
import { SearchOutlined, SwapLeftOutlined } from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab7 = () => {
    const { TextArea } = Input;

    const [shaForm] = useForm();
    const [rsaKeyForm] = useForm();
    const [rsaSignForm] = useForm();
    const [rsaCheckSignForm] = useForm();
    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rsaKeys, setRSAKeys] = useState(null);

    const algorithms = [
        { value: 1, label: "SHA-256" },
        { value: 2, label: "RSA" },
        { value: 3, label: "Эль-Гаммаль" },
    ];

    const handleSelectAlgorithmChange = (value) => {
        setAlgorithm(value);
    };

    const handleGetSHA256HashCode = async () => {
        try {
            setLoading(true);
            const values = await shaForm.validateFields();
            let url = "/lab7/sha-256/get";

            const response = await axios.get(url, {
                params: { text: values.text },
            });

            shaForm.setFieldValue("result", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetRSAKeys = async () => {
        try {
            setLoading(true);
            const values = await rsaKeyForm.validateFields();
            let url = "/lab7/rsa/get-keys";
            const params = {
                p: values.p,
                q: values.q,
            };

            const response = await axios.get(url, { params });

            setRSAKeys(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwapResultText = async () => {
        const values = await shaForm.validateFields();
        shaForm.setFieldValue("text", values.result);
    };

    const handleGenerateP = async () => {
        const bits = await rsaKeyForm.getFieldValue("pBits");
        const url = "/lab4/prime-numbers/generate-hex-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        rsaKeyForm.setFieldValue("p", response.data);
    };

    const handleGenerateQ = async () => {
        try {
            setLoading(true);
            const bits = await rsaKeyForm.getFieldValue("qBits");
            const url = "/lab4/prime-numbers/generate-hex-prime-number";
            const params = {
                bits: bits,
                rounds: 20,
            };
            const response = await axios.get(url, { params });
            rsaKeyForm.setFieldValue("q", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const hexadecimalValidate = (_, value) => {
        const regex = /^[\dA-Fa-f]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 16-ричное число"));
        }

        return Promise.resolve();
    };

    const signMessage = async () => {
        try {
            setLoading(true);
            const values = await rsaSignForm.validateFields();
            const url = "/lab7/rsa/sign";
            const body = {
                message: values.message,
                publicKey: rsaKeys.publicKey,
            };

            const response = await axios.post(url, body);
            const data = response.data;
            rsaSignForm.setFieldValue("hashCode", data.hashCode);
            rsaSignForm.setFieldValue("sign", data.sign);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const checkSign = async () => {
        try {
            setLoading(true);
            const values = await rsaCheckSignForm.validateFields();
            const url = "/lab7/rsa/check-sign";
            const body = {
                sign: values.sign,
                privateKey: rsaKeys.privateKey,
            };

            const response = await axios.post(url, body);
            rsaCheckSignForm.setFieldValue("hashCode", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex gap="small" vertical style={{ width: "100%" }}>
            <Select
                style={{ width: "200px" }}
                options={algorithms}
                onChange={handleSelectAlgorithmChange}
                defaultValue={1}
            />
            {algorithm === 1 && (
                <Form form={shaForm} name="sha256" style={{ width: "100%" }}>
                    <Flex style={{ width: "100%" }}>
                        <Space>
                            <Form.Item>
                                <Button
                                    color="primary"
                                    variant="solid"
                                    icon={<SearchOutlined />}
                                    onClick={handleGetSHA256HashCode}
                                    loading={loading}
                                >
                                    Получить ХЭШ
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
                        <Form.Item name="text" style={{ width: "50%" }}>
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
                            <TextArea
                                placeholder="Результат"
                                rows={10}
                                readOnly
                            />
                        </Form.Item>
                    </Flex>
                </Form>
            )}
            {algorithm === 2 && (
                <Flex vertical>
                    <Form
                        form={rsaKeyForm}
                        name="rsaKeyForm"
                        style={{ width: "100%" }}
                    >
                        <Flex style={{ width: "100%" }}>
                            <Space>
                                <Flex vertical justify="center">
                                    <Flex justify="space-between">
                                        <Space>
                                            <Form.Item
                                                style={{ width: "400px" }}
                                                name="p"
                                                label="p"
                                                rules={[
                                                    {
                                                        validator: (_, value) =>
                                                            hexadecimalValidate(
                                                                _,
                                                                value
                                                            ),
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                style={{ width: "180px" }}
                                                name="pBits"
                                                label="Количество бит"
                                                initialValue={128}
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
                                                    onClick={handleGenerateP}
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
                                                name="q"
                                                label="q"
                                                rules={[
                                                    {
                                                        validator: (_, value) =>
                                                            hexadecimalValidate(
                                                                _,
                                                                value
                                                            ),
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                style={{ width: "180px" }}
                                                name="qBits"
                                                label="Количество бит"
                                                initialValue={128}
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
                                                    onClick={handleGenerateQ}
                                                >
                                                    Сгенертировать число
                                                </Button>
                                            </Form.Item>
                                        </Space>
                                    </Flex>
                                </Flex>
                            </Space>
                        </Flex>
                        <Form.Item>
                            <Button
                                variant="solid"
                                color="primary"
                                loading={loading}
                                onClick={handleGetRSAKeys}
                            >
                                Получить ключи
                            </Button>
                        </Form.Item>
                    </Form>

                    <Splitter>
                        <Splitter.Panel style={{ marginRight: "20px" }}>
                            <Form
                                form={rsaSignForm}
                                name="rsaSignForm"
                                style={{ width: "100%" }}
                            >
                                <Flex
                                    vertical
                                    gap="small"
                                    style={{ width: "100%" }}
                                >
                                    <Form.Item>
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            loading={loading}
                                            onClick={signMessage}
                                        >
                                            Подписать сообщение
                                        </Button>
                                    </Form.Item>
                                    <Form.Item
                                        name="message"
                                        style={{ width: "100%" }}
                                        required
                                    >
                                        <TextArea
                                            placeholder="Введите текст"
                                            rows={10}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="hashCode"
                                        label="Хэш"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="sign"
                                        label="Подпись"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                </Flex>
                            </Form>
                        </Splitter.Panel>
                        <Splitter.Panel style={{ marginLeft: "20px" }}>
                            <Form
                                form={rsaCheckSignForm}
                                name="rsaCheckSignForm"
                            >
                                <Flex
                                    vertical
                                    gap="small"
                                    style={{ width: "100%" }}
                                >
                                    <Form.Item>
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            loading={loading}
                                            onClick={checkSign}
                                        >
                                            Получить хэш из подписанного
                                            сообщения
                                        </Button>
                                    </Form.Item>
                                    {/* <Form.Item
                                        name="text"
                                        style={{ width: "100%" }}
                                    >
                                        <TextArea
                                            placeholder="Введите текст"
                                            rows={10}
                                        />
                                    </Form.Item> */}
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="sign"
                                        label="Подпись"
                                        required
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="hashCode"
                                        label="Хэш"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                </Flex>
                            </Form>
                        </Splitter.Panel>
                    </Splitter>
                </Flex>
            )}
        </Flex>
    );
};

export default Lab7;
