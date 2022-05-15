# Easy Antd Form

一种更简单的 [Antd Form](https://ant.design/components/form-cn/#header) 的使用方式

## 示例

```jsx
const Demo = () => {

  const [form] = Form.useForm();

  const schema = {
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
  }

  return (
    <EasyForm schema={schema} form={form} />
  )
}
```