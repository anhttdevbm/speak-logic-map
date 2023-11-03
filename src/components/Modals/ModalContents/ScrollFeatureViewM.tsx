import {observer} from "mobx-react-lite";
import styles from "./_ModalContents.module.scss";
import React, {useEffect, useState} from "react";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {CloseIcon} from "@/components/Icons/Icons";
import {
    Button, Col, Form, Input, notification, Space,
    Radio, Row, Select, Table, TableProps
} from "antd";
import {ColumnsType} from "antd/es/table";
import SearchCountry from "@/components/Tools/TopTools/ToolItems/SearchCountry";
import {DeleteOutlined} from "@ant-design/icons";

interface DataType {
    key?: string;
    functionName?: string;
    startDate?: number | null;
    endDate?: number | null;
    country?: any;
    startPerformance?: number | null;
    startPerformanceTitle?: string;
    endPerformance?: number | null;
    endPerformanceTitle?: string;
    simulation?: string;
    numberFunction?: number | null;
    startColor?: string;
    endColor?: string;
}

const ScrollFeatureViewM = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, row) => (
                <Button onClick={() => handleDelete(row)}
                        icon={<DeleteOutlined rev={undefined} />}>
                </Button>
            ),
        },
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
            title: 'Number of functions',
            dataIndex: 'numberFunction',
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
            dataIndex: 'startPerformanceTitle',
            width: 150,
        },
        {
            title: 'End Performance',
            dataIndex: 'endPerformanceTitle',
            width: 150,
        },
    ];

    const {Option} = Select;
    type FieldType = {
        functionName?: string;
        startDate?: number;
        endDate?: number;
        country?: string;
        startPerformance?: string;
        endPerformance?: string;
        simulation?: string;
        numberFunction?: number
    };
    const initialValues: DataType = {
        key: "",
        functionName: "",
        startDate: null,
        endDate: null,
        country: "",
        startPerformance: null,
        endPerformance: null,
        simulation: "ggreen",
        numberFunction: null
    }
    const [api, contextHolder] = notification.useNotification();
    const [data, setData] = useState<DataType[]>([]);
    const [country, setCountry] = useState<any>(null);
    const [radioValue, setRadiovalue] = useState('manual');
    const [isClickAdd, setIsClickAdd] = useState<boolean>();
    const [form] = Form.useForm();
    const globalStore = useGlobalStore();

    useEffect(() => {
        setIsClickAdd(false);
    }, [])
    const closeModal = () => {
        globalStore.resetPositionScroll();
    }
    const handleCountry = (value: any) => {
        setCountry(value.fullName)
    }

    const handleSave = () => {
        closeModal();
        // @ts-ignore
        const startPer = data[0].startPerformance == null ? 0 : data[0].startPerformance;
        // @ts-ignore
        const endPer = data[0].endPerformance == null ? 0 : data[0].endPerformance;
        const functions = data.map(value => value.functionName);
        let countNumbeOfFunction = 0;
        let numberMax = 0;
        data.forEach(value => {
            const numberFunction = Number(value.numberFunction) ? Number(value.numberFunction) : 0;
            countNumbeOfFunction += numberFunction;
            numberMax = numberFunction > numberMax ? numberFunction : numberMax;
        });
        const numberMin = Math.round(countNumbeOfFunction / data.length);
        const stepPerformance = Math.round(numberMax / numberMin);

        const dataScroll = {
            startPerformance: Number(startPer),
            endPerformance: Number(endPer),
            stepPerformance: stepPerformance,
            startColor: data[0].startColor,
            endColor: data[0].endColor,
            functions: functions,
            startDate: data[0].startDate,
            endDate: data[0].endDate

        }
        globalStore.setDataScroll(dataScroll);
        setIsClickAdd(false);
    }

    const clickAddBtn = () => {
        setIsClickAdd(true);
    }

    const convertColor = (value: string | undefined) => {
        switch (value) {
            case 'rred':
                return {
                    startColor: "red",
                    endColor: "red"
                }
            case 'red':
                return {
                    startColor: "red",
                    endColor: "green"
                }
            case 'ggreen':
                return {
                    startColor: "green",
                    endColor: "green"
                }
            case 'green':
                return {
                    startColor: "green",
                    endColor: "red"
                }
            default:
                return {
                    startColor: "",
                    endColor: ""
                }
        }
    }
    const openNotification = () => {
        api.open({
            message: 'Warning',
            type: 'warning',
            duration: 3,
            description:
                'A country cannot be duplicated.  ' +
                'It is not possible to identify a duplicate country or a country twice.  ' +
                'The selected country is already added or in the map and cannot be added to the map or view again.  ' +
                'Please, select another country.',
        });
    };
    const isDuplicate = () => {
        return data.find(value => value.country == country) == undefined ||
            data.find(value => value.country == country) == null;
    }
    const onFinish = (value: DataType) => {
        if (!isDuplicate()) {
            openNotification();
        } else if (isClickAdd) {
            const simulation = value.simulation ?? data[0].simulation;
            const objectColor = convertColor(simulation);
            const copyValue: DataType = {
                ...value,
                key: country + "-" + data.length,
                country: country,
                startPerformanceTitle: `${value.startPerformance}% ${objectColor.startColor}`,
                endPerformanceTitle: `${value.endPerformance}% ${objectColor.endColor}`,
                startColor: objectColor.startColor,
                endColor: objectColor.endColor,
            }
            const dataCopy: any = data.map((item: any, index: number) => {
                item = {
                    ...item,
                    key: item.country + "-" + index,
                    startPerformanceTitle: `${value.startPerformance}% ${objectColor.startColor}`,
                    endPerformanceTitle: `${value.endPerformance}% ${objectColor.endColor}`,
                    startColor: objectColor.startColor,
                    endColor: objectColor.endColor,
                    startDate: value.startDate,
                    endDate: value.endDate,
                    // country: value.country
                }
                return item;
            })
            dataCopy.push(copyValue);
            setData(dataCopy);
            setIsClickAdd(false);
            // onReset();
        }
    }

    const onReset = () => {
        form.resetFields();
    };
    const handleRadio = (value: any) => {
        setRadiovalue(value.target.value);
    }

    const handleDelete = (row: DataType) => {
        console.log(row)
        const list = data.filter(value => value.key != row.key);
        setData(list);
    }

    return (
        <div>
            {contextHolder}
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
                            <Radio.Group value={radioValue} onChange={handleRadio}>
                                <Radio value={'automatic'}>Automatic</Radio>
                                <Radio value={'manual'}>Manual</Radio>
                            </Radio.Group>
                            <Row gutter={[10, 24]}>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="Function name"
                                        name="functionName"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="Start Date"
                                        name="startDate"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input type={"number"}/>

                                    </Form.Item>
                                </Col>

                            </Row>
                            <div style={{margin: 10}}></div>
                            <Row gutter={[10, 24]}>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="Select Country"
                                        name="country"
                                    >
                                        <SearchCountry setCountry={handleCountry}/>

                                        {/*<Input/>*/}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="End Date"
                                        name="endDate"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input type={"number"}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div style={{margin: 10}}/>
                            <Row>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="Start Performance"
                                        name="startPerformance"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input type={"number"}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="End Performance"
                                        name="endPerformance"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input type={"number"}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={[10, 24]}>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="simulation From"
                                        name="simulation"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <select>
                                            <option value="ggreen">Green to green</option>
                                            <option value="red">Red to green</option>
                                            <option value="rred">Red to red</option>
                                            <option value="green">Green to red</option>
                                        </select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item<FieldType>
                                        label="Number functon"
                                        name="numberFunction"
                                        rules={[{required: true, message: 'input is required'}]}
                                    >
                                        <Input type={"number"} disabled={radioValue == 'automatic'}/>
                                        {/*<InputNumber disabled={radioValue == 'automatic'}/>*/}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}/>
                                <Col span={8}>
                                    <Row justify="space-between">
                                        <Col span={12}>
                                            <Form.Item<FieldType>>
                                                <Button size="middle" type="primary" htmlType="submit"
                                                        onClick={clickAddBtn}>
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
                            </Row>
                            <div style={{margin: 10}}/>
                            {
                                data && data.length >= 0 &&
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
        </div>

    )
}

export default observer(ScrollFeatureViewM);
