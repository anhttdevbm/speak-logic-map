"use client";
/* eslint-disable @next/next/no-unwanted-polyfillio */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useCallback, useEffect, useState } from "react";
import { useGlobalStore, useSimulationSettingStore } from "@/providers/RootStoreProvider";
import styles from "./_ToolItem.module.scss";
import { RelatedIcon } from "@/components/Icons/Icons";
import { Input, Modal, Select } from "antd";
import { OPTIONS_EQUATION, OPTIONS_MATHEMATICAL } from "./constants";

import Head from "next/head";

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
  const [renderedOptions, setRenderedOptions] = useState<any[]>([]);
  const globalStore = useGlobalStore();

  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typesetPromise()
        .then(() => {
          console.log("MathJax rendering complete");
        })
        .catch((err: any) => console.error("MathJax rendering error:", err));
    }
  }, [dataRequest.equation]);

  const handleUpdateDataRequest = (value: any, config: string) => {
    if (config === "equation") {
      return setDataRequest({
        ...dataRequest,
        equationType: null,
        equationValue: null,
        [config]: value,
      });
    }
    if (config === "equationType") {
      const findOption = OPTIONS_MATHEMATICAL.find((obj) => obj.value === value)?.label || null;
      return setDataRequest({
        ...dataRequest,
        equationValue: (findOption as any) || "",
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
    const value = !dataRequest.equation ? dataRequest.equationValue : window.MathJax.tex2chtml(dataRequest.equationValue).outerHTML;
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

  return (
    <div>
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
            <div className={`${styles["center-items"]}`}>
              <div style={{ width: "50%" }}>Select Equation</div>
              <div className={`${styles["end-items"]}`} style={{ flex: 1 }}>
                <Select
                  placeholder="Select Equation"
                  style={{ width: "100%" }}
                  size="large"
                  options={OPTIONS_EQUATION}
                  value={dataRequest.equation}
                  onChange={(value) => handleUpdateDataRequest(value, "equation")}
                />
              </div>
            </div>
            {dataRequest.equation && dataRequest.equation !== "customize" && (
              <div className={`${styles["center-items"]}`} style={{ marginTop: "20px" }}>
                <div style={{ width: "100%" }}>Select Mathematical</div>
                <Select
                  placeholder="Select Mathematical"
                  style={{ width: "100%" }}
                  size="large"
                  value={dataRequest.equationType}
                  onChange={(value) => handleUpdateDataRequest(value, "equationType")}
                  options={OPTIONS_MATHEMATICAL?.filter((obj) => obj.parentId === dataRequest.equation).map((options) => ({
                    value: options.value,
                    label: <span dangerouslySetInnerHTML={{ __html: renderMath(options.label) }} />,
                  }))}
                />
              </div>
            )}

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
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Equation;
