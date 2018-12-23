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
    threasholdWeight = (threasholdWeight < selectedItems[0].weight ) ? selectedItems[0].weight  : threasholdWeight

    for(let index in selectedItems){
        for(let j = 0; j< packages.length; j++){
            if(parseInt(packages[j].remainingPrice) - parseInt(selectedItems[index].price) < 0 )
                continue;
            if(parseInt(packages[j].packageWeight)+ parseInt(selectedItems[index].weight) > threasholdWeight)
                continue;
            
            packages[j].items.push(selectedItems[index].name)
            packages[j].remainingPrice = parseInt(packages[j].remainingPrice) - parseInt(selectedItems[index].price)
            packages[j].packageWeight = parseInt(packages[j].packageWeight) +  parseInt(selectedItems[index].weight)
            break;
        }
    }
    props.AddNewPackages(packages)
}

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

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
      AddNewPackages: AddNewPackages,
      ResetPackages: ResetPackages
    }, dispatch)
  }
  
  export default connect(null, matchDispatchToProps)(withStyles(styles)(Items))