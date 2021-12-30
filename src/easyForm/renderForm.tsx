import React from 'react';
import { Form, FormInstance, } from 'antd';
import { EasyFormItem, EasyFormItemWithDeps, EasyFormList, EasyFormProps, NormalElement } from './interface';


const renderItem = (item: EasyFormItem) => {
  const { children, props } = item;

  return (
    <Form.Item {...props}>
      {renderChildren(children)}
    </Form.Item>
  )
}

const renderItemWithDeps = (item: EasyFormItemWithDeps) => {
  const { children, props } = item;
  const { dependencies, shouldUpdate, ...restProps } = props;

  return (
    <Form.Item
      noStyle
      dependencies={dependencies}
      shouldUpdate={shouldUpdate}
    >
      {(props) => (
        <Form.Item {...restProps}>
          {renderChildren(children(props as FormInstance))}
        </Form.Item>
      )}
    </Form.Item>
  )
}


const renderList = (item: EasyFormList) => {
  const { children, props } = item;
  return (
    <Form.List {...props}>
      {(...arg) => {
        const itemList = children(...arg);
        return renderChildren(itemList);
      }}
    </Form.List>
  )
}

const renderElement = (item: NormalElement) => {
  const { element } = item;
  return element;
}

const renderFuncMap = {
  'item': renderItem,
  'itemWithDeps': renderItemWithDeps,
  'list': renderList,
  'reactElement': renderElement,
}

const renderChildren = (children: Array<EasyFormItem | EasyFormList | NormalElement | EasyFormItemWithDeps>) => {

  const list = children.map(item => {
    const renderFunc = renderFuncMap[item.type];
    // @ts-expect-error
    return renderFunc?.(item);
  })

  if (list.length === 1) {
    return list[0]
  }

  return list;
}


const RenderForm: React.FC<EasyFormProps> = (props) => {

  const { items, ...restFormProps } = props;

  return (
    <Form {...restFormProps}>
      {renderChildren(items)}
    </Form>
  )
}

export default RenderForm;