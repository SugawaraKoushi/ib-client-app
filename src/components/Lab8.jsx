import { Button, Divider, Flex, Form, Input, Splitter } from "antd";
import { useState } from "react";
import "./index.css";
import { useForm } from "antd/es/form/Form";

const Lab8 = () => {
    const { TextArea } = Input;

    const [ecdsaForm] = useForm();
    const [ecdsaSecretKeyForm] = useForm();
    const [ecdsaOpenKeyForm] = useForm();
    const [ecdsaSignForm] = useForm();
    const [ecdsaCheckSignForm] = useForm();

    const [loading, setLoading] = useState(false);

    return (
        <Flex gap="small" vertical style={{ width: "100%" }}>
            <Form form={ecdsaForm} name="ecdsaForm" style={{ width: "100%" }}>
                <Flex vertical gap="small" style={{ width: "100%" }}>
                    <Form.Item
                        name="p"
                        label="p"
                        required
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="n"
                        label="n"
                        required
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="a"
                        label="a"
                        required
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="b"
                        label="b"
                        required
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="qx"
                        label="Q_x"
                        required
                        style={{ width: "50%" }}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="qy"
                        label="Q_y"
                        required
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
