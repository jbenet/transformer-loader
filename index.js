var unique = require('lodash.uniq')
var filter = require('lodash.filter')
var isString = require('lodash.isstring')
// var install = require('npm-installer');
module.exports = Loader;

function Loader(id) {
  if (!isString(id) || !(id.length > 0))
    throw new Error('id must be a nonempty string. Got '+id);

  if (!Loader.cache[id])
    Loader.cache[id] = Loader.LoadId(id)
  return Loader.cache[id]
}

Loader.cache = {}
Loader.autoInstall = false;

Loader.LoadId = function(id) {
  var name = Loader.NpmName(id)
  return require(name);

  // try npm -- worry about this later.
  // return Loader.LoadFromNpm(id);
}

Loader.LoadFromNpm = function (id) {
  name = Loader.NpmName(id)

  // worry about this later.
  // if (Loader.autoInstall) {
  //   install(argv.install)
  // };

  return require(name);
}

// Loader.InstallFromNpm = function(npmName) {
//   if (!npmName)
//     throw new Error('install requires valid npmName');

//   install(npmName, function(err, data) {
//     if (err) throw err;
//     callback(data);
//   });
// }

Loader.NpmName = function(id) {
  return 'transformer.' + id;
}


Loader.errIsModuleNotFound = function(err) {
  return err.code == 'MODULE_NOT_FOUND' // node
    || err.toString().match(/Cannot find module/); //browserify
}

Loader.missingModules = function(ids) {
  return unique(filter(ids, function(id) {
    try {
      // load. if no exception, it succeeded.
      Loader(id);
      return false;
    } catch (e) {
      if (Loader.errIsModuleNotFound(e))
        return true;
      throw e;
    }
  }));
}
