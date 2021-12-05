import { NavBar } from 'antd-mobile'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './index.css'

function NavHeader({mt, children, onLeftClick}) {
  const navigate = new useNavigate()
  const back = () => {
    navigate('/home')
  }
  return (
    <NavBar className={mt ? 'mt': ''} onBack={onLeftClick || back}>{children}</NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  mt: PropTypes.bool,
  onLeftClick: PropTypes.func
}

export default NavHeader
