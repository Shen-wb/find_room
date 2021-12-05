import React, { Component } from 'react'
import { Navigate } from 'react-router-dom'
import { Toast  } from 'antd-mobile'
import {getCurrentCity} from '../../utils/getCurrentCity.js'
import {List, AutoSizer} from 'react-virtualized'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'
import './index.css'

const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0,
      cityInfo: null,
    }
    this.citylistCom = React.createRef()
  }

  async componentDidMount() {
    await this.getCityListData()
    this.citylistCom.current.measureAllRows()
  }

  getCityListData = async () => {
    const data = await axios.get(`/area/city?level=1`)
    const {cityList, cityIndex} = this.formatCityData(data.data.body)
    const hotData = await axios.get('/area/hot')
    cityList['hot'] = hotData.data.body
    cityIndex.unshift('hot')
    const currentCity = await getCurrentCity()
    cityList['#'] = [currentCity]
    cityIndex.unshift('#')
    this.setState({cityList, cityIndex})
  }
  
  formatCityData = (list) => {
    let cityList = {}
    let cityIndex = []
    list.forEach((item) => {
      const firstChar = item.short.substr(0,1)
      if(cityList[firstChar]) {
        cityList[firstChar].push(item)
      } else {
        cityList[firstChar] = [item]
      }
    })
    cityIndex = Object.keys(cityList).sort()
    return {cityList,cityIndex}
  }

  rowRenderer = ({
    key, // 键
    index, //每一行的索引值
    isScrolling, // 当前项是否在滚动中
    isVisible, // 当前项在List中是可见的
    style, // *样式属性，指定每一行的位置
  }) => {
    const {cityIndex, cityList} = this.state
    const letter = cityIndex[index]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{this.formatCityIndex(letter)}</div>
        {
          cityList[letter].map(item => <div className="name" onClick={()=>{this.switchCity(item)}}key={item.value}>{item.label}</div>)
        }
      </div>
    );
  }

  switchCity = async ({label, value}) => {
    if(HOUSE_CITY.indexOf(label) > -1) {
      localStorage.setItem('current_city', JSON.stringify({label, value}))
      this.setState({ cityInfo: label })
    } else {
      Toast.show({
        content: `暂无${label}的房源数据`,
        duration: 1000
      })
    }
  }

  formatCityIndex = (letter) => {
    switch (letter) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return letter.toUpperCase()
    }
  }

  getRowHeight = ({ index: number }) => {
    const { cityList, cityIndex } = this.state
    return 36 + cityList[cityIndex[number]].length * 50
  }

  renderCityIndex = () => {
    return this.state.cityIndex.map((item, index) => (
      <li className="city-index-item" key={item} onClick={()=>{this.toIndex(index)}}>
        <span className={this.state.activeIndex === index ? 'index-active': ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
      </li>
      )
    )
  }

  toIndex = (index) => {
    this.citylistCom.current.scrollToRow(index)
  }

  onRowsRendered = ({startIndex}) => {
    if(startIndex !== this.state.activeIndex) {
      this.setState({activeIndex: startIndex})
    }
  }

  render() {
    return (
      <div className="citylist">
        {this.state.cityInfo && (
          <Navigate to='/home' replace='true' />
        )}
        <NavHeader mt>城市选择</NavHeader>
        <AutoSizer>
          {({height, width}) => (
            <List
              ref={this.citylistCom}
              height={height}
              width={width}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              onRowsRendered={this.onRowsRendered}
              scrollToAlignment="start"
            />
          )}
        </AutoSizer>
        <ul className="city-index">
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
}