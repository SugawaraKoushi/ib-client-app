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
import { useState } from "react";
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
    const [elgamalForm] = useForm();
    const [elGamalSignForm] = useForm();
    const [elGamalCheckSignForm] = useForm();

    const [algorithm, setAlgorithm] = useState(1);
    const [loading, setLoading] = useState(false);
    const [rsaKeys, setRSAKeys] = useState(null);
    const [elGamalKeys, setElGamalKeys] = useState(null);

    const algorithms = [
        { value: 1, label: "SHA-256" },
        { value: 2, label: "RSA" },
        { value: 3, label: "Эль-Гамаль" },
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

    const handleGenerateElGamalP = async () => {
        const bits = await elgamalForm.getFieldValue("pBits");
        const url = "/lab4/prime-numbers/generate-hex-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        elgamalForm.setFieldValue("p", response.data);
    };

    const handleGetElGamalA = async () => {
        try {
            setLoading(true);
            const values = await elgamalForm.validateFields();
            const url = "/lab5/primitive-roots/get-random-root";
            const params = {
                value: values.p,
            };
            const response = await axios.get(url, { params });
            elgamalForm.setFieldValue("a", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetElGamalK = async () => {
        try {
            setLoading(true);
            const values = await elgamalForm.validateFields();
            const url = "/lab7/el-gamal/get-k";
            const params = {
                p: values.p,
            };
            const response = await axios.get(url, { params });
            elgamalForm.setFieldValue("k", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGetElGamalKeys = async () => {
        try {
            setLoading(true);
            const values = await elgamalForm.validateFields();
            const url = "/lab7/el-gamal/get-keys";
            const params = {
                p: values.p,
                a: values.a,
            };
            const response = await axios.get(url, { params });
            const data = response.data;
            setElGamalKeys(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const hexadecimalValidate = (_, value) => {
        const regex = /^[\dA-Fa-f]+$/;

        if (value == null) {
            return Promise.resolve();
        }

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 16-ричное число"));
        }

        return Promise.resolve();
    };

    const signMessageWithRSA = async () => {
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

    const checkRSASign = async () => {
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

    const signMessageWithElGamal = async () => {
        try {
            setLoading(true);
            const values = await elGamalSignForm.validateFields();
            const values1 = await elgamalForm.validateFields();
            const url = "/lab7/el-gamal/sign";
            const body = {
                g: values1.a,
                k: values1.k,
                p: values1.p,
                x: elGamalKeys.x,
                message: values.message,
            };

            const response = await axios.post(url, body);
            const data = response.data;
            elGamalSignForm.setFieldValue("hashCode", data.hashCode);
            elGamalSignForm.setFieldValue("a", data.a);
            elGamalSignForm.setFieldValue("b", data.b);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const checkElGamalSign = async () => {
        try {
            setLoading(true);
            const values = await elGamalSignForm.validateFields();
            const values1 = await elgamalForm.validateFields();
            const url = "/lab7/el-gamal/check-sign";
            const body = {
                g: values1.a,
                hashCode: values.hashCode,
                y: elGamalKeys.y,
                a: values.a,
                b: values.b,
                p: values1.p,
            };

            const response = await axios.post(url, body);
            const data = response.data;
            elGamalCheckSignForm.setFieldValue("left", data.left);
            elGamalCheckSignForm.setFieldValue("right", data.right);
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
                                            onClick={signMessageWithRSA}
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
                                            onClick={checkRSASign}
                                        >
                                            Получить хэш из подписанного
                                            сообщения
                                        </Button>
                                    </Form.Item>
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
            {algorithm === 3 && (
                <Flex vertical>
                    <Form
                        form={elgamalForm}
                        name="elgamalForm"
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
                                                    onClick={
                                                        handleGenerateElGamalP
                                                    }
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
                                                name="a"
                                                label="a"
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
                                            <Form.Item>
                                                <Button
                                                    variant="solid"
                                                    color="primary"
                                                    loading={loading}
                                                    onClick={handleGetElGamalA}
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
                                                name="k"
                                                label="k"
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
                                            <Form.Item>
                                                <Button
                                                    variant="solid"
                                                    color="primary"
                                                    loading={loading}
                                                    onClick={handleGetElGamalK}
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
                                onClick={handleGetElGamalKeys}
                            >
                                Получить ключи
                            </Button>
                        </Form.Item>
                    </Form>
                    <Splitter>
                        <Splitter.Panel style={{ marginRight: "20px" }}>
                            <Form
                                form={elGamalSignForm}
                                name="elGamalSignForm"
                                style={{ width: "100%" }}
                            >
                                <Flex
                                    vertical
                                    gap="small"
                                    style={{ width: "100%" }}
                                >
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
                                    <Form.Item>
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            loading={loading}
                                            onClick={signMessageWithElGamal}
                                        >
                                            Подписать сообщение
                                        </Button>
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
                                        name="a"
                                        label="Подпись a"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="b"
                                        label="Подпись b"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                </Flex>
                            </Form>
                        </Splitter.Panel>
                        <Splitter.Panel style={{ marginLeft: "20px" }}>
                            <Form
                                form={elGamalCheckSignForm}
                                name="elGamalCheckSignForm"
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
                                            onClick={checkElGamalSign}
                                        >
                                            Проверить подпись
                                        </Button>
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="left"
                                        label="Левая часть"
                                    >
                                        <Input readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        style={{ width: "100%" }}
                                        name="right"
                                        label="Правая часть"
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
