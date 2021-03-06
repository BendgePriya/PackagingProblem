import React from 'react'
import { List, ListItem, ListItemText, Checkbox, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Products } from '../constants/TestData'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AddNewPackages, ResetPackages } from './../actions/package-actions'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: '60vh',
    }
});

/******
 * @method: displayHeader
 * @description: This method is going to display Header in UI.
 */
const displayHeader = () => {
    return (
        <List>
            <ListItem>
                <Checkbox />
                <ListItemText><b>Name</b></ListItemText>
                <ListItemText><b>Price($)</b></ListItemText>
                <ListItemText><b>Weight(g)</b></ListItemText>
            </ListItem>
        </List>
    )
}

/******
 * @method: displayItems
 * @param: root,checkedList,handleToggle
 * @description: This method is going to display items in UI. 
 *              It will read JSON array and create a LIST
 */
const displayItems = (root, checkedList, handleToggle) => {
    return (
        <List className={root}>
            {Products.map((obj, index) => {
                return (
                    <ListItem key={index} onClick={handleToggle(index)}>
                        <Checkbox checked={checkedList.indexOf(index) !== -1} />
                        <ListItemText>{obj.name}</ListItemText>
                        <ListItemText>{obj.price}</ListItemText>
                        <ListItemText>{obj.weight}</ListItemText>
                    </ListItem>
                )
            })}
        </List>
    )
}

/******
 * @method: handlePlaceOrder
 * @param: checkedList, props
 * @description: For calculating packages we will follow this algorithm - 
 * step 1: Sort selected Items array in descending order based on weight*price 
 * step 2: calculate how many packages are needed by following formula :- 
 *              -   If total price is more than $250 then "total price"/250 
 *                  and take higher value instead of float
 *              -   else if total price is less than $250 then only 1 package 
 *                  is enough 
 * step 3: We will keep that many packages with initial item price capacity $250 
 *         and initial weight as 0
 * step 6: we need to take each item from sorted array (descending order) and check
 *         in how many packages this item can be fitted based on remaining price capacity
 *         From that available packages we need to find minimum weight's package and put 
 *         this item into that package
******/
const handlePlaceOrder = (checkedList, props) => {
    props.ResetPackages()

    let totalPrice = 0
    let selectedItems = []

    checkedList.forEach(val => {
        totalPrice += parseFloat(Products[val].price)
        selectedItems.push(Products[val])
    });

    selectedItems.sort((a, b) => {
        if (b.weight * b.price === a.weight * a.price) {
            return b.price - a.price
        }
        return b.weight * b.price - a.weight * a.price
    })

    let packages = [];
    let howManyPackages = (totalPrice > 250) ? Math.ceil(totalPrice / 250) : 1
    for (let i = 0; i < howManyPackages; i++) {
        packages.push({
            items: [],
            remainingPrice: 250,
            packageWeight: 0
        })
    }

    for (let index in selectedItems) {
        let tempPackages = [...packages]
        tempPackages = findPackagesWithCapacity(tempPackages, selectedItems[index].price);
        let bestFitIndex = findMinWeightPackage(tempPackages)

        packages[bestFitIndex].items.push(selectedItems[index].name)
        packages[bestFitIndex].remainingPrice = parseInt(packages[bestFitIndex].remainingPrice) -
            parseInt(selectedItems[index].price)
        packages[bestFitIndex].packageWeight = parseInt(packages[bestFitIndex].packageWeight) +
            parseInt(selectedItems[index].weight)
    }
    props.AddNewPackages(packages)
}

/**
 * @method: findPackagesWithCapacity
 * @param:  packages, price 
 * @description: this method will return all packages where we can put subject item
 */
const findPackagesWithCapacity = (packages, price) => {
    let availablePackages = [];
    packages.map((obj, index) => {
        if (parseInt(obj.remainingPrice) - parseInt(price) >= 0) {
            availablePackages.push({ ...obj, "isAvailable": true })
        } else {
            availablePackages.push({ ...obj, "isAvailable": false })
        }
    })
    return availablePackages;
}

/**
 * @method: findMinWeightPackage
 * @param:  availablePackages
 * @description: this method will return index of package whose weight is minimum among all
 */
const findMinWeightPackage = (availablePackages) => {
    let minWeight = availablePackages[0].packageWeight;
    let index = 0;
    for (let i = 1; i < availablePackages.length; i++) {
        if (availablePackages[i].isAvailable === true &&
            availablePackages[i].packageWeight < minWeight) {
            minWeight = availablePackages[i].packageWeight;
            index = i;
        }
    }
    return index;
}

/**
 * @author: Priya Bendge
 * @class:  Items
 * @description: This class is going handle items in UI, and provide a way to proceed to checkout 
 *               by clicking on place order button
 */
class Items extends React.Component {
    state = {
        checked: [],
    };

    handleToggle = index => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(index);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(index);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };
    render() {
        const { classes } = this.props;
        return (
            <div>
                {displayHeader()}
                {displayItems(classes.root, this.state.checked, this.handleToggle)}
                <Button variant="contained" color="secondary"
                    style={{ marginTop: "5vh" }}
                    onClick={() => handlePlaceOrder(this.state.checked, this.props)}>
                    Place order
                </Button>
            </div>
        )
    }
}

/**
 * @method: matchDispatchToProps
 * @param {*} dispatch 
 * @description: this method is going to bind action creators with functions so that 
 *              Once these functions are being called it is going to invoke reducers
 */
const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        AddNewPackages: AddNewPackages,
        ResetPackages: ResetPackages
    }, dispatch)
}

export default connect(null, matchDispatchToProps)(withStyles(styles)(Items))