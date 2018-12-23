const initialState = {
    packages: []
}

/******
 * @field: packagesReducer
 * @description: this function is a redux reducer function which is going to 
 *               update internal state
 */
export default function packagesReducer(state = initialState, action = {}) {
    switch (action.type) {
        case "ADD_PACKAGES": {
            const packages = [...state.packages, ...action.packages]
            const newState = {
                ...state,
                packages: packages
            }
            return newState
        }
        case "RESET_PACKAGES": {
            return initialState
        }
        default:
            return state
    }
}