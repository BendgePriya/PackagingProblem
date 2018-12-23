import React from 'react'
import { List, ListItem, ListItemText, Checkbox, Button}from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Products } from '../TestData'
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
    return(
        <List>
            <ListItem>
                <Checkbox/>
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
  const displayItems = (root,checkedList,handleToggle) => {
    return (
        <List className={root}>
            {Products.map((obj,index)=>{
                return(
                    <ListItem key={index} onClick={handleToggle(index)}>
                        <Checkbox checked={checkedList.indexOf(index) !== -1}/>
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
 * step 1: First calculate "total price" and "total weight" of selected items
 * step 2: Sort selected Items array in descending order based on weight
 * step 3: calculate how many packages are needed by following formula :- 
 *              -   If total price is more than $250 then "total price"/250 
 *                  and take higher value instead of float
 *              -   else if total price is less than $250 then only 1 package 
 *                  is enough 
 * step 4: We will keep that many packages with initial item price capacity $250 
 *         and initial weight as 0
 * step 5: we need to define a threashold value for each package based on weight 
 *         so that we can equally distribute weight among different packages
 * step 6: we need to take each item from sorted array (descending order) and check if 
 *         we can put it in any of the package. for evaluatio we will check if 
 *         we add item in package then total price of package shouldn't go beyond $250 else
 *         we can check if next package has availablity.
 *         In case we found a package where we can insert an item we need to put additional check
 *         to verify if we add this new item it shouldn't croses threashold value of weight. 
 *         if it is crossing
 *         then we need to look for another package.
 *         During display of package details on UI we are evalauting package price based 
 *         on package weight (Please refer Packages.js)
 *         At the end of this algo we are going to have packages with required details 
 *         like weight, price, items, courier price 
 * 
******/
const handlePlaceOrder = (checkedList, props) => {
    props.ResetPackages()
    let totalPrice = 0
    let totalWeight = 0
    let selectedItems = []
    checkedList.forEach(val => {
        totalPrice  += parseFloat(Products[val].price)
        totalWeight += parseInt(Products[val].weight)
        selectedItems.push(Products[val])
    });
    selectedItems.sort((a,b)=>{return b.weight - a.weight}); 
    let packages = [];
    let howManyPackages = (totalPrice > 250) ? Math.ceil(totalPrice/250) : 1
    for(let i=0; i< howManyPackages; i++){
        packages.push({
            items: [],
            remainingPrice: 250,
            packageWeight: 0
        })
    }
    let threasholdWeight = Math.round(totalWeight/howManyPackages);
    threasholdWeight = parseInt(threasholdWeight) + Math.round(threasholdWeight/10)
    threasholdWeight = (threasholdWeight < selectedItems[0].weight ) ? 
                            selectedItems[0].weight  : threasholdWeight

    for(let index in selectedItems){
        for(let j = 0; j< packages.length; j++){
            if(parseInt(packages[j].remainingPrice) - parseInt(selectedItems[index].price) < 0 )
                continue;
            if(parseInt(packages[j].packageWeight)+ parseInt(selectedItems[index].weight) > 
                            threasholdWeight)
                continue;
            
            packages[j].items.push(selectedItems[index].name)
            packages[j].remainingPrice = parseInt(packages[j].remainingPrice) - 
                                            parseInt(selectedItems[index].price)
            packages[j].packageWeight = parseInt(packages[j].packageWeight) +  
                                            parseInt(selectedItems[index].weight)
            break;
        }
    }
    props.AddNewPackages(packages)
}

/**
 * @author: Priya Bendge
 * @class:  Items
 * @description: This class is going handle items in UI, and provide a way to proceed to checkout 
 *               by clicking on place order button
 */
class Items extends React.Component{
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
    render(){
        const { classes } = this.props;
        return(
            <div>
                {displayHeader()}
                {displayItems(classes.root, this.state.checked,this.handleToggle)}
                <Button variant="contained" color="secondary" 
                style={{marginTop:"5vh"}} 
                onClick={()=>handlePlaceOrder(this.state.checked, this.props)}>
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