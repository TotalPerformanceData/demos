const timeRaceFormat = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric'
}).format;

relativeTimeFormat = (mseconds) => `${mseconds < 0 ? '-' : ''}${new Date(Math.abs(mseconds)).toLocaleTimeString('en-GB', {
    timeZone: 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
})}`;

const STATUSES = {
    SD: 'Saddling',
    PR: 'Parading',
    GD: 'Going Down',
    AP: 'At the Post',
    GB: 'Going Behind',
    LG: 'Loading',
    LD: 'Loading',
    R: 'Running'
};

class Countries {
    #countries = {};
    $container = null;
    constructor($c, onSwitched) {
        this.$container = $c;
        this.$container.on('switched', onSwitched);
    }

    isOne() {
        return Object.keys(this.#countries).length == 1;
    }

    isShown(code) {
        if (this.isOne()) return true;
        const cached = localStorage.getItem(`rsc_${code}`);
        return cached ? (cached == 'true') : true;
    }

    update() {
        this.$container.trigger('switched').toggle(!this.isOne());
        Object.entries(this.#countries).forEach(([code, c]) => c.removeClass('shown').addClass(this.isShown(code) ? 'shown' : 'a'))
    }

    add(code) {
        if (!this.#countries[code]) {
            const that = this;
            this.#countries[code] = $('<li>')
                .addClass(`fi fi-${code?.toLowerCase()}`)
                .attr('title', code)
                .on('click', function () {
                    localStorage.setItem(`rsc_${code}`, !that.isShown(code) ? 'true' : 'false')
                    $(this).removeClass('shown').addClass(that.isShown(code) ? 'shown' : '');
                    that.update();
                })
            this.$container.append(this.#countries[code]);
        }
    }
}

class Race {
    #status = 'pending';
    constructor(data) {
        this.sc = data.sc;
        console.debug(`New race ${data.sc}`);
        this.lastSeen = { api: new Date().getTime(), stream: new Date().getTime() };
        this.P = false;
        this.start = new Date(data.date_formatted);
        this.$container = $('<li>').addClass('race').attr('sc', data.sc).data('time', this.start).attr('country', data.country);
        this.$time = $('<div>').addClass('time').text(timeRaceFormat(this.start));
        this.$name = $('<div>').addClass('name').text(`${data.venue} - ${data.distance?.replace(/(^|\s)0[mfy]/g, '')}${data.obstacle == 'Flat' ? ' - Flat' : ''}`);
        this.$country = $('<div>').addClass(`country fi fi-${data.country?.toLowerCase()}`).attr('title', data.country);
        this.$progress = $('<div>').addClass('progress').text('');
        this.$status = $('<div>').addClass('status').text(this.status);
        this.$container.append(this.$time, this.$country, this.$name, this.$progress, this.$status);
        this.update(data);
    }

    get status() { return this.#status }
    set status(val) {
        if (this.#status != val) {
            this.#status = val;
            console.info(`Race ${this.sc} is ${this.#status}`)
        }
    }

    delete() {
        console.info(`Deleting race ${this.sc}`);
        this.$container.removeClass('appearing').addClass('deleting');
        window.setTimeout((() => {
            this.$container.remove();
        }), 1000)
    }

    toggle(show) {
        this.$container.toggle(show);
    }

    update(d) {
        let statusText = null;
        const now = new Date().getTime();
        if (Object.hasOwn(d, 'sc_estimated')) {
            this.lastSeen.api = now;
            if (this.status == 'pending' || ((now - this.lastSeen.stream) > 5 * 1000)) {
                if (now - this.start?.getTime() > 15 * 60 * 1000) {
                    if (this.status == 'pending') {
                        this.status = 'deleted';
                    } else if (this.status != 'deleted') {
                        this.status = 'deleting';
                        this.$container.fadeOut(3000, 'swing', () => {
                            this.status = 'deleted';
                            this.$container.attr('status', 'deleted');
                        });
                    }
                } else if (now - this.start?.getTime() > 60 * 1000) {
                    this.status = 'finished';
                } else if (d.sc_estimated == 0) {
                    this.status = 'waiting';
                } else if (d.r1_mtp && d.r1_mtp < 30) {
                    this.status = 'canceled';
                }
                statusText = this.status;
            }
        } else if (Object.hasOwn(d, 'R')) {
            this.lastSeen.stream = now;
            let perc = 0;
            let text = '';
            if (!this.P) {
                this.P = d.P;
            }
            if ((d.P != false && d.P == 0) || d.RS == 'RF') {
                this.status = 'finished';
                text = relativeTimeFormat(d.R * 1000);
                statusText = this.status;
            } else if (d.R > 0 || d.RS == 'IP') {
                this.status = 'running';
                statusText = this.status;
                perc = Math.round(100 - 100 * (d.P / this.P));
                text = relativeTimeFormat(d.R * 1000);
            } else if (d.LD != false) {
                this.status = 'loading';
                perc = parseInt(d.LD);
                text = `${perc}%`;
                statusText = this.status;
            } else {
                statusText = STATUSES[d.MS] ?? 'live';
                this.status = 'live';
                text = relativeTimeFormat(this.start?.getTime() - now);
            }
            if (d.W) {
                this.status = 'warning';
                statusText = d.W.join(', ');
                console.warn(`${this.sc}: ${statusText}`);
            }
            this.$progress.text(text).css('--perc', `${perc}%`);

        }
        this.$container.attr('status', this.status);
        if (statusText) {
            this.$status.text(statusText);
        }
    }
}

class RacesStatus {
    static API_URL = "/json-rpc/v2";
    static DEBUG = window.location.host.match(/stg/);
    static WS_URL = `wss://stream.tpd.zone/streaming_server`;
    static WS_ZONE = 'zone_1_4';
    static VERSION = `2024.04.23${RacesStatus.DEBUG ? '-dev' : ''}`;
    races = {};
    countries = new Countries($('#countries'), () => { // when countries visibility is changed
        let shown = 0;
        Object.entries(this.races).forEach(([sc, r]) => {
            const sh = this.countries.isShown(r.$container.attr('country')) && r.status != 'deleting' && r.status != 'deleted';
            if (sh) shown++;
            r.toggle(sh)
        });
        this.$container.removeClass('empty').addClass(shown ? '' : 'empty')
    });

    constructor($o) {
        console.info(`Races Status v.${RacesStatus.VERSION}`);
        $('h1 .version').text(RacesStatus.VERSION);
        this.$container = $('<ul>').attr('id', 'races');
        $o.append(this.$container);
        this.update();
        this.interval = window.setInterval(this.update.bind(this), 60 * 1000);
        this.startWS();
    }

    startWS() {
        console.debug('Connecting to WS');
        if (!this.ws) {
            this.ws = new WebSocket(RacesStatus.WS_URL);
            this.ws.onopen = (event) => {
                console.info('Connected to WS');
                this.ws.send(JSON.stringify([RacesStatus.WS_ZONE]));
            }
            this.ws.onclose = (event) => {
                console.warn('WS closed');
                this.ws = null
                setTimeout(() => {
                    this.startWS();
                }, 3000);
            }
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data) ?? { [RacesStatus.WS_ZONE]: {} };
                $.each(data[RacesStatus.WS_ZONE], (sc, d) => {
                    const race = this.races[sc];
                    if (race) {
                        race.update(d);
                    }
                })
            }
        }
    }

    sortRaces() {
        this.$container.append(Object.values(this.races).sort((a, b) => +a.$container.data('time').getTime() - b.$container.data('time').getTime()).map(i => i.$container));
    }

    delete(r) {
        r.delete();
        delete this.races[r.sc];
    }

    async update() {
        try {
            const response = await fetch(`${RacesStatus.API_URL}/status/?date=now`);
            if (response.status == 200) {
                const data = await response.json();
                console.info(`Got ${data.races?.length} races`);
                (data?.races ?? []).forEach(i => {
                    if (!this.races[i.sc]) {
                        if (RacesStatus.DEBUG) i.country = Math.random() > 0.3 ? (Math.random() > 0.5 ? 'GB' : 'AE') : i.country;
                        const race = new Race(i);
                        this.races[i.sc] = race;
                        this.$container.append(race.$container);
                        this.countries.add(i.country);
                    }
                    this.races[i.sc].update(i);
                });
                this.sortRaces();
                this.countries.update();
            } else {
                console.error(response.statusText);
            }
        } catch (err) {
            console.error(err.message);
        }
    }
}

jQuery(document).ready(() => {
    const widget = new RacesStatus($('#container'));

});