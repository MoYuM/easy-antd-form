import { Form, Input, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RenderForm from './easyForm';

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

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <RenderForm
      form={form}
      onFinish={onFinish}
      {...formItemLayoutWithOutLabel}
      items={[
        // {
        //   component: <Input />,
        //   name: 'name',
        //   label: '姓名'
        // },
        // {
        //   component: <Select options={[{ value: 11, label: 11 }, { value: 9, label: 9 }]} />,
        //   name: 'age',
        //   label: '年龄'
        // },
        // {
        //   component: <Input />,
        //   name: 'test',
        //   label: 'test',
        //   dependencies: ['name'],
        //   rules: [
        //     ({ getFieldValue }) => ({
        //       validator: (_, value) => {
        //         if (!value || getFieldValue('name') === value) {
        //           return Promise.resolve();
        //         }
        //         return Promise.reject(new Error('姓名不一致'));
        //       }
        //     })
        //   ]
        // },
        {
          name: 'names',
          rules: [
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error('At least 2 passengers'));
                }
              },
            },
          ],
          list: (fields, { add, remove }, { errors }) => [
            ...fields.map((field, index) => ({
              ...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel),
              label: index === 0 ? 'Passengers' : '',
              required: false,
              component: [
                {
                  ...field,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input passenger's name or delete this field.",
                    },
                  ],
                  noStyle: true,
                  component: <Input style={{ width: '60%' }} />,
                },
                {
                  noStyle: true,
                  component: fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null
                }
              ]
            })),
            {
              component: <>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add field
                </Button>
                <Button
                  type="dashed"
                  onClick={() => {
                    add('The head item', 0);
                  }}
                  style={{ width: '60%', marginTop: '20px' }}
                  icon={<PlusOutlined />}
                >
                  Add field at head
                </Button>
                <Form.ErrorList errors={errors} />
              </>
            },
          ]
        },
        {
          component: <Button htmlType='submit'>提交</Button>,
        }
      ]}
    />
  )
}

export default App
