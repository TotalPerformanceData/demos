jQuery(document).ready(() => {
    const public_api = "/json-rpc/v2";
    $("#version").text(RunnerStatus.VERSION);
    const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
        timeZone: 'UTC'
    });

    const demo = {
        '35202310021830': 'Newc 2 Oct 17:30 Flat',
        '96202311191318': 'Aqueduct 19 Nov 18:18 Flat',
        '30202402021620': 'Ling 2 Feb 16:20 Flat',
        '04202310021602': 'Bath 2 Oct 15:02 Flat',
        '01202310211625': 'Ascot 21 Oct 15:25 Flat',
        '19202311191230': 'Font 19 Nov 12:30 Jump',
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
    })

    init();

})



