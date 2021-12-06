import React, { Component } from 'react'
import { Swiper } from 'antd-mobile'
import { Link, useNavigate } from 'react-router-dom';
import {getCurrentCity} from '../../utils/getCurrentCity.js'
import './index.css'
import axios from 'axios'
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'
import icon from '../../assets/fonticon/定位.svg'

const CityList = (e) => { 
  const navigate = new useNavigate()
  return (
    <div className="search">
      <div className="select" onClick={()=>{navigate('/citylist')}}>{e.currentCity}</div>
      <div className="input" type="text" onClick={()=>{navigate('/search')}}>请输入小区或地址</div>
      <div className="iconArea"><img className="icon" src={icon} alt="icon" onClick={()=>{navigate('/map')}}/></div>
    </div>
  )
}

export default class Index extends Component {
  state = {
    swiperImg: [],
    groups: [],
    news: [],
    currentCity: '杭州'
  }

  componentDidMount() {
    this.getSwiperData()
    this.getGroups()
    this.getNews()
    this.getPosition()
  }

  getPosition = async () => {
    const res = await getCurrentCity()
    this.setState({currentCity: res.label})
  }

  getSwiperData = async () => {
    const data = await axios.get('/home/swiper')
    this.setState({swiperImg: data.data.body})
  }

  getGroups = async () => {
    const data = await axios.get('/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    const groupsTree = this.createGroups(data.data.body)
    this.setState({groups: groupsTree})
  }

  getNews = async () => {
    const data = await axios.get('/home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    const newsTree = this.cteateNews(data.data.body)
    this.setState({news: newsTree})
  }

  createGroups = (menuList) => {
    return menuList.map(item => {
      return (
        <div key={item.id}>
          <h4>{item.title}</h4>
          <span>{item.desc}</span>
          <img src={`http://localhost:8080${item.imgSrc}`} alt="img" />
        </div>
      )
    })
  }

  cteateNews = (menuList) => {
    return menuList.map(item => {
      return (
        <div className="newItem" key={item.id}>
          <img src={`http://localhost:8080${item.imgSrc}`} alt="img" />
          <div className="right">
            <h3>{item.title}</h3>
            <div className="footer">
              <span>{item.from}</span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    const items = this.state.swiperImg.map((item) => (
      <Swiper.Item key={item.id}>
        <div className='content' style={{ backgroundImage: `url(http://localhost:8080${item.imgSrc})`}}></div>
      </Swiper.Item>
    ))
    return (
      <div className="index-container">
        {/* 轮播图 */}
        <div className="swiper">
          <Swiper autoplay>{items}</Swiper>
          <CityList currentCity={this.state.currentCity}></CityList>
        </div>
        {/* 导航 */}
        <nav>
          <ul>
            <Link to="/home/findroom">
              <li>
                <img src={Nav1} alt="nav-1"/>
                <span>整租</span>
              </li>
            </Link>
            <Link  to="/home/findroom">
              <li>
                <img src={Nav2} alt="nav-2"/>
                <span>合租</span>
              </li>
            </Link>
            <Link  to="/map">
              <li>
                <img src={Nav3} alt="nav-3"/>
                <span>地图找房</span>
              </li>
            </Link>
            <Link  to="/rent">
              <li>
                <img src={Nav4} alt="nav-4"/>
                <span>去出租</span>
              </li>
            </Link>
          </ul>
        </nav>
        {/* 租房小组 */}
        <div className="groups">
          <div className="header">
            <h3>租房小组</h3>
            <span>更多</span>
          </div>
          <div className="main">
            {this.state.groups}
          </div>
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3>最新资讯</h3>
          <div className="newMain">
            {this.state.news}
          </div>
        </div>
      </div>
    )
  }
}
