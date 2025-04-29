"use client";
/* eslint-disable @next/next/no-unwanted-polyfillio */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalStore, useSimulationSettingStore } from "@/providers/RootStoreProvider";
import styles from "./_ToolItem.module.scss";
import { RelatedIcon } from "@/components/Icons/Icons";
import { Button, Collapse, CollapseProps, Input, Modal, Select } from "antd";
import { OPTIONS_EQUATION, OPTIONS_MATHEMATICAL } from "./constants";

import Head from "next/head";

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

  useEffect(() => {
    if (window.MathJax && isOpenModal) {
      window.MathJax.typesetPromise()
        .then(() => {
          console.log("MathJax rendering complete");
        })
        .catch((err: any) => console.error("MathJax rendering error:", err));
    }
  }, [isOpenModal]);

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

      return setDataRequest({
        ...dataRequest,
        equationValue: dataRequest.equationValue ? `${dataRequest.equationValue}, ${findOption}` : (findOption as any),
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
    return OPTIONS_EQUATION.map((obj) => ({
      key: obj.value,
      label: obj.label,
      children: (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {OPTIONS_MATHEMATICAL.filter((option) => option.parentId === obj.value).map((options) => (
            <Button className={`${styles["center-items"]}`} key={options.value} onClick={() => handleUpdateDataRequest(options.value, "equationType")}>
              <span dangerouslySetInnerHTML={{ __html: renderMath(options.label) }} />
            </Button>
          ))}
        </div>
      ),
    }));
  };

  return (
    <div id="modal-add-equation">
      <MathJaxScript />
      <button type="button" className={`${styles["left-item-wrap"]} ${globalStore.simulation ? styles["active"] : null}`} onClick={() => setIsOpenModal(true)}>
        <RelatedIcon />
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
            <Collapse items={getItemsCollapse()} defaultActiveKey={["function"]} />
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <div style={{ width: "100%" }}>Value</div>
              <TextArea
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
