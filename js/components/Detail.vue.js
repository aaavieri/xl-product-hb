const cardColorArr = ['orange', '#e01919', 'brown', '#2aa0a0', 'purple', 'indigo', 'teal', 'green', '#63d063']
Vue.component('xl-detail', {
	template:
		`<transition
		    enter-active-class="animated zoomInDown"
		    leave-active-class="animated zoomOutDown"
		    v-on:before-enter="beforeLoad"
		    v-on:after-enter="loaded"
		    v-on:before-leave="unloading"
		    v-on:after-leave="unloaded">
		    <md-card class="page-container no-border" v-show="startPageAnimate">
		      <md-app md-waterfall md-mode="fixed" class="shape-app">
		        <md-app-toolbar class="md-primary my-elevation-20 radius-shape-div">
		          <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
		            <md-icon>menu</md-icon>
		          </md-button>
		          <span class="md-title my-title">{{detail.name}}</span>
		          <div class="md-toolbar-section-end">
		            <md-button class="md-icon-button" @click="goBack()">
		              <md-icon>reply</md-icon>
		            </md-button>
		          </div>
		        </md-app-toolbar>
		
		        <md-app-drawer class="my-drawer" md-permanent="clipped" :md-active.sync="menuVisible">
		
		          <md-list class="my-drawer-list">
		            <md-list-item class="my-drawer-item" v-for="info in pageData"
		              @click="goCard(info.id)" :key="info.index">
		              <md-icon>{{info.iconSrc}}</md-icon>
		              <span class="md-list-item-text my-drawer-span">{{info.name}}</span>
		            </md-list-item>
		          </md-list>
		        </md-app-drawer>
		
		        <md-app-content class="detail-content" style="overflow-x: hidden" v-show="showContent">
		          <div style="height: 0; width: 100%" id="topDiv" ></div>
		          <transition
		            v-for="info in pageData"
		            :key="info.id"
		            v-bind:css="false"
		            v-on:before-enter="beforeEnter"
		            v-on:enter="enter"
		            v-on:leave="leave">
		          <md-card class="info-card md-elevation-20" style="left: -500px" md-with-hover
		             :style="cardColorStyle(info.index)" :id="info.id" v-show="startAnimate" :data-index="info.index">
		            <md-ripple>
		              <md-card-area md-inset>
		                <md-card-header class="without-subhead">
		                  <div class="md-title">{{info.name}}</div>
		                </md-card-header>
		              </md-card-area>
		              <md-card-content class="card-without-subhead">
		                <div class="card-reservation" v-for="field in info.fieldArray" :key="field.fieldName">
		                  <md-icon class="item-icon">label</md-icon>
		                  <span class="item-detail">{{field.fieldLabel}}：<br/>{{field.fieldValue}}</span>
		                </div>
		              </md-card-content>
		            </md-ripple>
		          </md-card>
		          </transition>
		          <div style="height: 0; width: 100%" id="bottomDiv" ></div>
		        </md-app-content>
		      </md-app>
		      <md-button class="md-icon-button md-accent md-raised md-des my-link my-link-up md-elevation-20" @click="goTop()">
		        <md-icon>arrow_upward</md-icon>
		      </md-button>
		      <md-button class="md-icon-button md-accent md-raised md-des my-link my-link-down md-elevation-20" @click="goBottom()">
		        <md-icon>arrow_downward</md-icon>
		      </md-button>
		    </md-card>
		</transition>`,
	data () {
		return {
			pageData: [],
			menuVisible: false,
			startAnimate: true,
			showContent: false,
			startPageAnimate: false,
			structureMap: [
				{
					id: 'basicInfo',
					name: '基本信息',
					iconSrc: 'assignment',
					index: 1,
					fieldArray: [
						{
							fieldName: 'serial',
							fieldLabel: '项目编号',
							fieldIndex: 1
						},
						{
							fieldName: 'name',
							fieldLabel: '项目名称',
							fieldIndex: 2
						}
					]
				},
				{
					id: 'testInfo',
					name: '检测信息',
					iconSrc: 'check_box',
					index: 2,
					fieldArray: [
						{
							fieldName: 'testMethod',
							fieldLabel: '检测方法',
							fieldIndex: 1
						},
						{
							fieldName: 'sampleRequirement',
							fieldLabel: '样本要求',
							fieldIndex: 2
						},
						{
							fieldName: 'sampleTransportCondition',
							fieldLabel: '样本运输条件',
							fieldIndex: 3
						},
						{
							fieldName: 'testCycle',
							fieldLabel: '检测周期(工作日)',
							fieldIndex: 4
						},
						{
							fieldName: 'laboratory',
							fieldLabel: '实验室',
							fieldIndex: 5
						}
					]
				},
				{
					id: 'priceInfo',
					name: '资费信息',
					iconSrc: 'attach_money',
					index: 3,
					fieldArray: [
						{
							fieldName: 'standardCharge',
							fieldLabel: '标准收费/人次',
							fieldIndex: 1
						},
						{
							fieldName: 'agentPrice',
							fieldLabel: '代理价',
							fieldIndex: 3
						}
					]
				},
				{
					id: 'otherInfo',
					name: '其它信息',
					iconSrc: 'more_horiz',
					index: 4,
					fieldArray: [
						{
							fieldName: 'testIndex',
							fieldLabel: '检测指标及临床意义',
							fieldIndex: 1
						}
					]
				}
			]
		}
	},
	methods: {
		initDetail () {
			var originalData = this.getOriginalData()
			var detailPage = this
			this.pageData = this.structureMap.sort(function (i1, i2) {
				return i1.index - i2.index
			}).map(function (info) {
				info.fieldArray.sort(function (f1, f2) {
					return f1.fieldIndex - f2.fieldIndex
				}).map(function (field) {
					// field.fieldValue = originalMedicalData[field.fieldName]
					detailPage.$set(field, 'fieldValue', originalData[field.fieldName])
					return field
				})
				return info
			})
		},
		getOriginalData () {
			var detailPage = this
			var data = Object.assign({}, this.detail)
			var tableName = data.tableName
			Object.keys(data).map(function (key) {
				var columnInfo = detailPage.$columnInfo.getColumn(tableName, key)
				if (columnInfo && columnInfo.dataType === 'dictionary') {
					data[key] = detailPage.$dictionary.getName(tableName, key, data[key])
				}
			})
			if (data.testCycleMin !== data.testCycleMax) {
				data.testCycle = `${data.testCycleMin}-${data.testCycleMax}`
			} else {
				data.testCycle = `${data.testCycleMin}`
			}
			return data
		},
		goBack () {
			this.startPageAnimate = false
		},
		goCard (id) {
			this.goComponent('#' + id)
			this.menuVisible = false
		},
		goTop () {
			this.goComponent('#topDiv')
		},
		goBottom () {
			this.goComponent('#bottomDiv')
		},
		goComponent (selector) {
			// 不把md-app-content的overflow-x:hidden去掉的话就滚不动，我也不知道为什么
			this.$el.querySelector('div.md-app-content').style = ''
			var component = this.$el.querySelector(selector)
			var app = this.$el.querySelector('div.md-app-scroller')
			if (component) Velocity(component, 'scroll', { container: (app || document.body), duration: 700 })
		},
		cardColorStyle (i) {
			return {
				backgroundColor: cardColorArr[i],
				color: '#fff'
			}
		},
		generateCardColor () {
			var len = cardColorArr.length
			for (var i = 0; i < len - 1; i++) {
				var index = parseInt(Math.random() * (len - i))
				var temp = cardColorArr[index]
				cardColorArr[index] = cardColorArr[len - i - 1]
				cardColorArr[len - i - 1] = temp
			}
		},

		// animate
		beforeLoad: function (el) {
			this.startAnimate = false
		},
		loaded: function (el) {
			this.showContent = true
			this.$nextTick(function() {
				this.startAnimate = true
			})
		},
		unloading: function (el) {
			this.showContent = false
		},
		unloaded: function (el) {
			this.$emit('update:detail', {})
//			this.$router.go(-1)
		},
		beforeEnter: function (el) {
			el.style.opacity = 0
		},
		enter: function (el, done) {
			var realHeight = el.offsetHeight
			el.style.width = '0%'
			el.style.height = '0px'

			var top = Math.round(Math.random() * 1000) - 500
			var left = Math.round(Math.random() * 1000) - 500
			Velocity(
				el,
				{ top: top, left: left },
				{ complete: done, duration: 0 }
			)
			Velocity(el,
				{ opacity: 1, height: realHeight, width: '100%', top: 'auto', left: 'auto', rotateY: [ 0, -700 ] },
				{ complete: done, duration: 2000 }
			)
			var app = this.$el.querySelector('div.md-app-scroller')
			if (app) {
				app.style.overflowX = 'hidden'
			}
		},
		leave: function (el, done) {
		}
	},
	props: {
		detail: {
			type: Object,
			default: function () {
				return {}
			}
		}
	},
	watch: {
		detail (val) {
			if (val.serial) {
				this.initDetail()
				this.generateCardColor()
				this.startPageAnimate = true
			}
		}
	},
	mounted () {
//		this.startAnimate = false
	}
})