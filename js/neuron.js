Neuron=function(props){
  this.inputs=[];
  this.outputs=[];
  //output displacement and default value
  this.base=0;
  for(var p in props){
    this[p]=props[p];
  }
}
Neuron.prototype.process=function(){
  var conclusion=this.base;
  for(var i in this.inputs){
    var thisAxon=this.inputs[i];
    if(thisAxon.isOverTresh()){
      conclusion+=thisAxon.outValue();
    }
  }
  for(var o in this.outputs){
    var thisAxon=this.outputs[o];
    thisAxon.value=conclusion;
  }
}
Neuron.prototype.axonTo=function(props){
  this.outputs.push(new Axon(props));
}
Axon=function(props){
  this.value=0;
  var me=this;
  this.outValue=function(){
    return me.value*me.factor;
  }
  this.isOverTresh=function(){
    return (Math.abs(me.value)>me.tresh);
  }
  this.tresh=1;
  this.factor=1;
  for(var p in props){
    this[p]=props[p];
  }
}
