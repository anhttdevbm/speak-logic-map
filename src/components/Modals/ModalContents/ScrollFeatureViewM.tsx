import {observer} from "mobx-react-lite";
import styles from "./_ModalContents.module.scss";
import React, {useEffect, useState} from "react";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {CloseIcon} from "@/components/Icons/Icons";
import {Button, Col, Form, FormInstance, Input, Row, Select, Table} from "antd";
import {ColumnsType} from "antd/es/table";

const {Option} = Select;

interface DataType {
    key?: string;
    functionName?: string;
    startDate?: number | null;
    endDate?: number | null;
    country?: any;
    startPerformance?: string;
    endPerformance?: string;
    simulation?: string;
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Functions',
        dataIndex: 'functionName',
        width: 100,
    },
    {
        title: 'Countries',
        dataIndex: 'country',
        width: 150,
    },
    {
        title: 'Start Date',
        dataIndex: 'startDate',
        width: 100,
    },
    {
        title: 'End Date',
        dataIndex: 'endDate',
        width: 100,
    },
    {
        title: 'Start Performance',
        dataIndex: 'startPerformance',
        width: 150,
    },
    {
        title: 'End Performance',
        dataIndex: 'endPerformance',
        width: 150,
    },
];

const ScrollFeatureViewM = () => {
    type FieldType = {
        functionName?: string;
        startDate?: number;
        endDate?: string;
        country?: string;
        startPerformance?: string;
        endPerformance?: string;
        simulation?: string;
    };

    const initialValues: DataType = {
        key: "",
        functionName: "",
        startDate: null,
        endDate: null,
        country: "",
        startPerformance: "",
        endPerformance: "",
        simulation: ""
    }

    const [data, setData] = useState<DataType[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
    }, [])
    const globalStore = useGlobalStore();
    console.log(globalStore.positionOfScroll);
    const closeModal = () => {
        globalStore.resetPositionScroll();
    }
    const handleSave = () => {
        console.log('CLICK');
    }

    const onFinish = (value: DataType) => {
        const copyValue = {
            key: value.country + "-" + data.length,
            ...value
        }

        setData([...data, copyValue]);
        onReset();
    }

    const onReset = () => {
        form.resetFields();
    };

    const handleCountry = (value: any) => {
        console.log("value contry:", value);
        // switch (value) {
        //     case 'male':
        //         form.setFieldsValue({country: 'Hi, man!'});
        //         break;
        //     case 'female':
        //         form.setFieldsValue({country: 'Hi, lady!'});
        //         break;
        //     case 'other':
        //         form.setFieldsValue({country: 'Hi there!'});
        //         break;
        //     default:
        // }
    }

    return (
        <div className={`${styles['simulation-setting-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['header']}`}>
                <button onClick={closeModal}><CloseIcon/></button>
            </div>
            <div className={`${styles['main']}`}>
                <div className={`${styles['main-content']}`} style={{padding: 10}}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{span: 11}}
                        wrapperCol={{span: 13}}
                        style={{maxWidth: 1000}}
                        initialValues={initialValues}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={[10, 24]}>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="Function name"
                                    name="functionName"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="Start Date"
                                    name="startDate"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="End Date"
                                    name="endDate"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{margin: 10}}></div>
                        <Row gutter={[10, 24]}>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="Select Country"
                                    name="country"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="Start Performance"
                                    name="startPerformance"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="End Performance"
                                    name="endPerformance"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{margin: 10}}/>
                        <Row gutter={[10, 24]}>
                            <Col span={8}>
                                <Form.Item<FieldType>
                                    label="simulation From"
                                    name="simulation"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col span={8}/>
                            <Col span={4}>
                                <Row justify="space-between">
                                    <Col span={12}>
                                        <Form.Item<FieldType>>
                                            <Button size="middle" type="primary" htmlType="submit">
                                                Add
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item<FieldType>>
                                            <Button type="default" htmlType="button" onClick={onReset}>
                                                Clear
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={4}/>
                        </Row>
                        <div style={{margin: 10}}/>
                        {
                            data && data.length == 0 ? null :
                                <Row>
                                    <Table columns={columns}
                                           dataSource={data}
                                           pagination={{pageSize: 50}} scroll={{y: 240}}/>
                                </Row>
                        }
                    </Form>
                </div>
            </div>
            <div className={`${styles['footer']}`}>
                <small></small>
                <div className={`${styles['option-btns']}`}>
                    <button className='primary-btn' onClick={handleSave}>
                        OK
                    </button>
                    <button className='secondary-btn' onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(ScrollFeatureViewM);