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
  const { items, ...restProps } = schema;

  const ast: AST = {
    type: 'form',
    props: transformProps(restProps),
    children: walk(items),
  }

  return ast;
}


/**
 * 转换props对象为list
 */
function transformProps(props: { [key: string]: any }): Props[] {
  const propsList: Props[] = [];

  for (const name in props) {
    if (Object.prototype.hasOwnProperty.call(props, name)) {
      const value = props[name];
      if (typeof value === 'function') {
        propsList.push({
          type: 'propsWithFunction',
          name,
          value,
        })
      } else {
        propsList.push({
          type: 'props',
          name,
          value,
        })
      }
    }
  }

  return propsList;
}


/**
 * 计算type
 */
function getType(item: any) {
  const haveList = Array.isArray(item.list) && item.list.length > 0;
  const haveDeps = Array.isArray(item.dependencies) && item.dependencies.length > 0;
  const haveUpdate = item.shouldUpdate || typeof item.shouldUpdate === 'function';
  const isStringComponent = typeof item.component === 'string';

  // 有 list 一定是 formList
  if (haveList) {
    return 'formList';
  }

  // reactElement 显示指定
  if (item.type === 'reactElement') {
    return 'reactElement';
  }

  // 需要 update 的 formItem
  if (haveDeps || haveUpdate) {
    return 'formItemWrapper';
  }

  // 传 string 类型的 component，视为使用内置组件或扩展组件
  if (isStringComponent) {
    return 'formItemWithDefaultElement';
  }

  // 其余都视为 formItem
  return 'formItem';
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
  const children: AST['children'] = [];

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

    children.push({
      type: 'reactElement',
      props,
      component: item.component as Element,
    })
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

    children.push({
      type: 'formItem',
      props: itemProps,
      children: getFormItemChildren(omit(item, ['dependencies', 'shouldUpdate']), 'formItem')
    })
  }

  return children;
}


function getFormListChildren(item: BaseFormList): AST['children'] {
  const haveList = Array.isArray(item.list) && item.list.length > 0;
  const children: AST['children'] = [];

  if (!haveList) {
    error(`list 不存在，请检查 schema`)
    return children;
  }

  const formListField: AST['children'][number] = {
    type: 'formListField',
    props: [], // TODO 这里还有空间加 props
    children: walk(item.list) || [],
  }

  // 给一个默认的删除按钮
  formListField.children?.push({
    type: 'formListRemoveBtn'
  })

  children.push(formListField);

  // 给一个默认的添加按钮
  children.push({
    type: 'formItem',
    children: [{
      type: 'formListAddBtn',
    }]
  })

  return children;
}


/**
 * 递归方法
 */
function walk(items: BaseItem[]): AST['children'] {
  if (!items) return [];

  const result: AST['children'] = items.map(item => {
    const itemType = getType(item);
    const restProps = omit(item, ['type', 'component', 'children', 'props']);
    const itemProps = transformProps(restProps);

    switch (itemType) {
      case 'formItem':
      case 'formItemWithDefaultElement':
        return {
          type: itemType,
          props: itemProps,
          children: getFormItemChildren(item as BaseFormItem, itemType)
        }

      case 'formItemWrapper':
        const props: Props[] = [
          { type: 'props', name: 'noStyle', value: true },
          ...transformProps({
            dependencies: restProps.dependencies,
            shouldUpdate: restProps.shouldUpdate,
          })
        ];
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
            component: item.component,
          }
        }
      default:
        error(`无法判断formItem类型，请检查 schema`);
        break;
    }
  })

  return result;
}



export default parser;

