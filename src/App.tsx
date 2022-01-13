import { Form, Input, Select, Button, FormInstance, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RenderForm from './easyForm';
import { EasyFormProps, EasyFormItem, Plugin, BaseSchema } from './easyForm/interface';
import Parser from './easyForm/parser';
import React from 'react';
import parser from './easyForm/parser';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
};

const schema: BaseSchema = {
  name: 'form',
  items: [
    // 普通item
    {
      component: 'input',
      name: 'name',
      label: '姓名',
      props: {
        placeholder: '请输入姓名',
      }
    },

    // 稍复杂的item
    {
      type: 'formItem',
      label: '年龄',
      children: [
        {
          component: 'input',
          name: 'age',
          noStyle: true,
        },
        {
          type: 'reactElement',
          component: <a>need help?</a>
        }
      ]
    },
    // {
    //   type: 'formItem',
    //   props: [
    //     { type: 'formItemProps', name: 'label', value: '年龄' }
    //   ],
    //   children: [
    //     {
    //       type: 'formItem',
    //       props: [
    //         { type: 'formItemProps', name: 'name', value: 'age' },
    //         { type: 'formItemProps', name: 'noStyle', value: true },
    //       ],
    //       children: [
    //         {
    //           type: 'reactElement',
    //           props: [
    //             { type: 'reactElementProps', name: 'placeholder', value: '请输入年龄' }
    //           ],
    //           component: Input,
    //         }
    //       ]
    //     },
    //     {
    //       type: 'reactElement',
    //       component: <a>need help?</a>
    //     }
    //   ]
    // },

    // 有依赖的item
    {
      name: 'deps',
      label: '依赖',
      dependencies: ['age'],
      component: 'input',
      props: {
        disabled: ({ getFieldValue }: FormInstance) => getFieldValue('age') === 10
      }
    },

    // form list
    {
      name: 'list',
      list: [
        {
          name: 'first',
          component: 'input',
        },
        {
          name: 'last',
          component: 'input',
        },
      ]
    }
  ]
}

const ast = {
  type: 'form',
  props: [
    { type: 'formProps', name: 'name', value: 'easy-antd-form' },
  ],
  children: [
    // 普通item
    {
      type: 'formItem',
      props: [
        { type: 'formItemProps', name: 'name', value: 'name' },
        { type: 'formItemProps', name: 'label', value: '姓名' },
      ],
      children: [
        {
          type: 'reactElement',
          props: [
            { type: 'reactElementProps', name: 'placeholder', value: '请输入姓名' },
          ],
          component: Input,
        }
      ],
    },

    // 稍复杂的item
    {
      type: 'formItem',
      props: [
        { type: 'formItemProps', name: 'label', value: '年龄' }
      ],
      children: [
        {
          type: 'formItem',
          props: [
            { type: 'formItemProps', name: 'name', value: 'age' },
            { type: 'formItemProps', name: 'noStyle', value: true },
          ],
          children: [
            {
              type: 'reactElement',
              props: [
                { type: 'reactElementProps', name: 'placeholder', value: '请输入年龄' }
              ],
              component: Input,
            }
          ]
        },
        {
          type: 'reactElement',
          component: <a>need help?</a>
        }
      ]
    },

    // 有依赖的
    {
      type: 'formItemWrapper',
      props: [
        { type: 'formItemProps', name: 'dependencies', value: ['age'] },
        { type: 'formItemProps', name: 'noStyle', value: true },
      ],
      children: [
        {
          type: 'formItem',
          props: [
            { type: 'formItemProps', name: 'name', value: 'deps' },
            { type: 'formItemProps', name: 'label', value: '依赖' },
          ],
          children: [
            {
              type: 'reactElement',
              component: Input,
              props: [
                {
                  type: 'propsWithFunction',
                  name: 'disabled',
                  function: ({ getFieldValue }: FormInstance) => getFieldValue('age') === 10
                }
              ]
            }
          ]
        }
      ]
    },

    // list
    {
      type: 'formList',
      props: [
        { type: 'formListProps', name: 'name', value: 'list' },
      ],
      children: [
        {
          type: 'formListField',
          children: [
            {
              type: 'formItem',
              props: [
                { type: 'formItemProps', name: 'name', value: 'first' },
              ],
              children: [
                {
                  type: 'reactElement',
                  component: Input,
                }
              ]
            },
            {
              type: 'formItem',
              props: [
                { type: 'formItemProps', name: 'name', value: 'last' },
              ],
              children: [
                {
                  type: 'reactElement',
                  component: Input,
                }
              ]
            }
          ],
        },
        {
          type: 'formItem',
          children: [
            {
              type: 'formListRemoveItemBtn',
              component: <a>remove</a>,
            }
          ]
        }
      ],
    }
  ]
}

function App() {

  return (
    <>
      <RenderForm
        schema={schema}
        plugins={[
          {
            name: 'firstPlugin',
            when: 'everyItem',
            func: ({ setProps }) => {

            },
          }
        ]}
      />
    </>
  )
}

export default App
