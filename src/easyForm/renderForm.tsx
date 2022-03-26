import React from "react";
import { Form, FormInstance } from "antd";
import { EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";

const RenderForm: React.FC<EasyFormProps> = (props) => {
  const { schema, plugins } = props;

  const ast = parser(schema);
  const finallyAST = transformer(ast, plugins);

  console.log("%c AST", "color:red", ast);
  console.log("finallAST".red, finallyAST);

  return <Form></Form>;
};

export default RenderForm;
