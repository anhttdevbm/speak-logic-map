import {CloseIcon} from '@/components/Icons/Icons';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import React, {memo, useState} from 'react';
import {Checkbox, Col, Input, notification, Radio, Row} from 'antd';
import styles from './_ModalContents.module.scss';
import TextArea from "antd/es/input/TextArea";

interface Props {
    setToggleModal: any,
    setStyleText: any,
    initValue: any,
}

const StyleTextM: React.FC<Props> = ({setToggleModal, setStyleText, initValue}: Props): JSX.Element => {
    const globalStore = useGlobalStore();

    const [font, setFont] = useState<any>(initValue?.style?.fontFamily);
    const [size, setSize] = useState<any>(initValue?.style?.fontSize);
    const [color, setColor] = useState<any>(initValue?.style?.fontColor);
    const [style, setStyle] = useState<any[]>(initValue?.style?.fontStyle);
    const [alignHorz, setAlignHorz] = useState<any>(initValue?.style?.textAlign);
    const [text, setText] = useState<any>("AaBbCcXxYyZaAaBbCcXxYyZaAaBbCcXxYyZaAaBbCcXxYyZa");

    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.open({
            message: 'Warning',
            type: 'warning',
            duration: 3,
            description:
                'The font size value is negative. Please enter the value greater than zero.',
        });
    };

    const closeModal = (): void => {
        setToggleModal();
    }

    const saveGlobalSetting = () => {
        if (size <= 0) {
            openNotification();
        } else {
            let id = globalStore.itemAnnotationStyle.id;
            setStyleText(font, size, color, style, alignHorz);
            globalStore.updateStyleTextPalletById(id, globalStore.styleText);
            setToggleModal();
        }
    }

    return (
        <>{contextHolder}
            <div className={`${styles['simulation-setting-wrap']}`} onClick={e => e.stopPropagation()}
                 style={{marginBottom: '1rem!important'}}>
                <div className={`${styles['header']}`}>
                    <button onClick={closeModal}><CloseIcon/></button>
                    <h3>Edit Text Style</h3>
                </div>
                <div className={`${styles['main']}`}>
                    <div className={`${styles['main-content']}`}>
                        {/*FONT*/}
                        <div className={`${styles['option-wrap']}`} style={{padding: '0.5rem!important'}}>
                            <h5>Font</h5>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}>
                                    <label style={{width: '150%'}}>Fonts</label>
                                </Col>
                                <Col span={16}>
                                    <select
                                        style={{width: '100%', borderRadius: '5px'}}
                                        value={font}
                                        onChange={(e) => setFont(e.target.value)}
                                    >
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                    </select>
                                </Col>
                            </Row>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}>
                                    <label style={{width: '150%'}}>Size</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        defaultValue={size}
                                        type="number"
                                        onChange={(e) => setSize(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}>
                                    <label style={{width: '150%'}}>Color</label>
                                </Col>
                                <Col span={16}>
                                    <Input
                                        value={color}
                                        type="color"
                                        onChange={(e) => setColor(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>

                        {/*Style*/}
                        <div className={`${styles['option-wrap']}`} style={{padding: '0.5rem!important'}}>
                            <h5>Style</h5>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}></Col>
                                <Col span={16}>
                                    <Checkbox.Group value={style} style={{width: '100%'}} onChange={(e) => setStyle(e)}>
                                        <Row>
                                            <Col span={7}>
                                                <Checkbox value="bold">Bold</Checkbox>
                                            </Col>
                                            <Col span={7}>
                                                <Checkbox value="italic">Italic</Checkbox>
                                            </Col>
                                            <Col span={7}>
                                                <Checkbox value="underline">Underline</Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Col>
                            </Row>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}></Col>
                                <Col span={16}>
                                    <TextArea
                                        rows={3}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        style={{
                                            fontFamily: font,
                                            fontSize: `${size}px`,
                                            color: color,
                                            fontStyle: style.includes('italic') ? 'italic' : 'normal',
                                            textDecoration: style.includes('underline') ? 'underline' : 'none',
                                            fontWeight: style.includes('bold') ? 600 : 'normal',
                                            textAlign: alignHorz,
                                        }}
                                    />
                                </Col>
                            </Row>
                        </div>

                        {/*Text Alignment*/}
                        <div className={`${styles['option-wrap']}`}
                             style={{padding: '0.5rem!important'}}>
                            <h5>Text Alignment</h5>
                            <Row className={`${styles['option']}`}>
                                <Col span={8}>
                                    {/*<label style={{width: '150%'}}>Horz</label>*/}
                                </Col>
                                <Col span={16}>
                                    <Radio.Group onChange={(e) => setAlignHorz(e.target.value)} value={alignHorz}>
                                        <Radio value="left">Left</Radio>
                                        <Radio value="center">Center</Radio>
                                        <Radio value="right">Right</Radio>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            {/*<Row className={`${styles['option']}`}>*/}
                            {/*    <Col span={8}>*/}
                            {/*        <label style={{width: '150%'}}>Vert</label>*/}
                            {/*    </Col>*/}
                            {/*    <Col span={16}>*/}
                            {/*        <Radio.Group onChange={(e) => setAlignVert(e.target.value)} value={alignVert}>*/}
                            {/*            <Radio value="top">Top</Radio>*/}
                            {/*            <Radio value="middle">Middle</Radio>*/}
                            {/*            <Radio value="bottom">Bottom</Radio>*/}
                            {/*        </Radio.Group>*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}
                        </div>
                    </div>
                </div>
                <div className={`${styles['footer']}`}>
                    <small></small>
                    <div className={`${styles['option-btns']}`}>
                        <button className='primary-btn' onClick={saveGlobalSetting}>
                            OK
                        </button>
                        <button className='secondary-btn' onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default memo(StyleTextM)
