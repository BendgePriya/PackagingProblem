import React from 'react'
import {List, ListItem, ListItemText, Paper, Card, CardContent}from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

const getCourierPrice = (packageWeight) => {
    if(packageWeight >= 0 && packageWeight <= 200)
    return 5
    if(packageWeight > 200 && packageWeight <= 500)
    return 10
    if(packageWeight > 500 && packageWeight <= 1000)
    return 15
    if(packageWeight > 1000 && packageWeight <= 5000)
    return 20
}
const styles = theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      position: 'relative',
      overflow: 'auto',
      maxHeight: '60vh',
      maxWidth: '40vw',
      marginTop:"2vh"
    }
  });
const getResult = (root, packagesReducer) => {
    return packagesReducer.packages.map((obj, index)=> {
        return(
            <div  key={index}>
            <Card style={{marginTop:"2vh",marginLeft:"5vw",  backgroundColor:"#E0E0E0"}}>
                <CardContent>
                <List style={{alignContent:"left"}}>
                <ListItem> 
                    <ListItemText>Package {index+1}</ListItemText> 
                </ListItem>
                <ListItem> 
                    <ListItemText>Items-</ListItemText> 
                    <ListItemText>[ {
                        obj.items.map((item,index) => {return item + ', '})}
                    ]</ListItemText> 
                </ListItem>

                <ListItem> 
                    <ListItemText>Total Weight- </ListItemText> 
                    <ListItemText>{obj.packageWeight}g</ListItemText>
                </ListItem>

                <ListItem> 
                    <ListItemText>Total Price- </ListItemText> 
                    <ListItemText>${parseInt(250)-parseInt(obj.remainingPrice)}</ListItemText>
                </ListItem>

                <ListItem> 
                    <ListItemText>Courior Price- </ListItemText> 
                    <ListItemText>${getCourierPrice(obj.packageWeight)}</ListItemText>
                </ListItem>
            </List>
                </CardContent>
            </Card>
            </div>
        )
    })
}
class Packages extends React.Component{
    render(){
        const { classes } = this.props;
        return(
            <div>
                {getResult(classes.root, this.props.packagesReducer)}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        packagesReducer: state.packagesReducer,
    }
}  
  export default connect(mapStateToProps)(withStyles(styles)(Packages))
  