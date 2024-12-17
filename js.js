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


function EventICS(json) {

    const arr_start_time = [
        "00:00",
        "07:00", "07:50", "09:00", "09:50", "10:40",  // Ca 1
        "13:00", "13:50", "15:00", "15:50", "16:40",  // Ca 2
        "17:40", "18:30", "19:20"  // Ca 3
    ];
    const arr_end_time = [
        "00:00",
        "07:50", "08:40", "09:50", "10:40", "11:30",  // Ca 1
        "13:50", "14:40", "15:50", "16:40", "17:30",  // Ca 2
        "18:30", "19:20", "20:10"  // Ca 3
    ];
    // console.log(json);
    const ma_mon = json.ma_mon;
    const title = json.ten_mon;
    const location = json.phong;
    // const timeStart = json.tu_gio;
    // const timeEnd = json.den_gio;
    const tbd = parseInt(json.tbd);
    const tkt = parseInt(json.tbd) + parseInt(json.so_tiet) - 1;
    // const sotiet = json.so_tiet;
    const nhom_to = json.nhom_to;
    const date = json.tooltip;
    const gv = json.gv;

    const regex = /(\d{2})\/(\d{2})\/(\d{4})/g;
    const arrr = date.match(regex);
    // // console.log(arrr);
    const startDate = new Date(arrr[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
    const endDate = new Date(arrr[1].replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));

    let kq = "";

    let newdate = startDate;

    const tkbStart = new Date(newdate);
    tkbStart.setHours(arr_start_time[tbd].split(':')[0], arr_start_time[tbd].split(':')[1]);

    const tkbEnd = new Date(newdate);
    tkbEnd.setHours(arr_end_time[tkt].split(':')[0], arr_end_time[tkt].split(':')[1]);

    endDate.setHours(23, 59);

    kq += `BEGIN:VEVENT\n`;
    kq += `SUMMARY:${title}\n`;
    kq += `LOCATION:${location}\n`;
    kq += `DESCRIPTION:Mã môn học: ${ma_mon}\\nNhóm tổ: ${nhom_to}\\nGiáo viên: ${gv}\n`;
    kq += `DTSTART:${tkbStart.toISOString().replace(/[-:]|(.000)/g, '')}\n`;
    kq += `DTEND:${tkbEnd.toISOString().replace(/[-:]|(.000)/g, '')}\n`;
    kq += `RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=${endDate.toISOString().replace(/[-:]|(.000)/g, '')}\n`;
    kq += `BEGIN:VALARM\n`;
    kq += `TRIGGER:-PT30M\n`;
    kq += `DESCRIPTION:${title}\n`;
    kq += `ACTION:DISPLAY\n`;
    kq += `END:VALARM\n`;
    kq += `END:VEVENT\n`;

    return kq;
}

function xulydata(jsonData) {
    let events = [];
    jsonData.data.ds_nhom_to.forEach(item => {
        events.push(item);
    });
    let icsContent = "";

    icsContent += `BEGIN:VCALENDAR\n`;
    icsContent += `VERSION:2.0\n`;
    icsContent += `PRODID: test_js\n`;

    events.forEach(event => {
        icsContent += EventICS(event);
    });

    icsContent += `END:VCALENDAR\n`;

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

    var newWindow = window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank');
    
    if (newWindow) {
        var checkInterval = setInterval(function() {
            if (newWindow.document.readyState === 'complete') {
                newWindow.alert("Kiểm tra tài khoản Google của bạn.");
                clearInterval(checkInterval);
            }
        }, 1000);
    } else {
        console.log('Tab mới không thể mở do bị chặn.');
    }
}

console.log("run");

