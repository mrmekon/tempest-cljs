goog.provide('cljs.core');
goog.require('goog.string');
goog.require('goog.string.StringBuffer');
goog.require('goog.object');
goog.require('goog.array');
/**
* Each runtime environment provides a diffenent way to print output.
* Whatever function *print-fn* is bound to will be passed any
* Strings which should be printed.
*/
cljs.core._STAR_print_fn_STAR_ = (function _STAR_print_fn_STAR_(_){
throw (new Error("No *print-fn* fn set for evaluation environment"));
});
/**
* Internal - do not use!
*/
cljs.core.truth_ = (function truth_(x){
return (x != null && x !== false);
});
/**
* Internal - do not use!
*/
cljs.core.type_satisfies_ = (function type_satisfies_(p,x){
var or__3548__auto____2808 = (p[goog.typeOf.call(null,x)]);

if(cljs.core.truth_(or__3548__auto____2808))
{return or__3548__auto____2808;
} else
{var or__3548__auto____2809 = (p["_"]);

if(cljs.core.truth_(or__3548__auto____2809))
{return or__3548__auto____2809;
} else
{return false;
}
}
});
cljs.core.is_proto_ = (function is_proto_(x){
return (x).constructor.prototype === x;
});
/**
* When compiled for a command-line target, whatever
* function *main-fn* is set to will be called with the command-line
* argv as arguments
*/
cljs.core._STAR_main_cli_fn_STAR_ = null;
cljs.core.missing_protocol = (function missing_protocol(proto,obj){
return Error.call(null,"No protocol method "+proto+" defined for type "+goog.typeOf.call(null,obj)+": "+obj);
});
/**
* Returns a javascript array, cloned from the passed in array
*/
cljs.core.aclone = (function aclone(array_like){
return Array.prototype.slice.call(array_like);
});
/**
* Creates a new javascript array.
* @param {...*} var_args
*/
cljs.core.array = (function array(var_args){
return Array.prototype.slice.call(arguments);
});
/**
* Returns the value at the index.
*/
cljs.core.aget = (function aget(array,i){
return (array[i]);
});
/**
* Sets the value at the index.
*/
cljs.core.aset = (function aset(array,i,val){
return (array[i] = val);
});
/**
* Returns the length of the Java array. Works on arrays of all types.
*/
cljs.core.alength = (function alength(array){
return array.length;
});
cljs.core.IFn = {};
cljs.core._invoke = (function() {
var _invoke = null;
var _invoke__2873 = (function (this$){
if(cljs.core.truth_((function (){var and__3546__auto____2810 = this$;

if(cljs.core.truth_(and__3546__auto____2810))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2810;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$);
} else
{return (function (){var or__3548__auto____2811 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2811))
{return or__3548__auto____2811;
} else
{var or__3548__auto____2812 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2812))
{return or__3548__auto____2812;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$);
}
});
var _invoke__2874 = (function (this$,a){
if(cljs.core.truth_((function (){var and__3546__auto____2813 = this$;

if(cljs.core.truth_(and__3546__auto____2813))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2813;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a);
} else
{return (function (){var or__3548__auto____2814 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2814))
{return or__3548__auto____2814;
} else
{var or__3548__auto____2815 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2815))
{return or__3548__auto____2815;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a);
}
});
var _invoke__2875 = (function (this$,a,b){
if(cljs.core.truth_((function (){var and__3546__auto____2816 = this$;

if(cljs.core.truth_(and__3546__auto____2816))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2816;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b);
} else
{return (function (){var or__3548__auto____2817 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2817))
{return or__3548__auto____2817;
} else
{var or__3548__auto____2818 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2818))
{return or__3548__auto____2818;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b);
}
});
var _invoke__2876 = (function (this$,a,b,c){
if(cljs.core.truth_((function (){var and__3546__auto____2819 = this$;

if(cljs.core.truth_(and__3546__auto____2819))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2819;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c);
} else
{return (function (){var or__3548__auto____2820 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2820))
{return or__3548__auto____2820;
} else
{var or__3548__auto____2821 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2821))
{return or__3548__auto____2821;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c);
}
});
var _invoke__2877 = (function (this$,a,b,c,d){
if(cljs.core.truth_((function (){var and__3546__auto____2822 = this$;

if(cljs.core.truth_(and__3546__auto____2822))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2822;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d);
} else
{return (function (){var or__3548__auto____2823 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2823))
{return or__3548__auto____2823;
} else
{var or__3548__auto____2824 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2824))
{return or__3548__auto____2824;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d);
}
});
var _invoke__2878 = (function (this$,a,b,c,d,e){
if(cljs.core.truth_((function (){var and__3546__auto____2825 = this$;

if(cljs.core.truth_(and__3546__auto____2825))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2825;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e);
} else
{return (function (){var or__3548__auto____2826 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2826))
{return or__3548__auto____2826;
} else
{var or__3548__auto____2827 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2827))
{return or__3548__auto____2827;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e);
}
});
var _invoke__2879 = (function (this$,a,b,c,d,e,f){
if(cljs.core.truth_((function (){var and__3546__auto____2828 = this$;

if(cljs.core.truth_(and__3546__auto____2828))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2828;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f);
} else
{return (function (){var or__3548__auto____2829 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2829))
{return or__3548__auto____2829;
} else
{var or__3548__auto____2830 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2830))
{return or__3548__auto____2830;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f);
}
});
var _invoke__2880 = (function (this$,a,b,c,d,e,f,g){
if(cljs.core.truth_((function (){var and__3546__auto____2831 = this$;

if(cljs.core.truth_(and__3546__auto____2831))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2831;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g);
} else
{return (function (){var or__3548__auto____2832 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2832))
{return or__3548__auto____2832;
} else
{var or__3548__auto____2833 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2833))
{return or__3548__auto____2833;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g);
}
});
var _invoke__2881 = (function (this$,a,b,c,d,e,f,g,h){
if(cljs.core.truth_((function (){var and__3546__auto____2834 = this$;

if(cljs.core.truth_(and__3546__auto____2834))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2834;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h);
} else
{return (function (){var or__3548__auto____2835 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2835))
{return or__3548__auto____2835;
} else
{var or__3548__auto____2836 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2836))
{return or__3548__auto____2836;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h);
}
});
var _invoke__2882 = (function (this$,a,b,c,d,e,f,g,h,i){
if(cljs.core.truth_((function (){var and__3546__auto____2837 = this$;

if(cljs.core.truth_(and__3546__auto____2837))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2837;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i);
} else
{return (function (){var or__3548__auto____2838 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2838))
{return or__3548__auto____2838;
} else
{var or__3548__auto____2839 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2839))
{return or__3548__auto____2839;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i);
}
});
var _invoke__2883 = (function (this$,a,b,c,d,e,f,g,h,i,j){
if(cljs.core.truth_((function (){var and__3546__auto____2840 = this$;

if(cljs.core.truth_(and__3546__auto____2840))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2840;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j);
} else
{return (function (){var or__3548__auto____2841 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2841))
{return or__3548__auto____2841;
} else
{var or__3548__auto____2842 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2842))
{return or__3548__auto____2842;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j);
}
});
var _invoke__2884 = (function (this$,a,b,c,d,e,f,g,h,i,j,k){
if(cljs.core.truth_((function (){var and__3546__auto____2843 = this$;

if(cljs.core.truth_(and__3546__auto____2843))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2843;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k);
} else
{return (function (){var or__3548__auto____2844 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2844))
{return or__3548__auto____2844;
} else
{var or__3548__auto____2845 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2845))
{return or__3548__auto____2845;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k);
}
});
var _invoke__2885 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l){
if(cljs.core.truth_((function (){var and__3546__auto____2846 = this$;

if(cljs.core.truth_(and__3546__auto____2846))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2846;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l);
} else
{return (function (){var or__3548__auto____2847 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2847))
{return or__3548__auto____2847;
} else
{var or__3548__auto____2848 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2848))
{return or__3548__auto____2848;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l);
}
});
var _invoke__2886 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m){
if(cljs.core.truth_((function (){var and__3546__auto____2849 = this$;

if(cljs.core.truth_(and__3546__auto____2849))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2849;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
} else
{return (function (){var or__3548__auto____2850 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2850))
{return or__3548__auto____2850;
} else
{var or__3548__auto____2851 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2851))
{return or__3548__auto____2851;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
}
});
var _invoke__2887 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n){
if(cljs.core.truth_((function (){var and__3546__auto____2852 = this$;

if(cljs.core.truth_(and__3546__auto____2852))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2852;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
} else
{return (function (){var or__3548__auto____2853 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2853))
{return or__3548__auto____2853;
} else
{var or__3548__auto____2854 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2854))
{return or__3548__auto____2854;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
}
});
var _invoke__2888 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){
if(cljs.core.truth_((function (){var and__3546__auto____2855 = this$;

if(cljs.core.truth_(and__3546__auto____2855))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2855;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
} else
{return (function (){var or__3548__auto____2856 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2856))
{return or__3548__auto____2856;
} else
{var or__3548__auto____2857 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2857))
{return or__3548__auto____2857;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
}
});
var _invoke__2889 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){
if(cljs.core.truth_((function (){var and__3546__auto____2858 = this$;

if(cljs.core.truth_(and__3546__auto____2858))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2858;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
} else
{return (function (){var or__3548__auto____2859 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2859))
{return or__3548__auto____2859;
} else
{var or__3548__auto____2860 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2860))
{return or__3548__auto____2860;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
}
});
var _invoke__2890 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){
if(cljs.core.truth_((function (){var and__3546__auto____2861 = this$;

if(cljs.core.truth_(and__3546__auto____2861))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2861;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
} else
{return (function (){var or__3548__auto____2862 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2862))
{return or__3548__auto____2862;
} else
{var or__3548__auto____2863 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2863))
{return or__3548__auto____2863;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
}
});
var _invoke__2891 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s){
if(cljs.core.truth_((function (){var and__3546__auto____2864 = this$;

if(cljs.core.truth_(and__3546__auto____2864))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2864;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
} else
{return (function (){var or__3548__auto____2865 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2865))
{return or__3548__auto____2865;
} else
{var or__3548__auto____2866 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2866))
{return or__3548__auto____2866;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
}
});
var _invoke__2892 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t){
if(cljs.core.truth_((function (){var and__3546__auto____2867 = this$;

if(cljs.core.truth_(and__3546__auto____2867))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2867;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
} else
{return (function (){var or__3548__auto____2868 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2868))
{return or__3548__auto____2868;
} else
{var or__3548__auto____2869 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2869))
{return or__3548__auto____2869;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
}
});
var _invoke__2893 = (function (this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest){
if(cljs.core.truth_((function (){var and__3546__auto____2870 = this$;

if(cljs.core.truth_(and__3546__auto____2870))
{return this$.cljs$core$IFn$_invoke;
} else
{return and__3546__auto____2870;
}
})()))
{return this$.cljs$core$IFn$_invoke(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
} else
{return (function (){var or__3548__auto____2871 = (cljs.core._invoke[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2871))
{return or__3548__auto____2871;
} else
{var or__3548__auto____2872 = (cljs.core._invoke["_"]);

if(cljs.core.truth_(or__3548__auto____2872))
{return or__3548__auto____2872;
} else
{throw cljs.core.missing_protocol.call(null,"IFn.-invoke",this$);
}
}
})().call(null,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
}
});
_invoke = function(this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest){
switch(arguments.length){
case  1 :
return _invoke__2873.call(this,this$);
case  2 :
return _invoke__2874.call(this,this$,a);
case  3 :
return _invoke__2875.call(this,this$,a,b);
case  4 :
return _invoke__2876.call(this,this$,a,b,c);
case  5 :
return _invoke__2877.call(this,this$,a,b,c,d);
case  6 :
return _invoke__2878.call(this,this$,a,b,c,d,e);
case  7 :
return _invoke__2879.call(this,this$,a,b,c,d,e,f);
case  8 :
return _invoke__2880.call(this,this$,a,b,c,d,e,f,g);
case  9 :
return _invoke__2881.call(this,this$,a,b,c,d,e,f,g,h);
case  10 :
return _invoke__2882.call(this,this$,a,b,c,d,e,f,g,h,i);
case  11 :
return _invoke__2883.call(this,this$,a,b,c,d,e,f,g,h,i,j);
case  12 :
return _invoke__2884.call(this,this$,a,b,c,d,e,f,g,h,i,j,k);
case  13 :
return _invoke__2885.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l);
case  14 :
return _invoke__2886.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m);
case  15 :
return _invoke__2887.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n);
case  16 :
return _invoke__2888.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o);
case  17 :
return _invoke__2889.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p);
case  18 :
return _invoke__2890.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q);
case  19 :
return _invoke__2891.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s);
case  20 :
return _invoke__2892.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t);
case  21 :
return _invoke__2893.call(this,this$,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,s,t,rest);
}
throw('Invalid arity: ' + arguments.length);
};
return _invoke;
})()
;
cljs.core.ICounted = {};
cljs.core._count = (function _count(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2895 = coll;

if(cljs.core.truth_(and__3546__auto____2895))
{return coll.cljs$core$ICounted$_count;
} else
{return and__3546__auto____2895;
}
})()))
{return coll.cljs$core$ICounted$_count(coll);
} else
{return (function (){var or__3548__auto____2896 = (cljs.core._count[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2896))
{return or__3548__auto____2896;
} else
{var or__3548__auto____2897 = (cljs.core._count["_"]);

if(cljs.core.truth_(or__3548__auto____2897))
{return or__3548__auto____2897;
} else
{throw cljs.core.missing_protocol.call(null,"ICounted.-count",coll);
}
}
})().call(null,coll);
}
});
cljs.core.IEmptyableCollection = {};
cljs.core._empty = (function _empty(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2898 = coll;

if(cljs.core.truth_(and__3546__auto____2898))
{return coll.cljs$core$IEmptyableCollection$_empty;
} else
{return and__3546__auto____2898;
}
})()))
{return coll.cljs$core$IEmptyableCollection$_empty(coll);
} else
{return (function (){var or__3548__auto____2899 = (cljs.core._empty[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2899))
{return or__3548__auto____2899;
} else
{var or__3548__auto____2900 = (cljs.core._empty["_"]);

if(cljs.core.truth_(or__3548__auto____2900))
{return or__3548__auto____2900;
} else
{throw cljs.core.missing_protocol.call(null,"IEmptyableCollection.-empty",coll);
}
}
})().call(null,coll);
}
});
cljs.core.ICollection = {};
cljs.core._conj = (function _conj(coll,o){
if(cljs.core.truth_((function (){var and__3546__auto____2901 = coll;

if(cljs.core.truth_(and__3546__auto____2901))
{return coll.cljs$core$ICollection$_conj;
} else
{return and__3546__auto____2901;
}
})()))
{return coll.cljs$core$ICollection$_conj(coll,o);
} else
{return (function (){var or__3548__auto____2902 = (cljs.core._conj[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2902))
{return or__3548__auto____2902;
} else
{var or__3548__auto____2903 = (cljs.core._conj["_"]);

if(cljs.core.truth_(or__3548__auto____2903))
{return or__3548__auto____2903;
} else
{throw cljs.core.missing_protocol.call(null,"ICollection.-conj",coll);
}
}
})().call(null,coll,o);
}
});
cljs.core.IIndexed = {};
cljs.core._nth = (function() {
var _nth = null;
var _nth__2910 = (function (coll,n){
if(cljs.core.truth_((function (){var and__3546__auto____2904 = coll;

if(cljs.core.truth_(and__3546__auto____2904))
{return coll.cljs$core$IIndexed$_nth;
} else
{return and__3546__auto____2904;
}
})()))
{return coll.cljs$core$IIndexed$_nth(coll,n);
} else
{return (function (){var or__3548__auto____2905 = (cljs.core._nth[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2905))
{return or__3548__auto____2905;
} else
{var or__3548__auto____2906 = (cljs.core._nth["_"]);

if(cljs.core.truth_(or__3548__auto____2906))
{return or__3548__auto____2906;
} else
{throw cljs.core.missing_protocol.call(null,"IIndexed.-nth",coll);
}
}
})().call(null,coll,n);
}
});
var _nth__2911 = (function (coll,n,not_found){
if(cljs.core.truth_((function (){var and__3546__auto____2907 = coll;

if(cljs.core.truth_(and__3546__auto____2907))
{return coll.cljs$core$IIndexed$_nth;
} else
{return and__3546__auto____2907;
}
})()))
{return coll.cljs$core$IIndexed$_nth(coll,n,not_found);
} else
{return (function (){var or__3548__auto____2908 = (cljs.core._nth[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2908))
{return or__3548__auto____2908;
} else
{var or__3548__auto____2909 = (cljs.core._nth["_"]);

if(cljs.core.truth_(or__3548__auto____2909))
{return or__3548__auto____2909;
} else
{throw cljs.core.missing_protocol.call(null,"IIndexed.-nth",coll);
}
}
})().call(null,coll,n,not_found);
}
});
_nth = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return _nth__2910.call(this,coll,n);
case  3 :
return _nth__2911.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return _nth;
})()
;
cljs.core.ISeq = {};
cljs.core._first = (function _first(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2913 = coll;

if(cljs.core.truth_(and__3546__auto____2913))
{return coll.cljs$core$ISeq$_first;
} else
{return and__3546__auto____2913;
}
})()))
{return coll.cljs$core$ISeq$_first(coll);
} else
{return (function (){var or__3548__auto____2914 = (cljs.core._first[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2914))
{return or__3548__auto____2914;
} else
{var or__3548__auto____2915 = (cljs.core._first["_"]);

if(cljs.core.truth_(or__3548__auto____2915))
{return or__3548__auto____2915;
} else
{throw cljs.core.missing_protocol.call(null,"ISeq.-first",coll);
}
}
})().call(null,coll);
}
});
cljs.core._rest = (function _rest(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2916 = coll;

if(cljs.core.truth_(and__3546__auto____2916))
{return coll.cljs$core$ISeq$_rest;
} else
{return and__3546__auto____2916;
}
})()))
{return coll.cljs$core$ISeq$_rest(coll);
} else
{return (function (){var or__3548__auto____2917 = (cljs.core._rest[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2917))
{return or__3548__auto____2917;
} else
{var or__3548__auto____2918 = (cljs.core._rest["_"]);

if(cljs.core.truth_(or__3548__auto____2918))
{return or__3548__auto____2918;
} else
{throw cljs.core.missing_protocol.call(null,"ISeq.-rest",coll);
}
}
})().call(null,coll);
}
});
cljs.core.ILookup = {};
cljs.core._lookup = (function() {
var _lookup = null;
var _lookup__2925 = (function (o,k){
if(cljs.core.truth_((function (){var and__3546__auto____2919 = o;

if(cljs.core.truth_(and__3546__auto____2919))
{return o.cljs$core$ILookup$_lookup;
} else
{return and__3546__auto____2919;
}
})()))
{return o.cljs$core$ILookup$_lookup(o,k);
} else
{return (function (){var or__3548__auto____2920 = (cljs.core._lookup[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2920))
{return or__3548__auto____2920;
} else
{var or__3548__auto____2921 = (cljs.core._lookup["_"]);

if(cljs.core.truth_(or__3548__auto____2921))
{return or__3548__auto____2921;
} else
{throw cljs.core.missing_protocol.call(null,"ILookup.-lookup",o);
}
}
})().call(null,o,k);
}
});
var _lookup__2926 = (function (o,k,not_found){
if(cljs.core.truth_((function (){var and__3546__auto____2922 = o;

if(cljs.core.truth_(and__3546__auto____2922))
{return o.cljs$core$ILookup$_lookup;
} else
{return and__3546__auto____2922;
}
})()))
{return o.cljs$core$ILookup$_lookup(o,k,not_found);
} else
{return (function (){var or__3548__auto____2923 = (cljs.core._lookup[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2923))
{return or__3548__auto____2923;
} else
{var or__3548__auto____2924 = (cljs.core._lookup["_"]);

if(cljs.core.truth_(or__3548__auto____2924))
{return or__3548__auto____2924;
} else
{throw cljs.core.missing_protocol.call(null,"ILookup.-lookup",o);
}
}
})().call(null,o,k,not_found);
}
});
_lookup = function(o,k,not_found){
switch(arguments.length){
case  2 :
return _lookup__2925.call(this,o,k);
case  3 :
return _lookup__2926.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return _lookup;
})()
;
cljs.core.IAssociative = {};
cljs.core._contains_key_QMARK_ = (function _contains_key_QMARK_(coll,k){
if(cljs.core.truth_((function (){var and__3546__auto____2928 = coll;

if(cljs.core.truth_(and__3546__auto____2928))
{return coll.cljs$core$IAssociative$_contains_key_QMARK_;
} else
{return and__3546__auto____2928;
}
})()))
{return coll.cljs$core$IAssociative$_contains_key_QMARK_(coll,k);
} else
{return (function (){var or__3548__auto____2929 = (cljs.core._contains_key_QMARK_[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2929))
{return or__3548__auto____2929;
} else
{var or__3548__auto____2930 = (cljs.core._contains_key_QMARK_["_"]);

if(cljs.core.truth_(or__3548__auto____2930))
{return or__3548__auto____2930;
} else
{throw cljs.core.missing_protocol.call(null,"IAssociative.-contains-key?",coll);
}
}
})().call(null,coll,k);
}
});
cljs.core._assoc = (function _assoc(coll,k,v){
if(cljs.core.truth_((function (){var and__3546__auto____2931 = coll;

if(cljs.core.truth_(and__3546__auto____2931))
{return coll.cljs$core$IAssociative$_assoc;
} else
{return and__3546__auto____2931;
}
})()))
{return coll.cljs$core$IAssociative$_assoc(coll,k,v);
} else
{return (function (){var or__3548__auto____2932 = (cljs.core._assoc[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2932))
{return or__3548__auto____2932;
} else
{var or__3548__auto____2933 = (cljs.core._assoc["_"]);

if(cljs.core.truth_(or__3548__auto____2933))
{return or__3548__auto____2933;
} else
{throw cljs.core.missing_protocol.call(null,"IAssociative.-assoc",coll);
}
}
})().call(null,coll,k,v);
}
});
cljs.core.IMap = {};
cljs.core._dissoc = (function _dissoc(coll,k){
if(cljs.core.truth_((function (){var and__3546__auto____2934 = coll;

if(cljs.core.truth_(and__3546__auto____2934))
{return coll.cljs$core$IMap$_dissoc;
} else
{return and__3546__auto____2934;
}
})()))
{return coll.cljs$core$IMap$_dissoc(coll,k);
} else
{return (function (){var or__3548__auto____2935 = (cljs.core._dissoc[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2935))
{return or__3548__auto____2935;
} else
{var or__3548__auto____2936 = (cljs.core._dissoc["_"]);

if(cljs.core.truth_(or__3548__auto____2936))
{return or__3548__auto____2936;
} else
{throw cljs.core.missing_protocol.call(null,"IMap.-dissoc",coll);
}
}
})().call(null,coll,k);
}
});
cljs.core.ISet = {};
cljs.core._disjoin = (function _disjoin(coll,v){
if(cljs.core.truth_((function (){var and__3546__auto____2937 = coll;

if(cljs.core.truth_(and__3546__auto____2937))
{return coll.cljs$core$ISet$_disjoin;
} else
{return and__3546__auto____2937;
}
})()))
{return coll.cljs$core$ISet$_disjoin(coll,v);
} else
{return (function (){var or__3548__auto____2938 = (cljs.core._disjoin[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2938))
{return or__3548__auto____2938;
} else
{var or__3548__auto____2939 = (cljs.core._disjoin["_"]);

if(cljs.core.truth_(or__3548__auto____2939))
{return or__3548__auto____2939;
} else
{throw cljs.core.missing_protocol.call(null,"ISet.-disjoin",coll);
}
}
})().call(null,coll,v);
}
});
cljs.core.IStack = {};
cljs.core._peek = (function _peek(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2940 = coll;

if(cljs.core.truth_(and__3546__auto____2940))
{return coll.cljs$core$IStack$_peek;
} else
{return and__3546__auto____2940;
}
})()))
{return coll.cljs$core$IStack$_peek(coll);
} else
{return (function (){var or__3548__auto____2941 = (cljs.core._peek[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2941))
{return or__3548__auto____2941;
} else
{var or__3548__auto____2942 = (cljs.core._peek["_"]);

if(cljs.core.truth_(or__3548__auto____2942))
{return or__3548__auto____2942;
} else
{throw cljs.core.missing_protocol.call(null,"IStack.-peek",coll);
}
}
})().call(null,coll);
}
});
cljs.core._pop = (function _pop(coll){
if(cljs.core.truth_((function (){var and__3546__auto____2943 = coll;

if(cljs.core.truth_(and__3546__auto____2943))
{return coll.cljs$core$IStack$_pop;
} else
{return and__3546__auto____2943;
}
})()))
{return coll.cljs$core$IStack$_pop(coll);
} else
{return (function (){var or__3548__auto____2944 = (cljs.core._pop[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2944))
{return or__3548__auto____2944;
} else
{var or__3548__auto____2945 = (cljs.core._pop["_"]);

if(cljs.core.truth_(or__3548__auto____2945))
{return or__3548__auto____2945;
} else
{throw cljs.core.missing_protocol.call(null,"IStack.-pop",coll);
}
}
})().call(null,coll);
}
});
cljs.core.IVector = {};
cljs.core._assoc_n = (function _assoc_n(coll,n,val){
if(cljs.core.truth_((function (){var and__3546__auto____2946 = coll;

if(cljs.core.truth_(and__3546__auto____2946))
{return coll.cljs$core$IVector$_assoc_n;
} else
{return and__3546__auto____2946;
}
})()))
{return coll.cljs$core$IVector$_assoc_n(coll,n,val);
} else
{return (function (){var or__3548__auto____2947 = (cljs.core._assoc_n[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2947))
{return or__3548__auto____2947;
} else
{var or__3548__auto____2948 = (cljs.core._assoc_n["_"]);

if(cljs.core.truth_(or__3548__auto____2948))
{return or__3548__auto____2948;
} else
{throw cljs.core.missing_protocol.call(null,"IVector.-assoc-n",coll);
}
}
})().call(null,coll,n,val);
}
});
cljs.core.IDeref = {};
cljs.core._deref = (function _deref(o){
if(cljs.core.truth_((function (){var and__3546__auto____2949 = o;

if(cljs.core.truth_(and__3546__auto____2949))
{return o.cljs$core$IDeref$_deref;
} else
{return and__3546__auto____2949;
}
})()))
{return o.cljs$core$IDeref$_deref(o);
} else
{return (function (){var or__3548__auto____2950 = (cljs.core._deref[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2950))
{return or__3548__auto____2950;
} else
{var or__3548__auto____2951 = (cljs.core._deref["_"]);

if(cljs.core.truth_(or__3548__auto____2951))
{return or__3548__auto____2951;
} else
{throw cljs.core.missing_protocol.call(null,"IDeref.-deref",o);
}
}
})().call(null,o);
}
});
cljs.core.IDerefWithTimeout = {};
cljs.core._deref_with_timeout = (function _deref_with_timeout(o,msec,timeout_val){
if(cljs.core.truth_((function (){var and__3546__auto____2952 = o;

if(cljs.core.truth_(and__3546__auto____2952))
{return o.cljs$core$IDerefWithTimeout$_deref_with_timeout;
} else
{return and__3546__auto____2952;
}
})()))
{return o.cljs$core$IDerefWithTimeout$_deref_with_timeout(o,msec,timeout_val);
} else
{return (function (){var or__3548__auto____2953 = (cljs.core._deref_with_timeout[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2953))
{return or__3548__auto____2953;
} else
{var or__3548__auto____2954 = (cljs.core._deref_with_timeout["_"]);

if(cljs.core.truth_(or__3548__auto____2954))
{return or__3548__auto____2954;
} else
{throw cljs.core.missing_protocol.call(null,"IDerefWithTimeout.-deref-with-timeout",o);
}
}
})().call(null,o,msec,timeout_val);
}
});
cljs.core.IMeta = {};
cljs.core._meta = (function _meta(o){
if(cljs.core.truth_((function (){var and__3546__auto____2955 = o;

if(cljs.core.truth_(and__3546__auto____2955))
{return o.cljs$core$IMeta$_meta;
} else
{return and__3546__auto____2955;
}
})()))
{return o.cljs$core$IMeta$_meta(o);
} else
{return (function (){var or__3548__auto____2956 = (cljs.core._meta[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2956))
{return or__3548__auto____2956;
} else
{var or__3548__auto____2957 = (cljs.core._meta["_"]);

if(cljs.core.truth_(or__3548__auto____2957))
{return or__3548__auto____2957;
} else
{throw cljs.core.missing_protocol.call(null,"IMeta.-meta",o);
}
}
})().call(null,o);
}
});
cljs.core.IWithMeta = {};
cljs.core._with_meta = (function _with_meta(o,meta){
if(cljs.core.truth_((function (){var and__3546__auto____2958 = o;

if(cljs.core.truth_(and__3546__auto____2958))
{return o.cljs$core$IWithMeta$_with_meta;
} else
{return and__3546__auto____2958;
}
})()))
{return o.cljs$core$IWithMeta$_with_meta(o,meta);
} else
{return (function (){var or__3548__auto____2959 = (cljs.core._with_meta[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2959))
{return or__3548__auto____2959;
} else
{var or__3548__auto____2960 = (cljs.core._with_meta["_"]);

if(cljs.core.truth_(or__3548__auto____2960))
{return or__3548__auto____2960;
} else
{throw cljs.core.missing_protocol.call(null,"IWithMeta.-with-meta",o);
}
}
})().call(null,o,meta);
}
});
cljs.core.IReduce = {};
cljs.core._reduce = (function() {
var _reduce = null;
var _reduce__2967 = (function (coll,f){
if(cljs.core.truth_((function (){var and__3546__auto____2961 = coll;

if(cljs.core.truth_(and__3546__auto____2961))
{return coll.cljs$core$IReduce$_reduce;
} else
{return and__3546__auto____2961;
}
})()))
{return coll.cljs$core$IReduce$_reduce(coll,f);
} else
{return (function (){var or__3548__auto____2962 = (cljs.core._reduce[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2962))
{return or__3548__auto____2962;
} else
{var or__3548__auto____2963 = (cljs.core._reduce["_"]);

if(cljs.core.truth_(or__3548__auto____2963))
{return or__3548__auto____2963;
} else
{throw cljs.core.missing_protocol.call(null,"IReduce.-reduce",coll);
}
}
})().call(null,coll,f);
}
});
var _reduce__2968 = (function (coll,f,start){
if(cljs.core.truth_((function (){var and__3546__auto____2964 = coll;

if(cljs.core.truth_(and__3546__auto____2964))
{return coll.cljs$core$IReduce$_reduce;
} else
{return and__3546__auto____2964;
}
})()))
{return coll.cljs$core$IReduce$_reduce(coll,f,start);
} else
{return (function (){var or__3548__auto____2965 = (cljs.core._reduce[goog.typeOf.call(null,coll)]);

if(cljs.core.truth_(or__3548__auto____2965))
{return or__3548__auto____2965;
} else
{var or__3548__auto____2966 = (cljs.core._reduce["_"]);

if(cljs.core.truth_(or__3548__auto____2966))
{return or__3548__auto____2966;
} else
{throw cljs.core.missing_protocol.call(null,"IReduce.-reduce",coll);
}
}
})().call(null,coll,f,start);
}
});
_reduce = function(coll,f,start){
switch(arguments.length){
case  2 :
return _reduce__2967.call(this,coll,f);
case  3 :
return _reduce__2968.call(this,coll,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return _reduce;
})()
;
cljs.core.IEquiv = {};
cljs.core._equiv = (function _equiv(o,other){
if(cljs.core.truth_((function (){var and__3546__auto____2970 = o;

if(cljs.core.truth_(and__3546__auto____2970))
{return o.cljs$core$IEquiv$_equiv;
} else
{return and__3546__auto____2970;
}
})()))
{return o.cljs$core$IEquiv$_equiv(o,other);
} else
{return (function (){var or__3548__auto____2971 = (cljs.core._equiv[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2971))
{return or__3548__auto____2971;
} else
{var or__3548__auto____2972 = (cljs.core._equiv["_"]);

if(cljs.core.truth_(or__3548__auto____2972))
{return or__3548__auto____2972;
} else
{throw cljs.core.missing_protocol.call(null,"IEquiv.-equiv",o);
}
}
})().call(null,o,other);
}
});
cljs.core.IHash = {};
cljs.core._hash = (function _hash(o){
if(cljs.core.truth_((function (){var and__3546__auto____2973 = o;

if(cljs.core.truth_(and__3546__auto____2973))
{return o.cljs$core$IHash$_hash;
} else
{return and__3546__auto____2973;
}
})()))
{return o.cljs$core$IHash$_hash(o);
} else
{return (function (){var or__3548__auto____2974 = (cljs.core._hash[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2974))
{return or__3548__auto____2974;
} else
{var or__3548__auto____2975 = (cljs.core._hash["_"]);

if(cljs.core.truth_(or__3548__auto____2975))
{return or__3548__auto____2975;
} else
{throw cljs.core.missing_protocol.call(null,"IHash.-hash",o);
}
}
})().call(null,o);
}
});
cljs.core.ISeqable = {};
cljs.core._seq = (function _seq(o){
if(cljs.core.truth_((function (){var and__3546__auto____2976 = o;

if(cljs.core.truth_(and__3546__auto____2976))
{return o.cljs$core$ISeqable$_seq;
} else
{return and__3546__auto____2976;
}
})()))
{return o.cljs$core$ISeqable$_seq(o);
} else
{return (function (){var or__3548__auto____2977 = (cljs.core._seq[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2977))
{return or__3548__auto____2977;
} else
{var or__3548__auto____2978 = (cljs.core._seq["_"]);

if(cljs.core.truth_(or__3548__auto____2978))
{return or__3548__auto____2978;
} else
{throw cljs.core.missing_protocol.call(null,"ISeqable.-seq",o);
}
}
})().call(null,o);
}
});
cljs.core.ISequential = {};
cljs.core.IRecord = {};
cljs.core.IPrintable = {};
cljs.core._pr_seq = (function _pr_seq(o,opts){
if(cljs.core.truth_((function (){var and__3546__auto____2979 = o;

if(cljs.core.truth_(and__3546__auto____2979))
{return o.cljs$core$IPrintable$_pr_seq;
} else
{return and__3546__auto____2979;
}
})()))
{return o.cljs$core$IPrintable$_pr_seq(o,opts);
} else
{return (function (){var or__3548__auto____2980 = (cljs.core._pr_seq[goog.typeOf.call(null,o)]);

if(cljs.core.truth_(or__3548__auto____2980))
{return or__3548__auto____2980;
} else
{var or__3548__auto____2981 = (cljs.core._pr_seq["_"]);

if(cljs.core.truth_(or__3548__auto____2981))
{return or__3548__auto____2981;
} else
{throw cljs.core.missing_protocol.call(null,"IPrintable.-pr-seq",o);
}
}
})().call(null,o,opts);
}
});
cljs.core.IPending = {};
cljs.core._realized_QMARK_ = (function _realized_QMARK_(d){
if(cljs.core.truth_((function (){var and__3546__auto____2982 = d;

if(cljs.core.truth_(and__3546__auto____2982))
{return d.cljs$core$IPending$_realized_QMARK_;
} else
{return and__3546__auto____2982;
}
})()))
{return d.cljs$core$IPending$_realized_QMARK_(d);
} else
{return (function (){var or__3548__auto____2983 = (cljs.core._realized_QMARK_[goog.typeOf.call(null,d)]);

if(cljs.core.truth_(or__3548__auto____2983))
{return or__3548__auto____2983;
} else
{var or__3548__auto____2984 = (cljs.core._realized_QMARK_["_"]);

if(cljs.core.truth_(or__3548__auto____2984))
{return or__3548__auto____2984;
} else
{throw cljs.core.missing_protocol.call(null,"IPending.-realized?",d);
}
}
})().call(null,d);
}
});
cljs.core.IWatchable = {};
cljs.core._notify_watches = (function _notify_watches(this$,oldval,newval){
if(cljs.core.truth_((function (){var and__3546__auto____2985 = this$;

if(cljs.core.truth_(and__3546__auto____2985))
{return this$.cljs$core$IWatchable$_notify_watches;
} else
{return and__3546__auto____2985;
}
})()))
{return this$.cljs$core$IWatchable$_notify_watches(this$,oldval,newval);
} else
{return (function (){var or__3548__auto____2986 = (cljs.core._notify_watches[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2986))
{return or__3548__auto____2986;
} else
{var or__3548__auto____2987 = (cljs.core._notify_watches["_"]);

if(cljs.core.truth_(or__3548__auto____2987))
{return or__3548__auto____2987;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-notify-watches",this$);
}
}
})().call(null,this$,oldval,newval);
}
});
cljs.core._add_watch = (function _add_watch(this$,key,f){
if(cljs.core.truth_((function (){var and__3546__auto____2988 = this$;

if(cljs.core.truth_(and__3546__auto____2988))
{return this$.cljs$core$IWatchable$_add_watch;
} else
{return and__3546__auto____2988;
}
})()))
{return this$.cljs$core$IWatchable$_add_watch(this$,key,f);
} else
{return (function (){var or__3548__auto____2989 = (cljs.core._add_watch[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2989))
{return or__3548__auto____2989;
} else
{var or__3548__auto____2990 = (cljs.core._add_watch["_"]);

if(cljs.core.truth_(or__3548__auto____2990))
{return or__3548__auto____2990;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-add-watch",this$);
}
}
})().call(null,this$,key,f);
}
});
cljs.core._remove_watch = (function _remove_watch(this$,key){
if(cljs.core.truth_((function (){var and__3546__auto____2991 = this$;

if(cljs.core.truth_(and__3546__auto____2991))
{return this$.cljs$core$IWatchable$_remove_watch;
} else
{return and__3546__auto____2991;
}
})()))
{return this$.cljs$core$IWatchable$_remove_watch(this$,key);
} else
{return (function (){var or__3548__auto____2992 = (cljs.core._remove_watch[goog.typeOf.call(null,this$)]);

if(cljs.core.truth_(or__3548__auto____2992))
{return or__3548__auto____2992;
} else
{var or__3548__auto____2993 = (cljs.core._remove_watch["_"]);

if(cljs.core.truth_(or__3548__auto____2993))
{return or__3548__auto____2993;
} else
{throw cljs.core.missing_protocol.call(null,"IWatchable.-remove-watch",this$);
}
}
})().call(null,this$,key);
}
});
/**
* Tests if 2 arguments are the same object
*/
cljs.core.identical_QMARK_ = (function identical_QMARK_(x,y){
return (x === y);
});
/**
* Equality. Returns true if x equals y, false if not. Compares
* numbers and collections in a type-independent manner.  Clojure's immutable data
* structures define -equiv (and thus =) as a value, not an identity,
* comparison.
*/
cljs.core._EQ_ = (function _EQ_(x,y){
return cljs.core._equiv.call(null,x,y);
});
/**
* Returns true if x is nil, false otherwise.
*/
cljs.core.nil_QMARK_ = (function nil_QMARK_(x){
return (x === null);
});
cljs.core.type = (function type(x){
return (x).constructor;
});
(cljs.core.IHash["null"] = true);
(cljs.core._hash["null"] = (function (o){
return 0;
}));
(cljs.core.ILookup["null"] = true);
(cljs.core._lookup["null"] = (function() {
var G__2994 = null;
var G__2994__2995 = (function (o,k){
return null;
});
var G__2994__2996 = (function (o,k,not_found){
return not_found;
});
G__2994 = function(o,k,not_found){
switch(arguments.length){
case  2 :
return G__2994__2995.call(this,o,k);
case  3 :
return G__2994__2996.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__2994;
})()
);
(cljs.core.IAssociative["null"] = true);
(cljs.core._assoc["null"] = (function (_,k,v){
return cljs.core.hash_map.call(null,k,v);
}));
(cljs.core.ICollection["null"] = true);
(cljs.core._conj["null"] = (function (_,o){
return cljs.core.list.call(null,o);
}));
(cljs.core.IReduce["null"] = true);
(cljs.core._reduce["null"] = (function() {
var G__2998 = null;
var G__2998__2999 = (function (_,f){
return f.call(null);
});
var G__2998__3000 = (function (_,f,start){
return start;
});
G__2998 = function(_,f,start){
switch(arguments.length){
case  2 :
return G__2998__2999.call(this,_,f);
case  3 :
return G__2998__3000.call(this,_,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__2998;
})()
);
(cljs.core.IPrintable["null"] = true);
(cljs.core._pr_seq["null"] = (function (o){
return cljs.core.list.call(null,"nil");
}));
(cljs.core.ISet["null"] = true);
(cljs.core._disjoin["null"] = (function (_,v){
return null;
}));
(cljs.core.ICounted["null"] = true);
(cljs.core._count["null"] = (function (_){
return 0;
}));
(cljs.core.IStack["null"] = true);
(cljs.core._peek["null"] = (function (_){
return null;
}));
(cljs.core._pop["null"] = (function (_){
return null;
}));
(cljs.core.ISeq["null"] = true);
(cljs.core._first["null"] = (function (_){
return null;
}));
(cljs.core._rest["null"] = (function (_){
return cljs.core.list.call(null);
}));
(cljs.core.IEquiv["null"] = true);
(cljs.core._equiv["null"] = (function (_,o){
return (o === null);
}));
(cljs.core.IWithMeta["null"] = true);
(cljs.core._with_meta["null"] = (function (_,meta){
return null;
}));
(cljs.core.IMeta["null"] = true);
(cljs.core._meta["null"] = (function (_){
return null;
}));
(cljs.core.IIndexed["null"] = true);
(cljs.core._nth["null"] = (function() {
var G__3002 = null;
var G__3002__3003 = (function (_,n){
return null;
});
var G__3002__3004 = (function (_,n,not_found){
return not_found;
});
G__3002 = function(_,n,not_found){
switch(arguments.length){
case  2 :
return G__3002__3003.call(this,_,n);
case  3 :
return G__3002__3004.call(this,_,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3002;
})()
);
(cljs.core.IEmptyableCollection["null"] = true);
(cljs.core._empty["null"] = (function (_){
return null;
}));
(cljs.core.IMap["null"] = true);
(cljs.core._dissoc["null"] = (function (_,k){
return null;
}));
Date.prototype.cljs$core$IEquiv$ = true;
Date.prototype.cljs$core$IEquiv$_equiv = (function (o,other){
return (o.toString() === other.toString());
});
(cljs.core.IHash["number"] = true);
(cljs.core._hash["number"] = (function (o){
return o;
}));
(cljs.core.IEquiv["number"] = true);
(cljs.core._equiv["number"] = (function (x,o){
return (x === o);
}));
(cljs.core.IHash["boolean"] = true);
(cljs.core._hash["boolean"] = (function (o){
return ((o === true) ? 1 : 0);
}));
(cljs.core.IHash["function"] = true);
(cljs.core._hash["function"] = (function (o){
return goog.getUid.call(null,o);
}));
/**
* Returns a number one greater than num.
*/
cljs.core.inc = (function inc(x){
return (x + 1);
});
/**
* Accepts any collection which satisfies the ICount and IIndexed protocols and
* reduces them without incurring seq initialization
*/
cljs.core.ci_reduce = (function() {
var ci_reduce = null;
var ci_reduce__3012 = (function (cicoll,f){
if(cljs.core.truth_(cljs.core._EQ_.call(null,0,cljs.core._count.call(null,cicoll))))
{return f.call(null);
} else
{var val__3006 = cljs.core._nth.call(null,cicoll,0);
var n__3007 = 1;

while(true){
if(cljs.core.truth_((n__3007 < cljs.core._count.call(null,cicoll))))
{{
var G__3016 = f.call(null,val__3006,cljs.core._nth.call(null,cicoll,n__3007));
var G__3017 = (n__3007 + 1);
val__3006 = G__3016;
n__3007 = G__3017;
continue;
}
} else
{return val__3006;
}
break;
}
}
});
var ci_reduce__3013 = (function (cicoll,f,val){
var val__3008 = val;
var n__3009 = 0;

while(true){
if(cljs.core.truth_((n__3009 < cljs.core._count.call(null,cicoll))))
{{
var G__3018 = f.call(null,val__3008,cljs.core._nth.call(null,cicoll,n__3009));
var G__3019 = (n__3009 + 1);
val__3008 = G__3018;
n__3009 = G__3019;
continue;
}
} else
{return val__3008;
}
break;
}
});
var ci_reduce__3014 = (function (cicoll,f,val,idx){
var val__3010 = val;
var n__3011 = idx;

while(true){
if(cljs.core.truth_((n__3011 < cljs.core._count.call(null,cicoll))))
{{
var G__3020 = f.call(null,val__3010,cljs.core._nth.call(null,cicoll,n__3011));
var G__3021 = (n__3011 + 1);
val__3010 = G__3020;
n__3011 = G__3021;
continue;
}
} else
{return val__3010;
}
break;
}
});
ci_reduce = function(cicoll,f,val,idx){
switch(arguments.length){
case  2 :
return ci_reduce__3012.call(this,cicoll,f);
case  3 :
return ci_reduce__3013.call(this,cicoll,f,val);
case  4 :
return ci_reduce__3014.call(this,cicoll,f,val,idx);
}
throw('Invalid arity: ' + arguments.length);
};
return ci_reduce;
})()
;

/**
* @constructor
*/
cljs.core.IndexedSeq = (function (a,i){
this.a = a;
this.i = i;
})
cljs.core.IndexedSeq.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.IndexedSeq");
});
cljs.core.IndexedSeq.prototype.cljs$core$IHash$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3022 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IReduce$_reduce = (function() {
var G__3035 = null;
var G__3035__3036 = (function (_,f){
var this__3023 = this;
return cljs.core.ci_reduce.call(null,this__3023.a,f,(this__3023.a[this__3023.i]),(this__3023.i + 1));
});
var G__3035__3037 = (function (_,f,start){
var this__3024 = this;
return cljs.core.ci_reduce.call(null,this__3024.a,f,start,this__3024.i);
});
G__3035 = function(_,f,start){
switch(arguments.length){
case  2 :
return G__3035__3036.call(this,_,f);
case  3 :
return G__3035__3037.call(this,_,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3035;
})()
;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3025 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3026 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IIndexed$_nth = (function() {
var G__3039 = null;
var G__3039__3040 = (function (coll,n){
var this__3027 = this;
var i__3028 = (n + this__3027.i);

if(cljs.core.truth_((i__3028 < this__3027.a.length)))
{return (this__3027.a[i__3028]);
} else
{return null;
}
});
var G__3039__3041 = (function (coll,n,not_found){
var this__3029 = this;
var i__3030 = (n + this__3029.i);

if(cljs.core.truth_((i__3030 < this__3029.a.length)))
{return (this__3029.a[i__3030]);
} else
{return not_found;
}
});
G__3039 = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return G__3039__3040.call(this,coll,n);
case  3 :
return G__3039__3041.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3039;
})()
;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ICounted$_count = (function (_){
var this__3031 = this;
return (this__3031.a.length - this__3031.i);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_first = (function (_){
var this__3032 = this;
return (this__3032.a[this__3032.i]);
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeq$_rest = (function (_){
var this__3033 = this;
if(cljs.core.truth_(((this__3033.i + 1) < this__3033.a.length)))
{return (new cljs.core.IndexedSeq(this__3033.a,(this__3033.i + 1)));
} else
{return cljs.core.list.call(null);
}
});
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$ISeqable$_seq = (function (this$){
var this__3034 = this;
return this$;
});
cljs.core.IndexedSeq;
cljs.core.prim_seq = (function prim_seq(prim,i){
if(cljs.core.truth_(cljs.core._EQ_.call(null,0,prim.length)))
{return null;
} else
{return (new cljs.core.IndexedSeq(prim,i));
}
});
cljs.core.array_seq = (function array_seq(array,i){
return cljs.core.prim_seq.call(null,array,i);
});
(cljs.core.IReduce["array"] = true);
(cljs.core._reduce["array"] = (function() {
var G__3043 = null;
var G__3043__3044 = (function (array,f){
return cljs.core.ci_reduce.call(null,array,f);
});
var G__3043__3045 = (function (array,f,start){
return cljs.core.ci_reduce.call(null,array,f,start);
});
G__3043 = function(array,f,start){
switch(arguments.length){
case  2 :
return G__3043__3044.call(this,array,f);
case  3 :
return G__3043__3045.call(this,array,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3043;
})()
);
(cljs.core.ILookup["array"] = true);
(cljs.core._lookup["array"] = (function() {
var G__3047 = null;
var G__3047__3048 = (function (array,k){
return (array[k]);
});
var G__3047__3049 = (function (array,k,not_found){
return cljs.core._nth.call(null,array,k,not_found);
});
G__3047 = function(array,k,not_found){
switch(arguments.length){
case  2 :
return G__3047__3048.call(this,array,k);
case  3 :
return G__3047__3049.call(this,array,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3047;
})()
);
(cljs.core.IIndexed["array"] = true);
(cljs.core._nth["array"] = (function() {
var G__3051 = null;
var G__3051__3052 = (function (array,n){
if(cljs.core.truth_((n < array.length)))
{return (array[n]);
} else
{return null;
}
});
var G__3051__3053 = (function (array,n,not_found){
if(cljs.core.truth_((n < array.length)))
{return (array[n]);
} else
{return not_found;
}
});
G__3051 = function(array,n,not_found){
switch(arguments.length){
case  2 :
return G__3051__3052.call(this,array,n);
case  3 :
return G__3051__3053.call(this,array,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3051;
})()
);
(cljs.core.ICounted["array"] = true);
(cljs.core._count["array"] = (function (a){
return a.length;
}));
(cljs.core.ISeqable["array"] = true);
(cljs.core._seq["array"] = (function (array){
return cljs.core.array_seq.call(null,array,0);
}));
/**
* Returns a seq on the collection. If the collection is
* empty, returns nil.  (seq nil) returns nil. seq also works on
* Strings.
*/
cljs.core.seq = (function seq(coll){
if(cljs.core.truth_(coll))
{return cljs.core._seq.call(null,coll);
} else
{return null;
}
});
/**
* Returns the first item in the collection. Calls seq on its
* argument. If coll is nil, returns nil.
*/
cljs.core.first = (function first(coll){
var temp__3698__auto____3055 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3055))
{var s__3056 = temp__3698__auto____3055;

return cljs.core._first.call(null,s__3056);
} else
{return null;
}
});
/**
* Returns a possibly empty seq of the items after the first. Calls seq on its
* argument.
*/
cljs.core.rest = (function rest(coll){
return cljs.core._rest.call(null,cljs.core.seq.call(null,coll));
});
/**
* Returns a seq of the items after the first. Calls seq on its
* argument.  If there are no more items, returns nil
*/
cljs.core.next = (function next(coll){
if(cljs.core.truth_(coll))
{return cljs.core.seq.call(null,cljs.core.rest.call(null,coll));
} else
{return null;
}
});
/**
* Same as (first (next x))
*/
cljs.core.second = (function second(coll){
return cljs.core.first.call(null,cljs.core.next.call(null,coll));
});
/**
* Same as (first (first x))
*/
cljs.core.ffirst = (function ffirst(coll){
return cljs.core.first.call(null,cljs.core.first.call(null,coll));
});
/**
* Same as (next (first x))
*/
cljs.core.nfirst = (function nfirst(coll){
return cljs.core.next.call(null,cljs.core.first.call(null,coll));
});
/**
* Same as (first (next x))
*/
cljs.core.fnext = (function fnext(coll){
return cljs.core.first.call(null,cljs.core.next.call(null,coll));
});
/**
* Same as (next (next x))
*/
cljs.core.nnext = (function nnext(coll){
return cljs.core.next.call(null,cljs.core.next.call(null,coll));
});
/**
* Return the last item in coll, in linear time
*/
cljs.core.last = (function last(s){
while(true){
if(cljs.core.truth_(cljs.core.next.call(null,s)))
{{
var G__3057 = cljs.core.next.call(null,s);
s = G__3057;
continue;
}
} else
{return cljs.core.first.call(null,s);
}
break;
}
});
(cljs.core.ICounted["_"] = true);
(cljs.core._count["_"] = (function (x){
var s__3058 = cljs.core.seq.call(null,x);
var n__3059 = 0;

while(true){
if(cljs.core.truth_(s__3058))
{{
var G__3060 = cljs.core.next.call(null,s__3058);
var G__3061 = (n__3059 + 1);
s__3058 = G__3060;
n__3059 = G__3061;
continue;
}
} else
{return n__3059;
}
break;
}
}));
(cljs.core.IEquiv["_"] = true);
(cljs.core._equiv["_"] = (function (x,o){
return (x === o);
}));
/**
* Returns true if x is logical false, false otherwise.
*/
cljs.core.not = (function not(x){
if(cljs.core.truth_(x))
{return false;
} else
{return true;
}
});
/**
* conj[oin]. Returns a new collection with the xs
* 'added'. (conj nil item) returns (item).  The 'addition' may
* happen at different 'places' depending on the concrete type.
* @param {...*} var_args
*/
cljs.core.conj = (function() {
var conj = null;
var conj__3062 = (function (coll,x){
return cljs.core._conj.call(null,coll,x);
});
var conj__3063 = (function() { 
var G__3065__delegate = function (coll,x,xs){
while(true){
if(cljs.core.truth_(xs))
{{
var G__3066 = conj.call(null,coll,x);
var G__3067 = cljs.core.first.call(null,xs);
var G__3068 = cljs.core.next.call(null,xs);
coll = G__3066;
x = G__3067;
xs = G__3068;
continue;
}
} else
{return conj.call(null,coll,x);
}
break;
}
};
var G__3065 = function (coll,x,var_args){
var xs = null;
if (goog.isDef(var_args)) {
  xs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3065__delegate.call(this, coll, x, xs);
};
G__3065.cljs$lang$maxFixedArity = 2;
G__3065.cljs$lang$applyTo = (function (arglist__3069){
var coll = cljs.core.first(arglist__3069);
var x = cljs.core.first(cljs.core.next(arglist__3069));
var xs = cljs.core.rest(cljs.core.next(arglist__3069));
return G__3065__delegate.call(this, coll, x, xs);
});
return G__3065;
})()
;
conj = function(coll,x,var_args){
var xs = var_args;
switch(arguments.length){
case  2 :
return conj__3062.call(this,coll,x);
default:
return conj__3063.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
conj.cljs$lang$maxFixedArity = 2;
conj.cljs$lang$applyTo = conj__3063.cljs$lang$applyTo;
return conj;
})()
;
/**
* Returns an empty collection of the same category as coll, or nil
*/
cljs.core.empty = (function empty(coll){
return cljs.core._empty.call(null,coll);
});
/**
* Returns the number of items in the collection. (count nil) returns
* 0.  Also works on strings, arrays, and Maps
*/
cljs.core.count = (function count(coll){
return cljs.core._count.call(null,coll);
});
/**
* Returns the value at the index. get returns nil if index out of
* bounds, nth throws an exception unless not-found is supplied.  nth
* also works for strings, arrays, regex Matchers and Lists, and,
* in O(n) time, for sequences.
*/
cljs.core.nth = (function() {
var nth = null;
var nth__3070 = (function (coll,n){
return cljs.core._nth.call(null,coll,Math.floor(n));
});
var nth__3071 = (function (coll,n,not_found){
return cljs.core._nth.call(null,coll,Math.floor(n),not_found);
});
nth = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return nth__3070.call(this,coll,n);
case  3 :
return nth__3071.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return nth;
})()
;
/**
* Returns the value mapped to key, not-found or nil if key not present.
*/
cljs.core.get = (function() {
var get = null;
var get__3073 = (function (o,k){
return cljs.core._lookup.call(null,o,k);
});
var get__3074 = (function (o,k,not_found){
return cljs.core._lookup.call(null,o,k,not_found);
});
get = function(o,k,not_found){
switch(arguments.length){
case  2 :
return get__3073.call(this,o,k);
case  3 :
return get__3074.call(this,o,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return get;
})()
;
/**
* assoc[iate]. When applied to a map, returns a new map of the
* same (hashed/sorted) type, that contains the mapping of key(s) to
* val(s). When applied to a vector, returns a new vector that
* contains val at index.
* @param {...*} var_args
*/
cljs.core.assoc = (function() {
var assoc = null;
var assoc__3077 = (function (coll,k,v){
return cljs.core._assoc.call(null,coll,k,v);
});
var assoc__3078 = (function() { 
var G__3080__delegate = function (coll,k,v,kvs){
while(true){
var ret__3076 = assoc.call(null,coll,k,v);

if(cljs.core.truth_(kvs))
{{
var G__3081 = ret__3076;
var G__3082 = cljs.core.first.call(null,kvs);
var G__3083 = cljs.core.second.call(null,kvs);
var G__3084 = cljs.core.nnext.call(null,kvs);
coll = G__3081;
k = G__3082;
v = G__3083;
kvs = G__3084;
continue;
}
} else
{return ret__3076;
}
break;
}
};
var G__3080 = function (coll,k,v,var_args){
var kvs = null;
if (goog.isDef(var_args)) {
  kvs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3080__delegate.call(this, coll, k, v, kvs);
};
G__3080.cljs$lang$maxFixedArity = 3;
G__3080.cljs$lang$applyTo = (function (arglist__3085){
var coll = cljs.core.first(arglist__3085);
var k = cljs.core.first(cljs.core.next(arglist__3085));
var v = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3085)));
var kvs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3085)));
return G__3080__delegate.call(this, coll, k, v, kvs);
});
return G__3080;
})()
;
assoc = function(coll,k,v,var_args){
var kvs = var_args;
switch(arguments.length){
case  3 :
return assoc__3077.call(this,coll,k,v);
default:
return assoc__3078.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
assoc.cljs$lang$maxFixedArity = 3;
assoc.cljs$lang$applyTo = assoc__3078.cljs$lang$applyTo;
return assoc;
})()
;
/**
* dissoc[iate]. Returns a new map of the same (hashed/sorted) type,
* that does not contain a mapping for key(s).
* @param {...*} var_args
*/
cljs.core.dissoc = (function() {
var dissoc = null;
var dissoc__3087 = (function (coll){
return coll;
});
var dissoc__3088 = (function (coll,k){
return cljs.core._dissoc.call(null,coll,k);
});
var dissoc__3089 = (function() { 
var G__3091__delegate = function (coll,k,ks){
while(true){
var ret__3086 = dissoc.call(null,coll,k);

if(cljs.core.truth_(ks))
{{
var G__3092 = ret__3086;
var G__3093 = cljs.core.first.call(null,ks);
var G__3094 = cljs.core.next.call(null,ks);
coll = G__3092;
k = G__3093;
ks = G__3094;
continue;
}
} else
{return ret__3086;
}
break;
}
};
var G__3091 = function (coll,k,var_args){
var ks = null;
if (goog.isDef(var_args)) {
  ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3091__delegate.call(this, coll, k, ks);
};
G__3091.cljs$lang$maxFixedArity = 2;
G__3091.cljs$lang$applyTo = (function (arglist__3095){
var coll = cljs.core.first(arglist__3095);
var k = cljs.core.first(cljs.core.next(arglist__3095));
var ks = cljs.core.rest(cljs.core.next(arglist__3095));
return G__3091__delegate.call(this, coll, k, ks);
});
return G__3091;
})()
;
dissoc = function(coll,k,var_args){
var ks = var_args;
switch(arguments.length){
case  1 :
return dissoc__3087.call(this,coll);
case  2 :
return dissoc__3088.call(this,coll,k);
default:
return dissoc__3089.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
dissoc.cljs$lang$maxFixedArity = 2;
dissoc.cljs$lang$applyTo = dissoc__3089.cljs$lang$applyTo;
return dissoc;
})()
;
/**
* Returns an object of the same type and value as obj, with
* map m as its metadata.
*/
cljs.core.with_meta = (function with_meta(o,meta){
return cljs.core._with_meta.call(null,o,meta);
});
/**
* Returns the metadata of obj, returns nil if there is no metadata.
*/
cljs.core.meta = (function meta(o){
if(cljs.core.truth_((function (){var x__352__auto____3096 = o;

if(cljs.core.truth_((function (){var and__3546__auto____3097 = x__352__auto____3096;

if(cljs.core.truth_(and__3546__auto____3097))
{var and__3546__auto____3098 = x__352__auto____3096.cljs$core$IMeta$;

if(cljs.core.truth_(and__3546__auto____3098))
{return cljs.core.not.call(null,x__352__auto____3096.hasOwnProperty("cljs$core$IMeta$"));
} else
{return and__3546__auto____3098;
}
} else
{return and__3546__auto____3097;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,x__352__auto____3096);
}
})()))
{return cljs.core._meta.call(null,o);
} else
{return null;
}
});
/**
* For a list or queue, same as first, for a vector, same as, but much
* more efficient than, last. If the collection is empty, returns nil.
*/
cljs.core.peek = (function peek(coll){
return cljs.core._peek.call(null,coll);
});
/**
* For a list or queue, returns a new list/queue without the first
* item, for a vector, returns a new vector without the last item.
* Note - not the same as next/butlast.
*/
cljs.core.pop = (function pop(coll){
return cljs.core._pop.call(null,coll);
});
/**
* disj[oin]. Returns a new set of the same (hashed/sorted) type, that
* does not contain key(s).
* @param {...*} var_args
*/
cljs.core.disj = (function() {
var disj = null;
var disj__3100 = (function (coll){
return coll;
});
var disj__3101 = (function (coll,k){
return cljs.core._disjoin.call(null,coll,k);
});
var disj__3102 = (function() { 
var G__3104__delegate = function (coll,k,ks){
while(true){
var ret__3099 = disj.call(null,coll,k);

if(cljs.core.truth_(ks))
{{
var G__3105 = ret__3099;
var G__3106 = cljs.core.first.call(null,ks);
var G__3107 = cljs.core.next.call(null,ks);
coll = G__3105;
k = G__3106;
ks = G__3107;
continue;
}
} else
{return ret__3099;
}
break;
}
};
var G__3104 = function (coll,k,var_args){
var ks = null;
if (goog.isDef(var_args)) {
  ks = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3104__delegate.call(this, coll, k, ks);
};
G__3104.cljs$lang$maxFixedArity = 2;
G__3104.cljs$lang$applyTo = (function (arglist__3108){
var coll = cljs.core.first(arglist__3108);
var k = cljs.core.first(cljs.core.next(arglist__3108));
var ks = cljs.core.rest(cljs.core.next(arglist__3108));
return G__3104__delegate.call(this, coll, k, ks);
});
return G__3104;
})()
;
disj = function(coll,k,var_args){
var ks = var_args;
switch(arguments.length){
case  1 :
return disj__3100.call(this,coll);
case  2 :
return disj__3101.call(this,coll,k);
default:
return disj__3102.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
disj.cljs$lang$maxFixedArity = 2;
disj.cljs$lang$applyTo = disj__3102.cljs$lang$applyTo;
return disj;
})()
;
cljs.core.hash = (function hash(o){
return cljs.core._hash.call(null,o);
});
/**
* Returns true if coll has no items - same as (not (seq coll)).
* Please use the idiom (seq x) rather than (not (empty? x))
*/
cljs.core.empty_QMARK_ = (function empty_QMARK_(coll){
return cljs.core.not.call(null,cljs.core.seq.call(null,coll));
});
/**
* Returns true if x satisfies ICollection
*/
cljs.core.coll_QMARK_ = (function coll_QMARK_(x){
if(cljs.core.truth_((x === null)))
{return false;
} else
{var x__352__auto____3109 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3110 = x__352__auto____3109;

if(cljs.core.truth_(and__3546__auto____3110))
{var and__3546__auto____3111 = x__352__auto____3109.cljs$core$ICollection$;

if(cljs.core.truth_(and__3546__auto____3111))
{return cljs.core.not.call(null,x__352__auto____3109.hasOwnProperty("cljs$core$ICollection$"));
} else
{return and__3546__auto____3111;
}
} else
{return and__3546__auto____3110;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ICollection,x__352__auto____3109);
}
}
});
/**
* Returns true if x satisfies ISet
*/
cljs.core.set_QMARK_ = (function set_QMARK_(x){
if(cljs.core.truth_((x === null)))
{return false;
} else
{var x__352__auto____3112 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3113 = x__352__auto____3112;

if(cljs.core.truth_(and__3546__auto____3113))
{var and__3546__auto____3114 = x__352__auto____3112.cljs$core$ISet$;

if(cljs.core.truth_(and__3546__auto____3114))
{return cljs.core.not.call(null,x__352__auto____3112.hasOwnProperty("cljs$core$ISet$"));
} else
{return and__3546__auto____3114;
}
} else
{return and__3546__auto____3113;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISet,x__352__auto____3112);
}
}
});
/**
* Returns true if coll implements Associative
*/
cljs.core.associative_QMARK_ = (function associative_QMARK_(x){
var x__352__auto____3115 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3116 = x__352__auto____3115;

if(cljs.core.truth_(and__3546__auto____3116))
{var and__3546__auto____3117 = x__352__auto____3115.cljs$core$IAssociative$;

if(cljs.core.truth_(and__3546__auto____3117))
{return cljs.core.not.call(null,x__352__auto____3115.hasOwnProperty("cljs$core$IAssociative$"));
} else
{return and__3546__auto____3117;
}
} else
{return and__3546__auto____3116;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IAssociative,x__352__auto____3115);
}
});
/**
* Returns true if coll satisfies ISequential
*/
cljs.core.sequential_QMARK_ = (function sequential_QMARK_(x){
var x__352__auto____3118 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3119 = x__352__auto____3118;

if(cljs.core.truth_(and__3546__auto____3119))
{var and__3546__auto____3120 = x__352__auto____3118.cljs$core$ISequential$;

if(cljs.core.truth_(and__3546__auto____3120))
{return cljs.core.not.call(null,x__352__auto____3118.hasOwnProperty("cljs$core$ISequential$"));
} else
{return and__3546__auto____3120;
}
} else
{return and__3546__auto____3119;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISequential,x__352__auto____3118);
}
});
/**
* Returns true if coll implements count in constant time
*/
cljs.core.counted_QMARK_ = (function counted_QMARK_(x){
var x__352__auto____3121 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3122 = x__352__auto____3121;

if(cljs.core.truth_(and__3546__auto____3122))
{var and__3546__auto____3123 = x__352__auto____3121.cljs$core$ICounted$;

if(cljs.core.truth_(and__3546__auto____3123))
{return cljs.core.not.call(null,x__352__auto____3121.hasOwnProperty("cljs$core$ICounted$"));
} else
{return and__3546__auto____3123;
}
} else
{return and__3546__auto____3122;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ICounted,x__352__auto____3121);
}
});
/**
* Return true if x satisfies IMap
*/
cljs.core.map_QMARK_ = (function map_QMARK_(x){
if(cljs.core.truth_((x === null)))
{return false;
} else
{var x__352__auto____3124 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3125 = x__352__auto____3124;

if(cljs.core.truth_(and__3546__auto____3125))
{var and__3546__auto____3126 = x__352__auto____3124.cljs$core$IMap$;

if(cljs.core.truth_(and__3546__auto____3126))
{return cljs.core.not.call(null,x__352__auto____3124.hasOwnProperty("cljs$core$IMap$"));
} else
{return and__3546__auto____3126;
}
} else
{return and__3546__auto____3125;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMap,x__352__auto____3124);
}
}
});
/**
* Return true if x satisfies IVector
*/
cljs.core.vector_QMARK_ = (function vector_QMARK_(x){
var x__352__auto____3127 = x;

if(cljs.core.truth_((function (){var and__3546__auto____3128 = x__352__auto____3127;

if(cljs.core.truth_(and__3546__auto____3128))
{var and__3546__auto____3129 = x__352__auto____3127.cljs$core$IVector$;

if(cljs.core.truth_(and__3546__auto____3129))
{return cljs.core.not.call(null,x__352__auto____3127.hasOwnProperty("cljs$core$IVector$"));
} else
{return and__3546__auto____3129;
}
} else
{return and__3546__auto____3128;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IVector,x__352__auto____3127);
}
});
cljs.core.js_obj = (function js_obj(){
return {};
});
cljs.core.js_keys = (function js_keys(obj){
var keys__3130 = [];

goog.object.forEach.call(null,obj,(function (val,key,obj){
return keys__3130.push(key);
}));
return keys__3130;
});
cljs.core.js_delete = (function js_delete(obj,key){
return delete obj[key];
});
cljs.core.lookup_sentinel = cljs.core.js_obj.call(null);
/**
* Returns true if x is the value false, false otherwise.
*/
cljs.core.false_QMARK_ = (function false_QMARK_(x){
return x === false;
});
/**
* Returns true if x is the value true, false otherwise.
*/
cljs.core.true_QMARK_ = (function true_QMARK_(x){
return x === true;
});
cljs.core.undefined_QMARK_ = (function undefined_QMARK_(x){
return (void 0 === x);
});
cljs.core.instance_QMARK_ = (function instance_QMARK_(t,o){
return (o != null && (o instanceof t || o.constructor === t || t === Object));
});
/**
* Return true if s satisfies ISeq
*/
cljs.core.seq_QMARK_ = (function seq_QMARK_(s){
if(cljs.core.truth_((s === null)))
{return false;
} else
{var x__352__auto____3131 = s;

if(cljs.core.truth_((function (){var and__3546__auto____3132 = x__352__auto____3131;

if(cljs.core.truth_(and__3546__auto____3132))
{var and__3546__auto____3133 = x__352__auto____3131.cljs$core$ISeq$;

if(cljs.core.truth_(and__3546__auto____3133))
{return cljs.core.not.call(null,x__352__auto____3131.hasOwnProperty("cljs$core$ISeq$"));
} else
{return and__3546__auto____3133;
}
} else
{return and__3546__auto____3132;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.ISeq,x__352__auto____3131);
}
}
});
cljs.core.boolean$ = (function boolean$(x){
if(cljs.core.truth_(x))
{return true;
} else
{return false;
}
});
cljs.core.string_QMARK_ = (function string_QMARK_(x){
var and__3546__auto____3134 = goog.isString.call(null,x);

if(cljs.core.truth_(and__3546__auto____3134))
{return cljs.core.not.call(null,(function (){var or__3548__auto____3135 = cljs.core._EQ_.call(null,x.charAt(0),"\uFDD0");

if(cljs.core.truth_(or__3548__auto____3135))
{return or__3548__auto____3135;
} else
{return cljs.core._EQ_.call(null,x.charAt(0),"\uFDD1");
}
})());
} else
{return and__3546__auto____3134;
}
});
cljs.core.keyword_QMARK_ = (function keyword_QMARK_(x){
var and__3546__auto____3136 = goog.isString.call(null,x);

if(cljs.core.truth_(and__3546__auto____3136))
{return cljs.core._EQ_.call(null,x.charAt(0),"\uFDD0");
} else
{return and__3546__auto____3136;
}
});
cljs.core.symbol_QMARK_ = (function symbol_QMARK_(x){
var and__3546__auto____3137 = goog.isString.call(null,x);

if(cljs.core.truth_(and__3546__auto____3137))
{return cljs.core._EQ_.call(null,x.charAt(0),"\uFDD1");
} else
{return and__3546__auto____3137;
}
});
cljs.core.number_QMARK_ = (function number_QMARK_(n){
return goog.isNumber.call(null,n);
});
cljs.core.fn_QMARK_ = (function fn_QMARK_(f){
return goog.isFunction.call(null,f);
});
/**
* Returns true if n is an integer.  Warning: returns true on underflow condition.
*/
cljs.core.integer_QMARK_ = (function integer_QMARK_(n){
var and__3546__auto____3138 = cljs.core.number_QMARK_.call(null,n);

if(cljs.core.truth_(and__3546__auto____3138))
{return (n == n.toFixed());
} else
{return and__3546__auto____3138;
}
});
/**
* Returns true if key is present in the given collection, otherwise
* returns false.  Note that for numerically indexed collections like
* vectors and arrays, this tests if the numeric key is within the
* range of indexes. 'contains?' operates constant or logarithmic time;
* it will not perform a linear search for a value.  See also 'some'.
*/
cljs.core.contains_QMARK_ = (function contains_QMARK_(coll,v){
if(cljs.core.truth_((cljs.core._lookup.call(null,coll,v,cljs.core.lookup_sentinel) === cljs.core.lookup_sentinel)))
{return false;
} else
{return true;
}
});
/**
* Returns the map entry for key, or nil if key not present.
*/
cljs.core.find = (function find(coll,k){
if(cljs.core.truth_((function (){var and__3546__auto____3139 = coll;

if(cljs.core.truth_(and__3546__auto____3139))
{var and__3546__auto____3140 = cljs.core.associative_QMARK_.call(null,coll);

if(cljs.core.truth_(and__3546__auto____3140))
{return cljs.core.contains_QMARK_.call(null,coll,k);
} else
{return and__3546__auto____3140;
}
} else
{return and__3546__auto____3139;
}
})()))
{return cljs.core.Vector.fromArray([k,cljs.core._lookup.call(null,coll,k)]);
} else
{return null;
}
});
/**
* Returns true if no two of the arguments are =
* @param {...*} var_args
*/
cljs.core.distinct_QMARK_ = (function() {
var distinct_QMARK_ = null;
var distinct_QMARK___3145 = (function (x){
return true;
});
var distinct_QMARK___3146 = (function (x,y){
return cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y));
});
var distinct_QMARK___3147 = (function() { 
var G__3149__delegate = function (x,y,more){
if(cljs.core.truth_(cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y))))
{var s__3141 = cljs.core.set([y,x]);
var xs__3142 = more;

while(true){
var x__3143 = cljs.core.first.call(null,xs__3142);
var etc__3144 = cljs.core.next.call(null,xs__3142);

if(cljs.core.truth_(xs__3142))
{if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,s__3141,x__3143)))
{return false;
} else
{{
var G__3150 = cljs.core.conj.call(null,s__3141,x__3143);
var G__3151 = etc__3144;
s__3141 = G__3150;
xs__3142 = G__3151;
continue;
}
}
} else
{return true;
}
break;
}
} else
{return false;
}
};
var G__3149 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3149__delegate.call(this, x, y, more);
};
G__3149.cljs$lang$maxFixedArity = 2;
G__3149.cljs$lang$applyTo = (function (arglist__3152){
var x = cljs.core.first(arglist__3152);
var y = cljs.core.first(cljs.core.next(arglist__3152));
var more = cljs.core.rest(cljs.core.next(arglist__3152));
return G__3149__delegate.call(this, x, y, more);
});
return G__3149;
})()
;
distinct_QMARK_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return distinct_QMARK___3145.call(this,x);
case  2 :
return distinct_QMARK___3146.call(this,x,y);
default:
return distinct_QMARK___3147.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
distinct_QMARK_.cljs$lang$maxFixedArity = 2;
distinct_QMARK_.cljs$lang$applyTo = distinct_QMARK___3147.cljs$lang$applyTo;
return distinct_QMARK_;
})()
;
/**
* Comparator. Returns a negative number, zero, or a positive number
* when x is logically 'less than', 'equal to', or 'greater than'
* y. Uses google.array.defaultCompare.
*/
cljs.core.compare = (function compare(x,y){
return goog.array.defaultCompare.call(null,x,y);
});
/**
* Given a fn that might be boolean valued or a comparator,
* return a fn that is a comparator.
*/
cljs.core.fn__GT_comparator = (function fn__GT_comparator(f){
if(cljs.core.truth_(cljs.core._EQ_.call(null,f,cljs.core.compare)))
{return cljs.core.compare;
} else
{return (function (x,y){
var r__3153 = f.call(null,x,y);

if(cljs.core.truth_(cljs.core.number_QMARK_.call(null,r__3153)))
{return r__3153;
} else
{if(cljs.core.truth_(r__3153))
{return -1;
} else
{if(cljs.core.truth_(f.call(null,y,x)))
{return 1;
} else
{return 0;
}
}
}
});
}
});
/**
* Returns a sorted sequence of the items in coll. Comp can be
* boolean-valued comparison funcion, or a -/0/+ valued comparator.
* Comp defaults to compare.
*/
cljs.core.sort = (function() {
var sort = null;
var sort__3155 = (function (coll){
return sort.call(null,cljs.core.compare,coll);
});
var sort__3156 = (function (comp,coll){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{var a__3154 = cljs.core.to_array.call(null,coll);

goog.array.stableSort.call(null,a__3154,cljs.core.fn__GT_comparator.call(null,comp));
return cljs.core.seq.call(null,a__3154);
} else
{return cljs.core.List.EMPTY;
}
});
sort = function(comp,coll){
switch(arguments.length){
case  1 :
return sort__3155.call(this,comp);
case  2 :
return sort__3156.call(this,comp,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return sort;
})()
;
/**
* Returns a sorted sequence of the items in coll, where the sort
* order is determined by comparing (keyfn item).  Comp can be
* boolean-valued comparison funcion, or a -/0/+ valued comparator.
* Comp defaults to compare.
*/
cljs.core.sort_by = (function() {
var sort_by = null;
var sort_by__3158 = (function (keyfn,coll){
return sort_by.call(null,keyfn,cljs.core.compare,coll);
});
var sort_by__3159 = (function (keyfn,comp,coll){
return cljs.core.sort.call(null,(function (x,y){
return cljs.core.fn__GT_comparator.call(null,comp).call(null,keyfn.call(null,x),keyfn.call(null,y));
}),coll);
});
sort_by = function(keyfn,comp,coll){
switch(arguments.length){
case  2 :
return sort_by__3158.call(this,keyfn,comp);
case  3 :
return sort_by__3159.call(this,keyfn,comp,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return sort_by;
})()
;
/**
* f should be a function of 2 arguments. If val is not supplied,
* returns the result of applying f to the first 2 items in coll, then
* applying f to that result and the 3rd item, etc. If coll contains no
* items, f must accept no arguments as well, and reduce returns the
* result of calling f with no arguments.  If coll has only 1 item, it
* is returned and f is not called.  If val is supplied, returns the
* result of applying f to val and the first item in coll, then
* applying f to that result and the 2nd item, etc. If coll contains no
* items, returns val and f is not called.
*/
cljs.core.reduce = (function() {
var reduce = null;
var reduce__3161 = (function (f,coll){
return cljs.core._reduce.call(null,coll,f);
});
var reduce__3162 = (function (f,val,coll){
return cljs.core._reduce.call(null,coll,f,val);
});
reduce = function(f,val,coll){
switch(arguments.length){
case  2 :
return reduce__3161.call(this,f,val);
case  3 :
return reduce__3162.call(this,f,val,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return reduce;
})()
;
cljs.core.seq_reduce = (function() {
var seq_reduce = null;
var seq_reduce__3168 = (function (f,coll){
var temp__3695__auto____3164 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3695__auto____3164))
{var s__3165 = temp__3695__auto____3164;

return cljs.core.reduce.call(null,f,cljs.core.first.call(null,s__3165),cljs.core.next.call(null,s__3165));
} else
{return f.call(null);
}
});
var seq_reduce__3169 = (function (f,val,coll){
var val__3166 = val;
var coll__3167 = cljs.core.seq.call(null,coll);

while(true){
if(cljs.core.truth_(coll__3167))
{{
var G__3171 = f.call(null,val__3166,cljs.core.first.call(null,coll__3167));
var G__3172 = cljs.core.next.call(null,coll__3167);
val__3166 = G__3171;
coll__3167 = G__3172;
continue;
}
} else
{return val__3166;
}
break;
}
});
seq_reduce = function(f,val,coll){
switch(arguments.length){
case  2 :
return seq_reduce__3168.call(this,f,val);
case  3 :
return seq_reduce__3169.call(this,f,val,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return seq_reduce;
})()
;
(cljs.core.IReduce["_"] = true);
(cljs.core._reduce["_"] = (function() {
var G__3173 = null;
var G__3173__3174 = (function (coll,f){
return cljs.core.seq_reduce.call(null,f,coll);
});
var G__3173__3175 = (function (coll,f,start){
return cljs.core.seq_reduce.call(null,f,start,coll);
});
G__3173 = function(coll,f,start){
switch(arguments.length){
case  2 :
return G__3173__3174.call(this,coll,f);
case  3 :
return G__3173__3175.call(this,coll,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3173;
})()
);
/**
* Returns the sum of nums. (+) returns 0.
* @param {...*} var_args
*/
cljs.core._PLUS_ = (function() {
var _PLUS_ = null;
var _PLUS___3177 = (function (){
return 0;
});
var _PLUS___3178 = (function (x){
return x;
});
var _PLUS___3179 = (function (x,y){
return (x + y);
});
var _PLUS___3180 = (function() { 
var G__3182__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_PLUS_,(x + y),more);
};
var G__3182 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3182__delegate.call(this, x, y, more);
};
G__3182.cljs$lang$maxFixedArity = 2;
G__3182.cljs$lang$applyTo = (function (arglist__3183){
var x = cljs.core.first(arglist__3183);
var y = cljs.core.first(cljs.core.next(arglist__3183));
var more = cljs.core.rest(cljs.core.next(arglist__3183));
return G__3182__delegate.call(this, x, y, more);
});
return G__3182;
})()
;
_PLUS_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  0 :
return _PLUS___3177.call(this);
case  1 :
return _PLUS___3178.call(this,x);
case  2 :
return _PLUS___3179.call(this,x,y);
default:
return _PLUS___3180.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_PLUS_.cljs$lang$maxFixedArity = 2;
_PLUS_.cljs$lang$applyTo = _PLUS___3180.cljs$lang$applyTo;
return _PLUS_;
})()
;
/**
* If no ys are supplied, returns the negation of x, else subtracts
* the ys from x and returns the result.
* @param {...*} var_args
*/
cljs.core._ = (function() {
var _ = null;
var ___3184 = (function (x){
return (- x);
});
var ___3185 = (function (x,y){
return (x - y);
});
var ___3186 = (function() { 
var G__3188__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_,(x - y),more);
};
var G__3188 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3188__delegate.call(this, x, y, more);
};
G__3188.cljs$lang$maxFixedArity = 2;
G__3188.cljs$lang$applyTo = (function (arglist__3189){
var x = cljs.core.first(arglist__3189);
var y = cljs.core.first(cljs.core.next(arglist__3189));
var more = cljs.core.rest(cljs.core.next(arglist__3189));
return G__3188__delegate.call(this, x, y, more);
});
return G__3188;
})()
;
_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return ___3184.call(this,x);
case  2 :
return ___3185.call(this,x,y);
default:
return ___3186.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_.cljs$lang$maxFixedArity = 2;
_.cljs$lang$applyTo = ___3186.cljs$lang$applyTo;
return _;
})()
;
/**
* Returns the product of nums. (*) returns 1.
* @param {...*} var_args
*/
cljs.core._STAR_ = (function() {
var _STAR_ = null;
var _STAR___3190 = (function (){
return 1;
});
var _STAR___3191 = (function (x){
return x;
});
var _STAR___3192 = (function (x,y){
return (x * y);
});
var _STAR___3193 = (function() { 
var G__3195__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_STAR_,(x * y),more);
};
var G__3195 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3195__delegate.call(this, x, y, more);
};
G__3195.cljs$lang$maxFixedArity = 2;
G__3195.cljs$lang$applyTo = (function (arglist__3196){
var x = cljs.core.first(arglist__3196);
var y = cljs.core.first(cljs.core.next(arglist__3196));
var more = cljs.core.rest(cljs.core.next(arglist__3196));
return G__3195__delegate.call(this, x, y, more);
});
return G__3195;
})()
;
_STAR_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  0 :
return _STAR___3190.call(this);
case  1 :
return _STAR___3191.call(this,x);
case  2 :
return _STAR___3192.call(this,x,y);
default:
return _STAR___3193.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_STAR_.cljs$lang$maxFixedArity = 2;
_STAR_.cljs$lang$applyTo = _STAR___3193.cljs$lang$applyTo;
return _STAR_;
})()
;
/**
* If no denominators are supplied, returns 1/numerator,
* else returns numerator divided by all of the denominators.
* @param {...*} var_args
*/
cljs.core._SLASH_ = (function() {
var _SLASH_ = null;
var _SLASH___3197 = (function (x){
return _SLASH_.call(null,1,x);
});
var _SLASH___3198 = (function (x,y){
return (x / y);
});
var _SLASH___3199 = (function() { 
var G__3201__delegate = function (x,y,more){
return cljs.core.reduce.call(null,_SLASH_,_SLASH_.call(null,x,y),more);
};
var G__3201 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3201__delegate.call(this, x, y, more);
};
G__3201.cljs$lang$maxFixedArity = 2;
G__3201.cljs$lang$applyTo = (function (arglist__3202){
var x = cljs.core.first(arglist__3202);
var y = cljs.core.first(cljs.core.next(arglist__3202));
var more = cljs.core.rest(cljs.core.next(arglist__3202));
return G__3201__delegate.call(this, x, y, more);
});
return G__3201;
})()
;
_SLASH_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _SLASH___3197.call(this,x);
case  2 :
return _SLASH___3198.call(this,x,y);
default:
return _SLASH___3199.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_SLASH_.cljs$lang$maxFixedArity = 2;
_SLASH_.cljs$lang$applyTo = _SLASH___3199.cljs$lang$applyTo;
return _SLASH_;
})()
;
/**
* Returns non-nil if nums are in monotonically increasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._LT_ = (function() {
var _LT_ = null;
var _LT___3203 = (function (x){
return true;
});
var _LT___3204 = (function (x,y){
return (x < y);
});
var _LT___3205 = (function() { 
var G__3207__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_((x < y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__3208 = y;
var G__3209 = cljs.core.first.call(null,more);
var G__3210 = cljs.core.next.call(null,more);
x = G__3208;
y = G__3209;
more = G__3210;
continue;
}
} else
{return (y < cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__3207 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3207__delegate.call(this, x, y, more);
};
G__3207.cljs$lang$maxFixedArity = 2;
G__3207.cljs$lang$applyTo = (function (arglist__3211){
var x = cljs.core.first(arglist__3211);
var y = cljs.core.first(cljs.core.next(arglist__3211));
var more = cljs.core.rest(cljs.core.next(arglist__3211));
return G__3207__delegate.call(this, x, y, more);
});
return G__3207;
})()
;
_LT_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _LT___3203.call(this,x);
case  2 :
return _LT___3204.call(this,x,y);
default:
return _LT___3205.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_LT_.cljs$lang$maxFixedArity = 2;
_LT_.cljs$lang$applyTo = _LT___3205.cljs$lang$applyTo;
return _LT_;
})()
;
/**
* Returns non-nil if nums are in monotonically non-decreasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._LT__EQ_ = (function() {
var _LT__EQ_ = null;
var _LT__EQ___3212 = (function (x){
return true;
});
var _LT__EQ___3213 = (function (x,y){
return (x <= y);
});
var _LT__EQ___3214 = (function() { 
var G__3216__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_((x <= y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__3217 = y;
var G__3218 = cljs.core.first.call(null,more);
var G__3219 = cljs.core.next.call(null,more);
x = G__3217;
y = G__3218;
more = G__3219;
continue;
}
} else
{return (y <= cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__3216 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3216__delegate.call(this, x, y, more);
};
G__3216.cljs$lang$maxFixedArity = 2;
G__3216.cljs$lang$applyTo = (function (arglist__3220){
var x = cljs.core.first(arglist__3220);
var y = cljs.core.first(cljs.core.next(arglist__3220));
var more = cljs.core.rest(cljs.core.next(arglist__3220));
return G__3216__delegate.call(this, x, y, more);
});
return G__3216;
})()
;
_LT__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _LT__EQ___3212.call(this,x);
case  2 :
return _LT__EQ___3213.call(this,x,y);
default:
return _LT__EQ___3214.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_LT__EQ_.cljs$lang$maxFixedArity = 2;
_LT__EQ_.cljs$lang$applyTo = _LT__EQ___3214.cljs$lang$applyTo;
return _LT__EQ_;
})()
;
/**
* Returns non-nil if nums are in monotonically decreasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._GT_ = (function() {
var _GT_ = null;
var _GT___3221 = (function (x){
return true;
});
var _GT___3222 = (function (x,y){
return (x > y);
});
var _GT___3223 = (function() { 
var G__3225__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_((x > y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__3226 = y;
var G__3227 = cljs.core.first.call(null,more);
var G__3228 = cljs.core.next.call(null,more);
x = G__3226;
y = G__3227;
more = G__3228;
continue;
}
} else
{return (y > cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__3225 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3225__delegate.call(this, x, y, more);
};
G__3225.cljs$lang$maxFixedArity = 2;
G__3225.cljs$lang$applyTo = (function (arglist__3229){
var x = cljs.core.first(arglist__3229);
var y = cljs.core.first(cljs.core.next(arglist__3229));
var more = cljs.core.rest(cljs.core.next(arglist__3229));
return G__3225__delegate.call(this, x, y, more);
});
return G__3225;
})()
;
_GT_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _GT___3221.call(this,x);
case  2 :
return _GT___3222.call(this,x,y);
default:
return _GT___3223.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_GT_.cljs$lang$maxFixedArity = 2;
_GT_.cljs$lang$applyTo = _GT___3223.cljs$lang$applyTo;
return _GT_;
})()
;
/**
* Returns non-nil if nums are in monotonically non-increasing order,
* otherwise false.
* @param {...*} var_args
*/
cljs.core._GT__EQ_ = (function() {
var _GT__EQ_ = null;
var _GT__EQ___3230 = (function (x){
return true;
});
var _GT__EQ___3231 = (function (x,y){
return (x >= y);
});
var _GT__EQ___3232 = (function() { 
var G__3234__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_((x >= y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__3235 = y;
var G__3236 = cljs.core.first.call(null,more);
var G__3237 = cljs.core.next.call(null,more);
x = G__3235;
y = G__3236;
more = G__3237;
continue;
}
} else
{return (y >= cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__3234 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3234__delegate.call(this, x, y, more);
};
G__3234.cljs$lang$maxFixedArity = 2;
G__3234.cljs$lang$applyTo = (function (arglist__3238){
var x = cljs.core.first(arglist__3238);
var y = cljs.core.first(cljs.core.next(arglist__3238));
var more = cljs.core.rest(cljs.core.next(arglist__3238));
return G__3234__delegate.call(this, x, y, more);
});
return G__3234;
})()
;
_GT__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _GT__EQ___3230.call(this,x);
case  2 :
return _GT__EQ___3231.call(this,x,y);
default:
return _GT__EQ___3232.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_GT__EQ_.cljs$lang$maxFixedArity = 2;
_GT__EQ_.cljs$lang$applyTo = _GT__EQ___3232.cljs$lang$applyTo;
return _GT__EQ_;
})()
;
/**
* Returns a number one less than num.
*/
cljs.core.dec = (function dec(x){
return (x - 1);
});
/**
* Returns the greatest of the nums.
* @param {...*} var_args
*/
cljs.core.max = (function() {
var max = null;
var max__3239 = (function (x){
return x;
});
var max__3240 = (function (x,y){
return ((x > y) ? x : y);
});
var max__3241 = (function() { 
var G__3243__delegate = function (x,y,more){
return cljs.core.reduce.call(null,max,((x > y) ? x : y),more);
};
var G__3243 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3243__delegate.call(this, x, y, more);
};
G__3243.cljs$lang$maxFixedArity = 2;
G__3243.cljs$lang$applyTo = (function (arglist__3244){
var x = cljs.core.first(arglist__3244);
var y = cljs.core.first(cljs.core.next(arglist__3244));
var more = cljs.core.rest(cljs.core.next(arglist__3244));
return G__3243__delegate.call(this, x, y, more);
});
return G__3243;
})()
;
max = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return max__3239.call(this,x);
case  2 :
return max__3240.call(this,x,y);
default:
return max__3241.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
max.cljs$lang$maxFixedArity = 2;
max.cljs$lang$applyTo = max__3241.cljs$lang$applyTo;
return max;
})()
;
/**
* Returns the least of the nums.
* @param {...*} var_args
*/
cljs.core.min = (function() {
var min = null;
var min__3245 = (function (x){
return x;
});
var min__3246 = (function (x,y){
return ((x < y) ? x : y);
});
var min__3247 = (function() { 
var G__3249__delegate = function (x,y,more){
return cljs.core.reduce.call(null,min,((x < y) ? x : y),more);
};
var G__3249 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3249__delegate.call(this, x, y, more);
};
G__3249.cljs$lang$maxFixedArity = 2;
G__3249.cljs$lang$applyTo = (function (arglist__3250){
var x = cljs.core.first(arglist__3250);
var y = cljs.core.first(cljs.core.next(arglist__3250));
var more = cljs.core.rest(cljs.core.next(arglist__3250));
return G__3249__delegate.call(this, x, y, more);
});
return G__3249;
})()
;
min = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return min__3245.call(this,x);
case  2 :
return min__3246.call(this,x,y);
default:
return min__3247.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
min.cljs$lang$maxFixedArity = 2;
min.cljs$lang$applyTo = min__3247.cljs$lang$applyTo;
return min;
})()
;
cljs.core.fix = (function fix(q){
if(cljs.core.truth_((q >= 0)))
{return Math.floor.call(null,q);
} else
{return Math.ceil.call(null,q);
}
});
/**
* Modulus of num and div. Truncates toward negative infinity.
*/
cljs.core.mod = (function mod(n,d){
return (n % d);
});
/**
* quot[ient] of dividing numerator by denominator.
*/
cljs.core.quot = (function quot(n,d){
var rem__3251 = (n % d);

return cljs.core.fix.call(null,((n - rem__3251) / d));
});
/**
* remainder of dividing numerator by denominator.
*/
cljs.core.rem = (function rem(n,d){
var q__3252 = cljs.core.quot.call(null,n,d);

return (n - (d * q__3252));
});
/**
* Returns a random floating point number between 0 (inclusive) and n (default 1) (exclusive).
*/
cljs.core.rand = (function() {
var rand = null;
var rand__3253 = (function (){
return Math.random.call(null);
});
var rand__3254 = (function (n){
return (n * rand.call(null));
});
rand = function(n){
switch(arguments.length){
case  0 :
return rand__3253.call(this);
case  1 :
return rand__3254.call(this,n);
}
throw('Invalid arity: ' + arguments.length);
};
return rand;
})()
;
/**
* Returns a random integer between 0 (inclusive) and n (exclusive).
*/
cljs.core.rand_int = (function rand_int(n){
return cljs.core.fix.call(null,cljs.core.rand.call(null,n));
});
/**
* Bitwise exclusive or
*/
cljs.core.bit_xor = (function bit_xor(x,y){
return (x ^ y);
});
/**
* Bitwise and
*/
cljs.core.bit_and = (function bit_and(x,y){
return (x & y);
});
/**
* Bitwise or
*/
cljs.core.bit_or = (function bit_or(x,y){
return (x | y);
});
/**
* Bitwise and
*/
cljs.core.bit_and_not = (function bit_and_not(x,y){
return (x & ~y);
});
/**
* Clear bit at index n
*/
cljs.core.bit_clear = (function bit_clear(x,n){
return (x & ~(1 << n));
});
/**
* Flip bit at index n
*/
cljs.core.bit_flip = (function bit_flip(x,n){
return (x ^ (1 << n));
});
/**
* Bitwise complement
*/
cljs.core.bit_not = (function bit_not(x){
return (~ x);
});
/**
* Set bit at index n
*/
cljs.core.bit_set = (function bit_set(x,n){
return (x | (1 << n));
});
/**
* Test bit at index n
*/
cljs.core.bit_test = (function bit_test(x,n){
return ((x & (1 << n)) != 0);
});
/**
* Bitwise shift left
*/
cljs.core.bit_shift_left = (function bit_shift_left(x,n){
return (x << n);
});
/**
* Bitwise shift right
*/
cljs.core.bit_shift_right = (function bit_shift_right(x,n){
return (x >> n);
});
/**
* Returns non-nil if nums all have the equivalent
* value (type-independent), otherwise false
* @param {...*} var_args
*/
cljs.core._EQ__EQ_ = (function() {
var _EQ__EQ_ = null;
var _EQ__EQ___3256 = (function (x){
return true;
});
var _EQ__EQ___3257 = (function (x,y){
return cljs.core._equiv.call(null,x,y);
});
var _EQ__EQ___3258 = (function() { 
var G__3260__delegate = function (x,y,more){
while(true){
if(cljs.core.truth_(_EQ__EQ_.call(null,x,y)))
{if(cljs.core.truth_(cljs.core.next.call(null,more)))
{{
var G__3261 = y;
var G__3262 = cljs.core.first.call(null,more);
var G__3263 = cljs.core.next.call(null,more);
x = G__3261;
y = G__3262;
more = G__3263;
continue;
}
} else
{return _EQ__EQ_.call(null,y,cljs.core.first.call(null,more));
}
} else
{return false;
}
break;
}
};
var G__3260 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3260__delegate.call(this, x, y, more);
};
G__3260.cljs$lang$maxFixedArity = 2;
G__3260.cljs$lang$applyTo = (function (arglist__3264){
var x = cljs.core.first(arglist__3264);
var y = cljs.core.first(cljs.core.next(arglist__3264));
var more = cljs.core.rest(cljs.core.next(arglist__3264));
return G__3260__delegate.call(this, x, y, more);
});
return G__3260;
})()
;
_EQ__EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return _EQ__EQ___3256.call(this,x);
case  2 :
return _EQ__EQ___3257.call(this,x,y);
default:
return _EQ__EQ___3258.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
_EQ__EQ_.cljs$lang$maxFixedArity = 2;
_EQ__EQ_.cljs$lang$applyTo = _EQ__EQ___3258.cljs$lang$applyTo;
return _EQ__EQ_;
})()
;
/**
* Returns true if num is greater than zero, else false
*/
cljs.core.pos_QMARK_ = (function pos_QMARK_(n){
return (n > 0);
});
cljs.core.zero_QMARK_ = (function zero_QMARK_(n){
return (n === 0);
});
/**
* Returns true if num is less than zero, else false
*/
cljs.core.neg_QMARK_ = (function neg_QMARK_(x){
return (x < 0);
});
/**
* Returns the nth next of coll, (seq coll) when n is 0.
*/
cljs.core.nthnext = (function nthnext(coll,n){
var n__3265 = n;
var xs__3266 = cljs.core.seq.call(null,coll);

while(true){
if(cljs.core.truth_((function (){var and__3546__auto____3267 = xs__3266;

if(cljs.core.truth_(and__3546__auto____3267))
{return (n__3265 > 0);
} else
{return and__3546__auto____3267;
}
})()))
{{
var G__3268 = (n__3265 - 1);
var G__3269 = cljs.core.next.call(null,xs__3266);
n__3265 = G__3268;
xs__3266 = G__3269;
continue;
}
} else
{return xs__3266;
}
break;
}
});
(cljs.core.IIndexed["_"] = true);
(cljs.core._nth["_"] = (function() {
var G__3274 = null;
var G__3274__3275 = (function (coll,n){
var temp__3695__auto____3270 = cljs.core.nthnext.call(null,coll,n);

if(cljs.core.truth_(temp__3695__auto____3270))
{var xs__3271 = temp__3695__auto____3270;

return cljs.core.first.call(null,xs__3271);
} else
{throw (new Error("Index out of bounds"));
}
});
var G__3274__3276 = (function (coll,n,not_found){
var temp__3695__auto____3272 = cljs.core.nthnext.call(null,coll,n);

if(cljs.core.truth_(temp__3695__auto____3272))
{var xs__3273 = temp__3695__auto____3272;

return cljs.core.first.call(null,xs__3273);
} else
{return not_found;
}
});
G__3274 = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return G__3274__3275.call(this,coll,n);
case  3 :
return G__3274__3276.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3274;
})()
);
/**
* Internal - do not use!
* @param {...*} var_args
*/
cljs.core.str_STAR_ = (function() {
var str_STAR_ = null;
var str_STAR___3278 = (function (){
return "";
});
var str_STAR___3279 = (function (x){
if(cljs.core.truth_((x === null)))
{return "";
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return x.toString();
} else
{return null;
}
}
});
var str_STAR___3280 = (function() { 
var G__3282__delegate = function (x,ys){
return (function (sb,more){
while(true){
if(cljs.core.truth_(more))
{{
var G__3283 = sb.append(str_STAR_.call(null,cljs.core.first.call(null,more)));
var G__3284 = cljs.core.next.call(null,more);
sb = G__3283;
more = G__3284;
continue;
}
} else
{return str_STAR_.call(null,sb);
}
break;
}
}).call(null,(new goog.string.StringBuffer(str_STAR_.call(null,x))),ys);
};
var G__3282 = function (x,var_args){
var ys = null;
if (goog.isDef(var_args)) {
  ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__3282__delegate.call(this, x, ys);
};
G__3282.cljs$lang$maxFixedArity = 1;
G__3282.cljs$lang$applyTo = (function (arglist__3285){
var x = cljs.core.first(arglist__3285);
var ys = cljs.core.rest(arglist__3285);
return G__3282__delegate.call(this, x, ys);
});
return G__3282;
})()
;
str_STAR_ = function(x,var_args){
var ys = var_args;
switch(arguments.length){
case  0 :
return str_STAR___3278.call(this);
case  1 :
return str_STAR___3279.call(this,x);
default:
return str_STAR___3280.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
str_STAR_.cljs$lang$maxFixedArity = 1;
str_STAR_.cljs$lang$applyTo = str_STAR___3280.cljs$lang$applyTo;
return str_STAR_;
})()
;
/**
* With no args, returns the empty string. With one arg x, returns
* x.toString().  (str nil) returns the empty string. With more than
* one arg, returns the concatenation of the str values of the args.
* @param {...*} var_args
*/
cljs.core.str = (function() {
var str = null;
var str__3286 = (function (){
return "";
});
var str__3287 = (function (x){
if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null,x)))
{return x.substring(2,x.length);
} else
{if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null,x)))
{return cljs.core.str_STAR_.call(null,":",x.substring(2,x.length));
} else
{if(cljs.core.truth_((x === null)))
{return "";
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return x.toString();
} else
{return null;
}
}
}
}
});
var str__3288 = (function() { 
var G__3290__delegate = function (x,ys){
return cljs.core.apply.call(null,cljs.core.str_STAR_,x,ys);
};
var G__3290 = function (x,var_args){
var ys = null;
if (goog.isDef(var_args)) {
  ys = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__3290__delegate.call(this, x, ys);
};
G__3290.cljs$lang$maxFixedArity = 1;
G__3290.cljs$lang$applyTo = (function (arglist__3291){
var x = cljs.core.first(arglist__3291);
var ys = cljs.core.rest(arglist__3291);
return G__3290__delegate.call(this, x, ys);
});
return G__3290;
})()
;
str = function(x,var_args){
var ys = var_args;
switch(arguments.length){
case  0 :
return str__3286.call(this);
case  1 :
return str__3287.call(this,x);
default:
return str__3288.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
str.cljs$lang$maxFixedArity = 1;
str.cljs$lang$applyTo = str__3288.cljs$lang$applyTo;
return str;
})()
;
/**
* Returns the substring of s beginning at start inclusive, and ending
* at end (defaults to length of string), exclusive.
*/
cljs.core.subs = (function() {
var subs = null;
var subs__3292 = (function (s,start){
return s.substring(start);
});
var subs__3293 = (function (s,start,end){
return s.substring(start,end);
});
subs = function(s,start,end){
switch(arguments.length){
case  2 :
return subs__3292.call(this,s,start);
case  3 :
return subs__3293.call(this,s,start,end);
}
throw('Invalid arity: ' + arguments.length);
};
return subs;
})()
;
/**
* Returns a Symbol with the given namespace and name.
*/
cljs.core.symbol = (function() {
var symbol = null;
var symbol__3295 = (function (name){
if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null,name)))
{name;
} else
{if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null,name)))
{cljs.core.str_STAR_.call(null,"\uFDD1","'",cljs.core.subs.call(null,name,2));
} else
{}
}
return cljs.core.str_STAR_.call(null,"\uFDD1","'",name);
});
var symbol__3296 = (function (ns,name){
return symbol.call(null,cljs.core.str_STAR_.call(null,ns,"\/",name));
});
symbol = function(ns,name){
switch(arguments.length){
case  1 :
return symbol__3295.call(this,ns);
case  2 :
return symbol__3296.call(this,ns,name);
}
throw('Invalid arity: ' + arguments.length);
};
return symbol;
})()
;
/**
* Returns a Keyword with the given namespace and name.  Do not use :
* in the keyword strings, it will be added automatically.
*/
cljs.core.keyword = (function() {
var keyword = null;
var keyword__3298 = (function (name){
if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null,name)))
{return name;
} else
{if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null,name)))
{return cljs.core.str_STAR_.call(null,"\uFDD0","'",cljs.core.subs.call(null,name,2));
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return cljs.core.str_STAR_.call(null,"\uFDD0","'",name);
} else
{return null;
}
}
}
});
var keyword__3299 = (function (ns,name){
return keyword.call(null,cljs.core.str_STAR_.call(null,ns,"\/",name));
});
keyword = function(ns,name){
switch(arguments.length){
case  1 :
return keyword__3298.call(this,ns);
case  2 :
return keyword__3299.call(this,ns,name);
}
throw('Invalid arity: ' + arguments.length);
};
return keyword;
})()
;
/**
* Assumes x is sequential. Returns true if x equals y, otherwise
* returns false.
*/
cljs.core.equiv_sequential = (function equiv_sequential(x,y){
return cljs.core.boolean$.call(null,(cljs.core.truth_(cljs.core.sequential_QMARK_.call(null,y))?(function (){var xs__3301 = cljs.core.seq.call(null,x);
var ys__3302 = cljs.core.seq.call(null,y);

while(true){
if(cljs.core.truth_((xs__3301 === null)))
{return (ys__3302 === null);
} else
{if(cljs.core.truth_((ys__3302 === null)))
{return false;
} else
{if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.first.call(null,xs__3301),cljs.core.first.call(null,ys__3302))))
{{
var G__3303 = cljs.core.next.call(null,xs__3301);
var G__3304 = cljs.core.next.call(null,ys__3302);
xs__3301 = G__3303;
ys__3302 = G__3304;
continue;
}
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return false;
} else
{return null;
}
}
}
}
break;
}
})():null));
});
cljs.core.hash_combine = (function hash_combine(seed,hash){
return (seed ^ (((hash + 2654435769) + (seed << 6)) + (seed >> 2)));
});
cljs.core.hash_coll = (function hash_coll(coll){
return cljs.core.reduce.call(null,(function (p1__3305_SHARP_,p2__3306_SHARP_){
return cljs.core.hash_combine.call(null,p1__3305_SHARP_,cljs.core.hash.call(null,p2__3306_SHARP_));
}),cljs.core.hash.call(null,cljs.core.first.call(null,coll)),cljs.core.next.call(null,coll));
});
/**
* Takes a JavaScript object and a map of names to functions and
* attaches said functions as methods on the object.  Any references to
* JavaScript's implict this (via the this-as macro) will resolve to the
* object that the function is attached.
*/
cljs.core.extend_object_BANG_ = (function extend_object_BANG_(obj,fn_map){
var G__3307__3308 = cljs.core.seq.call(null,fn_map);

if(cljs.core.truth_(G__3307__3308))
{var G__3310__3312 = cljs.core.first.call(null,G__3307__3308);
var vec__3311__3313 = G__3310__3312;
var key_name__3314 = cljs.core.nth.call(null,vec__3311__3313,0,null);
var f__3315 = cljs.core.nth.call(null,vec__3311__3313,1,null);
var G__3307__3316 = G__3307__3308;

var G__3310__3317 = G__3310__3312;
var G__3307__3318 = G__3307__3316;

while(true){
var vec__3319__3320 = G__3310__3317;
var key_name__3321 = cljs.core.nth.call(null,vec__3319__3320,0,null);
var f__3322 = cljs.core.nth.call(null,vec__3319__3320,1,null);
var G__3307__3323 = G__3307__3318;

var str_name__3324 = cljs.core.name.call(null,key_name__3321);

obj[str_name__3324] = f__3322;
var temp__3698__auto____3325 = cljs.core.next.call(null,G__3307__3323);

if(cljs.core.truth_(temp__3698__auto____3325))
{var G__3307__3326 = temp__3698__auto____3325;

{
var G__3327 = cljs.core.first.call(null,G__3307__3326);
var G__3328 = G__3307__3326;
G__3310__3317 = G__3327;
G__3307__3318 = G__3328;
continue;
}
} else
{}
break;
}
} else
{}
return obj;
});

/**
* @constructor
*/
cljs.core.List = (function (meta,first,rest,count){
this.meta = meta;
this.first = first;
this.rest = rest;
this.count = count;
})
cljs.core.List.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.List");
});
cljs.core.List.prototype.cljs$core$IHash$ = true;
cljs.core.List.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3329 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.List.prototype.cljs$core$ISequential$ = true;
cljs.core.List.prototype.cljs$core$ICollection$ = true;
cljs.core.List.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3330 = this;
return (new cljs.core.List(this__3330.meta,o,coll,(this__3330.count + 1)));
});
cljs.core.List.prototype.cljs$core$ISeqable$ = true;
cljs.core.List.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3331 = this;
return coll;
});
cljs.core.List.prototype.cljs$core$ICounted$ = true;
cljs.core.List.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3332 = this;
return this__3332.count;
});
cljs.core.List.prototype.cljs$core$IStack$ = true;
cljs.core.List.prototype.cljs$core$IStack$_peek = (function (coll){
var this__3333 = this;
return this__3333.first;
});
cljs.core.List.prototype.cljs$core$IStack$_pop = (function (coll){
var this__3334 = this;
return cljs.core._rest.call(null,coll);
});
cljs.core.List.prototype.cljs$core$ISeq$ = true;
cljs.core.List.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3335 = this;
return this__3335.first;
});
cljs.core.List.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3336 = this;
return this__3336.rest;
});
cljs.core.List.prototype.cljs$core$IEquiv$ = true;
cljs.core.List.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3337 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.List.prototype.cljs$core$IWithMeta$ = true;
cljs.core.List.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3338 = this;
return (new cljs.core.List(meta,this__3338.first,this__3338.rest,this__3338.count));
});
cljs.core.List.prototype.cljs$core$IMeta$ = true;
cljs.core.List.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3339 = this;
return this__3339.meta;
});
cljs.core.List.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.List.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3340 = this;
return cljs.core.List.EMPTY;
});
cljs.core.List;

/**
* @constructor
*/
cljs.core.EmptyList = (function (meta){
this.meta = meta;
})
cljs.core.EmptyList.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.EmptyList");
});
cljs.core.EmptyList.prototype.cljs$core$IHash$ = true;
cljs.core.EmptyList.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3341 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.EmptyList.prototype.cljs$core$ISequential$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3342 = this;
return (new cljs.core.List(this__3342.meta,o,null,1));
});
cljs.core.EmptyList.prototype.cljs$core$ISeqable$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3343 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ICounted$ = true;
cljs.core.EmptyList.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3344 = this;
return 0;
});
cljs.core.EmptyList.prototype.cljs$core$IStack$ = true;
cljs.core.EmptyList.prototype.cljs$core$IStack$_peek = (function (coll){
var this__3345 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$IStack$_pop = (function (coll){
var this__3346 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ISeq$ = true;
cljs.core.EmptyList.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3347 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3348 = this;
return null;
});
cljs.core.EmptyList.prototype.cljs$core$IEquiv$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3349 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3350 = this;
return (new cljs.core.EmptyList(meta));
});
cljs.core.EmptyList.prototype.cljs$core$IMeta$ = true;
cljs.core.EmptyList.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3351 = this;
return this__3351.meta;
});
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.EmptyList.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3352 = this;
return coll;
});
cljs.core.EmptyList;
cljs.core.List.EMPTY = (new cljs.core.EmptyList(null));
/**
* Returns a seq of the items in coll in reverse order. Not lazy.
*/
cljs.core.reverse = (function reverse(coll){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.List.EMPTY,coll);
});
/**
* @param {...*} var_args
*/
cljs.core.list = (function() { 
var list__delegate = function (items){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.List.EMPTY,cljs.core.reverse.call(null,items));
};
var list = function (var_args){
var items = null;
if (goog.isDef(var_args)) {
  items = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return list__delegate.call(this, items);
};
list.cljs$lang$maxFixedArity = 0;
list.cljs$lang$applyTo = (function (arglist__3353){
var items = cljs.core.seq( arglist__3353 );;
return list__delegate.call(this, items);
});
return list;
})()
;

/**
* @constructor
*/
cljs.core.Cons = (function (meta,first,rest){
this.meta = meta;
this.first = first;
this.rest = rest;
})
cljs.core.Cons.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Cons");
});
cljs.core.Cons.prototype.cljs$core$ISeqable$ = true;
cljs.core.Cons.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3354 = this;
return coll;
});
cljs.core.Cons.prototype.cljs$core$IHash$ = true;
cljs.core.Cons.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3355 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.Cons.prototype.cljs$core$IEquiv$ = true;
cljs.core.Cons.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3356 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Cons.prototype.cljs$core$ISequential$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Cons.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3357 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__3357.meta);
});
cljs.core.Cons.prototype.cljs$core$ICollection$ = true;
cljs.core.Cons.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3358 = this;
return (new cljs.core.Cons(null,o,coll));
});
cljs.core.Cons.prototype.cljs$core$ISeq$ = true;
cljs.core.Cons.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3359 = this;
return this__3359.first;
});
cljs.core.Cons.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3360 = this;
if(cljs.core.truth_((this__3360.rest === null)))
{return cljs.core.List.EMPTY;
} else
{return this__3360.rest;
}
});
cljs.core.Cons.prototype.cljs$core$IMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3361 = this;
return this__3361.meta;
});
cljs.core.Cons.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Cons.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3362 = this;
return (new cljs.core.Cons(meta,this__3362.first,this__3362.rest));
});
cljs.core.Cons;
/**
* Returns a new seq where x is the first element and seq is the rest.
*/
cljs.core.cons = (function cons(x,seq){
return (new cljs.core.Cons(null,x,seq));
});
(cljs.core.IReduce["string"] = true);
(cljs.core._reduce["string"] = (function() {
var G__3363 = null;
var G__3363__3364 = (function (string,f){
return cljs.core.ci_reduce.call(null,string,f);
});
var G__3363__3365 = (function (string,f,start){
return cljs.core.ci_reduce.call(null,string,f,start);
});
G__3363 = function(string,f,start){
switch(arguments.length){
case  2 :
return G__3363__3364.call(this,string,f);
case  3 :
return G__3363__3365.call(this,string,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3363;
})()
);
(cljs.core.ILookup["string"] = true);
(cljs.core._lookup["string"] = (function() {
var G__3367 = null;
var G__3367__3368 = (function (string,k){
return cljs.core._nth.call(null,string,k);
});
var G__3367__3369 = (function (string,k,not_found){
return cljs.core._nth.call(null,string,k,not_found);
});
G__3367 = function(string,k,not_found){
switch(arguments.length){
case  2 :
return G__3367__3368.call(this,string,k);
case  3 :
return G__3367__3369.call(this,string,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3367;
})()
);
(cljs.core.IIndexed["string"] = true);
(cljs.core._nth["string"] = (function() {
var G__3371 = null;
var G__3371__3372 = (function (string,n){
if(cljs.core.truth_((n < cljs.core._count.call(null,string))))
{return string.charAt(n);
} else
{return null;
}
});
var G__3371__3373 = (function (string,n,not_found){
if(cljs.core.truth_((n < cljs.core._count.call(null,string))))
{return string.charAt(n);
} else
{return not_found;
}
});
G__3371 = function(string,n,not_found){
switch(arguments.length){
case  2 :
return G__3371__3372.call(this,string,n);
case  3 :
return G__3371__3373.call(this,string,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3371;
})()
);
(cljs.core.ICounted["string"] = true);
(cljs.core._count["string"] = (function (s){
return s.length;
}));
(cljs.core.ISeqable["string"] = true);
(cljs.core._seq["string"] = (function (string){
return cljs.core.prim_seq.call(null,string,0);
}));
(cljs.core.IHash["string"] = true);
(cljs.core._hash["string"] = (function (o){
return goog.string.hashCode.call(null,o);
}));
String.prototype.cljs$core$IFn$ = true;
String.prototype.call = (function() {
var G__3381 = null;
var G__3381__3382 = (function (tsym3375,coll){
var tsym3375__3377 = this;

var this$__3378 = tsym3375__3377;

return cljs.core.get.call(null,coll,this$__3378.toString());
});
var G__3381__3383 = (function (tsym3376,coll,not_found){
var tsym3376__3379 = this;

var this$__3380 = tsym3376__3379;

return cljs.core.get.call(null,coll,this$__3380.toString(),not_found);
});
G__3381 = function(tsym3376,coll,not_found){
switch(arguments.length){
case  2 :
return G__3381__3382.call(this,tsym3376,coll);
case  3 :
return G__3381__3383.call(this,tsym3376,coll,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3381;
})()
;
String['prototype']['apply'] = (function (s,args){
if(cljs.core.truth_((cljs.core.count.call(null,args) < 2)))
{return cljs.core.get.call(null,(args[0]),s);
} else
{return cljs.core.get.call(null,(args[0]),s,(args[1]));
}
});
cljs.core.lazy_seq_value = (function lazy_seq_value(lazy_seq){
var x__3385 = lazy_seq.x;

if(cljs.core.truth_(lazy_seq.realized))
{return x__3385;
} else
{lazy_seq.x = x__3385.call(null);
lazy_seq.realized = true;
return lazy_seq.x;
}
});

/**
* @constructor
*/
cljs.core.LazySeq = (function (meta,realized,x){
this.meta = meta;
this.realized = realized;
this.x = x;
})
cljs.core.LazySeq.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.LazySeq");
});
cljs.core.LazySeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3386 = this;
return cljs.core.seq.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$IHash$ = true;
cljs.core.LazySeq.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3387 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.LazySeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3388 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.LazySeq.prototype.cljs$core$ISequential$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3389 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__3389.meta);
});
cljs.core.LazySeq.prototype.cljs$core$ICollection$ = true;
cljs.core.LazySeq.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3390 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.LazySeq.prototype.cljs$core$ISeq$ = true;
cljs.core.LazySeq.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3391 = this;
return cljs.core.first.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3392 = this;
return cljs.core.rest.call(null,cljs.core.lazy_seq_value.call(null,coll));
});
cljs.core.LazySeq.prototype.cljs$core$IMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3393 = this;
return this__3393.meta;
});
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.LazySeq.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3394 = this;
return (new cljs.core.LazySeq(meta,this__3394.realized,this__3394.x));
});
cljs.core.LazySeq;
/**
* Naive impl of to-array as a start.
*/
cljs.core.to_array = (function to_array(s){
var ary__3395 = [];

var s__3396 = s;

while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,s__3396)))
{ary__3395.push(cljs.core.first.call(null,s__3396));
{
var G__3397 = cljs.core.next.call(null,s__3396);
s__3396 = G__3397;
continue;
}
} else
{return ary__3395;
}
break;
}
});
cljs.core.bounded_count = (function bounded_count(s,n){
var s__3398 = s;
var i__3399 = n;
var sum__3400 = 0;

while(true){
if(cljs.core.truth_((function (){var and__3546__auto____3401 = (i__3399 > 0);

if(cljs.core.truth_(and__3546__auto____3401))
{return cljs.core.seq.call(null,s__3398);
} else
{return and__3546__auto____3401;
}
})()))
{{
var G__3402 = cljs.core.next.call(null,s__3398);
var G__3403 = (i__3399 - 1);
var G__3404 = (sum__3400 + 1);
s__3398 = G__3402;
i__3399 = G__3403;
sum__3400 = G__3404;
continue;
}
} else
{return sum__3400;
}
break;
}
});
cljs.core.spread = (function spread(arglist){
if(cljs.core.truth_((arglist === null)))
{return null;
} else
{if(cljs.core.truth_((cljs.core.next.call(null,arglist) === null)))
{return cljs.core.seq.call(null,cljs.core.first.call(null,arglist));
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return cljs.core.cons.call(null,cljs.core.first.call(null,arglist),spread.call(null,cljs.core.next.call(null,arglist)));
} else
{return null;
}
}
}
});
/**
* Returns a lazy seq representing the concatenation of the elements in the supplied colls.
* @param {...*} var_args
*/
cljs.core.concat = (function() {
var concat = null;
var concat__3408 = (function (){
return (new cljs.core.LazySeq(null,false,(function (){
return null;
})));
});
var concat__3409 = (function (x){
return (new cljs.core.LazySeq(null,false,(function (){
return x;
})));
});
var concat__3410 = (function (x,y){
return (new cljs.core.LazySeq(null,false,(function (){
var s__3405 = cljs.core.seq.call(null,x);

if(cljs.core.truth_(s__3405))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s__3405),concat.call(null,cljs.core.rest.call(null,s__3405),y));
} else
{return y;
}
})));
});
var concat__3411 = (function() { 
var G__3413__delegate = function (x,y,zs){
var cat__3407 = (function cat(xys,zs){
return (new cljs.core.LazySeq(null,false,(function (){
var xys__3406 = cljs.core.seq.call(null,xys);

if(cljs.core.truth_(xys__3406))
{return cljs.core.cons.call(null,cljs.core.first.call(null,xys__3406),cat.call(null,cljs.core.rest.call(null,xys__3406),zs));
} else
{if(cljs.core.truth_(zs))
{return cat.call(null,cljs.core.first.call(null,zs),cljs.core.next.call(null,zs));
} else
{return null;
}
}
})));
});

return cat__3407.call(null,concat.call(null,x,y),zs);
};
var G__3413 = function (x,y,var_args){
var zs = null;
if (goog.isDef(var_args)) {
  zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3413__delegate.call(this, x, y, zs);
};
G__3413.cljs$lang$maxFixedArity = 2;
G__3413.cljs$lang$applyTo = (function (arglist__3414){
var x = cljs.core.first(arglist__3414);
var y = cljs.core.first(cljs.core.next(arglist__3414));
var zs = cljs.core.rest(cljs.core.next(arglist__3414));
return G__3413__delegate.call(this, x, y, zs);
});
return G__3413;
})()
;
concat = function(x,y,var_args){
var zs = var_args;
switch(arguments.length){
case  0 :
return concat__3408.call(this);
case  1 :
return concat__3409.call(this,x);
case  2 :
return concat__3410.call(this,x,y);
default:
return concat__3411.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
concat.cljs$lang$maxFixedArity = 2;
concat.cljs$lang$applyTo = concat__3411.cljs$lang$applyTo;
return concat;
})()
;
/**
* Creates a new list containing the items prepended to the rest, the
* last of which will be treated as a sequence.
* @param {...*} var_args
*/
cljs.core.list_STAR_ = (function() {
var list_STAR_ = null;
var list_STAR___3415 = (function (args){
return cljs.core.seq.call(null,args);
});
var list_STAR___3416 = (function (a,args){
return cljs.core.cons.call(null,a,args);
});
var list_STAR___3417 = (function (a,b,args){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,args));
});
var list_STAR___3418 = (function (a,b,c,args){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,args)));
});
var list_STAR___3419 = (function() { 
var G__3421__delegate = function (a,b,c,d,more){
return cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,cljs.core.cons.call(null,d,cljs.core.spread.call(null,more)))));
};
var G__3421 = function (a,b,c,d,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__3421__delegate.call(this, a, b, c, d, more);
};
G__3421.cljs$lang$maxFixedArity = 4;
G__3421.cljs$lang$applyTo = (function (arglist__3422){
var a = cljs.core.first(arglist__3422);
var b = cljs.core.first(cljs.core.next(arglist__3422));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3422)));
var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3422))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3422))));
return G__3421__delegate.call(this, a, b, c, d, more);
});
return G__3421;
})()
;
list_STAR_ = function(a,b,c,d,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return list_STAR___3415.call(this,a);
case  2 :
return list_STAR___3416.call(this,a,b);
case  3 :
return list_STAR___3417.call(this,a,b,c);
case  4 :
return list_STAR___3418.call(this,a,b,c,d);
default:
return list_STAR___3419.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
list_STAR_.cljs$lang$maxFixedArity = 4;
list_STAR_.cljs$lang$applyTo = list_STAR___3419.cljs$lang$applyTo;
return list_STAR_;
})()
;
/**
* Applies fn f to the argument list formed by prepending intervening arguments to args.
* First cut.  Not lazy.  Needs to use emitted toApply.
* @param {...*} var_args
*/
cljs.core.apply = (function() {
var apply = null;
var apply__3432 = (function (f,args){
var fixed_arity__3423 = f.cljs$lang$maxFixedArity;

if(cljs.core.truth_(f.cljs$lang$applyTo))
{if(cljs.core.truth_((cljs.core.bounded_count.call(null,args,(fixed_arity__3423 + 1)) <= fixed_arity__3423)))
{return f.apply(f,cljs.core.to_array.call(null,args));
} else
{return f.cljs$lang$applyTo(args);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,args));
}
});
var apply__3433 = (function (f,x,args){
var arglist__3424 = cljs.core.list_STAR_.call(null,x,args);
var fixed_arity__3425 = f.cljs$lang$maxFixedArity;

if(cljs.core.truth_(f.cljs$lang$applyTo))
{if(cljs.core.truth_((cljs.core.bounded_count.call(null,arglist__3424,fixed_arity__3425) <= fixed_arity__3425)))
{return f.apply(f,cljs.core.to_array.call(null,arglist__3424));
} else
{return f.cljs$lang$applyTo(arglist__3424);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__3424));
}
});
var apply__3434 = (function (f,x,y,args){
var arglist__3426 = cljs.core.list_STAR_.call(null,x,y,args);
var fixed_arity__3427 = f.cljs$lang$maxFixedArity;

if(cljs.core.truth_(f.cljs$lang$applyTo))
{if(cljs.core.truth_((cljs.core.bounded_count.call(null,arglist__3426,fixed_arity__3427) <= fixed_arity__3427)))
{return f.apply(f,cljs.core.to_array.call(null,arglist__3426));
} else
{return f.cljs$lang$applyTo(arglist__3426);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__3426));
}
});
var apply__3435 = (function (f,x,y,z,args){
var arglist__3428 = cljs.core.list_STAR_.call(null,x,y,z,args);
var fixed_arity__3429 = f.cljs$lang$maxFixedArity;

if(cljs.core.truth_(f.cljs$lang$applyTo))
{if(cljs.core.truth_((cljs.core.bounded_count.call(null,arglist__3428,fixed_arity__3429) <= fixed_arity__3429)))
{return f.apply(f,cljs.core.to_array.call(null,arglist__3428));
} else
{return f.cljs$lang$applyTo(arglist__3428);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__3428));
}
});
var apply__3436 = (function() { 
var G__3438__delegate = function (f,a,b,c,d,args){
var arglist__3430 = cljs.core.cons.call(null,a,cljs.core.cons.call(null,b,cljs.core.cons.call(null,c,cljs.core.cons.call(null,d,cljs.core.spread.call(null,args)))));
var fixed_arity__3431 = f.cljs$lang$maxFixedArity;

if(cljs.core.truth_(f.cljs$lang$applyTo))
{if(cljs.core.truth_((cljs.core.bounded_count.call(null,arglist__3430,fixed_arity__3431) <= fixed_arity__3431)))
{return f.apply(f,cljs.core.to_array.call(null,arglist__3430));
} else
{return f.cljs$lang$applyTo(arglist__3430);
}
} else
{return f.apply(f,cljs.core.to_array.call(null,arglist__3430));
}
};
var G__3438 = function (f,a,b,c,d,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5),0);
} 
return G__3438__delegate.call(this, f, a, b, c, d, args);
};
G__3438.cljs$lang$maxFixedArity = 5;
G__3438.cljs$lang$applyTo = (function (arglist__3439){
var f = cljs.core.first(arglist__3439);
var a = cljs.core.first(cljs.core.next(arglist__3439));
var b = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3439)));
var c = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3439))));
var d = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3439)))));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3439)))));
return G__3438__delegate.call(this, f, a, b, c, d, args);
});
return G__3438;
})()
;
apply = function(f,a,b,c,d,var_args){
var args = var_args;
switch(arguments.length){
case  2 :
return apply__3432.call(this,f,a);
case  3 :
return apply__3433.call(this,f,a,b);
case  4 :
return apply__3434.call(this,f,a,b,c);
case  5 :
return apply__3435.call(this,f,a,b,c,d);
default:
return apply__3436.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
apply.cljs$lang$maxFixedArity = 5;
apply.cljs$lang$applyTo = apply__3436.cljs$lang$applyTo;
return apply;
})()
;
/**
* Returns an object of the same type and value as obj, with
* (apply f (meta obj) args) as its metadata.
* @param {...*} var_args
*/
cljs.core.vary_meta = (function() { 
var vary_meta__delegate = function (obj,f,args){
return cljs.core.with_meta.call(null,obj,cljs.core.apply.call(null,f,cljs.core.meta.call(null,obj),args));
};
var vary_meta = function (obj,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return vary_meta__delegate.call(this, obj, f, args);
};
vary_meta.cljs$lang$maxFixedArity = 2;
vary_meta.cljs$lang$applyTo = (function (arglist__3440){
var obj = cljs.core.first(arglist__3440);
var f = cljs.core.first(cljs.core.next(arglist__3440));
var args = cljs.core.rest(cljs.core.next(arglist__3440));
return vary_meta__delegate.call(this, obj, f, args);
});
return vary_meta;
})()
;
/**
* Same as (not (= obj1 obj2))
* @param {...*} var_args
*/
cljs.core.not_EQ_ = (function() {
var not_EQ_ = null;
var not_EQ___3441 = (function (x){
return false;
});
var not_EQ___3442 = (function (x,y){
return cljs.core.not.call(null,cljs.core._EQ_.call(null,x,y));
});
var not_EQ___3443 = (function() { 
var G__3445__delegate = function (x,y,more){
return cljs.core.not.call(null,cljs.core.apply.call(null,cljs.core._EQ_,x,y,more));
};
var G__3445 = function (x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3445__delegate.call(this, x, y, more);
};
G__3445.cljs$lang$maxFixedArity = 2;
G__3445.cljs$lang$applyTo = (function (arglist__3446){
var x = cljs.core.first(arglist__3446);
var y = cljs.core.first(cljs.core.next(arglist__3446));
var more = cljs.core.rest(cljs.core.next(arglist__3446));
return G__3445__delegate.call(this, x, y, more);
});
return G__3445;
})()
;
not_EQ_ = function(x,y,var_args){
var more = var_args;
switch(arguments.length){
case  1 :
return not_EQ___3441.call(this,x);
case  2 :
return not_EQ___3442.call(this,x,y);
default:
return not_EQ___3443.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
not_EQ_.cljs$lang$maxFixedArity = 2;
not_EQ_.cljs$lang$applyTo = not_EQ___3443.cljs$lang$applyTo;
return not_EQ_;
})()
;
/**
* If coll is empty, returns nil, else coll
*/
cljs.core.not_empty = (function not_empty(coll){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{return coll;
} else
{return null;
}
});
/**
* Returns true if (pred x) is logical true for every x in coll, else
* false.
*/
cljs.core.every_QMARK_ = (function every_QMARK_(pred,coll){
while(true){
if(cljs.core.truth_((cljs.core.seq.call(null,coll) === null)))
{return true;
} else
{if(cljs.core.truth_(pred.call(null,cljs.core.first.call(null,coll))))
{{
var G__3447 = pred;
var G__3448 = cljs.core.next.call(null,coll);
pred = G__3447;
coll = G__3448;
continue;
}
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return false;
} else
{return null;
}
}
}
break;
}
});
/**
* Returns false if (pred x) is logical true for every x in
* coll, else true.
*/
cljs.core.not_every_QMARK_ = (function not_every_QMARK_(pred,coll){
return cljs.core.not.call(null,cljs.core.every_QMARK_.call(null,pred,coll));
});
/**
* Returns the first logical true value of (pred x) for any x in coll,
* else nil.  One common idiom is to use a set as pred, for example
* this will return :fred if :fred is in the sequence, otherwise nil:
* (some #{:fred} coll)
*/
cljs.core.some = (function some(pred,coll){
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{var or__3548__auto____3449 = pred.call(null,cljs.core.first.call(null,coll));

if(cljs.core.truth_(or__3548__auto____3449))
{return or__3548__auto____3449;
} else
{{
var G__3450 = pred;
var G__3451 = cljs.core.next.call(null,coll);
pred = G__3450;
coll = G__3451;
continue;
}
}
} else
{return null;
}
break;
}
});
/**
* Returns false if (pred x) is logical true for any x in coll,
* else true.
*/
cljs.core.not_any_QMARK_ = (function not_any_QMARK_(pred,coll){
return cljs.core.not.call(null,cljs.core.some.call(null,pred,coll));
});
/**
* Returns true if n is even, throws an exception if n is not an integer
*/
cljs.core.even_QMARK_ = (function even_QMARK_(n){
if(cljs.core.truth_(cljs.core.integer_QMARK_.call(null,n)))
{return ((n & 1) === 0);
} else
{throw (new Error(cljs.core.str.call(null,"Argument must be an integer: ",n)));
}
});
/**
* Returns true if n is odd, throws an exception if n is not an integer
*/
cljs.core.odd_QMARK_ = (function odd_QMARK_(n){
return cljs.core.not.call(null,cljs.core.even_QMARK_.call(null,n));
});
cljs.core.identity = (function identity(x){
return x;
});
/**
* Takes a fn f and returns a fn that takes the same arguments as f,
* has the same effects, if any, and returns the opposite truth value.
*/
cljs.core.complement = (function complement(f){
return (function() {
var G__3452 = null;
var G__3452__3453 = (function (){
return cljs.core.not.call(null,f.call(null));
});
var G__3452__3454 = (function (x){
return cljs.core.not.call(null,f.call(null,x));
});
var G__3452__3455 = (function (x,y){
return cljs.core.not.call(null,f.call(null,x,y));
});
var G__3452__3456 = (function() { 
var G__3458__delegate = function (x,y,zs){
return cljs.core.not.call(null,cljs.core.apply.call(null,f,x,y,zs));
};
var G__3458 = function (x,y,var_args){
var zs = null;
if (goog.isDef(var_args)) {
  zs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3458__delegate.call(this, x, y, zs);
};
G__3458.cljs$lang$maxFixedArity = 2;
G__3458.cljs$lang$applyTo = (function (arglist__3459){
var x = cljs.core.first(arglist__3459);
var y = cljs.core.first(cljs.core.next(arglist__3459));
var zs = cljs.core.rest(cljs.core.next(arglist__3459));
return G__3458__delegate.call(this, x, y, zs);
});
return G__3458;
})()
;
G__3452 = function(x,y,var_args){
var zs = var_args;
switch(arguments.length){
case  0 :
return G__3452__3453.call(this);
case  1 :
return G__3452__3454.call(this,x);
case  2 :
return G__3452__3455.call(this,x,y);
default:
return G__3452__3456.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3452.cljs$lang$maxFixedArity = 2;
G__3452.cljs$lang$applyTo = G__3452__3456.cljs$lang$applyTo;
return G__3452;
})()
});
/**
* Returns a function that takes any number of arguments and returns x.
*/
cljs.core.constantly = (function constantly(x){
return (function() { 
var G__3460__delegate = function (args){
return x;
};
var G__3460 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3460__delegate.call(this, args);
};
G__3460.cljs$lang$maxFixedArity = 0;
G__3460.cljs$lang$applyTo = (function (arglist__3461){
var args = cljs.core.seq( arglist__3461 );;
return G__3460__delegate.call(this, args);
});
return G__3460;
})()
;
});
/**
* Takes a set of functions and returns a fn that is the composition
* of those fns.  The returned fn takes a variable number of args,
* applies the rightmost of fns to the args, the next
* fn (right-to-left) to the result, etc.
* @param {...*} var_args
*/
cljs.core.comp = (function() {
var comp = null;
var comp__3465 = (function (){
return cljs.core.identity;
});
var comp__3466 = (function (f){
return f;
});
var comp__3467 = (function (f,g){
return (function() {
var G__3471 = null;
var G__3471__3472 = (function (){
return f.call(null,g.call(null));
});
var G__3471__3473 = (function (x){
return f.call(null,g.call(null,x));
});
var G__3471__3474 = (function (x,y){
return f.call(null,g.call(null,x,y));
});
var G__3471__3475 = (function (x,y,z){
return f.call(null,g.call(null,x,y,z));
});
var G__3471__3476 = (function() { 
var G__3478__delegate = function (x,y,z,args){
return f.call(null,cljs.core.apply.call(null,g,x,y,z,args));
};
var G__3478 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3478__delegate.call(this, x, y, z, args);
};
G__3478.cljs$lang$maxFixedArity = 3;
G__3478.cljs$lang$applyTo = (function (arglist__3479){
var x = cljs.core.first(arglist__3479);
var y = cljs.core.first(cljs.core.next(arglist__3479));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3479)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3479)));
return G__3478__delegate.call(this, x, y, z, args);
});
return G__3478;
})()
;
G__3471 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__3471__3472.call(this);
case  1 :
return G__3471__3473.call(this,x);
case  2 :
return G__3471__3474.call(this,x,y);
case  3 :
return G__3471__3475.call(this,x,y,z);
default:
return G__3471__3476.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3471.cljs$lang$maxFixedArity = 3;
G__3471.cljs$lang$applyTo = G__3471__3476.cljs$lang$applyTo;
return G__3471;
})()
});
var comp__3468 = (function (f,g,h){
return (function() {
var G__3480 = null;
var G__3480__3481 = (function (){
return f.call(null,g.call(null,h.call(null)));
});
var G__3480__3482 = (function (x){
return f.call(null,g.call(null,h.call(null,x)));
});
var G__3480__3483 = (function (x,y){
return f.call(null,g.call(null,h.call(null,x,y)));
});
var G__3480__3484 = (function (x,y,z){
return f.call(null,g.call(null,h.call(null,x,y,z)));
});
var G__3480__3485 = (function() { 
var G__3487__delegate = function (x,y,z,args){
return f.call(null,g.call(null,cljs.core.apply.call(null,h,x,y,z,args)));
};
var G__3487 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3487__delegate.call(this, x, y, z, args);
};
G__3487.cljs$lang$maxFixedArity = 3;
G__3487.cljs$lang$applyTo = (function (arglist__3488){
var x = cljs.core.first(arglist__3488);
var y = cljs.core.first(cljs.core.next(arglist__3488));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3488)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3488)));
return G__3487__delegate.call(this, x, y, z, args);
});
return G__3487;
})()
;
G__3480 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__3480__3481.call(this);
case  1 :
return G__3480__3482.call(this,x);
case  2 :
return G__3480__3483.call(this,x,y);
case  3 :
return G__3480__3484.call(this,x,y,z);
default:
return G__3480__3485.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3480.cljs$lang$maxFixedArity = 3;
G__3480.cljs$lang$applyTo = G__3480__3485.cljs$lang$applyTo;
return G__3480;
})()
});
var comp__3469 = (function() { 
var G__3489__delegate = function (f1,f2,f3,fs){
var fs__3462 = cljs.core.reverse.call(null,cljs.core.list_STAR_.call(null,f1,f2,f3,fs));

return (function() { 
var G__3490__delegate = function (args){
var ret__3463 = cljs.core.apply.call(null,cljs.core.first.call(null,fs__3462),args);
var fs__3464 = cljs.core.next.call(null,fs__3462);

while(true){
if(cljs.core.truth_(fs__3464))
{{
var G__3491 = cljs.core.first.call(null,fs__3464).call(null,ret__3463);
var G__3492 = cljs.core.next.call(null,fs__3464);
ret__3463 = G__3491;
fs__3464 = G__3492;
continue;
}
} else
{return ret__3463;
}
break;
}
};
var G__3490 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3490__delegate.call(this, args);
};
G__3490.cljs$lang$maxFixedArity = 0;
G__3490.cljs$lang$applyTo = (function (arglist__3493){
var args = cljs.core.seq( arglist__3493 );;
return G__3490__delegate.call(this, args);
});
return G__3490;
})()
;
};
var G__3489 = function (f1,f2,f3,var_args){
var fs = null;
if (goog.isDef(var_args)) {
  fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3489__delegate.call(this, f1, f2, f3, fs);
};
G__3489.cljs$lang$maxFixedArity = 3;
G__3489.cljs$lang$applyTo = (function (arglist__3494){
var f1 = cljs.core.first(arglist__3494);
var f2 = cljs.core.first(cljs.core.next(arglist__3494));
var f3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3494)));
var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3494)));
return G__3489__delegate.call(this, f1, f2, f3, fs);
});
return G__3489;
})()
;
comp = function(f1,f2,f3,var_args){
var fs = var_args;
switch(arguments.length){
case  0 :
return comp__3465.call(this);
case  1 :
return comp__3466.call(this,f1);
case  2 :
return comp__3467.call(this,f1,f2);
case  3 :
return comp__3468.call(this,f1,f2,f3);
default:
return comp__3469.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
comp.cljs$lang$maxFixedArity = 3;
comp.cljs$lang$applyTo = comp__3469.cljs$lang$applyTo;
return comp;
})()
;
/**
* Takes a function f and fewer than the normal arguments to f, and
* returns a fn that takes a variable number of additional args. When
* called, the returned function calls f with args + additional args.
* @param {...*} var_args
*/
cljs.core.partial = (function() {
var partial = null;
var partial__3495 = (function (f,arg1){
return (function() { 
var G__3500__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,args);
};
var G__3500 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3500__delegate.call(this, args);
};
G__3500.cljs$lang$maxFixedArity = 0;
G__3500.cljs$lang$applyTo = (function (arglist__3501){
var args = cljs.core.seq( arglist__3501 );;
return G__3500__delegate.call(this, args);
});
return G__3500;
})()
;
});
var partial__3496 = (function (f,arg1,arg2){
return (function() { 
var G__3502__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,args);
};
var G__3502 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3502__delegate.call(this, args);
};
G__3502.cljs$lang$maxFixedArity = 0;
G__3502.cljs$lang$applyTo = (function (arglist__3503){
var args = cljs.core.seq( arglist__3503 );;
return G__3502__delegate.call(this, args);
});
return G__3502;
})()
;
});
var partial__3497 = (function (f,arg1,arg2,arg3){
return (function() { 
var G__3504__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,arg3,args);
};
var G__3504 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3504__delegate.call(this, args);
};
G__3504.cljs$lang$maxFixedArity = 0;
G__3504.cljs$lang$applyTo = (function (arglist__3505){
var args = cljs.core.seq( arglist__3505 );;
return G__3504__delegate.call(this, args);
});
return G__3504;
})()
;
});
var partial__3498 = (function() { 
var G__3506__delegate = function (f,arg1,arg2,arg3,more){
return (function() { 
var G__3507__delegate = function (args){
return cljs.core.apply.call(null,f,arg1,arg2,arg3,cljs.core.concat.call(null,more,args));
};
var G__3507 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__3507__delegate.call(this, args);
};
G__3507.cljs$lang$maxFixedArity = 0;
G__3507.cljs$lang$applyTo = (function (arglist__3508){
var args = cljs.core.seq( arglist__3508 );;
return G__3507__delegate.call(this, args);
});
return G__3507;
})()
;
};
var G__3506 = function (f,arg1,arg2,arg3,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__3506__delegate.call(this, f, arg1, arg2, arg3, more);
};
G__3506.cljs$lang$maxFixedArity = 4;
G__3506.cljs$lang$applyTo = (function (arglist__3509){
var f = cljs.core.first(arglist__3509);
var arg1 = cljs.core.first(cljs.core.next(arglist__3509));
var arg2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3509)));
var arg3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3509))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3509))));
return G__3506__delegate.call(this, f, arg1, arg2, arg3, more);
});
return G__3506;
})()
;
partial = function(f,arg1,arg2,arg3,var_args){
var more = var_args;
switch(arguments.length){
case  2 :
return partial__3495.call(this,f,arg1);
case  3 :
return partial__3496.call(this,f,arg1,arg2);
case  4 :
return partial__3497.call(this,f,arg1,arg2,arg3);
default:
return partial__3498.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
partial.cljs$lang$maxFixedArity = 4;
partial.cljs$lang$applyTo = partial__3498.cljs$lang$applyTo;
return partial;
})()
;
/**
* Takes a function f, and returns a function that calls f, replacing
* a nil first argument to f with the supplied value x. Higher arity
* versions can replace arguments in the second and third
* positions (y, z). Note that the function f can take any number of
* arguments, not just the one(s) being nil-patched.
*/
cljs.core.fnil = (function() {
var fnil = null;
var fnil__3510 = (function (f,x){
return (function() {
var G__3514 = null;
var G__3514__3515 = (function (a){
return f.call(null,(cljs.core.truth_((a === null))?x:a));
});
var G__3514__3516 = (function (a,b){
return f.call(null,(cljs.core.truth_((a === null))?x:a),b);
});
var G__3514__3517 = (function (a,b,c){
return f.call(null,(cljs.core.truth_((a === null))?x:a),b,c);
});
var G__3514__3518 = (function() { 
var G__3520__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(cljs.core.truth_((a === null))?x:a),b,c,ds);
};
var G__3520 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3520__delegate.call(this, a, b, c, ds);
};
G__3520.cljs$lang$maxFixedArity = 3;
G__3520.cljs$lang$applyTo = (function (arglist__3521){
var a = cljs.core.first(arglist__3521);
var b = cljs.core.first(cljs.core.next(arglist__3521));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3521)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3521)));
return G__3520__delegate.call(this, a, b, c, ds);
});
return G__3520;
})()
;
G__3514 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case  1 :
return G__3514__3515.call(this,a);
case  2 :
return G__3514__3516.call(this,a,b);
case  3 :
return G__3514__3517.call(this,a,b,c);
default:
return G__3514__3518.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3514.cljs$lang$maxFixedArity = 3;
G__3514.cljs$lang$applyTo = G__3514__3518.cljs$lang$applyTo;
return G__3514;
})()
});
var fnil__3511 = (function (f,x,y){
return (function() {
var G__3522 = null;
var G__3522__3523 = (function (a,b){
return f.call(null,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b));
});
var G__3522__3524 = (function (a,b,c){
return f.call(null,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b),c);
});
var G__3522__3525 = (function() { 
var G__3527__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b),c,ds);
};
var G__3527 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3527__delegate.call(this, a, b, c, ds);
};
G__3527.cljs$lang$maxFixedArity = 3;
G__3527.cljs$lang$applyTo = (function (arglist__3528){
var a = cljs.core.first(arglist__3528);
var b = cljs.core.first(cljs.core.next(arglist__3528));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3528)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3528)));
return G__3527__delegate.call(this, a, b, c, ds);
});
return G__3527;
})()
;
G__3522 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case  2 :
return G__3522__3523.call(this,a,b);
case  3 :
return G__3522__3524.call(this,a,b,c);
default:
return G__3522__3525.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3522.cljs$lang$maxFixedArity = 3;
G__3522.cljs$lang$applyTo = G__3522__3525.cljs$lang$applyTo;
return G__3522;
})()
});
var fnil__3512 = (function (f,x,y,z){
return (function() {
var G__3529 = null;
var G__3529__3530 = (function (a,b){
return f.call(null,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b));
});
var G__3529__3531 = (function (a,b,c){
return f.call(null,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b),(cljs.core.truth_((c === null))?z:c));
});
var G__3529__3532 = (function() { 
var G__3534__delegate = function (a,b,c,ds){
return cljs.core.apply.call(null,f,(cljs.core.truth_((a === null))?x:a),(cljs.core.truth_((b === null))?y:b),(cljs.core.truth_((c === null))?z:c),ds);
};
var G__3534 = function (a,b,c,var_args){
var ds = null;
if (goog.isDef(var_args)) {
  ds = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3534__delegate.call(this, a, b, c, ds);
};
G__3534.cljs$lang$maxFixedArity = 3;
G__3534.cljs$lang$applyTo = (function (arglist__3535){
var a = cljs.core.first(arglist__3535);
var b = cljs.core.first(cljs.core.next(arglist__3535));
var c = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3535)));
var ds = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3535)));
return G__3534__delegate.call(this, a, b, c, ds);
});
return G__3534;
})()
;
G__3529 = function(a,b,c,var_args){
var ds = var_args;
switch(arguments.length){
case  2 :
return G__3529__3530.call(this,a,b);
case  3 :
return G__3529__3531.call(this,a,b,c);
default:
return G__3529__3532.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__3529.cljs$lang$maxFixedArity = 3;
G__3529.cljs$lang$applyTo = G__3529__3532.cljs$lang$applyTo;
return G__3529;
})()
});
fnil = function(f,x,y,z){
switch(arguments.length){
case  2 :
return fnil__3510.call(this,f,x);
case  3 :
return fnil__3511.call(this,f,x,y);
case  4 :
return fnil__3512.call(this,f,x,y,z);
}
throw('Invalid arity: ' + arguments.length);
};
return fnil;
})()
;
/**
* Returns a lazy sequence consisting of the result of applying f to 0
* and the first item of coll, followed by applying f to 1 and the second
* item in coll, etc, until coll is exhausted. Thus function f should
* accept 2 arguments, index and item.
*/
cljs.core.map_indexed = (function map_indexed(f,coll){
var mapi__3538 = (function mpi(idx,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3536 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3536))
{var s__3537 = temp__3698__auto____3536;

return cljs.core.cons.call(null,f.call(null,idx,cljs.core.first.call(null,s__3537)),mpi.call(null,(idx + 1),cljs.core.rest.call(null,s__3537)));
} else
{return null;
}
})));
});

return mapi__3538.call(null,0,coll);
});
/**
* Returns a lazy sequence of the non-nil results of (f item). Note,
* this means false return values will be included.  f must be free of
* side-effects.
*/
cljs.core.keep = (function keep(f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3539 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3539))
{var s__3540 = temp__3698__auto____3539;

var x__3541 = f.call(null,cljs.core.first.call(null,s__3540));

if(cljs.core.truth_((x__3541 === null)))
{return keep.call(null,f,cljs.core.rest.call(null,s__3540));
} else
{return cljs.core.cons.call(null,x__3541,keep.call(null,f,cljs.core.rest.call(null,s__3540)));
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of the non-nil results of (f index item). Note,
* this means false return values will be included.  f must be free of
* side-effects.
*/
cljs.core.keep_indexed = (function keep_indexed(f,coll){
var keepi__3551 = (function kpi(idx,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3548 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3548))
{var s__3549 = temp__3698__auto____3548;

var x__3550 = f.call(null,idx,cljs.core.first.call(null,s__3549));

if(cljs.core.truth_((x__3550 === null)))
{return kpi.call(null,(idx + 1),cljs.core.rest.call(null,s__3549));
} else
{return cljs.core.cons.call(null,x__3550,kpi.call(null,(idx + 1),cljs.core.rest.call(null,s__3549)));
}
} else
{return null;
}
})));
});

return keepi__3551.call(null,0,coll);
});
/**
* Takes a set of predicates and returns a function f that returns true if all of its
* composing predicates return a logical true value against all of its arguments, else it returns
* false. Note that f is short-circuiting in that it will stop execution on the first
* argument that triggers a logical false result against the original predicates.
* @param {...*} var_args
*/
cljs.core.every_pred = (function() {
var every_pred = null;
var every_pred__3596 = (function (p){
return (function() {
var ep1 = null;
var ep1__3601 = (function (){
return true;
});
var ep1__3602 = (function (x){
return cljs.core.boolean$.call(null,p.call(null,x));
});
var ep1__3603 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3558 = p.call(null,x);

if(cljs.core.truth_(and__3546__auto____3558))
{return p.call(null,y);
} else
{return and__3546__auto____3558;
}
})());
});
var ep1__3604 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3559 = p.call(null,x);

if(cljs.core.truth_(and__3546__auto____3559))
{var and__3546__auto____3560 = p.call(null,y);

if(cljs.core.truth_(and__3546__auto____3560))
{return p.call(null,z);
} else
{return and__3546__auto____3560;
}
} else
{return and__3546__auto____3559;
}
})());
});
var ep1__3605 = (function() { 
var G__3607__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3561 = ep1.call(null,x,y,z);

if(cljs.core.truth_(and__3546__auto____3561))
{return cljs.core.every_QMARK_.call(null,p,args);
} else
{return and__3546__auto____3561;
}
})());
};
var G__3607 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3607__delegate.call(this, x, y, z, args);
};
G__3607.cljs$lang$maxFixedArity = 3;
G__3607.cljs$lang$applyTo = (function (arglist__3608){
var x = cljs.core.first(arglist__3608);
var y = cljs.core.first(cljs.core.next(arglist__3608));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3608)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3608)));
return G__3607__delegate.call(this, x, y, z, args);
});
return G__3607;
})()
;
ep1 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return ep1__3601.call(this);
case  1 :
return ep1__3602.call(this,x);
case  2 :
return ep1__3603.call(this,x,y);
case  3 :
return ep1__3604.call(this,x,y,z);
default:
return ep1__3605.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
ep1.cljs$lang$maxFixedArity = 3;
ep1.cljs$lang$applyTo = ep1__3605.cljs$lang$applyTo;
return ep1;
})()
});
var every_pred__3597 = (function (p1,p2){
return (function() {
var ep2 = null;
var ep2__3609 = (function (){
return true;
});
var ep2__3610 = (function (x){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3562 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3562))
{return p2.call(null,x);
} else
{return and__3546__auto____3562;
}
})());
});
var ep2__3611 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3563 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3563))
{var and__3546__auto____3564 = p1.call(null,y);

if(cljs.core.truth_(and__3546__auto____3564))
{var and__3546__auto____3565 = p2.call(null,x);

if(cljs.core.truth_(and__3546__auto____3565))
{return p2.call(null,y);
} else
{return and__3546__auto____3565;
}
} else
{return and__3546__auto____3564;
}
} else
{return and__3546__auto____3563;
}
})());
});
var ep2__3612 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3566 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3566))
{var and__3546__auto____3567 = p1.call(null,y);

if(cljs.core.truth_(and__3546__auto____3567))
{var and__3546__auto____3568 = p1.call(null,z);

if(cljs.core.truth_(and__3546__auto____3568))
{var and__3546__auto____3569 = p2.call(null,x);

if(cljs.core.truth_(and__3546__auto____3569))
{var and__3546__auto____3570 = p2.call(null,y);

if(cljs.core.truth_(and__3546__auto____3570))
{return p2.call(null,z);
} else
{return and__3546__auto____3570;
}
} else
{return and__3546__auto____3569;
}
} else
{return and__3546__auto____3568;
}
} else
{return and__3546__auto____3567;
}
} else
{return and__3546__auto____3566;
}
})());
});
var ep2__3613 = (function() { 
var G__3615__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3571 = ep2.call(null,x,y,z);

if(cljs.core.truth_(and__3546__auto____3571))
{return cljs.core.every_QMARK_.call(null,(function (p1__3542_SHARP_){
var and__3546__auto____3572 = p1.call(null,p1__3542_SHARP_);

if(cljs.core.truth_(and__3546__auto____3572))
{return p2.call(null,p1__3542_SHARP_);
} else
{return and__3546__auto____3572;
}
}),args);
} else
{return and__3546__auto____3571;
}
})());
};
var G__3615 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3615__delegate.call(this, x, y, z, args);
};
G__3615.cljs$lang$maxFixedArity = 3;
G__3615.cljs$lang$applyTo = (function (arglist__3616){
var x = cljs.core.first(arglist__3616);
var y = cljs.core.first(cljs.core.next(arglist__3616));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3616)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3616)));
return G__3615__delegate.call(this, x, y, z, args);
});
return G__3615;
})()
;
ep2 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return ep2__3609.call(this);
case  1 :
return ep2__3610.call(this,x);
case  2 :
return ep2__3611.call(this,x,y);
case  3 :
return ep2__3612.call(this,x,y,z);
default:
return ep2__3613.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
ep2.cljs$lang$maxFixedArity = 3;
ep2.cljs$lang$applyTo = ep2__3613.cljs$lang$applyTo;
return ep2;
})()
});
var every_pred__3598 = (function (p1,p2,p3){
return (function() {
var ep3 = null;
var ep3__3617 = (function (){
return true;
});
var ep3__3618 = (function (x){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3573 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3573))
{var and__3546__auto____3574 = p2.call(null,x);

if(cljs.core.truth_(and__3546__auto____3574))
{return p3.call(null,x);
} else
{return and__3546__auto____3574;
}
} else
{return and__3546__auto____3573;
}
})());
});
var ep3__3619 = (function (x,y){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3575 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3575))
{var and__3546__auto____3576 = p2.call(null,x);

if(cljs.core.truth_(and__3546__auto____3576))
{var and__3546__auto____3577 = p3.call(null,x);

if(cljs.core.truth_(and__3546__auto____3577))
{var and__3546__auto____3578 = p1.call(null,y);

if(cljs.core.truth_(and__3546__auto____3578))
{var and__3546__auto____3579 = p2.call(null,y);

if(cljs.core.truth_(and__3546__auto____3579))
{return p3.call(null,y);
} else
{return and__3546__auto____3579;
}
} else
{return and__3546__auto____3578;
}
} else
{return and__3546__auto____3577;
}
} else
{return and__3546__auto____3576;
}
} else
{return and__3546__auto____3575;
}
})());
});
var ep3__3620 = (function (x,y,z){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3580 = p1.call(null,x);

if(cljs.core.truth_(and__3546__auto____3580))
{var and__3546__auto____3581 = p2.call(null,x);

if(cljs.core.truth_(and__3546__auto____3581))
{var and__3546__auto____3582 = p3.call(null,x);

if(cljs.core.truth_(and__3546__auto____3582))
{var and__3546__auto____3583 = p1.call(null,y);

if(cljs.core.truth_(and__3546__auto____3583))
{var and__3546__auto____3584 = p2.call(null,y);

if(cljs.core.truth_(and__3546__auto____3584))
{var and__3546__auto____3585 = p3.call(null,y);

if(cljs.core.truth_(and__3546__auto____3585))
{var and__3546__auto____3586 = p1.call(null,z);

if(cljs.core.truth_(and__3546__auto____3586))
{var and__3546__auto____3587 = p2.call(null,z);

if(cljs.core.truth_(and__3546__auto____3587))
{return p3.call(null,z);
} else
{return and__3546__auto____3587;
}
} else
{return and__3546__auto____3586;
}
} else
{return and__3546__auto____3585;
}
} else
{return and__3546__auto____3584;
}
} else
{return and__3546__auto____3583;
}
} else
{return and__3546__auto____3582;
}
} else
{return and__3546__auto____3581;
}
} else
{return and__3546__auto____3580;
}
})());
});
var ep3__3621 = (function() { 
var G__3623__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3588 = ep3.call(null,x,y,z);

if(cljs.core.truth_(and__3546__auto____3588))
{return cljs.core.every_QMARK_.call(null,(function (p1__3543_SHARP_){
var and__3546__auto____3589 = p1.call(null,p1__3543_SHARP_);

if(cljs.core.truth_(and__3546__auto____3589))
{var and__3546__auto____3590 = p2.call(null,p1__3543_SHARP_);

if(cljs.core.truth_(and__3546__auto____3590))
{return p3.call(null,p1__3543_SHARP_);
} else
{return and__3546__auto____3590;
}
} else
{return and__3546__auto____3589;
}
}),args);
} else
{return and__3546__auto____3588;
}
})());
};
var G__3623 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3623__delegate.call(this, x, y, z, args);
};
G__3623.cljs$lang$maxFixedArity = 3;
G__3623.cljs$lang$applyTo = (function (arglist__3624){
var x = cljs.core.first(arglist__3624);
var y = cljs.core.first(cljs.core.next(arglist__3624));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3624)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3624)));
return G__3623__delegate.call(this, x, y, z, args);
});
return G__3623;
})()
;
ep3 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return ep3__3617.call(this);
case  1 :
return ep3__3618.call(this,x);
case  2 :
return ep3__3619.call(this,x,y);
case  3 :
return ep3__3620.call(this,x,y,z);
default:
return ep3__3621.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
ep3.cljs$lang$maxFixedArity = 3;
ep3.cljs$lang$applyTo = ep3__3621.cljs$lang$applyTo;
return ep3;
})()
});
var every_pred__3599 = (function() { 
var G__3625__delegate = function (p1,p2,p3,ps){
var ps__3591 = cljs.core.list_STAR_.call(null,p1,p2,p3,ps);

return (function() {
var epn = null;
var epn__3626 = (function (){
return true;
});
var epn__3627 = (function (x){
return cljs.core.every_QMARK_.call(null,(function (p1__3544_SHARP_){
return p1__3544_SHARP_.call(null,x);
}),ps__3591);
});
var epn__3628 = (function (x,y){
return cljs.core.every_QMARK_.call(null,(function (p1__3545_SHARP_){
var and__3546__auto____3592 = p1__3545_SHARP_.call(null,x);

if(cljs.core.truth_(and__3546__auto____3592))
{return p1__3545_SHARP_.call(null,y);
} else
{return and__3546__auto____3592;
}
}),ps__3591);
});
var epn__3629 = (function (x,y,z){
return cljs.core.every_QMARK_.call(null,(function (p1__3546_SHARP_){
var and__3546__auto____3593 = p1__3546_SHARP_.call(null,x);

if(cljs.core.truth_(and__3546__auto____3593))
{var and__3546__auto____3594 = p1__3546_SHARP_.call(null,y);

if(cljs.core.truth_(and__3546__auto____3594))
{return p1__3546_SHARP_.call(null,z);
} else
{return and__3546__auto____3594;
}
} else
{return and__3546__auto____3593;
}
}),ps__3591);
});
var epn__3630 = (function() { 
var G__3632__delegate = function (x,y,z,args){
return cljs.core.boolean$.call(null,(function (){var and__3546__auto____3595 = epn.call(null,x,y,z);

if(cljs.core.truth_(and__3546__auto____3595))
{return cljs.core.every_QMARK_.call(null,(function (p1__3547_SHARP_){
return cljs.core.every_QMARK_.call(null,p1__3547_SHARP_,args);
}),ps__3591);
} else
{return and__3546__auto____3595;
}
})());
};
var G__3632 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3632__delegate.call(this, x, y, z, args);
};
G__3632.cljs$lang$maxFixedArity = 3;
G__3632.cljs$lang$applyTo = (function (arglist__3633){
var x = cljs.core.first(arglist__3633);
var y = cljs.core.first(cljs.core.next(arglist__3633));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3633)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3633)));
return G__3632__delegate.call(this, x, y, z, args);
});
return G__3632;
})()
;
epn = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return epn__3626.call(this);
case  1 :
return epn__3627.call(this,x);
case  2 :
return epn__3628.call(this,x,y);
case  3 :
return epn__3629.call(this,x,y,z);
default:
return epn__3630.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
epn.cljs$lang$maxFixedArity = 3;
epn.cljs$lang$applyTo = epn__3630.cljs$lang$applyTo;
return epn;
})()
};
var G__3625 = function (p1,p2,p3,var_args){
var ps = null;
if (goog.isDef(var_args)) {
  ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3625__delegate.call(this, p1, p2, p3, ps);
};
G__3625.cljs$lang$maxFixedArity = 3;
G__3625.cljs$lang$applyTo = (function (arglist__3634){
var p1 = cljs.core.first(arglist__3634);
var p2 = cljs.core.first(cljs.core.next(arglist__3634));
var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3634)));
var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3634)));
return G__3625__delegate.call(this, p1, p2, p3, ps);
});
return G__3625;
})()
;
every_pred = function(p1,p2,p3,var_args){
var ps = var_args;
switch(arguments.length){
case  1 :
return every_pred__3596.call(this,p1);
case  2 :
return every_pred__3597.call(this,p1,p2);
case  3 :
return every_pred__3598.call(this,p1,p2,p3);
default:
return every_pred__3599.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
every_pred.cljs$lang$maxFixedArity = 3;
every_pred.cljs$lang$applyTo = every_pred__3599.cljs$lang$applyTo;
return every_pred;
})()
;
/**
* Takes a set of predicates and returns a function f that returns the first logical true value
* returned by one of its composing predicates against any of its arguments, else it returns
* logical false. Note that f is short-circuiting in that it will stop execution on the first
* argument that triggers a logical true result against the original predicates.
* @param {...*} var_args
*/
cljs.core.some_fn = (function() {
var some_fn = null;
var some_fn__3674 = (function (p){
return (function() {
var sp1 = null;
var sp1__3679 = (function (){
return null;
});
var sp1__3680 = (function (x){
return p.call(null,x);
});
var sp1__3681 = (function (x,y){
var or__3548__auto____3636 = p.call(null,x);

if(cljs.core.truth_(or__3548__auto____3636))
{return or__3548__auto____3636;
} else
{return p.call(null,y);
}
});
var sp1__3682 = (function (x,y,z){
var or__3548__auto____3637 = p.call(null,x);

if(cljs.core.truth_(or__3548__auto____3637))
{return or__3548__auto____3637;
} else
{var or__3548__auto____3638 = p.call(null,y);

if(cljs.core.truth_(or__3548__auto____3638))
{return or__3548__auto____3638;
} else
{return p.call(null,z);
}
}
});
var sp1__3683 = (function() { 
var G__3685__delegate = function (x,y,z,args){
var or__3548__auto____3639 = sp1.call(null,x,y,z);

if(cljs.core.truth_(or__3548__auto____3639))
{return or__3548__auto____3639;
} else
{return cljs.core.some.call(null,p,args);
}
};
var G__3685 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3685__delegate.call(this, x, y, z, args);
};
G__3685.cljs$lang$maxFixedArity = 3;
G__3685.cljs$lang$applyTo = (function (arglist__3686){
var x = cljs.core.first(arglist__3686);
var y = cljs.core.first(cljs.core.next(arglist__3686));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3686)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3686)));
return G__3685__delegate.call(this, x, y, z, args);
});
return G__3685;
})()
;
sp1 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return sp1__3679.call(this);
case  1 :
return sp1__3680.call(this,x);
case  2 :
return sp1__3681.call(this,x,y);
case  3 :
return sp1__3682.call(this,x,y,z);
default:
return sp1__3683.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
sp1.cljs$lang$maxFixedArity = 3;
sp1.cljs$lang$applyTo = sp1__3683.cljs$lang$applyTo;
return sp1;
})()
});
var some_fn__3675 = (function (p1,p2){
return (function() {
var sp2 = null;
var sp2__3687 = (function (){
return null;
});
var sp2__3688 = (function (x){
var or__3548__auto____3640 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3640))
{return or__3548__auto____3640;
} else
{return p2.call(null,x);
}
});
var sp2__3689 = (function (x,y){
var or__3548__auto____3641 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3641))
{return or__3548__auto____3641;
} else
{var or__3548__auto____3642 = p1.call(null,y);

if(cljs.core.truth_(or__3548__auto____3642))
{return or__3548__auto____3642;
} else
{var or__3548__auto____3643 = p2.call(null,x);

if(cljs.core.truth_(or__3548__auto____3643))
{return or__3548__auto____3643;
} else
{return p2.call(null,y);
}
}
}
});
var sp2__3690 = (function (x,y,z){
var or__3548__auto____3644 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3644))
{return or__3548__auto____3644;
} else
{var or__3548__auto____3645 = p1.call(null,y);

if(cljs.core.truth_(or__3548__auto____3645))
{return or__3548__auto____3645;
} else
{var or__3548__auto____3646 = p1.call(null,z);

if(cljs.core.truth_(or__3548__auto____3646))
{return or__3548__auto____3646;
} else
{var or__3548__auto____3647 = p2.call(null,x);

if(cljs.core.truth_(or__3548__auto____3647))
{return or__3548__auto____3647;
} else
{var or__3548__auto____3648 = p2.call(null,y);

if(cljs.core.truth_(or__3548__auto____3648))
{return or__3548__auto____3648;
} else
{return p2.call(null,z);
}
}
}
}
}
});
var sp2__3691 = (function() { 
var G__3693__delegate = function (x,y,z,args){
var or__3548__auto____3649 = sp2.call(null,x,y,z);

if(cljs.core.truth_(or__3548__auto____3649))
{return or__3548__auto____3649;
} else
{return cljs.core.some.call(null,(function (p1__3552_SHARP_){
var or__3548__auto____3650 = p1.call(null,p1__3552_SHARP_);

if(cljs.core.truth_(or__3548__auto____3650))
{return or__3548__auto____3650;
} else
{return p2.call(null,p1__3552_SHARP_);
}
}),args);
}
};
var G__3693 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3693__delegate.call(this, x, y, z, args);
};
G__3693.cljs$lang$maxFixedArity = 3;
G__3693.cljs$lang$applyTo = (function (arglist__3694){
var x = cljs.core.first(arglist__3694);
var y = cljs.core.first(cljs.core.next(arglist__3694));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3694)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3694)));
return G__3693__delegate.call(this, x, y, z, args);
});
return G__3693;
})()
;
sp2 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return sp2__3687.call(this);
case  1 :
return sp2__3688.call(this,x);
case  2 :
return sp2__3689.call(this,x,y);
case  3 :
return sp2__3690.call(this,x,y,z);
default:
return sp2__3691.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
sp2.cljs$lang$maxFixedArity = 3;
sp2.cljs$lang$applyTo = sp2__3691.cljs$lang$applyTo;
return sp2;
})()
});
var some_fn__3676 = (function (p1,p2,p3){
return (function() {
var sp3 = null;
var sp3__3695 = (function (){
return null;
});
var sp3__3696 = (function (x){
var or__3548__auto____3651 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3651))
{return or__3548__auto____3651;
} else
{var or__3548__auto____3652 = p2.call(null,x);

if(cljs.core.truth_(or__3548__auto____3652))
{return or__3548__auto____3652;
} else
{return p3.call(null,x);
}
}
});
var sp3__3697 = (function (x,y){
var or__3548__auto____3653 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3653))
{return or__3548__auto____3653;
} else
{var or__3548__auto____3654 = p2.call(null,x);

if(cljs.core.truth_(or__3548__auto____3654))
{return or__3548__auto____3654;
} else
{var or__3548__auto____3655 = p3.call(null,x);

if(cljs.core.truth_(or__3548__auto____3655))
{return or__3548__auto____3655;
} else
{var or__3548__auto____3656 = p1.call(null,y);

if(cljs.core.truth_(or__3548__auto____3656))
{return or__3548__auto____3656;
} else
{var or__3548__auto____3657 = p2.call(null,y);

if(cljs.core.truth_(or__3548__auto____3657))
{return or__3548__auto____3657;
} else
{return p3.call(null,y);
}
}
}
}
}
});
var sp3__3698 = (function (x,y,z){
var or__3548__auto____3658 = p1.call(null,x);

if(cljs.core.truth_(or__3548__auto____3658))
{return or__3548__auto____3658;
} else
{var or__3548__auto____3659 = p2.call(null,x);

if(cljs.core.truth_(or__3548__auto____3659))
{return or__3548__auto____3659;
} else
{var or__3548__auto____3660 = p3.call(null,x);

if(cljs.core.truth_(or__3548__auto____3660))
{return or__3548__auto____3660;
} else
{var or__3548__auto____3661 = p1.call(null,y);

if(cljs.core.truth_(or__3548__auto____3661))
{return or__3548__auto____3661;
} else
{var or__3548__auto____3662 = p2.call(null,y);

if(cljs.core.truth_(or__3548__auto____3662))
{return or__3548__auto____3662;
} else
{var or__3548__auto____3663 = p3.call(null,y);

if(cljs.core.truth_(or__3548__auto____3663))
{return or__3548__auto____3663;
} else
{var or__3548__auto____3664 = p1.call(null,z);

if(cljs.core.truth_(or__3548__auto____3664))
{return or__3548__auto____3664;
} else
{var or__3548__auto____3665 = p2.call(null,z);

if(cljs.core.truth_(or__3548__auto____3665))
{return or__3548__auto____3665;
} else
{return p3.call(null,z);
}
}
}
}
}
}
}
}
});
var sp3__3699 = (function() { 
var G__3701__delegate = function (x,y,z,args){
var or__3548__auto____3666 = sp3.call(null,x,y,z);

if(cljs.core.truth_(or__3548__auto____3666))
{return or__3548__auto____3666;
} else
{return cljs.core.some.call(null,(function (p1__3553_SHARP_){
var or__3548__auto____3667 = p1.call(null,p1__3553_SHARP_);

if(cljs.core.truth_(or__3548__auto____3667))
{return or__3548__auto____3667;
} else
{var or__3548__auto____3668 = p2.call(null,p1__3553_SHARP_);

if(cljs.core.truth_(or__3548__auto____3668))
{return or__3548__auto____3668;
} else
{return p3.call(null,p1__3553_SHARP_);
}
}
}),args);
}
};
var G__3701 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3701__delegate.call(this, x, y, z, args);
};
G__3701.cljs$lang$maxFixedArity = 3;
G__3701.cljs$lang$applyTo = (function (arglist__3702){
var x = cljs.core.first(arglist__3702);
var y = cljs.core.first(cljs.core.next(arglist__3702));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3702)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3702)));
return G__3701__delegate.call(this, x, y, z, args);
});
return G__3701;
})()
;
sp3 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return sp3__3695.call(this);
case  1 :
return sp3__3696.call(this,x);
case  2 :
return sp3__3697.call(this,x,y);
case  3 :
return sp3__3698.call(this,x,y,z);
default:
return sp3__3699.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
sp3.cljs$lang$maxFixedArity = 3;
sp3.cljs$lang$applyTo = sp3__3699.cljs$lang$applyTo;
return sp3;
})()
});
var some_fn__3677 = (function() { 
var G__3703__delegate = function (p1,p2,p3,ps){
var ps__3669 = cljs.core.list_STAR_.call(null,p1,p2,p3,ps);

return (function() {
var spn = null;
var spn__3704 = (function (){
return null;
});
var spn__3705 = (function (x){
return cljs.core.some.call(null,(function (p1__3554_SHARP_){
return p1__3554_SHARP_.call(null,x);
}),ps__3669);
});
var spn__3706 = (function (x,y){
return cljs.core.some.call(null,(function (p1__3555_SHARP_){
var or__3548__auto____3670 = p1__3555_SHARP_.call(null,x);

if(cljs.core.truth_(or__3548__auto____3670))
{return or__3548__auto____3670;
} else
{return p1__3555_SHARP_.call(null,y);
}
}),ps__3669);
});
var spn__3707 = (function (x,y,z){
return cljs.core.some.call(null,(function (p1__3556_SHARP_){
var or__3548__auto____3671 = p1__3556_SHARP_.call(null,x);

if(cljs.core.truth_(or__3548__auto____3671))
{return or__3548__auto____3671;
} else
{var or__3548__auto____3672 = p1__3556_SHARP_.call(null,y);

if(cljs.core.truth_(or__3548__auto____3672))
{return or__3548__auto____3672;
} else
{return p1__3556_SHARP_.call(null,z);
}
}
}),ps__3669);
});
var spn__3708 = (function() { 
var G__3710__delegate = function (x,y,z,args){
var or__3548__auto____3673 = spn.call(null,x,y,z);

if(cljs.core.truth_(or__3548__auto____3673))
{return or__3548__auto____3673;
} else
{return cljs.core.some.call(null,(function (p1__3557_SHARP_){
return cljs.core.some.call(null,p1__3557_SHARP_,args);
}),ps__3669);
}
};
var G__3710 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3710__delegate.call(this, x, y, z, args);
};
G__3710.cljs$lang$maxFixedArity = 3;
G__3710.cljs$lang$applyTo = (function (arglist__3711){
var x = cljs.core.first(arglist__3711);
var y = cljs.core.first(cljs.core.next(arglist__3711));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3711)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3711)));
return G__3710__delegate.call(this, x, y, z, args);
});
return G__3710;
})()
;
spn = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return spn__3704.call(this);
case  1 :
return spn__3705.call(this,x);
case  2 :
return spn__3706.call(this,x,y);
case  3 :
return spn__3707.call(this,x,y,z);
default:
return spn__3708.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
spn.cljs$lang$maxFixedArity = 3;
spn.cljs$lang$applyTo = spn__3708.cljs$lang$applyTo;
return spn;
})()
};
var G__3703 = function (p1,p2,p3,var_args){
var ps = null;
if (goog.isDef(var_args)) {
  ps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__3703__delegate.call(this, p1, p2, p3, ps);
};
G__3703.cljs$lang$maxFixedArity = 3;
G__3703.cljs$lang$applyTo = (function (arglist__3712){
var p1 = cljs.core.first(arglist__3712);
var p2 = cljs.core.first(cljs.core.next(arglist__3712));
var p3 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3712)));
var ps = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3712)));
return G__3703__delegate.call(this, p1, p2, p3, ps);
});
return G__3703;
})()
;
some_fn = function(p1,p2,p3,var_args){
var ps = var_args;
switch(arguments.length){
case  1 :
return some_fn__3674.call(this,p1);
case  2 :
return some_fn__3675.call(this,p1,p2);
case  3 :
return some_fn__3676.call(this,p1,p2,p3);
default:
return some_fn__3677.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
some_fn.cljs$lang$maxFixedArity = 3;
some_fn.cljs$lang$applyTo = some_fn__3677.cljs$lang$applyTo;
return some_fn;
})()
;
/**
* Returns a lazy sequence consisting of the result of applying f to the
* set of first items of each coll, followed by applying f to the set
* of second items in each coll, until any one of the colls is
* exhausted.  Any remaining items in other colls are ignored. Function
* f should accept number-of-colls arguments.
* @param {...*} var_args
*/
cljs.core.map = (function() {
var map = null;
var map__3725 = (function (f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3713 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3713))
{var s__3714 = temp__3698__auto____3713;

return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s__3714)),map.call(null,f,cljs.core.rest.call(null,s__3714)));
} else
{return null;
}
})));
});
var map__3726 = (function (f,c1,c2){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__3715 = cljs.core.seq.call(null,c1);
var s2__3716 = cljs.core.seq.call(null,c2);

if(cljs.core.truth_((function (){var and__3546__auto____3717 = s1__3715;

if(cljs.core.truth_(and__3546__auto____3717))
{return s2__3716;
} else
{return and__3546__auto____3717;
}
})()))
{return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s1__3715),cljs.core.first.call(null,s2__3716)),map.call(null,f,cljs.core.rest.call(null,s1__3715),cljs.core.rest.call(null,s2__3716)));
} else
{return null;
}
})));
});
var map__3727 = (function (f,c1,c2,c3){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__3718 = cljs.core.seq.call(null,c1);
var s2__3719 = cljs.core.seq.call(null,c2);
var s3__3720 = cljs.core.seq.call(null,c3);

if(cljs.core.truth_((function (){var and__3546__auto____3721 = s1__3718;

if(cljs.core.truth_(and__3546__auto____3721))
{var and__3546__auto____3722 = s2__3719;

if(cljs.core.truth_(and__3546__auto____3722))
{return s3__3720;
} else
{return and__3546__auto____3722;
}
} else
{return and__3546__auto____3721;
}
})()))
{return cljs.core.cons.call(null,f.call(null,cljs.core.first.call(null,s1__3718),cljs.core.first.call(null,s2__3719),cljs.core.first.call(null,s3__3720)),map.call(null,f,cljs.core.rest.call(null,s1__3718),cljs.core.rest.call(null,s2__3719),cljs.core.rest.call(null,s3__3720)));
} else
{return null;
}
})));
});
var map__3728 = (function() { 
var G__3730__delegate = function (f,c1,c2,c3,colls){
var step__3724 = (function step(cs){
return (new cljs.core.LazySeq(null,false,(function (){
var ss__3723 = map.call(null,cljs.core.seq,cs);

if(cljs.core.truth_(cljs.core.every_QMARK_.call(null,cljs.core.identity,ss__3723)))
{return cljs.core.cons.call(null,map.call(null,cljs.core.first,ss__3723),step.call(null,map.call(null,cljs.core.rest,ss__3723)));
} else
{return null;
}
})));
});

return map.call(null,(function (p1__3635_SHARP_){
return cljs.core.apply.call(null,f,p1__3635_SHARP_);
}),step__3724.call(null,cljs.core.conj.call(null,colls,c3,c2,c1)));
};
var G__3730 = function (f,c1,c2,c3,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 4),0);
} 
return G__3730__delegate.call(this, f, c1, c2, c3, colls);
};
G__3730.cljs$lang$maxFixedArity = 4;
G__3730.cljs$lang$applyTo = (function (arglist__3731){
var f = cljs.core.first(arglist__3731);
var c1 = cljs.core.first(cljs.core.next(arglist__3731));
var c2 = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3731)));
var c3 = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3731))));
var colls = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(arglist__3731))));
return G__3730__delegate.call(this, f, c1, c2, c3, colls);
});
return G__3730;
})()
;
map = function(f,c1,c2,c3,var_args){
var colls = var_args;
switch(arguments.length){
case  2 :
return map__3725.call(this,f,c1);
case  3 :
return map__3726.call(this,f,c1,c2);
case  4 :
return map__3727.call(this,f,c1,c2,c3);
default:
return map__3728.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
map.cljs$lang$maxFixedArity = 4;
map.cljs$lang$applyTo = map__3728.cljs$lang$applyTo;
return map;
})()
;
/**
* Returns a lazy sequence of the first n items in coll, or all items if
* there are fewer than n.
*/
cljs.core.take = (function take(n,coll){
return (new cljs.core.LazySeq(null,false,(function (){
if(cljs.core.truth_((n > 0)))
{var temp__3698__auto____3732 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3732))
{var s__3733 = temp__3698__auto____3732;

return cljs.core.cons.call(null,cljs.core.first.call(null,s__3733),take.call(null,(n - 1),cljs.core.rest.call(null,s__3733)));
} else
{return null;
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of all but the first n items in coll.
*/
cljs.core.drop = (function drop(n,coll){
var step__3736 = (function (n,coll){
while(true){
var s__3734 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_((function (){var and__3546__auto____3735 = (n > 0);

if(cljs.core.truth_(and__3546__auto____3735))
{return s__3734;
} else
{return and__3546__auto____3735;
}
})()))
{{
var G__3737 = (n - 1);
var G__3738 = cljs.core.rest.call(null,s__3734);
n = G__3737;
coll = G__3738;
continue;
}
} else
{return s__3734;
}
break;
}
});

return (new cljs.core.LazySeq(null,false,(function (){
return step__3736.call(null,n,coll);
})));
});
/**
* Return a lazy sequence of all but the last n (default 1) items in coll
*/
cljs.core.drop_last = (function() {
var drop_last = null;
var drop_last__3739 = (function (s){
return drop_last.call(null,1,s);
});
var drop_last__3740 = (function (n,s){
return cljs.core.map.call(null,(function (x,_){
return x;
}),s,cljs.core.drop.call(null,n,s));
});
drop_last = function(n,s){
switch(arguments.length){
case  1 :
return drop_last__3739.call(this,n);
case  2 :
return drop_last__3740.call(this,n,s);
}
throw('Invalid arity: ' + arguments.length);
};
return drop_last;
})()
;
/**
* Returns a seq of the last n items in coll.  Depending on the type
* of coll may be no better than linear time.  For vectors, see also subvec.
*/
cljs.core.take_last = (function take_last(n,coll){
var s__3742 = cljs.core.seq.call(null,coll);
var lead__3743 = cljs.core.seq.call(null,cljs.core.drop.call(null,n,coll));

while(true){
if(cljs.core.truth_(lead__3743))
{{
var G__3744 = cljs.core.next.call(null,s__3742);
var G__3745 = cljs.core.next.call(null,lead__3743);
s__3742 = G__3744;
lead__3743 = G__3745;
continue;
}
} else
{return s__3742;
}
break;
}
});
/**
* Returns a lazy sequence of the items in coll starting from the first
* item for which (pred item) returns nil.
*/
cljs.core.drop_while = (function drop_while(pred,coll){
var step__3748 = (function (pred,coll){
while(true){
var s__3746 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_((function (){var and__3546__auto____3747 = s__3746;

if(cljs.core.truth_(and__3546__auto____3747))
{return pred.call(null,cljs.core.first.call(null,s__3746));
} else
{return and__3546__auto____3747;
}
})()))
{{
var G__3749 = pred;
var G__3750 = cljs.core.rest.call(null,s__3746);
pred = G__3749;
coll = G__3750;
continue;
}
} else
{return s__3746;
}
break;
}
});

return (new cljs.core.LazySeq(null,false,(function (){
return step__3748.call(null,pred,coll);
})));
});
/**
* Returns a lazy (infinite!) sequence of repetitions of the items in coll.
*/
cljs.core.cycle = (function cycle(coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3751 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3751))
{var s__3752 = temp__3698__auto____3751;

return cljs.core.concat.call(null,s__3752,cycle.call(null,s__3752));
} else
{return null;
}
})));
});
/**
* Returns a vector of [(take n coll) (drop n coll)]
*/
cljs.core.split_at = (function split_at(n,coll){
return cljs.core.Vector.fromArray([cljs.core.take.call(null,n,coll),cljs.core.drop.call(null,n,coll)]);
});
/**
* Returns a lazy (infinite!, or length n if supplied) sequence of xs.
*/
cljs.core.repeat = (function() {
var repeat = null;
var repeat__3753 = (function (x){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,x,repeat.call(null,x));
})));
});
var repeat__3754 = (function (n,x){
return cljs.core.take.call(null,n,repeat.call(null,x));
});
repeat = function(n,x){
switch(arguments.length){
case  1 :
return repeat__3753.call(this,n);
case  2 :
return repeat__3754.call(this,n,x);
}
throw('Invalid arity: ' + arguments.length);
};
return repeat;
})()
;
/**
* Returns a lazy seq of n xs.
*/
cljs.core.replicate = (function replicate(n,x){
return cljs.core.take.call(null,n,cljs.core.repeat.call(null,x));
});
/**
* Takes a function of no args, presumably with side effects, and
* returns an infinite (or length n if supplied) lazy sequence of calls
* to it
*/
cljs.core.repeatedly = (function() {
var repeatedly = null;
var repeatedly__3756 = (function (f){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,f.call(null),repeatedly.call(null,f));
})));
});
var repeatedly__3757 = (function (n,f){
return cljs.core.take.call(null,n,repeatedly.call(null,f));
});
repeatedly = function(n,f){
switch(arguments.length){
case  1 :
return repeatedly__3756.call(this,n);
case  2 :
return repeatedly__3757.call(this,n,f);
}
throw('Invalid arity: ' + arguments.length);
};
return repeatedly;
})()
;
/**
* Returns a lazy sequence of x, (f x), (f (f x)) etc. f must be free of side-effects
*/
cljs.core.iterate = (function iterate(f,x){
return cljs.core.cons.call(null,x,(new cljs.core.LazySeq(null,false,(function (){
return iterate.call(null,f,f.call(null,x));
}))));
});
/**
* Returns a lazy seq of the first item in each coll, then the second etc.
* @param {...*} var_args
*/
cljs.core.interleave = (function() {
var interleave = null;
var interleave__3763 = (function (c1,c2){
return (new cljs.core.LazySeq(null,false,(function (){
var s1__3759 = cljs.core.seq.call(null,c1);
var s2__3760 = cljs.core.seq.call(null,c2);

if(cljs.core.truth_((function (){var and__3546__auto____3761 = s1__3759;

if(cljs.core.truth_(and__3546__auto____3761))
{return s2__3760;
} else
{return and__3546__auto____3761;
}
})()))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s1__3759),cljs.core.cons.call(null,cljs.core.first.call(null,s2__3760),interleave.call(null,cljs.core.rest.call(null,s1__3759),cljs.core.rest.call(null,s2__3760))));
} else
{return null;
}
})));
});
var interleave__3764 = (function() { 
var G__3766__delegate = function (c1,c2,colls){
return (new cljs.core.LazySeq(null,false,(function (){
var ss__3762 = cljs.core.map.call(null,cljs.core.seq,cljs.core.conj.call(null,colls,c2,c1));

if(cljs.core.truth_(cljs.core.every_QMARK_.call(null,cljs.core.identity,ss__3762)))
{return cljs.core.concat.call(null,cljs.core.map.call(null,cljs.core.first,ss__3762),cljs.core.apply.call(null,interleave,cljs.core.map.call(null,cljs.core.rest,ss__3762)));
} else
{return null;
}
})));
};
var G__3766 = function (c1,c2,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3766__delegate.call(this, c1, c2, colls);
};
G__3766.cljs$lang$maxFixedArity = 2;
G__3766.cljs$lang$applyTo = (function (arglist__3767){
var c1 = cljs.core.first(arglist__3767);
var c2 = cljs.core.first(cljs.core.next(arglist__3767));
var colls = cljs.core.rest(cljs.core.next(arglist__3767));
return G__3766__delegate.call(this, c1, c2, colls);
});
return G__3766;
})()
;
interleave = function(c1,c2,var_args){
var colls = var_args;
switch(arguments.length){
case  2 :
return interleave__3763.call(this,c1,c2);
default:
return interleave__3764.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
interleave.cljs$lang$maxFixedArity = 2;
interleave.cljs$lang$applyTo = interleave__3764.cljs$lang$applyTo;
return interleave;
})()
;
/**
* Returns a lazy seq of the elements of coll separated by sep
*/
cljs.core.interpose = (function interpose(sep,coll){
return cljs.core.drop.call(null,1,cljs.core.interleave.call(null,cljs.core.repeat.call(null,sep),coll));
});
/**
* Take a collection of collections, and return a lazy seq
* of items from the inner collection
*/
cljs.core.flatten1 = (function flatten1(colls){
var cat__3770 = (function cat(coll,colls){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3695__auto____3768 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3695__auto____3768))
{var coll__3769 = temp__3695__auto____3768;

return cljs.core.cons.call(null,cljs.core.first.call(null,coll__3769),cat.call(null,cljs.core.rest.call(null,coll__3769),colls));
} else
{if(cljs.core.truth_(cljs.core.seq.call(null,colls)))
{return cat.call(null,cljs.core.first.call(null,colls),cljs.core.rest.call(null,colls));
} else
{return null;
}
}
})));
});

return cat__3770.call(null,null,colls);
});
/**
* Returns the result of applying concat to the result of applying map
* to f and colls.  Thus function f should return a collection.
* @param {...*} var_args
*/
cljs.core.mapcat = (function() {
var mapcat = null;
var mapcat__3771 = (function (f,coll){
return cljs.core.flatten1.call(null,cljs.core.map.call(null,f,coll));
});
var mapcat__3772 = (function() { 
var G__3774__delegate = function (f,coll,colls){
return cljs.core.flatten1.call(null,cljs.core.apply.call(null,cljs.core.map,f,coll,colls));
};
var G__3774 = function (f,coll,var_args){
var colls = null;
if (goog.isDef(var_args)) {
  colls = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return G__3774__delegate.call(this, f, coll, colls);
};
G__3774.cljs$lang$maxFixedArity = 2;
G__3774.cljs$lang$applyTo = (function (arglist__3775){
var f = cljs.core.first(arglist__3775);
var coll = cljs.core.first(cljs.core.next(arglist__3775));
var colls = cljs.core.rest(cljs.core.next(arglist__3775));
return G__3774__delegate.call(this, f, coll, colls);
});
return G__3774;
})()
;
mapcat = function(f,coll,var_args){
var colls = var_args;
switch(arguments.length){
case  2 :
return mapcat__3771.call(this,f,coll);
default:
return mapcat__3772.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
mapcat.cljs$lang$maxFixedArity = 2;
mapcat.cljs$lang$applyTo = mapcat__3772.cljs$lang$applyTo;
return mapcat;
})()
;
/**
* Returns a lazy sequence of the items in coll for which
* (pred item) returns true. pred must be free of side-effects.
*/
cljs.core.filter = (function filter(pred,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3776 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3776))
{var s__3777 = temp__3698__auto____3776;

var f__3778 = cljs.core.first.call(null,s__3777);
var r__3779 = cljs.core.rest.call(null,s__3777);

if(cljs.core.truth_(pred.call(null,f__3778)))
{return cljs.core.cons.call(null,f__3778,filter.call(null,pred,r__3779));
} else
{return filter.call(null,pred,r__3779);
}
} else
{return null;
}
})));
});
/**
* Returns a lazy sequence of the items in coll for which
* (pred item) returns false. pred must be free of side-effects.
*/
cljs.core.remove = (function remove(pred,coll){
return cljs.core.filter.call(null,cljs.core.complement.call(null,pred),coll);
});
/**
* Returns a lazy sequence of the nodes in a tree, via a depth-first walk.
* branch? must be a fn of one arg that returns true if passed a node
* that can have children (but may not).  children must be a fn of one
* arg that returns a sequence of the children. Will only be called on
* nodes for which branch? returns true. Root is the root node of the
* tree.
*/
cljs.core.tree_seq = (function tree_seq(branch_QMARK_,children,root){
var walk__3781 = (function walk(node){
return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,node,(cljs.core.truth_(branch_QMARK_.call(null,node))?cljs.core.mapcat.call(null,walk,children.call(null,node)):null));
})));
});

return walk__3781.call(null,root);
});
/**
* Takes any nested combination of sequential things (lists, vectors,
* etc.) and returns their contents as a single, flat sequence.
* (flatten nil) returns nil.
*/
cljs.core.flatten = (function flatten(x){
return cljs.core.filter.call(null,(function (p1__3780_SHARP_){
return cljs.core.not.call(null,cljs.core.sequential_QMARK_.call(null,p1__3780_SHARP_));
}),cljs.core.rest.call(null,cljs.core.tree_seq.call(null,cljs.core.sequential_QMARK_,cljs.core.seq,x)));
});
/**
* Returns a new coll consisting of to-coll with all of the items of
* from-coll conjoined.
*/
cljs.core.into = (function into(to,from){
return cljs.core.reduce.call(null,cljs.core._conj,to,from);
});
/**
* Returns a lazy sequence of lists of n items each, at offsets step
* apart. If step is not supplied, defaults to n, i.e. the partitions
* do not overlap. If a pad collection is supplied, use its elements as
* necessary to complete last partition upto n items. In case there are
* not enough padding elements, return a partition with less than n items.
*/
cljs.core.partition = (function() {
var partition = null;
var partition__3788 = (function (n,coll){
return partition.call(null,n,n,coll);
});
var partition__3789 = (function (n,step,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3782 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3782))
{var s__3783 = temp__3698__auto____3782;

var p__3784 = cljs.core.take.call(null,n,s__3783);

if(cljs.core.truth_(cljs.core._EQ_.call(null,n,cljs.core.count.call(null,p__3784))))
{return cljs.core.cons.call(null,p__3784,partition.call(null,n,step,cljs.core.drop.call(null,step,s__3783)));
} else
{return null;
}
} else
{return null;
}
})));
});
var partition__3790 = (function (n,step,pad,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____3785 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____3785))
{var s__3786 = temp__3698__auto____3785;

var p__3787 = cljs.core.take.call(null,n,s__3786);

if(cljs.core.truth_(cljs.core._EQ_.call(null,n,cljs.core.count.call(null,p__3787))))
{return cljs.core.cons.call(null,p__3787,partition.call(null,n,step,pad,cljs.core.drop.call(null,step,s__3786)));
} else
{return cljs.core.list.call(null,cljs.core.take.call(null,n,cljs.core.concat.call(null,p__3787,pad)));
}
} else
{return null;
}
})));
});
partition = function(n,step,pad,coll){
switch(arguments.length){
case  2 :
return partition__3788.call(this,n,step);
case  3 :
return partition__3789.call(this,n,step,pad);
case  4 :
return partition__3790.call(this,n,step,pad,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return partition;
})()
;
/**
* Returns the value in a nested associative structure,
* where ks is a sequence of ke(ys. Returns nil if the key is not present,
* or the not-found value if supplied.
*/
cljs.core.get_in = (function() {
var get_in = null;
var get_in__3796 = (function (m,ks){
return cljs.core.reduce.call(null,cljs.core.get,m,ks);
});
var get_in__3797 = (function (m,ks,not_found){
var sentinel__3792 = cljs.core.lookup_sentinel;
var m__3793 = m;
var ks__3794 = cljs.core.seq.call(null,ks);

while(true){
if(cljs.core.truth_(ks__3794))
{var m__3795 = cljs.core.get.call(null,m__3793,cljs.core.first.call(null,ks__3794),sentinel__3792);

if(cljs.core.truth_((sentinel__3792 === m__3795)))
{return not_found;
} else
{{
var G__3799 = sentinel__3792;
var G__3800 = m__3795;
var G__3801 = cljs.core.next.call(null,ks__3794);
sentinel__3792 = G__3799;
m__3793 = G__3800;
ks__3794 = G__3801;
continue;
}
}
} else
{return m__3793;
}
break;
}
});
get_in = function(m,ks,not_found){
switch(arguments.length){
case  2 :
return get_in__3796.call(this,m,ks);
case  3 :
return get_in__3797.call(this,m,ks,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return get_in;
})()
;
/**
* Associates a value in a nested associative structure, where ks is a
* sequence of keys and v is the new value and returns a new nested structure.
* If any levels do not exist, hash-maps will be created.
*/
cljs.core.assoc_in = (function assoc_in(m,p__3802,v){
var vec__3803__3804 = p__3802;
var k__3805 = cljs.core.nth.call(null,vec__3803__3804,0,null);
var ks__3806 = cljs.core.nthnext.call(null,vec__3803__3804,1);

if(cljs.core.truth_(ks__3806))
{return cljs.core.assoc.call(null,m,k__3805,assoc_in.call(null,cljs.core.get.call(null,m,k__3805),ks__3806,v));
} else
{return cljs.core.assoc.call(null,m,k__3805,v);
}
});
/**
* 'Updates' a value in a nested associative structure, where ks is a
* sequence of keys and f is a function that will take the old value
* and any supplied args and return the new value, and returns a new
* nested structure.  If any levels do not exist, hash-maps will be
* created.
* @param {...*} var_args
*/
cljs.core.update_in = (function() { 
var update_in__delegate = function (m,p__3807,f,args){
var vec__3808__3809 = p__3807;
var k__3810 = cljs.core.nth.call(null,vec__3808__3809,0,null);
var ks__3811 = cljs.core.nthnext.call(null,vec__3808__3809,1);

if(cljs.core.truth_(ks__3811))
{return cljs.core.assoc.call(null,m,k__3810,cljs.core.apply.call(null,update_in,cljs.core.get.call(null,m,k__3810),ks__3811,f,args));
} else
{return cljs.core.assoc.call(null,m,k__3810,cljs.core.apply.call(null,f,cljs.core.get.call(null,m,k__3810),args));
}
};
var update_in = function (m,p__3807,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return update_in__delegate.call(this, m, p__3807, f, args);
};
update_in.cljs$lang$maxFixedArity = 3;
update_in.cljs$lang$applyTo = (function (arglist__3812){
var m = cljs.core.first(arglist__3812);
var p__3807 = cljs.core.first(cljs.core.next(arglist__3812));
var f = cljs.core.first(cljs.core.next(cljs.core.next(arglist__3812)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__3812)));
return update_in__delegate.call(this, m, p__3807, f, args);
});
return update_in;
})()
;

/**
* @constructor
*/
cljs.core.Vector = (function (meta,array){
this.meta = meta;
this.array = array;
})
cljs.core.Vector.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Vector");
});
cljs.core.Vector.prototype.cljs$core$IHash$ = true;
cljs.core.Vector.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3813 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.Vector.prototype.cljs$core$ILookup$ = true;
cljs.core.Vector.prototype.cljs$core$ILookup$_lookup = (function() {
var G__3846 = null;
var G__3846__3847 = (function (coll,k){
var this__3814 = this;
return cljs.core._nth.call(null,coll,k,null);
});
var G__3846__3848 = (function (coll,k,not_found){
var this__3815 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
G__3846 = function(coll,k,not_found){
switch(arguments.length){
case  2 :
return G__3846__3847.call(this,coll,k);
case  3 :
return G__3846__3848.call(this,coll,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3846;
})()
;
cljs.core.Vector.prototype.cljs$core$IAssociative$ = true;
cljs.core.Vector.prototype.cljs$core$IAssociative$_assoc = (function (coll,k,v){
var this__3816 = this;
var new_array__3817 = cljs.core.aclone.call(null,this__3816.array);

(new_array__3817[k] = v);
return (new cljs.core.Vector(this__3816.meta,new_array__3817));
});
cljs.core.Vector.prototype.cljs$core$IFn$ = true;
cljs.core.Vector.prototype.call = (function() {
var G__3850 = null;
var G__3850__3851 = (function (tsym3818,k){
var this__3820 = this;
var tsym3818__3821 = this;

var coll__3822 = tsym3818__3821;

return cljs.core._lookup.call(null,coll__3822,k);
});
var G__3850__3852 = (function (tsym3819,k,not_found){
var this__3823 = this;
var tsym3819__3824 = this;

var coll__3825 = tsym3819__3824;

return cljs.core._lookup.call(null,coll__3825,k,not_found);
});
G__3850 = function(tsym3819,k,not_found){
switch(arguments.length){
case  2 :
return G__3850__3851.call(this,tsym3819,k);
case  3 :
return G__3850__3852.call(this,tsym3819,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3850;
})()
;
cljs.core.Vector.prototype.cljs$core$ISequential$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$ = true;
cljs.core.Vector.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3826 = this;
var new_array__3827 = cljs.core.aclone.call(null,this__3826.array);

new_array__3827.push(o);
return (new cljs.core.Vector(this__3826.meta,new_array__3827));
});
cljs.core.Vector.prototype.cljs$core$IReduce$ = true;
cljs.core.Vector.prototype.cljs$core$IReduce$_reduce = (function() {
var G__3854 = null;
var G__3854__3855 = (function (v,f){
var this__3828 = this;
return cljs.core.ci_reduce.call(null,this__3828.array,f);
});
var G__3854__3856 = (function (v,f,start){
var this__3829 = this;
return cljs.core.ci_reduce.call(null,this__3829.array,f,start);
});
G__3854 = function(v,f,start){
switch(arguments.length){
case  2 :
return G__3854__3855.call(this,v,f);
case  3 :
return G__3854__3856.call(this,v,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3854;
})()
;
cljs.core.Vector.prototype.cljs$core$ISeqable$ = true;
cljs.core.Vector.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3830 = this;
if(cljs.core.truth_((this__3830.array.length > 0)))
{var vector_seq__3831 = (function vector_seq(i){
return (new cljs.core.LazySeq(null,false,(function (){
if(cljs.core.truth_((i < this__3830.array.length)))
{return cljs.core.cons.call(null,(this__3830.array[i]),vector_seq.call(null,(i + 1)));
} else
{return null;
}
})));
});

return vector_seq__3831.call(null,0);
} else
{return null;
}
});
cljs.core.Vector.prototype.cljs$core$ICounted$ = true;
cljs.core.Vector.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3832 = this;
return this__3832.array.length;
});
cljs.core.Vector.prototype.cljs$core$IStack$ = true;
cljs.core.Vector.prototype.cljs$core$IStack$_peek = (function (coll){
var this__3833 = this;
var count__3834 = this__3833.array.length;

if(cljs.core.truth_((count__3834 > 0)))
{return (this__3833.array[(count__3834 - 1)]);
} else
{return null;
}
});
cljs.core.Vector.prototype.cljs$core$IStack$_pop = (function (coll){
var this__3835 = this;
if(cljs.core.truth_((this__3835.array.length > 0)))
{var new_array__3836 = cljs.core.aclone.call(null,this__3835.array);

new_array__3836.pop();
return (new cljs.core.Vector(this__3835.meta,new_array__3836));
} else
{throw (new Error("Can't pop empty vector"));
}
});
cljs.core.Vector.prototype.cljs$core$IVector$ = true;
cljs.core.Vector.prototype.cljs$core$IVector$_assoc_n = (function (coll,n,val){
var this__3837 = this;
return cljs.core._assoc.call(null,coll,n,val);
});
cljs.core.Vector.prototype.cljs$core$IEquiv$ = true;
cljs.core.Vector.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3838 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Vector.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3839 = this;
return (new cljs.core.Vector(meta,this__3839.array));
});
cljs.core.Vector.prototype.cljs$core$IMeta$ = true;
cljs.core.Vector.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3840 = this;
return this__3840.meta;
});
cljs.core.Vector.prototype.cljs$core$IIndexed$ = true;
cljs.core.Vector.prototype.cljs$core$IIndexed$_nth = (function() {
var G__3858 = null;
var G__3858__3859 = (function (coll,n){
var this__3841 = this;
if(cljs.core.truth_((function (){var and__3546__auto____3842 = (0 <= n);

if(cljs.core.truth_(and__3546__auto____3842))
{return (n < this__3841.array.length);
} else
{return and__3546__auto____3842;
}
})()))
{return (this__3841.array[n]);
} else
{return null;
}
});
var G__3858__3860 = (function (coll,n,not_found){
var this__3843 = this;
if(cljs.core.truth_((function (){var and__3546__auto____3844 = (0 <= n);

if(cljs.core.truth_(and__3546__auto____3844))
{return (n < this__3843.array.length);
} else
{return and__3546__auto____3844;
}
})()))
{return (this__3843.array[n]);
} else
{return not_found;
}
});
G__3858 = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return G__3858__3859.call(this,coll,n);
case  3 :
return G__3858__3860.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3858;
})()
;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Vector.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3845 = this;
return cljs.core.with_meta.call(null,cljs.core.Vector.EMPTY,this__3845.meta);
});
cljs.core.Vector;
cljs.core.Vector.EMPTY = (new cljs.core.Vector(null,[]));
cljs.core.Vector.fromArray = (function (xs){
return (new cljs.core.Vector(null,xs));
});
cljs.core.vec = (function vec(coll){
return cljs.core.reduce.call(null,cljs.core.conj,cljs.core.Vector.EMPTY,coll);
});
/**
* @param {...*} var_args
*/
cljs.core.vector = (function() { 
var vector__delegate = function (args){
return cljs.core.vec.call(null,args);
};
var vector = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return vector__delegate.call(this, args);
};
vector.cljs$lang$maxFixedArity = 0;
vector.cljs$lang$applyTo = (function (arglist__3862){
var args = cljs.core.seq( arglist__3862 );;
return vector__delegate.call(this, args);
});
return vector;
})()
;

/**
* @constructor
*/
cljs.core.Subvec = (function (meta,v,start,end){
this.meta = meta;
this.v = v;
this.start = start;
this.end = end;
})
cljs.core.Subvec.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Subvec");
});
cljs.core.Subvec.prototype.cljs$core$IHash$ = true;
cljs.core.Subvec.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3863 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.Subvec.prototype.cljs$core$ILookup$ = true;
cljs.core.Subvec.prototype.cljs$core$ILookup$_lookup = (function() {
var G__3891 = null;
var G__3891__3892 = (function (coll,k){
var this__3864 = this;
return cljs.core._nth.call(null,coll,k,null);
});
var G__3891__3893 = (function (coll,k,not_found){
var this__3865 = this;
return cljs.core._nth.call(null,coll,k,not_found);
});
G__3891 = function(coll,k,not_found){
switch(arguments.length){
case  2 :
return G__3891__3892.call(this,coll,k);
case  3 :
return G__3891__3893.call(this,coll,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3891;
})()
;
cljs.core.Subvec.prototype.cljs$core$IAssociative$ = true;
cljs.core.Subvec.prototype.cljs$core$IAssociative$_assoc = (function (coll,key,val){
var this__3866 = this;
var v_pos__3867 = (this__3866.start + key);

return (new cljs.core.Subvec(this__3866.meta,cljs.core._assoc.call(null,this__3866.v,v_pos__3867,val),this__3866.start,((this__3866.end > (v_pos__3867 + 1)) ? this__3866.end : (v_pos__3867 + 1))));
});
cljs.core.Subvec.prototype.cljs$core$IFn$ = true;
cljs.core.Subvec.prototype.call = (function() {
var G__3895 = null;
var G__3895__3896 = (function (tsym3868,k){
var this__3870 = this;
var tsym3868__3871 = this;

var coll__3872 = tsym3868__3871;

return cljs.core._lookup.call(null,coll__3872,k);
});
var G__3895__3897 = (function (tsym3869,k,not_found){
var this__3873 = this;
var tsym3869__3874 = this;

var coll__3875 = tsym3869__3874;

return cljs.core._lookup.call(null,coll__3875,k,not_found);
});
G__3895 = function(tsym3869,k,not_found){
switch(arguments.length){
case  2 :
return G__3895__3896.call(this,tsym3869,k);
case  3 :
return G__3895__3897.call(this,tsym3869,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3895;
})()
;
cljs.core.Subvec.prototype.cljs$core$ISequential$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$ = true;
cljs.core.Subvec.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3876 = this;
return (new cljs.core.Subvec(this__3876.meta,cljs.core._assoc_n.call(null,this__3876.v,this__3876.end,o),this__3876.start,(this__3876.end + 1)));
});
cljs.core.Subvec.prototype.cljs$core$IReduce$ = true;
cljs.core.Subvec.prototype.cljs$core$IReduce$_reduce = (function() {
var G__3899 = null;
var G__3899__3900 = (function (coll,f){
var this__3877 = this;
return cljs.core.ci_reduce.call(null,coll,f);
});
var G__3899__3901 = (function (coll,f,start){
var this__3878 = this;
return cljs.core.ci_reduce.call(null,coll,f,start);
});
G__3899 = function(coll,f,start){
switch(arguments.length){
case  2 :
return G__3899__3900.call(this,coll,f);
case  3 :
return G__3899__3901.call(this,coll,f,start);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3899;
})()
;
cljs.core.Subvec.prototype.cljs$core$ISeqable$ = true;
cljs.core.Subvec.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3879 = this;
var subvec_seq__3880 = (function subvec_seq(i){
if(cljs.core.truth_(cljs.core._EQ_.call(null,i,this__3879.end)))
{return null;
} else
{return cljs.core.cons.call(null,cljs.core._nth.call(null,this__3879.v,i),(new cljs.core.LazySeq(null,false,(function (){
return subvec_seq.call(null,(i + 1));
}))));
}
});

return subvec_seq__3880.call(null,this__3879.start);
});
cljs.core.Subvec.prototype.cljs$core$ICounted$ = true;
cljs.core.Subvec.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3881 = this;
return (this__3881.end - this__3881.start);
});
cljs.core.Subvec.prototype.cljs$core$IStack$ = true;
cljs.core.Subvec.prototype.cljs$core$IStack$_peek = (function (coll){
var this__3882 = this;
return cljs.core._nth.call(null,this__3882.v,(this__3882.end - 1));
});
cljs.core.Subvec.prototype.cljs$core$IStack$_pop = (function (coll){
var this__3883 = this;
if(cljs.core.truth_(cljs.core._EQ_.call(null,this__3883.start,this__3883.end)))
{throw (new Error("Can't pop empty vector"));
} else
{return (new cljs.core.Subvec(this__3883.meta,this__3883.v,this__3883.start,(this__3883.end - 1)));
}
});
cljs.core.Subvec.prototype.cljs$core$IVector$ = true;
cljs.core.Subvec.prototype.cljs$core$IVector$_assoc_n = (function (coll,n,val){
var this__3884 = this;
return cljs.core._assoc.call(null,coll,n,val);
});
cljs.core.Subvec.prototype.cljs$core$IEquiv$ = true;
cljs.core.Subvec.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3885 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.Subvec.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3886 = this;
return (new cljs.core.Subvec(meta,this__3886.v,this__3886.start,this__3886.end));
});
cljs.core.Subvec.prototype.cljs$core$IMeta$ = true;
cljs.core.Subvec.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3887 = this;
return this__3887.meta;
});
cljs.core.Subvec.prototype.cljs$core$IIndexed$ = true;
cljs.core.Subvec.prototype.cljs$core$IIndexed$_nth = (function() {
var G__3903 = null;
var G__3903__3904 = (function (coll,n){
var this__3888 = this;
return cljs.core._nth.call(null,this__3888.v,(this__3888.start + n));
});
var G__3903__3905 = (function (coll,n,not_found){
var this__3889 = this;
return cljs.core._nth.call(null,this__3889.v,(this__3889.start + n),not_found);
});
G__3903 = function(coll,n,not_found){
switch(arguments.length){
case  2 :
return G__3903__3904.call(this,coll,n);
case  3 :
return G__3903__3905.call(this,coll,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3903;
})()
;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Subvec.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3890 = this;
return cljs.core.with_meta.call(null,cljs.core.Vector.EMPTY,this__3890.meta);
});
cljs.core.Subvec;
/**
* Returns a persistent vector of the items in vector from
* start (inclusive) to end (exclusive).  If end is not supplied,
* defaults to (count vector). This operation is O(1) and very fast, as
* the resulting vector shares structure with the original and no
* trimming is done.
*/
cljs.core.subvec = (function() {
var subvec = null;
var subvec__3907 = (function (v,start){
return subvec.call(null,v,start,cljs.core.count.call(null,v));
});
var subvec__3908 = (function (v,start,end){
return (new cljs.core.Subvec(null,v,start,end));
});
subvec = function(v,start,end){
switch(arguments.length){
case  2 :
return subvec__3907.call(this,v,start);
case  3 :
return subvec__3908.call(this,v,start,end);
}
throw('Invalid arity: ' + arguments.length);
};
return subvec;
})()
;

/**
* @constructor
*/
cljs.core.PersistentQueueSeq = (function (meta,front,rear){
this.meta = meta;
this.front = front;
this.rear = rear;
})
cljs.core.PersistentQueueSeq.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentQueueSeq");
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3910 = this;
return coll;
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3911 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3912 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3913 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__3913.meta);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3914 = this;
return cljs.core.cons.call(null,o,coll);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3915 = this;
return cljs.core._first.call(null,this__3915.front);
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3916 = this;
var temp__3695__auto____3917 = cljs.core.next.call(null,this__3916.front);

if(cljs.core.truth_(temp__3695__auto____3917))
{var f1__3918 = temp__3695__auto____3917;

return (new cljs.core.PersistentQueueSeq(this__3916.meta,f1__3918,this__3916.rear));
} else
{if(cljs.core.truth_((this__3916.rear === null)))
{return cljs.core._empty.call(null,coll);
} else
{return (new cljs.core.PersistentQueueSeq(this__3916.meta,this__3916.rear,null));
}
}
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3919 = this;
return this__3919.meta;
});
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3920 = this;
return (new cljs.core.PersistentQueueSeq(meta,this__3920.front,this__3920.rear));
});
cljs.core.PersistentQueueSeq;

/**
* @constructor
*/
cljs.core.PersistentQueue = (function (meta,count,front,rear){
this.meta = meta;
this.count = count;
this.front = front;
this.rear = rear;
})
cljs.core.PersistentQueue.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.PersistentQueue");
});
cljs.core.PersistentQueue.prototype.cljs$core$IHash$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3921 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.PersistentQueue.prototype.cljs$core$ISequential$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__3922 = this;
if(cljs.core.truth_(this__3922.front))
{return (new cljs.core.PersistentQueue(this__3922.meta,(this__3922.count + 1),this__3922.front,cljs.core.conj.call(null,(function (){var or__3548__auto____3923 = this__3922.rear;

if(cljs.core.truth_(or__3548__auto____3923))
{return or__3548__auto____3923;
} else
{return cljs.core.Vector.fromArray([]);
}
})(),o)));
} else
{return (new cljs.core.PersistentQueue(this__3922.meta,(this__3922.count + 1),cljs.core.conj.call(null,this__3922.front,o),cljs.core.Vector.fromArray([])));
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3924 = this;
var rear__3925 = cljs.core.seq.call(null,this__3924.rear);

if(cljs.core.truth_((function (){var or__3548__auto____3926 = this__3924.front;

if(cljs.core.truth_(or__3548__auto____3926))
{return or__3548__auto____3926;
} else
{return rear__3925;
}
})()))
{return (new cljs.core.PersistentQueueSeq(null,this__3924.front,cljs.core.seq.call(null,rear__3925)));
} else
{return cljs.core.List.EMPTY;
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3927 = this;
return this__3927.count;
});
cljs.core.PersistentQueue.prototype.cljs$core$IStack$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_peek = (function (coll){
var this__3928 = this;
return cljs.core._first.call(null,this__3928.front);
});
cljs.core.PersistentQueue.prototype.cljs$core$IStack$_pop = (function (coll){
var this__3929 = this;
if(cljs.core.truth_(this__3929.front))
{var temp__3695__auto____3930 = cljs.core.next.call(null,this__3929.front);

if(cljs.core.truth_(temp__3695__auto____3930))
{var f1__3931 = temp__3695__auto____3930;

return (new cljs.core.PersistentQueue(this__3929.meta,(this__3929.count - 1),f1__3931,this__3929.rear));
} else
{return (new cljs.core.PersistentQueue(this__3929.meta,(this__3929.count - 1),cljs.core.seq.call(null,this__3929.rear),cljs.core.Vector.fromArray([])));
}
} else
{return coll;
}
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_first = (function (coll){
var this__3932 = this;
return cljs.core.first.call(null,this__3932.front);
});
cljs.core.PersistentQueue.prototype.cljs$core$ISeq$_rest = (function (coll){
var this__3933 = this;
return cljs.core.rest.call(null,cljs.core.seq.call(null,coll));
});
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3934 = this;
return cljs.core.equiv_sequential.call(null,coll,other);
});
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3935 = this;
return (new cljs.core.PersistentQueue(meta,this__3935.count,this__3935.front,this__3935.rear));
});
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3936 = this;
return this__3936.meta;
});
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.PersistentQueue.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3937 = this;
return cljs.core.PersistentQueue.EMPTY;
});
cljs.core.PersistentQueue;
cljs.core.PersistentQueue.EMPTY = (new cljs.core.PersistentQueue(null,0,null,cljs.core.Vector.fromArray([])));

/**
* @constructor
*/
cljs.core.NeverEquiv = (function (){
})
cljs.core.NeverEquiv.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.NeverEquiv");
});
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$ = true;
cljs.core.NeverEquiv.prototype.cljs$core$IEquiv$_equiv = (function (o,other){
var this__3938 = this;
return false;
});
cljs.core.NeverEquiv;
cljs.core.never_equiv = (new cljs.core.NeverEquiv());
/**
* Assumes y is a map. Returns true if x equals y, otherwise returns
* false.
*/
cljs.core.equiv_map = (function equiv_map(x,y){
return cljs.core.boolean$.call(null,(cljs.core.truth_(cljs.core.map_QMARK_.call(null,y))?(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.count.call(null,x),cljs.core.count.call(null,y)))?cljs.core.every_QMARK_.call(null,cljs.core.identity,cljs.core.map.call(null,(function (xkv){
return cljs.core._EQ_.call(null,cljs.core.get.call(null,y,cljs.core.first.call(null,xkv),cljs.core.never_equiv),cljs.core.second.call(null,xkv));
}),x)):null):null));
});
cljs.core.scan_array = (function scan_array(incr,k,array){
var len__3939 = array.length;

var i__3940 = 0;

while(true){
if(cljs.core.truth_((i__3940 < len__3939)))
{if(cljs.core.truth_(cljs.core._EQ_.call(null,k,(array[i__3940]))))
{return i__3940;
} else
{{
var G__3941 = (i__3940 + incr);
i__3940 = G__3941;
continue;
}
}
} else
{return null;
}
break;
}
});
cljs.core.obj_map_contains_key_QMARK_ = (function() {
var obj_map_contains_key_QMARK_ = null;
var obj_map_contains_key_QMARK___3943 = (function (k,strobj){
return obj_map_contains_key_QMARK_.call(null,k,strobj,true,false);
});
var obj_map_contains_key_QMARK___3944 = (function (k,strobj,true_val,false_val){
if(cljs.core.truth_((function (){var and__3546__auto____3942 = goog.isString.call(null,k);

if(cljs.core.truth_(and__3546__auto____3942))
{return strobj.hasOwnProperty(k);
} else
{return and__3546__auto____3942;
}
})()))
{return true_val;
} else
{return false_val;
}
});
obj_map_contains_key_QMARK_ = function(k,strobj,true_val,false_val){
switch(arguments.length){
case  2 :
return obj_map_contains_key_QMARK___3943.call(this,k,strobj);
case  4 :
return obj_map_contains_key_QMARK___3944.call(this,k,strobj,true_val,false_val);
}
throw('Invalid arity: ' + arguments.length);
};
return obj_map_contains_key_QMARK_;
})()
;
cljs.core.obj_map_compare_keys = (function obj_map_compare_keys(a,b){
var a__3947 = cljs.core.hash.call(null,a);
var b__3948 = cljs.core.hash.call(null,b);

if(cljs.core.truth_((a__3947 < b__3948)))
{return -1;
} else
{if(cljs.core.truth_((a__3947 > b__3948)))
{return 1;
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return 0;
} else
{return null;
}
}
}
});

/**
* @constructor
*/
cljs.core.ObjMap = (function (meta,keys,strobj){
this.meta = meta;
this.keys = keys;
this.strobj = strobj;
})
cljs.core.ObjMap.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.ObjMap");
});
cljs.core.ObjMap.prototype.cljs$core$IHash$ = true;
cljs.core.ObjMap.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3949 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.ObjMap.prototype.cljs$core$ILookup$ = true;
cljs.core.ObjMap.prototype.cljs$core$ILookup$_lookup = (function() {
var G__3976 = null;
var G__3976__3977 = (function (coll,k){
var this__3950 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
var G__3976__3978 = (function (coll,k,not_found){
var this__3951 = this;
return cljs.core.obj_map_contains_key_QMARK_.call(null,k,this__3951.strobj,(this__3951.strobj[k]),not_found);
});
G__3976 = function(coll,k,not_found){
switch(arguments.length){
case  2 :
return G__3976__3977.call(this,coll,k);
case  3 :
return G__3976__3978.call(this,coll,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3976;
})()
;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_assoc = (function (coll,k,v){
var this__3952 = this;
if(cljs.core.truth_(goog.isString.call(null,k)))
{var new_strobj__3953 = goog.object.clone.call(null,this__3952.strobj);
var overwrite_QMARK___3954 = new_strobj__3953.hasOwnProperty(k);

(new_strobj__3953[k] = v);
if(cljs.core.truth_(overwrite_QMARK___3954))
{return (new cljs.core.ObjMap(this__3952.meta,this__3952.keys,new_strobj__3953));
} else
{var new_keys__3955 = cljs.core.aclone.call(null,this__3952.keys);

new_keys__3955.push(k);
return (new cljs.core.ObjMap(this__3952.meta,new_keys__3955,new_strobj__3953));
}
} else
{return cljs.core.with_meta.call(null,cljs.core.into.call(null,cljs.core.hash_map.call(null,k,v),cljs.core.seq.call(null,coll)),this__3952.meta);
}
});
cljs.core.ObjMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = (function (coll,k){
var this__3956 = this;
return cljs.core.obj_map_contains_key_QMARK_.call(null,k,this__3956.strobj);
});
cljs.core.ObjMap.prototype.cljs$core$IFn$ = true;
cljs.core.ObjMap.prototype.call = (function() {
var G__3980 = null;
var G__3980__3981 = (function (tsym3957,k){
var this__3959 = this;
var tsym3957__3960 = this;

var coll__3961 = tsym3957__3960;

return cljs.core._lookup.call(null,coll__3961,k);
});
var G__3980__3982 = (function (tsym3958,k,not_found){
var this__3962 = this;
var tsym3958__3963 = this;

var coll__3964 = tsym3958__3963;

return cljs.core._lookup.call(null,coll__3964,k,not_found);
});
G__3980 = function(tsym3958,k,not_found){
switch(arguments.length){
case  2 :
return G__3980__3981.call(this,tsym3958,k);
case  3 :
return G__3980__3982.call(this,tsym3958,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__3980;
})()
;
cljs.core.ObjMap.prototype.cljs$core$ICollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICollection$_conj = (function (coll,entry){
var this__3965 = this;
if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null,entry)))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.ObjMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.ObjMap.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__3966 = this;
if(cljs.core.truth_((this__3966.keys.length > 0)))
{return cljs.core.map.call(null,(function (p1__3946_SHARP_){
return cljs.core.vector.call(null,p1__3946_SHARP_,(this__3966.strobj[p1__3946_SHARP_]));
}),this__3966.keys.sort(cljs.core.obj_map_compare_keys));
} else
{return null;
}
});
cljs.core.ObjMap.prototype.cljs$core$ICounted$ = true;
cljs.core.ObjMap.prototype.cljs$core$ICounted$_count = (function (coll){
var this__3967 = this;
return this__3967.keys.length;
});
cljs.core.ObjMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__3968 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__3969 = this;
return (new cljs.core.ObjMap(meta,this__3969.keys,this__3969.strobj));
});
cljs.core.ObjMap.prototype.cljs$core$IMeta$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__3970 = this;
return this__3970.meta;
});
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.ObjMap.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__3971 = this;
return cljs.core.with_meta.call(null,cljs.core.ObjMap.EMPTY,this__3971.meta);
});
cljs.core.ObjMap.prototype.cljs$core$IMap$ = true;
cljs.core.ObjMap.prototype.cljs$core$IMap$_dissoc = (function (coll,k){
var this__3972 = this;
if(cljs.core.truth_((function (){var and__3546__auto____3973 = goog.isString.call(null,k);

if(cljs.core.truth_(and__3546__auto____3973))
{return this__3972.strobj.hasOwnProperty(k);
} else
{return and__3546__auto____3973;
}
})()))
{var new_keys__3974 = cljs.core.aclone.call(null,this__3972.keys);
var new_strobj__3975 = goog.object.clone.call(null,this__3972.strobj);

new_keys__3974.splice(cljs.core.scan_array.call(null,1,k,new_keys__3974),1);
cljs.core.js_delete.call(null,new_strobj__3975,k);
return (new cljs.core.ObjMap(this__3972.meta,new_keys__3974,new_strobj__3975));
} else
{return coll;
}
});
cljs.core.ObjMap;
cljs.core.ObjMap.EMPTY = (new cljs.core.ObjMap(null,[],cljs.core.js_obj.call(null)));
cljs.core.ObjMap.fromObject = (function (ks,obj){
return (new cljs.core.ObjMap(null,ks,obj));
});

/**
* @constructor
*/
cljs.core.HashMap = (function (meta,count,hashobj){
this.meta = meta;
this.count = count;
this.hashobj = hashobj;
})
cljs.core.HashMap.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.HashMap");
});
cljs.core.HashMap.prototype.cljs$core$IHash$ = true;
cljs.core.HashMap.prototype.cljs$core$IHash$_hash = (function (coll){
var this__3985 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.HashMap.prototype.cljs$core$ILookup$ = true;
cljs.core.HashMap.prototype.cljs$core$ILookup$_lookup = (function() {
var G__4023 = null;
var G__4023__4024 = (function (coll,k){
var this__3986 = this;
return cljs.core._lookup.call(null,coll,k,null);
});
var G__4023__4025 = (function (coll,k,not_found){
var this__3987 = this;
var bucket__3988 = (this__3987.hashobj[cljs.core.hash.call(null,k)]);
var i__3989 = (cljs.core.truth_(bucket__3988)?cljs.core.scan_array.call(null,2,k,bucket__3988):null);

if(cljs.core.truth_(i__3989))
{return (bucket__3988[(i__3989 + 1)]);
} else
{return not_found;
}
});
G__4023 = function(coll,k,not_found){
switch(arguments.length){
case  2 :
return G__4023__4024.call(this,coll,k);
case  3 :
return G__4023__4025.call(this,coll,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4023;
})()
;
cljs.core.HashMap.prototype.cljs$core$IAssociative$ = true;
cljs.core.HashMap.prototype.cljs$core$IAssociative$_assoc = (function (coll,k,v){
var this__3990 = this;
var h__3991 = cljs.core.hash.call(null,k);
var bucket__3992 = (this__3990.hashobj[h__3991]);

if(cljs.core.truth_(bucket__3992))
{var new_bucket__3993 = cljs.core.aclone.call(null,bucket__3992);
var new_hashobj__3994 = goog.object.clone.call(null,this__3990.hashobj);

(new_hashobj__3994[h__3991] = new_bucket__3993);
var temp__3695__auto____3995 = cljs.core.scan_array.call(null,2,k,new_bucket__3993);

if(cljs.core.truth_(temp__3695__auto____3995))
{var i__3996 = temp__3695__auto____3995;

(new_bucket__3993[(i__3996 + 1)] = v);
return (new cljs.core.HashMap(this__3990.meta,this__3990.count,new_hashobj__3994));
} else
{new_bucket__3993.push(k,v);
return (new cljs.core.HashMap(this__3990.meta,(this__3990.count + 1),new_hashobj__3994));
}
} else
{var new_hashobj__3997 = goog.object.clone.call(null,this__3990.hashobj);

(new_hashobj__3997[h__3991] = [k,v]);
return (new cljs.core.HashMap(this__3990.meta,(this__3990.count + 1),new_hashobj__3997));
}
});
cljs.core.HashMap.prototype.cljs$core$IAssociative$_contains_key_QMARK_ = (function (coll,k){
var this__3998 = this;
var bucket__3999 = (this__3998.hashobj[cljs.core.hash.call(null,k)]);
var i__4000 = (cljs.core.truth_(bucket__3999)?cljs.core.scan_array.call(null,2,k,bucket__3999):null);

if(cljs.core.truth_(i__4000))
{return true;
} else
{return false;
}
});
cljs.core.HashMap.prototype.cljs$core$IFn$ = true;
cljs.core.HashMap.prototype.call = (function() {
var G__4027 = null;
var G__4027__4028 = (function (tsym4001,k){
var this__4003 = this;
var tsym4001__4004 = this;

var coll__4005 = tsym4001__4004;

return cljs.core._lookup.call(null,coll__4005,k);
});
var G__4027__4029 = (function (tsym4002,k,not_found){
var this__4006 = this;
var tsym4002__4007 = this;

var coll__4008 = tsym4002__4007;

return cljs.core._lookup.call(null,coll__4008,k,not_found);
});
G__4027 = function(tsym4002,k,not_found){
switch(arguments.length){
case  2 :
return G__4027__4028.call(this,tsym4002,k);
case  3 :
return G__4027__4029.call(this,tsym4002,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4027;
})()
;
cljs.core.HashMap.prototype.cljs$core$ICollection$ = true;
cljs.core.HashMap.prototype.cljs$core$ICollection$_conj = (function (coll,entry){
var this__4009 = this;
if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null,entry)))
{return cljs.core._assoc.call(null,coll,cljs.core._nth.call(null,entry,0),cljs.core._nth.call(null,entry,1));
} else
{return cljs.core.reduce.call(null,cljs.core._conj,coll,entry);
}
});
cljs.core.HashMap.prototype.cljs$core$ISeqable$ = true;
cljs.core.HashMap.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__4010 = this;
if(cljs.core.truth_((this__4010.count > 0)))
{var hashes__4011 = cljs.core.js_keys.call(null,this__4010.hashobj).sort();

return cljs.core.mapcat.call(null,(function (p1__3984_SHARP_){
return cljs.core.map.call(null,cljs.core.vec,cljs.core.partition.call(null,2,(this__4010.hashobj[p1__3984_SHARP_])));
}),hashes__4011);
} else
{return null;
}
});
cljs.core.HashMap.prototype.cljs$core$ICounted$ = true;
cljs.core.HashMap.prototype.cljs$core$ICounted$_count = (function (coll){
var this__4012 = this;
return this__4012.count;
});
cljs.core.HashMap.prototype.cljs$core$IEquiv$ = true;
cljs.core.HashMap.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__4013 = this;
return cljs.core.equiv_map.call(null,coll,other);
});
cljs.core.HashMap.prototype.cljs$core$IWithMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__4014 = this;
return (new cljs.core.HashMap(meta,this__4014.count,this__4014.hashobj));
});
cljs.core.HashMap.prototype.cljs$core$IMeta$ = true;
cljs.core.HashMap.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__4015 = this;
return this__4015.meta;
});
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.HashMap.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__4016 = this;
return cljs.core.with_meta.call(null,cljs.core.HashMap.EMPTY,this__4016.meta);
});
cljs.core.HashMap.prototype.cljs$core$IMap$ = true;
cljs.core.HashMap.prototype.cljs$core$IMap$_dissoc = (function (coll,k){
var this__4017 = this;
var h__4018 = cljs.core.hash.call(null,k);
var bucket__4019 = (this__4017.hashobj[h__4018]);
var i__4020 = (cljs.core.truth_(bucket__4019)?cljs.core.scan_array.call(null,2,k,bucket__4019):null);

if(cljs.core.truth_(cljs.core.not.call(null,i__4020)))
{return coll;
} else
{var new_hashobj__4021 = goog.object.clone.call(null,this__4017.hashobj);

if(cljs.core.truth_((3 > bucket__4019.length)))
{cljs.core.js_delete.call(null,new_hashobj__4021,h__4018);
} else
{var new_bucket__4022 = cljs.core.aclone.call(null,bucket__4019);

new_bucket__4022.splice(i__4020,2);
(new_hashobj__4021[h__4018] = new_bucket__4022);
}
return (new cljs.core.HashMap(this__4017.meta,(this__4017.count - 1),new_hashobj__4021));
}
});
cljs.core.HashMap;
cljs.core.HashMap.EMPTY = (new cljs.core.HashMap(null,0,cljs.core.js_obj.call(null)));
cljs.core.HashMap.fromArrays = (function (ks,vs){
var len__4031 = ks.length;

var i__4032 = 0;
var out__4033 = cljs.core.HashMap.EMPTY;

while(true){
if(cljs.core.truth_((i__4032 < len__4031)))
{{
var G__4034 = (i__4032 + 1);
var G__4035 = cljs.core.assoc.call(null,out__4033,(ks[i__4032]),(vs[i__4032]));
i__4032 = G__4034;
out__4033 = G__4035;
continue;
}
} else
{return out__4033;
}
break;
}
});
/**
* keyval => key val
* Returns a new hash map with supplied mappings.
* @param {...*} var_args
*/
cljs.core.hash_map = (function() { 
var hash_map__delegate = function (keyvals){
var in$__4036 = cljs.core.seq.call(null,keyvals);
var out__4037 = cljs.core.HashMap.EMPTY;

while(true){
if(cljs.core.truth_(in$__4036))
{{
var G__4038 = cljs.core.nnext.call(null,in$__4036);
var G__4039 = cljs.core.assoc.call(null,out__4037,cljs.core.first.call(null,in$__4036),cljs.core.second.call(null,in$__4036));
in$__4036 = G__4038;
out__4037 = G__4039;
continue;
}
} else
{return out__4037;
}
break;
}
};
var hash_map = function (var_args){
var keyvals = null;
if (goog.isDef(var_args)) {
  keyvals = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return hash_map__delegate.call(this, keyvals);
};
hash_map.cljs$lang$maxFixedArity = 0;
hash_map.cljs$lang$applyTo = (function (arglist__4040){
var keyvals = cljs.core.seq( arglist__4040 );;
return hash_map__delegate.call(this, keyvals);
});
return hash_map;
})()
;
/**
* Returns a sequence of the map's keys.
*/
cljs.core.keys = (function keys(hash_map){
return cljs.core.seq.call(null,cljs.core.map.call(null,cljs.core.first,hash_map));
});
/**
* Returns a sequence of the map's values.
*/
cljs.core.vals = (function vals(hash_map){
return cljs.core.seq.call(null,cljs.core.map.call(null,cljs.core.second,hash_map));
});
/**
* Returns a map that consists of the rest of the maps conj-ed onto
* the first.  If a key occurs in more than one map, the mapping from
* the latter (left-to-right) will be the mapping in the result.
* @param {...*} var_args
*/
cljs.core.merge = (function() { 
var merge__delegate = function (maps){
if(cljs.core.truth_(cljs.core.some.call(null,cljs.core.identity,maps)))
{return cljs.core.reduce.call(null,(function (p1__4041_SHARP_,p2__4042_SHARP_){
return cljs.core.conj.call(null,(function (){var or__3548__auto____4043 = p1__4041_SHARP_;

if(cljs.core.truth_(or__3548__auto____4043))
{return or__3548__auto____4043;
} else
{return cljs.core.ObjMap.fromObject([],{});
}
})(),p2__4042_SHARP_);
}),maps);
} else
{return null;
}
};
var merge = function (var_args){
var maps = null;
if (goog.isDef(var_args)) {
  maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return merge__delegate.call(this, maps);
};
merge.cljs$lang$maxFixedArity = 0;
merge.cljs$lang$applyTo = (function (arglist__4044){
var maps = cljs.core.seq( arglist__4044 );;
return merge__delegate.call(this, maps);
});
return merge;
})()
;
/**
* Returns a map that consists of the rest of the maps conj-ed onto
* the first.  If a key occurs in more than one map, the mapping(s)
* from the latter (left-to-right) will be combined with the mapping in
* the result by calling (f val-in-result val-in-latter).
* @param {...*} var_args
*/
cljs.core.merge_with = (function() { 
var merge_with__delegate = function (f,maps){
if(cljs.core.truth_(cljs.core.some.call(null,cljs.core.identity,maps)))
{var merge_entry__4047 = (function (m,e){
var k__4045 = cljs.core.first.call(null,e);
var v__4046 = cljs.core.second.call(null,e);

if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,m,k__4045)))
{return cljs.core.assoc.call(null,m,k__4045,f.call(null,cljs.core.get.call(null,m,k__4045),v__4046));
} else
{return cljs.core.assoc.call(null,m,k__4045,v__4046);
}
});
var merge2__4049 = (function (m1,m2){
return cljs.core.reduce.call(null,merge_entry__4047,(function (){var or__3548__auto____4048 = m1;

if(cljs.core.truth_(or__3548__auto____4048))
{return or__3548__auto____4048;
} else
{return cljs.core.ObjMap.fromObject([],{});
}
})(),cljs.core.seq.call(null,m2));
});

return cljs.core.reduce.call(null,merge2__4049,maps);
} else
{return null;
}
};
var merge_with = function (f,var_args){
var maps = null;
if (goog.isDef(var_args)) {
  maps = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return merge_with__delegate.call(this, f, maps);
};
merge_with.cljs$lang$maxFixedArity = 1;
merge_with.cljs$lang$applyTo = (function (arglist__4050){
var f = cljs.core.first(arglist__4050);
var maps = cljs.core.rest(arglist__4050);
return merge_with__delegate.call(this, f, maps);
});
return merge_with;
})()
;
/**
* Returns a map containing only those entries in map whose key is in keys
*/
cljs.core.select_keys = (function select_keys(map,keyseq){
var ret__4052 = cljs.core.ObjMap.fromObject([],{});
var keys__4053 = cljs.core.seq.call(null,keyseq);

while(true){
if(cljs.core.truth_(keys__4053))
{var key__4054 = cljs.core.first.call(null,keys__4053);
var entry__4055 = cljs.core.get.call(null,map,key__4054,"\uFDD0'user/not-found");

{
var G__4056 = (cljs.core.truth_(cljs.core.not_EQ_.call(null,entry__4055,"\uFDD0'user/not-found"))?cljs.core.assoc.call(null,ret__4052,key__4054,entry__4055):ret__4052);
var G__4057 = cljs.core.next.call(null,keys__4053);
ret__4052 = G__4056;
keys__4053 = G__4057;
continue;
}
} else
{return ret__4052;
}
break;
}
});

/**
* @constructor
*/
cljs.core.Set = (function (meta,hash_map){
this.meta = meta;
this.hash_map = hash_map;
})
cljs.core.Set.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Set");
});
cljs.core.Set.prototype.cljs$core$IHash$ = true;
cljs.core.Set.prototype.cljs$core$IHash$_hash = (function (coll){
var this__4058 = this;
return cljs.core.hash_coll.call(null,coll);
});
cljs.core.Set.prototype.cljs$core$ILookup$ = true;
cljs.core.Set.prototype.cljs$core$ILookup$_lookup = (function() {
var G__4079 = null;
var G__4079__4080 = (function (coll,v){
var this__4059 = this;
return cljs.core._lookup.call(null,coll,v,null);
});
var G__4079__4081 = (function (coll,v,not_found){
var this__4060 = this;
if(cljs.core.truth_(cljs.core._contains_key_QMARK_.call(null,this__4060.hash_map,v)))
{return v;
} else
{return not_found;
}
});
G__4079 = function(coll,v,not_found){
switch(arguments.length){
case  2 :
return G__4079__4080.call(this,coll,v);
case  3 :
return G__4079__4081.call(this,coll,v,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4079;
})()
;
cljs.core.Set.prototype.cljs$core$IFn$ = true;
cljs.core.Set.prototype.call = (function() {
var G__4083 = null;
var G__4083__4084 = (function (tsym4061,k){
var this__4063 = this;
var tsym4061__4064 = this;

var coll__4065 = tsym4061__4064;

return cljs.core._lookup.call(null,coll__4065,k);
});
var G__4083__4085 = (function (tsym4062,k,not_found){
var this__4066 = this;
var tsym4062__4067 = this;

var coll__4068 = tsym4062__4067;

return cljs.core._lookup.call(null,coll__4068,k,not_found);
});
G__4083 = function(tsym4062,k,not_found){
switch(arguments.length){
case  2 :
return G__4083__4084.call(this,tsym4062,k);
case  3 :
return G__4083__4085.call(this,tsym4062,k,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4083;
})()
;
cljs.core.Set.prototype.cljs$core$ICollection$ = true;
cljs.core.Set.prototype.cljs$core$ICollection$_conj = (function (coll,o){
var this__4069 = this;
return (new cljs.core.Set(this__4069.meta,cljs.core.assoc.call(null,this__4069.hash_map,o,null)));
});
cljs.core.Set.prototype.cljs$core$ISeqable$ = true;
cljs.core.Set.prototype.cljs$core$ISeqable$_seq = (function (coll){
var this__4070 = this;
return cljs.core.keys.call(null,this__4070.hash_map);
});
cljs.core.Set.prototype.cljs$core$ISet$ = true;
cljs.core.Set.prototype.cljs$core$ISet$_disjoin = (function (coll,v){
var this__4071 = this;
return (new cljs.core.Set(this__4071.meta,cljs.core.dissoc.call(null,this__4071.hash_map,v)));
});
cljs.core.Set.prototype.cljs$core$ICounted$ = true;
cljs.core.Set.prototype.cljs$core$ICounted$_count = (function (coll){
var this__4072 = this;
return cljs.core.count.call(null,cljs.core.seq.call(null,coll));
});
cljs.core.Set.prototype.cljs$core$IEquiv$ = true;
cljs.core.Set.prototype.cljs$core$IEquiv$_equiv = (function (coll,other){
var this__4073 = this;
var and__3546__auto____4074 = cljs.core.set_QMARK_.call(null,other);

if(cljs.core.truth_(and__3546__auto____4074))
{var and__3546__auto____4075 = cljs.core._EQ_.call(null,cljs.core.count.call(null,coll),cljs.core.count.call(null,other));

if(cljs.core.truth_(and__3546__auto____4075))
{return cljs.core.every_QMARK_.call(null,(function (p1__4051_SHARP_){
return cljs.core.contains_QMARK_.call(null,coll,p1__4051_SHARP_);
}),other);
} else
{return and__3546__auto____4075;
}
} else
{return and__3546__auto____4074;
}
});
cljs.core.Set.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Set.prototype.cljs$core$IWithMeta$_with_meta = (function (coll,meta){
var this__4076 = this;
return (new cljs.core.Set(meta,this__4076.hash_map));
});
cljs.core.Set.prototype.cljs$core$IMeta$ = true;
cljs.core.Set.prototype.cljs$core$IMeta$_meta = (function (coll){
var this__4077 = this;
return this__4077.meta;
});
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Set.prototype.cljs$core$IEmptyableCollection$_empty = (function (coll){
var this__4078 = this;
return cljs.core.with_meta.call(null,cljs.core.Set.EMPTY,this__4078.meta);
});
cljs.core.Set;
cljs.core.Set.EMPTY = (new cljs.core.Set(null,cljs.core.hash_map.call(null)));
/**
* Returns a set of the distinct elements of coll.
*/
cljs.core.set = (function set(coll){
var in$__4088 = cljs.core.seq.call(null,coll);
var out__4089 = cljs.core.Set.EMPTY;

while(true){
if(cljs.core.truth_(cljs.core.not.call(null,cljs.core.empty_QMARK_.call(null,in$__4088))))
{{
var G__4090 = cljs.core.rest.call(null,in$__4088);
var G__4091 = cljs.core.conj.call(null,out__4089,cljs.core.first.call(null,in$__4088));
in$__4088 = G__4090;
out__4089 = G__4091;
continue;
}
} else
{return out__4089;
}
break;
}
});
/**
* Given a map of replacement pairs and a vector/collection, returns a
* vector/seq with any elements = a key in smap replaced with the
* corresponding val in smap
*/
cljs.core.replace = (function replace(smap,coll){
if(cljs.core.truth_(cljs.core.vector_QMARK_.call(null,coll)))
{var n__4092 = cljs.core.count.call(null,coll);

return cljs.core.reduce.call(null,(function (v,i){
var temp__3695__auto____4093 = cljs.core.find.call(null,smap,cljs.core.nth.call(null,v,i));

if(cljs.core.truth_(temp__3695__auto____4093))
{var e__4094 = temp__3695__auto____4093;

return cljs.core.assoc.call(null,v,i,cljs.core.second.call(null,e__4094));
} else
{return v;
}
}),coll,cljs.core.take.call(null,n__4092,cljs.core.iterate.call(null,cljs.core.inc,0)));
} else
{return cljs.core.map.call(null,(function (p1__4087_SHARP_){
var temp__3695__auto____4095 = cljs.core.find.call(null,smap,p1__4087_SHARP_);

if(cljs.core.truth_(temp__3695__auto____4095))
{var e__4096 = temp__3695__auto____4095;

return cljs.core.second.call(null,e__4096);
} else
{return p1__4087_SHARP_;
}
}),coll);
}
});
/**
* Returns a lazy sequence of the elements of coll with duplicates removed
*/
cljs.core.distinct = (function distinct(coll){
var step__4104 = (function step(xs,seen){
return (new cljs.core.LazySeq(null,false,(function (){
return (function (p__4097,seen){
while(true){
var vec__4098__4099 = p__4097;
var f__4100 = cljs.core.nth.call(null,vec__4098__4099,0,null);
var xs__4101 = vec__4098__4099;

var temp__3698__auto____4102 = cljs.core.seq.call(null,xs__4101);

if(cljs.core.truth_(temp__3698__auto____4102))
{var s__4103 = temp__3698__auto____4102;

if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,seen,f__4100)))
{{
var G__4105 = cljs.core.rest.call(null,s__4103);
var G__4106 = seen;
p__4097 = G__4105;
seen = G__4106;
continue;
}
} else
{return cljs.core.cons.call(null,f__4100,step.call(null,cljs.core.rest.call(null,s__4103),cljs.core.conj.call(null,seen,f__4100)));
}
} else
{return null;
}
break;
}
}).call(null,xs,seen);
})));
});

return step__4104.call(null,coll,cljs.core.set([]));
});
cljs.core.butlast = (function butlast(s){
var ret__4107 = cljs.core.Vector.fromArray([]);
var s__4108 = s;

while(true){
if(cljs.core.truth_(cljs.core.next.call(null,s__4108)))
{{
var G__4109 = cljs.core.conj.call(null,ret__4107,cljs.core.first.call(null,s__4108));
var G__4110 = cljs.core.next.call(null,s__4108);
ret__4107 = G__4109;
s__4108 = G__4110;
continue;
}
} else
{return cljs.core.seq.call(null,ret__4107);
}
break;
}
});
/**
* Returns the name String of a string, symbol or keyword.
*/
cljs.core.name = (function name(x){
if(cljs.core.truth_(cljs.core.string_QMARK_.call(null,x)))
{return x;
} else
{if(cljs.core.truth_((function (){var or__3548__auto____4111 = cljs.core.keyword_QMARK_.call(null,x);

if(cljs.core.truth_(or__3548__auto____4111))
{return or__3548__auto____4111;
} else
{return cljs.core.symbol_QMARK_.call(null,x);
}
})()))
{var i__4112 = x.lastIndexOf("\/");

if(cljs.core.truth_((i__4112 < 0)))
{return cljs.core.subs.call(null,x,2);
} else
{return cljs.core.subs.call(null,x,(i__4112 + 1));
}
} else
{if(cljs.core.truth_("\uFDD0'else"))
{throw (new Error(cljs.core.str.call(null,"Doesn't support name: ",x)));
} else
{return null;
}
}
}
});
/**
* Returns the namespace String of a symbol or keyword, or nil if not present.
*/
cljs.core.namespace = (function namespace(x){
if(cljs.core.truth_((function (){var or__3548__auto____4113 = cljs.core.keyword_QMARK_.call(null,x);

if(cljs.core.truth_(or__3548__auto____4113))
{return or__3548__auto____4113;
} else
{return cljs.core.symbol_QMARK_.call(null,x);
}
})()))
{var i__4114 = x.lastIndexOf("\/");

if(cljs.core.truth_((i__4114 > -1)))
{return cljs.core.subs.call(null,x,2,i__4114);
} else
{return null;
}
} else
{throw (new Error(cljs.core.str.call(null,"Doesn't support namespace: ",x)));
}
});
/**
* Returns a map with the keys mapped to the corresponding vals.
*/
cljs.core.zipmap = (function zipmap(keys,vals){
var map__4117 = cljs.core.ObjMap.fromObject([],{});
var ks__4118 = cljs.core.seq.call(null,keys);
var vs__4119 = cljs.core.seq.call(null,vals);

while(true){
if(cljs.core.truth_((function (){var and__3546__auto____4120 = ks__4118;

if(cljs.core.truth_(and__3546__auto____4120))
{return vs__4119;
} else
{return and__3546__auto____4120;
}
})()))
{{
var G__4121 = cljs.core.assoc.call(null,map__4117,cljs.core.first.call(null,ks__4118),cljs.core.first.call(null,vs__4119));
var G__4122 = cljs.core.next.call(null,ks__4118);
var G__4123 = cljs.core.next.call(null,vs__4119);
map__4117 = G__4121;
ks__4118 = G__4122;
vs__4119 = G__4123;
continue;
}
} else
{return map__4117;
}
break;
}
});
/**
* Returns the x for which (k x), a number, is greatest.
* @param {...*} var_args
*/
cljs.core.max_key = (function() {
var max_key = null;
var max_key__4126 = (function (k,x){
return x;
});
var max_key__4127 = (function (k,x,y){
if(cljs.core.truth_((k.call(null,x) > k.call(null,y))))
{return x;
} else
{return y;
}
});
var max_key__4128 = (function() { 
var G__4130__delegate = function (k,x,y,more){
return cljs.core.reduce.call(null,(function (p1__4115_SHARP_,p2__4116_SHARP_){
return max_key.call(null,k,p1__4115_SHARP_,p2__4116_SHARP_);
}),max_key.call(null,k,x,y),more);
};
var G__4130 = function (k,x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4130__delegate.call(this, k, x, y, more);
};
G__4130.cljs$lang$maxFixedArity = 3;
G__4130.cljs$lang$applyTo = (function (arglist__4131){
var k = cljs.core.first(arglist__4131);
var x = cljs.core.first(cljs.core.next(arglist__4131));
var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4131)));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4131)));
return G__4130__delegate.call(this, k, x, y, more);
});
return G__4130;
})()
;
max_key = function(k,x,y,var_args){
var more = var_args;
switch(arguments.length){
case  2 :
return max_key__4126.call(this,k,x);
case  3 :
return max_key__4127.call(this,k,x,y);
default:
return max_key__4128.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
max_key.cljs$lang$maxFixedArity = 3;
max_key.cljs$lang$applyTo = max_key__4128.cljs$lang$applyTo;
return max_key;
})()
;
/**
* Returns the x for which (k x), a number, is least.
* @param {...*} var_args
*/
cljs.core.min_key = (function() {
var min_key = null;
var min_key__4132 = (function (k,x){
return x;
});
var min_key__4133 = (function (k,x,y){
if(cljs.core.truth_((k.call(null,x) < k.call(null,y))))
{return x;
} else
{return y;
}
});
var min_key__4134 = (function() { 
var G__4136__delegate = function (k,x,y,more){
return cljs.core.reduce.call(null,(function (p1__4124_SHARP_,p2__4125_SHARP_){
return min_key.call(null,k,p1__4124_SHARP_,p2__4125_SHARP_);
}),min_key.call(null,k,x,y),more);
};
var G__4136 = function (k,x,y,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4136__delegate.call(this, k, x, y, more);
};
G__4136.cljs$lang$maxFixedArity = 3;
G__4136.cljs$lang$applyTo = (function (arglist__4137){
var k = cljs.core.first(arglist__4137);
var x = cljs.core.first(cljs.core.next(arglist__4137));
var y = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4137)));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4137)));
return G__4136__delegate.call(this, k, x, y, more);
});
return G__4136;
})()
;
min_key = function(k,x,y,var_args){
var more = var_args;
switch(arguments.length){
case  2 :
return min_key__4132.call(this,k,x);
case  3 :
return min_key__4133.call(this,k,x,y);
default:
return min_key__4134.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
min_key.cljs$lang$maxFixedArity = 3;
min_key.cljs$lang$applyTo = min_key__4134.cljs$lang$applyTo;
return min_key;
})()
;
/**
* Returns a lazy sequence of lists like partition, but may include
* partitions with fewer than n items at the end.
*/
cljs.core.partition_all = (function() {
var partition_all = null;
var partition_all__4140 = (function (n,coll){
return partition_all.call(null,n,n,coll);
});
var partition_all__4141 = (function (n,step,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____4138 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____4138))
{var s__4139 = temp__3698__auto____4138;

return cljs.core.cons.call(null,cljs.core.take.call(null,n,s__4139),partition_all.call(null,n,step,cljs.core.drop.call(null,step,s__4139)));
} else
{return null;
}
})));
});
partition_all = function(n,step,coll){
switch(arguments.length){
case  2 :
return partition_all__4140.call(this,n,step);
case  3 :
return partition_all__4141.call(this,n,step,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return partition_all;
})()
;
/**
* Returns a lazy sequence of successive items from coll while
* (pred item) returns true. pred must be free of side-effects.
*/
cljs.core.take_while = (function take_while(pred,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____4143 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____4143))
{var s__4144 = temp__3698__auto____4143;

if(cljs.core.truth_(pred.call(null,cljs.core.first.call(null,s__4144))))
{return cljs.core.cons.call(null,cljs.core.first.call(null,s__4144),take_while.call(null,pred,cljs.core.rest.call(null,s__4144)));
} else
{return null;
}
} else
{return null;
}
})));
});

/**
* @constructor
*/
cljs.core.Range = (function (meta,start,end,step){
this.meta = meta;
this.start = start;
this.end = end;
this.step = step;
})
cljs.core.Range.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Range");
});
cljs.core.Range.prototype.cljs$core$IHash$ = true;
cljs.core.Range.prototype.cljs$core$IHash$_hash = (function (rng){
var this__4145 = this;
return cljs.core.hash_coll.call(null,rng);
});
cljs.core.Range.prototype.cljs$core$ISequential$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$ = true;
cljs.core.Range.prototype.cljs$core$ICollection$_conj = (function (rng,o){
var this__4146 = this;
return cljs.core.cons.call(null,o,rng);
});
cljs.core.Range.prototype.cljs$core$IReduce$ = true;
cljs.core.Range.prototype.cljs$core$IReduce$_reduce = (function() {
var G__4162 = null;
var G__4162__4163 = (function (rng,f){
var this__4147 = this;
return cljs.core.ci_reduce.call(null,rng,f);
});
var G__4162__4164 = (function (rng,f,s){
var this__4148 = this;
return cljs.core.ci_reduce.call(null,rng,f,s);
});
G__4162 = function(rng,f,s){
switch(arguments.length){
case  2 :
return G__4162__4163.call(this,rng,f);
case  3 :
return G__4162__4164.call(this,rng,f,s);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4162;
})()
;
cljs.core.Range.prototype.cljs$core$ISeqable$ = true;
cljs.core.Range.prototype.cljs$core$ISeqable$_seq = (function (rng){
var this__4149 = this;
var comp__4150 = (cljs.core.truth_((this__4149.step > 0))?cljs.core._LT_:cljs.core._GT_);

if(cljs.core.truth_(comp__4150.call(null,this__4149.start,this__4149.end)))
{return rng;
} else
{return null;
}
});
cljs.core.Range.prototype.cljs$core$ICounted$ = true;
cljs.core.Range.prototype.cljs$core$ICounted$_count = (function (rng){
var this__4151 = this;
if(cljs.core.truth_(cljs.core.not.call(null,cljs.core._seq.call(null,rng))))
{return 0;
} else
{return Math['ceil'].call(null,((this__4151.end - this__4151.start) / this__4151.step));
}
});
cljs.core.Range.prototype.cljs$core$ISeq$ = true;
cljs.core.Range.prototype.cljs$core$ISeq$_first = (function (rng){
var this__4152 = this;
return this__4152.start;
});
cljs.core.Range.prototype.cljs$core$ISeq$_rest = (function (rng){
var this__4153 = this;
if(cljs.core.truth_(cljs.core._seq.call(null,rng)))
{return (new cljs.core.Range(this__4153.meta,(this__4153.start + this__4153.step),this__4153.end,this__4153.step));
} else
{return cljs.core.list.call(null);
}
});
cljs.core.Range.prototype.cljs$core$IEquiv$ = true;
cljs.core.Range.prototype.cljs$core$IEquiv$_equiv = (function (rng,other){
var this__4154 = this;
return cljs.core.equiv_sequential.call(null,rng,other);
});
cljs.core.Range.prototype.cljs$core$IWithMeta$ = true;
cljs.core.Range.prototype.cljs$core$IWithMeta$_with_meta = (function (rng,meta){
var this__4155 = this;
return (new cljs.core.Range(meta,this__4155.start,this__4155.end,this__4155.step));
});
cljs.core.Range.prototype.cljs$core$IMeta$ = true;
cljs.core.Range.prototype.cljs$core$IMeta$_meta = (function (rng){
var this__4156 = this;
return this__4156.meta;
});
cljs.core.Range.prototype.cljs$core$IIndexed$ = true;
cljs.core.Range.prototype.cljs$core$IIndexed$_nth = (function() {
var G__4166 = null;
var G__4166__4167 = (function (rng,n){
var this__4157 = this;
if(cljs.core.truth_((n < cljs.core._count.call(null,rng))))
{return (this__4157.start + (n * this__4157.step));
} else
{if(cljs.core.truth_((function (){var and__3546__auto____4158 = (this__4157.start > this__4157.end);

if(cljs.core.truth_(and__3546__auto____4158))
{return cljs.core._EQ_.call(null,this__4157.step,0);
} else
{return and__3546__auto____4158;
}
})()))
{return this__4157.start;
} else
{throw (new Error("Index out of bounds"));
}
}
});
var G__4166__4168 = (function (rng,n,not_found){
var this__4159 = this;
if(cljs.core.truth_((n < cljs.core._count.call(null,rng))))
{return (this__4159.start + (n * this__4159.step));
} else
{if(cljs.core.truth_((function (){var and__3546__auto____4160 = (this__4159.start > this__4159.end);

if(cljs.core.truth_(and__3546__auto____4160))
{return cljs.core._EQ_.call(null,this__4159.step,0);
} else
{return and__3546__auto____4160;
}
})()))
{return this__4159.start;
} else
{return not_found;
}
}
});
G__4166 = function(rng,n,not_found){
switch(arguments.length){
case  2 :
return G__4166__4167.call(this,rng,n);
case  3 :
return G__4166__4168.call(this,rng,n,not_found);
}
throw('Invalid arity: ' + arguments.length);
};
return G__4166;
})()
;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$ = true;
cljs.core.Range.prototype.cljs$core$IEmptyableCollection$_empty = (function (rng){
var this__4161 = this;
return cljs.core.with_meta.call(null,cljs.core.List.EMPTY,this__4161.meta);
});
cljs.core.Range;
/**
* Returns a lazy seq of nums from start (inclusive) to end
* (exclusive), by step, where start defaults to 0, step to 1,
* and end to infinity.
*/
cljs.core.range = (function() {
var range = null;
var range__4170 = (function (){
return range.call(null,0,Number['MAX_VALUE'],1);
});
var range__4171 = (function (end){
return range.call(null,0,end,1);
});
var range__4172 = (function (start,end){
return range.call(null,start,end,1);
});
var range__4173 = (function (start,end,step){
return (new cljs.core.Range(null,start,end,step));
});
range = function(start,end,step){
switch(arguments.length){
case  0 :
return range__4170.call(this);
case  1 :
return range__4171.call(this,start);
case  2 :
return range__4172.call(this,start,end);
case  3 :
return range__4173.call(this,start,end,step);
}
throw('Invalid arity: ' + arguments.length);
};
return range;
})()
;
/**
* Returns a lazy seq of every nth item in coll.
*/
cljs.core.take_nth = (function take_nth(n,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____4175 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____4175))
{var s__4176 = temp__3698__auto____4175;

return cljs.core.cons.call(null,cljs.core.first.call(null,s__4176),take_nth.call(null,n,cljs.core.drop.call(null,n,s__4176)));
} else
{return null;
}
})));
});
/**
* Returns a vector of [(take-while pred coll) (drop-while pred coll)]
*/
cljs.core.split_with = (function split_with(pred,coll){
return cljs.core.Vector.fromArray([cljs.core.take_while.call(null,pred,coll),cljs.core.drop_while.call(null,pred,coll)]);
});
/**
* Applies f to each value in coll, splitting it each time f returns
* a new value.  Returns a lazy seq of partitions.
*/
cljs.core.partition_by = (function partition_by(f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____4178 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____4178))
{var s__4179 = temp__3698__auto____4178;

var fst__4180 = cljs.core.first.call(null,s__4179);
var fv__4181 = f.call(null,fst__4180);
var run__4182 = cljs.core.cons.call(null,fst__4180,cljs.core.take_while.call(null,(function (p1__4177_SHARP_){
return cljs.core._EQ_.call(null,fv__4181,f.call(null,p1__4177_SHARP_));
}),cljs.core.next.call(null,s__4179)));

return cljs.core.cons.call(null,run__4182,partition_by.call(null,f,cljs.core.seq.call(null,cljs.core.drop.call(null,cljs.core.count.call(null,run__4182),s__4179))));
} else
{return null;
}
})));
});
/**
* Returns a map from distinct items in coll to the number of times
* they appear.
*/
cljs.core.frequencies = (function frequencies(coll){
return cljs.core.reduce.call(null,(function (counts,x){
return cljs.core.assoc.call(null,counts,x,(cljs.core.get.call(null,counts,x,0) + 1));
}),cljs.core.ObjMap.fromObject([],{}),coll);
});
/**
* Returns a lazy seq of the intermediate values of the reduction (as
* per reduce) of coll by f, starting with init.
*/
cljs.core.reductions = (function() {
var reductions = null;
var reductions__4197 = (function (f,coll){
return (new cljs.core.LazySeq(null,false,(function (){
var temp__3695__auto____4193 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3695__auto____4193))
{var s__4194 = temp__3695__auto____4193;

return reductions.call(null,f,cljs.core.first.call(null,s__4194),cljs.core.rest.call(null,s__4194));
} else
{return cljs.core.list.call(null,f.call(null));
}
})));
});
var reductions__4198 = (function (f,init,coll){
return cljs.core.cons.call(null,init,(new cljs.core.LazySeq(null,false,(function (){
var temp__3698__auto____4195 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(temp__3698__auto____4195))
{var s__4196 = temp__3698__auto____4195;

return reductions.call(null,f,f.call(null,init,cljs.core.first.call(null,s__4196)),cljs.core.rest.call(null,s__4196));
} else
{return null;
}
}))));
});
reductions = function(f,init,coll){
switch(arguments.length){
case  2 :
return reductions__4197.call(this,f,init);
case  3 :
return reductions__4198.call(this,f,init,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return reductions;
})()
;
/**
* Takes a set of functions and returns a fn that is the juxtaposition
* of those fns.  The returned fn takes a variable number of args, and
* returns a vector containing the result of applying each fn to the
* args (left-to-right).
* ((juxt a b c) x) => [(a x) (b x) (c x)]
* @param {...*} var_args
*/
cljs.core.juxt = (function() {
var juxt = null;
var juxt__4201 = (function (f){
return (function() {
var G__4206 = null;
var G__4206__4207 = (function (){
return cljs.core.vector.call(null,f.call(null));
});
var G__4206__4208 = (function (x){
return cljs.core.vector.call(null,f.call(null,x));
});
var G__4206__4209 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y));
});
var G__4206__4210 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z));
});
var G__4206__4211 = (function() { 
var G__4213__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args));
};
var G__4213 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4213__delegate.call(this, x, y, z, args);
};
G__4213.cljs$lang$maxFixedArity = 3;
G__4213.cljs$lang$applyTo = (function (arglist__4214){
var x = cljs.core.first(arglist__4214);
var y = cljs.core.first(cljs.core.next(arglist__4214));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4214)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4214)));
return G__4213__delegate.call(this, x, y, z, args);
});
return G__4213;
})()
;
G__4206 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__4206__4207.call(this);
case  1 :
return G__4206__4208.call(this,x);
case  2 :
return G__4206__4209.call(this,x,y);
case  3 :
return G__4206__4210.call(this,x,y,z);
default:
return G__4206__4211.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__4206.cljs$lang$maxFixedArity = 3;
G__4206.cljs$lang$applyTo = G__4206__4211.cljs$lang$applyTo;
return G__4206;
})()
});
var juxt__4202 = (function (f,g){
return (function() {
var G__4215 = null;
var G__4215__4216 = (function (){
return cljs.core.vector.call(null,f.call(null),g.call(null));
});
var G__4215__4217 = (function (x){
return cljs.core.vector.call(null,f.call(null,x),g.call(null,x));
});
var G__4215__4218 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y),g.call(null,x,y));
});
var G__4215__4219 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z),g.call(null,x,y,z));
});
var G__4215__4220 = (function() { 
var G__4222__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args),cljs.core.apply.call(null,g,x,y,z,args));
};
var G__4222 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4222__delegate.call(this, x, y, z, args);
};
G__4222.cljs$lang$maxFixedArity = 3;
G__4222.cljs$lang$applyTo = (function (arglist__4223){
var x = cljs.core.first(arglist__4223);
var y = cljs.core.first(cljs.core.next(arglist__4223));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4223)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4223)));
return G__4222__delegate.call(this, x, y, z, args);
});
return G__4222;
})()
;
G__4215 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__4215__4216.call(this);
case  1 :
return G__4215__4217.call(this,x);
case  2 :
return G__4215__4218.call(this,x,y);
case  3 :
return G__4215__4219.call(this,x,y,z);
default:
return G__4215__4220.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__4215.cljs$lang$maxFixedArity = 3;
G__4215.cljs$lang$applyTo = G__4215__4220.cljs$lang$applyTo;
return G__4215;
})()
});
var juxt__4203 = (function (f,g,h){
return (function() {
var G__4224 = null;
var G__4224__4225 = (function (){
return cljs.core.vector.call(null,f.call(null),g.call(null),h.call(null));
});
var G__4224__4226 = (function (x){
return cljs.core.vector.call(null,f.call(null,x),g.call(null,x),h.call(null,x));
});
var G__4224__4227 = (function (x,y){
return cljs.core.vector.call(null,f.call(null,x,y),g.call(null,x,y),h.call(null,x,y));
});
var G__4224__4228 = (function (x,y,z){
return cljs.core.vector.call(null,f.call(null,x,y,z),g.call(null,x,y,z),h.call(null,x,y,z));
});
var G__4224__4229 = (function() { 
var G__4231__delegate = function (x,y,z,args){
return cljs.core.vector.call(null,cljs.core.apply.call(null,f,x,y,z,args),cljs.core.apply.call(null,g,x,y,z,args),cljs.core.apply.call(null,h,x,y,z,args));
};
var G__4231 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4231__delegate.call(this, x, y, z, args);
};
G__4231.cljs$lang$maxFixedArity = 3;
G__4231.cljs$lang$applyTo = (function (arglist__4232){
var x = cljs.core.first(arglist__4232);
var y = cljs.core.first(cljs.core.next(arglist__4232));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4232)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4232)));
return G__4231__delegate.call(this, x, y, z, args);
});
return G__4231;
})()
;
G__4224 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__4224__4225.call(this);
case  1 :
return G__4224__4226.call(this,x);
case  2 :
return G__4224__4227.call(this,x,y);
case  3 :
return G__4224__4228.call(this,x,y,z);
default:
return G__4224__4229.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__4224.cljs$lang$maxFixedArity = 3;
G__4224.cljs$lang$applyTo = G__4224__4229.cljs$lang$applyTo;
return G__4224;
})()
});
var juxt__4204 = (function() { 
var G__4233__delegate = function (f,g,h,fs){
var fs__4200 = cljs.core.list_STAR_.call(null,f,g,h,fs);

return (function() {
var G__4234 = null;
var G__4234__4235 = (function (){
return cljs.core.reduce.call(null,(function (p1__4183_SHARP_,p2__4184_SHARP_){
return cljs.core.conj.call(null,p1__4183_SHARP_,p2__4184_SHARP_.call(null));
}),cljs.core.Vector.fromArray([]),fs__4200);
});
var G__4234__4236 = (function (x){
return cljs.core.reduce.call(null,(function (p1__4185_SHARP_,p2__4186_SHARP_){
return cljs.core.conj.call(null,p1__4185_SHARP_,p2__4186_SHARP_.call(null,x));
}),cljs.core.Vector.fromArray([]),fs__4200);
});
var G__4234__4237 = (function (x,y){
return cljs.core.reduce.call(null,(function (p1__4187_SHARP_,p2__4188_SHARP_){
return cljs.core.conj.call(null,p1__4187_SHARP_,p2__4188_SHARP_.call(null,x,y));
}),cljs.core.Vector.fromArray([]),fs__4200);
});
var G__4234__4238 = (function (x,y,z){
return cljs.core.reduce.call(null,(function (p1__4189_SHARP_,p2__4190_SHARP_){
return cljs.core.conj.call(null,p1__4189_SHARP_,p2__4190_SHARP_.call(null,x,y,z));
}),cljs.core.Vector.fromArray([]),fs__4200);
});
var G__4234__4239 = (function() { 
var G__4241__delegate = function (x,y,z,args){
return cljs.core.reduce.call(null,(function (p1__4191_SHARP_,p2__4192_SHARP_){
return cljs.core.conj.call(null,p1__4191_SHARP_,cljs.core.apply.call(null,p2__4192_SHARP_,x,y,z,args));
}),cljs.core.Vector.fromArray([]),fs__4200);
};
var G__4241 = function (x,y,z,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4241__delegate.call(this, x, y, z, args);
};
G__4241.cljs$lang$maxFixedArity = 3;
G__4241.cljs$lang$applyTo = (function (arglist__4242){
var x = cljs.core.first(arglist__4242);
var y = cljs.core.first(cljs.core.next(arglist__4242));
var z = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4242)));
var args = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4242)));
return G__4241__delegate.call(this, x, y, z, args);
});
return G__4241;
})()
;
G__4234 = function(x,y,z,var_args){
var args = var_args;
switch(arguments.length){
case  0 :
return G__4234__4235.call(this);
case  1 :
return G__4234__4236.call(this,x);
case  2 :
return G__4234__4237.call(this,x,y);
case  3 :
return G__4234__4238.call(this,x,y,z);
default:
return G__4234__4239.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
G__4234.cljs$lang$maxFixedArity = 3;
G__4234.cljs$lang$applyTo = G__4234__4239.cljs$lang$applyTo;
return G__4234;
})()
};
var G__4233 = function (f,g,h,var_args){
var fs = null;
if (goog.isDef(var_args)) {
  fs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 3),0);
} 
return G__4233__delegate.call(this, f, g, h, fs);
};
G__4233.cljs$lang$maxFixedArity = 3;
G__4233.cljs$lang$applyTo = (function (arglist__4243){
var f = cljs.core.first(arglist__4243);
var g = cljs.core.first(cljs.core.next(arglist__4243));
var h = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4243)));
var fs = cljs.core.rest(cljs.core.next(cljs.core.next(arglist__4243)));
return G__4233__delegate.call(this, f, g, h, fs);
});
return G__4233;
})()
;
juxt = function(f,g,h,var_args){
var fs = var_args;
switch(arguments.length){
case  1 :
return juxt__4201.call(this,f);
case  2 :
return juxt__4202.call(this,f,g);
case  3 :
return juxt__4203.call(this,f,g,h);
default:
return juxt__4204.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
juxt.cljs$lang$maxFixedArity = 3;
juxt.cljs$lang$applyTo = juxt__4204.cljs$lang$applyTo;
return juxt;
})()
;
/**
* When lazy sequences are produced via functions that have side
* effects, any effects other than those needed to produce the first
* element in the seq do not occur until the seq is consumed. dorun can
* be used to force any effects. Walks through the successive nexts of
* the seq, does not retain the head and returns nil.
*/
cljs.core.dorun = (function() {
var dorun = null;
var dorun__4245 = (function (coll){
while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,coll)))
{{
var G__4248 = cljs.core.next.call(null,coll);
coll = G__4248;
continue;
}
} else
{return null;
}
break;
}
});
var dorun__4246 = (function (n,coll){
while(true){
if(cljs.core.truth_((function (){var and__3546__auto____4244 = cljs.core.seq.call(null,coll);

if(cljs.core.truth_(and__3546__auto____4244))
{return (n > 0);
} else
{return and__3546__auto____4244;
}
})()))
{{
var G__4249 = (n - 1);
var G__4250 = cljs.core.next.call(null,coll);
n = G__4249;
coll = G__4250;
continue;
}
} else
{return null;
}
break;
}
});
dorun = function(n,coll){
switch(arguments.length){
case  1 :
return dorun__4245.call(this,n);
case  2 :
return dorun__4246.call(this,n,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return dorun;
})()
;
/**
* When lazy sequences are produced via functions that have side
* effects, any effects other than those needed to produce the first
* element in the seq do not occur until the seq is consumed. doall can
* be used to force any effects. Walks through the successive nexts of
* the seq, retains the head and returns it, thus causing the entire
* seq to reside in memory at one time.
*/
cljs.core.doall = (function() {
var doall = null;
var doall__4251 = (function (coll){
cljs.core.dorun.call(null,coll);
return coll;
});
var doall__4252 = (function (n,coll){
cljs.core.dorun.call(null,n,coll);
return coll;
});
doall = function(n,coll){
switch(arguments.length){
case  1 :
return doall__4251.call(this,n);
case  2 :
return doall__4252.call(this,n,coll);
}
throw('Invalid arity: ' + arguments.length);
};
return doall;
})()
;
/**
* Returns the result of (re-find re s) if re fully matches s.
*/
cljs.core.re_matches = (function re_matches(re,s){
var matches__4254 = re.exec(s);

if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.first.call(null,matches__4254),s)))
{if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.count.call(null,matches__4254),1)))
{return cljs.core.first.call(null,matches__4254);
} else
{return cljs.core.vec.call(null,matches__4254);
}
} else
{return null;
}
});
/**
* Returns the first regex match, if any, of s to re, using
* re.exec(s). Returns a vector, containing first the matching
* substring, then any capturing groups if the regular expression contains
* capturing groups.
*/
cljs.core.re_find = (function re_find(re,s){
var matches__4255 = re.exec(s);

if(cljs.core.truth_((matches__4255 === null)))
{return null;
} else
{if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.count.call(null,matches__4255),1)))
{return cljs.core.first.call(null,matches__4255);
} else
{return cljs.core.vec.call(null,matches__4255);
}
}
});
/**
* Returns a lazy sequence of successive matches of re in s.
*/
cljs.core.re_seq = (function re_seq(re,s){
var match_data__4256 = cljs.core.re_find.call(null,re,s);
var match_idx__4257 = s.search(re);
var match_str__4258 = (cljs.core.truth_(cljs.core.coll_QMARK_.call(null,match_data__4256))?cljs.core.first.call(null,match_data__4256):match_data__4256);
var post_match__4259 = cljs.core.subs.call(null,s,(match_idx__4257 + cljs.core.count.call(null,match_str__4258)));

if(cljs.core.truth_(match_data__4256))
{return (new cljs.core.LazySeq(null,false,(function (){
return cljs.core.cons.call(null,match_data__4256,re_seq.call(null,re,post_match__4259));
})));
} else
{return null;
}
});
/**
* Returns an instance of RegExp which has compiled the provided string.
*/
cljs.core.re_pattern = (function re_pattern(s){
var vec__4261__4262 = cljs.core.re_find.call(null,/^(?:\(\?([idmsux]*)\))?(.*)/,s);
var ___4263 = cljs.core.nth.call(null,vec__4261__4262,0,null);
var flags__4264 = cljs.core.nth.call(null,vec__4261__4262,1,null);
var pattern__4265 = cljs.core.nth.call(null,vec__4261__4262,2,null);

return (new RegExp(pattern__4265,flags__4264));
});
cljs.core.pr_sequential = (function pr_sequential(print_one,begin,sep,end,opts,coll){
return cljs.core.concat.call(null,cljs.core.Vector.fromArray([begin]),cljs.core.flatten1.call(null,cljs.core.interpose.call(null,cljs.core.Vector.fromArray([sep]),cljs.core.map.call(null,(function (p1__4260_SHARP_){
return print_one.call(null,p1__4260_SHARP_,opts);
}),coll))),cljs.core.Vector.fromArray([end]));
});
cljs.core.string_print = (function string_print(x){
cljs.core._STAR_print_fn_STAR_.call(null,x);
return null;
});
cljs.core.flush = (function flush(){
return null;
});
cljs.core.pr_seq = (function pr_seq(obj,opts){
if(cljs.core.truth_((obj === null)))
{return cljs.core.list.call(null,"nil");
} else
{if(cljs.core.truth_((void 0 === obj)))
{return cljs.core.list.call(null,"#<undefined>");
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return cljs.core.concat.call(null,(cljs.core.truth_((function (){var and__3546__auto____4266 = cljs.core.get.call(null,opts,"\uFDD0'meta");

if(cljs.core.truth_(and__3546__auto____4266))
{var and__3546__auto____4270 = (function (){var x__352__auto____4267 = obj;

if(cljs.core.truth_((function (){var and__3546__auto____4268 = x__352__auto____4267;

if(cljs.core.truth_(and__3546__auto____4268))
{var and__3546__auto____4269 = x__352__auto____4267.cljs$core$IMeta$;

if(cljs.core.truth_(and__3546__auto____4269))
{return cljs.core.not.call(null,x__352__auto____4267.hasOwnProperty("cljs$core$IMeta$"));
} else
{return and__3546__auto____4269;
}
} else
{return and__3546__auto____4268;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IMeta,x__352__auto____4267);
}
})();

if(cljs.core.truth_(and__3546__auto____4270))
{return cljs.core.meta.call(null,obj);
} else
{return and__3546__auto____4270;
}
} else
{return and__3546__auto____4266;
}
})())?cljs.core.concat.call(null,cljs.core.Vector.fromArray(["^"]),pr_seq.call(null,cljs.core.meta.call(null,obj),opts),cljs.core.Vector.fromArray([" "])):null),(cljs.core.truth_((function (){var x__352__auto____4271 = obj;

if(cljs.core.truth_((function (){var and__3546__auto____4272 = x__352__auto____4271;

if(cljs.core.truth_(and__3546__auto____4272))
{var and__3546__auto____4273 = x__352__auto____4271.cljs$core$IPrintable$;

if(cljs.core.truth_(and__3546__auto____4273))
{return cljs.core.not.call(null,x__352__auto____4271.hasOwnProperty("cljs$core$IPrintable$"));
} else
{return and__3546__auto____4273;
}
} else
{return and__3546__auto____4272;
}
})()))
{return true;
} else
{return cljs.core.type_satisfies_.call(null,cljs.core.IPrintable,x__352__auto____4271);
}
})())?cljs.core._pr_seq.call(null,obj,opts):cljs.core.list.call(null,"#<",cljs.core.str.call(null,obj),">")));
} else
{return null;
}
}
}
});
/**
* Prints a sequence of objects to a string, observing all the
* options given in opts
*/
cljs.core.pr_str_with_opts = (function pr_str_with_opts(objs,opts){
var first_obj__4274 = cljs.core.first.call(null,objs);
var sb__4275 = (new goog.string.StringBuffer());

var G__4276__4277 = cljs.core.seq.call(null,objs);

if(cljs.core.truth_(G__4276__4277))
{var obj__4278 = cljs.core.first.call(null,G__4276__4277);
var G__4276__4279 = G__4276__4277;

while(true){
if(cljs.core.truth_((obj__4278 === first_obj__4274)))
{} else
{sb__4275.append(" ");
}
var G__4280__4281 = cljs.core.seq.call(null,cljs.core.pr_seq.call(null,obj__4278,opts));

if(cljs.core.truth_(G__4280__4281))
{var string__4282 = cljs.core.first.call(null,G__4280__4281);
var G__4280__4283 = G__4280__4281;

while(true){
sb__4275.append(string__4282);
var temp__3698__auto____4284 = cljs.core.next.call(null,G__4280__4283);

if(cljs.core.truth_(temp__3698__auto____4284))
{var G__4280__4285 = temp__3698__auto____4284;

{
var G__4288 = cljs.core.first.call(null,G__4280__4285);
var G__4289 = G__4280__4285;
string__4282 = G__4288;
G__4280__4283 = G__4289;
continue;
}
} else
{}
break;
}
} else
{}
var temp__3698__auto____4286 = cljs.core.next.call(null,G__4276__4279);

if(cljs.core.truth_(temp__3698__auto____4286))
{var G__4276__4287 = temp__3698__auto____4286;

{
var G__4290 = cljs.core.first.call(null,G__4276__4287);
var G__4291 = G__4276__4287;
obj__4278 = G__4290;
G__4276__4279 = G__4291;
continue;
}
} else
{}
break;
}
} else
{}
return cljs.core.str.call(null,sb__4275);
});
/**
* Prints a sequence of objects using string-print, observing all
* the options given in opts
*/
cljs.core.pr_with_opts = (function pr_with_opts(objs,opts){
var first_obj__4292 = cljs.core.first.call(null,objs);

var G__4293__4294 = cljs.core.seq.call(null,objs);

if(cljs.core.truth_(G__4293__4294))
{var obj__4295 = cljs.core.first.call(null,G__4293__4294);
var G__4293__4296 = G__4293__4294;

while(true){
if(cljs.core.truth_((obj__4295 === first_obj__4292)))
{} else
{cljs.core.string_print.call(null," ");
}
var G__4297__4298 = cljs.core.seq.call(null,cljs.core.pr_seq.call(null,obj__4295,opts));

if(cljs.core.truth_(G__4297__4298))
{var string__4299 = cljs.core.first.call(null,G__4297__4298);
var G__4297__4300 = G__4297__4298;

while(true){
cljs.core.string_print.call(null,string__4299);
var temp__3698__auto____4301 = cljs.core.next.call(null,G__4297__4300);

if(cljs.core.truth_(temp__3698__auto____4301))
{var G__4297__4302 = temp__3698__auto____4301;

{
var G__4305 = cljs.core.first.call(null,G__4297__4302);
var G__4306 = G__4297__4302;
string__4299 = G__4305;
G__4297__4300 = G__4306;
continue;
}
} else
{}
break;
}
} else
{}
var temp__3698__auto____4303 = cljs.core.next.call(null,G__4293__4296);

if(cljs.core.truth_(temp__3698__auto____4303))
{var G__4293__4304 = temp__3698__auto____4303;

{
var G__4307 = cljs.core.first.call(null,G__4293__4304);
var G__4308 = G__4293__4304;
obj__4295 = G__4307;
G__4293__4296 = G__4308;
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
cljs.core.newline = (function newline(opts){
cljs.core.string_print.call(null,"\n");
if(cljs.core.truth_(cljs.core.get.call(null,opts,"\uFDD0'flush-on-newline")))
{return cljs.core.flush.call(null);
} else
{return null;
}
});
cljs.core._STAR_flush_on_newline_STAR_ = true;
cljs.core._STAR_print_readably_STAR_ = true;
cljs.core._STAR_print_meta_STAR_ = false;
cljs.core._STAR_print_dup_STAR_ = false;
cljs.core.pr_opts = (function pr_opts(){
return cljs.core.ObjMap.fromObject(["\uFDD0'flush-on-newline","\uFDD0'readably","\uFDD0'meta","\uFDD0'dup"],{"\uFDD0'flush-on-newline":cljs.core._STAR_flush_on_newline_STAR_,"\uFDD0'readably":cljs.core._STAR_print_readably_STAR_,"\uFDD0'meta":cljs.core._STAR_print_meta_STAR_,"\uFDD0'dup":cljs.core._STAR_print_dup_STAR_});
});
/**
* pr to a string, returning it. Fundamental entrypoint to IPrintable.
* @param {...*} var_args
*/
cljs.core.pr_str = (function() { 
var pr_str__delegate = function (objs){
return cljs.core.pr_str_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
};
var pr_str = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return pr_str__delegate.call(this, objs);
};
pr_str.cljs$lang$maxFixedArity = 0;
pr_str.cljs$lang$applyTo = (function (arglist__4309){
var objs = cljs.core.seq( arglist__4309 );;
return pr_str__delegate.call(this, objs);
});
return pr_str;
})()
;
/**
* Prints the object(s) using string-print.  Prints the
* object(s), separated by spaces if there is more than one.
* By default, pr and prn print in a way that objects can be
* read by the reader
* @param {...*} var_args
*/
cljs.core.pr = (function() { 
var pr__delegate = function (objs){
return cljs.core.pr_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
};
var pr = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return pr__delegate.call(this, objs);
};
pr.cljs$lang$maxFixedArity = 0;
pr.cljs$lang$applyTo = (function (arglist__4310){
var objs = cljs.core.seq( arglist__4310 );;
return pr__delegate.call(this, objs);
});
return pr;
})()
;
/**
* Prints the object(s) using string-print.
* print and println produce output for human consumption.
* @param {...*} var_args
*/
cljs.core.print = (function() { 
var cljs_core_print__delegate = function (objs){
return cljs.core.pr_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
};
var cljs_core_print = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return cljs_core_print__delegate.call(this, objs);
};
cljs_core_print.cljs$lang$maxFixedArity = 0;
cljs_core_print.cljs$lang$applyTo = (function (arglist__4311){
var objs = cljs.core.seq( arglist__4311 );;
return cljs_core_print__delegate.call(this, objs);
});
return cljs_core_print;
})()
;
/**
* Same as print followed by (newline)
* @param {...*} var_args
*/
cljs.core.println = (function() { 
var println__delegate = function (objs){
cljs.core.pr_with_opts.call(null,objs,cljs.core.assoc.call(null,cljs.core.pr_opts.call(null),"\uFDD0'readably",false));
return cljs.core.newline.call(null,cljs.core.pr_opts.call(null));
};
var println = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return println__delegate.call(this, objs);
};
println.cljs$lang$maxFixedArity = 0;
println.cljs$lang$applyTo = (function (arglist__4312){
var objs = cljs.core.seq( arglist__4312 );;
return println__delegate.call(this, objs);
});
return println;
})()
;
/**
* Same as pr followed by (newline).
* @param {...*} var_args
*/
cljs.core.prn = (function() { 
var prn__delegate = function (objs){
cljs.core.pr_with_opts.call(null,objs,cljs.core.pr_opts.call(null));
return cljs.core.newline.call(null,cljs.core.pr_opts.call(null));
};
var prn = function (var_args){
var objs = null;
if (goog.isDef(var_args)) {
  objs = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return prn__delegate.call(this, objs);
};
prn.cljs$lang$maxFixedArity = 0;
prn.cljs$lang$applyTo = (function (arglist__4313){
var objs = cljs.core.seq( arglist__4313 );;
return prn__delegate.call(this, objs);
});
return prn;
})()
;
cljs.core.HashMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.HashMap.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
var pr_pair__4314 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});

return cljs.core.pr_sequential.call(null,pr_pair__4314,"{",", ","}",opts,coll);
});
(cljs.core.IPrintable["number"] = true);
(cljs.core._pr_seq["number"] = (function (n,opts){
return cljs.core.list.call(null,cljs.core.str.call(null,n));
}));
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.IndexedSeq.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.Subvec.prototype.cljs$core$IPrintable$ = true;
cljs.core.Subvec.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.LazySeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.LazySeq.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
(cljs.core.IPrintable["boolean"] = true);
(cljs.core._pr_seq["boolean"] = (function (bool,opts){
return cljs.core.list.call(null,cljs.core.str.call(null,bool));
}));
cljs.core.Set.prototype.cljs$core$IPrintable$ = true;
cljs.core.Set.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#{"," ","}",opts,coll);
});
(cljs.core.IPrintable["string"] = true);
(cljs.core._pr_seq["string"] = (function (obj,opts){
if(cljs.core.truth_(cljs.core.keyword_QMARK_.call(null,obj)))
{return cljs.core.list.call(null,cljs.core.str.call(null,":",(function (){var temp__3698__auto____4315 = cljs.core.namespace.call(null,obj);

if(cljs.core.truth_(temp__3698__auto____4315))
{var nspc__4316 = temp__3698__auto____4315;

return cljs.core.str.call(null,nspc__4316,"\/");
} else
{return null;
}
})(),cljs.core.name.call(null,obj)));
} else
{if(cljs.core.truth_(cljs.core.symbol_QMARK_.call(null,obj)))
{return cljs.core.list.call(null,cljs.core.str.call(null,(function (){var temp__3698__auto____4317 = cljs.core.namespace.call(null,obj);

if(cljs.core.truth_(temp__3698__auto____4317))
{var nspc__4318 = temp__3698__auto____4317;

return cljs.core.str.call(null,nspc__4318,"\/");
} else
{return null;
}
})(),cljs.core.name.call(null,obj)));
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return cljs.core.list.call(null,(cljs.core.truth_("\uFDD0'readably".call(null,opts))?goog.string.quote.call(null,obj):obj));
} else
{return null;
}
}
}
}));
cljs.core.Vector.prototype.cljs$core$IPrintable$ = true;
cljs.core.Vector.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"["," ","]",opts,coll);
});
cljs.core.List.prototype.cljs$core$IPrintable$ = true;
cljs.core.List.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
(cljs.core.IPrintable["array"] = true);
(cljs.core._pr_seq["array"] = (function (a,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"#<Array [",", ","]>",opts,a);
}));
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$ = true;
cljs.core.PersistentQueueSeq.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
(cljs.core.IPrintable["function"] = true);
(cljs.core._pr_seq["function"] = (function (this$){
return cljs.core.list.call(null,"#<",cljs.core.str.call(null,this$),">");
}));
cljs.core.EmptyList.prototype.cljs$core$IPrintable$ = true;
cljs.core.EmptyList.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.list.call(null,"()");
});
cljs.core.Cons.prototype.cljs$core$IPrintable$ = true;
cljs.core.Cons.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.Range.prototype.cljs$core$IPrintable$ = true;
cljs.core.Range.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,"("," ",")",opts,coll);
});
cljs.core.ObjMap.prototype.cljs$core$IPrintable$ = true;
cljs.core.ObjMap.prototype.cljs$core$IPrintable$_pr_seq = (function (coll,opts){
var pr_pair__4319 = (function (keyval){
return cljs.core.pr_sequential.call(null,cljs.core.pr_seq,""," ","",opts,keyval);
});

return cljs.core.pr_sequential.call(null,pr_pair__4319,"{",", ","}",opts,coll);
});

/**
* @constructor
*/
cljs.core.Atom = (function (state,meta,validator,watches){
this.state = state;
this.meta = meta;
this.validator = validator;
this.watches = watches;
})
cljs.core.Atom.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Atom");
});
cljs.core.Atom.prototype.cljs$core$IHash$ = true;
cljs.core.Atom.prototype.cljs$core$IHash$_hash = (function (this$){
var this__4320 = this;
return goog.getUid.call(null,this$);
});
cljs.core.Atom.prototype.cljs$core$IWatchable$ = true;
cljs.core.Atom.prototype.cljs$core$IWatchable$_notify_watches = (function (this$,oldval,newval){
var this__4321 = this;
var G__4322__4323 = cljs.core.seq.call(null,this__4321.watches);

if(cljs.core.truth_(G__4322__4323))
{var G__4325__4327 = cljs.core.first.call(null,G__4322__4323);
var vec__4326__4328 = G__4325__4327;
var key__4329 = cljs.core.nth.call(null,vec__4326__4328,0,null);
var f__4330 = cljs.core.nth.call(null,vec__4326__4328,1,null);
var G__4322__4331 = G__4322__4323;

var G__4325__4332 = G__4325__4327;
var G__4322__4333 = G__4322__4331;

while(true){
var vec__4334__4335 = G__4325__4332;
var key__4336 = cljs.core.nth.call(null,vec__4334__4335,0,null);
var f__4337 = cljs.core.nth.call(null,vec__4334__4335,1,null);
var G__4322__4338 = G__4322__4333;

f__4337.call(null,key__4336,this$,oldval,newval);
var temp__3698__auto____4339 = cljs.core.next.call(null,G__4322__4338);

if(cljs.core.truth_(temp__3698__auto____4339))
{var G__4322__4340 = temp__3698__auto____4339;

{
var G__4347 = cljs.core.first.call(null,G__4322__4340);
var G__4348 = G__4322__4340;
G__4325__4332 = G__4347;
G__4322__4333 = G__4348;
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
cljs.core.Atom.prototype.cljs$core$IWatchable$_add_watch = (function (this$,key,f){
var this__4341 = this;
return this$.watches = cljs.core.assoc.call(null,this__4341.watches,key,f);
});
cljs.core.Atom.prototype.cljs$core$IWatchable$_remove_watch = (function (this$,key){
var this__4342 = this;
return this$.watches = cljs.core.dissoc.call(null,this__4342.watches,key);
});
cljs.core.Atom.prototype.cljs$core$IPrintable$ = true;
cljs.core.Atom.prototype.cljs$core$IPrintable$_pr_seq = (function (a,opts){
var this__4343 = this;
return cljs.core.concat.call(null,cljs.core.Vector.fromArray(["#<Atom: "]),cljs.core._pr_seq.call(null,this__4343.state,opts),">");
});
cljs.core.Atom.prototype.cljs$core$IMeta$ = true;
cljs.core.Atom.prototype.cljs$core$IMeta$_meta = (function (_){
var this__4344 = this;
return this__4344.meta;
});
cljs.core.Atom.prototype.cljs$core$IDeref$ = true;
cljs.core.Atom.prototype.cljs$core$IDeref$_deref = (function (_){
var this__4345 = this;
return this__4345.state;
});
cljs.core.Atom.prototype.cljs$core$IEquiv$ = true;
cljs.core.Atom.prototype.cljs$core$IEquiv$_equiv = (function (o,other){
var this__4346 = this;
return (o === other);
});
cljs.core.Atom;
/**
* Creates and returns an Atom with an initial value of x and zero or
* more options (in any order):
* 
* :meta metadata-map
* 
* :validator validate-fn
* 
* If metadata-map is supplied, it will be come the metadata on the
* atom. validate-fn must be nil or a side-effect-free fn of one
* argument, which will be passed the intended new state on any state
* change. If the new state is unacceptable, the validate-fn should
* return false or throw an Error.  If either of these error conditions
* occur, then the value of the atom will not change.
* @param {...*} var_args
*/
cljs.core.atom = (function() {
var atom = null;
var atom__4355 = (function (x){
return (new cljs.core.Atom(x,null,null,null));
});
var atom__4356 = (function() { 
var G__4358__delegate = function (x,p__4349){
var map__4350__4351 = p__4349;
var map__4350__4352 = (cljs.core.truth_(cljs.core.seq_QMARK_.call(null,map__4350__4351))?cljs.core.apply.call(null,cljs.core.hash_map,map__4350__4351):map__4350__4351);
var validator__4353 = cljs.core.get.call(null,map__4350__4352,"\uFDD0'validator");
var meta__4354 = cljs.core.get.call(null,map__4350__4352,"\uFDD0'meta");

return (new cljs.core.Atom(x,meta__4354,validator__4353,null));
};
var G__4358 = function (x,var_args){
var p__4349 = null;
if (goog.isDef(var_args)) {
  p__4349 = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__4358__delegate.call(this, x, p__4349);
};
G__4358.cljs$lang$maxFixedArity = 1;
G__4358.cljs$lang$applyTo = (function (arglist__4359){
var x = cljs.core.first(arglist__4359);
var p__4349 = cljs.core.rest(arglist__4359);
return G__4358__delegate.call(this, x, p__4349);
});
return G__4358;
})()
;
atom = function(x,var_args){
var p__4349 = var_args;
switch(arguments.length){
case  1 :
return atom__4355.call(this,x);
default:
return atom__4356.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
atom.cljs$lang$maxFixedArity = 1;
atom.cljs$lang$applyTo = atom__4356.cljs$lang$applyTo;
return atom;
})()
;
/**
* Sets the value of atom to newval without regard for the
* current value. Returns newval.
*/
cljs.core.reset_BANG_ = (function reset_BANG_(a,new_value){
var temp__3698__auto____4360 = a.validator;

if(cljs.core.truth_(temp__3698__auto____4360))
{var validate__4361 = temp__3698__auto____4360;

if(cljs.core.truth_(validate__4361.call(null,new_value)))
{} else
{throw (new Error(cljs.core.str.call(null,"Assert failed: ","Validator rejected reference state","\n",cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'validate","\uFDD1'new-value"),cljs.core.hash_map("\uFDD0'line",3072))))));
}
} else
{}
var old_value__4362 = a.state;

a.state = new_value;
cljs.core._notify_watches.call(null,a,old_value__4362,new_value);
return new_value;
});
/**
* Atomically swaps the value of atom to be:
* (apply f current-value-of-atom args). Note that f may be called
* multiple times, and thus should be free of side effects.  Returns
* the value that was swapped in.
* @param {...*} var_args
*/
cljs.core.swap_BANG_ = (function() {
var swap_BANG_ = null;
var swap_BANG___4363 = (function (a,f){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state));
});
var swap_BANG___4364 = (function (a,f,x){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x));
});
var swap_BANG___4365 = (function (a,f,x,y){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x,y));
});
var swap_BANG___4366 = (function (a,f,x,y,z){
return cljs.core.reset_BANG_.call(null,a,f.call(null,a.state,x,y,z));
});
var swap_BANG___4367 = (function() { 
var G__4369__delegate = function (a,f,x,y,z,more){
return cljs.core.reset_BANG_.call(null,a,cljs.core.apply.call(null,f,a.state,x,y,z,more));
};
var G__4369 = function (a,f,x,y,z,var_args){
var more = null;
if (goog.isDef(var_args)) {
  more = cljs.core.array_seq(Array.prototype.slice.call(arguments, 5),0);
} 
return G__4369__delegate.call(this, a, f, x, y, z, more);
};
G__4369.cljs$lang$maxFixedArity = 5;
G__4369.cljs$lang$applyTo = (function (arglist__4370){
var a = cljs.core.first(arglist__4370);
var f = cljs.core.first(cljs.core.next(arglist__4370));
var x = cljs.core.first(cljs.core.next(cljs.core.next(arglist__4370)));
var y = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(arglist__4370))));
var z = cljs.core.first(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__4370)))));
var more = cljs.core.rest(cljs.core.next(cljs.core.next(cljs.core.next(cljs.core.next(arglist__4370)))));
return G__4369__delegate.call(this, a, f, x, y, z, more);
});
return G__4369;
})()
;
swap_BANG_ = function(a,f,x,y,z,var_args){
var more = var_args;
switch(arguments.length){
case  2 :
return swap_BANG___4363.call(this,a,f);
case  3 :
return swap_BANG___4364.call(this,a,f,x);
case  4 :
return swap_BANG___4365.call(this,a,f,x,y);
case  5 :
return swap_BANG___4366.call(this,a,f,x,y,z);
default:
return swap_BANG___4367.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
swap_BANG_.cljs$lang$maxFixedArity = 5;
swap_BANG_.cljs$lang$applyTo = swap_BANG___4367.cljs$lang$applyTo;
return swap_BANG_;
})()
;
/**
* Atomically sets the value of atom to newval if and only if the
* current value of the atom is identical to oldval. Returns true if
* set happened, else false.
*/
cljs.core.compare_and_set_BANG_ = (function compare_and_set_BANG_(a,oldval,newval){
if(cljs.core.truth_(cljs.core._EQ_.call(null,a.state,oldval)))
{cljs.core.reset_BANG_.call(null,a,newval);
return true;
} else
{return false;
}
});
cljs.core.deref = (function deref(o){
return cljs.core._deref.call(null,o);
});
/**
* Sets the validator-fn for an atom. validator-fn must be nil or a
* side-effect-free fn of one argument, which will be passed the intended
* new state on any state change. If the new state is unacceptable, the
* validator-fn should return false or throw an Error. If the current state
* is not acceptable to the new validator, an Error will be thrown and the
* validator will not be changed.
*/
cljs.core.set_validator_BANG_ = (function set_validator_BANG_(iref,val){
return iref.validator = val;
});
/**
* Gets the validator-fn for a var/ref/agent/atom.
*/
cljs.core.get_validator = (function get_validator(iref){
return iref.validator;
});
/**
* Atomically sets the metadata for a namespace/var/ref/agent/atom to be:
* 
* (apply f its-current-meta args)
* 
* f must be free of side-effects
* @param {...*} var_args
*/
cljs.core.alter_meta_BANG_ = (function() { 
var alter_meta_BANG___delegate = function (iref,f,args){
return iref.meta = cljs.core.apply.call(null,f,iref.meta,args);
};
var alter_meta_BANG_ = function (iref,f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 2),0);
} 
return alter_meta_BANG___delegate.call(this, iref, f, args);
};
alter_meta_BANG_.cljs$lang$maxFixedArity = 2;
alter_meta_BANG_.cljs$lang$applyTo = (function (arglist__4371){
var iref = cljs.core.first(arglist__4371);
var f = cljs.core.first(cljs.core.next(arglist__4371));
var args = cljs.core.rest(cljs.core.next(arglist__4371));
return alter_meta_BANG___delegate.call(this, iref, f, args);
});
return alter_meta_BANG_;
})()
;
/**
* Atomically resets the metadata for an atom
*/
cljs.core.reset_meta_BANG_ = (function reset_meta_BANG_(iref,m){
return iref.meta = m;
});
/**
* Alpha - subject to change.
* 
* Adds a watch function to an atom reference. The watch fn must be a
* fn of 4 args: a key, the reference, its old-state, its
* new-state. Whenever the reference's state might have been changed,
* any registered watches will have their functions called. The watch
* fn will be called synchronously. Note that an atom's state
* may have changed again prior to the fn call, so use old/new-state
* rather than derefing the reference. Keys must be unique per
* reference, and can be used to remove the watch with remove-watch,
* but are otherwise considered opaque by the watch mechanism.  Bear in
* mind that regardless of the result or action of the watch fns the
* atom's value will change.  Example:
* 
* (def a (atom 0))
* (add-watch a :inc (fn [k r o n] (assert (== 0 n))))
* (swap! a inc)
* ;; Assertion Error
* (deref a)
* ;=> 1
*/
cljs.core.add_watch = (function add_watch(iref,key,f){
return cljs.core._add_watch.call(null,iref,key,f);
});
/**
* Alpha - subject to change.
* 
* Removes a watch (set by add-watch) from a reference
*/
cljs.core.remove_watch = (function remove_watch(iref,key){
return cljs.core._remove_watch.call(null,iref,key);
});
cljs.core.gensym_counter = null;
/**
* Returns a new symbol with a unique name. If a prefix string is
* supplied, the name is prefix# where # is some unique number. If
* prefix is not supplied, the prefix is 'G__'.
*/
cljs.core.gensym = (function() {
var gensym = null;
var gensym__4372 = (function (){
return gensym.call(null,"G__");
});
var gensym__4373 = (function (prefix_string){
if(cljs.core.truth_((cljs.core.gensym_counter === null)))
{cljs.core.gensym_counter = cljs.core.atom.call(null,0);
} else
{}
return cljs.core.symbol.call(null,cljs.core.str.call(null,prefix_string,cljs.core.swap_BANG_.call(null,cljs.core.gensym_counter,cljs.core.inc)));
});
gensym = function(prefix_string){
switch(arguments.length){
case  0 :
return gensym__4372.call(this);
case  1 :
return gensym__4373.call(this,prefix_string);
}
throw('Invalid arity: ' + arguments.length);
};
return gensym;
})()
;
cljs.core.fixture1 = 1;
cljs.core.fixture2 = 2;

/**
* @constructor
*/
cljs.core.Delay = (function (f,state){
this.f = f;
this.state = state;
})
cljs.core.Delay.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.Delay");
});
cljs.core.Delay.prototype.cljs$core$IPending$ = true;
cljs.core.Delay.prototype.cljs$core$IPending$_realized_QMARK_ = (function (d){
var this__4375 = this;
return cljs.core.not.call(null,(cljs.core.deref.call(null,this__4375.state) === null));
});
cljs.core.Delay.prototype.cljs$core$IDeref$ = true;
cljs.core.Delay.prototype.cljs$core$IDeref$_deref = (function (_){
var this__4376 = this;
if(cljs.core.truth_(cljs.core.deref.call(null,this__4376.state)))
{} else
{cljs.core.swap_BANG_.call(null,this__4376.state,this__4376.f);
}
return cljs.core.deref.call(null,this__4376.state);
});
cljs.core.Delay;
/**
* Takes a body of expressions and yields a Delay object that will
* invoke the body only the first time it is forced (with force or deref/@), and
* will cache the result and return it on all subsequent force
* calls.
* @param {...*} var_args
*/
cljs.core.delay = (function() { 
var delay__delegate = function (body){
return (new cljs.core.Delay((function (){
return cljs.core.apply.call(null,cljs.core.identity,body);
}),cljs.core.atom.call(null,null)));
};
var delay = function (var_args){
var body = null;
if (goog.isDef(var_args)) {
  body = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return delay__delegate.call(this, body);
};
delay.cljs$lang$maxFixedArity = 0;
delay.cljs$lang$applyTo = (function (arglist__4377){
var body = cljs.core.seq( arglist__4377 );;
return delay__delegate.call(this, body);
});
return delay;
})()
;
/**
* returns true if x is a Delay created with delay
*/
cljs.core.delay_QMARK_ = (function delay_QMARK_(x){
return cljs.core.instance_QMARK_.call(null,cljs.core.Delay,x);
});
/**
* If x is a Delay, returns the (possibly cached) value of its expression, else returns x
*/
cljs.core.force = (function force(x){
if(cljs.core.truth_(cljs.core.delay_QMARK_.call(null,x)))
{return cljs.core.deref.call(null,x);
} else
{return x;
}
});
/**
* Returns true if a value has been produced for a promise, delay, future or lazy sequence.
*/
cljs.core.realized_QMARK_ = (function realized_QMARK_(d){
return cljs.core._realized_QMARK_.call(null,d);
});
/**
* Recursively transforms JavaScript arrays into ClojureScript
* vectors, and JavaScript objects into ClojureScript maps.  With
* option ':keywordize-keys true' will convert object fields from
* strings to keywords.
* @param {...*} var_args
*/
cljs.core.js__GT_clj = (function() { 
var js__GT_clj__delegate = function (x,options){
var map__4378__4379 = options;
var map__4378__4380 = (cljs.core.truth_(cljs.core.seq_QMARK_.call(null,map__4378__4379))?cljs.core.apply.call(null,cljs.core.hash_map,map__4378__4379):map__4378__4379);
var keywordize_keys__4381 = cljs.core.get.call(null,map__4378__4380,"\uFDD0'keywordize-keys");
var keyfn__4382 = (cljs.core.truth_(keywordize_keys__4381)?cljs.core.keyword:cljs.core.str);
var f__4388 = (function thisfn(x){
if(cljs.core.truth_(cljs.core.seq_QMARK_.call(null,x)))
{return cljs.core.doall.call(null,cljs.core.map.call(null,thisfn,x));
} else
{if(cljs.core.truth_(cljs.core.coll_QMARK_.call(null,x)))
{return cljs.core.into.call(null,cljs.core.empty.call(null,x),cljs.core.map.call(null,thisfn,x));
} else
{if(cljs.core.truth_(goog.isArray.call(null,x)))
{return cljs.core.vec.call(null,cljs.core.map.call(null,thisfn,x));
} else
{if(cljs.core.truth_(goog.isObject.call(null,x)))
{return cljs.core.into.call(null,cljs.core.ObjMap.fromObject([],{}),(function (){var iter__416__auto____4387 = (function iter__4383(s__4384){
return (new cljs.core.LazySeq(null,false,(function (){
var s__4384__4385 = s__4384;

while(true){
if(cljs.core.truth_(cljs.core.seq.call(null,s__4384__4385)))
{var k__4386 = cljs.core.first.call(null,s__4384__4385);

return cljs.core.cons.call(null,cljs.core.Vector.fromArray([keyfn__4382.call(null,k__4386),thisfn.call(null,(x[k__4386]))]),iter__4383.call(null,cljs.core.rest.call(null,s__4384__4385)));
} else
{return null;
}
break;
}
})));
});

return iter__416__auto____4387.call(null,cljs.core.js_keys.call(null,x));
})());
} else
{if(cljs.core.truth_("\uFDD0'else"))
{return x;
} else
{return null;
}
}
}
}
}
});

return f__4388.call(null,x);
};
var js__GT_clj = function (x,var_args){
var options = null;
if (goog.isDef(var_args)) {
  options = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return js__GT_clj__delegate.call(this, x, options);
};
js__GT_clj.cljs$lang$maxFixedArity = 1;
js__GT_clj.cljs$lang$applyTo = (function (arglist__4389){
var x = cljs.core.first(arglist__4389);
var options = cljs.core.rest(arglist__4389);
return js__GT_clj__delegate.call(this, x, options);
});
return js__GT_clj;
})()
;
/**
* Returns a memoized version of a referentially transparent function. The
* memoized version of the function keeps a cache of the mapping from arguments
* to results and, when calls with the same arguments are repeated often, has
* higher performance at the expense of higher memory use.
*/
cljs.core.memoize = (function memoize(f){
var mem__4390 = cljs.core.atom.call(null,cljs.core.ObjMap.fromObject([],{}));

return (function() { 
var G__4394__delegate = function (args){
var temp__3695__auto____4391 = cljs.core.get.call(null,cljs.core.deref.call(null,mem__4390),args);

if(cljs.core.truth_(temp__3695__auto____4391))
{var v__4392 = temp__3695__auto____4391;

return v__4392;
} else
{var ret__4393 = cljs.core.apply.call(null,f,args);

cljs.core.swap_BANG_.call(null,mem__4390,cljs.core.assoc,args,ret__4393);
return ret__4393;
}
};
var G__4394 = function (var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 0),0);
} 
return G__4394__delegate.call(this, args);
};
G__4394.cljs$lang$maxFixedArity = 0;
G__4394.cljs$lang$applyTo = (function (arglist__4395){
var args = cljs.core.seq( arglist__4395 );;
return G__4394__delegate.call(this, args);
});
return G__4394;
})()
;
});
/**
* trampoline can be used to convert algorithms requiring mutual
* recursion without stack consumption. Calls f with supplied args, if
* any. If f returns a fn, calls that fn with no arguments, and
* continues to repeat, until the return value is not a fn, then
* returns that non-fn value. Note that if you want to return a fn as a
* final value, you must wrap it in some data structure and unpack it
* after trampoline returns.
* @param {...*} var_args
*/
cljs.core.trampoline = (function() {
var trampoline = null;
var trampoline__4397 = (function (f){
while(true){
var ret__4396 = f.call(null);

if(cljs.core.truth_(cljs.core.fn_QMARK_.call(null,ret__4396)))
{{
var G__4400 = ret__4396;
f = G__4400;
continue;
}
} else
{return ret__4396;
}
break;
}
});
var trampoline__4398 = (function() { 
var G__4401__delegate = function (f,args){
return trampoline.call(null,(function (){
return cljs.core.apply.call(null,f,args);
}));
};
var G__4401 = function (f,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__4401__delegate.call(this, f, args);
};
G__4401.cljs$lang$maxFixedArity = 1;
G__4401.cljs$lang$applyTo = (function (arglist__4402){
var f = cljs.core.first(arglist__4402);
var args = cljs.core.rest(arglist__4402);
return G__4401__delegate.call(this, f, args);
});
return G__4401;
})()
;
trampoline = function(f,var_args){
var args = var_args;
switch(arguments.length){
case  1 :
return trampoline__4397.call(this,f);
default:
return trampoline__4398.apply(this,arguments);
}
throw('Invalid arity: ' + arguments.length);
};
trampoline.cljs$lang$maxFixedArity = 1;
trampoline.cljs$lang$applyTo = trampoline__4398.cljs$lang$applyTo;
return trampoline;
})()
;
/**
* Returns a random floating point number between 0 (inclusive) and
* n (default 1) (exclusive).
*/
cljs.core.rand = (function() {
var rand = null;
var rand__4403 = (function (){
return rand.call(null,1);
});
var rand__4404 = (function (n){
return Math.random() * n;
});
rand = function(n){
switch(arguments.length){
case  0 :
return rand__4403.call(this);
case  1 :
return rand__4404.call(this,n);
}
throw('Invalid arity: ' + arguments.length);
};
return rand;
})()
;
/**
* Returns a random integer between 0 (inclusive) and n (exclusive).
*/
cljs.core.rand_int = (function rand_int(n){
return Math.floor(Math.random() * n);
});
/**
* Return a random element of the (sequential) collection. Will have
* the same performance characteristics as nth for the given
* collection.
*/
cljs.core.rand_nth = (function rand_nth(coll){
return cljs.core.nth.call(null,coll,cljs.core.rand_int.call(null,cljs.core.count.call(null,coll)));
});
/**
* Returns a map of the elements of coll keyed by the result of
* f on each element. The value at each key will be a vector of the
* corresponding elements, in the order they appeared in coll.
*/
cljs.core.group_by = (function group_by(f,coll){
return cljs.core.reduce.call(null,(function (ret,x){
var k__4406 = f.call(null,x);

return cljs.core.assoc.call(null,ret,k__4406,cljs.core.conj.call(null,cljs.core.get.call(null,ret,k__4406,cljs.core.Vector.fromArray([])),x));
}),cljs.core.ObjMap.fromObject([],{}),coll);
});
/**
* Creates a hierarchy object for use with derive, isa? etc.
*/
cljs.core.make_hierarchy = (function make_hierarchy(){
return cljs.core.ObjMap.fromObject(["\uFDD0'parents","\uFDD0'descendants","\uFDD0'ancestors"],{"\uFDD0'parents":cljs.core.ObjMap.fromObject([],{}),"\uFDD0'descendants":cljs.core.ObjMap.fromObject([],{}),"\uFDD0'ancestors":cljs.core.ObjMap.fromObject([],{})});
});
cljs.core.global_hierarchy = cljs.core.atom.call(null,cljs.core.make_hierarchy.call(null));
/**
* Returns true if (= child parent), or child is directly or indirectly derived from
* parent, either via a Java type inheritance relationship or a
* relationship established via derive. h must be a hierarchy obtained
* from make-hierarchy, if not supplied defaults to the global
* hierarchy
*/
cljs.core.isa_QMARK_ = (function() {
var isa_QMARK_ = null;
var isa_QMARK___4415 = (function (child,parent){
return isa_QMARK_.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),child,parent);
});
var isa_QMARK___4416 = (function (h,child,parent){
var or__3548__auto____4407 = cljs.core._EQ_.call(null,child,parent);

if(cljs.core.truth_(or__3548__auto____4407))
{return or__3548__auto____4407;
} else
{var or__3548__auto____4408 = cljs.core.contains_QMARK_.call(null,"\uFDD0'ancestors".call(null,h).call(null,child),parent);

if(cljs.core.truth_(or__3548__auto____4408))
{return or__3548__auto____4408;
} else
{var and__3546__auto____4409 = cljs.core.vector_QMARK_.call(null,parent);

if(cljs.core.truth_(and__3546__auto____4409))
{var and__3546__auto____4410 = cljs.core.vector_QMARK_.call(null,child);

if(cljs.core.truth_(and__3546__auto____4410))
{var and__3546__auto____4411 = cljs.core._EQ_.call(null,cljs.core.count.call(null,parent),cljs.core.count.call(null,child));

if(cljs.core.truth_(and__3546__auto____4411))
{var ret__4412 = true;
var i__4413 = 0;

while(true){
if(cljs.core.truth_((function (){var or__3548__auto____4414 = cljs.core.not.call(null,ret__4412);

if(cljs.core.truth_(or__3548__auto____4414))
{return or__3548__auto____4414;
} else
{return cljs.core._EQ_.call(null,i__4413,cljs.core.count.call(null,parent));
}
})()))
{return ret__4412;
} else
{{
var G__4418 = isa_QMARK_.call(null,h,child.call(null,i__4413),parent.call(null,i__4413));
var G__4419 = (i__4413 + 1);
ret__4412 = G__4418;
i__4413 = G__4419;
continue;
}
}
break;
}
} else
{return and__3546__auto____4411;
}
} else
{return and__3546__auto____4410;
}
} else
{return and__3546__auto____4409;
}
}
}
});
isa_QMARK_ = function(h,child,parent){
switch(arguments.length){
case  2 :
return isa_QMARK___4415.call(this,h,child);
case  3 :
return isa_QMARK___4416.call(this,h,child,parent);
}
throw('Invalid arity: ' + arguments.length);
};
return isa_QMARK_;
})()
;
/**
* Returns the immediate parents of tag, either via a Java type
* inheritance relationship or a relationship established via derive. h
* must be a hierarchy obtained from make-hierarchy, if not supplied
* defaults to the global hierarchy
*/
cljs.core.parents = (function() {
var parents = null;
var parents__4420 = (function (tag){
return parents.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var parents__4421 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'parents".call(null,h),tag));
});
parents = function(h,tag){
switch(arguments.length){
case  1 :
return parents__4420.call(this,h);
case  2 :
return parents__4421.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
return parents;
})()
;
/**
* Returns the immediate and indirect parents of tag, either via a Java type
* inheritance relationship or a relationship established via derive. h
* must be a hierarchy obtained from make-hierarchy, if not supplied
* defaults to the global hierarchy
*/
cljs.core.ancestors = (function() {
var ancestors = null;
var ancestors__4423 = (function (tag){
return ancestors.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var ancestors__4424 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'ancestors".call(null,h),tag));
});
ancestors = function(h,tag){
switch(arguments.length){
case  1 :
return ancestors__4423.call(this,h);
case  2 :
return ancestors__4424.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
return ancestors;
})()
;
/**
* Returns the immediate and indirect children of tag, through a
* relationship established via derive. h must be a hierarchy obtained
* from make-hierarchy, if not supplied defaults to the global
* hierarchy. Note: does not work on Java type inheritance
* relationships.
*/
cljs.core.descendants = (function() {
var descendants = null;
var descendants__4426 = (function (tag){
return descendants.call(null,cljs.core.deref.call(null,cljs.core.global_hierarchy),tag);
});
var descendants__4427 = (function (h,tag){
return cljs.core.not_empty.call(null,cljs.core.get.call(null,"\uFDD0'descendants".call(null,h),tag));
});
descendants = function(h,tag){
switch(arguments.length){
case  1 :
return descendants__4426.call(this,h);
case  2 :
return descendants__4427.call(this,h,tag);
}
throw('Invalid arity: ' + arguments.length);
};
return descendants;
})()
;
/**
* Establishes a parent/child relationship between parent and
* tag. Parent must be a namespace-qualified symbol or keyword and
* child can be either a namespace-qualified symbol or keyword or a
* class. h must be a hierarchy obtained from make-hierarchy, if not
* supplied defaults to, and modifies, the global hierarchy.
*/
cljs.core.derive = (function() {
var derive = null;
var derive__4437 = (function (tag,parent){
if(cljs.core.truth_(cljs.core.namespace.call(null,parent)))
{} else
{throw (new Error(cljs.core.str.call(null,"Assert failed: ",cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'namespace","\uFDD1'parent"),cljs.core.hash_map("\uFDD0'line",3364))))));
}
cljs.core.swap_BANG_.call(null,cljs.core.global_hierarchy,derive,tag,parent);
return null;
});
var derive__4438 = (function (h,tag,parent){
if(cljs.core.truth_(cljs.core.not_EQ_.call(null,tag,parent)))
{} else
{throw (new Error(cljs.core.str.call(null,"Assert failed: ",cljs.core.pr_str.call(null,cljs.core.with_meta(cljs.core.list("\uFDD1'not=","\uFDD1'tag","\uFDD1'parent"),cljs.core.hash_map("\uFDD0'line",3368))))));
}
var tp__4432 = "\uFDD0'parents".call(null,h);
var td__4433 = "\uFDD0'descendants".call(null,h);
var ta__4434 = "\uFDD0'ancestors".call(null,h);
var tf__4435 = (function (m,source,sources,target,targets){
return cljs.core.reduce.call(null,(function (ret,k){
return cljs.core.assoc.call(null,ret,k,cljs.core.reduce.call(null,cljs.core.conj,cljs.core.get.call(null,targets,k,cljs.core.set([])),cljs.core.cons.call(null,target,targets.call(null,target))));
}),m,cljs.core.cons.call(null,source,sources.call(null,source)));
});

var or__3548__auto____4436 = (cljs.core.truth_(cljs.core.contains_QMARK_.call(null,tp__4432.call(null,tag),parent))?null:(function (){if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,ta__4434.call(null,tag),parent)))
{throw (new Error(cljs.core.str.call(null,tag,"already has",parent,"as ancestor")));
} else
{}
if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,ta__4434.call(null,parent),tag)))
{throw (new Error(cljs.core.str.call(null,"Cyclic derivation:",parent,"has",tag,"as ancestor")));
} else
{}
return cljs.core.ObjMap.fromObject(["\uFDD0'parents","\uFDD0'ancestors","\uFDD0'descendants"],{"\uFDD0'parents":cljs.core.assoc.call(null,"\uFDD0'parents".call(null,h),tag,cljs.core.conj.call(null,cljs.core.get.call(null,tp__4432,tag,cljs.core.set([])),parent)),"\uFDD0'ancestors":tf__4435.call(null,"\uFDD0'ancestors".call(null,h),tag,td__4433,parent,ta__4434),"\uFDD0'descendants":tf__4435.call(null,"\uFDD0'descendants".call(null,h),parent,ta__4434,tag,td__4433)});
})());

if(cljs.core.truth_(or__3548__auto____4436))
{return or__3548__auto____4436;
} else
{return h;
}
});
derive = function(h,tag,parent){
switch(arguments.length){
case  2 :
return derive__4437.call(this,h,tag);
case  3 :
return derive__4438.call(this,h,tag,parent);
}
throw('Invalid arity: ' + arguments.length);
};
return derive;
})()
;
/**
* Removes a parent/child relationship between parent and
* tag. h must be a hierarchy obtained from make-hierarchy, if not
* supplied defaults to, and modifies, the global hierarchy.
*/
cljs.core.underive = (function() {
var underive = null;
var underive__4444 = (function (tag,parent){
cljs.core.swap_BANG_.call(null,cljs.core.global_hierarchy,underive,tag,parent);
return null;
});
var underive__4445 = (function (h,tag,parent){
var parentMap__4440 = "\uFDD0'parents".call(null,h);
var childsParents__4441 = (cljs.core.truth_(parentMap__4440.call(null,tag))?cljs.core.disj.call(null,parentMap__4440.call(null,tag),parent):cljs.core.set([]));
var newParents__4442 = (cljs.core.truth_(cljs.core.not_empty.call(null,childsParents__4441))?cljs.core.assoc.call(null,parentMap__4440,tag,childsParents__4441):cljs.core.dissoc.call(null,parentMap__4440,tag));
var deriv_seq__4443 = cljs.core.flatten.call(null,cljs.core.map.call(null,(function (p1__4429_SHARP_){
return cljs.core.cons.call(null,cljs.core.first.call(null,p1__4429_SHARP_),cljs.core.interpose.call(null,cljs.core.first.call(null,p1__4429_SHARP_),cljs.core.second.call(null,p1__4429_SHARP_)));
}),cljs.core.seq.call(null,newParents__4442)));

if(cljs.core.truth_(cljs.core.contains_QMARK_.call(null,parentMap__4440.call(null,tag),parent)))
{return cljs.core.reduce.call(null,(function (p1__4430_SHARP_,p2__4431_SHARP_){
return cljs.core.apply.call(null,cljs.core.derive,p1__4430_SHARP_,p2__4431_SHARP_);
}),cljs.core.make_hierarchy.call(null),cljs.core.partition.call(null,2,deriv_seq__4443));
} else
{return h;
}
});
underive = function(h,tag,parent){
switch(arguments.length){
case  2 :
return underive__4444.call(this,h,tag);
case  3 :
return underive__4445.call(this,h,tag,parent);
}
throw('Invalid arity: ' + arguments.length);
};
return underive;
})()
;
cljs.core.reset_cache = (function reset_cache(method_cache,method_table,cached_hierarchy,hierarchy){
cljs.core.swap_BANG_.call(null,method_cache,(function (_){
return cljs.core.deref.call(null,method_table);
}));
return cljs.core.swap_BANG_.call(null,cached_hierarchy,(function (_){
return cljs.core.deref.call(null,hierarchy);
}));
});
cljs.core.prefers_STAR_ = (function prefers_STAR_(x,y,prefer_table){
var xprefs__4447 = cljs.core.deref.call(null,prefer_table).call(null,x);

var or__3548__auto____4449 = (cljs.core.truth_((function (){var and__3546__auto____4448 = xprefs__4447;

if(cljs.core.truth_(and__3546__auto____4448))
{return xprefs__4447.call(null,y);
} else
{return and__3546__auto____4448;
}
})())?true:null);

if(cljs.core.truth_(or__3548__auto____4449))
{return or__3548__auto____4449;
} else
{var or__3548__auto____4451 = (function (){var ps__4450 = cljs.core.parents.call(null,y);

while(true){
if(cljs.core.truth_((cljs.core.count.call(null,ps__4450) > 0)))
{if(cljs.core.truth_(prefers_STAR_.call(null,x,cljs.core.first.call(null,ps__4450),prefer_table)))
{} else
{}
{
var G__4454 = cljs.core.rest.call(null,ps__4450);
ps__4450 = G__4454;
continue;
}
} else
{return null;
}
break;
}
})();

if(cljs.core.truth_(or__3548__auto____4451))
{return or__3548__auto____4451;
} else
{var or__3548__auto____4453 = (function (){var ps__4452 = cljs.core.parents.call(null,x);

while(true){
if(cljs.core.truth_((cljs.core.count.call(null,ps__4452) > 0)))
{if(cljs.core.truth_(prefers_STAR_.call(null,cljs.core.first.call(null,ps__4452),y,prefer_table)))
{} else
{}
{
var G__4455 = cljs.core.rest.call(null,ps__4452);
ps__4452 = G__4455;
continue;
}
} else
{return null;
}
break;
}
})();

if(cljs.core.truth_(or__3548__auto____4453))
{return or__3548__auto____4453;
} else
{return false;
}
}
}
});
cljs.core.dominates = (function dominates(x,y,prefer_table){
var or__3548__auto____4456 = cljs.core.prefers_STAR_.call(null,x,y,prefer_table);

if(cljs.core.truth_(or__3548__auto____4456))
{return or__3548__auto____4456;
} else
{return cljs.core.isa_QMARK_.call(null,x,y);
}
});
cljs.core.find_and_cache_best_method = (function find_and_cache_best_method(name,dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy){
var best_entry__4465 = cljs.core.reduce.call(null,(function (be,p__4457){
var vec__4458__4459 = p__4457;
var k__4460 = cljs.core.nth.call(null,vec__4458__4459,0,null);
var ___4461 = cljs.core.nth.call(null,vec__4458__4459,1,null);
var e__4462 = vec__4458__4459;

if(cljs.core.truth_(cljs.core.isa_QMARK_.call(null,dispatch_val,k__4460)))
{var be2__4464 = (cljs.core.truth_((function (){var or__3548__auto____4463 = (be === null);

if(cljs.core.truth_(or__3548__auto____4463))
{return or__3548__auto____4463;
} else
{return cljs.core.dominates.call(null,k__4460,cljs.core.first.call(null,be),prefer_table);
}
})())?e__4462:be);

if(cljs.core.truth_(cljs.core.dominates.call(null,cljs.core.first.call(null,be2__4464),k__4460,prefer_table)))
{} else
{throw (new Error(cljs.core.str.call(null,"Multiple methods in multimethod '",name,"' match dispatch value: ",dispatch_val," -> ",k__4460," and ",cljs.core.first.call(null,be2__4464),", and neither is preferred")));
}
return be2__4464;
} else
{return be;
}
}),null,cljs.core.deref.call(null,method_table));

if(cljs.core.truth_(best_entry__4465))
{if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.deref.call(null,cached_hierarchy),cljs.core.deref.call(null,hierarchy))))
{cljs.core.swap_BANG_.call(null,method_cache,cljs.core.assoc,dispatch_val,cljs.core.second.call(null,best_entry__4465));
return cljs.core.second.call(null,best_entry__4465);
} else
{cljs.core.reset_cache.call(null,method_cache,method_table,cached_hierarchy,hierarchy);
return find_and_cache_best_method.call(null,name,dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy);
}
} else
{return null;
}
});
cljs.core.IMultiFn = {};
cljs.core._reset = (function _reset(mf){
if(cljs.core.truth_((function (){var and__3546__auto____4466 = mf;

if(cljs.core.truth_(and__3546__auto____4466))
{return mf.cljs$core$IMultiFn$_reset;
} else
{return and__3546__auto____4466;
}
})()))
{return mf.cljs$core$IMultiFn$_reset(mf);
} else
{return (function (){var or__3548__auto____4467 = (cljs.core._reset[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4467))
{return or__3548__auto____4467;
} else
{var or__3548__auto____4468 = (cljs.core._reset["_"]);

if(cljs.core.truth_(or__3548__auto____4468))
{return or__3548__auto____4468;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-reset",mf);
}
}
})().call(null,mf);
}
});
cljs.core._add_method = (function _add_method(mf,dispatch_val,method){
if(cljs.core.truth_((function (){var and__3546__auto____4469 = mf;

if(cljs.core.truth_(and__3546__auto____4469))
{return mf.cljs$core$IMultiFn$_add_method;
} else
{return and__3546__auto____4469;
}
})()))
{return mf.cljs$core$IMultiFn$_add_method(mf,dispatch_val,method);
} else
{return (function (){var or__3548__auto____4470 = (cljs.core._add_method[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4470))
{return or__3548__auto____4470;
} else
{var or__3548__auto____4471 = (cljs.core._add_method["_"]);

if(cljs.core.truth_(or__3548__auto____4471))
{return or__3548__auto____4471;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-add-method",mf);
}
}
})().call(null,mf,dispatch_val,method);
}
});
cljs.core._remove_method = (function _remove_method(mf,dispatch_val){
if(cljs.core.truth_((function (){var and__3546__auto____4472 = mf;

if(cljs.core.truth_(and__3546__auto____4472))
{return mf.cljs$core$IMultiFn$_remove_method;
} else
{return and__3546__auto____4472;
}
})()))
{return mf.cljs$core$IMultiFn$_remove_method(mf,dispatch_val);
} else
{return (function (){var or__3548__auto____4473 = (cljs.core._remove_method[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4473))
{return or__3548__auto____4473;
} else
{var or__3548__auto____4474 = (cljs.core._remove_method["_"]);

if(cljs.core.truth_(or__3548__auto____4474))
{return or__3548__auto____4474;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-remove-method",mf);
}
}
})().call(null,mf,dispatch_val);
}
});
cljs.core._prefer_method = (function _prefer_method(mf,dispatch_val,dispatch_val_y){
if(cljs.core.truth_((function (){var and__3546__auto____4475 = mf;

if(cljs.core.truth_(and__3546__auto____4475))
{return mf.cljs$core$IMultiFn$_prefer_method;
} else
{return and__3546__auto____4475;
}
})()))
{return mf.cljs$core$IMultiFn$_prefer_method(mf,dispatch_val,dispatch_val_y);
} else
{return (function (){var or__3548__auto____4476 = (cljs.core._prefer_method[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4476))
{return or__3548__auto____4476;
} else
{var or__3548__auto____4477 = (cljs.core._prefer_method["_"]);

if(cljs.core.truth_(or__3548__auto____4477))
{return or__3548__auto____4477;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-prefer-method",mf);
}
}
})().call(null,mf,dispatch_val,dispatch_val_y);
}
});
cljs.core._get_method = (function _get_method(mf,dispatch_val){
if(cljs.core.truth_((function (){var and__3546__auto____4478 = mf;

if(cljs.core.truth_(and__3546__auto____4478))
{return mf.cljs$core$IMultiFn$_get_method;
} else
{return and__3546__auto____4478;
}
})()))
{return mf.cljs$core$IMultiFn$_get_method(mf,dispatch_val);
} else
{return (function (){var or__3548__auto____4479 = (cljs.core._get_method[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4479))
{return or__3548__auto____4479;
} else
{var or__3548__auto____4480 = (cljs.core._get_method["_"]);

if(cljs.core.truth_(or__3548__auto____4480))
{return or__3548__auto____4480;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-get-method",mf);
}
}
})().call(null,mf,dispatch_val);
}
});
cljs.core._methods = (function _methods(mf){
if(cljs.core.truth_((function (){var and__3546__auto____4481 = mf;

if(cljs.core.truth_(and__3546__auto____4481))
{return mf.cljs$core$IMultiFn$_methods;
} else
{return and__3546__auto____4481;
}
})()))
{return mf.cljs$core$IMultiFn$_methods(mf);
} else
{return (function (){var or__3548__auto____4482 = (cljs.core._methods[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4482))
{return or__3548__auto____4482;
} else
{var or__3548__auto____4483 = (cljs.core._methods["_"]);

if(cljs.core.truth_(or__3548__auto____4483))
{return or__3548__auto____4483;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-methods",mf);
}
}
})().call(null,mf);
}
});
cljs.core._prefers = (function _prefers(mf){
if(cljs.core.truth_((function (){var and__3546__auto____4484 = mf;

if(cljs.core.truth_(and__3546__auto____4484))
{return mf.cljs$core$IMultiFn$_prefers;
} else
{return and__3546__auto____4484;
}
})()))
{return mf.cljs$core$IMultiFn$_prefers(mf);
} else
{return (function (){var or__3548__auto____4485 = (cljs.core._prefers[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4485))
{return or__3548__auto____4485;
} else
{var or__3548__auto____4486 = (cljs.core._prefers["_"]);

if(cljs.core.truth_(or__3548__auto____4486))
{return or__3548__auto____4486;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-prefers",mf);
}
}
})().call(null,mf);
}
});
cljs.core._dispatch = (function _dispatch(mf,args){
if(cljs.core.truth_((function (){var and__3546__auto____4487 = mf;

if(cljs.core.truth_(and__3546__auto____4487))
{return mf.cljs$core$IMultiFn$_dispatch;
} else
{return and__3546__auto____4487;
}
})()))
{return mf.cljs$core$IMultiFn$_dispatch(mf,args);
} else
{return (function (){var or__3548__auto____4488 = (cljs.core._dispatch[goog.typeOf.call(null,mf)]);

if(cljs.core.truth_(or__3548__auto____4488))
{return or__3548__auto____4488;
} else
{var or__3548__auto____4489 = (cljs.core._dispatch["_"]);

if(cljs.core.truth_(or__3548__auto____4489))
{return or__3548__auto____4489;
} else
{throw cljs.core.missing_protocol.call(null,"IMultiFn.-dispatch",mf);
}
}
})().call(null,mf,args);
}
});
cljs.core.do_dispatch = (function do_dispatch(mf,dispatch_fn,args){
var dispatch_val__4490 = cljs.core.apply.call(null,dispatch_fn,args);
var target_fn__4491 = cljs.core._get_method.call(null,mf,dispatch_val__4490);

if(cljs.core.truth_(target_fn__4491))
{} else
{throw (new Error(cljs.core.str.call(null,"No method in multimethod '",cljs.core.name,"' for dispatch value: ",dispatch_val__4490)));
}
return cljs.core.apply.call(null,target_fn__4491,args);
});

/**
* @constructor
*/
cljs.core.MultiFn = (function (name,dispatch_fn,default_dispatch_val,hierarchy,method_table,prefer_table,method_cache,cached_hierarchy){
this.name = name;
this.dispatch_fn = dispatch_fn;
this.default_dispatch_val = default_dispatch_val;
this.hierarchy = hierarchy;
this.method_table = method_table;
this.prefer_table = prefer_table;
this.method_cache = method_cache;
this.cached_hierarchy = cached_hierarchy;
})
cljs.core.MultiFn.cljs$core$IPrintable$_pr_seq = (function (this__267__auto__){
return cljs.core.list.call(null,"cljs.core.MultiFn");
});
cljs.core.MultiFn.prototype.cljs$core$IHash$ = true;
cljs.core.MultiFn.prototype.cljs$core$IHash$_hash = (function (this$){
var this__4492 = this;
return goog.getUid.call(null,this$);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$ = true;
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_reset = (function (mf){
var this__4493 = this;
cljs.core.swap_BANG_.call(null,this__4493.method_table,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__4493.method_cache,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__4493.prefer_table,(function (mf){
return cljs.core.ObjMap.fromObject([],{});
}));
cljs.core.swap_BANG_.call(null,this__4493.cached_hierarchy,(function (mf){
return null;
}));
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_add_method = (function (mf,dispatch_val,method){
var this__4494 = this;
cljs.core.swap_BANG_.call(null,this__4494.method_table,cljs.core.assoc,dispatch_val,method);
cljs.core.reset_cache.call(null,this__4494.method_cache,this__4494.method_table,this__4494.cached_hierarchy,this__4494.hierarchy);
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_remove_method = (function (mf,dispatch_val){
var this__4495 = this;
cljs.core.swap_BANG_.call(null,this__4495.method_table,cljs.core.dissoc,dispatch_val);
cljs.core.reset_cache.call(null,this__4495.method_cache,this__4495.method_table,this__4495.cached_hierarchy,this__4495.hierarchy);
return mf;
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_get_method = (function (mf,dispatch_val){
var this__4496 = this;
if(cljs.core.truth_(cljs.core._EQ_.call(null,cljs.core.deref.call(null,this__4496.cached_hierarchy),cljs.core.deref.call(null,this__4496.hierarchy))))
{} else
{cljs.core.reset_cache.call(null,this__4496.method_cache,this__4496.method_table,this__4496.cached_hierarchy,this__4496.hierarchy);
}
var temp__3695__auto____4497 = cljs.core.deref.call(null,this__4496.method_cache).call(null,dispatch_val);

if(cljs.core.truth_(temp__3695__auto____4497))
{var target_fn__4498 = temp__3695__auto____4497;

return target_fn__4498;
} else
{var temp__3695__auto____4499 = cljs.core.find_and_cache_best_method.call(null,this__4496.name,dispatch_val,this__4496.hierarchy,this__4496.method_table,this__4496.prefer_table,this__4496.method_cache,this__4496.cached_hierarchy);

if(cljs.core.truth_(temp__3695__auto____4499))
{var target_fn__4500 = temp__3695__auto____4499;

return target_fn__4500;
} else
{return cljs.core.deref.call(null,this__4496.method_table).call(null,this__4496.default_dispatch_val);
}
}
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefer_method = (function (mf,dispatch_val_x,dispatch_val_y){
var this__4501 = this;
if(cljs.core.truth_(cljs.core.prefers_STAR_.call(null,dispatch_val_x,dispatch_val_y,this__4501.prefer_table)))
{throw (new Error(cljs.core.str.call(null,"Preference conflict in multimethod '",this__4501.name,"': ",dispatch_val_y," is already preferred to ",dispatch_val_x)));
} else
{}
cljs.core.swap_BANG_.call(null,this__4501.prefer_table,(function (old){
return cljs.core.assoc.call(null,old,dispatch_val_x,cljs.core.conj.call(null,cljs.core.get.call(null,old,dispatch_val_x,cljs.core.set([])),dispatch_val_y));
}));
return cljs.core.reset_cache.call(null,this__4501.method_cache,this__4501.method_table,this__4501.cached_hierarchy,this__4501.hierarchy);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_methods = (function (mf){
var this__4502 = this;
return cljs.core.deref.call(null,this__4502.method_table);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_prefers = (function (mf){
var this__4503 = this;
return cljs.core.deref.call(null,this__4503.prefer_table);
});
cljs.core.MultiFn.prototype.cljs$core$IMultiFn$_dispatch = (function (mf,args){
var this__4504 = this;
return cljs.core.do_dispatch.call(null,mf,this__4504.dispatch_fn,args);
});
cljs.core.MultiFn;
cljs.core.MultiFn.prototype.call = (function() { 
var G__4505__delegate = function (_,args){
return cljs.core._dispatch.call(null,this,args);
};
var G__4505 = function (_,var_args){
var args = null;
if (goog.isDef(var_args)) {
  args = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);
} 
return G__4505__delegate.call(this, _, args);
};
G__4505.cljs$lang$maxFixedArity = 1;
G__4505.cljs$lang$applyTo = (function (arglist__4506){
var _ = cljs.core.first(arglist__4506);
var args = cljs.core.rest(arglist__4506);
return G__4505__delegate.call(this, _, args);
});
return G__4505;
})()
;
cljs.core.MultiFn.prototype.apply = (function (_,args){
return cljs.core._dispatch.call(null,this,args);
});
/**
* Removes all of the methods of multimethod.
*/
cljs.core.remove_all_methods = (function remove_all_methods(multifn){
return cljs.core._reset.call(null,multifn);
});
/**
* Removes the method of multimethod associated with dispatch-value.
*/
cljs.core.remove_method = (function remove_method(multifn,dispatch_val){
return cljs.core._remove_method.call(null,multifn,dispatch_val);
});
/**
* Causes the multimethod to prefer matches of dispatch-val-x over dispatch-val-y
* when there is a conflict
*/
cljs.core.prefer_method = (function prefer_method(multifn,dispatch_val_x,dispatch_val_y){
return cljs.core._prefer_method.call(null,multifn,dispatch_val_x,dispatch_val_y);
});
/**
* Given a multimethod, returns a map of dispatch values -> dispatch fns
*/
cljs.core.methods$ = (function methods$(multifn){
return cljs.core._methods.call(null,multifn);
});
/**
* Given a multimethod and a dispatch value, returns the dispatch fn
* that would apply to that value, or nil if none apply and no default
*/
cljs.core.get_method = (function get_method(multifn,dispatch_val){
return cljs.core._get_method.call(null,multifn,dispatch_val);
});
/**
* Given a multimethod, returns a map of preferred value -> set of other values
*/
cljs.core.prefers = (function prefers(multifn){
return cljs.core._prefers.call(null,multifn);
});
