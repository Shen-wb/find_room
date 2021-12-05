import jsonp from 'jsonp'
import axios from 'axios'

export const getCurrentCity = async () => {
  const localCity = JSON.parse(localStorage.getItem('current_city'))
  if(!localCity) {
    return new Promise((resolve, reject) => {
      jsonp('https://api.map.baidu.com/location/ip?ak=jtlKPjdSvNy8wsWidBnIpnDixAXvoXBD&coor=bd09ll',{}, async (_, data) => {
        try {
          const res = await axios.get(`/area/info?name=${data.content.address_detail.city}`)
          localStorage.setItem('current_city',JSON.stringify(res.data.body))
          resolve(res.data.body)
        } catch(e) {
          reject(e)
        }
      })
    })
  } else {
    return Promise.resolve(localCity)
  }
}