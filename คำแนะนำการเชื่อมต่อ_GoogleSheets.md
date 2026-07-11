# วิธีเชื่อมต่อ Landing Page กับ Google Sheets

เนื่องจากเราเปลี่ยนมาใช้หน้าเว็บสวยๆ (Landing Page) แทน Google Forms เราจึงต้องใช้โค้ดตัวใหม่ (Webhook) เพื่อรับข้อมูลจากเว็บแล้วนำไปใส่ใน Google Sheets ของคุณครับ

ให้ทำตามขั้นตอนง่ายๆ ดังนี้:

### 1. ใส่โค้ดตัวใหม่ลงใน Google Sheets
1. เปิดไฟล์ Google Sheets ของคุณ (ไฟล์เดิมที่สร้างไว้)
2. ไปที่เมนู **ส่วนขยาย (Extensions)** > **Apps Script**
3. ลบโค้ดเก่าที่มีอยู่ทิ้งให้หมด แล้วนำโค้ดด้านล่างนี้ไปวาง:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // เรียงลำดับข้อมูลให้ตรงกับคอลัมน์ใน Sheet
    var row = [
      new Date(), // วันที่และเวลา (Timestamp)
      data.groupNumber,
      data.area,
      data.currentStatus,
      data.problems,
      data.causes,
      data.obstacles,
      data.agency,
      data.activities
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2. สร้าง Webhook URL (สำคัญมาก!)
1. กดปุ่ม **การทำให้ใช้งานได้ (Deploy)** > **การทำให้ใช้งานได้รายการใหม่ (New deployment)** (ปุ่มสีฟ้ามุมขวาบน)
2. ตรง "เลือกประเภท" (ฟันเฟือง) ให้เลือก **แอปพลิเคชันเว็บ (Web app)**
3. ตั้งค่าดังนี้:
   - สิทธิ์เข้าถึง (Who has access): **ทุกคน (Anyone)** 
4. กด **การทำให้ใช้งานได้ (Deploy)**
5. *ระบบอาจให้ยืนยันอีเมลและสิทธิ์ ให้กดยืนยันให้ครบ*
6. คุณจะได้ **URL ของเว็บแอป (Web app URL)** หน้าตาประมาณ `https://script.google.com/macros/s/..../exec` 
7. **คัดลอก URL นี้ไว้!**

### 3. นำ URL มาใส่ในโค้ดเว็บไซต์
1. กลับมาที่โฟลเดอร์งานของคุณ เปิดไฟล์ `script.js`
2. เลื่อนลงมาหาบรรทัดที่ 59 ซึ่งเขียนว่า:
   `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_WEB_APP_URL';`
3. นำ URL ที่คัดลอกไว้ ไปแทนที่ข้อความ `YOUR_GOOGLE_SCRIPT_WEB_APP_URL` 
4. **บันทึกไฟล์** เป็นอันเสร็จสิ้น!

ตอนนี้เมื่อมีคนกด "บันทึกข้อมูล" ในหน้าเว็บ ข้อมูลจะพุ่งตรงเข้า Google Sheets ของคุณทันทีครับ!
