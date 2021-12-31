import { FormInstance, FormItemProps } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { ItemType, AllTypeItem, EasyFormItem, EasyFormDepsItem, EasyFormList, EasyFormProps, NormalElement } from './interface';

export class Item {
  type: ItemType
  children: Array<AllTypeItem>
  props: FormItemProps
  customerItem: { [key: string]: any }
  element?: React.ReactElement

  constructor(customerItem?: { [key: string]: any }) {
    this.type = 'item';
    this.children = [];
    this.props = {};
    this.customerItem = { ...customerItem };
  }

  use(func?: (originItem: EasyFormItem, customerItem: { [key: string]: any }) => EasyFormItem) {
    if (typeof func === 'function') {
      const originItem = {
        type: this.type,
        children: this.children,
        props: this.props,
      }
      const customerItem = this.customerItem;
      const { props, children } = func(originItem, customerItem);

      this.props = props;
      this.children = children;
    }
  }

  getItem(): EasyFormItem {
    return {
      type: this.type,
      children: this.children,
      props: this.props,
    };
  }

  setType(type: ItemType) {
    this.type = type;
  }

  setProps(props: any) {
    this.props = props;
  }

  setElement(element: React.ReactElement) {
    this.element = element;
  }

  setChildren(items: AllTypeItem[]) {
    this.children = items;
  }

  getTools() {
    return {
      setType: this.setType,
      setProps: this.setProps,
      setElement: this.setElement,
      setChildren: this.setChildren,
    }
  }
}

class DepsItem {
  type: 'depsItem'
  props: FormItemProps
  children: (props: FormInstance) => Array<AllTypeItem>

  constructor() {
    this.type = 'depsItem';
    this.props = {};
    this.children = () => []
  }

  getItem(): EasyFormDepsItem {
    return this;
  }
}

class List {
  type: 'list'
  props: Omit<FormListProps, 'children'>
  children: (fields: FormListFieldData[], operation: FormListOperation, meta: {
    errors: React.ReactNode[];
    warnings: React.ReactNode[];
  }) => Array<AllTypeItem>;

  constructor() {
    this.type = 'list';
    this.props = {};
    this.children = () => [];
  }

  getItem(): EasyFormList {
    return this;
  }
}

class ReactElement {
  type: 'reactElement'
  element: React.ReactElement

  constructor(element: React.ReactElement) {
    this.type = 'reactElement';
    this.element = element;
  }

  getItem(): NormalElement {
    return this;
  }
}

class FormItems {

  formItems: Array<AllTypeItem>

  pluginsMap: Partial<Record<ItemType, () => AllTypeItem>>

  constructor() {
    this.formItems = [];
    this.pluginsMap = {};
  }

  register(type: ItemType, func: () => AllTypeItem) {
    this.pluginsMap[type] = func;
  }

  addItem() {
    const item = new Item({
      component: 'input',
      name: 'name',
    })

    const plugin = this.pluginsMap['item'];
    item.use(plugin);

  }
}


export default FormItems