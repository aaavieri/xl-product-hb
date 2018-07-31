const closeToolTip = (treeItem) => {
  treeItem.tooltipActive = false
}
var reg = new RegExp('', 'i')
Vue.component('xl-frame', {
	template: 
		`<div class="frame-container frame-self">
		    <md-card class="page-container no-border">
		      <md-app md-waterfall md-mode="fixed" class="shape-app">
		        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
		          <md-button class="md-icon-button">
		            <md-icon md-src="./static/svg/icon-menu.svg"/>
		          </md-button>
		          <span class="md-title" v-show="!searching">{{selected.name}}</span>
		          <md-autocomplete class="search" md-layout="box" :md-fuzzy-search="fuzzySearch"
		                           v-model="searchText" v-show="searching" :md-options="searchList" md-dense>
		            <label>Search...</label>
		          </md-autocomplete>
		          <div class="md-toolbar-section-end">
		            <md-button class="md-icon-button" v-show="searching" @click="cancelSearch()">
		              <md-icon md-src="./static/svg/icon-cancel.svg">取消</md-icon>
		            </md-button>
		            <md-button class="md-icon-button" v-show="!searching" @click="searching = true">
		              <md-icon md-src="./static/svg/icon-search.svg">搜索</md-icon>
		            </md-button>
		          </div>
		        </md-app-toolbar>
		        <md-app-content>
		          <md-list>
		            <md-list-item md-expand class="typeList" v-for="(item, index) in treeData"
		                          :key="'group' + index" :md-expanded.sync="item.open">
		              <md-icon md-src="./static/svg/icon-medical-type.svg"></md-icon>
		              <span class="md-list-item-text">{{item.name}}</span>
		              <md-list slot="md-expand">
		                <md-list-item class="md-inset has-ripple" v-for="(treeItem, treeIndex) in item.children" v-show="!searching || treeItem.matchSearch"
		                              :key="'group' + index + 'item' + treeIndex" @click="showToolTip(treeItem)">
		                  <div class="md-list-item-text">
		                    <span>{{treeItem.name}}</span>
		                    <p>{{treeItem.serial}}</p>
		                    <span style="width: 100%; height: 0px">
		                      // 因为手机里面第一次自动触发tooltip的时候，会不触发ink-ripple，所以改成点击手动触发
		                      <md-tooltip :md-active.sync="treeItem.tooltipActive">{{treeItem.name}}</md-tooltip>
		                    </span>
		                  </div>
		                  <md-button class="md-icon-button md-list-action" @click.stop="clickDetail(treeItem)">
		                    <md-icon md-src="./static/svg/icon-medical-detail.svg">详情</md-icon>
		                  </md-button>
		                </md-list-item>
		              </md-list>
		            </md-list-item>
		          </md-list>
		        </md-app-content>
		      </md-app>
		      <md-speed-dial class="md-bottom-right" mdEvent="click" style="bottom: 84px">
		        <md-speed-dial-target>
		          <md-icon md-src="./static/svg/icon-plus.svg" class="md-morph-initial">功能</md-icon>
		          <md-icon md-src="./static/svg/icon-close.svg" class="md-morph-final">收起</md-icon>
		        </md-speed-dial-target>
		
		        <md-speed-dial-content>
		          <md-button class="md-icon-button" @click="changeAllStatus(true)">
		            <md-icon md-src="./static/svg/icon-expand.svg">展开</md-icon>
		          </md-button>
		
		          <md-button class="md-icon-button" @click="changeAllStatus(false)">
		            <md-icon md-src="./static/svg/icon-collapse.svg">折叠</md-icon>
		          </md-button>
		        </md-speed-dial-content>
		      </md-speed-dial>
		    </md-card>
      		<md-card class="tabbar-container">
		        <md-bottom-bar md-type="shift" class="my-bottom-bar md-primary md-elevation-20 radius-shape-div" v-bind:md-active-item="selected.id">
		          	<md-bottom-bar-item class="my-bottom-item" v-for="(item, index) in tabList"
		                              :key="index" :id="item.id" :md-label="item.name" :md-icon="item.imgSrc"
		                              @click="clickBottomBar(item)"></md-bottom-bar-item>
		        </md-bottom-bar>
	      	</md-card>
	    </div>`,
	props: {
		allData: {
			type: Array,
			default: () => []
		},
		selected: {
			type: Object,
			default: () => {}
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
			selected: {},
			tabList: [
				{
					id: 'medical',
					name: '医疗版',
					compName: 'Medical',
					themeName: 'default',
					imgSrc: './static/svg/icon-medical.svg'
				},
				{
					id: 'healthy',
					name: '大健康',
					compName: 'Healthy',
					themeName: 'purple-custom',
					imgSrc: './static/svg/icon-healthy.svg'
				},
				{
					id: 'more',
					name: '未完待续',
					compName: 'More',
					themeName: 'pink-custom',
					imgSrc: './static/svg/icon-more.svg'
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
			this.treeData.map(item => {
				item.open = status
			})
		},
		showToolTip (treeItem) {
			treeItem.tooltipActive = true
			setTimeout(closeToolTip, 1500, treeItem)
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
				var data = this.allData.filter((item) => item.tableName === `t_${selectTabId}`)
				this.generateTreeData(data)
			})
		},
		generateTreeData (data) {
			let frame = this
			var treeData = []
			data.map(item => {
				var typeData = treeData.find(tree => tree.id === item.typeId)
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
			this.treeData.map((item, index) => {
				item.open = false
				if (index === 0 && needSearch) reg = new RegExp(val, 'i')
				item.children.map(child => {
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
	}
})