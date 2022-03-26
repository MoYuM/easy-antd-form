import { AST, ASTtypes, Plugin, Node, Parent } from './interface';


type VisitorFunc = (node: Node, parent: Parent) => void

/**
 * 转换 ast
 * 插件在这里起作用，将旧 ast 转换为一个新的 ast
 * 
 * @param ast ast
 * @param plugins 插件列表
 * @returns new ast
 */
function transformer(ast: AST, plugins: Plugin[]): AST {
  const newAst: AST = {
    type: 'form',
    props: {},
    children: [],
  }

  traverser(ast, {
    'form': {
      enter: (node, parent) => {
        console.log(node)
        return node;
      }
    },
    'formItem': {
      enter: (node) => {
        return node;

      }
    },
    'formItemWrapper': {
      enter: (node) => {
        return node;

      }
    },
    'formList': {
      enter: (node) => {
        return node;

      }
    },
    'formListAddBtn': {
      enter: (node) => {
        return node;

      }
    },
    'formListField': {
      enter: (node) => {
        return node;

      }
    },
    'formListRemoveBtn': {
      enter: (node) => {
        return node;

      }
    },
    'reactElement': {
      enter: (node) => {
        return node;

      }
    },
    'formItemWithDefaultElement': {
      enter: (node) => {
        return node;

      }
    },
    'defaultElement': {
      enter: (node) => {
        return node;

      }
    }
  })


  return newAst;
}

/**
 * 遍历器
 * @param ast 
 * @param visitor 
 */
function traverser(ast: AST, visitor: Record<ASTtypes | 'form', { enter: VisitorFunc, exit?: VisitorFunc }>) {

  function traverseArray(array: AST['children'], parent: Parent) {
    array.forEach(node => {
      traversNode(node, parent);
    })
  }

  function traversNode(node: Node, parent: Parent) {
    const methods = visitor[node.type];

    if (methods?.enter) {
      methods.enter(node, parent);
    }

    if (node.children) {
      if (Array.isArray(node.children)) {
        traverseArray(node.children, parent);
      } else {
        traversNode(node.children, node);
      }
    }
  }

  traversNode(ast, null);
}


function createSetFunc(obj: Node) {
  let newObj = { ...obj };

  function setProps(props: Record<string, any>) {
    newObj = {
      ...newObj,
      ...props,
    }
  }

  return setProps;
}

export default transformer;