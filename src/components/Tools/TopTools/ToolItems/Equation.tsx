"use client";
/* eslint-disable @next/next/no-unwanted-polyfillio */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalStore, useSimulationSettingStore } from "@/providers/RootStoreProvider";
import styles from "./_ToolItem.module.scss";
import { SimulationIcon } from "@/components/Icons/Icons";
import { Button, Collapse, CollapseProps, Input, Modal, Select } from "antd";
import { OPTIONS_EQUATION_COMMUNICATION, OPTIONS_EQUATION_THEORY, OPTIONS_MATHEMATICAL } from "./constants";
import Image1 from "@/assets/images/Integral-07.png";

import Head from "next/head";
import Image from "next/image";

const { TextArea } = Input;
const MathJaxScript = () => (
  <Head>
    <script type="text/javascript" id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  </Head>
);

const Equation = () => {
  const baseDataRequest = {
    equation: null,
    equationType: null,
    equationValue: null,
  };
  const [dataRequest, setDataRequest] = useState(baseDataRequest);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const globalStore = useGlobalStore();
  const textAreaRef = useRef<any>(null);

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise()
        .then(() => {
          console.log("MathJax rendering complete");
        })
        .catch((err: any) => console.error("MathJax rendering error:", err));
    }
  }, [isOpenModal]);

  const getCursorPosition = () => {
    if (textAreaRef.current) {
      const position = textAreaRef.current.resizableTextArea.textArea.selectionStart;
      return position;
    }
    return null;
  };

  const handleUpdateDataRequest = (value: any, config: string) => {
    if (config === "equation") {
      return setDataRequest({
        ...dataRequest,
        equationType: null,
        [config]: value,
      });
    }

    if (config === "equationType") {
      const findOption = OPTIONS_MATHEMATICAL.find((obj) => obj.value === value)?.label || "";
      const cursorPosition = getCursorPosition();
      let newValue: string = "";
      if (cursorPosition !== null && textAreaRef.current) {
        const equationValue = dataRequest?.equationValue || "";
        newValue = `${equationValue?.slice(0, cursorPosition)} ${findOption} ${equationValue?.slice(cursorPosition)}`.trim().replace(/\s+/g, ' ');
        textAreaRef.current.resizableTextArea.textArea.value = newValue;
        textAreaRef.current.resizableTextArea.textArea.focus();
      }

      return setDataRequest({
        ...dataRequest,
        equationValue: newValue as any,
        [config]: value,
      });
    }

    return setDataRequest({
      ...dataRequest,
      [config]: value,
    });
  };

  const handleClickMapElement = (element: any) => {
    globalStore.setMapElementSelected(element);
    globalStore.setMapEquationSelectedPrev(element);
    globalStore.setListMapElementSelected(element);
  };

  const handleAddMap = () => {
    const value = window.MathJax.tex2chtml(dataRequest.equationValue).outerHTML;
    handleClickMapElement(value || "--");
    setIsOpenModal(false);
    return setDataRequest(baseDataRequest);
  };

  const renderMath = (label: string) => {
    if (window.MathJax) {
      return window.MathJax.tex2chtml(label).outerHTML;
    }
    return label;
  };

  const getItemsCollapse = () => {
    return [
      {
        key: 'communication-omain',
        label: 'Communication Domain',
        children: (
          <Collapse 
            items={OPTIONS_EQUATION_COMMUNICATION.map((obj) => ({
              key: obj.value,
              label: obj.label,
              children: (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {OPTIONS_MATHEMATICAL.filter((option) => option.parentId === obj.value).map((options) => (
                    <Button
                      className={`${styles["center-items"]}`}
                      style={{
                        width: "75px",
                        height: "75px",
                      }}
                      key={options.value}
                      onClick={() => handleUpdateDataRequest(options.value, "equationType")}
                    >
                      {options.image ? (
                        <Image width={options?.image ?? 35} height={options?.height ?? 35} src={options.image} alt="img" />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: renderMath(options.label) }} />
                      )}
                    </Button>
                  ))}
                </div>
              ),
            }))}
            defaultActiveKey={["function"]}
          />
        )
      },
      {
        key: 'theory domain',
        label: 'Theory Domain',
        children: (
          <Collapse 
            items={OPTIONS_EQUATION_THEORY.map((obj) => ({
              key: obj.value,
              label: obj.label,
              children: (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {OPTIONS_MATHEMATICAL.filter((option) => option.parentId === obj.value).map((options) => (
                    <Button
                      className={`${styles["center-items"]}`}
                      style={{
                        width: "75px",
                        height: "75px",
                      }}
                      key={options.value}
                      onClick={() => handleUpdateDataRequest(options.value, "equationType")}
                    >
                      {options.image ? (
                        <Image width={options?.image ?? 35} height={options?.height ?? 35} src={options.image} alt="img" />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: renderMath(options.label) }} />
                      )}
                    </Button>
                  ))}
                </div>
              ),
            }))}
            defaultActiveKey={["function"]}
          />
        )
      }
    ];
  };

  return (
    <div id="modal-add-equation">
      <MathJaxScript />
      <button type="button" className={`${styles["left-item-wrap"]} ${globalStore.simulation ? styles["active"] : null}`} onClick={() => setIsOpenModal(true)}>
        <SimulationIcon />
      </button>

      {isOpenModal && (
        <Modal
          open={isOpenModal}
          onCancel={() => {
            setIsOpenModal(false), setDataRequest(baseDataRequest);
          }}
          onOk={() => handleAddMap()}
          title="Select Equation"
        >
          <div>
            <div style={{ height: "50vh", overflowY: "auto" }}>
              <Collapse items={getItemsCollapse()} defaultActiveKey={["function"]} />
            </div>
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div style={{ width: "100%" }}>Value</div>
              <TextArea
                ref={textAreaRef}
                placeholder="Input Value"
                style={{ width: "100%" }}
                showCount
                size="large"
                value={dataRequest.equationValue || ""}
                onChange={(e) => handleUpdateDataRequest(e.target.value, "equationValue")}
              />
            </div>
          </div>
          {/* <div>
            <div className={`${styles["center-items"]}`} style={{ marginTop: "20px" }}>
              <div style={{ width: "100%" }}>Select Mathematical</div>
              <Select
                placeholder="Select Mathematical"
                style={{ width: "100%" }}
                size="large"
                value={dataRequest.equationType}
                onChange={(value) => handleUpdateDataRequest(value, "equationType")}
                options={OPTIONS_MATHEMATICAL.map((options) => ({
                  value: options.value,
                  label: <span dangerouslySetInnerHTML={{ __html: renderMath(options.label) }} />,
                }))}
              />
            </div>
            <div className={`${styles["center-items"]}`} style={{ marginTop: "20px" }}>
              <div style={{ width: "100%" }}>Input Value</div>
              <Input
                placeholder="Input Value"
                style={{ width: "95%" }}
                size="large"
                value={dataRequest.equationValue || ""}
                onChange={(e) => handleUpdateDataRequest(e.target.value, "equationValue")}
              />
            </div>
          </div> */}
        </Modal>
      )}
    </div>
  );
};

export default Equation;
