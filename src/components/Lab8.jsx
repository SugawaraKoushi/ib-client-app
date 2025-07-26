import { Button, Divider, Flex, Form, Input, Splitter } from "antd";
import { useState } from "react";
import "./index.css";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

const Lab8 = () => {
    const { TextArea } = Input;

    const [ecdsaForm] = useForm();
    const [ecdsaSecretKeyForm] = useForm();
    const [ecdsaOpenKeyForm] = useForm();
    const [ecdsaSignForm] = useForm();
    const [ecdsaCheckSignForm] = useForm();

    const [loading, setLoading] = useState(false);

    const generateSecretKey = async () => {
        try {
            setLoading(true);
            const url = "/lab8/ecdsa/secret-key";
            const values = await ecdsaForm.validateFields();
            const params = { n: values.n };
            const response = await axios.get(url, { params });
            ecdsaSecretKeyForm.setFieldValue("x", response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const generateOpenKey = async () => {
        try {
            setLoading(true);
            const url = "/lab8/ecdsa/open-key";
            const prepareValues = await ecdsaForm.validateFields();
            const secretValues = await ecdsaSecretKeyForm.validateFields();

            const body = {
                qx: prepareValues.qx,
                qy: prepareValues.qy,
                x: secretValues.x,
                a: prepareValues.a,
                p: prepareValues.p,
            };
            const response = await axios.post(url, body);
            const data = response.data;
            ecdsaOpenKeyForm.setFieldValue("px", data.x);
            ecdsaOpenKeyForm.setFieldValue("py", data.y);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const signMessage = async () => {
        try {
            setLoading(true);
            const url = "/lab8/ecdsa/sign";
            const prepareValues = await ecdsaForm.validateFields();
            const secretValues = await ecdsaSecretKeyForm.validateFields();
            const signValues = await ecdsaSignForm.validateFields();

            const body = {
                message: signValues.message,
                x: secretValues.x,
                qx: prepareValues.qx,
                qy: prepareValues.qy,
                a: prepareValues.a,
                p: prepareValues.p,
                n: prepareValues.n,
            };

            const response = await axios.post(url, body);
            const data = response.data;

            ecdsaSignForm.setFieldValue("r", data.r);
            ecdsaSignForm.setFieldValue("s", data.s);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const checkSign = async () => {
        try {
            setLoading(true);
            const url = "/lab8/ecdsa/check-sign";
            const prepareValues = await ecdsaForm.validateFields();
            const openValues  = await ecdsaOpenKeyForm.validateFields();
            const signValues = await ecdsaSignForm.validateFields();

            const body = {
                px: openValues.px,
                py: openValues.py,
                qx: prepareValues.qx,
                qy: prepareValues.qy,
                r: signValues.r,
                s: signValues.s,
                message: signValues.message,
                n: prepareValues.n,
                a: prepareValues.a,
                p: prepareValues.p,
            };

            const response = await axios.post(url, body);
            const data = response.data;

            ecdsaCheckSignForm.setFieldValue("v", data.v);
            ecdsaCheckSignForm.setFieldValue("r", data.r);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex gap="small" vertical style={{ width: "100%" }}>
            <Form form={ecdsaForm} name="ecdsaForm" style={{ width: "100%" }}>
                <Flex vertical gap="small" style={{ width: "100%" }}>
                    <Form.Item
                        name="p"
                        label="p"
                        required
                        style={{ width: "50%" }}
                        initialValue="115792089210356248762697446949407573530086143415290314195533631308867097853951"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="n"
                        label="n"
                        required
                        style={{ width: "50%" }}
                        initialValue="115792089210356248762697446949407573529996955224135760342422259061068512044369"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="a"
                        label="a"
                        required
                        initialValue="-3"
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="b"
                        label="b"
                        required
                        initialValue="5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b"
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="qx"
                        label="Q_x"
                        required
                        initialValue="6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296"
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="qy"
                        label="Q_y"
                        required
                        initialValue="4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                </Flex>
            </Form>
            <Divider style={{ marginTop: 0 }} />
            <Form
                form={ecdsaSecretKeyForm}
                name="ecdsaSecretKeyForm"
                style={{ width: "100%" }}
            >
                <Flex gap="small">
                    <Form.Item name="x" label="x" style={{ width: "50%" }}>
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            variant="solid"
                            color="primary"
                            loading={loading}
                            onClick={generateSecretKey}
                        >
                            Сгенерировать ключ
                        </Button>
                    </Form.Item>
                </Flex>
            </Form>
            <Divider style={{ marginTop: 0 }} />
            <Form
                form={ecdsaOpenKeyForm}
                name="ecdsaOpenKeyForm"
                style={{ width: "100%" }}
            >
                <Flex gap="small" align="center">
                    <Flex vertical gap="small" style={{ width: "50%" }}>
                        <Form.Item
                            name="px"
                            label="P_x"
                            style={{ width: "100%" }}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="py"
                            label="P_y"
                            style={{ width: "100%" }}
                        >
                            <Input />
                        </Form.Item>
                    </Flex>
                    <Form.Item>
                        <Button
                            variant="solid"
                            color="primary"
                            loading={loading}
                            onClick={generateOpenKey}
                        >
                            Сгенерировать ключ
                        </Button>
                    </Form.Item>
                </Flex>
            </Form>
            <Divider style={{ marginTop: 0 }} />

            <Splitter>
                <Splitter.Panel style={{ marginRight: "20px" }}>
                    <Form
                        form={ecdsaSignForm}
                        name="ecdsaSignForm"
                        style={{ width: "100%" }}
                    >
                        <Flex vertical gap="small" style={{ width: "100%" }}>
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
                                    onClick={signMessage}
                                >
                                    Подписать сообщение
                                </Button>
                            </Form.Item>
                            <Form.Item
                                name="r"
                                label="r"
                                style={{ width: "100%" }}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="s"
                                label="s"
                                style={{ width: "100%" }}
                            >
                                <Input />
                            </Form.Item>
                        </Flex>
                    </Form>
                </Splitter.Panel>
                <Splitter.Panel style={{ marginLeft: "20px" }}>
                    <Form form={ecdsaCheckSignForm} name="ecdsaCheckSignForm">
                        <Flex vertical gap="small" style={{ width: "100%" }}>
                            <Form.Item>
                                <Button
                                    variant="solid"
                                    color="primary"
                                    loading={loading}
                                    onClick={checkSign}
                                >
                                    Проверить подпись
                                </Button>
                            </Form.Item>
                            <Form.Item
                                style={{ width: "100%" }}
                                name="v"
                                label="v"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                style={{ width: "100%" }}
                                name="r"
                                label="r"
                            >
                                <Input readOnly />
                            </Form.Item>
                        </Flex>
                    </Form>
                </Splitter.Panel>
            </Splitter>
        </Flex>
    );
};

export default Lab8;
