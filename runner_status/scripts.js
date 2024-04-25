jQuery(document).ready(() => {
    const public_api = "/json-rpc/v2";
    if (RunnerStatus.DEBUG) {
        $("#version").text(`v.${RunnerStatus.VERSION}`);
    }
    const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric'
    });

    const demo = {
        '47202403161715': 'Southwell, Sat Mar 16 2024, Flat',
        '35202403231930': 'Newc, Sat Mar 23 2024, Flat',
        '58202403162030': 'Wolv, Sat Mar 16 2024, Flat',
        '30202403221442': 'Ling, Fri Mar 22 2024, Flat',
        '01202310211625': 'Ascot, 21 Oct 15:25 2023, Flat',
        '94202403231329': 'Santa Anita, Sat Mar 23 2024, Flat',
        '71202403091315': 'Golden Gate, Sat Mar 09 2024, Flat',
        '47202403141637': 'Southwell, Thu Mar 14 2024, Flat',
        '30202403221342': 'Ling, Fri Mar 22 2024, Flat',
        '14202403241505': 'Donc, Sun Mar 24 2024, Flat',
        '01202403241445': 'Ascot, Sun Mar 24 2024, Hurdle',
    };

    let component = null;

    const load = async (sc) => {
        $('#samples').hide();
        if (component) {
            conponent = null;
        }
        $(`#samples div`).removeClass('selected');
        if (sc) {
            $('#sharecode').val(sc);
            $(`#samples div[sc=${sc}]`).addClass('selected');
            component = await RunnerStatus.create('#container', sc);
            if (component) {
                //$("#stp").parent().toggle(component.type != 'Live');
                $("#speed").parent().toggle(component.type != 'Live');
                component.onStatusChange = (status) => {
                    $("#sharecode").attr('disabled', status == RunnerStatus.PlayerStatus.RUNNING);
                    $("#stp").attr('disabled', status == RunnerStatus.PlayerStatus.RUNNING);
                }
                $('#speed').trigger('change');
            }
        }
    }



    $('#sharecode').on('keydown', (e) => {
        if (e.keyCode == 13) {
            window.location.hash = `#${$('#sharecode').val()}`;
        }
    }).on('paste', (e) => {
        window.location.hash = `#${e.originalEvent.clipboardData.getData('text')}`;
    }).on('click', () => {
        $('#samples').show();
    }).on('focus', () => {
        $('#samples').show();
    }).on('blur', () => {
        window.setTimeout(() => $('#samples').hide(), 100);
    })

    const init = async () => {
        const response = await fetch(`${public_api}/status/?date=now`);
        if (response.status == 200) {
            data = await response.json();
            if (data?.races) {
                $('#samples').append(data.races.map(r => $('<a>')
                    .addClass('live')
                    .attr('sc', r.sc)
                    .text(`${timeRaceFormat.format(new Date(r.date_formatted))} ${r.venue} ${r.obstacle}`)
                    .attr('href', `#${r.sc}`)
                ));
            }
        }
        $('#samples').append(Object.entries(demo).map(([sc, r]) => $('<a>')
            .addClass('demo').text(r)
            .attr('sc', sc)
            .attr('href', `#${sc}`)
        ));
        const m = window.location.hash.match(/^#(\w\w\d{12})$/);
        if (m?.[1]) {
            load(m?.[1])
        } else {
            window.location.hash = `#${data.races[0].sc}`;
        }
    }

    $('#speed').on('change', () => {
        if (component?.type == 'Historic') {
            component?.setSpeed(parseInt($('#speed').val()))
        }
    }).trigger('change');

    $('#load').on('click', () => { load($('#sharecode').val()) });

    $(window).on('hashchange', function () {
        const m = window.location.hash.match(/^#(\w\w\d{12})$/);
        if (m && m[1]) {
            load(m[1]);
        }
    })

    init();

})



