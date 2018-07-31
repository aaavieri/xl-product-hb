var reg = new RegExp('', 'i')
Vue.component('xl-frame', {
	template: 
		`<div class="frame-container frame-self">
		    <md-card class="page-container no-border">
		      <md-app md-waterfall md-mode="fixed" class="frame-app">
		        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
		          <md-button class="md-icon-button">
		            <md-icon>menu</md-icon>
		          </md-button>
		          <span class="md-title" v-show="!searching">{{selected.name}}</span>
		          <md-autocomplete class="search" md-layout="box" :md-fuzzy-search="fuzzySearch"
		                           v-model="searchText" v-show="searching" :md-options="searchList" md-dense>
		            <label>Search...</label>
		          </md-autocomplete>
		          <div class="md-toolbar-section-end">
		            <md-button class="md-icon-button" v-show="searching" @click="cancelSearch()">
		              <md-icon>undo</md-icon>
		            </md-button>
		            <md-button class="md-icon-button" v-show="!searching" @click="searching = true">
		              <md-icon>search</md-icon>
		            </md-button>
		          </div>
		        </md-app-toolbar>
		        <md-app-content>
		          <md-list>
		            <md-list-item md-expand class="typeList" v-for="(item, index) in treeData"
		                          :key="'group' + index" :md-expanded.sync="item.open">
		              <md-icon>rounded_corner</md-icon>
		              <span class="md-list-item-text">{{item.name}}</span>
		              <md-list slot="md-expand">
		                <md-list-item class="md-inset has-ripple" v-for="(treeItem, treeIndex) in item.children" v-show="!searching || treeItem.matchSearch"
		                              :key="'group' + index + 'item' + treeIndex" @click="showToolTip(treeItem)">
		                  <div class="md-list-item-text">
		                    <span>{{treeItem.name}}</span>
		                    <p>{{treeItem.serial}}</p>
		                  </div>
		                  <md-button class="md-icon-button md-list-action" @click.stop="clickDetail(treeItem)">
		                    <md-icon>open_in_new</md-icon>
		                  </md-button>
		                </md-list-item>
		              </md-list>
		            </md-list-item>
		          </md-list>
		        </md-app-content>
		      </md-app>
		      <md-speed-dial class="md-bottom-left" mdEvent="click" >
		        <md-speed-dial-target>
		        	<md-icon class="md-morph-initial">add</md-icon>
		        	<md-icon class="md-morph-final">clear</md-icon>
		        </md-speed-dial-target>
		
		        <md-speed-dial-content>
		          <md-button class="md-icon-button" @click="changeAllStatus(true)">
		            <md-icon>unfold_more</md-icon>
		          </md-button>
		
		          <md-button class="md-icon-button" @click="changeAllStatus(false)">
		          	<md-icon>unfold_less</md-icon>
		          </md-button>
		        </md-speed-dial-content>
		      </md-speed-dial>
		    </md-card>
      		<md-card class="tabbar-container">
		        <md-bottom-bar md-type="fixed" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" v-bind:md-active-item="selected.id">
		          	<md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
		                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
		                              @click="clickBottomBar(item)"></md-bottom-bar-item>
		        </md-bottom-bar>
	      	</md-card>
	    </div>`,
	props: {
		allData: {
			type: Array,
			default: function () {
				return []
			}
		},
		selected: {
			type: Object,
			default: function () {
				return {}
			}
		},
		detail: {
			type: Object
		}
	},
	data() {
		return {
			searchText: '',
			searching: false,
			searchList: [],
			fuzzySearch: true,
			treeData: [],
			tabList: [
				{
					id: 'medical',
					name: '医疗版',
					compName: 'Medical',
					themeName: 'default',
					imgSrc: 'local_hospital'
				},
				{
					id: 'healthy',
					name: '大健康',
					compName: 'Healthy',
					themeName: 'purple-custom',
					imgSrc: 'favorite_border'
				},
				{
					id: 'more',
					name: '未完待续',
					compName: 'More',
					themeName: 'pink-custom',
					imgSrc: 'more_horiz'
				}
			]
		}
	},
	methods: {
		cancelSearch () {
			this.searchText = ''
			this.searching = false
		},
		changeAllStatus (status) {
			this.treeData.map(function (item) {
				item.open = status
			})
		},
		showToolTip (treeItem) {
//			treeItem.tooltipActive = true
//			setTimeout(closeToolTip, 1500, treeItem)
				swal({
					title: treeItem.serial,
					text: treeItem.name,
					type: 'info',
					confirmButtonClass: 'md-primary md-button md-raised md-primary md-button-content md-theme-default',
					confirmButtonText: 'OK',
					buttonsStyling: false
				})
		},
		clickDetail (treeItem) {
//			this.$router.push({
//				name: 'MedicalDetail',
//				params: Object.assign({}, {rowData: treeItem}, {themeName: this.selectedTabData.themeName})
//			})
			this.$emit('update:detail', treeItem)
		},
		clickBottomBar (clickedItem) {
			this.$emit('update:selected', clickedItem)
			this.$nextTick(function() {
				var selectTabId = this.selected.id
				var data = this.allData.filter(function (item) {
					return item.tableName === `t_${selectTabId}`
				})
				this.generateTreeData(data)
			})
		},
		generateTreeData (data) {
			var frame = this
			var treeData = []
			data.map(function (item) {
				var typeData = treeData.find(function (tree) {
					return tree.id === item.typeId
				})
				if (!typeData) {
					typeData = {
						id: item.typeId,
						name: frame.$dictionary.getName(`t_${frame.selected.id}`, 'typeId', item.typeId),
						open: false,
						children: []
					}
					treeData.push(typeData)
				}
				typeData.children.push(item)
			})
			this.treeData = treeData
		}
	},
	watch: {
		searchText (val) {
			var needSearch = val.trim() !== ''
			this.treeData.map(function (item, index) {
				item.open = false
				if (index === 0 && needSearch) reg = new RegExp(val, 'i')
				item.children.map(function (child) {
					child.matchSearch = !needSearch || reg.test(child.name) || reg.test(child.serial)
					item.open = needSearch && (item.open || child.matchSearch)
				})
			})
		}
	},
	mounted () {
		if (!this.selected.id) {
			this.clickBottomBar(this.tabList[0])
		}
		var bodyHeight = document.body.offsetHeight
		this.$el.querySelector('div.frame-app').style.height = `${bodyHeight - 60}px`
		this.$el.querySelector('div.frame-app').style.minHeight = `${bodyHeight - 60}px`
		this.$el.querySelector('div.frame-app').style.maxHeight = `${bodyHeight - 60}px`
	}
})