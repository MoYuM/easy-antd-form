import { Form, Input, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RenderForm from './easyForm';
import { EasyFormProps, EasyFormItem } from './easyForm/interface';
import TestRender from 'react-test-renderer';

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

function App() {
  const [form] = Form.useForm();

  const schema: EasyFormProps['items'] = [
    {
      type: 'list',
      props: {
        name: 'list',
      },
      children: (fields, { add, remove }, { errors }) => {
        const fieldList: EasyFormItem[] = fields.map((i, index) => ({
          type: 'item',
          props: {
            ...i,
            ...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel),
            label: index === 0 ? 'Passengers' : '',
          },
          children: [
            {
              type: 'item',
              props: {
                noStyle: true,
              },
              children: [
                {
                  type: 'reactElement',
                  element: <Input style={{ width: '60%' }} />,
                },
                {
                  type: 'reactElement',
                  element: <Button onClick={() => remove(i.name)}>remove</Button>
                }
              ]
            }
          ]
        }))

        return [
          ...fieldList,
          {
            type: 'item',
            props: {},
            children: [
              {
                type: 'reactElement',
                element: <Button onClick={() => add()}>add</Button>
              }
            ]
          }
        ]
      }
    }
  ]

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <>
      <RenderForm
        {...formItemLayoutWithOutLabel}
        items={schema}
      />
    </>
  )
}

export default App
