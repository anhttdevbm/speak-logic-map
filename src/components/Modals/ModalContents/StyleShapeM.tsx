import {CloseIcon, SimulationSettingIcon} from '@/components/Icons/Icons';
import {useSimulationSettingStore} from '@/providers/RootStoreProvider';
import {SimulationSettingInterface} from '@/stores/SimulationSettingStore';
import {toTitleCase} from '@/utils/format_string_to_title';
import React, {memo, useState} from 'react';
import {Checkbox, Col, Input, Radio, Row, Select} from 'antd';
import styles from './_ModalContents.module.scss';
import TextArea from "antd/es/input/TextArea";

interface Props {
    setToggleModal: any,
    setStyleShape: any
}

const StyleShapeM: React.FC<Props> = ({setToggleModal, setStyleShape}: Props): JSX.Element => {
    const simulationSettingStore = useSimulationSettingStore();
    const [setting, setSetting] = useState<SimulationSettingInterface>(simulationSettingStore);

    const [font, setFont] = useState<any>("Times New Roman");
    const [borderSize, setBorderSize] = useState<any>(3);
    const [background, setBackground] = useState<any>("#ffffff");
    const [borderColor, setBorderColor] = useState<any>("#000000");
    const [alignHorz, setAlignHorz] = useState<any>("left");
    const [alignVert, setAlignVert] = useState<any>("middle");
    const [text, setText] = useState<any>("AaBbCcXxYyZaAaBbCcXxYyZaAaBbCcXxYyZaAaBbCcXxYyZa");

    const closeModal = (): void => {
        setToggleModal();
    }

    const saveGlobalSetting = () => {
        setStyleShape(font, borderSize, background, borderColor, alignHorz);
        setToggleModal();
    }

    return (
        <div className={`${styles['simulation-setting-wrap']}`} onClick={e => e.stopPropagation()}
             style={{marginBottom: '1rem!important'}}>
            <div className={`${styles['header']}`}>
                <button onClick={closeModal}><CloseIcon/></button>
                <h3>Edit Shape Style</h3>
            </div>
            <div className={`${styles['main']}`}>
                <div className={`${styles['main-content']}`}>
                    {/*FONT*/}
                    <div key={`font`} className={`${styles['option-wrap']}`} style={{padding: '0.5rem!important'}}>
                        <h5>Appearance</h5>
                        <Row key={`fonts`} className={`${styles['option']}`}>
                            <Col span={8}>
                                <label style={{width: '150%'}}>Fill</label>
                            </Col>
                            <Col span={16}>
                                <Input
                                    defaultValue={background}
                                    type="color"
                                    onChange={(e) => setBackground(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row key={`fonts`} className={`${styles['option']}`}>
                            <Col span={8}>
                                <label style={{width: '150%'}}>Stroke</label>
                            </Col>
                            <Col span={16}>
                                <Input
                                    defaultValue={borderSize}
                                    type="number"
                                    onChange={(e) => setBorderSize(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row key={`fonts`} className={`${styles['option']}`}>
                            <Col span={8}></Col>
                            <Col span={16}>
                                <Input
                                    defaultValue={borderColor}
                                    type="color"
                                    onChange={(e) => setBorderColor(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/*Preview*/}
                    <div key={`font`} className={`${styles['option-wrap']}`} style={{padding: '0.5rem!important'}}>
                        <h5>Preview</h5>
                        <Row key={`fonts`} className={`${styles['option']}`}>
                            <Col span={8}></Col>
                            <Col span={16}>
                                <div style={{
                                    background: background,
                                    width: '300px',
                                    height: '200px',
                                    border: `${borderSize}px solid ${borderColor}`,
                                }}
                                ></div>
                            </Col>
                        </Row>
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
    )
}

export default memo(StyleShapeM)
