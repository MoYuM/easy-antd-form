import { ItemType } from './interface';

type Plugin = {
  name: string,
  func: () => any;
}

class Core {
  plugins: Array<Plugin>
  formObject: object

  constructor(formObject: any) {
    this.plugins = [];
    this.formObject = formObject || {};
  }

  register(plugin: Plugin) {
    if (typeof plugin.func === 'function') {
      this.plugins.push(plugin);
    }
  }

  remove(pluginName: string) {
    this.plugins = this.plugins.filter(i => i.name !== pluginName);
  }

  add(type: ItemType) {

  }

}


export default Core