import React, { Component } from 'react'
import { Popup, Toast, Button } from 'antd-mobile'
import {Link} from 'react-router-dom'
import axios from 'axios'
import NavHeader from '../../components/NavHeader'
import './index.css'

const BMapGL = window.BMapGL
export default class findMap extends Component {
  state = {
    visible: false,
    houseList: '',
    isDisabled: true,
    preAreaId: '',
    prePoint: {},
    flag: true,
    currentLevel: 0
  }

  componentDidMount() {
    this.initMap()
  }

  initMap = () => {
    this.map = new BMapGL.Map("container")
    const {label, value} = JSON.parse(localStorage.getItem('current_city'))
    this.myGeo = new BMapGL.Geocoder()
    this.myGeo.getPoint(label, (point) => {
      if(point) {
        this.setState({preAreaId: value, prePoint: point})
        this.map.centerAndZoom(point, 11)
        this.map.enableScrollWheelZoom(true)
        this.map.addControl(new BMapGL.ScaleControl())
        this.map.addControl(new BMapGL.ZoomControl())
        this.renderOverLays(value)
      } else {
        alert('您选择的地址没有解析到结果！')
      }
    }, label)
    this.map.addEventListener('movestart', () => {
      if(this.state.visible) this.setState({visible: false})
    })
    this.map.addEventListener('click', (e) => {
      const classList = ['rect', 'housename', 'housenum']
      if(this.state.visible && classList.indexOf(e.target.className) === -1) {
        this.setState({visible: false})
      }
    })
  }

  renderOverLays = async (id) => {
    try {
      Toast.show({icon: 'loading', content: '数据加载中...'})
      const data = await axios.get(`/area/map?id=${id}`)
      Toast.clear()
      const res = data.data.body
      const {nextzoom, type} = this.getTypeAndZoom()
      res.forEach(item => {
        this.createOverLays(item, nextzoom, type) 
      })
    } catch(e) {
      Toast.clear()
      alert(e.message)
    }
  }

  getTypeAndZoom = () => {
    const zoom = this.map.getZoom()
    let nextzoom, type
    if(zoom >= 10 && zoom <= 12) {
      nextzoom = 13
      type = 'circle'
    } else if(zoom >= 12 && zoom <= 14) {
      nextzoom = 15
      type = 'circle'
    } else if(zoom >= 14 && zoom <= 16) {
      type = 'rect'
    }
    return {nextzoom, type}
  }

  createOverLays = (item, nextzoom, type) => {
    const {coord: {longitude, latitude}} = item
    const areaPoint = new BMapGL.Point(longitude, latitude)
    if(type === 'circle') {
      this.createCircle(item, nextzoom, areaPoint)
    } else {
      this.createRect(item, areaPoint)
    }
  }

  createCircle = (item, nextzoom, areaPoint) => {
    var label = new BMapGL.Label("", {
      position: areaPoint,
      offset: new BMapGL.Size(-35, -35)
    })
    label.id = item.value
    label.setContent(`
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
    `)                      
    label.setStyle({
      color: '#fff',
      fontSize: '12px',
      padding: "0px",
      border: '0px solid rgb(255,0,0)',
      textAlign: 'center',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    })
    label.addEventListener('click', ()=>{
      this.labelOnClickEvent(nextzoom, item, areaPoint)
    })
    this.map.addOverlay(label)   
  }

  createPreCircle = (item, zoom) => {
    const {coord: {longitude, latitude}} = item
    const areaPoint = new BMapGL.Point(longitude, latitude)
    var label = new BMapGL.Label("", {
      position: areaPoint,
      offset: new BMapGL.Size(-35, -35)
    })
    label.id = item.value
    label.setContent(`
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
    `)                      
    label.setStyle({
      color: '#fff',
      fontSize: '12px',
      padding: "0px",
      border: '0px solid rgb(255,0,0)',
      textAlign: 'center',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    })
    label.addEventListener('click', ()=>{
      this.labelOnClickEvent(zoom+2, item, areaPoint)
    })
    this.map.addOverlay(label)   
  }

  labelOnClickEvent = (zoom, item, areaPoint) => {
    if(zoom !== 11) { this.setState({isDisabled: false}) }
    if(this.state.flag === true) {
      this.setState({preAreaId: item.value, prePoint: areaPoint, flag: false})
    }
    this.map.centerAndZoom(areaPoint, zoom)
    this.map.clearOverlays()
    this.renderOverLays(item.value)
    let level = this.state.currentLevel
    this.setState({currentLevel:++level})
  }

  createRect = (item, areaPoint) => {
    var label = new BMapGL.Label("", {
      position: areaPoint,
      offset: new BMapGL.Size(-50, -28)
    })
    label.id = item.value
    label.setContent(`
      <div class="rect">
        <span class="housename">${item.label}</span>
        <span class="housenum">${item.count}套</span>
        <i class="arrow"></i>
      </div>
    `)                      
    label.setStyle({
      color: '#fff',
      fontSize: '12px',
      padding: "0px",
      border: '0px solid rgb(255,0,0)',
      textAlign: 'center',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    })
    label.addEventListener('click', ()=>{
      this.map.centerAndZoom(areaPoint)
      this.getHouseData(item.value)
      this.setState({visible: true})
    })
    this.map.addOverlay(label)
  }

  getHouseData = async (id) => {
    try {
      Toast.show({icon: 'loading', content: '数据加载中...'})
      const data = await axios.get(`/houses?cityId=${id}`)
      Toast.clear()
      const houseList = this.renderHouseList(data.data.body.list)
      this.setState({houseList})
    } catch (e) {
      Toast.clear()
      alert(e.message)
    }
  }

  renderHouseList = (list) => {
    return list.map(item => {
      return (
        <div className="house" key={item.houseCode}>
          <img className="imgWrap" src={`http://localhost:8080${item.houseImg}`} alt="图片"></img>
          <div className="houseContent">
            <div className="title">{item.title}</div>
            <div className="desc">{item.desc}</div>
            <div className="tags">
              {
                item.tags.map(tag => {
                  return <div className="tag" key={tag}>{tag}</div>  
                })
              }
            </div>
            <div className="price"><span className="priceNum">{item.price}</span>元/月</div>
          </div>
        </div>
      )
    })
  }

  getPreData = async (zoom) => {
    Toast.show({icon: 'loading', content: '数据加载中...'})
    const data = await axios.get(`/area/map?id=${this.state.preAreaId}`)
    this.map.centerAndZoom(this.state.prePoint, zoom)
    this.map.clearOverlays()
    data.data.body.forEach(item=>{ 
      this.createPreCircle(item, zoom)
    })
    Toast.clear()
  }

  goPreLevel = async () => {
    let level = this.state.currentLevel
    this.setState({currentLevel:--level})
    if(this.state.currentLevel === 1) {
      const {label, value} = JSON.parse(localStorage.getItem('current_city'))
      this.myGeo.getPoint(label, async (point) => {
        if(point) {
          this.setState({preAreaId: value, prePoint: point, isDisabled: true, flag: true}, async ()=>{
            this.getPreData(11)
          })
        }}, label)
    } else {
      this.getPreData(13)
    }
  }

  render() {
    return (
      <div className="app">
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
        <Button disabled={this.state.isDisabled} size="mini" onClick={()=>{this.goPreLevel()}}>返回上一级</Button>
        <Popup visible={this.state.visible} bodyStyle={{ height: '50vh' }} maskStyle={{display: 'none'}}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <Link className="titleMore" to="/home/findroom">更多房源</Link>
          </div>
          <div className="houseItem">
            {this.state.houseList}
          </div>
        </Popup>
      </div>
    )
  }
}