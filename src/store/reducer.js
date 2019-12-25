import { combineReducers } from 'redux'
import common from './common'
import auth from './auth'
import messages from './messages'
import orders from './orders'

export default combineReducers({
  common, auth, messages, orders
})