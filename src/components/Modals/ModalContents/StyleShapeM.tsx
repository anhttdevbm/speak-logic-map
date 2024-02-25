import {CloseIcon} from '@/components/Icons/Icons';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import React, {memo, useEffect, useState} from 'react';
import {Col, ColorPicker, Input, Row} from 'antd';
import styles from './_ModalContents.module.scss';

interface Props {
    setToggleModal: any,
    setStyleShape: any,
    initValue: any,
}

const StyleShapeM: React.FC<Props> = ({setToggleModal, setStyleShape, initValue}: Props): JSX.Element => {
    const globalStore = useGlobalStore();

    const [borderSize, setBorderSize] = useState<any>(initValue?.weight);
    const [background, setBackground] = useState<any>(initValue?.fillColor);
    const [borderColor, setBorderColor] = useState<any>(initValue?.color);

    const closeModal = (): void => {
        setToggleModal();
    }

    const saveGlobalSetting = () => {
        setToggleModal();
        let id = globalStore.itemAnnotationStyle.id;
        let type = globalStore.itemAnnotationStyle.type;
        globalStore.updateRectPolygonPalletByIdAndType(id, type, background, borderColor, borderSize);
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
                    <div className={`${styles['option-wrap']}`} style={{padding: '0.5rem!important'}}>
                        <h5>Appearance</h5>
                        <Row className={`${styles['option']}`}>
                            <Col span={8}>
                                <label style={{width: '150%'}}>Fill</label>
                            </Col>
                            <Col span={16}>
                                <Input
                                    value={background}
                                    defaultValue={background}
                                    type="color"
                                    onChange={(e) => setBackground(e.target.value)}
                                />
                            </Col>
                        </Row>
                        <Row className={`${styles['option']}`}>
                            <Col span={8}>
                                <label style={{width: '150%'}}>Stroke</label>
                            </Col>
                            <Col span={6}>
                                <Input
                                    style={{width: '106%'}}
                                    defaultValue={borderSize}
                                    type="number"
                                    onChange={(e) => setBorderSize(e.target.value)}
                                />
                            </Col>
                            <Col span={10}>
                            </Col>
                        </Row>
                        <Row className={`${styles['option']}`}>
                            <Col span={8}></Col>
                            <Col span={16}>
                                <Input
                                    value={borderColor}
                                    defaultValue={borderColor}
                                    type="color"
                                    onChange={(e) => setBorderColor(e.target.value)}
                                />
                            </Col>
                        </Row>
                    </div>

                    {/*Preview*/}
                    <div key={`font`} className={`${styles['option-wrap']}`}
                         style={{padding: '0.5rem!important'}}>
                        <h5>Preview</h5>
                        <Row key={`fonts`} className={`${styles['option']}`}>
                            <Col span={8}></Col>
                            <Col span={16}>
                                <div style={{
                                    background: background,
                                    width: '300px',
                                    height: '200px',
                                    fillOpacity: 0.2,
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
