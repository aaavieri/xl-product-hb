const Dictionary = {
  dictData: {},
  inited: false,
  http: null,
  initData (httpPlugin) {
    if (this.inited) {
      return
    }
    this.http = httpPlugin
    this.http.get('/api/getDictionary').then(function (response) {
      if (response.data.success) {
        Dictionary.inited = true
        Dictionary.dictData = response.data.data
      }
    })
  },
  getDictByType (tableName, type) {
    var underLineType = this.humpToUnderLine(type)
    if (!this.dictData[`${tableName}-${underLineType}`]) {
      this.dictData[`${tableName}-${underLineType}`] = []
    }
    return this.dictData[`${tableName}-${underLineType}`]
  },
  humpToUnderLine (str) {
    return str.split('').map(function (word) {
      if (word.toLocaleUpperCase() === word) {
        return '_' + word.toLocaleLowerCase()
      } else {
        return word
      }
    }).join('')
  },
  getName (tableName, type, value) {
    var underLineType = this.humpToUnderLine(type)
    var item = this.dictData[`${tableName}-${underLineType}`].find(function (item, index, arr) {
      return item.value === value
    })
    if (item) {
      return item.name
    } else {
      return ''
    }
  },
  clear () {
    this.dictData = {}
    this.inited = false
  }
}
const DictionaryPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          dictionary: Dictionary
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$dictionary', {
      get () {
        return this.$root.dictionary
      }
    })
  }
}

window.DictionaryPlugin = DictionaryPlugin
//export default DictionaryPlugin
