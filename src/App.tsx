import { Form, FormInstance, } from "antd";
import RenderForm from "./easyForm";
import { Schema } from "./easyForm/interface";


/**
 * Easy Antd Form
 *
 * Eaf（easy antd from）和 form-render、fomily等 schema 驱动的表单组件类似，
 * 同样由一个 schema 驱动，但 Eaf 并不使用一个新的表单组件，而是完全使用原生
 * antd form 组件。
 *
 * Eaf 只是根据传入的 schema 渲染出一个 antd from 而已。本质上是个纯函数，不包含任何 state。
 */

/**
 * 插件
 *
 * Eaf 支持插件功能，用于自定义语法糖
 *
 * 施工中。。。
 */

/**
 * schema 格式
 *
 * EAF 默认使用一个*JS对象*来描述一个 antd 表单，而非 JSON
 * 因为这样就可以传入一个 React 元素，或 function 等，让使用变得更加灵活
 *
 * 如果需要的话，当然也可以单纯的使用JSON去描述表单
 */

function App() {
  const [form] = Form.useForm();

  // 最简单的情况
  const normal: Schema = {
    type: "form",
    items: [
      {
        type: "item",
        name: "name",
        label: "姓名",
        component: "input",
        props: {
          placeholder: "请输入",
        },
      },
      {
        type: "item",
        name: "age",
        label: "年龄",
        component: "select",
        props: {
          options: [
            { value: 1, label: "111" },
            { value: 2, label: "222" },
          ],
        },
      },
    ],
  };

  // 需要插入额外组件的情况
  // （如果是form render的话，这里就要额外写一个自定义组件，我希望简化这个步骤）
  const normalAndReactElement: Schema = {
    type: "form",
    items: [
      {
        type: "item",
        label: "姓名",
        children: [
          {
            type: "item",
            name: "name",
            component: "input",
          },
          {
            type: "reactElement",
            component: <a>need help?</a>,
          },
        ],
      },
    ],
  };

  // 有依赖的item
  // 通过传入函数的形式，实现 dependencies 和 shouldupdate 的功能
  const haveDepsItem: Schema = {
    type: "form",
    items: [
      {
        type: "item",
        label: "性别",
        name: "gender",
        component: "select",
        props: {
          options: [
            { value: "male", label: "male" },
            { value: "female", label: "female" },
          ],
        },
      },
      {
        type: "item",
        name: "age",
        dependencies: ["gender"],
        component: "input",
        // TODO 这里TS不对
        label: ({ getFieldValue }: FormInstance) => getFieldValue("gender") === "female" ? '女年龄' : '男年龄',
        props: {
          disabled: ({ getFieldValue }: FormInstance) => getFieldValue("gender") === "male",
        },
      },
    ],
  };

  // list
  // list 是 easy-antd-form 的重点，会做很多的简化
  // 代价就是需要 easy-antd-form 帮开发者做一些决定
  // 解决办法就是留出自定义的接口
  const listForm: Schema = {
    type: "form",
    items: [
      {
        type: "list",
        name: "names",
        rules: [],
        fields: [
          {
            type: "item",
            label: "姓名",
            component: "input",
          },
          {
            type: 'item',
            label: '年龄',
            component: 'input',
          }
        ],
      },
    ],
  };

  return (
    <div style={{ margin: "100px" }}>
      <h1>Easy Antd Form</h1>
      <RenderForm form={form} schema={haveDepsItem} />
    </div>
  );
}

export default App;
