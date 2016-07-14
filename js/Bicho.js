
//reposition=fuinction
//Bug.prototepy.reposton=repisition
Bug=function(){
  this.properties={
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
  this.food=0;
  this.sprite=new Two.Group();
  this.speed=10;
  this.angl=1;
  this.limbs=[];
  for(var l in this.properties.limbs){
    var props=this.properties.limbs[l];
    this.limbs[l]=new Limb(props);
    this.limbs[l].sprite.rotation=props.angl;
    this.sprite.add(this.limbs[l].sprite);
  }
  this.body=new Body(this.properties.size);
  this.radius=this.properties.size;
  this.sprite.add(this.body.sprite);
  two.add(this.sprite);
  canvas.bind(this);
  // this.pos=this.sprite.translation;
};
Bug.prototype.pos=function(){
  return this.sprite.translation;
}
Bug.prototype.accelerate=function(val){
  this.speed+=val;
}
Bug.prototype.turn=function(val){
  this.angl+=val;
}
Bug.prototype.frame=function(){
  var rot=this.sprite.rotation;
  var pos=this.sprite.translation;
  this.sprite.translation=new Two.Vector((pos.x+Math.cos(rot)*this.speed)%canvas.w,(pos.y+Math.sin(rot)*this.speed)%canvas.h);
  this.sprite.rotation=this.angl;
}
Bug.prototype.reposition=function(vec){
  if(vec.hasOwnProperty("x")&&vec.hasOwnProperty("y")){
    this.sprite.translation=new Two.Vector(vec.x,vec.y);
  }
  if(vec.a)
  this.sprite.rotation=vec.a;
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
  this.ellipse = new Two.Ellipse(0, 0, amount, amount);
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
  // console.log(bugs[0].sprite.translation.x);
  for(var a in bugs){
    var thisbug=bugs[a];
    var bugpos=thisbug.pos();//bug needsit s position updated manually.
    var dx = bugpos.x - this.pos.x;
    var dy = bugpos.y - this.pos.y;
    if((dx<80&&dy<80&&dx>-80&&dy>-80)||this.feeding.indexOf(thisbug)>-1){
      var distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < thisbug.radius + this.amount) {
        this.sprite.fill="#FFF";
        this.feeding.push(thisbug);
        thisbug.food++;
        // this.sprite.opacity=Math.random();
      }else{
        this.sprite.fill="#CCC";
        this.sprite.opacity=1;
        if(this.feeding.indexOf(thisbug)>-1){
          this.feeding.splice(thisbug);
        }
      }
    }
  }
}
