import { Input, Select, Form } from "antd";

export const COMPONENT_MAP: Record<string, React.FC | React.ComponentClass> = {
  form: <Form />,
  formItem: <Form.Item />,
  formList: <Form.List />,
  input: <Input />,
  select: <Select />,
};
