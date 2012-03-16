goog.provide('tempest');
goog.require('cljs.core');
goog.require('tempest.levels');
goog.require('goog.dom');
goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math');
tempest.polar_to_cartesian_coords = (function() {
var polar_to_cartesian_coords = null;
var polar_to_cartesian_coords__2750 = (function (p__2739){
var vec__2741__2742 = p__2739;
var r__2743 = cljs.core.nth.call(null,vec__2741__2742,0,null);
var angle__2744 = cljs.core.nth.call(null,vec__2741__2742,1,null);

return cljs.core.Vector.fromArray([goog.math.angleDx.call(null,angle__2744,r__2743),goog.math.angleDy.call(null,angle__2744,r__2743)]);
});
var polar_to_cartesian_coords__2751 = (function (p__2740,length_fn){
var vec__2745__2746 = p__2740;
var r__2747 = cljs.core.nth.call(null,vec__2745__2746,0,null);
var angle__2748 = cljs.core.nth.call(null,vec__2745__2746,1,null);

var newr__2749 = length_fn.call(null,r__2747);

return cljs.core.Vector.fromArray([goog.math.angleDx.call(null,angle__2748,newr__2749),goog.math.angleDy.call(null,angle__2748,newr__2749)]);
});
polar_to_cartesian_coords = function(p__2740,length_fn){
switch(arguments.length){
case  1 :
return polar_to_cartesian_coords__2750.call(this,p__2740);
case  2 :
return polar_to_cartesian_coords__2751.call(this,p__2740,length_fn);
}
throw('Invalid arity: ' + arguments.length);
};
return polar_to_cartesian_coords;
})()
;
tempest.rectangle_for_segment = (function rectangle_for_segment(level,seg_idx){
var vec__2753__2754 = cljs.core.get.call(null,"\uFDD0'segments".call(null,level),seg_idx);
var seg0__2755 = cljs.core.nth.call(null,vec__2753__2754,0,null);
var seg1__2756 = cljs.core.nth.call(null,vec__2753__2754,1,null);
var line0__2757 = cljs.core.get.call(null,"\uFDD0'lines".call(null,level),seg0__2755);
var line1__2758 = cljs.core.get.call(null,"\uFDD0'lines".call(null,level),seg1__2756);

return cljs.core.Vector.fromArray([tempest.polar_to_cartesian_coords.call(null,line0__2757),tempest.polar_to_cartesian_coords.call(null,line0__2757,"\uFDD0'length-fn".call(null,level)),tempest.polar_to_cartesian_coords.call(null,line1__2758,"\uFDD0'length-fn".call(null,level)),tempest.polar_to_cartesian_coords.call(null,line1__2758)]);
});
tempest.point_to_canvas_coords = (function point_to_canvas_coords(p__2760,p){
var map__2761__2762 = p__2760;
var map__2761__2763 = (cljs.core.truth_(cljs.core.seq_QMARK_.call(null,map__2761__2762))?cljs.core.apply.call(null,cljs.core.hash_map,map__2761__2762):map__2761__2762);
var width__2764 = cljs.core.get.call(null,map__2761__2763,"\uFDD0'width");
var height__2765 = cljs.core.get.call(null,map__2761__2763,"\uFDD0'height");

var xmid__2766 = (width__2764 / 2);
var ymid__2767 = (height__2765 / 2);

console.log(cljs.core.str.call(null,cljs.core.pr_str.call(null,p),"->",cljs.core.pr_str.call(null,cljs.core.Vector.fromArray([(cljs.core.first.call(null,p) + xmid__2766),(ymid__2767 - cljs.core.last.call(null,p))]))));
return cljs.core.Vector.fromArray([(cljs.core.first.call(null,p) + xmid__2766),(ymid__2767 - cljs.core.last.call(null,p))]);
});
tempest.rectangle_to_canvas_coords = (function rectangle_to_canvas_coords(dims,rect){
return cljs.core.map.call(null,(function (p1__2759_SHARP_){
return tempest.point_to_canvas_coords.call(null,dims,p1__2759_SHARP_);
}),rect);
});
tempest.rand_coord = (function rand_coord(p__2768){
var map__2769__2770 = p__2768;
var map__2769__2771 = (cljs.core.truth_(cljs.core.seq_QMARK_.call(null,map__2769__2770))?cljs.core.apply.call(null,cljs.core.hash_map,map__2769__2770):map__2769__2770);
var width__2772 = cljs.core.get.call(null,map__2769__2771,"\uFDD0'width");
var height__2773 = cljs.core.get.call(null,map__2769__2771,"\uFDD0'height");

return cljs.core.Vector.fromArray([goog.math.randomInt.call(null,width__2772),goog.math.randomInt.call(null,height__2773)]);
});
tempest.draw_random_line = (function draw_random_line(context,dims){
var vec__2774__2776 = tempest.rand_coord.call(null,dims);
var x1__2777 = cljs.core.nth.call(null,vec__2774__2776,0,null);
var y1__2778 = cljs.core.nth.call(null,vec__2774__2776,1,null);
var vec__2775__2779 = tempest.rand_coord.call(null,dims);
var x2__2780 = cljs.core.nth.call(null,vec__2775__2779,0,null);
var y2__2781 = cljs.core.nth.call(null,vec__2775__2779,1,null);

context.moveTo(x1__2777,y1__2778);
context.lineTo(x2__2780,y2__2781);
return context.stroke();
});
tempest.draw_rectangle = (function draw_rectangle(context,p__2782){
var vec__2783__2784 = p__2782;
var p0__2785 = cljs.core.nth.call(null,vec__2783__2784,0,null);
var points__2786 = cljs.core.nthnext.call(null,vec__2783__2784,1);

console.log(cljs.core.str.call(null,"Points",cljs.core.pr_str.call(null,points__2786)));
console.log(cljs.core.str.call(null,"Move to: ",cljs.core.pr_str.call(null,p0__2785)));
context.moveTo(cljs.core.first.call(null,p0__2785),cljs.core.last.call(null,p0__2785));
var G__2787__2788 = cljs.core.seq.call(null,points__2786);

if(cljs.core.truth_(G__2787__2788))
{var p__2789 = cljs.core.first.call(null,G__2787__2788);
var G__2787__2790 = G__2787__2788;

while(true){
console.log(cljs.core.str.call(null,"Draw to: ",cljs.core.pr_str.call(null,p__2789)));
context.lineTo(cljs.core.first.call(null,p__2789),cljs.core.last.call(null,p__2789));
var temp__3698__auto____2791 = cljs.core.next.call(null,G__2787__2790);

if(cljs.core.truth_(temp__3698__auto____2791))
{var G__2787__2792 = temp__3698__auto____2791;

{
var G__2793 = cljs.core.first.call(null,G__2787__2792);
var G__2794 = G__2787__2792;
p__2789 = G__2793;
G__2787__2790 = G__2794;
continue;
}
} else
{}
break;
}
} else
{}
context.lineTo(cljs.core.first.call(null,p0__2785),cljs.core.last.call(null,p0__2785));
return context.stroke();
});
tempest.canvasDraw = (function canvasDraw(level){
var canvas__2795 = goog.dom.getElement.call(null,"canv1");
var context__2796 = canvas__2795.getContext("2d");
var timer__2797 = (new goog.Timer(500));
var dims__2798 = cljs.core.ObjMap.fromObject(["\uFDD0'width","\uFDD0'height"],{"\uFDD0'width":canvas__2795.width,"\uFDD0'height":canvas__2795.height});
var level__2799 = cljs.core.get.call(null,tempest.levels._STAR_levels_STAR_,(parseInt.call(null,level) - 1));

var G__2800__2801 = cljs.core.seq.call(null,cljs.core.range.call(null,cljs.core.count.call(null,"\uFDD0'segments".call(null,level__2799))));

if(cljs.core.truth_(G__2800__2801))
{var idx__2802 = cljs.core.first.call(null,G__2800__2801);
var G__2800__2803 = G__2800__2801;

while(true){
tempest.draw_rectangle.call(null,context__2796,tempest.rectangle_to_canvas_coords.call(null,dims__2798,tempest.rectangle_for_segment.call(null,level__2799,idx__2802)));
var temp__3698__auto____2804 = cljs.core.next.call(null,G__2800__2803);

if(cljs.core.truth_(temp__3698__auto____2804))
{var G__2800__2805 = temp__3698__auto____2804;

{
var G__2806 = cljs.core.first.call(null,G__2800__2805);
var G__2807 = G__2800__2805;
idx__2802 = G__2806;
G__2800__2803 = G__2807;
continue;
}
} else
{return null;
}
break;
}
} else
{return null;
}
});
goog.exportSymbol('tempest.canvasDraw', tempest.canvasDraw);
