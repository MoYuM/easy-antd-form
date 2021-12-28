import { Form, Input, Select, Button } from 'antd';
import RenderForm from './easyForm';

function App() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <RenderForm
      form={form}
      onFinish={onFinish}
      items={[
        {
          component: <Input />,
          name: 'name',
          label: '姓名'
        },
        {
          component: <Select options={[{ value: 11, label: 11 }, { value: 9, label: 9 }]} />,
          name: 'age',
          label: '年龄'
        },
        {
          component: <Input />,
          name: 'test',
          label: 'test',
          dependencies: ['name'],
          rules: [
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue('name') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('姓名不一致'));
              }
            })
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
