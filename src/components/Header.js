import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

/**
 * Header class is the abstraction where I am separting out the logic 
 * and we can perform many operations here like adding logo, display random themes etc.
 */
export default class Header extends React.Component {
    render(){
        return(
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                    <Typography variant="h6" color="inherit">
                        MSP HITECH (M) SDN BHD
                    </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
