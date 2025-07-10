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
    const [rsaForm] = useForm();
    const [aesForm] = useForm();
    const [loading, setLoading] = useState(false);
    const [publicKey, setPublicKey] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);
    const [encryptedAESKey, setEncryptedAESKey] = useState("");

    const handleGenerateP = async () => {
        const bits = await rsaForm.getFieldValue("pBits");
        const url = "/lab4/prime-numbers/generate-hex-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        rsaForm.setFieldValue("p", response.data);
    };

    const handleGenerateQ = async () => {
        const bits = await rsaForm.getFieldValue("qBits");
        const url = "/lab4/prime-numbers/generate-hex-prime-number";
        const params = {
            bits: bits,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        rsaForm.setFieldValue("q", response.data);
    };

    const hexadecimalValidate = (_, value) => {
        const regex = /^[\dA-Fa-f]+$/;

        if (!regex.test(value)) {
            return Promise.reject(new Error("Введите 16-ричное число"));
        }

        return Promise.resolve();
    };

    const handleGenerateAesKey = async () => {
        const url = "/lab4/prime-numbers/generate-hex-prime-number";
        const params = {
            bits: 128,
            rounds: 20,
        };
        const response = await axios.get(url, { params });
        aesForm.setFieldValue("aesKey", response.data);
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

            rsaForm.setFieldValue("p", data.p);
            rsaForm.setFieldValue("q", data.q);
            onSuccess(data, file);
        } catch (error) {
            console.log(error);
            onError(error);
        }

        setLoading(false);
    };

    const handleGetKeys = async () => {
        try {
            const values = await rsaForm.validateFields();
            const response = await axios.get("/lab6/get-keys", {
                params: { p: values.p, q: values.q },
                responseType: "json",
            });

            // Сохраняем ключи для фронта
            setPublicKey(response.data.publicKey);
            setPrivateKey(response.data.privateKey);

            // Формируем zip архив для скачивания
            downloadZipArhive(response.data.zipFile, "rsa_keys.zip");
        } catch (error) {
            console.error(error);
        }
    };

    const downloadZipArhive = (data, archiveName) => {
        const byteChars = decodeBase64(data);
        const byteArray = new Uint8Array(byteChars.length);

        for (let i = 0; i < byteChars.length; i++) {
            byteArray[i] = byteChars.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: "application/zip" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = archiveName;
        link.click();
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
        const values = await aesForm.validateFields();
        aesForm.setFieldValue("text", values.result);
    };

    const handleEncrypt = async () => {
        try {
            const url = "/lab6/encrypt";
            const values = await aesForm.validateFields();
            const body = {
                text: values.text,
                rsaPublicKey: publicKey,
                aesKey: values.aesKey,
            };

            const response = await axios.post(url, body);
            aesForm.setFieldValue("result", response.data.encryptedText);
            setEncryptedAESKey(response.data.encryptedKey);
            downloadZipArhive(response.data.zip, "aes_encrypted.zip");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDecrypt = async () => {
        try {
            const url = "/lab6/decrypt";
            const values = await aesForm.validateFields();
            const body = {
                text: values.text,
                rsaPrivateKey: privateKey,
                encryptedAESKey: encryptedAESKey,
            };

            const response = await axios.post(url, body);
            aesForm.setFieldValue("result", response.data.decryptedText);
            downloadZipArhive(response.data.zip, "aes_decrypted.zip");
        } catch (error) {
            console.log(error);
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
                <Form form={rsaForm} name="rsaForm" style={{ width: "100%" }}>
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
                        Получить RSA ключи
                    </Button>
                </Form.Item>
            </Form>
            <Form form={aesForm} name="aesForm">
                <Flex gap="small">
                    <Form.Item
                        style={{ width: "400px" }}
                        name="aesKey"
                        label="Ключ"
                        rules={[
                            {
                                validator: (_, value) =>
                                    hexadecimalValidate(_, value),
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
                            onClick={handleGenerateAesKey}
                        >
                            Сгенертировать ключ
                        </Button>
                    </Form.Item>
                </Flex>
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
