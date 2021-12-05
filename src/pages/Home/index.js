import {TabBar} from 'antd-mobile';
import React from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { AppOutline, MessageOutline, UnorderedListOutline, UserOutline, } from 'antd-mobile-icons';
import './index.css';
import News from '../News'
import Index from '../Index'
import FindRoom from '../FindRoom'
import Me from '../Me'
const Bottom = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let { pathname } = location;
    if(pathname === '/home') pathname = '/home/';
    const setRouteActive = (value) => {
      navigate(value,{replace: true});
    };
    const tabs = [
        {
            key: '',
            title: '首页',
            icon: <AppOutline />,
        },
        {
            key: 'findroom',
            title: '找房',
            icon: <UnorderedListOutline />,
        },
        {
            key: 'news',
            title: '资讯',
            icon: <MessageOutline />,
        },
        {
            key: 'me',
            title: '我的',
            icon: <UserOutline />,
        },
    ];
    return (
      <TabBar activeKey={pathname} onChange={value => setRouteActive(value === '/home/' ? '/home' : value)}>
        {tabs.map(item => (<TabBar.Item key={'/home/' + item.key} icon={item.icon} title={item.title}/>))}
      </TabBar>);
};
export default class Home extends React.Component {
  render() {
    return (
      <div className='app'>
        <div className='body'>
          <Routes>
            <Route exact path='' element={<Index />}></Route>
            <Route exact path='/findroom' element={<FindRoom />}></Route>
            <Route exact path='/news' element={<News />}></Route>
            <Route exact path='/me' element={<Me />}></Route>
          </Routes>
        </div>
        <div className='bottom'>
          <Bottom />
        </div>
      </div>
    );
  }
};


