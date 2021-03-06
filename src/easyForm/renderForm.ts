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

    return COMPONENT_MAP[ast.type]
  }

  console.log("%cfinallyAST", "backgroud:red", finallyAST);

  const render = (
    ast?: AST["children"] | AST,
    index?: number,
    extra?: {
      formInstance?: any,
      add?: () => void,
      remove?: () => void,
      field?: any,
      fields?: any
    }
  ) => {
    if (!ast) return null;
    const { formInstance, add, remove, field, fields } = extra || {};
    if (Array.isArray(ast)) {
      return ast.map((a, i) => render(a, i, extra));
    } else {
      const element = getElement(ast);

      // children 是 text 的情况
      if (
        typeof element?.props?.children === "string" &&
        ast.type !== 'formListAddBtn' && // 这两个在下面单独处理
        ast.type !== 'formListRemoveBtn'
      ) {
        return React.cloneElement(element, {
          ...ast.props,
          key: index,
        });
      }


      if (ast.type === 'formItemWithFuncProps') {
        return (formInstance) => {
          let newProps = { ...ast.props }; // 这里不能改变原有 props，需要创建一个新的对象
          Object.keys(ast.props || {}).forEach(p => {
            if (typeof newProps[p] === 'function') {
              newProps[p] = newProps[p]?.(formInstance)
            }
          })
          return React.cloneElement(
            element,
            {
              ...newProps,
            },
            render(ast.children, index, { formInstance })
          )

        }
      }

      if (ast.type === 'formListField') {
        return fields?.map((field, i) => render(ast.children, i, { field, remove }))
      }


      // 分离 formList 和 formItem
      if (ast.type === 'formList') {
        const items = ast.children.filter(i => i.type !== 'formListField');
        const fields = ast.children.find(i => i?.type === 'formListField');
        // TODO 没加 key 呢
        return React.cloneElement(
          element,
          {
            ...ast.props,
            children: (_fields, actions) => {
              return React.createElement(
                React.Fragment,
                {
                  children: [
                    render(fields, 0, { fields: _fields, ...actions }),
                    render(items, 1, { ...actions })
                  ]
                }
              )
            }
          }
        )
      }

      if (ast.type === 'formListAddBtn') {
        return React.cloneElement(
          element,
          {
            ...ast.props,
            key: index,
            onClick: () => add()
          },
        )
      }

      if (ast.type === 'formListRemoveBtn') {
        return React.cloneElement(
          element,
          {
            ...ast.props,
            key: index,
            onClick: () => remove(field.name)
          },
        )
      }



      let newProps = { ...ast.props }; // 这里不能改变原有 props，需要创建一个新的对象
      Object.keys(newProps || {}).forEach(p => {
        if (typeof newProps[p] === 'function') {
          newProps[p] = newProps[p]?.(formInstance)
        }
      })

      return React.cloneElement(
        element,
        {
          ...newProps,
          key: index,
        },
        render(ast.children, index, extra)
      );
    }
  };
  console.log('%crender(finallyAST)', 'background:yellow', render(finallyAST))
  return render(finallyAST);
};

export default RenderForm;
