import React from "react";
import { Form, FormInstance } from "antd";
import { EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";
import ReactJson from 'react-json-view'

const RenderForm: React.FC<EasyFormProps> = (props) => {
  const { schema, plugins } = props;

  const getAST = () => {
    const ast = parser(schema);

    if (Array.isArray(plugins) && plugins.length > 0) {
      return transformer(ast, plugins);
    } else {
      return ast;
    }
  };

  const ast = getAST();

  return (
    <>
      <ReactJson src={ast} theme="ashes" />
      <Form></Form>
    </>
  );
};

export default RenderForm;
