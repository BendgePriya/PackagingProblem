// Redux based action creators for adding packages to redux store
export const AddNewPackages = (packages) => {
    console.log("AddNewPackages : ")
    return (
        {
            type: "ADD_PACKAGES",
            packages: packages,
        }
    )
}

// Redux based action creators for reseting packages state to redux store
export const ResetPackages = () => {
    console.log("ResetPackages : ")
    return (
        {
            type: "RESET_PACKAGES"
        }
    )
}
