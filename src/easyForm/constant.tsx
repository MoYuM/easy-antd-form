import { Input, Select, Form, Button } from "antd";

const formListAddBtn = (
  <Button>add field</Button>
)

const formListRemoveBtn = (
  <Button>remove field</Button>
)

export const COMPONENT_MAP: Record<string, JSX.Element> = {
  form: <Form />,
  formItem: <Form.Item />,
  formItemWithFuncProps: <Form.Item />,
  formList: <Form.List />,
  input: <Input />,
  select: <Select />,
  formItemWrapper: <Form.Item />,
  button: <Button />,
  formListError: <Form.ErrorList />,
  formListAddBtn: formListAddBtn,
  formListRemoveBtn: formListRemoveBtn
};
