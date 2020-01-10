let source = 'en';
let target = 'ja';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.type) {
        case 'getlang':
            sendResponse({
                source: source,
                target: target,
            })
            break;

        case 'setlang':
            source = msg.source;
            target = msg.target;
            break;

        case 'translate':
            let url = 'https://script.google.com/macros/s/AKfycbzXx3VMG8_i8zRr23p1EwYJbLmyJ75DDtmnfh1Y5Zz5dZYxfjqC/exec';
            let senddata = {
                text: msg.text,
                source: source,
                target: target
            };

            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(senddata),
                dataType: 'json'
            })
            .done(function(res) {
                sendResponse({text: res.text});
            })
            .fail(function(data) {
                console.log(data);
            })
            break;
    }

    return true;
});
