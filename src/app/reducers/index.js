import {
    combineReducers
} from 'redux'
import packagesReducer from './reducer-packages'

/******
 * @field: allReducers
 * @description: This variable will hold the state which is created by 
 *               combining multiple reducers in application
 */
const allReducers = combineReducers({
    packagesReducer: packagesReducer,
})
export default allReducers