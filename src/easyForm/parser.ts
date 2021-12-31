import { Item } from './core';
import {
  ItemType,
  AllTypeItem,
  EasyFormItem,
  EasyFormDepsItem,
  EasyFormList,
  EasyFormProps,
  NormalElement,
  Plugin
} from './interface';
import get from 'lodash/get';

class Parser {
  customerItems: Array<any>
  items: Array<AllTypeItem>
  private plugins: Array<Plugin>
  private getType: (item: any) => ItemType
  private itemPlugin?: (origin: EasyFormItem, customer: any) => EasyFormItem
  children: Array<AllTypeItem>;


  constructor(items: Array<any>) {
    this.customerItems = items;
    this.items = [];
    this.plugins = [];
    this.children = [];
    this.getType = () => 'item';
  }

  parse() {
    // debugger
    this.items = this.customerItems.map(i => {
      const item = new Item(i);
      this.plugins.forEach(plugin => {
        item.use()
        plugin(i, item.getTools())
      })
      console.log('%citem', 'background-color: darkorange', item);
      return item;
    })
  }

  getItem(type: ItemType, customer: any) {
    switch (type) {
      case 'item':
        const item = new Item(customer);
        item.use(this.itemPlugin);
        return item;
      default:
        return new Item(customer);
    }
  }

  getTypeUse(func: () => ItemType) {
    this.getType = func;
    return this;
  }

  getObj() {
    return this.items;
  }

  use(func: Plugin) {
    this.plugins.push(func)
    return this;
  }
}

export default Parser;

