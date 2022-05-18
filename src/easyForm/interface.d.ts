import { FormItemProps, FormProps } from 'antd';
import { FormInstance, FormListProps } from 'antd/lib/form';

export type Element = React.ReactElement | React.FC | React.ComponentClass

export type EasyFormProps = FormProps & {
  schema: Schema
  plugins?: Array<Plugin>
}

export type Schema = {
  type?: 'form',
  items: Array<BaseItem>,
}

export type BaseItem = BaseFormItem | BaseFormList | BaseElement

/**
 * 普通的FormItem
 * 
 * component 可以为 string，也可以直接传React元素，即自定义组件
 */
export type BaseFormItem = FormItemProps & {
  type: 'item',
  children?: BaseItem[],
  component?: string | Element,
  props?: any,
}

/**
 * 渲染普通的React元素
 */
export type BaseElement = {
  type: 'reactElement',
  component: Element,
}

/**
 * FormList
 */
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

export type NodeType =
  'formItem'
  | 'formList'
  | 'formItemWrapper'
  | 'reactElement'
  | 'formListRemoveBtn'
  | 'formListAddBtn'
  | 'formListField'
  | "formItemWithFuncProps"

export type AST = {
  type: 'form',
  props?: Record<string, any>,
  children: Node | Node[],
}

export type Node = BaseNode | ReactElementNode | FunctionPropsNode

export type BaseNode = {
  type: Omit<NodeType, 'reactElement' | 'formItemWithFuncProps'>,
  props: Record<string, any>,
  children: Node | Node[],
}

export type ReactElementNode = {
  type: 'reactElement',
  props: Record<string, any>,
  component: Element,
}


export type FunctionPropsNode = {
  type: 'formItemWithFuncProps',
  props: Record<string, any | ((form: FormInstance) => any)>,
  children: Node | Node[],
}


type FormItemNode = {
  type: ''
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

export type Parent = AST['children'][number] | null
