// init
chrome.runtime.sendMessage({
    type: 'getlang',
}, function(res) {
    $('#source').val(res.source);
    $('#target').val(res.target);
});

powershift('start');

// switch source <--> target
$('#switch').on('click', function() {
    let newSource = $('#target').val();
    let newTarget = $('#source').val();
    $('#source').val(newSource);
    $('#target').val(newTarget);

    setLanguage();
});

//let debounce = function(interval, fn) {
//    let timer;
//    return function(e) {
//        clearTimeout(timer);
//        timer = setTimeout(function() {
//            fn(e);
//        }, interval);
//    };
//};
function setLanguage() {
    chrome.runtime.sendMessage({
        type: 'setlang',
        source: $('#source').val(),
        target: $('#target').val()
    });
}
$('#source, #target').on('change', function(e) {
    // sourceとtargetが重複した場合、入れ替え
    if ($('#source').val() === $('#target').val()) {
        chrome.runtime.sendMessage({
            type: 'getlang',
        }, function(res) {
            $('#source').val(res.target);
            $('#target').val(res.source);
            setLanguage();
        });
    } else {
        setLanguage();
    }
});

// on: command = 'start', off: command = 'shutdown'
function powershift(command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: command
        });
    });
}

$('#power').on('change', function() {
    if ($('#power').is(':checked')) {
        $('#power-status').text('ON');
        powershift('start');
    } else {
        $('#power-status').text('OFF');
        powershift('shutdown');
    }
})
