import RenderForm from "./renderForm";

export default RenderForm;

/**
 * Easy Antd Form
 * 
 * 希望的功能
 * --------
 * 
 * 1. 用一个对象渲染出一个 antd form
 * 2. 可以传入 *插件* 
 * 
 * 注: 插件不会增加功能，所有功能都来自于 antd form，插件的作用是增加新的语法糖。
 * 
 */

/**
 * 如何实现
 * -------
 * 
 * 可以借鉴 AST 的思想
 * https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js
 * 
 * 一个通常的编译器的工作流程分为如下四个步骤
 * 
 * 1. input  => tokenizer   => tokens
 * 2. tokens => parser      => ast
 * 3. ast    => transformer => newAst
 * 4. newAst => generator   => output
 * 
 * 对于 EA-Form
 * 应该是这样的流程
 * 
 * 1. schema => parser      => ast
 *    schema 就是用来描述 form 的对象。因为是一个对象，而不是一个字符串，所有 parser 的
 *    方法会有不同，但结果应该为一个 ast
 *    TODO: 需要一个基础的 schema 模版么？
 *          一定会有的，总不能让用户直接传入 ast
 * 
 * 2. ast    => transformer => newAst
 *    这里应该是插件起作用的地方，根据插件转换为一个新的 ast
 *    TODO: 定义 ast
 *          这里的 ast 是专用于描述 antd from 的，而 antd from 是一个 React 元素。所以
 *          这个 ast 实际上一个 jsx ast？
 *    TODO: 如果没有基础 schema 模版，就是将所有字段都使用插件实现了
 *          会有一个基础模版，同时也要给插件留出空间
 *    
 * 3. newAst => generator   => ouput
 *    这里输出的不再是字符串，而是一个 React 元素
 *    
 */