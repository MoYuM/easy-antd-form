import React from "react";
import { AST, EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";
import { COMPONENT_MAP } from "./constant";

const RenderForm: React.FC<EasyFormProps> = (props) => {
  const { schema, plugins } = props;

  const ast = parser(schema);
  const finallyAST = transformer(ast, plugins);

  console.log("%cfinallyAST", "backgroud:red", finallyAST);

  const render = (ast?: AST["children"] | AST, index?: number, formInstance?: any) => {
    if (!ast) return null;

    if (Array.isArray(ast)) {
      return ast.map(render);
    } else {
      const element = ast.type === "reactElement" ? ast.component : COMPONENT_MAP[ast.type];
      if (typeof element?.props?.children === "string") {
        return React.cloneElement(element, {
          ...ast.props,
          key: index,
        });
      }
      if (ast.props.dependencies || ast.props.shouldUpdate) {
        return React.cloneElement(
          element,
          {
            ...ast.props,
            key: index,
          },
          render(ast.children)
        )
      }

      if (ast.type === 'formItemWithFuncProps') {
        return (formInstance) => {
          let newProps = { ...ast.props }; // 这里不能改变原有 props，需要创建一个新的对象
          Object.keys(ast.props).forEach(p => {
            if (typeof ast.props[p] === 'function') {
              newProps[p] = ast.props[p]?.(formInstance)
            }
          })

          return React.cloneElement(
            element,
            {
              ...newProps,
            },
            render(ast.children, undefined, formInstance)
          )

        }
      }

      let newProps = { ...ast.props }; // 这里不能改变原有 props，需要创建一个新的对象
      Object.keys(ast.props).forEach(p => {
        if (typeof ast.props[p] === 'function') {
          newProps[p] = ast.props[p]?.(formInstance)
        }
      })
      return React.cloneElement(
        element,
        {
          ...newProps,
          key: index,
        },
        render(ast.children)
      );
    }
  };

  return <>{render(finallyAST)}</>;
};

export default RenderForm;
