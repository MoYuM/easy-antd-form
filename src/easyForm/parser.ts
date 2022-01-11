import { Item } from './core';
import {
  ItemType,
  AllTypeItem,
  EasyFormItem,
  EasyFormDepsItem,
  EasyFormList,
  EasyFormProps,
  NormalElement,
  Plugin,
  BaseSchema,
  BaseItem
} from './interface';
import get from 'lodash/get';
import { COMPONENT_MAP } from './constant';

// class Parser {
//   customerItems: Array<any>
//   items: Array<AllTypeItem>
//   private plugins: Array<Plugin>
//   private getType: (item: any) => ItemType
//   private itemPlugin?: (origin: EasyFormItem, customer: any) => EasyFormItem
//   children: Array<AllTypeItem>;


//   constructor(items: Array<any>) {
//     this.customerItems = items;
//     this.items = [];
//     this.plugins = [];
//     this.children = [];
//     this.getType = () => 'item';
//   }

//   parse() {
//     // debugger
//     this.items = this.customerItems.map(i => {
//       const item = new Item(i);
//       this.plugins.forEach(plugin => {
//         item.use()
//         plugin(i, item.getTools())
//       })
//       console.log('%citem', 'background-color: darkorange', item);
//       return item;
//     })
//   }

//   getItem(type: ItemType, customer: any) {
//     switch (type) {
//       case 'item':
//         const item = new Item(customer);
//         item.use(this.itemPlugin);
//         return item;
//       default:
//         return new Item(customer);
//     }
//   }

//   getTypeUse(func: () => ItemType) {
//     this.getType = func;
//     return this;
//   }

//   getObj() {
//     return this.items;
//   }

//   use(func: Plugin) {
//     this.plugins.push(func)
//     return this;
//   }
// }



function parser(schema: BaseSchema) {

  const { items, ...restProps } = schema;

  const ast = {
    type: 'form',
    props: transformProps(restProps),
    children: walk(items),
  }


  /**
   * 转换props对象为list
   */
  function transformProps(props: { [key: string]: any }) {
    const propsList = [];

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
  function getType(item: BaseItem) {

    // 有 list 一定是 formList
    // @ts-ignore
    if (Array.isArray(item.list) && item.list.length > 0) {
      return 'formList';
    }

    // reactElement 显示指定
    if (item.type === 'reactElement') {
      return 'reactElement';
    }

    // 其余都视为 formItem
    return 'formItem';
  }


  /**
   * 计算component
   */
  function getComponent(name: string) {
    if (name in COMPONENT_MAP) {
      return COMPONENT_MAP[name];
    } else {
      throw new Error(`不存在组件 ${name} ,请检查 component 是否正确`);
    }
  }


  /**
   * 计算children
   */
  function getChildren(parentType: string, componentName: string, props: { [key: string]: any }, children: BaseItem[]) {
    const component = getComponent(componentName);
    const haveChildren = Array.isArray(children) && children.length > 0;

    // 普通item的情况
    if (parentType === 'formItem' && !haveChildren) {
      return [
        {
          type: 'reactElement',
          props: transformProps(props),
          component,
        }
      ]
    }

    // 稍复杂的item
    if (parentType === 'formItem' && haveChildren) {
      return walk(children);
    }

    // 有依赖的item
  }


  /**
   * schema递归转换为ast
   */
  function walk(items: BaseItem[]) {
    return items.map(item => {
      const { type, component, children, props, ...restProps } = item;

      // reactElement 即是递归的出口
      if (type === 'reactElement') {
        return {
          type: 'reactElement',
          component,
        }
      }

      const itemType = getType(item);
      const itemProps = transformProps(restProps);
      const itemChildren = getChildren(itemType, component, props, children);

    })
  }

}

export default parser;

