Mouse=function(){
  me=this;
  me.pos={x:0,y:0};
  me.hoveredBug=false;
  this.onMouseDown=function(event){
    if(me.hoveredBug){
      console.log(me.hoveredBug);
      me.hoveredBug[0].mouseSelect();
      document.getElementById("infodiv").className = "displaying";
    }else{
      document.getElementById("infodiv").className = "hidden";
    }
  }
  this.onMouseMove=function(event){
    me.pos.x=event.clientX;
    me.pos.y=event.clientY;
    me.hoveredBug=[];
    for(var a in bugs){
      if(bugs[a]){
        var thisbug=bugs[a];
        var bugpos=thisbug.pos();//bug needsit s position updated manually.
        var dx = bugpos.x - me.pos.x;
        var dy = bugpos.y - me.pos.y;
        if(dx<180&&dy<180&&dx>-180&&dy>-180){
          var distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < thisbug.radius) {
            thisbug.sprite.opacity=0.21;
            me.hoveredBug.push(thisbug);
          }else{
            thisbug.sprite.opacity=1;
          }
        }else{
          thisbug.sprite.opacity=1;
        }
      }
    }
    if(me.hoveredBug.length==0)
      me.hoveredBug=false;
  }
};
mouse=new Mouse();
//source: http://stackoverflow.com/questions/7790725/javascript-track-mouse-position
(function() {
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Use event.pageX / event.pageY here
        mouse.onMouseMove(event);
    }
    function handleMouseDown(event){
      mouse.onMouseDown(event);
    }
})();