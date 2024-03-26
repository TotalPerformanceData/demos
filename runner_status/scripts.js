jQuery(document).ready(() => {
    const public_api = "/json-rpc/v2";
    if (RunnerStatus.DEBUG) {
        $("#version").text(`v.${RunnerStatus.VERSION}`);
}
    const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
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

    $('#sharecode').on('keydown', (e) => {
        if (e.keyCode == 13) {
            $('#load').click();
        }
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
                $('#samples').append(data.races.map(r => $('<div>').addClass('live').text(`${timeRaceFormat.format(new Date(r.date_formatted))} ${r.venue} ${r.obstacle}`).on('click', () => $('#sharecode').val(r.sc))));
            }
        }
        $('#samples').append(Object.entries(demo).map(([sc, r]) => $('<div>').addClass('demo').text(r).on('click', () => $('#sharecode').val(sc))));
    }

    $('#speed').on('change', () => {
        if (component?.type == 'Historic') {
            component?.setSpeed(parseInt($('#speed').val()))
        }
    }).trigger('change');

    $('#load').on('click', async () => {
        if (component) {
            conponent = null;
        }
        component = await RunnerStatus.create('#container', $('#sharecode').val());
        if (component) {
            $("#stp").parent().toggle(component.type != 'Live');
            $("#speed").parent().toggle(component.type != 'Live');
            component.onStatusChange = (status) => {
                $("#sharecode").attr('disabled', status == RunnerStatus.PlayerStatus.RUNNING);
                $("#stp").attr('disabled', status == RunnerStatus.PlayerStatus.RUNNING);
            }
            $('#speed').trigger('change');
        }
    }).trigger('click')

    init();

})



