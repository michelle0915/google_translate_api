let textbox = null;

function createTextBox() {
    if (textbox) return textbox;

    let tb = $('<span>').css({
        padding: '5px',
        border: 'solid 2px #66d5da',
        borderRadius: '5px',
        background: '#fffd',
        position: 'absolute',
        zIndex: '99999',
        maxWidth: '500px',
        fontSize: '10pt',
    }).appendTo($('body')).hide();

    let selectBegin;
    let selectEnd;
    $('body').on('mousedown.ext', function(e) {
        selectBegin = {x: e.pageX, y: e.pageY};
        tb.hide();
    });
    $('body').on('mouseup.ext', function(e) {
        selectEnd = {x: e.pageX, y: e.pageY};
        tb
            .css({
                left: (Math.min(selectBegin.x, selectEnd.x) + 10) + 'px',
                top: (Math.max(selectBegin.y, selectEnd.y) + 30) + 'px',
            })

        if (window.getSelection) {
            let text = window.getSelection().toString();
            if(text !== '' && text !== '\n'){
                tb.text('...翻訳中...').show();

                chrome.runtime.sendMessage({
                    type: 'translate',
                    text: text
                }, function(res) {
                    tb.text(res.text)
                });
            }
        }
    });

    return tb;
}

function deleteTextBox() {
    textbox.remove();
    textbox = null;
    $('body').off('mousedown.ext mouseup.ext');
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.type) {
        case 'start':
            textbox = createTextBox();
            break;
        case 'shutdown':
            deleteTextBox();
            break;
    }
});

