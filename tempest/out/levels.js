goog.provide('tempest.levels');
goog.require('cljs.core');
goog.require('goog.dom');
goog.require('goog.Timer');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.math');
tempest.levels._STAR_default_line_length_STAR_ = 80;
tempest.levels._STAR_default_length_fn_STAR_ = (function _STAR_default_length_fn_STAR_(p1__2735_SHARP_){
return (4 * p1__2735_SHARP_);
});
tempest.levels.build_unlinked_segment_list = (function build_unlinked_segment_list(max_x){
return cljs.core.vec.call(null,(function (x,segments){
while(true){
if(cljs.core.truth_(cljs.core._EQ_.call(null,x,0)))
{return segments;
} else
{{
var G__2736 = (x - 1);
var G__2737 = cljs.core.cons.call(null,cljs.core.Vector.fromArray([(x - 1),x]),segments);
x = G__2736;
segments = G__2737;
continue;
}
}
break;
}
}).call(null,max_x,cljs.core.Vector.fromArray([])));
});
tempest.levels.build_segment_list = (function build_segment_list(max_x,linked_QMARK_){
var segments__2738 = tempest.levels.build_unlinked_segment_list.call(null,max_x);

if(cljs.core.truth_(linked_QMARK_ === true))
{return cljs.core.conj.call(null,segments__2738,cljs.core.Vector.fromArray([cljs.core.last.call(null,cljs.core.last.call(null,segments__2738)),cljs.core.first.call(null,cljs.core.first.call(null,segments__2738))]));
} else
{return segments__2738;
}
});
tempest.levels._STAR_level1_lines_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([113,225]),cljs.core.Vector.fromArray([99,234]),cljs.core.Vector.fromArray([90,243]),cljs.core.Vector.fromArray([84,252]),cljs.core.Vector.fromArray([81,261]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,270]),cljs.core.Vector.fromArray([81,279]),cljs.core.Vector.fromArray([84,288]),cljs.core.Vector.fromArray([90,297]),cljs.core.Vector.fromArray([99,306]),cljs.core.Vector.fromArray([113,315])]);
tempest.levels._STAR_level2_lines_STAR_ = cljs.core.Vector.fromArray([cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,0]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,18]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,36]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,54]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,72]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,90]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,108]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,126]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,144]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,162]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,180]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,198]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,216]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,234]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,252]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,270]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,288]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,306]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,324]),cljs.core.Vector.fromArray([tempest.levels._STAR_default_line_length_STAR_,342])]);
tempest.levels._STAR_levels_STAR_ = cljs.core.Vector.fromArray([cljs.core.ObjMap.fromObject(["\uFDD0'lines","\uFDD0'segments","\uFDD0'length-fn"],{"\uFDD0'lines":tempest.levels._STAR_level1_lines_STAR_,"\uFDD0'segments":tempest.levels.build_segment_list.call(null,(cljs.core.count.call(null,tempest.levels._STAR_level1_lines_STAR_) - 1),false),"\uFDD0'length-fn":tempest.levels._STAR_default_length_fn_STAR_}),cljs.core.ObjMap.fromObject(["\uFDD0'lines","\uFDD0'segments","\uFDD0'length-fn"],{"\uFDD0'lines":tempest.levels._STAR_level2_lines_STAR_,"\uFDD0'segments":tempest.levels.build_segment_list.call(null,(cljs.core.count.call(null,tempest.levels._STAR_level2_lines_STAR_) - 1),true),"\uFDD0'length-fn":tempest.levels._STAR_default_length_fn_STAR_})]);
