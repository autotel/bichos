
//reposition=fuinction
//Bug.prototepy.reposton=repisition
Bug=function(properties){
  this.alive=true;
  this.onFood=0;
  this.properties=properties||{
    size:10,
    limbs:[
      {
        size:5,
        leng:10,
        angl:1.5
        //angle from-to range?
      },
      {
        size:6,
        leng:20,
        angl:0
      }
    ]
  }
  this.brain=[
    new Neuron()
  ];
  //connect this object's vars to axons. data binding is on sense function
  this.sensorAxons={
    onFood:new Axon({tresh:0,factor:-0.02}),
    food:new Axon({tresh:0,factor:0.002})
  }
  this.actuatorAxons={
    setSpeed:new Axon({tresh:0}),
    turn:new Axon({tresh:1.3})
  }
  //connect sensors and actuators to the mononeuronal brain
  this.brain[0].inputs.push(this.sensorAxons.onFood);
  this.brain[0].inputs.push(this.sensorAxons.food);
  this.brain[0].outputs.push(this.actuatorAxons.setSpeed);
  this.brain[0].outputs.push(this.actuatorAxons.turn);

  var pi=Math.PI;
  this.surface=this.properties.size*this.properties.size*pi;
  console.log(this.surface);
  this.angl=Math.random()*pi;
  this.food=0;
  this.sprite=new Two.Group();
  this.speed=1;
  this.limbs=[];
  for(var l in this.properties.limbs){
    var props=this.properties.limbs[l];
    this.limbs[l]=new Limb(props);
    this.limbs[l].sprite.rotation=props.angl;
    this.sprite.add(this.limbs[l].sprite);
    this.surface+=props.size*props.size*pi;
  }
  this.body=new Body(this.properties.size);
  this.radius=this.properties.size;
  this.sprite.add(this.body.sprite);
  two.add(this.sprite);
  canvas.bind(this);
  // this.pos=this.sprite.translation;
  bugs.push(this);
};
Bug.prototype.pos=function(){
  return this.sprite.translation;
}
Bug.prototype.accelerate=function(val){
  this.speed+=val;
}
Bug.prototype.setSpeed=function(val){
  this.speed=val;
}
Bug.prototype.turn=function(val){
  this.angl+=val;
}
Bug.prototype.mythose=function(val){
  var newbug=new Bug(this.properties);
  newbug.food=this.food*val;
  this.food-=this.food*val;
}
Bug.prototype.sense=function(){
  for(var sensor in this.sensorAxons){
    if(this.hasOwnProperty(sensor)){
      var thisSense=this.sensorAxons[sensor];
      thisSense.value=this[sensor];
    }else{
      console.log("sensor axon '"+sensor+"' has no variable to sense");
    }
  }
}
Bug.prototype.act=function(){
  for(var nerve in this.actuatorAxons){
    //maybe these should be in the axon definition and not spread everywhere...
    var thisNerve=this.actuatorAxons[nerve];
    if(thisNerve.isOverTresh()){
      console.log("nerve "+thisNerve.outValue());
      if(this.hasOwnProperty(nerve)){
        this[nerve]=thisNerve.outValue();
      }else if(typeof this[nerve]=='function'){
        this[nerve](thisNerve.outValue());
      }else{
        console.log("actuator axon '"+nerve+"' has no variable to actuate over");
      }
    }
  }
}
Bug.prototype.frame=function(){
  if(this.alive){
    this.sense();
    this.act();
    for(var n in this.brain){
      var thisNeuron=this.brain[n];
      thisNeuron.process();
    }
    var rot=this.sprite.rotation;
    var pos=this.sprite.translation;
    // console.log(pos);
    this.sprite.translation=new Two.Vector((pos.x+Math.cos(rot)*this.speed)%canvas.w,(pos.y+Math.sin(rot)*this.speed)%canvas.h);
    this.food-=Math.abs(this.speed);
    // console.log(this.surface);
    // this.sprite.scale=(this.food)/(this.surface);
    this.sprite.rotation=this.angl;
    if(this.food<1){
      this.die();
    }
  }
}
Bug.prototype.reposition=function(vec){
  if(vec.hasOwnProperty("x")&&vec.hasOwnProperty("y")){
    this.sprite.translation=new Two.Vector(vec.x,vec.y);
  }
  if(vec.a)
  this.sprite.rotation=vec.a;
}
Bug.prototype.die=function(){
  this.alive=false;
  two.remove(this.sprite);
  console.log("die");
  bugs[bugs.indexOf(this)]=false;
}
Limb=function(props){
  this.sprite=new Two.Group();
  this.body=new Body(props.size,props.leng);
  this.joint=new Joint(props.leng);
  this.sprite.add(this.body.sprite);
  this.sprite.add(this.joint.sprite);
  this.sprite.rotation=props.rotation;
};
Limb.prototype.flex=function(amount){
}
Body=function(zs,ds){
  ds=ds||0;
  this.ellipse = new Two.Ellipse(ds, 0, zs, zs);
  this.sprite=this.ellipse;
  this.sprite.fill = '#FF8000';
  this.sprite.stroke = 'orangered'; // Accepts all valid css color
  this.sprite.linewidth =2;
  two.add(this.sprite);
}
Joint=function(ds){
  this.line = new Two.Line(0, 0, ds, 0);
  this.sprite=this.line;
  this.sprite.stroke = 'orangered'; // Accepts all valid css color
  this.sprite.linewidth =2;
  two.add(this.sprite);
}
Food=function(amount){
  this.initialAmount=amount;
  this.ellipse = new Two.Ellipse(0, 0, amount/10, amount/10);
  this.amount=amount;
  this.sprite=this.ellipse;
  this.sprite.fill = 'grey';
  this.sprite.translation=new Two.Vector(Math.random()*canvas.w,Math.random()*canvas.h);
  this.pos=this.sprite.translation;
  two.add(this.sprite);
  canvas.bind(this);
  this.feeding=[];
}
Food.prototype.frame=function(){
  // if(this.alive){
    // console.log(bugs[0].sprite.translation.x);
    // var l="";
    // console.log(this.sprite.scale);
    for(var a in bugs){
      // l+="-"+a;
      if(bugs[a]){
        var thisbug=bugs[a];
        var bugpos=thisbug.pos();//bug needsit s position updated manually.
        var dx = bugpos.x - this.pos.x;
        var dy = bugpos.y - this.pos.y;
        if((dx<80&&dy<80&&dx>-80&&dy>-80)||this.feeding.indexOf(thisbug)>-1){
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < (thisbug.radius/**thisbug.sprite.scal*e*/) + (this.initialAmount/10)) {
            this.sprite.fill="#FFF";
            this.feeding.push(thisbug);
            if(this.amount>2){
              thisbug.onFood=1;
              thisbug.food+=3;
              this.amount-=3;
              this.sprite.opacity=this.amount/this.initialAmount;
              // this.sprite.scale=this.amount/this.initialAmount;
            }
            // this.sprite.opacity=Math.random();
          }else{
            this.sprite.fill="#CCC";
            // this.sprite.opacity=1;
            thisbug.onFood=0;
            if(this.feeding.indexOf(thisbug)>-1){
              this.feeding.splice(thisbug);
            }
          }
        }
      }

    }
    // console.log(l)
  // }
}
