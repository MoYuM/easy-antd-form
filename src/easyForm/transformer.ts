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
    props: [],
    children: [],
  }

  traverser(ast, {
    'form': {
      enter: (node, parent) => {
        const setProps = createSetFunc(node);
      }
    },
    'formItem': {
      enter: (node, parent) => {
        const setProps = createSetFunc(node);

      }
    },
    'formItemWrapper': {
      enter: () => { }
    },
    'formList': {
      enter: () => { }
    },
    'formListAddBtn': {
      enter: () => { }
    },
    'formListField': {
      enter: () => { }
    },
    'formListRemoveBtn': {
      enter: () => { }
    },
    'reactElement': {
      enter: (node, parent) => {
        const funcs = plugins.filter(i => i.when === 'select');

        const setProps = createSetFunc(node);

      }
    },
    'formItemWithDefaultElement': {
      enter: () => { }
    },
    'defaultElement': {
      enter: () => { }
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

  function traverseArray(array: AST['children'], parant: Parent) {
    array.forEach(node => {
      traversNode(node, parant);
    })
  }

  function traversNode(node: Node, parant: Parent) {
    const methods = visitor[node.type];

    if (methods.enter) {
      methods.enter(node, parant);
    }

    if (node.children) {
      traverseArray(node.children, parant);
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