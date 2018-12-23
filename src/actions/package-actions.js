export const AddNewPackages = (packages) => {
    console.log("AddNewPackages : ")
    return (
        {
            type: "ADD_PACKAGES",
            packages: packages,
        }
    )
}

export const ResetPackages = () => {
    console.log("ResetPackages : ")
    return (
        {
            type: "RESET_PACKAGES"
        }
    )
}
