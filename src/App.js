import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';
import {XYPlot, LineSeries, HorizontalGridLines,XAxis,YAxis} from 'react-vis';
//import { Simulate } from 'react-dom/test-utils';

import { makeStyles } from '@material-ui/core/styles';
import 'fontsource-roboto';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

//let N=10;
const series = ['Escalon','Exponencial','Triangular']; //Series definidas

//Serie Escalonada
function funcionEscalon(x){
  if(x >= -1/2 && x <= 1/2)
    return 1;
  else
    return 0;
}

function transformadaEscalon(w){
return (w == 0) ? 1 : (2*(Math.sin(1/2 * w))) / w;
}

function funcionExponencial(x){
  return (Math.pow(Math.E,-2*Math.abs(x)))
}

function transformadaExponencial(w){
return (4/(4+Math.pow(w,2)));
}

//Intocable
function funcionTriangular(x){
      if (x > -1 | x < 1)
        return 1 - Math.abs(x);
      else
        return 0;
}

function transformadaTriangular(w){
  return (w > -1 && w < 1) ? (2-(2*Math.cos(w)))+1 : (2-(2*Math.cos(w)) / Math.pow(w,2));
}

//Selecciona la serie de fourier
function switcherTransformada(seriesIndex,x){

  switch (seriesIndex) {
    case 0:
      return transformadaEscalon(x);
    case 1:
      return transformadaExponencial(x);
    case 2: 
      return transformadaTriangular(x);
    default:
      return transformadaExponencial(x);
  }
}

function switcherFuncion(seriesIndex,x){

  switch (seriesIndex) {
    case 0:
      return funcionEscalon(x);
    case 1:
      return funcionExponencial(x);
    case 2: 
      return funcionTriangular(x);
    default:
      return funcionExponencial(x);
  }
}

function getDataFunction(seriesIndex){
  return([...new Array(100)].map((row,index) => ({
    x: (index/2) - 50/2,
    y: switcherFuncion(seriesIndex,(index/2) - 50/2) 
  })));
}


function getDataTransformada(seriesIndex){
  return([...new Array(100)].map((row,index) => ({
    x: (index/2) - 50/2,
    y: switcherTransformada(seriesIndex,(index/2) - 50/2)
  })));
}


const useStyles = makeStyles({
  root: {
    width: 30,
  },
});

class App extends Component {
  state = {
    DataFunction: getDataFunction(0),
    DataTransformada: getDataTransformada(0),
    selectSerie: 0 //Usa este estado para cambiar de una serie a otra.
  };
  
  render() {

    const handleSwitcherChange = (event) => {
      this.setState({selectSerie: event.target.value});
      console.log(this.state.selectSerie)
       this.setState({DataFunction: getDataFunction(event.target.value)});
       this.setState({DataTransformada: getDataTransformada(event.target.value)});
    };

    return (
      <div className="App">
        
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <Typography variant="h3">
        Transformada de Fourier: {series[this.state.selectSerie]}
        </Typography>
        <center>
        <XYPlot height={300} width={1500} >
          <LineSeries data={this.state.DataTransformada} animation={'gentle'}/>
          <LineSeries data={this.state.DataFunction} animation={'gentle'}/>
          <HorizontalGridLines/>
          <XAxis title="X" style={{
            line: {stroke: '#ADDDE1'},
            ticks: {stroke: '#ADDDE1'},
            text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600, fontSize: 10}
            }}/>
            <YAxis title="Y" style={{
            line: {stroke: '#ADDDE1'},
            ticks: {stroke: '#ADDDE1'},
            text: {stroke: 'none', fill: '#6b6b76', fontWeight: 600, fontSize: 10}
            }}/> 
        </XYPlot>
        </center>
        </Grid>
        <Grid
          xs={12}
          item
          direction="column"
          justify="space-around"
          alignItems="center"
        >     
        <Select labelId="label" 
        id="select"
        onChange={handleSwitcherChange} value={this.state.selectSerie}>
          <MenuItem value={0} >Serie Escalon</MenuItem>
          <MenuItem value={1}>Serie Exponencial</MenuItem>
          <MenuItem value={2}>Serie Triangular</MenuItem>
        </Select>
        </Grid>
      </Grid>
      </div>
    );
  }
}

export default App;
