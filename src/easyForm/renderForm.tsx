import React from "react";
import { Form, FormInstance } from "antd";
import { EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";

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
  console.log("%cast", "background-color: darkorange", ast);

  return (
    <>
      <div>{JSON.stringify(ast)}</div>
      <Form></Form>
    </>
  );
};

export default RenderForm;
