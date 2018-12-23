import { combineReducers } from 'redux'

import packagesReducer from './reducer-packages'

const allReducers = combineReducers(
    {
        packagesReducer: packagesReducer,
    }
)
export default allReducers