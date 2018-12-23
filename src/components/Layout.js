import React from 'react'
import Header from './Header'
import Items from './Items'
import Packages from './Packages'

/**
 * @author: Priya Bendge
 * @class:  Layout
 * @description: This class is going Layout our components on UI as a single page.
 */
export default class Layout extends React.Component{
    render(){
        return(
            <div>
                <Header></Header>
                <div style={{float: "left", width: '60vw'}}>
                <Items></Items>
                </div >
                <div style={{maxHeight: "80vh", maxWidth: "40vw", overflow: "auto", float: "left"}}>
                <Packages></Packages>
                </div>
            </div> 
        )
    }
}
