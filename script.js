document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waterQualityForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const successMessage = document.getElementById('successMessage');
    const resetBtn = document.getElementById('resetBtn');

    // Handle "Other" Checkbox logic for Obstacles
    const obstacleOtherCb = document.getElementById('obstacleOtherCb');
    const obstacleOtherText = document.getElementById('obstacleOtherText');
    obstacleOtherCb.addEventListener('change', (e) => {
        obstacleOtherText.style.display = e.target.checked ? 'block' : 'none';
        if(e.target.checked) obstacleOtherText.focus();
    });

    // Handle "Other" Checkbox logic for Activities
    const activityOtherCb = document.getElementById('activityOtherCb');
    const activityOtherText = document.getElementById('activityOtherText');
    activityOtherCb.addEventListener('change', (e) => {
        activityOtherText.style.display = e.target.checked ? 'block' : 'none';
        if(e.target.checked) activityOtherText.focus();
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1. Collect Data
        const formData = new FormData(form);
        const data = {
            groupNumber: formData.get('groupNumber'),
            area: formData.get('area'),
            currentStatus: formData.get('currentStatus'),
            problems: formData.get('problems'),
            causes: formData.get('causes'),
            agency: formData.get('agency'),
            obstacles: [],
            activities: []
        };

        // Collect Checkboxes
        document.querySelectorAll('input[name="obstacles"]:checked').forEach(cb => {
            data.obstacles.push(cb.value);
        });
        if (obstacleOtherCb.checked && obstacleOtherText.value.trim() !== '') {
            data.obstacles.push('อื่นๆ: ' + obstacleOtherText.value.trim());
        }

        document.querySelectorAll('input[name="activities"]:checked').forEach(cb => {
            data.activities.push(cb.value);
        });
        if (activityOtherCb.checked && activityOtherText.value.trim() !== '') {
            data.activities.push('อื่นๆ: ' + activityOtherText.value.trim());
        }

        // Validate at least one checkbox is selected
        if (data.obstacles.length === 0) {
            alert('กรุณาเลือกอุปสรรคสำคัญอย่างน้อย 1 ข้อ');
            return;
        }
        if (data.activities.length === 0) {
            alert('กรุณาเลือกกิจกรรมที่ชุมชนต้องการอย่างน้อย 1 ข้อ');
            return;
        }

        // 2. Prepare payload
        const payload = {
            ...data,
            obstacles: data.obstacles.join(', '),
            activities: data.activities.join(', ')
        };

        // 3. UI Loading State
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';

        try {
            // =========================================================
            // TODO: แทนที่ URL ด้านล่างด้วย URL Web App ของคุณจาก Google Apps Script
            // =========================================================
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzb9xrajupmn4e4SbFJ9Mv_MeECPfFHGLjvU9DhrXKsSz6PROTOBTbsmITYlxmCPwkvJg/exec';
            
            if (GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL') {
                // ส่งข้อมูลจริงไปยัง Google Sheets
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // สำคัญมากสำหรับ Google Apps Script
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                // จำลองการโหลด 1.5 วินาที (หากยังไม่ได้ใส่ URL)
                await new Promise(resolve => setTimeout(resolve, 1500));
                console.log('Simulated Data Save:', payload);
            }

            // 4. Show Success
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
            console.error('Error:', error);
        } finally {
            // Reset Button State
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            loader.style.display = 'none';
        }
    });

    // Reset Form for next entry
    resetBtn.addEventListener('click', () => {
        form.reset();
        obstacleOtherText.style.display = 'none';
        activityOtherText.style.display = 'none';
        successMessage.style.display = 'none';
        form.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
