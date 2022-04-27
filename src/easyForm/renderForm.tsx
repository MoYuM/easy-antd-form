import React, { ReactElement } from "react";
import { Form, FormInstance, Input, Select } from "antd";
import { AST, EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";
import { COMPONENT_MAP } from "./constant";
const elementMap = {
  form: <Form />,
  formItem: <Form.Item />,
  formList: <Form.List />,
  input: <Input />,
  select: <Select />,
};

const RenderForm: React.FC<EasyFormProps> = (props) => {
  const { schema, plugins } = props;

  const ast = parser(schema);
  const finallyAST = transformer(ast, plugins);

  console.log("%cfinallyAST", "backgroud:red", finallyAST);

  const render = (ast?: AST["children"] | AST, index?: number) => {
    if (!ast) return null;

    if (Array.isArray(ast)) {
      return ast.map(render);
    } else {
      const element =
        ast.type === "reactElement" ? ast.component : COMPONENT_MAP[ast.type];
      console.log(typeof element?.props?.children);
      if (typeof element?.props?.children === "string") {
        const result = React.cloneElement(element, {
          ...ast.props,
          key: index,
        });
        console.log("%cresult", "background:yellow", result);
        return result;
      } else {
        return React.cloneElement(
          element,
          {
            ...ast.props,
            key: index,
          },
          render(ast.children)
        );
      }
    }
  };

  return <>{render(finallyAST)}</>;
};

export default RenderForm;
