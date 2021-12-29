import React from 'react';
import { Form, FormItemProps, FormInstance, } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';


type ObjComponetItem = FormItemProps & { component?: React.ReactElement | null, noWrapper?: boolean }
type FuncComponentItem = FormItemProps & { component?: (props: FormInstance) => React.ReactElement }
type ListComponentItem = FormItemProps & { component?: Array<ObjComponetItem | FuncComponentItem> }
type EasyFormItem = ObjComponetItem | FuncComponentItem | ListComponentItem

type EasyFormList = Omit<FormListProps, 'children'> & {
  list: (fields: FormListFieldData[], operation: FormListOperation, meta: {
    errors: React.ReactNode[];
    warnings: React.ReactNode[];
  }) => Array<EasyFormItem>,
}

interface EasyFormProps extends React.ComponentProps<typeof Form> {
  items: Array<EasyFormItem | EasyFormList>
}

/**
 * 如果component为一个对象
 */
const renderNormalComponent = (props: ObjComponetItem) => {
  const { component, noWrapper, ...restProps } = props;
  if (noWrapper) {
    return component
  }
  return (
    <Form.Item {...restProps}>
      {component}
    </Form.Item>
  )
}

/**
 * 如果component为一个函数
 */
const renderFuncComponent = (props: FuncComponentItem) => {
  const { component, dependencies, shouldUpdate, ...restItemProps } = props;
  if (typeof component === 'function') {
    return (
      <Form.Item
        noStyle
        dependencies={dependencies}
        shouldUpdate={shouldUpdate}
      >
        {(props) => (
          <Form.Item {...restItemProps}>
            {(component as Function)(props)}
          </Form.Item>
        )}
      </Form.Item>
    )
  }
}

/**
 * 如果component为list
 */
const renderListComponent = (props: ListComponentItem) => {
  const { component, ...restProps } = props;
  return (
    <Form.Item {...restProps}>
      {
        component?.map(item => {
          if (typeof item.component === 'function') {
            return renderFuncComponent(item as FuncComponentItem);
          } else {
            return renderNormalComponent(item as ObjComponetItem);
          }
        })
      }
    </Form.Item>
  )
}

/**
 * 渲染Form.Item
 */
const renderObjItem = (item: EasyFormItem) => {
  const { component } = item;
  if (typeof component === 'function') {
    return renderFuncComponent(item as FuncComponentItem);
  }
  if (Array.isArray(component)) {
    return renderListComponent(item as ListComponentItem);
  }
  return renderNormalComponent(item as ObjComponetItem);
}

/**
 * 如果item.type == 'list'，则渲染成Form.List
 */
const renderListItem = (item: EasyFormList) => {
  const { list, ...restProps } = item;
  return (
    <Form.List {...restProps}>
      {(...arg) => {
        const itemList = list(...arg);
        return itemList.map(renderObjItem);
      }}
    </Form.List>
  )
}

const RenderForm: React.FC<EasyFormProps> = (props) => {

  const { items, ...restFormProps } = props;

  return (
    <Form {...restFormProps}>
      {
        items.map(item => {
          if ('list' in item) {
            return renderListItem(item);
          } else {
            return renderObjItem(item);
          }
        })
      }
    </Form>
  )
}

export default RenderForm;