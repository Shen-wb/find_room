import React, { Component } from 'react'
import { Swiper } from 'antd-mobile'
import '../../assets/iconfont/iconfont.css'
import styles from './index.module.css'
import './index.css'
import autor from '../../assets/images/nav-1.png'

const BMapGL = window.BMapGL
export default class Detail extends Component {
  state = {
    swiperImg: [],
    detailData: {},
    tags: [],
    visible: false,
  }

  componentDidMount() {
    this.getDetailData()
  }

  initmap = () => {
    this.map = new BMapGL.Map("mapContainer")
    const latitude = this.state.detailData.coord.latitude
    const longitude = this.state.detailData.coord.longitude
    var point = new BMapGL.Point(longitude,latitude)
    this.map.centerAndZoom(point, 17);
    this.createMulch(longitude,latitude)
  }

  createMulch = (longitude,latitude) => {
    var label = new BMapGL.Label("", {
      position: new BMapGL.Point(longitude,latitude),
      offset: new BMapGL.Size(-20, -28)
    })
    label.setContent(`
      <div class=${styles.mulch}>
        <span class=${styles.housename}>${this.state.detailData.community}</span>
        <i class=${styles.arrow}></i>
      </div>
    `)                      
    label.setStyle({
      color: '#fff',
      fontSize: '12px',
      padding: "0px",
      border: '0px solid rgb(255,0,0)',
      textAlign: 'center',
    })
    this.map.addOverlay(label)
  }

  getDetailData = () => {
    this.setState({detailData: this.props.detailData, 
      swiperImg:this.props.detailData.houseImg, 
      tags: this.props.detailData.tags},this.initmap)
  }

  render() {
    const items = this.state.swiperImg.map((item,index) => (
      <Swiper.Item key={index}>
        <div className={styles.detailSwiper} style={{ backgroundImage: `url(http://localhost:8080${item})`}}></div>
      </Swiper.Item>
    ))
    const {title, price, roomType, size, oriented, floor, community, supporting } = this.state.detailData
    return (
      <div className={styles.container}>
        <Swiper autoplay>{items}</Swiper>
        <div className={styles.headerBtns}>
          <div className={styles.leftBtn} onClick={this.props.closeDetail}></div>
          <span>{community}</span>
          <i className='iconfont icon-fenxiang share'></i>
        </div>
        {/* 房屋详情 */}
        <div className={styles.desc}>
          <div className={styles.titleContent}>
            <div className={styles.title}>{title}</div>
            <div className={styles.tags}>
              {
                this.state.tags.map(tag => {
                  return <div className={styles.tag} key={tag}>{tag}</div>  
                })  
              }
            </div>
          </div>
          <div className={styles.introduce}>
            <div className={styles.intrInfo}>
              <div className={styles.price}>{price}<span>/月</span></div>
              <div>租金</div>
            </div>
            <div className={styles.intrInfo}>
              <div className={styles.roomType}>{roomType}</div>
              <div>房型</div>
            </div>
            <div className={styles.intrInfo}>
              <div className={styles.size}>{size}平米</div>
              <div>面积</div>
            </div>
          </div>
          <div className={styles.houseInfo}>
            <div>装修：<span>精装</span></div>
            <div>朝向：<span>{oriented}</span></div>
            <div>楼层：<span>{floor}</span></div>
            <div>类型：<span>普通住宅</span></div>
          </div>
        </div>
        {/* 房屋位置 */}
        <div className={styles.loca}>
          <div className={styles.community}>小区：{community}</div>
          <div id="mapContainer" style={{height: "200px"}}></div>
          <div className={styles.supportTitle}>房屋配套</div>
          <div className={styles.supporting}>{supporting === [] ? supporting.join(',') : '暂无数据'}</div>
        </div>
        {/* 房屋概况 */}
        <div className={styles.situation}>
          <div className={styles.situationTitle}>房屋概况</div>
          <div className={styles.content}>
            <div className={styles.header}>
              <img src={autor} alt="autor"/>
              <div className={styles.name}>
                <div>沈先生</div>
                <div><i className='iconfont icon-shimingrenzheng'></i>已认证房主</div>
              </div>
              <button className={styles.sendMsgBtn}>发消息</button>
            </div>
            <p>【交通出行】是第几哦技术都i发技术都就打死哦发集散地哦分集散地哦是滴哦是第几哦是滴哦的设计哦是滴哦的设计哦打死哦是滴哦技术都i集散地哦大祭司哦见风使舵考虑就少得可怜就少得可怜圣诞节快乐圣诞节快乐就少得可怜就少得可怜就少得可怜圣诞节快乐撒旦记录卡撒旦记录卡撒旦克里夫就少得可怜见风使舵考虑即使对方考虑加快了顺丰到付克里斯蒂金克拉撒旦就少得可怜就少得可怜离开就可怜离开</p>
          </div>
        </div>
        {/* 猜你喜欢 */}
        <div className={styles.like}>
          <div className={styles.likeTitle}>猜你喜欢</div>
          <div>猜你喜欢内容</div>
        </div>
      </div> 
    )
  }
}
