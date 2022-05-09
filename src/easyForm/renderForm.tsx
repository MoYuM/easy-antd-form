import React from "react";
import { AST, EasyFormProps } from "./interface";
import parser from "./parser";
import transformer from "./transformer";
import { COMPONENT_MAP } from "./constant";

const RenderForm: React.FC<EasyFormProps> = (props) => {
  const { schema, plugins } = props;

  const ast = parser(schema);
  const finallyAST = transformer(ast, plugins);

  const getElement = (ast) => {
    if (ast.type === 'reactElement') {
      return ast.component
    }

    if (ast.type === 'formListRemoveBtn' || ast.type === 'formListAddBtn') {
      return COMPONENT_MAP['button']
    }

    return COMPONENT_MAP[ast.type]
  }

  console.log("%cfinallyAST", "backgroud:red", finallyAST);

  const render = (ast?: AST["children"] | AST, index?: number, formInstance?: any) => {
    if (!ast) return null;

    if (Array.isArray(ast)) {
      return ast.map(render);
    } else {
      const element = getElement(ast);
      if (typeof element?.props?.children === "string") {
        return React.cloneElement(element, {
          ...ast.props,
          key: index,
        });
      }
      if (ast.props?.dependencies || ast.props?.shouldUpdate) {
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
          Object.keys(ast.props || {}).forEach(p => {
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

      if (ast.type === 'formListField') {
        return (fields, { add, remove }, { errors }) => {
          const children = ast.children.filter(i => i?.type !== 'formListRemoveBtn');
          const removeBtn = ast.children.find(i => i?.type === 'formListRemoveBtn');
          return (
            <>
              {fields.map((field, index) => render(children))}
              {render(removeBtn)}
            </>
          )
        }
      }

      // 分离 formList 和 formItem
      if (ast.type === 'formList') {
        const items = ast.children.filter(i => i.type !== 'formListField');
        const fields = ast.children.filter(i => i?.type === 'formListField');
        // TODO 没加 key 呢
        return [
          React.cloneElement(
            element,
            {
              ...ast.props,
              key: 0
            },
            render(fields[0])
          ),
          render(items),
        ]
      }


      let newProps = { ...ast.props }; // 这里不能改变原有 props，需要创建一个新的对象
      Object.keys(ast.props | {}).forEach(p => {
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
  console.log('%crender(finallyAST)', 'background:yellow', render(finallyAST))
  return <>{render(finallyAST)}</>;
};

export default RenderForm;
