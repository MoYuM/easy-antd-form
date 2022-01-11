import { FormItemProps, FormInstance, FormProps } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';

export type ItemType = 'item' | 'depsItem' | 'list' | 'reactElement'

export interface EasyFormProps extends FormProps {
  items: Array<AllTypeItem>
}

export type EasyFormItem = {
  type: 'item',
  props: FormItemProps,
  children: Array<AllTypeItem>
}

export type EasyFormDepsItem = {
  type: 'depsItem',
  props: FormItemProps,
  children: (props: FormInstance) => Array<AllTypeItem>
}

export type EasyFormList = {
  type: 'list',
  props: Omit<FormListProps, 'children'>,
  children: (fields: FormListFieldData[], operation: FormListOperation, meta: {
    errors: React.ReactNode[];
    warnings: React.ReactNode[];
  }) => Array<AllTypeItem>
}

export type AllTypeItem = EasyFormItem | EasyFormList | NormalElement | EasyFormDepsItem

export type NormalElement = {
  type: 'reactElement',
  element: React.ReactElement,
}

type ItemMap = {
  'item': EasyFormItem,
  'depsItem': EasyFormDepsItem,
  'list': EasyFormList,
  'reactElement': NormalElement
}

export type Plugin = (value: Array<any>, tools: any) => void

export type BaseSchema = FormProps & {
  type?: 'form',
  items: Array<BaseItem>,
}

export type BaseItem = BaseFormItem | BaseFormList | BaseElement

export type BaseFormItem = FormItemProps & {
  type?: 'formItem',
  children?: BaseItem[],
  component?: string, // TODO 用map
  props?: any, // TODO 尽量别用any
}

export type BaseElement = {
  type: 'reactElement',
  component: React.ReactElement,
}

export type BaseFormList = FormListProps & {
  type?: 'fromList',
  list: BaseItem[],
}