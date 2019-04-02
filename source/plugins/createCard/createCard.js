const deepmerge = require('deepmerge');
const pluginBase = require('../../libs/PluginBase');

/**
 * @typedef {object} PluginMeta
 * @property {string} name - plugin name
 * @property {string[]} dependency - array of plugins that we need to run first
 * @property {boolean} async - function return Promise?
 */

/**
 * @namespace
 * @typedef {object} Plugin
 * @property {PluginMeta} meta - plugins mata data
 * @property {function} before - plugin function
 */
module.exports = deepmerge(pluginBase, {
  meta: {
    name: 'createCard',
    dependency: ['createRepo', 'mercury'],
  },

  /**
   * upload all files from tmp dir to repo
   * @param {object} unmodified - current article sate
   * @return {object} - modified article state
   */
  github: async (unmodified) => {
    const {
      meta: {
        name,
        dependency,
        domain,
      },
      dependencyCheck,
      domainCheck,
    } = module.exports;
    const {
      url,
      stack,
      mercury,
      gitHubUtils,
    } = unmodified;
    const modified = {
      assignees: [],
      tags: [],
      dom: {},
      stack: [],
      ...unmodified,
    };
    const {
      assignees,
      tags,
    } = modified;
    if (domainCheck(url, domain)) return unmodified;
    dependencyCheck(stack, dependency, name);
    const [{ title }] = mercury;
    await gitHubUtils.createCard(url, title, tags, assignees);
    modified.stack.push(name);
    return modified;
  },
});
