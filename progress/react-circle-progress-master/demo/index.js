'use strict'
import React,{Component} from 'react'
import {render} from 'react-dom'
import Circle from '../src/circle'

const styles = {
  container:{
    width: "100%",
    position: "relative",
    margin: "0 auto",
    height: "100%",
    overflow: "hidden",
    display: "-webkit-box",
    display: "-webkit-flex",
    display: "flex",
    WebkitBoxDirection: "normal",
    WebkitBoxOrient: "vertical",
    WebkitFlexDirection: "column",
    flexDirection: "column",
    /*定义子元素主轴对齐*/
    WebkitBoxPack: "center",
    WebkitJustifyContent: "center",
    justifyContent: "center",
    /*定义子元素交叉轴对齐*/
    WebkitBoxAlign: "center",
    AlignItems: "center",
    WebkitAlignItems: "center",
      marginBottom: '80px'
    // paddingTop:"200px",
  },
  button:{
    padding:"10px 20px",
    border:'1px solid #ddd',
    marginTop:"20px",
    cursor: "pointer",
  }
}
class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      current: 0
    }
    this._handleButton = this._handleButton.bind(this)
    this._handleClear = this._handleClear.bind(this)
    this._handleAll = this._handleAll.bind(this)
  }
  _handleButton(){
    let {current} = this.state
    current += 0.05
    this.setState({current})
  }
  _handleClear(){
    let current = 0
    this.setState({current})
  }
  _handleAll(){
    let current = 1
    this.setState({current})
  }
  render() {
    return (
			<div style={styles.container}>
        <Circle
            size = {80}
            current = {this.state.current}
            startPoint = {0}
            strokeWidth={8}
            bottomColor='#eee'
            bottomFillColor="rgb(242, 255, 239)"
            gradientDirection = {"horizontal"/*horizontal*/}
            showText = {true}
            text = '出借'
            textStyle = {{size:14,color:"#3eb28d",type:2}}
            linecap = {"round"}
            gradient = {
            [
              {offset:0,color:"#FEAC00",opacity:1},
              {offset:100,color:"#9ED110",opacity:1},
            ]
          }
        />
        <div style={styles.button} onClick={this._handleButton}>递增5%</div>
        <div style={styles.button} onClick={this._handleAll}>全满</div>
        <div style={styles.button} onClick={this._handleClear}>清零</div>
      </div>
		)
  }
}
window.onload = function(){
	render(<App />,document.getElementById('main'))
}
