import { Button, Flex, Form, Input, InputNumber, Space, Upload } from "antd";
import { useState } from "react";
import {
    KeyOutlined,
    LockOutlined,
    SwapLeftOutlined,
    UnlockOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab6 = () => {
    const { TextArea } = Input;
    const [form] = useForm();
    const [keysForm] = useForm();
    const [loading, setLoading] = useState(false);
    const [publicKey, setPublicKey] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);

    const handleGenerateP = async () => {
        const bits = await keysForm.getFieldValue("pBits");
        const url = "/lab4/prime-numbers/generate-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        keysForm.setFieldValue("p", response.data);
    };

    const handleGenerateQ = async () => {
        const bits = await keysForm.getFieldValue("qBits");
        const url = "/lab4/prime-numbers/generate-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        keysForm.setFieldValue("q", response.data);
    };

    const decimalValidate = (_, value) => {
        const regex = /^[\d]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 10-ричное число"));
        }

        return Promise.resolve();
    };

    const handleUploadFile = async (options) => {
        setLoading(true);
        const { file, onSuccess, onError } = options;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const url = "/lab6/upload-file";
            const response = await axios.post(url, formData);
            const data = response.data;

            keysForm.setFieldValue("p", data.p);
            keysForm.setFieldValue("q", data.q);
            onSuccess(data, file);
        } catch (error) {
            console.log(error);
            onError(error);
        }

        setLoading(false);
    };

    const handleGetKeys = async () => {
        try {
            const values = await keysForm.validateFields();
            const response = await axios.get("/lab6/get-keys", {
                params: { p: values.p, q: values.q },
                responseType: "json",
            });

            // Сохраняем ключи для фронта
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);

            console.log(publicKey, privateKey);

            // Формируем zip архив для скачивания
            const byteChars = decodeBase64(response.data.zipFile);
            const byteArray = new Uint8Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteArray[i] = byteChars.charCodeAt(i);
            }

            const blob = new Blob([byteArray], { type: "application/zip" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "rsa_keys.zip";
            link.click();
        } catch (error) {
            console.error(error);
        }
    };

    const decodeBase64 = (base64) => {
        // Заменяем URL-safe символы
        const standardBase64 = base64.replace(/-/g, "+").replace(/_/g, "/");

        // Добавляем padding если нужно
        const padLength = 4 - (standardBase64.length % 4);
        const paddedBase64 = standardBase64 + "=".repeat(padLength % 4);

        // Декодируем
        return atob(paddedBase64);
    };

    const handleSwapResultText = async () => {
        const values = await form.validateFields();
        form.setFieldValue("text", values.result);
    };

    const handleEncrypt = async () => {
        try {
            const url = "/lab6/encrypt";
            const values = await form.validateFields();
            const body = {
                text: values.text,
                key: publicKey,
            };

            const response = await axios.post(url, body);
            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log();
        }
    };

    const handleDecrypt = async () => {
        try {
            const url = "/lab6/decrypt";
            const values = await form.validateFields();
            const body = {
                text: values.text,
                key: privateKey,
            };

            const response = await axios.post(url, body);
            form.setFieldValue("result", response.data);
        } catch (error) {
            console.log();
        }
    };

    return (
        <Flex vertical gap="small" style={{ width: "100%" }}>
            <Upload
                customRequest={handleUploadFile}
                accept=".json"
                showUploadList={false}
            >
                <Button
                    variant="outlined"
                    color="primary"
                    icon={<UploadOutlined />}
                    style={{ marginBottom: "12px" }}
                >
                    Загрузить файл
                </Button>
            </Upload>

            <Flex style={{ width: "100%" }}>
                <Form form={keysForm} name="rsaForm" style={{ width: "100%" }}>
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
                                                        decimalValidate(
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
                                                        decimalValidate(
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
                </Form>
            </Flex>
            <Form form={form} name="lab6" style={{ width: "100%" }}>
                <Form.Item>
                    <Button
                        color="primary"
                        variant="solid"
                        icon={<KeyOutlined />}
                        loading={loading}
                        onClick={handleGetKeys}
                    >
                        Получить ключи
                    </Button>
                </Form.Item>
                <Flex gap="small">
                    <Form.Item>
                        <Button
                            color="primary"
                            variant="solid"
                            icon={<LockOutlined />}
                            loading={loading}
                            onClick={handleEncrypt}
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
                        <TextArea placeholder="Результат" rows={10} readOnly />
                    </Form.Item>
                </Flex>
            </Form>
        </Flex>
    );
};

export default Lab6;
