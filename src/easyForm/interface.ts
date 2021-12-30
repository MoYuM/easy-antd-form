import { FormItemProps, FormInstance, FormProps } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';

export type ItemType = 'item' | 'itemWithDeps' | 'list' | 'reactElement'

export interface EasyFormProps extends FormProps {
  items: Array<AllTypeItem>
}

export type EasyFormItem = {
  type: 'item',
  props: FormItemProps,
  children: Array<AllTypeItem>
}

export type EasyFormItemWithDeps = {
  type: 'itemWithDeps',
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

export type AllTypeItem = EasyFormItem | EasyFormList | NormalElement | EasyFormItemWithDeps

export type NormalElement = {
  type: 'reactElement',
  element: React.ReactElement,
}