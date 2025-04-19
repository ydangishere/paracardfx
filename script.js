// Hiệu ứng holographic cho card
document.addEventListener('DOMContentLoaded', function() {
    const card = document.querySelector('.card');
    const cardHolo = document.querySelector('.card-holo');
    const cardShine = document.querySelector('.card-shine');
    const cardGlitter = document.querySelector('.card-glitter');
    
    // Phát hiện màu chủ đạo và áp dụng glow tương ứng
    colorAnalyzer.detectDominantColorAndApplyGlow('cardnoshade.png');
    
    // Trạng thái animation
    let isAnimating = false;
    let animationId = null;
    let currentRotation = { x: 0, y: 0, z: 0 };
    let targetRotation = { x: 0, y: 0, z: 0 };
    let isHovering = false;
    let lastGradientAngle = 0; // Biến lưu góc gradient trước đó
    
    // Cập nhật kích thước và vị trí card
    function updateBounds() {
        const bounds = card.getBoundingClientRect();
        return {
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2
        };
    }
    
    // Quy đổi vị trí chuột thành góc xoay
    function getRotation(percentX, percentY) {
        let rotateX, rotateY, rotateZ;
        
        // Xác định góc
        if (percentX < 0.5 && percentY < 0.5) {
            // 1. Góc trái trên (Top-Left)
            rotateX = -20; 
            rotateY = 20;  
            rotateZ = 4;   
        } 
        else if (percentX > 0.5 && percentY > 0.5) {
            // 2. Góc phải dưới (Bottom-Right)
            rotateX = 20;  
            rotateY = -20; 
            rotateZ = 4;   
        }
        else if (percentX < 0.5 && percentY > 0.5) {
            // 3. Góc trái dưới (Bottom-Left)
            rotateX = 20;  
            rotateY = 20;  
            rotateZ = -4;  
        }
        else {
            // 4. Góc phải trên (Top-Right)
            rotateX = -20; 
            rotateY = -20; 
            rotateZ = -4;  
        }
        
        // Mức độ áp dụng (càng gần góc càng mạnh)
        const distFromCenter = Math.sqrt(Math.pow(percentX - 0.5, 2) + Math.pow(percentY - 0.5, 2));
        const intensity = Math.min(distFromCenter * 2.5, 1);
        
        return { 
            rotateX: rotateX * intensity, 
            rotateY: rotateY * intensity, 
            rotateZ: rotateZ * intensity
        };
    }
    
    // Hàm lerp để làm mượt chuyển động
    function lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
    
    // Thiết lập ngay ban đầu
    card.style.transform = `translate(-50%, -50%) perspective(706px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
    
    // Hiệu ứng xoay 3D khi di chuột lên card
    card.addEventListener('mouseenter', function() {
        isHovering = true;
        isAnimating = false; // Reset trạng thái animation
        
        // Hủy animation cũ nếu có
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Bắt đầu animation mới
        updateCardAnimation();
    });
    
    // Hiệu ứng xoay 3D khi di chuột
    card.addEventListener('mousemove', function(e) {
        if (!isHovering) return;
        
        const bounds = updateBounds();
        
        // Tính toán vị trí tương đối của chuột
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const percentX = (mouseX - bounds.left) / bounds.width;
        const percentY = (mouseY - bounds.top) / bounds.height;
        
        // Lấy góc xoay
        const rotation = getRotation(percentX, percentY);
        
        // Cập nhật target rotation (chuyển động mượt)
        targetRotation.x = rotation.rotateX;
        targetRotation.y = rotation.rotateY;
        targetRotation.z = rotation.rotateZ;
        
        // Di chuyển ánh sáng shine theo chuột
        const gradientAngle = Math.atan2(percentY - 0.5, percentX - 0.5) * (180 / Math.PI);
        // Làm mượt góc xoay để tránh nhấp nháy
        lastGradientAngle = lerp(lastGradientAngle, gradientAngle, 0.05);
        cardShine.style.background = `linear-gradient(
            ${lastGradientAngle + 90}deg, 
            rgba(255, 255, 255, 0) 30%, 
            rgba(255, 255, 255, 0.6) 48%, 
            rgba(255, 255, 255, 0) 70%
        )`;
        
        // Hiệu ứng lấp lánh ngẫu nhiên
        if (Math.random() < 0.03) {
            cardGlitter.style.opacity = Math.random() * 0.15;
            setTimeout(() => cardGlitter.style.opacity = 0, 150);
        }
    });
    
    // Reset khi rời khỏi card - chỉ bắt sự kiện trên card
    card.addEventListener('mouseleave', function() {
        resetCardWithSwing();
    });
    
    // Hàm reset có hiệu ứng swing cho mouseleave 
    function resetCardWithSwing() {
        isHovering = false;
        isAnimating = false;
        
        // Đặt lại các giá trị target để tạo animation trở về
        targetRotation.x = 0;
        targetRotation.y = 0;
        targetRotation.z = 0;
        
        // Tắt hiệu ứng holographic ngay lập tức
        cardHolo.style.opacity = 0;
        
        // Bắt đầu animation fadeout mượt
        let startTime = null;
        const duration = 1500; // Tăng lên 1.5 giây
        
        function fadeOutAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Áp dụng easing
            const easeOutCubic = function(t) {
                return 1 - Math.pow(1 - t, 6); // Tăng lên pow 6 để cực kỳ mượt
            };
            const ease = easeOutCubic(progress);
            
            // Thêm hiệu ứng lắc trước khi trở về trạng thái phẳng
            let swingX = 0;
            let swingY = 0;
            
            if (progress < 0.4) {
                // Giai đoạn 1: thêm lắc theo sin/cos
                const swingFactor = Math.sin(progress * Math.PI * 4) * (1 - progress * 2.5);
                swingX = swingFactor * 6.05; // Tăng thêm 10% lên 6.05
                swingY = swingFactor * 9.68; // Tăng thêm 10% lên 9.68
            }
            
            // Làm mượt chuyển động trở về
            currentRotation.x = currentRotation.x * (1 - ease) + swingX;
            currentRotation.y = currentRotation.y * (1 - ease) + swingY;
            currentRotation.z = currentRotation.z * (1 - ease);
            
            // Áp dụng transform
            card.style.transform = `translate(-50%, -50%) 
                perspective(706px) 
                rotateX(${currentRotation.x}deg) 
                rotateY(${currentRotation.y}deg) 
                rotateZ(${currentRotation.z}deg)`;
            
            if (progress < 1) {
                animationId = requestAnimationFrame(fadeOutAnimation);
            } else {
                // Hoàn tất animation
                currentRotation.x = 0;
                currentRotation.y = 0;
                currentRotation.z = 0;
                card.style.transform = `translate(-50%, -50%) perspective(706px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
                isAnimating = false;
                
                // Hủy animation frame
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        }
        
        // Đảm bảo không có animation click đang chạy
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Bắt đầu animation fadeout
        isAnimating = true;
        animationId = requestAnimationFrame(fadeOutAnimation);
    }
    
    // Hàm reset thông thường không có hiệu ứng swing
    function resetCard() {
        isHovering = false;
        isAnimating = false;
        
        // Reset ngay lập tức không có animation
        currentRotation.x = 0;
        currentRotation.y = 0;
        currentRotation.z = 0;
        card.style.transform = `translate(-50%, -50%) perspective(706px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        cardHolo.style.opacity = 0;
        
        // Hủy animation frame nếu đang chạy
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    // Animation frame - làm mượt chuyển động
    function updateCardAnimation() {
        if (!isHovering) return;
        
        // Áp dụng lerp để làm mượt chuyển động
        currentRotation.x = lerp(currentRotation.x, targetRotation.x, 0.088);
        currentRotation.y = lerp(currentRotation.y, targetRotation.y, 0.088);
        currentRotation.z = lerp(currentRotation.z, targetRotation.z, 0.088);
        
        // Áp dụng transform
        card.style.transform = `translate(-50%, -50%) 
            perspective(706px) 
            rotateX(${currentRotation.x}deg) 
            rotateY(${currentRotation.y}deg) 
            rotateZ(${currentRotation.z}deg)`;
            
        // Cập nhật hiệu ứng holographic
        const intensity = (Math.abs(currentRotation.x) + Math.abs(currentRotation.y)) / 40;
        cardHolo.style.opacity = Math.min(intensity * 2.5, 0.51); // Giảm 40% từ 0.85
        
        // Chỉ tiếp tục animation nếu đang hover
        if (isHovering) {
            animationId = requestAnimationFrame(updateCardAnimation);
        }
    }
    
    // Hiệu ứng animation phân tích theo trục khi click
    card.addEventListener('click', function() {
        if (isAnimating) return;
        isAnimating = true;
        
        // Animation ánh sáng khi click
        cardShine.style.transition = 'none';
        cardShine.style.transform = 'translateX(-100%)';
        cardShine.style.opacity = 0.8;
        cardShine.offsetWidth;
        cardShine.style.transition = 'transform 0.5s ease-in-out';
        cardShine.style.transform = 'translateX(100%)';
        
        // Trạng thái ban đầu: góc nhìn nghiêng từ phía trái
        let startRotateY = -25;  // Góc chéo phía trái
        let startRotateX = 5;    // Nghiêng nhẹ từ trên xuống
        
        // Khởi tạo thởi gian bắt đầu
        let startTime = null;
        const DURATION = 2500;   // Thời gian animation (ms)
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / DURATION, 1);
            
            // Áp dụng easing - cubic-bezier
            const ease = function(t) {
                // Cubic bezier tính toán
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };
            const easeProgress = ease(progress);
            
            // Tính toán góc xoay theo đường cong spline
            // 1. Trục Y (xoay từ góc nghiêng → chính diện)
            const curRotateY = startRotateY * (1 - easeProgress);
            
            // 2. Trục X (từ trên xuống nhẹ rồi ngẩng lên)
            // Tạo đường cong: bắt đầu 5, xuống -5, rồi lên 0
            let curveX;
            if (progress < 0.4) {
                // Giai đoạn 1: từ 5 xuống -5
                curveX = startRotateX - (startRotateX + 5) * (progress / 0.4);
            } else {
                // Giai đoạn 2: từ -5 lên 0
                curveX = -5 + 5 * ((progress - 0.4) / 0.6);
            }
            
            // 3. Trục Z (tiến gần)
            // Giả lập bằng scale
            const scale = 1 + 0.1 * easeProgress;
            
            // Áp dụng transform - trực tiếp không qua lerp
            card.style.transform = `translate(-50%, -50%) 
                perspective(706px) 
                rotateY(${curRotateY}deg) 
                rotateX(${curveX}deg) 
                scale(${scale})`;
            
            // Cập nhật currentRotation để tránh nhảy sau khi animation kết thúc
            currentRotation.x = curveX;
            currentRotation.y = curRotateY;
            currentRotation.z = 0;
            
            // Điều chỉnh hiệu ứng holographic
            cardHolo.style.opacity = 0.4 * (1 - easeProgress);
            
            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            } else {
                // Kết thúc animation
                setTimeout(() => {
                    resetCard();
                }, 500);
            }
        }
        
        // Bắt đầu animation
        animationId = requestAnimationFrame(animate);
        
        // Sau animation, reset trạng thái shine
        setTimeout(() => {
            cardShine.style.transition = 'none';
            cardShine.style.opacity = 0.5;
        }, 500);
    });
});
