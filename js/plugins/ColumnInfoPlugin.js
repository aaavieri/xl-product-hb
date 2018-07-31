const ColumnInfo = {
  columnData: [],
  inited: false,
  http: null,
  initData (httpPlugin) {
    if (this.inited) {
      return
    }
    this.http = httpPlugin
    this.http.get('/api/getColumnInfo').then(function (response) {
      if (response.data.success) {
        ColumnInfo.inited = true
        ColumnInfo.columnData = response.data.data
      }
    })
  },
  getColumn (tableName, columnName) {
    return this.columnData.find(function (item) {
    	return item.tableName === tableName && item.columnName === columnName
    })
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
  clear () {
    this.columnData = {}
    this.inited = false
  }
}
const ColumnInfoPlugin = {
  install (Vue) {
    Vue.mixin({
      data () {
        return {
          columnInfo: ColumnInfo
        }
      }
    })

    Object.defineProperty(Vue.prototype, '$columnInfo', {
      get () {
        return this.$root.columnInfo
      }
    })
  }
}

window.ColumnInfoPlugin = ColumnInfoPlugin
//export default ColumnInfoPlugin
