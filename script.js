!function(e){e.fn.hover3d=function(t){var r=e.extend({selector:null,perspective:1e3,sensitivity:20,invert:!1,shine:!1,hoverInClass:"hover-in",hoverOutClass:"hover-out",hoverClass:"hover-3d"},t);return this.each(function(){function t(e){i.addClass(r.hoverInClass+" "+r.hoverClass),currentX=currentY=0,// Thêm requestAnimationFrame để mượt hơn
        // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                i.css({
                    perspective:r.perspective+"px",
                    transformStyle:"preserve-3d",
                    transform:"rotateX(4deg) rotateY(6deg) rotateZ(0) translateZ(0) translateX(0)",
                    transformOrigin: "center center",
                    transition: "transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1)"
                });
            });
        });
        setTimeout(function(){i.removeClass(r.hoverInClass)},1e3)}function s(e){var t=i.innerWidth(),s=i.innerHeight(),n=Math.round(e.pageX-i.offset().left),o=Math.round(e.pageY-i.offset().top),v=r.invert?(t/2-n)/r.sensitivity:-(t/2-n)/r.sensitivity,c=r.invert?-(s/2-o)/r.sensitivity:(s/2-o)/r.sensitivity,u=n-t/2,p=o-s/2,f=180*Math.atan2(p,u)/Math.PI-90;f<0&&(f+=360);
        
        // Tăng hiệu ứng rotation theo trục X và thêm translateZ để tăng hiệu ứng theo trục Z
        v = v * 1.08; // Tăng 8% theo trục X
        var zTranslate = Math.abs(v) * 1.5; // Tạo hiệu ứng Z dựa trên độ nghiêng X
        
        // Thêm chuyển động lắc qua lại theo trục X (tương ứng với trục Z trong không gian 3D)
        var xTranslate = v * 1.1; // Thêm 10% lắc sang ngang theo chiều nghiêng
        
        // Thêm rotateZ (xoay quanh trục Z) dựa vào vị trí chuột theo chiều ngang
        // Giới hạn trong khoảng +/- 4 độ
        var zRotation = 0;
        // Tính vị trí chuột tương đối (-1 đến 1) dọc theo chiều ngang
        var relativeMouseX = (2 * n / t) - 1;
        // Chuyển đổi thành góc xoay tối đa 4 độ
        zRotation = relativeMouseX * 4;
        
        // Hiệu ứng cong ưỡn dựa vào vị trí chuột theo chiều dọc
        // Khi chuột lên trên thì card ưỡn ra, xuống dưới thì cong vào
        var bendEffect = 0;
        // Tính vị trí tương đối của chuột theo chiều dọc (-1 đến 1)
        var relativeMouseY = (2 * o / s) - 1;
        // Nếu chuột ở phía trên, card ưỡn ra (rotateX âm), nếu ở dưới, card cong vào (rotateX dương)
        bendEffect = -relativeMouseY * 9; // Hiệu ứng cong tăng lên 9 độ (tương đương khoảng 8%)
        
        // Thêm góc nghiêng cố định 4 độ theo trục X
        c = c + 4 + bendEffect;
        
        // Làm mượt chuyển động bằng cách làm tròn các giá trị
        v = Math.round(v * 1500) / 1500;
        c = Math.round(c * 1500) / 1500;
        zRotation = Math.round(zRotation * 1500) / 1500;
        xTranslate = Math.round(xTranslate * 1500) / 1500;
        zTranslate = Math.round(zTranslate * 1500) / 1500;
        
        // Sử dụng requestAnimationFrame để làm mượt animation
        // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt 
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                i.css({
                    perspective:r.perspective+"px",
                    transformStyle:"preserve-3d",
                    transform:"translateX("+xTranslate+"px) rotateY("+v+"deg) rotateX("+c+"deg) rotateZ("+zRotation+"deg) translateZ("+zTranslate+"px)",
                    transformOrigin: "center center",
                    outline:"none",
                    border:"none",
                    transition: "transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)"
                });
            });
        });
        
        var originalBg=a.css("background");a.css({"background":"linear-gradient("+f+"deg, rgba(255,255,255,"+e.offsetY/s*.5+") 0%,rgba(255,255,255,0) 80%)","box-shadow":"none","outline":"none","border":"none"})}function n(){i.addClass(r.hoverOutClass+" "+r.hoverClass),
        // Sử dụng requestAnimationFrame và transition dài hơn cho hiệu ứng mượt khi hover ra
        // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                i.css({
                    perspective:r.perspective+"px",
                    transformStyle:"preserve-3d",
                    transform:"rotateX(4deg) rotateY(6deg) rotateZ(0) translateZ(0) translateX(0)",
                    transformOrigin: "center center",
                    outline:"none",
                    border:"none",
                    transition: "transform 0.75s cubic-bezier(0.175, 0.885, 0.42, 1.275)"
                });
            });
        });
        setTimeout(function(){i.removeClass(r.hoverOutClass+" "+r.hoverClass),currentX=currentY=0},1e3)}var o=e(this),i=o.find(r.selector);currentX=0,currentY=0,r.shine&&i.append('<div class="shine"></div>');var a=e(this).find(".shine");o.css({perspective:r.perspective+"px",transformStyle:"preserve-3d",boxShadow:"none",outline:"none",border:"none"}),i.css({perspective:r.perspective+"px",transformStyle:"preserve-3d",transformOrigin: "center center",boxShadow:"none",outline:"none",border:"none"}),a.css({position:"absolute",top:0,left:0,bottom:0,right:0,transform:"translateZ(1px)","z-index":9,boxShadow:"none",outline:"none",border:"none"}),o.on("mouseenter",function(){return t()}),o.on("mousemove",function(e){return s(e)}),o.on("mouseleave",function(){return n()})})}}(jQuery);

$(document).ready(function() {
    // Loại bỏ tất cả đường viền trên mọi phần tử NGOẠI TRỪ CARD
    $("*:not(.card)").css({
        "box-shadow": "none",
        "outline": "none",
        "border": "none"
    });
    
    // Tối ưu card để animation mượt hơn
    $(".card").css({
        "transform-style": "preserve-3d",
        "transform-origin": "center center",
        "will-change": "transform",
        "backface-visibility": "hidden",
        "pointer-events": "auto"
    });
    
    // Cài đặt hiệu ứng hover3d với animation mạnh hơn
    $(".card-hover").hover3d({
        selector: ".card",
        shine: true,
        sensitivity: 8, // Giảm độ nhạy thêm để movement mượt hơn
        perspective: 1600
    });
    
    // Tạo hiệu ứng mượt khi hover vào
    var hoverTransition = "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)";
    var outTransition = "transform 0.75s cubic-bezier(0.175, 0.885, 0.42, 1.275)";
    var moveTransition = "transform 0.08s cubic-bezier(0.34, 1.56, 0.64, 1)";
    
    // Thêm chế độ xử lý thông minh motion để làm mượt animation
    var lastMoveTime = 0;
    var moveThreshold = 16; // milliseconds - giảm xuống để phản hồi nhanh hơn (60fps tương đương ~16.7ms)
    
    // Tiền tải và optimize hiệu ứng trước khi dùng
    setTimeout(function() {
        $(".card").css({
            "transform": "rotateX(4deg) rotateY(6deg)",
            "transition": hoverTransition
        });
    }, 0);
    
    // Làm mượt hơn hiệu ứng khi hover vào với RAF (requestAnimationFrame)
    $(".card-hover").on("mouseenter", function(e) {
        // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                $(".card").css({
                    "transition": hoverTransition,
                    "will-change": "transform",
                    "transform-style": "preserve-3d"
                });
            });
        });
    });
    
    // Điều chỉnh transition khi di chuyển chuột với ratelimit và RAF
    $(".card-hover").on("mousemove", function(e) {
        var now = Date.now();
        if (now - lastMoveTime > moveThreshold) {
            lastMoveTime = now;
            // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    $(".card").css({
                        "transition": moveTransition,
                        "will-change": "transform",
                        "transform-style": "preserve-3d"
                    });
                });
            });
        }
    });
    
    // Thêm hiệu ứng tưng lên xuống rõ ràng khi hover out và trả về 2D
    $(".card-hover").on("mouseleave", function() {
        // Reset về trạng thái gốc với transition out
        $(".card").css({
            "transition": outTransition,
            "transform": "rotateX(4deg) rotateY(6deg) translateY(0)",
            "will-change": "transform",
            "transform-style": "preserve-3d"
        });
        // Sau khi kết thúc transition out, cho tưng lên
        setTimeout(function() {
            $(".card").css({
                "transition": "transform 0.135s cubic-bezier(0.34, 1.56, 0.64, 1)",
                "transform": "rotateX(4deg) rotateY(6deg) translateY(-8px)",
                "will-change": "transform",
                "transform-style": "preserve-3d"
            });
            setTimeout(function() {
                $(".card").css({
                    "transition": "transform 0.229s cubic-bezier(0.175, 0.885, 0.42, 1.275)",
                    "transform": "none",
                    "will-change": "auto",
                    "transform-style": "flat"
                });
            }, 135);
        }, 320); // Đợi đúng thời gian outTransition (0.32s)
    });
    
    // Đảm bảo không có đường viền xuất hiện sau khi load
    setTimeout(function() {
        $("*").css({
            "box-shadow": "none !important",
            "outline": "none !important",
            "border": "none !important"
        });
    }, 100);
    
    // Thêm hiệu ứng preload để animations mượt hơn
    window.addEventListener('load', function() {
        // Sử dụng 2 lớp requestAnimationFrame lồng nhau để tăng độ mượt
        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                $(".card").addClass("ready");
            });
        });
    });
});
