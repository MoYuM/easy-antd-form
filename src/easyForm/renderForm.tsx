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
  console.log("🚀 ~ file: renderForm.tsx ~ line 22 ~ ast", ast);

  return <Form></Form>;
};

export default RenderForm;
