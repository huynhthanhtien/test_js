(function () {
    // Intercept XMLHttpRequest
    const open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url) {
        // console.log(`2 Request Intercepted! Method: ${method}, URL: ${url}`);

        // Kiểm tra URL có phải là URL mong muốn không
        // console.log(url);
        if (url === '/public/api/sch/w-locdstkbhockytheodoituong') {
            this.addEventListener('load', function () {
                try {
                    // Kiểm tra xem phản hồi có phải là JSON không
                    const jsonResponse = JSON.parse(this.responseText);
                    // console.log('JSON Response:', jsonResponse);

                    // Lưu hoặc xử lý file JSON nếu cần
                    xulydata(jsonResponse);
                    // downloadJson(jsonResponse);
                } catch (error) {
                    console.error('Response is not valid JSON', error);
                }
            });
        }
        
        open.apply(this, arguments);
    };

    // Hàm tải xuống file JSON
    function downloadJson(jsonData) {
        const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';  // Tên file JSON khi tải về
        a.click();
        URL.revokeObjectURL(url); // Giải phóng URL tạm thời
    }
})();


function EventICS(json){
    // console.log(json);
    const ma_mon = json.ma_mon;
    const title = json.ten_mon;
    const location = json.phong;
    const timeStart = json.tu_gio;
    const timeEnd = json.den_gio;
    const nhom_to = json.nhom_to;
    const date = json.tooltip;
    const gv = json.gv;

    const regex = /(\d{2})\/(\d{2})\/(\d{4})/g;
    const arrr = date.match(regex);
    // // console.log(arrr);
    const startDate = new Date(arrr[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    const endDate = new Date(arrr[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    // // console.log(startDate.toString(), endDate.toISOString());
    let kq = "";
    let newdate;

    for(newdate = startDate; newdate <= endDate; newdate.setDate(newdate.getDate() + 7)){

        const tkbStart = new Date(newdate);
        tkbStart.setHours(timeStart.split(':')[0], timeStart.split(':')[1]);
        
        const tkbEnd = new Date(newdate);
        tkbEnd.setHours(timeEnd.split(':')[0], timeEnd.split(':')[1]);

        // console.log(tkbStart.toString(), tkbEnd.toString());
        
        kq += `BEGIN:VEVENT\n`;
        kq += `SUMMARY:${title}\n`;
        kq += `LOCATION:${location}\n`;
        kq += `DESCRIPTION:Mã môn học: ${ma_mon}\\nNhóm tổ: ${nhom_to}\\nGiáo viên: ${gv}\n`;
        kq += `DTSTART:${tkbStart.toISOString().replace(/[-:]|(.000)/g, '')}\n`;
        kq += `DTEND:${tkbEnd.toISOString().replace(/[-:]|(.000)/g, '')}\n`;
        kq += `BEGIN:VALARM\n`;
        kq += `TRIGGER:-PT30M\n`;
        kq += `DESCRIPTION:${title}\n`;
        kq += `ACTION:DISPLAY\n`;
        kq += `END:VALARM\n`;
        kq += `END:VEVENT\n`;
        
    }
    return kq;
}

function xulydata(jsonData){
    let events = [];
    jsonData.data.ds_nhom_to.forEach(item => {
        events.push(item);
    });
    let icsContent = "";

    icsContent += `BEGIN:VCALENDAR\n`;
    icsContent += `VERSION:2.0\n`;
    icsContent += `PRODID:-//test//code//EN\n`;
    
    events.forEach(event => {
        icsContent += EventICS(event);
    });
    
    icsContent += `END:VCALENDAR\n`;

    // // console.log(icsContent);
    downloadICS(icsContent);
}

function downloadICS(content) {
    // Tạo Blob từ chuỗi ICS content
    // // console.log("downloadICS");   
    const blob = new Blob([content], { type: 'text/calendar' });

    // Tạo URL cho Blob
    const url = URL.createObjectURL(blob);

    // Tạo một thẻ <a> để tải xuống file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.ics';  // Đặt tên file .ics

    // Tự động click vào liên kết để tải file xuống
    link.click();

    // Giải phóng URL khi tải xong
    URL.revokeObjectURL(url);
}

console.log("run");

