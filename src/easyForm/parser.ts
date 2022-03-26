import {
  AST,
  BaseSchema,
  BaseItem,
  BaseFormItem,
  BaseFormList,
  Props,
  ASTtypes,
  Element,
} from './interface';
import { omit, error } from './utils';
import { COMPONENT_MAP } from './constant';
import React from 'react';


/**
 * schema 转换为 ast
 * @param schema 
 * @returns ast
 */
function parser(schema: BaseSchema): AST {

  const ast: AST = {
    type: 'form',
    props: {},
    children: walk(schema.items),
  }

  return ast;
}


/**
 * 转换props对象为list
 */
function transformProps(props: { [key: string]: any }) {
  return props || {};
}


/**
 * 计算type
 */
function getType(item: BaseItem) {
  const { type } = item;

  switch (type) {
    case 'item':
      const haveDeps = Array.isArray(item.dependencies) && item.dependencies.length > 0;
      const haveUpdate = item.shouldUpdate || typeof item.shouldUpdate === 'function';

      if (haveDeps || haveUpdate) {
        return 'formItemWrapper'
      }

      return 'formItem';

    case 'list':
      return 'formList';
    case 'reactElement':
      return 'reactElement';
    default:
      return type;
  }
}


/**
 * 计算component
 */
function getComponent(name?: string) {
  if (!name) {
    error(`component 不存在，请检查 schema`);
    return;
  }
  if (name in COMPONENT_MAP) {
    return COMPONENT_MAP[name];
  } else {
    error(`不存在组件 ${name} ,请检查 component 是否正确`);
  }
}


/**
 * 计算children
 * formItem
 */
function getFormItemChildren(item: BaseFormItem, type: 'formItem' | 'formItemWrapper' | 'formItemWithDefaultElement'): AST['children'] {
  const haveChildren = Array.isArray(item.children) && item.children.length > 0;
  const props = transformProps(item.props);
  let children: AST['children'] | AST['children'][number] = [];

  // 有children代表时稍复杂的item
  if (haveChildren && (type === 'formItem' || type === 'formItemWithDefaultElement')) {
    return walk(item.children || []);
  }

  // 最基本的item
  if (!haveChildren && type === 'formItem') {
    if (!item.component) {
      error(`component 不存在，请检查 schema`);
      return children;
    }

    children = {
      type: 'reactElement',
      props,
      component: item.component as Element,
    }
  }

  // 最基本的item，使用了内置组件
  if (!haveChildren && type === 'formItemWithDefaultElement') {
    if (!item.component) {
      error(`component 不存在，请检查 schema`);
      return children;
    }
    children.push({
      type: 'defaultElement',
      props,
      component: item.component as string,
    })
  }

  // 需要依赖的 formItem
  if (type === 'formItemWrapper') {
    const needOmitKey = ['type', 'component', 'children', 'props', 'dependencies', 'shouldUpdate'];
    const itemProps = transformProps(omit(item, needOmitKey));

    return {
      type: 'formItem',
      props: itemProps,
      children: getFormItemChildren(omit(item, ['dependencies', 'shouldUpdate']), 'formItem')
    }
  }

  return children;
}


function getFormListChildren(item: BaseFormList): AST['children'] {
  const haveFields = Array.isArray(item.fields) && item.fields.length > 0;
  const children: AST['children'] = [];

  if (!haveFields) {
    error(`formList 不存在 fields ，请检查 schema`)
    return children;
  }

  const removeBtn = {
    type: 'formListRemoveBtn',
    props: {},
    component: 'button',
  }

  const addBtn = {
    type: 'formListAddBtn',
    props: {},
    component: 'button',
  }

  const listError = {
    type: 'formListError',
  }

  const formListField: AST['children'][number] = {
    type: 'formListField',
    props: {}, // TODO 这里还有空间加 props
    children: walk([...item.fields, removeBtn]) || [],
  }


  children.push(formListField);
  children.push({
    type: 'formItem',
    children: [
      addBtn,
      listError,
    ]
  })

  return children;
}


/**
 * 递归方法
 */
function walk(items: BaseItem[]): AST['children'] {
  if (!items) return [];

  const walker = (item: BaseItem) => {
    const itemType = getType(item);
    const restProps = omit(item, ['type', 'component', 'children', 'props', 'fields']);
    const itemProps = transformProps(restProps);

    switch (itemType) {
      case 'formItem':
        return {
          type: itemType,
          props: itemProps,
          children: getFormItemChildren(item as BaseFormItem, itemType)
        }

      case 'formItemWrapper':
        const props = {
          noStyle: true,
          dependencies: restProps.dependencies,
          shouldUpdate: restProps.shouldUpdate,
        }
        return {
          type: itemType,
          props,
          children: getFormItemChildren(item as BaseFormItem, itemType)
        }

      case 'formList':
        return {
          type: itemType,
          props: itemProps,
          children: getFormListChildren(item as BaseFormList),
        }

      case 'reactElement':
        if (item.type === 'reactElement') {
          return {
            type: itemType,
            component: React.cloneElement(item.component),
          }
        }

      case 'formListRemoveBtn':
      case 'formListAddBtn':
        return {
          type: itemType,
          props: {},
          component: 'button',
        }

      default:
        error(`无法判断formItem类型 ，请检查 schema`);
        break;
    }
  }


  // 如果只有一个子元素就不返回数组了，这一点和 React 一致
  if (items.length === 1) {
    return walker(items[0])
  } else {
    return items.map(item => {
      return walker(item);
    })
  }
}



export default parser;

