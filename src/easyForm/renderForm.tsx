import React from 'react';
import { Form, FormItemProps, FormInstance } from 'antd';

interface EasyFormProps extends React.ComponentProps<typeof Form> {
  items: Array<FormItemProps & {
    component: React.ReactElement | ((form: FormInstance) => React.ReactElement)
  }>
}

const RenderForm: React.FC<EasyFormProps> = (props) => {

  const { items, ...restFormProps } = props;

  return (
    <Form {...restFormProps}>
      {
        items.map(itemProps => {
          const { component, dependencies, shouldUpdate, ...restItemProps } = itemProps;

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
          return (
            <Form.Item
              dependencies={dependencies}
              shouldUpdate={shouldUpdate}
              {...restItemProps}
            >
              {component}
            </Form.Item>
          )
        })
      }
    </Form>
  )
}

export default RenderForm;