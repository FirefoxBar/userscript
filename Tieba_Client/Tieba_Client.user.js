;(function($,UW){
    const
        BDUSS = "",
        SIGN_KEY = "tiebaclient!!!",
        pd = UW.PageData;
        kw = pd.forum.name || pd.forum.forum_name,
        fid = pd.forum.id || pd.forum.forum_id,
        tbs = pd.tbs,
        tid = pd.hasOwnProperty("thread") ? pd.thread.thread_id : "",
        fontFamily = ["微软雅黑","黑体","宋体","楷体","仿宋"],
        threadURL = "http://c.tieba.baidu.com/c/c/thread/add",
        postURL = "http://c.tieba.baidu.com/c/c/post/add";
        
    var
        dataURL,
        tail_content,
		offY = 0,
        colorFlag = 0,
        isHome = tid ? true : false,
        clientType = 2,
        typeface = fontFamily[0];
    
    const smiley = {
        "i_f01.png":"#(呵呵)","i_f02.png":"#(哈哈)","i_f03.png":"#(吐舌)",
        "i_f04.png":"#(啊)","i_f05.png":"#(酷)","i_f06.png":"#(怒)",
        "i_f07.png":"#(开心)","i_f08.png":"#(汗)","i_f09.png":"#(泪)",
        "i_f10.png":"#(黑线)","i_f11.png":"#(鄙视)","i_f12.png":"#(不高兴)",
        "i_f13.png":"#(真棒)","i_f14.png":"#(钱)","i_f15.png":"#(疑问)",
        "i_f16.png":"#(阴险)","i_f17.png":"#(吐)","i_f18.png":"#(咦)",
        "i_f19.png":"#(委屈)","i_f20.png":"#(花心)","i_f21.png":"#(呼~)",
        "i_f22.png":"#(笑眼)","i_f23.png":"#(冷)","i_f24.png":"#(太开心)",
        "i_f25.png":"#(滑稽)","i_f26.png":"#(勉强)","i_f27.png":"#(狂汗)",
        "i_f28.png":"#(乖)","i_f29.png":"#(睡觉)","i_f30.png":"#(惊哭)",
        "i_f31.png":"#(升起)","i_f32.png":"#(惊讶)","i_f33.png":"#(喷)",
        "i_f34.png":"#(爱心)","i_f35.png":"#(心碎)","i_f36.png":"#(玫瑰)",
        "i_f37.png":"#(礼物)","i_f38.png":"#(彩虹)","i_f39.png":"#(星星月亮)",
        "i_f40.png":"#(太阳)","i_f41.png":"#(钱币)","i_f42.png":"#(灯泡)",
        "i_f43.png":"#(茶杯)","i_f44.png":"#(蛋糕)","i_f45.png":"#(音乐)",
        "i_f46.png":"#(haha)","i_f47.png":"#(胜利)","i_f48.png":"#(大拇指)",
        "i_f49.png":"#(弱)","i_f50.png":"#(OK)"
    }
       
    const icon = {
        iPhone: "data:image/gif;base64,R0lGODlhJQAlAPcAAMrdxJrDimipTszhxW2vUpS9hHmuZMPcu4PFaHfBWYPHaajQmubv46zYncfkvm6kWmuuUPf69nO7VnC2VHW+WGWkTL7gs/f59r/UuOXt4uj05LXcqIm0eqDAlWmrT+bw48nbw+Dw29zn2GenTff79tDoyHG4VeXu42+0U8XluNbo0HjCWpS6h+707JbQfpnQhe7z7Pz++9js0ZHOed3q2fH57t7s2m2xUqPUkXOrXX7GYvD47bjTr6/RpKvVnMTfvIiyeZDOd3yrarbPrXvEXu/17Y7Md2+lW3GoXMHYueTu35HOeKbNmWOhStPiztPhzqzXnHaxYMPdu/v9+ufy5LvascLZuujz5GSjS4Cybd/s2n/AZonLb+Tu4Pr8+MDWuYS6cJLPesLaupHCgN/t2vT48ni0YZjOhLXOrdzo2fz+/Pr8+a3Lo2SgTanTm77fs8nbxKvHoXy7ZKvIobfSrpTPfPD37cTlt5DOeIy4fGGeSaLFloTIaYe/cn7GYf7//sDVuf3+/cvexXa/WMjfvtvr1d3w1ub04cTjuPX59O/37d7q2dHqxtDhyLrUsJDAfmagToTAbIa9ctXm0MzfxJ3KjMDYt4HDaIjBc6zammqpUdDmyGKfSe7063e4XOTx39Tsyuv25+Dv28Teu/P48avOndTmzIi+cq7bnJXKgpe/iXCxVqzKomalTfL38LDcn97r2sfjvGukVHzFX9Prya/No/n8+M/qxbfXq4vLcY3Kd3SoX4G/abLdodrv0rngqpvBjKjRmv39/Lzbsery57ndquDs3OLt3n2ta3S1WnqwZPn7+LLVpunx5drt0qbImeDx2efx4+zz6aPWj5nSg7zcspPGgXWwX428e/X683G2VbbTq7zhrb3gr73ir9Lly3q3YrXbqGCcSN3p2Xu5Yr/jsevz6GuuUaPHl93o2bLSpvz9+2mmUcbivfj79sfjvWywUajYlKnZlt3q2Nvp1W2tU/v8+pLEgKrOm+fx5HrEXbXSquPu3+Pv3v///3jDWiwAAAAAJQAlAAAI/wD/CRxIsKDBgwgTKlzIsKFBPpkcSiRIxJsXNRMn6jDkz1+ZjBIZdfRHD2RDaiP9lTLJMNZIYslYLuzXsUyWBDIVmvM3z4CEnALD/LoFihsfgdsKtKIwjRa0W/H0ZZzhK6U/W+W4EIjUK5TVQ7kkolJjtaxZf9mCNJR3tq1VRAzxrHNL19I5hs7oulVSj2EYvW4DrGBYDPBZYZ4abjJsthlOhoUYl+Xn0JRkq64cErpslUtDXJxTdmtYKfTINWoX8jI9ckfqhBS6sO7o5dVCdbM7flp4Kre/bwslLMqNj2GA2cvIMdSmhPW+QQ2x/QmtZJVDE444d1L2uOE5SmXtdTyRFqisMQMUJq7QVCuRvzUDCkDC0kQWsEak/hx7xi59xhXwtLFLGwJM8FgCKIzAiThY3DAYSytQ8CBLAQEAOw==",
        android: "data:image/gif;base64,R0lGODlhJQAlAPcAAL7Z8pm+3eTu93TC/laf1Wa7+8Li/2Cw7aPU/ubz/6DM8+Xv+vb5/G+/+/P4/G627lyp44K023TA+2O29OPt9bjd/mGz8GKfz7vS6LzW7F2r5vb6/fv9/3fB+Vmk3IGw2IjL/mS4993v/4Cv1tTq/1qm327A/sbZ6+Tt9svm/7DM5NDg7o3L/oTJ/vf7/2u//sHh/e30+lWc0mam2IHH/me8/cfc72uw5a7Z/vf7/pjM82mt4aPT/GSh0f7+/9rm8l+u6u/4/4PJ/pjQ/lKXy1ii2ff6/uTv+I222qLR+sjf9Gm+/sba7Pn7/b7j/+3z+O30+73j/4bK/lydzr7a9LzU67XX9cnj+Y+74b/j//b5/fn8/nSu273X7rHN5lad03DA/dPn+XKn0oW65trn8+by/pPE7Xm252e7+5S/4FOZze73/73i/9Dg7/v9/labzl+v6+Tv+dDh8dro9KbG4tzs+tvq+O3z+YO334LJ/me8+3nF/qPO71yq5OXx/IjB8e/2+pfM+X/I/rTU8J3U/ufw+Ljg/orG9qjL6rnh/7/c98vl/Ya+65HA6Mjg9bPe/3Ws1ZTQ/t3u/pXR/m6/+6zN5l2q5e71/XfE/oa22pC+4dvp93603YGz2b7e92u06qDW/mi9/naw3me6+NHi8sDf+mGx7o/O/ujx+GGy77Tf/3+656vS9NHp+9Lr/my//mir3nG79X7E+cHg+4+83Z7I7fb7/3vB9qXF4e30+bbZ9/f6/WCw7KXK5Xqv1/L3+5DP/oO23eTy/cnh91eazYTK/rXf/7PS7vX7/1ebzu72/pnQ+ZzE5n/C9Nvp9Zq/34jF82K08vz9/oK23en1/uv0+4LB8J3V/rHO6HjE/Lfc/Wip3JvC5OXv99Ll9v3+/+Pu9/j7/Z7J75jO/MPl/4643OXy/YfL/rzT6e74/8Xl/n7H/ubx+u71+77Y8IvH+cvm++ny+Ia43ajM7IPD82S39mO186jL5Yq53bTV8vr8/WWk1Xey4f///2e9/gAAACwAAAAAJQAlAAAI/wD9CRxIsKDBgwgTEtzzSqEghRAHyjKUkNCyiBHr8Tnlb92ka5FaLMHk6QDGiJ+EpevHkqUtaqtOQgSFrKVNlt+MLZFpMFSWm0BZunrBk6Cqlp182fQBKVNLdUUFnvPRkl6zpbeg2QQWFV7QryxbRWXnoKzZs2jLVjtZTIpAPBHiyp1LN+40gSCEJEzEMos/sID9kWP56OCSLSylvQAM1gTVflsOgrE5mXHQbDYPNrC52TLQDpkNdmY52nNL0C01czZ9EzVL1S1Ls3bdDzZp1jZp2+4n27Rug5RW42b5u2CBXCx/oRnOchQDlvEQButWSN5f5jXwoQLHCaGFLzJSXXkf7s+UjC/RMDKvXdTNcH1R7zVh3aRXVEtqiEyxOYUIEZu0EKGGBlENVFoDAtmkQ4EFHZhgSwsyaCBnD7IUoYT+ODhePxdKiIYDLDGgh0CAtGQNhgOlEU4TaQykyS5uVGIPigLB8UYycAzEyxvE9EHjQDXUUFCQJwUEADs=",
        winPhone: "data:image/gif;base64,R0lGODlhJQAlANUmAP+5AP+7AACv/wCn84O7AwCj/wCl83+7A329AvdOH3LIAPu5A/JQIv9GCfVOI/9DJn67A3C7A/ROI22+Av9DJ2/JAP9AIoG7A/lMH3S7A327A267AwCl//9ECQCn9v25A3u9Avy5A4C7A/NQIgOl8P+5A////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhFMkVDNzAzNDdGREU1MTFBMDU2RUYwNkRDRkZCRjI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzMjNFOTMxRkQ0NzExRTU4NjVEQ0JEOEI2OTEwQTgzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzMjNFOTMwRkQ0NzExRTU4NjVEQ0JEOEI2OTEwQTgzIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTIyRUM3MDM0N0ZERTUxMUEwNTZFRjA2RENGRkJGMjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEUyRUM3MDM0N0ZERTUxMUEwNTZFRjA2RENGRkJGMjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAAAmACwAAAAAJQAlAAAG/8CRcEgsjhwPkwIhajqfzwPBSB0ilUyotimtVq/L7bbrNYKz4ui0XDynoWS2NRl+O+PyIx1tx8vddlxreXpYgYKEQoCBfmyLfYN5j2+NZZNplV6XYplfe4ciUgyjpKWmDBIUhodSCa6vsLEJGBYmFSAQubq7uxoXDcDBwsMNHSbHExHKy8zMGxnH0dLT1NXWxwLZ2tvc2dEAJeHi4+QfA+fo6eoDHhwmAeDk8uIhJPb3+PkkBgXv8fPyFugbeI+fP4DzBBIcaBAewoALGfZz+HCcwoj4Gv6rWOIiRnsaOYrz+DGkyI4fM07cWJEkRpMiXUaEyVHmQpotUxZceRKlzhJ9PE/aJIjz4VCJB4X+BJo0ZhAAOw==",
        win8: "data:image/gif;base64,R0lGODlhJQAlAPfxAAAAAP////b5//z9/ziO8zqP822s9rPU+7XV+77a++Dt/ebx/uz0/h6A8SKD8SWE8iaF8ieF8ieG8iqH8iuI8yuK8yuH8iuI8iyK8yyL8yyM8y2K8y2I8i+J8jCO8zGK8jKM8jOM9DON9DOM8zON8zOM8jSN9DSO9DSN8zWO9DWP9DWQ9DWO8zaO8zeS9DeO8zaO8jiT9DiQ8jqQ9DmP8zmQ8zuR9DuS9DqQ8zqR8zyS9DyT9DuQ8zuR8zyR8z2S9D2T9D2U9D2V9D6W9D6T8z+W9EGX9EaX9EiY9UqZ9Uua9VKe9Vih9Vqk9lyj9l+o9l+l9WGm9mOo9WSp9mas92Wp9mWq9mWr9muu926t9nOx93i0+Hey93ez9nm0+Hm1+Hm2+Hq3+Hy2+H+4+H+5+IC4+IC5+IG4+IG6+IO7+I2/+I/B+ZvH+Z7J+aXN+sHd+8Le/MPe+8vi/Mzj/NXn/Nnq/d7t/d/t/eDu/eHu/efy/urz/SaN8yiN9CuR9CyQ9C2R9C6O8y6P8y6Q8y+Q8y+R8zCS9DGT9DOQ8zaV9TaW9DeT9DeU9DeV9DeW9DiV9DiW9DiW8zmX9TmW9DmX9DqX9TqX9DuY9TuY9DyZ9TyY9DyZ9D6a9T+a9T6Z9ECb9T+X9D+Y9D+Z9EGb9UGc9UCZ9ECa9EKc9UGY9EGa9EGb9EKa9Ead9Eif9kyh9U2h9VCj9lCj9VGj9Vio9lml9Vmn9Vuq91up9mSt92et9meu9miu9miv9muy92+x92+093W3+HS093a3+He393q4+Hq5+Hu5+Hq493+7+IG7+IG8+IG9+IK8+IW9+Ie++InA+IzD+Y/E+ZrJ+ajR+qrS+q3U+6zS+rra+8Lf/MTf+8bh/Mfh/Mrj/Mri+83k/Nrr/dzt/tzs/d/u/eHv/ejz/ur0/unz/fL4/vX6//f7//3+/0Kd9djr/eDv/eby/e32/vz+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhGMkVDNzAzNDdGREU1MTFBMDU2RUYwNkRDRkZCRjI3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ1MkY5MEVFRkQ0NzExRTU4RkQ5RDM5RDg1QkE4N0VBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ1MkY5MEVERkQ0NzExRTU4RkQ5RDM5RDg1QkE4N0VBIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OTMyRUM3MDM0N0ZERTUxMUEwNTZFRjA2RENGRkJGMjciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OEYyRUM3MDM0N0ZERTUxMUEwNTZFRjA2RENGRkJGMjciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQBAADxACwAAAAAJQAlAAAI/wALCBxIsKDBgwgL4FjIsKHDhxAjSpwY8cWIDhYeRODRkIfHjyBDgsTR4gOHCA4aTCCQhImBLDRA9phJs2aOmzVQ1IBxAYIEGUukdFHTBkGcOgwC5ClRk6YPHCRAjCCBgoVVIlCOOGFzYA6dBecGBBhLNsAdpjRtqJ3xA4mSKFzWuElQZ08ALWfK6tV7J4RatTcCb2hSTsDesWLIHD58R0TgwDoiU5iyeOyWMZX1KjAROfKOzxUoV76cuSyeE59Tgxa9mHTpsadVpw6d2fXr2KmB6MZQJbOXMq9hp9CtO4jxDFYyfwEeHI8K48aFSNdwJTMYM8ED4Fkhvfv06pWvZ//f7r079cxpnI3n3n2Ie0S05LyZT/9NHG9UsGSLU7///G7WxODegAMWYcSBCCKICigGJuiggwQS6MET5IRj4YXh2FGOL8HgIQ6GIFqoBxwuEAjKiYHkklkyzYy3yIkwoqhiZWGg4WKMMKaYWY03whjKj4LMuBgxyYzHyI8/iqLkILpkVowy2bXTiJJKlmIlIbtkZgwzUT5i5ZdXZlnZll2CacqZhfCiJZfBtQPJmXCeGYks1Wzjjjp7IbNMlG/Cmcqfq4iiCSuv1DKMNNew804AxzwT5SR//qnKpJN6sokllFBiCSaauPJLLL1o84058GTWDiWUqjLKqqy2Osonn3BkIgknlPzRyS3ARDMNNuCgo1c7krgq7LCtZpKIIX3wgQksuAgDDTXcpDNOJa2SYu212GarrbWXKHKIH4Bg0sostnyC7SnopqvuuuyyOwon3TrS7rz01jvvOvjmq+++/Pbr7zoBAQA7"
    }    
        
    function gui(){
        
        $("#tb_rich_poster .poster_submit:first")
        .before("<div id='os'><a data-type='1'></a><a data-type='2'></a><a  data-type='3'></a><a  data-type='4'></a></div><button id='hug_btn' class='btn_default btn_middle'>抱抱</button>");
        
        $("#hug_btn").click(dialog);

        if(isHome){
            $("#os a").click(function(){
                clientType = $(this).data("type");
                replyPost();
            });
            $("#j_p_postlist").on("click",".lzl_link_unfold,.j_lzl_p,.lzl_s_r",function(){
                if(!$(this).parents(".d_post_content_main").find("#lzl_cliend").length){
                    var lzlWrapper = $(this).parents('.core_reply.j_lzl_wrapper').find(".j_lzl_container.core_reply_wrapper");
                    lzlWrapper.find(".core_reply_border_bottom").before('<span id="lzl_cliend" class="lzl_panel_submit j_lzl_p_sb">客户端</span>');
                    var field = lzlWrapper.data("field");
                    if(typeof field === "string"){
                        field = field.replace(/'/g,'"');
                        field = JSON.parse(field);
                    }                    
                    var floor_num = field.floor_num;
                    var quote_id = field.pid;
                    $("#lzl_cliend").on("click",function(){
                        lzlPost(floor_num,quote_id);                        
                    });
                }
            });
        }
        else{
            $("#os a").click(function(){
                clientType = $(this).data("type");
                threadPost();
            });
        }
    }
    
    //编辑框观察者
    
    function init(){
        if($("#tb_rich_poster .poster_submit").length){
            gui();
        }
        else{       
            var target = document.querySelector(".foot");
            var MutationObserver = window.MutationObserver ||
                window.WebKitMutationObserver || window.MozMutationObserver;
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(i){
                    console.log(i.target);
                    if($("#tb_rich_poster .poster_submit").length){
                        observer.disconnect();
                        return gui();
                    }
                });
            });
            var config = { attributes: true, childList: true, subtree: true, characterData: true };
            observer.observe(target, config);
        }
    }
    
    function decodeURI(postData){
        var s = "";
        var data = "";
        
        for (var i in postData){
            s += i + "=" + postData[i];
        }
        var sign = md5(decodeURIComponent(s)+SIGN_KEY);
        for (var i in postData){
            data += "&" +i+ "=" + postData[i];
        }
        data += "&sign=" + sign;
        return data.replace("&","");
    }
    
    function format(content){
        content = content.replace(/<\/p>/g, "\n")
          .replace(/<br>/g, "\n")
          .replace(/\+/g, "%2B")
          .replace(/&nbsp;/g, " ")
          .replace(/([^/]+?)\.png/ig,function($1) { //表情
              if (smiley[$1]){
                  return ">" + smiley[$1] + "<";
              }
          })
          .replace(/<.*?>/g,"");
        return content;
    }
    
    function imgFormat(){
        $("#ueditor_replace .BDE_Image").each(function(){
            var src = $(this).attr("src");
            var type = src.slice(-3);
            if (type === "jpg"){
                if (src.match(/\/(\w+)\.jpg/i)){
                    var width = $(this).width();
                    var height = $(this).height();
                    src = src.match(/\/(\w+)\.jpg/i)[1];
                    if(src.length != 40) return; // 过滤网络图片
                    pic = "#(pic," +src+ ","+width+"," +height+ ")";
                    $(this).replaceWith(pic);
                }
            }
        })
    }
 
    function checkContent(){
        var editor = $("#ueditor_replace");
        if(editor.html() === "<p><br></p>" || editor.html() === ""){
            errorMsg("回复内容不能为空");
            return false;
        }
        imgFormat();
        var content = editor.html();
        content = format(content);
        var os = document.querySelector("#os_slt");
        var client_type = clientType;
        return {
            content:content,
            client_type:client_type
        }
    }
    
    function clientPost(url,data,callback){
        GM_xmlhttpRequest({
            method:"POST",
            url:url,
            data:data,
            headers:{
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: callback
        });
    }
        
    function postCallback(response){
        var msg = JSON.parse(response.responseText);
        if(msg.error_code === "0"){
            $("#ueditor_replace").empty();
            $(".poster_draft_delete").click();
            return location.reload();
        }
        errorMsg(msg.error_msg);
    }

    function lzlCallback(response) {
        var msg = JSON.parse(response.responseText);
        if(msg.error_code === "0"){
            UW.LzlPostor._appendNew();
            return $("#j_editor_for_container").empty();
        }
        errorMsg(msg.error_msg);
    }
    
    function hugCallback(response){
        var msg = JSON.parse(response.responseText);
        var html = "";
        
        msg.picList.picUrl.forEach(function(i){
            html += '<li><a><img src="'+i+'"></a></li>';
        });
        
        $("#tc_baobao_wrap").replaceWith('<canvas id="hug_canvas" width="600" height="600">您的浏览器不支持canvas。</canvas>');
        $(".ui_tc_next").removeClass("ui_tc_next").addClass("ui_tc_done").find("em").text("完成")
        .parents(".i_layer_bottom").append('<div class="i_change_btn"><a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_change"><span><em>换图</em></span></a>\
			<a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_font"><span><em>字效</em></span></a>\
			<a href="javascript:void(0);" class="ui_btn ui_btn_m ui_btn_anew"><span><em>重来</em></span></a></div>\
		')
        .find(".ui_btn_change").click(function(){
            $(document.body).append('<div id="tc_change_wrap"><a id="close_wrap">关闭</a><ul>'+html+'</ul></div>')
            .find("#tc_change_wrap li").css("width",100/msg.picList.picUrl.length+"%").children("a")
			.append('<div class="cut"></div>')
			.mousemove(function(e){
				var t = $(this).height() + e.clientY - $(window).height();
				if ($(this).height() - (t + $(this).width()) >= 0){
					$(this).children(".cut").css("top", t);
				}
			})
			.mouseover(function(){
			$(this).children(".cut").height($(this).width());
			});
        }).end().find(".ui_btn_font")
        .click(function(){
            if(!colorFlag){
                drawCanvas("hug_canvas", 60, 24, tail_content, dataURL,{font:typeface,fill:"#000",stroke:"#fff"},offY);
                return colorFlag = 1;
            }
            typeface = ( fontFamily.indexOf(typeface) >= fontFamily.lenth - 1) ?
            fontFamily[0] : fontFamily[fontFamily.indexOf(typeface)+1];
            drawCanvas("hug_canvas", 60, 24, tail_content, dataURL,{font:typeface,fill:"#fff",stroke:"#000"},offY);
            colorFlag = 0;
        })
        .next(".ui_btn_anew").click(function(){
            $('.dialogJmodal,.dialogJ,#tc_change_wrap').remove();
            dialog();
        });
        getDataURL(msg.picList.picUrl[0],0);
    }
    
    function threadPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var title = $(".editor_title").val();
        var postData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1425161478936_888",
            _client_type:postPrm.client_type,
            _client_version:"7.2.2",
            _phone_imei:"355136154559999",
            anonymous:0,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            new_vcode:1,
            tbs:tbs,
            title:title,
            vcode_tag:11
        }
        var data = decodeURI(postData);
        clientPost(threadURL,data,postCallback);
    }
    
    function hugPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var title = $(".editor_title").val();
        var postData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1425161478936_888",
            _client_type:2,
            _client_version:"7.2.2",
            _phone_imei:"355136154559999",
            anonymous:0,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            new_vcode:1,
            tail_content:tail_content,
            tail_type:1,
            tbs:tbs,
            title:title,
            vcode_tag:11
        }
        var data = decodeURI(postData);
        clientPost(threadURL,data,postCallback);
    }
        
    function replyPost(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1425161478936_888",
            _client_type:postPrm.client_type,
            _client_version:"7.2.2",
            _phone_imei:"355136154559999",
            anonymous:1,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            tbs:tbs,
            tid:tid,
            title:""
        }
        var data = decodeURI(addData);
        clientPost(postURL,data,postCallback);
    }

    function hug(){
        if(!checkContent()){
            return;
        }
        var postPrm = checkContent();
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1425161478936_888",
            _client_type:2,
            _client_version:"7.2.2",
            _phone_imei:"355136154559999",
            anonymous:1,
            content:postPrm.content,
            fid:fid,
            kw:kw,
            tail_content:tail_content,
            tail_type:1,
            tbs:tbs,
            tid:tid,
        }
        var data = decodeURI(addData);
        clientPost(postURL,data,postCallback);
    }
       
    function lzlPost(floor_num,quote_id){
        var content = $("#j_editor_for_container").html();
        content = format(content);
        
        var addData = {
            BDUSS:BDUSS,
            _client_id:"wappc_1425161478936_888",
            _client_type:2,
            _client_version:"7.2.2",
            _phone_imei:"355136154559999",
            anonymous:2,
            content:content,
            fid:fid,
            floor_num:floor_num,
            kw:kw,
            quote_id:quote_id,
            tbs:tbs,
            tid:tid,
            title:""
        }
        var data = decodeURI(addData);
        setTimeout(function(){clientPost(postURL,data,lzlCallback);}, 0);
    }
    
    function errorMsg(msg){
        $('.poster_error').text(msg);
    }
    
    function getHug(s){
        var addData = {
            content: s,
            from:"sdktbandroid"
        }
        var myHugURL = "http://api.myhug.cn/se/pic";
        var data = decodeURI(addData);
        setTimeout(function(){clientPost(myHugURL,data,hugCallback);}, 0);
    }
    
    
    function dialog(){
        var w = $(window).width();
        var h = $(window).height();
        typeface = fontFamily[0];
        
        $(document.body).append("<div class='dialogJ dialogJfix dialogJshadow ui-draggable'></div>\
			<div class='dialogJmodal'></div>").children(".dialogJmodal")
        .css({
            "z-index":"50000",
            "width":$(document).width()+"px",
            "height":$(document).height()+"px"
        })
        .prev(".dialogJ").css({
            "width":"620px",
            "z-index":"50001",
            "left":"300px",
            "top": h <= 683 ? 0 : (h - 683) / 2,
            "left": w <= 620 ? 0 : (w - 620) / 2
        })
        .append('<div class="uiDialogWrapper"><div class="dialogJtitle">\
			<span class="dialogJtxt">抱抱</span><a class="dialogJclose ui_tc_close" title="关闭本窗口" href="javascript:void(0);"></a></div>\
			<div class="dialogJcontent">\
			<div id="dialogJbody" class="dialogJbody" style="height: 600px !important;">\
			<div id="tc_baobao_wrap"><textarea id="tc_baobao" placeholder="输入内容，抱抱为您配图喵~<(￣︶￣)> "></textarea></div>\
			<div class="i_layer_bottom" style="width: 618px;">\
			<div id="tc_status">正在加载……</div>\
			<div class="i_layer_btn"><a class="ui_btn ui_btn_m ui_tc_next" href="javascript:void(0);"><span><em>下一步</em></span></a>\
			<a class="ui_btn ui_btn_sub_m ui_tc_close" style="float:left" href="javascript:void(0);"><span><em>取 消</em></span></a></div></div>\
			</div></div></div>')
        .find("#tc_baobao")
        .keydown(checkText)
        .keyup(checkText)
        .focus();
        
        function checkText(e){
            var text = $(e.target).val();
            var length = text.length;
            var $next = $(".ui_tc_next");
            if(length > 88){
                return $(e.target).val(text.substr(0,88));
            }
            text.length ? $next.show() : $next.hide();
        }
    }
    
    $(document.body).on("click",".ui_tc_close",function(){
        $(".dialogJmodal,.dialogJ,#tc_change_wrap").remove();
    })
    .on("click",".ui_tc_next",function(){
        tail_content = $("#tc_baobao").val();
        if(tail_content){
            $("#tc_status").show();
            getHug($("#tc_baobao").val());
        }
    })
    .on("click","#tc_change_wrap li a",function(){
        $("#tc_status").show().text("正在绘制图片……");
		var h = parseInt($(this).children(".cut").css("top"));
		offY = h * 600 / $(this).children("img").width();
        getDataURL($(this).children("img").attr("src"),offY);
    })
    .on("click","#close_wrap",function(){
        $(this).parent().remove();
    })
    .on("click",".ui_tc_done",function(){
		$(".i_change_btn").hide();
        $("#tc_status").show().text("正在上传抱抱……");
        var dataURL = $("#hug_canvas")[0].toDataURL();
        uploader(dataURL);
    });
    
    function drawCanvas(cns, lh, rw, text,src,style,y){
        var cns = document.getElementById(cns);
        var ctx = cns.getContext("2d");
        var lineheight = lh;
        var text = text;

        ctx.width = cns.width;
        ctx.height = cns.height;

        ctx.clearRect(0, 0, ctx.width, ctx.height);
        preDraw(src,function(){
            var imgHeight = this.height * (600 / this.width);
            ctx.drawImage(this,0,-y,600,imgHeight);
            ctx.globalCompositeOperation = "source-over";
            ctx.font = "bold 45px "+style.font;
            ctx.fillStyle = style.fill;
            ctx.strokeStyle = style.stroke;

            var rowCout = text;
            for(var j = 0; getTrueLength(rowCout) > 0; j++){
                var tl = cutString(rowCout, rw);
                rowCout = rowCout.substr(tl);
            }
            
            /* Canvas 绘制文字 居中 */
            
            var h = ctx.height/2 - j*lineheight/2-30;
            var offLeft = (j === 1) ? ctx.height/2 - (getTrueLength(text) * 20)/2 : 50;
            h = (h <= 0) ? 0 : h;
            
            for(var i = 1; getTrueLength(text) > 0; i++){
                var tl = cutString(text, rw);
                ctx.fillText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), offLeft, i * lineheight + h);
                ctx.strokeText(text.substr(0, tl).replace(/^\s+|\s+$/, ""), offLeft, i * lineheight + h);
                text = text.substr(tl);
            }
            $("#tc_status").hide();
        });
                    
        function preDraw(src,callback){
            var img = new Image();
            img.src = src;
            
            if(img.complete){
                return callback.call(img);
            }
            
            img.onload = function(){
                callback.call(img);
            }
        }
        
        function getTrueLength(str){
            var len = str.length, truelen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    truelen += 2;
                }else{
                    truelen += 1;
                }
            }
            return truelen;
        }
        function cutString(str, leng){
            var len = str.length, tlen = len, nlen = 0;
            for(var x = 0; x < len; x++){
                if(str.charCodeAt(x) > 128){
                    if(nlen + 2 < leng){
                        nlen += 2;
                    }else{
                        tlen = x;
                        break;
                    }
                }else{
                    if(nlen + 1 < leng){
                        nlen += 1;
                    }else{
                        tlen = x;
                        break;
                    }
                }
            }
            return tlen;
        }
    }
    
    function getDataURL(imgUrl,y){
        GM_xmlhttpRequest ( {
            method:'GET',
            url:imgUrl,
            onload:function (respDetails) {
                var binResp = customBase64Encode (respDetails.responseText);
                dataURL = 'data:image/png;base64,'+ binResp;
                var style = colorFlag ? {font:typeface,fill:"#000",stroke:"#fff"} :
                {font:typeface,fill:"#fff",stroke:"#000"}
                drawCanvas("hug_canvas", 60, 24, tail_content, dataURL, style, y);
            },
            overrideMimeType: 'text/plain; charset=x-user-defined'
        } );

        function customBase64Encode (inputStr) {
            var
                bbLen = 3,
                enCharLen = 4,
                inpLen = inputStr.length,
                inx = 0,
                jnx,
                keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
                    + "0123456789+/=",
                output = "",
                paddingBytes = 0;
            var
                bytebuffer = new Array (bbLen),
                encodedCharIndexes = new Array (enCharLen);

            while (inx < inpLen) {
                for (jnx = 0; jnx < bbLen; ++jnx) {
                    if (inx < inpLen) {
                        bytebuffer[jnx] = inputStr.charCodeAt (inx++) & 0xff;
                    }
                    else {
                        bytebuffer[jnx] = 0;
                    }
                }

                encodedCharIndexes[0] = bytebuffer[0] >> 2;
                encodedCharIndexes[1] = ( (bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
                encodedCharIndexes[2] = ( (bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
                encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

                paddingBytes = inx - (inpLen - 1);
                switch (paddingBytes) {
                    case 1:
                        encodedCharIndexes[3] = 64;
                        break;
                    case 2:
                        encodedCharIndexes[3] = 64;
                        encodedCharIndexes[2] = 64;
                        break;
                    default:
                        break;
                }

                for (jnx = 0; jnx < enCharLen; ++jnx)
                    output += keyStr.charAt ( encodedCharIndexes[jnx] );
            }
            return output;
        }
    }
    
    function uploader(dataURL) {
        $.getJSON('http://tieba.baidu.com/dc/common/imgtbs?t=' + new Date().getTime())
        .done(function(r){
            var tbs = r.data.tbs;
            upload(tbs);
        });
        function upload(tbs) {
            var blob = dataUrlToBlob(dataURL);
            
            var data = new FormData();
            data.append('Filename', 'tieba_client.png');
            data.append('fid', pd.forum.id);
            data.append('file', blob);
            data.append('tbs', tbs);
			data.append('is_wm',1);
						
			var fileXHR = new XMLHttpRequest();	
			fileXHR.withCredentials = true;
			fileXHR.upload.onprogress = progressHandler;
			fileXHR.onload = onloadHandler;
			fileXHR.open("post",'http://upload.tieba.baidu.com/upload/pic',true);
			fileXHR.send(data);	
        }

        function onloadHandler (r) {
			try{
				var
					r = JSON.parse(r.target.responseText),
					fullWidth = r.info.fullpic_width,
					fullHeight = r.info.fullpic_height,
					picId = r.info.pic_id_encode;
					pic = '#(pic,' +picId+ ',' +fullWidth+ ',' +fullHeight+ ')';

				$('#ueditor_replace').append(pic);
				$('.dialogJmodal,.dialogJ,#tc_change_wrap') .remove();
				isHome ? hug() : hugPost();
			}
			catch(e){
				$("#tc_status").html('<b style="color:red">上传出现异常，请重试。</b>');
			}
        }

		function progressHandler(e){
			if(e.lengthComputable){
				var howmuch = (e.loaded / e.total) * 100;
				$("#tc_status").text("正在上传: "+Math.ceil(howmuch)+"%");	
			}
		}

        function dataUrlToBlob(dataURL) {
            var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
            var byteString = atob(dataURL.split(',')[1]);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }
    }
    
    var cssText = '#os_slt{float:left;height:27.5px;width:110px;font-size:17px;}\
		#client_btn{margin:0 10px;float:left;}\
		#hug_btn{margin:0 10px 0 0;float:left;}\
		#tc_change_wrap{z-index:50002;position:fixed;bottom:0;left:0;background:rgba(0, 0, 0, 0.5)}\
		#tc_change_wrap li{float:left;text-align:center;padding-top:5px;}\
		#tc_change_wrap li .cut{position:absolute;width:100%;display:none;\
		background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA61pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcFJpZ2h0czpNYXJrZWQ9IkZhbHNlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InV1aWQ6QUUzRjQ2MDg4Rjg5REUxMUE4NjA5OUYxMjFBMjA0MjkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ5NUYzOEFCNUVGMTFFMEJBQTNCQkU0RDdCMTM1MUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ5NUYzODlCNUVGMTFFMEJBQTNCQkU0RDdCMTM1MUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzJFQjk0NERFRkI1RTAxMTlBQjRBRkQ5MDM5RjM1RUIiIHN0UmVmOmRvY3VtZW50SUQ9InV1aWQ6QUUzRjQ2MDg4Rjg5REUxMUE4NjA5OUYxMjFBMjA0MjkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5t6jRVAAADjUlEQVR42sSWf0gUQRTH927vROHCPDgKBKG/Di4MqZCEi6QILOpCIhRBKKqLoP4KpL9Ew0CKQDCMijCUIomIflhHERQJgRAIh0IQSf4VRKZ1oO7tj96c37XX3Jxne3848NnZfTM78+bNm/fG5ziOtp7Fr61zCRRq6Hr0sZKqs0RvCeN3E1e7ju7IeLFAlOgh4h4nbyI6iWpPW0CeESF04h4RdpZla2UzMYT3iDcFyDlBDTHIvouhEw+JCL7LPClg23aG0ECCOMe+V6ObiLPveU9OaDvOtCS6RowRE6uMt5e4KMk+e1PAdmaomiXCEAlTPiB2EiqvFv2GCJ3JxCLmPW2BReYjUqhdosSAJHMZJKolWe5/jz7gCEZQc9oBlyWJhKLvsKg9bQE0HyWmiJjUPECME5/Q1qcY4gMoSQGL6CCeS80h+MNu1BWKITpKCsWWtWI6YYURokXqUkdMEjWK36/jxGilWsAtZzBhlMluwTKHiCSTi625UHIykhSYh7lfQRENkz/De5KdeaGQUboCVt7x+U7sw8QNmEhjtVj5EfQrPR0bpqkSi8D0FAokJdPfJ779b8r0uTei0y9mi3b+OTnWEKqJjWVmpvwwfwIKHSa5TfLaqq3xqWLj3D4YXpMCcbAgVpdd+L09WLEhJRqWfv3Q5r6kfW7HTXWNOSVyW2cs7tLLyoO4D4iQ/U6OB1yBAMt+7qs404PSsevzB8sNt08wVOUzTItnzgSuApQJAu/pOygtRmzPKSxGHYqROnXiCdEip1lH85Xx76xl5Uh1Hvu3n6MFFSm6DePqtpQbApLXC6faD5EIJMNEG7GH+414vOlulU/MRmJOigd3ieNEPcYV498ooICl4xIpymviAEKxUOKr9vdqFcZpYArktkOXTksjTH6HeIuT04MAZuUpYFpWPZvkEuu0gAATQUDK81ZzWYFZtFfiHuDut4HxXkL5eu6U3AKxAreYEMuGo+qgtbKgFJw3hv8y7GLilhhXwM9XwWhi71eISrz3unLZAlJ7BdFfYDy1ExpGNs3kN3G/i8JkGhwqrYyaRtZ9ncCRa4PzNeCfZtY9rVRgcckYR2Mt7n/trN9jnGNloX/55wnEkmYsICpNPq5UYMnIDdKKZLPF3V548XnuuXLBvxpzOjFOP3GSnY5pyNVbYC4nHxHHt+Hch+AsM8Viu5mfuAzcIS5jG9yQnCmYjNar/BFgAKopo/z149RnAAAAAElFTkSuQmCC") no-repeat scroll center center rgba(0, 0, 0, 0.5);}\
		#tc_change_wrap li:hover{background:rgba(255,255,255,.5);}\
		#tc_change_wrap li img{width:95%}\
		.i_change_btn{position:absolute;left:20px;top:10px;}\
		.ui_btn_change,.ui_btn_font,.ui_btn_anew{float:left;margin-right:10px;}\
		.ui_tc_next{float:left;margin-right:10px;display:none;}\
		.ui_tc_done{float:left;margin-right:10px;}\
		#tc_change_wrap > ul{clear:both;}\
		#tc_change_wrap li a{cursor:pointer;position:relative;display:block;overflow:hidden;}\
		#tc_change_wrap li a:hover .cut{display:block;}\
		#close_wrap{float:right;padding-right: 5px;font: bold 20px/30px 微软雅黑;color:#fff;cursor:pointer;}\
		#tc_baobao_wrap{text-align:center;}\
		#tc_baobao{font-family:微软雅黑;font-size:20px;width:575px;text-align:center;padding:10px;height:162px;margin-top:100px;}\
		#tc_status{position:absolute;left:242px;top:11px;text-indent:30px;\
		line-height: 24px;height:24px;display:none;\
		background:url("data:image/gif;base64,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") no-repeat scroll 0 center;}\
        #os{float:left;}\
		#os a{display: inline-block;width:31px;height:31px;background-size:cover !important;margin-right:10px;cursor:pointer;opacity: 0.8;}\
        #os a:hover{opacity:1;}\
        #os a[data-type="1"]{background:url(' +icon.iPhone+ ')}\
        #os a[data-type="2"]{background:url(' +icon.android+ ')}\
        #os a[data-type="3"]{background:url(' +icon.winPhone+ ')}\
        #os a[data-type="4"]{background:url(' +icon.win8+ ')}\
        ';
    $(document.head).append('<style>'+cssText+'</style>');
    
    init();
    
})(jQuery,unsafeWindow,undefined);

/**********************************************************************

    JavaScript MD5 implementation. 
    Compatible with server-side environments like node.js, 
    module loaders like RequireJS and all web browsers.
    
    ----------------------------- (C) ---------------------------------
    
                            JavaScript-MD5
                        Author: Sebastian Tschan                            
                https://github.com/blueimp/JavaScript-MD5
    The JavaScript MD5 script is released under the MIT license.
    
***********************************************************************/

!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
