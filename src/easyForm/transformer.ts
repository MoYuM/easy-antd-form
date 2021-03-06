import { cloneDeep } from 'lodash';
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

  if (Array.isArray(plugins) && plugins.length < 1) {
    return ast;
  }

  /** 
   * TODO 可以直接改参数么？
   * 先这样写吧。。。。
   * 
   * 那么如何定义一个插件呢？
   * 
   * 
   */


  const test = {
    formItem(path) {
    }
  }



  traverser(ast, [test], {
    'form': {
      enter: (node, parent) => {
      }
    },
    'formItem': {
      enter: (node) => {
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


  return ast;
}

/**
 * 遍历器
 * @param ast 
 * @param visitor 
 */
function traverser(ast: AST, plugins: any[], visitor: Record<ASTtypes | 'form', { enter: VisitorFunc, exit?: VisitorFunc }>) {

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

    if (Array.isArray(plugins) && plugins.length > 0) {
      plugins.forEach(plugin => {
        const pluginMethod = plugin[node?.type];
        const path = {
          node,

        }

        if (typeof pluginMethod === 'function') {

          pluginMethod(path);
        }
      })
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

export default transformer;