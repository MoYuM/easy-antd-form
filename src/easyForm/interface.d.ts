import { FormItemProps, FormProps } from 'antd';
import { FormListProps } from 'antd/lib/form';

export type EasyFormProps = FormProps & {
  schema: BaseSchema
  plugins?: Array<Plugin>
}

export type BaseSchema = {
  type?: 'form',
  items: Array<BaseItem>,
}

export type Element = React.ReactElement | React.FC | React.ComponentClass

export type BaseItem = BaseFormItem | BaseFormList | BaseElement

export type BaseFormItem = FormItemProps & {
  type: 'item',
  children?: BaseItem[],
  component?: string | Element, // TODO 用map
  props?: any, // TODO 尽量别用any
}

export type BaseElement = {
  type: 'reactElement',
  component: Element,
}

export type BaseFormList = Omit<FormListProps, 'children'> & {
  type: 'list',
  fields: BaseItem[],
}

export type Props = {
  type: 'props' | 'propsWithFunction',
  name: string,
  value?: any,
  function?: Function,
}

export type ASTtypes =
  'formItem'
  | 'formList'
  | 'formItemWrapper'
  | 'reactElement'
  | 'formListRemoveBtn'
  | 'formListAddBtn'
  | 'formListField'
  | 'formItemWithDefaultElement' // 内置组件
  | 'defaultElement'

export type AST = {
  type: 'form',
  props?: Record<string, any>,
  children: Array<DefaultElementAST | ReactElementAST | FormItemAST | FormListBtnAST | undefined>
}

export type DefaultElementAST = {
  type: 'defaultElement',
  props?: Record<string, any>,
  component: string,
}

export type ReactElementAST = {
  type: 'reactElement',
  props?: Record<string, any>,
  component: Element
}

export type FormItemAST = {
  type: 'formItem' | 'formList' | 'formListField' | 'formItemWrapper' | 'formItemWithDefaultElement'
  props?: Record<string, any>,
  children: AST['children']
}

export type FormListBtnAST = {
  type: 'formListRemoveBtn' | 'formListAddBtn'
}

export type Plugin = {
  name: string,
  when: string,
  func: (context: {
    setProps: (props: Record<string, any>) => void,
  }) => void,
}

export type Node = AST['children'][number] | AST
export type Parent = AST['children'][number] | null
