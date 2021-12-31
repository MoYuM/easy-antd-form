import { Form, Input, Select, Button } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import RenderForm from './easyForm';
import { EasyFormProps, EasyFormItem, Plugin } from './easyForm/interface';
import Parser from './easyForm/parser';

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

const schema = [
  {
    name: 'name',
    label: '姓名',
    component: 'input',
  },
  {
    name: 'age',
    label: '年龄',
    component: 'select',
    options: [{ value: 1, label: 1 }, { value: 20, label: 20 }],
  },
  {
    name: 'test',
    label: '测试',
    dependencies: ['age'],
    component: 'input',
  }
]

const Map = {
  'input': <Input />,
  'select': <Select />,
}

const tranformChildren: Plugin = (values, { setChildren }) => {
  if (!values.children) {
    setChildren([
      {
        type: 'reactElement',
        element: Map[values.component],
      }
    ])
  }
}

const getType = (values, { setType }) => {
  if (!values.dependencies) {
    setType('item')
  }
}

const setOptions = (values, { setChildren }) => {
  const Component = Map[values.component];
  if (values.options) {
    setChildren([
      {
        type: 'reactElement',
        element: <Component options={values.options} />
      }
    ])
  }
}

const parser = new Parser(schema);

parser
  .use(tranformChildren)
  .use(getType)
  .use(setOptions)

parser.parse();
const res = parser.getObj();
console.log('%cres', 'background-color: darkorange', res);

function App() {
  const [form] = Form.useForm();
  return (
    <>
      <RenderForm
        {...formItemLayoutWithOutLabel}
        items={res}
      />
    </>
  )
}

export default App
